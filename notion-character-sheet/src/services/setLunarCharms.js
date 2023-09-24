const { Client } = require("@notionhq/client");
const charmsJson = require("../../resources/LunarCharms.json");
const knacksJson = require("../../resources/LunarCharms.json");

console.log(
  "🚀 ~ file: index.js:6 ~ process.env.NOTION_KEY",
  process.env.NOTION_KEY
);
const notion = new Client({
  auth: process.env.NOTION_KEY,
});

const databaseId = process.env.NOTION_DATABASE_ID;

const AttributeEmojiMap = {
  Strength: "💪",
  Dexterity: "🤸‍♂️",
  Stamina: "🏃",
  Charisma: "😀",
  Manipulation: "🤥",
  Appearance: "🙆‍♀️",
  Perception: "🧐",
  Intelligence: "🧠",
  Wits: "🤔",
};

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
  const lunarCharmsWithAttributes = charmsJson.map((charm) => ({
    ...charm,
    attribute: charm.mins.split(" ")[0],
  }));

  const payload = lunarCharmsWithAttributes.map((charm) => {
    const properties = {
      title: {
        type: "title",
        title: [{ type: "text", text: { content: charm.title } }],
      },
      Attribute: {
        type: "multi_select",
        multi_select: [{ name: charm.attribute }],
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
      "Origin Book": {
        type: "multi_select",
        multi_select: [{ name: charm.origin }],
      },
      Note: {
        type: "multi_select",
        multi_select: [{ name: charm.note || "None" }],
      },
      "Prerequisite Charms": {
        type: "rich_text",
        rich_text: [
          { type: "text", text: { content: charm.prerequisiteCharms } },
        ],
      },
    };

    const children =
      charm.description.length <= 2000
        ? [
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
          ]
        : [
            {
              object: "block",
              type: "paragraph",
              paragraph: {
                rich_text: [
                  {
                    type: "text",
                    text: {
                      content: charm.description.slice(0, 2000),
                    },
                  },
                ],
              },
            },
            {
              object: "block",
              type: "paragraph",
              paragraph: {
                rich_text: [
                  {
                    type: "text",
                    text: {
                      content: charm.description.slice(2000),
                    },
                  },
                ],
              },
            },
          ];

    const icon = {
      emoji: AttributeEmojiMap[charm.attribute] || "🌕",
    };

    return {
      properties,
      children,
      icon,
    };
  });

  for (let i = 0; i < payload.length; i++) {
    // Add a few new pages to the database that was just created
    await addNotionPageToDatabase(databaseId, payload[i]);
  }
};

execute();
