const { cosmiconfigSync } = require("cosmiconfig");
const constants = require("./constants");

/**
 * Get prettier options from user's project or return the default one
 * @return {import('prettier').Options} Prettier options
 */
function getPrettierOptions() {
  const prettier = cosmiconfigSync("prettier").search();

  if (prettier) {
    return {
      ...prettier.config,
      parser: "typescript",
    };
  }

  return constants.PRETTIER_OPTIONS;
}

module.exports = {
  getPrettierOptions,
};
