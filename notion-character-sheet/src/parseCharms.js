const charmsJson = require("../resources/Charm.json");
const fs = require('fs');

const charmSplitted = {
  title: "\n\n",
  cost: "Cost",
  mins: "Mins",
  type: "Type",
  keywords: "Keywords",
  duration: "Duration",
  prerequisiteCharms: "Prerequisite Charms",
};

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
    title: charmInfo[0]?.replaceAll('\n', ''),
    cost: charmInfo[1]?.replaceAll('Cost: ', ''),
    mins: charmInfo[2]?.replaceAll('Mins: ', ''),
    type: charmInfo[3]?.replaceAll('Type: ', ''),
    keywords: charmInfo[4]?.replaceAll('Keywords: ', ''),
    duration: charmInfo[5]?.replaceAll('Duration: ', ''),
    prerequisiteCharms: charmInfo[6]?.replaceAll('Prerequisite Charms: ', '').split('\n')[0],
    description: charmInfo[6]?.replaceAll('Prerequisite Charms: ', '').split('\n')[1],
  };
});


fs.writeFileSync('charms.json', JSON.stringify(charmsMapped));