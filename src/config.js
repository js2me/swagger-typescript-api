const { HTTP_CLIENT, TS_KEYWORDS, PRETTIER_OPTIONS } = require("./constants");
const { NameResolver } = require("./utils/resolveName");

const config = {
  /** CLI flag */
  templates: "../templates/default",
  /** CLI flag */
  generateResponses: false,
  /** CLI flag */
  defaultResponseAsSuccess: false,
  /** CLI flag */
  generateRouteTypes: false,
  /** CLI flag */
  generateClient: true,
  /** CLI flag */
  generateUnionEnums: false,
  enumNamesAsValues: false,
  /** parsed swagger schema from getSwaggerObject() */

  /** parsed swagger schema ref */
  swaggerSchema: null,
  /** original (converted to json) swagger schema ref */
  originalSchema: null,

  /** { "#/components/schemas/Foo": @TypeInfo, ... } */
  componentsMap: {},
  /** flag for catching convertion from swagger 2.0 */
  convertedFromSwagger2: false,

  /** url index from paths used for merging into modules */
  moduleNameIndex: 0,

  /** use the first tag for the module name */
  moduleNameFirstTag: false,
  disableStrictSSL: false,
  disableProxy: false,
  extractRequestParams: false,
  extractRequestBody: false,
  fileNames: {
    dataContracts: "data-contracts",
    routeTypes: "route-types",
    httpClient: "http-client",
    outOfModuleApi: "Common",
  },
  routeNameDuplicatesMap: new Map(),
  prettierOptions: PRETTIER_OPTIONS,
  hooks: {
    onCreateComponent: (schema) => schema,
    onParseSchema: (originalSchema, parsedSchema) => parsedSchema,
    onCreateRoute: (routeData) => routeData,
    onInit: (config) => config,
    onPrepareConfig: (apiConfig) => apiConfig,
    onCreateRequestParams: (rawType) => {},
    onCreateRouteName: () => {},
    onFormatTypeName: (typeName, rawTypeName) => {},
    onFormatRouteName: (routeInfo, templateRouteName) => {},
  },
  defaultResponseType: TS_KEYWORDS.VOID,
  singleHttpClient: false,
  httpClientType: HTTP_CLIENT.FETCH,
  unwrapResponseData: false,
  templatePaths: {
    /** `templates/base` */
    base: "",
    /** `templates/default` */
    default: "",
    /** `templates/modular` */
    modular: "",
    /** usage path if `--templates` option is not set */
    original: "",
    /** custom path to templates (`--templates`) */
    custom: "",
  },
  /** Record<templateName, templateContent> */
  templatesToRender: {
    api: "",
    dataContracts: "",
    httpClient: "",
    routeTypes: "",
    routeName: "",
  },
  toJS: false,
  silent: false,
  typePrefix: "",
  typeSuffix: "",
  patch: false,
  componentTypeNameResolver: new NameResolver([]),
};

/** needs to use data everywhere in project */
module.exports = {
  addToConfig: (configParts) => Object.assign(config, configParts),
  config,
};
