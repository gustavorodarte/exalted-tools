// const pipe = require('crocks/helpers/pipe');
// const { omit } = require('crocks/helpers');
// const getProp = require('crocks/Maybe/getProp');
// const log = require('../../lib/log');

const startMandate = (getMandateAssets) => async () => {
  const result = await getMandateAssets();

  return `Iniciando Mandate para a ${result.name} os assets são: Reach: ${result.assets.reach}, Military: ${result.assets.military}, Wealth: ${result.assets.wealth}, Influence: ${result.assets.influence}, Sovereignty: ${result.assets.sovereignty}`;
};

module.exports = {
  startMandate,
};
