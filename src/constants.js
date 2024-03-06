const packageJson = require('../package.json');
const RESERVED_QUERY_ARG_NAMES = ['query', 'queryParams', 'queryArg'];
const RESERVED_BODY_ARG_NAMES = ['data', 'body', 'reqBody'];
const RESERVED_REQ_PARAMS_ARG_NAMES = [
  'params',
  'requestParams',
  'reqParams',
  'httpParams',
];
const RESERVED_PATH_ARG_NAMES = ['path', 'pathParams'];
const RESERVED_HEADER_ARG_NAMES = ['headers', 'headersParams'];

const SCHEMA_TYPES = {
  ARRAY: 'array',
  OBJECT: 'object',
  ENUM: 'enum',
  REF: '$ref',
  PRIMITIVE: 'primitive',
  COMPLEX: 'complex',
  DISCRIMINATOR: 'discriminator',
  COMPLEX_ONE_OF: 'oneOf',
  COMPLEX_ANY_OF: 'anyOf',
  COMPLEX_ALL_OF: 'allOf',
  COMPLEX_NOT: 'not',
  COMPLEX_UNKNOWN: '__unknown',
};

const HTTP_CLIENT = {
  FETCH: 'fetch',
  AXIOS: 'axios',
  KY: 'ky',
};

const PROJECT_VERSION = packageJson.version;

const FILE_PREFIX = `/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

`;

module.exports = {
  FILE_PREFIX,
  DEFAULT_BODY_ARG_NAME: 'data',
  PROJECT_VERSION,
  SCHEMA_TYPES,
  HTTP_CLIENT,
  RESERVED_QUERY_ARG_NAMES,
  RESERVED_BODY_ARG_NAMES,
  RESERVED_REQ_PARAMS_ARG_NAMES,
  RESERVED_PATH_ARG_NAMES,
  RESERVED_HEADER_ARG_NAMES,
  PRETTIER_OPTIONS: {
    printWidth: 120,
    tabWidth: 2,
    trailingComma: 'all',
    parser: 'typescript',
  },
};
