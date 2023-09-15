const { Client } = require("@notionhq/client");

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

getPage();
