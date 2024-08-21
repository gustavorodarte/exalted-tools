const { Client, LogLevel } = require('@notionhq/client');
const pipe = require('crocks/helpers/pipe');
const { omit } = require('crocks/helpers');
const getProp = require('crocks/Maybe/getProp');
const { map, chain } = require('crocks/pointfree');
const maybeToArray = require('crocks/Maybe/maybeToArray');
const log = require('../lib/log');

// pickFirst :: [] -> a
const pickFirst = ({ 0: result }) => result;

const mapAssetsProps = map(({
  Military,
  Wealth,
  Reach,
  Influence,
  Sovereignty,
}) => ({
  military: Military.number,
  wealth: Wealth.number,
  reach: Reach.number,
  influence: Influence.number,
  sovereignty: Sovereignty.number,
}));

const mapAssets = pipe(pickFirst, getProp('properties'), map(omit(['Nome'])), mapAssetsProps, maybeToArray, pickFirst);
const mapOrganizationName = pipe(getProp('title'), map(pickFirst), log, chain(getProp('plain_text')), maybeToArray, pickFirst);

const notionService = () => {
  const notion = new Client({
    auth: process.env.NOTION_KEY,
    logLevel: LogLevel.DEBUG,
  });

  return {
    createGetMandateAssets: (organizationDatabaseId) => async () => {
      const getAssets = notion.databases.query({
        filter: {
          property: 'Nome',
          title: {
            is_not_empty: true,
          },
        },
        database_id: organizationDatabaseId,
      });

      const getName = notion.databases.retrieve({
        database_id: organizationDatabaseId,
      });

      const [assetsResponse, nameResponse] = await Promise.all([getAssets, getName]);

      return {
        name: mapOrganizationName(nameResponse),
        assets: mapAssets(assetsResponse.results),
      };
    },
  };
};

module.exports = notionService;
