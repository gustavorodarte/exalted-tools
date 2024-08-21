/* eslint-disable fp/no-unused-expression */
const { InteractionResponseType } = require('discord-interactions');
const { startMandate } = require('./mandate');

const notionService = require('../../services/notion');

const userDatabaseIdMap = {
  '.mykavykos': '33d0c5d6cddb44258dc9391dd7b233a1',
  thussubasa: '54c285e19086447f8a511524ba13f3ca',
  denise_carneiro: '7ee8af4c4ff54ec1ba2876429f9a0b42',
  f_neves: '667ae7fba5f84d0f8e39d4ce84030901',
  bunnyqueen_: '54c285e19086447f8a511524ba13f3ca',
  vinnydd: 'aafd741ffa0445aaa126959f39b5883d',
};

const sendCommandResponse = (response, content) => {
  const defaultMessage = {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      tts: false,
      content,
      embeds: [],
      allowed_mentions: { parse: [] },
    },
  };
  return response.status(200).send(defaultMessage);
};

const mandateCommand = async ({ content, userName, response }) => {
  const organizationDatabaseId = userDatabaseIdMap[userName];

  const { createGetMandateAssets } = notionService();

  const getMandateAssets = createGetMandateAssets(organizationDatabaseId);

  const result = await startMandate(getMandateAssets)();

  return sendCommandResponse(response, JSON.stringify((result)), content);
};

module.exports = {
  mandateCommand,
};
