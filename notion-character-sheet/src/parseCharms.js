const charmsJson = require("../resources/Charm.json");
const fs = require("fs");

const charmsSplitted = Array.from(charmsJson).reduce((acc, curr) => {
  const isStartOfNewCharm = curr.includes("\n\n");

  if (!isStartOfNewCharm) {
    const lastCharm = acc.pop();

    return [...acc, [...lastCharm, curr]];
  }

  return [...acc, [curr]];
}, []);

const charmsMapped = charmsSplitted.map((charmInfo) => {
  return {
    ability: charmInfo[2]?.replaceAll("Mins: ", "").split(" ")[0],
    title: charmInfo[0]?.replaceAll("\n", ""),
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
