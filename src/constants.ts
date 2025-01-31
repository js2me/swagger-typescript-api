import packageJson from "../package.json" with { type: "json" };

export const DEFAULT_BODY_ARG_NAME = "data";

export const FILE_PREFIX = `/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

`;

export const HTTP_CLIENT = {
  FETCH: "fetch",
  AXIOS: "axios",
} as const;

export const PRETTIER_OPTIONS = {
  printWidth: 120,
  tabWidth: 2,
  trailingComma: "all",
  parser: "typescript",
} as const;

export const PROJECT_VERSION = packageJson.version;

export const RESERVED_BODY_ARG_NAMES = ["data", "body", "reqBody"];

export const RESERVED_HEADER_ARG_NAMES = ["headers", "headersParams"];

export const RESERVED_PATH_ARG_NAMES = ["path", "pathParams"];

export const RESERVED_QUERY_ARG_NAMES = ["query", "queryParams", "queryArg"];

export const RESERVED_REQ_PARAMS_ARG_NAMES = [
  "params",
  "requestParams",
  "reqParams",
  "httpParams",
];

export const SCHEMA_TYPES = {
  ARRAY: "array",
  OBJECT: "object",
  ENUM: "enum",
  REF: "$ref",
  PRIMITIVE: "primitive",
  COMPLEX: "complex",
  DISCRIMINATOR: "discriminator",
  COMPLEX_ONE_OF: "oneOf",
  COMPLEX_ANY_OF: "anyOf",
  COMPLEX_ALL_OF: "allOf",
  COMPLEX_NOT: "not",
  COMPLEX_UNKNOWN: "__unknown",
} as const;
