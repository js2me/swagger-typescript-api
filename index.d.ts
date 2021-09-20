interface GenerateApiParams {
  /**
   * path to swagger schema
   */
  input: string;

  /**
   * url to swagger schema
   */
  url: string;

  /**
   * swagger schema JSON
   */
  spec: import("swagger-schema-official").Spec;

  /**
   * default 'api.ts'
   */
  name?: string;

  /**
   * path to folder where will been located the created api module
   */
  output?: string;

  /**
   * path to folder containing templates (default: ./scr/templates)
   */
  templates?: string;

  /**
   * generate all "enum" types as union types (T1 | T2 | TN) (default: false)
   */
  generateUnionEnums?: boolean;

  /**
   * generate type definitions for API routes (default: false)
   */
  generateRouteTypes?: boolean;

  /**
   * do not generate an API class
   */
  generateClient?: boolean;
  /**
   * generated http client type
   */
  httpClientType?: "axios" | "fetch";
  /**
   * use "default" response status code as success response too.
   * some swagger schemas use "default" response status code as success response type by default.
   */
  defaultResponseAsSuccess?: boolean;

  /**
   * generate additional information about request responses
   * also add typings for bad responses
   */
  generateResponses?: boolean;

  /**
   * generate js api module with declaration file (default: false)
   */
  toJS?: boolean;

  /**
   * determines which path index should be used for routes separation
   */
  moduleNameIndex?: number;
  /**
   * users operation's first tag for route separation
   */
  moduleNameFirstTag?: boolean;
  /**
   * disabled SSL check
   */
  disableStrictSSL?: boolean;
  /**
   * disabled Proxy
   */
  disableProxy?: boolean;
  /**
   * generate separated files for http client, data contracts, and routes (default: false)
   */
  modular?: boolean;
  /**
   * extract request params to data contract (Also combine path params and query params into one object)
   */
  extractRequestParams?: boolean;
  /**
   * extract request body type to data contract
   */
  extractRequestBody?: boolean;
  /**
   * prettier configuration
   */
  prettier?: object;
  /**
   * Output only errors to console (default: false)
   */
  silent?: boolean;
  /**
   * default type for empty response schema (default: "void")
   */
  defaultResponseType?: boolean;
  /**
   * Ability to send HttpClient instance to Api constructor
   */
  singleHttpClient?: boolean;
  cleanOutput?: boolean;
  enumNamesAsValues?: boolean;

  hooks?: Partial<Hooks>;
  /**
   *  extra templates
   */
  extraTemplates?: { name: string; path: string }[];

  /**
   * fix up small errors in the swagger source definition
   */
  patch?: boolean;
}

export interface Hooks {
  /** calls after parse schema component */
  onCreateComponent: (component: SchemaComponent) => SchemaComponent | void;
  /** calls after parse any kind of schema */
  onParseSchema: (originalSchema: any, parsedSchema: any) => any | void;
  /** calls after parse route (return type: customized route (ParsedRoute), nothing change (void), false (ignore this route)) */
  onCreateRoute: (routeData: ParsedRoute) => ParsedRoute | void | false;
  /** Start point of work this tool (after fetching schema) */
  onInit?: <C extends GenerateApiConfiguration["config"]>(configuration: C) => C | void;
  /** customize configuration object before sending it to ETA templates */
  onPrepareConfig?: <C extends GenerateApiConfiguration>(currentConfiguration: C) => C | void;
  /** customize route name as you need */
  onCreateRouteName?: (routeNameInfo: RouteNameInfo, rawRouteInfo: RawRouteInfo) => RouteNameInfo | void;
  /** customize request params (path params, query params) */
  onCreateRequestParams?: (rawType: SchemaComponent["rawTypeData"]) => SchemaComponent["rawTypeData"] | void;
  /** customize name of model type */
  onFormatTypeName?: (typeName: string, rawTypeName?: string) => string | void;
  /** customize name of route (operationId), you can do it with using onCreateRouteName too */
  onFormatRouteName?: (routeInfo: RawRouteInfo, templateRouteName: string) => string | void;
}

export interface RouteNameRouteInfo {}

export type RouteNameInfo = {
  usage: string;
  original: string;
  duplicate: boolean;
};

export type SchemaTypePrimitiveContent = {
  $parsedSchema: boolean;
  schemaType: string;
  type: string;
  typeIdentifier: string;
  name?: any;
  description: string;
  content: string;
};

export type SchemaTypeObjectContent = {
  $$raw: {
    type: string;
    required: boolean;
    $parsed: SchemaTypePrimitiveContent;
  };
  isRequired: boolean;
  field: string;
}[];

export type SchemaTypeEnumContent = {
  key: string;
  type: string;
  value: string;
};

export interface ParsedSchema<C> {
  $parsedSchema: boolean;
  schemaType: string;
  type: string;
  typeIdentifier: string;
  name: string;
  description?: string;
  allFieldsAreOptional?: boolean;
  content: C;
}

export interface PathArgInfo {
  name: string;
  optional: boolean;
  type: string;
  description?: string;
}

export interface SchemaComponent {
  $ref: string;
  typeName: string;
  rawTypeData?: {
    type: string;
    required?: string[];
    properties?: Record<
      string,
      {
        name?: string;
        type: string;
        required: boolean;
        $parsed?: SchemaTypePrimitiveContent;
      }
    >;
    discriminator?: {
      propertyName?: string;
    };
    $parsed: ParsedSchema<SchemaTypeObjectContent | SchemaTypeEnumContent | SchemaTypePrimitiveContent>;
  };
  componentName: string;
  typeData: ParsedSchema<SchemaTypeObjectContent | SchemaTypeEnumContent | SchemaTypePrimitiveContent> | null;
}

