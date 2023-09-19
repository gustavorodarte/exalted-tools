const charmsJson = require("../../resources/Charm.json");
const fs = require("fs");

const castes = [
  "DAWN CASTE",
  "ZENITH CASTE",
  "NIGHT CASTE",
  "ECLIPSE CASTE",
  "TWILIGHT",
];
const abilities = [
  "Archery",
  "Athletics",
  "Awareness",
  "Bureaucracy",
  "Craft",
  "Dodge",
  "Integrity",
  "Investigation",
  "Larceny",
  "Linguistics",
  "Lore",
  "Martial Arts",
  "Medicine",
  "Melee",
  "Occult",
  "Performance",
  "Presence",
  "Resistance",
  "Ride",
  "Sail",
  "Socialize",
  "Stealth",
  "Survival",
  "Thrown",
  "War",
].map((ability) => ability.toUpperCase());

const sectionTitles = [...castes, ...abilities];

const charmsSplitted = Array.from(charmsJson).reduce((charmsText, line) => {
  const isStartOfNewCharm = line.includes("\n\n");

  const lineWithoutSectionTitles = sectionTitles.reduce(
    (charmLine, sectionTitle) => {
      return charmLine.replaceAll(sectionTitle, "");
    },
    line
  );

  if (!isStartOfNewCharm) {
    const lastCharm = charmsText.pop();

    return [...charmsText, [...lastCharm, lineWithoutSectionTitles]];
  }

  return [...charmsText, [lineWithoutSectionTitles]];
}, []);

const charmsMapped = charmsSplitted.map((charmInfo) => {
  // const title = charmInfo[0]?.replaceAll("\n", "");

  const [oldTitle, ...restOfString] = charmInfo[0]
    ?.replaceAll("\n", "")
    .split(/(?=[a-z])/);

  const [origin, note] = [oldTitle[oldTitle.length - 1], ...restOfString]
    .join("")
    .split(" (");
  const title = oldTitle.slice(0, -1);

  return {
    ability: charmInfo[2]?.replaceAll("Mins: ", "").split(" ")[0],
    title,
    origin,
    note: note?.slice(0, -1),
    cost: charmInfo[1]?.replaceAll("Cost: ", ""),
    mins: charmInfo[2]?.replaceAll("Mins: ", ""),
    type: charmInfo[3]?.replaceAll("Type: ", ""),
    keywords: charmInfo[4]?.replaceAll("Keywords: ", ""),
    duration: charmInfo[5]?.replaceAll("Duration: ", ""),
    prerequisiteCharms: charmInfo[6]
      ?.replaceAll("Prerequisite Charms: ", "")
      .split("\n")[0],
    description: charmInfo[6]
      ?.replaceAll("Prerequisite Charms: ", "")
      .split("\n")[1],
  };
});

const charmsCorrectedParsed = charmsMapped.filter(
  (charm) =>
    charm.title &&
    charm.cost &&
    charm.mins &&
    charm.type &&
    charm.keywords &&
    charm.duration &&
    charm.prerequisiteCharms &&
    charm.description &&
    charm.ability
);

const charmsInCorrectedParsed = charmsMapped.filter(
  (charm) =>
    !(
      charm.title &&
      charm.cost &&
      charm.mins &&
      charm.type &&
      charm.keywords &&
      charm.duration &&
      charm.prerequisiteCharms &&
      charm.description &&
      charm.ability
    )
);

fs.writeFileSync("charms.json", JSON.stringify(charmsCorrectedParsed));
fs.writeFileSync(
  "IncorrectCharms.json",
  JSON.stringify(charmsInCorrectedParsed)
);
