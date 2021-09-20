const { generateApiForTest } = require("../../helpers/generateApiForTest");
const { resolve } = require("path");
const validateGeneratedModule = require("../../helpers/validateGeneratedModule");
const createSchemaInfos = require("../../helpers/createSchemaInfos");

const schemas = createSchemaInfos({ absolutePathToSchemas: resolve(__dirname, "./") });

schemas.forEach(({ absolutePath, apiFileName }) => {
  generateApiForTest({
    testName: "--patch option test",
    silent: true,
    name: apiFileName,
    input: absolutePath,
    output: resolve(__dirname, "./"),
    patch: true,
  }).then(() => {
    validateGeneratedModule(resolve(__dirname, `./${apiFileName}`));
  });
});