export enum RequestContentKind {
  JSON = "JSON",
  URL_ENCODED = "URL_ENCODED",
  FORM_DATA = "FORM_DATA",
  IMAGE = "IMAGE",
  OTHER = "OTHER",
}

export interface RequestResponseInfo {
  contentTypes: string[];
  contentKind: RequestContentKind;
  type: string;
  description: string;
  status: string | number;
  isSuccess: boolean;
}

export type RawRouteInfo = {
  operationId: string;
  method: string;
  route: string;
  moduleName: string;
  responsesTypes: RequestResponseInfo[];
  description?: string;
  tags?: string[];
  summary?: string;
  responses?: import("swagger-schema-official").Spec["responses"];
  produces?: string[];
  requestBody?: object;
  consumes?: string[];
};

export interface ParsedRoute {
  id: string;
  jsDocLines: string;
  namespace: string;
  request: Request;
  response: Response;
  routeName: RouteNameInfo;
  raw: RawRouteInfo;
}

export type ModelType = {
  typeIdentifier: string;
  name: string;
  rawContent: string;
  description: string;
  content: string;
};

export enum SCHEMA_TYPES {
  ARRAY = "array",
  OBJECT = "object",
  ENUM = "enum",
  REF = "$ref",
  PRIMITIVE = "primitive",
  COMPLEX = "complex",
  COMPLEX_ONE_OF = "oneOf",
  COMPLEX_ANY_OF = "anyOf",
  COMPLEX_ALL_OF = "allOf",
  COMPLEX_NOT = "not",
  COMPLEX_UNKNOWN = "__unknown",
}

type MAIN_SCHEMA_TYPES = SCHEMA_TYPES.PRIMITIVE | SCHEMA_TYPES.OBJECT | SCHEMA_TYPES.ENUM;

export interface GenerateApiConfiguration {
  apiConfig: {
    baseUrl: string;
    title: string;
    version: string;
    description: string[];
    hasDescription: boolean;
  };
  config: {
    generateResponses: boolean;
    defaultResponseAsSuccess: boolean;
    generateRouteTypes: boolean;
    generateClient: boolean;
    generateUnionEnums: boolean;
    swaggerSchema: object;
    originalSchema: object;
    componentsMap: Record<string, SchemaComponent>;
    convertedFromSwagger2: boolean;
    moduleNameIndex: number;
    moduleNameFirstTag: boolean;
    disableStrictSSL: boolean;
    disableProxy: boolean;
    extractRequestParams: boolean;
    fileNames: {
      dataContracts: string;
      routeTypes: string;
      httpClient: string;
      outOfModuleApi: string;
    };
    templatesToRender: {
      api: string;
      dataContracts: string;
      httpClient: string;
      routeTypes: string;
      routeName: string;
    };
    routeNameDuplicatesMap: Map<string, string>;
  };
  modelTypes: ModelType[];
  rawModelTypes: SchemaComponent[];
  hasFormDataRoutes: boolean;
  hasSecurityRoutes: boolean;
  hasQueryRoutes: boolean;
  generateResponses: boolean;
  routes: {
    outOfModule: ParsedRoute[];
    combined?: {
      moduleName: string;
      routes: ParsedRoute[];
    }[];
  };
  utils: {
    formatDescription: (description: string, inline?: boolean) => string;
    internalCase: (value: string) => string;
    classNameCase: (value: string) => string;
    getInlineParseContent: (rawTypeData: SchemaComponent["rawTypeData"], typeName?: string) => string;
    getParseContent: (rawTypeData: SchemaComponent["rawTypeData"], typeName?: string) => ModelType;
    getComponentByRef: (ref: string) => SchemaComponent;
    parseSchema: (
      rawSchema: string | SchemaComponent["rawTypeData"],
      typeName?: string,
      formattersMap?: Record<MAIN_SCHEMA_TYPES, (content: ModelType) => string>,
    ) => ModelType;
    formatters: Record<MAIN_SCHEMA_TYPES, (content: string | object | string[] | object[]) => string>;
    inlineExtraFormatters: Record<Exclude<MAIN_SCHEMA_TYPES, SCHEMA_TYPES.PRIMITIVE>, (schema: ModelType) => string>;
    formatModelName: (name: string) => string;
    fmtToJSDocLine: (line: string, params?: { eol?: boolean }) => string;
    _: import("lodash").LoDashStatic;
    require: (path: string) => unknown;
  };
}

export interface GenerateApiOutput {
  configuration: GenerateApiConfiguration;
  files: { name: string; content: string; declaration: { name: string; content: string } | null }[];
  createFile: (params: { path: string; fileName: string; content: string; withPrefix?: boolean }) => void;
  renderTemplate: (
    templateContent: string,
    data: Record<string, unknown>,
    etaOptions?: import("eta/dist/types/config").PartialConfig,
  ) => string;
  getTemplate: (params: { fileName?: string; name?: string; path?: string }) => string;
  formatTSContent: (content: string) => string;
}

export declare function generateApi(params: Omit<GenerateApiParams, "url" | "spec">): Promise<GenerateApiOutput>;
export declare function generateApi(params: Omit<GenerateApiParams, "input" | "spec">): Promise<GenerateApiOutput>;
export declare function generateApi(params: Omit<GenerateApiParams, "input" | "url">): Promise<GenerateApiOutput>;
