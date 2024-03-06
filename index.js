#!/usr/bin/env node

// Copyright (c) 2019-present acacode
// Node module: swagger-typescript-api
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
// Repository https://github.com/acacode/swagger-typescript-api

const { version, name } = require('./package.json');
const { cli } = require('./cli');
const { generateApi, generateTemplates } = require('./src');
const { HTTP_CLIENT } = require('./src/constants');
const { resolve } = require('path');
const { CodeGenConfig } = require('./src/configuration');
const {
  TemplatesGenConfig,
} = require('./src/commands/generate-templates/configuration');

const codeGenBaseConfig = new CodeGenConfig({});
const templateGenBaseConfig = new TemplatesGenConfig({});

const program = cli({
  name: name,
  alias: 'sta',
  version: version,
  description:
    'Generate api via swagger scheme.\nSupports OA 3.0, 2.0, JSON, yaml.',
  options: [
    {
      flags: '-p, --path <string>',
      description: 'path/url to swagger scheme',
      required: true,
    },
    {
      flags: '-o, --output <string>',
      description: 'output path of typescript api file',
      default: './',
    },
    {
      flags: '-n, --name <string>',
      description: 'name of output typescript api file',
      default: codeGenBaseConfig.fileName,
    },
    {
      flags: '-t, --templates <string>',
      description: 'path to folder containing templates',
    },
    {
      flags: '-d, --default-as-success',
      description:
        'use "default" response status code as success response too.\n' +
        'some swagger schemas use "default" response status code as success response type by default.',
      default: codeGenBaseConfig.defaultResponseAsSuccess,
      internal: { name: 'defaultResponseAsSuccess' },
    },
    {
      flags: '-r, --responses',
      description:
        'generate additional information about request responses\n' +
        'also add typings for bad responses',
      default: codeGenBaseConfig.generateResponses,
      internal: { name: 'generateResponses' },
    },
    {
      flags: '--union-enums',
      description: 'generate all "enum" types as union types (T1 | T2 | TN)',
      default: codeGenBaseConfig.generateUnionEnums,
      internal: { name: 'generateUnionEnums' },
    },
    {
      flags: '--add-readonly',
      description: 'generate readonly properties',
      default: codeGenBaseConfig.addReadonly,
    },
    {
      flags: '--route-types',
      description: 'generate type definitions for API routes',
      default: codeGenBaseConfig.generateRouteTypes,
      internal: { name: 'generateRouteTypes' },
    },
    {
      flags: '--no-client',
      description: 'do not generate an API class',
      default: codeGenBaseConfig.generateClient,
    },
    {
      flags: '--enum-names-as-values',
      description:
        "use values in 'x-enumNames' as enum values (not only as keys)",
      default: codeGenBaseConfig.enumNamesAsValues,
    },
    {
      flags: '--extract-request-params',
      description:
        'extract request params to data contract (Also combine path params and query params into one object)',
      default: codeGenBaseConfig.extractRequestParams,
      internal: { formatter: Boolean },
    },
    {
      flags: '--extract-request-body',
      description: 'extract request body type to data contract',
      default: codeGenBaseConfig.extractRequestBody,
      internal: { formatter: Boolean },
    },
    {
      flags: '--extract-response-body',
      description: 'extract response body type to data contract',
      default: codeGenBaseConfig.extractResponseBody,
      internal: { formatter: Boolean },
    },
    {
      flags: '--extract-response-error',
      description: 'extract response error type to data contract',
      default: codeGenBaseConfig.extractResponseError,
      internal: { formatter: Boolean },
    },
    {
      flags: '--extract-responses',
      description: 'extract all responses described in /components/responses',
      default: codeGenBaseConfig.extractResponses,
      internal: { formatter: Boolean },
    },
    {
      flags: '--modular',
      description:
        'generate separated files for http client, data contracts, and routes',
      default: codeGenBaseConfig.modular,
      internal: { formatter: Boolean },
    },
    {
      flags: '--js',
      description: 'generate js api module with declaration file',
      default: codeGenBaseConfig.toJS,
      internal: { formatter: Boolean, name: 'toJS' },
    },
    {
      flags: '--module-name-index <number>',
      description:
        'determines which path index should be used for routes separation (example: GET:/fruites/getFruit -> index:0 -> moduleName -> fruites)',
      default: codeGenBaseConfig.moduleNameIndex,
      internal: { formatter: (moduleNameIndex) => +moduleNameIndex || 0 },
    },
    {
      flags: '--module-name-first-tag',
      description: 'splits routes based on the first tag',
      default: codeGenBaseConfig.moduleNameFirstTag,
    },
    {
      flags: '--disableStrictSSL',
      description: 'disabled strict SSL',
      default: codeGenBaseConfig.disableStrictSSL,
      internal: { formatter: Boolean },
    },
    {
      flags: '--disableProxy',
      description: 'disabled proxy',
      default: codeGenBaseConfig.disableProxy,
      internal: { formatter: Boolean },
    },
    {
      flags: '--axios',
      description: 'generate axios http client',
      default: codeGenBaseConfig.httpClientType === HTTP_CLIENT.AXIOS,
    },
    {
      flags: '--ky',
      description: 'generate axios http client',
      default: codeGenBaseConfig.httpClientType === HTTP_CLIENT.KY,
    },
    {
      flags: '--unwrap-response-data',
      description: 'unwrap the data item from the response',
      default: codeGenBaseConfig.unwrapResponseData,
    },
    {
      flags: '--disable-throw-on-error',
      description: 'Do not throw an error when response.ok is not true',
      default: codeGenBaseConfig.disableThrowOnError,
    },
    {
      flags: '--single-http-client',
      description: 'Ability to send HttpClient instance to Api constructor',
      default: codeGenBaseConfig.singleHttpClient,
      internal: { formatter: Boolean },
    },
    {
      flags: '--silent',
      description: 'Output only errors to console',
      default: codeGenBaseConfig.silent,
      internal: { formatter: Boolean },
    },
    {
      flags: '--default-response <type>',
      description: 'default type for empty response schema',
      default: codeGenBaseConfig.defaultResponseType,
      internal: { name: 'defaultResponseType' },
    },
    {
      flags: '--type-prefix <string>',
      description: 'data contract name prefix',
      default: codeGenBaseConfig.typePrefix,
    },
    {
      flags: '--type-suffix <string>',
      description: 'data contract name suffix',
      default: codeGenBaseConfig.typeSuffix,
    },
    {
      flags: '--clean-output',
      description:
        'clean output folder before generate api. WARNING: May cause data loss',
      default: codeGenBaseConfig.cleanOutput,
      internal: { formatter: Boolean },
    },
    {
      flags: '--api-class-name <string>',
      description: 'name of the api class',
      default: codeGenBaseConfig.apiClassName,
    },
    {
      flags: '--patch',
      description: 'fix up small errors in the swagger source definition',
      default: codeGenBaseConfig.patch,
      internal: { formatter: Boolean },
    },
    {
      flags: '--debug',
      description: 'additional information about processes inside this tool',
      default: codeGenBaseConfig.debug,
    },
    {
      flags: '--another-array-type',
      description: 'generate array types as Array<Type> (by default Type[])',
      default: codeGenBaseConfig.anotherArrayType,
    },
    {
      flags: '--sort-types',
      description: 'sort fields and types',
      default: codeGenBaseConfig.sortTypes,
    },
    {
      flags: '--extract-enums',
      description:
        'extract all enums from inline interface\\type content to typescript enum construction',
      default: codeGenBaseConfig.extractEnums,
    },
    {
      flags: '--sort-routes',
      description: 'sort routes in alphabetical order',
      default: codeGenBaseConfig.sortRoutes,
    },
    {
      flags: '--custom-config <string>',
      description: 'custom config: primitiveTypeConstructs, hooks, ... ',
      default: '',
    },
  ],
});

