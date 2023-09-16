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

async function addNotionPageToDatabase(databaseId, customPayload) {
  const newPage = await notion.pages.create({
    parent: {
      database_id: databaseId,
    },
    ...customPayload,
  });
  console.log(newPage);
}

const execute = async () => {
  const payload = charmsJson.map((charm) => {
    const properties = {
      title: {
        type: "title",
        title: [{ type: "text", text: { content: charm.title } }],
      },
      Ability: {
        type: "multi_select",
        multi_select: [{ name: charm.ability }],
      },
      Cost: {
        type: "rich_text",
        rich_text: [{ type: "text", text: { content: charm.cost } }],
      },
      Mins: {
        type: "rich_text",
        rich_text: [{ type: "text", text: { content: charm.mins } }],
      },
      Type: {
        type: "rich_text",
        rich_text: [{ type: "text", text: { content: charm.type } }],
      },
      Keywords: {
        type: "multi_select",
        multi_select: charm.keywords
          .split(", ")
          .map((keyword) => ({ name: keyword })),
      },
      Duration: {
        type: "multi_select",
        multi_select: [{ name: charm.duration }],
      },
      "Prerequisite Charms": {
        type: "rich_text",
        rich_text: [
          { type: "text", text: { content: charm.prerequisiteCharms } },
        ],
      },
    };

    const children = [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content: charm.description,
              },
            },
          ],
        },
      },
    ];

    return {
      properties,
      children,
    };
  });

  for (let i = 0; i < payload.length; i++) {
    // Add a few new pages to the database that was just created
    await addNotionPageToDatabase(
      "3a922ee144bd4bcf9b43f21688410374",
      payload[i]
    );
  }
};

execute();
