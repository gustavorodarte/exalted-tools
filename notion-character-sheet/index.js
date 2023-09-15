const { Client } = require("@notionhq/client");
const charmsJson = require("./charms.json");

console.log(
  "🚀 ~ file: index.js:6 ~ process.env.NOTION_KEY",
  process.env.NOTION_KEY
);
const notion = new Client({
  auth: process.env.NOTION_KEY,
});

const databaseId = process.env.NOTION_DATABASE_ID;

const getPage = async () => {
  try {
    const { results, next_cursor } = await notion.databases.query({
      database_id: "06288a1faf9f4ed59e9b967e784049d8",
    });
    console.log("🚀 ~ file: index.js:19 ~ getPage ~ results", results);

    const response = await notion.pages.properties.retrieve({
      page_id: "06288a1faf9f4ed59e9b967e784049d8",
    });
    console.log(response);
    console.log("Success! Entry added.");
  } catch (error) {
    console.error(error.body);
  }
};

const postDatabase = async (properties) => {
  const result = await notion.databases.update({
    parent: {
      page_id: "ecbb03a3ab7b428e9a8fb8818437917e",
    },
    properties: ''
  });

  return result;
};

const execute = async () => {
  const properties = charmsJson.map((charm) => {
    return {
      title: {
        rich_text: charm.title,
      },
      cost: {
        rich_text: charm.cost,
      },
      mins: {
        rich_text: charm.mins,
      },
      type: {
        rich_text: charm.type,
      },
      keywords: {
        rich_text: charm.keywords,
      },
      duration: {
        rich_text: charm.duration,
      },
      prerequisiteCharms: {
        rich_text: charm.prerequisiteCharms,
      },
      description: {
        rich_text: charm.description,
      },
    };
  });

  const result = await postDatabase(properties);
  console.log("🚀 ~ file: index.js:74 ~ execute ~ result:", result);
};

execute();