program.addCommand({
  name: 'generate-templates',
  description: `Generate ".ejs" templates needed for generate api`,
  options: [
    {
      flags: '-o, --output <string>',
      description: 'output path of generated templates',
      default: templateGenBaseConfig.output,
    },
    {
      flags: '-m, --modular',
      description:
        'generate templates needed to separate files for http client, data contracts, and routes',
      default: templateGenBaseConfig.modular,
      internal: { formatter: Boolean },
    },
    {
      flags: '--http-client <string>',
      description: `http client type (possible values: ${Object.values(
        HTTP_CLIENT,
      )
        .map((v) => `"${v}"`)
        .join(', ')})`,
      default: templateGenBaseConfig.httpClientType,
      internal: { name: 'httpClientType' },
    },
    {
      flags: '-c, --clean-output',
      description:
        'clean output folder before generate template. WARNING: May cause data loss',
      default: templateGenBaseConfig.cleanOutput,
      internal: { formatter: Boolean },
    },
    {
      flags: '-r, --rewrite',
      description: 'rewrite content in existing templates',
      default: templateGenBaseConfig.rewrite,
      internal: { formatter: Boolean },
    },
    {
      flags: '--silent',
      description: 'Output only errors to console',
      default: templateGenBaseConfig.silent,
      internal: { formatter: Boolean },
    },
  ],
});

const main = async () => {
  const { command, options } = await program.execute({ args: process.argv });

  let customConfig = null;

  if (options.customConfig) {
    try {
      const customConfigPath = resolve(process.cwd(), options.customConfig);
      console.log(`✨ found custom config at: ${customConfigPath}`);
      customConfig = require(customConfigPath);
    } catch (e) {
      /* empty */
    }
  }

  try {
    switch (command) {
      case null: {
        await generateApi({
          ...options,
          name: options.name,
          url: options.path,
          generateRouteTypes: options.routeTypes,
          generateClient: !!(options.axios || options.client),
          httpClientType: options.axios ? HTTP_CLIENT.AXIOS : options.ky ? HTTP_CLIENT.KY : HTTP_CLIENT.FETCH,
          input: resolve(process.cwd(), options.path),
          output: resolve(process.cwd(), options.output || '.'),
          ...customConfig,
        });
        break;
      }
      case 'generate-templates': {
        await generateTemplates(options);
        break;
      }
      default: {
        break;
      }
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
    return;
  }
  process.exit(0);
};

main();
