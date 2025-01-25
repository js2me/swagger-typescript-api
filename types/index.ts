import type { ComponentTypeNameResolver } from "../src/component-type-name-resolver.js";
import type { MonoSchemaParser } from "../src/schema-parser/mono-schema-parser.js";
import type { Translator } from "../src/translators/translator.js";

type HttpClientType = "axios" | "fetch" | "ofetch";

interface GenerateApiParamsBase {
  /**
   * default 'api.ts'
   */
  name?: string;

  /**
   * name of the main exported class
   */
  apiClassName?: string;

  /**
   * path to folder where will be located the created api module.
   *
   * may set to `false` to skip writing content to disk. in this case,
   * you may access the `files` on the return value.
   */
  output?: string | false;

  /**
   * path to folder containing templates (default: ./src/templates)
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
  httpClientType?: HttpClientType;
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
   * unwrap the data item from the response
   */
  unwrapResponseData?: boolean;

  /**
   * sort data contracts in alphabetical order
   */
  sortTypes?: boolean;

  /**
   * sort routes in alphabetical order
   */
  sortRoutes?: boolean;

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
   * extract response body type to data contract
   */
  extractResponseBody?: boolean;
  /**
   * extract response error type to data contract
   */
  extractResponseError?: boolean;
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
  defaultResponseType?: string;
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
  /**
   *  authorization token
   */
  authorizationToken?: string;
  /**
   * generate readonly properties (default: false)
   */
  addReadonly?: boolean;

  primitiveTypeConstructs?: (
    struct: PrimitiveTypeStruct,
  ) => Partial<PrimitiveTypeStruct>;

  codeGenConstructs?: (struct: CodeGenConstruct) => Partial<CodeGenConstruct>;

  /** extract all enums from nested types\interfaces to `enum` construction */
  extractEnums?: boolean;

  /** prefix string value needed to fix invalid type names (default: 'Type') */
  fixInvalidTypeNamePrefix?: string;

  /** prefix string value needed to fix invalid enum keys (default: 'Value') */
  fixInvalidEnumKeyPrefix?: string;

  /** prefix string value for enum keys */
  enumKeyPrefix?: string;

  /** suffix string value for enum keys */
  enumKeySuffix?: string;

  /** prefix string value for type names */
  typePrefix?: string;

  /** suffix string value for type names */
  typeSuffix?: string;

  /** extra configuration for extracting type names operations */
  extractingOptions?: ExtractingOptions;

  /** configuration for fetching swagger schema requests */
  requestOptions?: Partial<RequestInit>;

  /** ts compiler configuration object (for --to-js option) */
  compilerTsConfig?: Record<string, unknown>;

  /** extract all enums from inline interface\\type content to typescript enum construction */
  extractResponses?: boolean;

  /** generate array types as Array<Type> (by default Type[]) */
  anotherArrayType?: boolean;

  /**
   * custom ts->* translator
   * do not use constructor args, it can break functionality of this property, just send class reference
   *
   * @example
   * ```ts
   * import { Translator } from "swagger-typescript-api/src/translators/translator";
   *
   * class MyTranslator extends Translator {
   *
   *     translate({ fileName, fileExtension, fileContent }) {
   *         this.codeFormatter.format()
   *         this.config.
   *
   *         return [
   *             {
   *                 fileName,
   *                 fileExtension,
   *                 fileContent,
   *             }
   *         ]
   *     }
   * }
   * ```
   */
  customTranslator?: new () => Translator;
  /** fallback name for enum key resolver */
  enumKeyResolverName?: string;
  /** fallback name for type name resolver */
  typeNameResolverName?: string;
  /** fallback name for specific arg name resolver */
  specificArgNameResolverName?: string;
  schemaParsers?: {
    complexOneOf?: MonoSchemaParser;
    complexAllOf?: MonoSchemaParser;
    complexAnyOf?: MonoSchemaParser;
    complexNot?: MonoSchemaParser;
    enum?: MonoSchemaParser;
    object?: MonoSchemaParser;
    complex?: MonoSchemaParser;
    primitive?: MonoSchemaParser;
    discriminator?: MonoSchemaParser;
    array?: MonoSchemaParser;
  };
}

type CodeGenConstruct = {
  Keyword: {
    Number: string;
    String: string;
    Boolean: string;
    Any: string;
    Void: string;
    Unknown: string;
    Null: string;
    Undefined: string;
    Object: string;
    File: string;
    Date: string;
    Type: string;
    Enum: string;
    Interface: string;
    Array: string;
    Record: string;
    Intersection: string;
    Union: string;
  };
  CodeGenKeyword: {
    UtilRequiredKeys: string;
  };
  ArrayType: (content: unknown) => string;
  StringValue: (content: unknown) => string;
  BooleanValue: (content: unknown) => string;
  NumberValue: (content: unknown) => string;
  NullValue: (content: unknown) => string;
  UnionType: (content: unknown) => string;
  ExpressionGroup: (content: unknown) => string;
  IntersectionType: (content: unknown) => string;
  RecordType: (content: unknown) => string;
  TypeField: (content: unknown) => string;
  InterfaceDynamicField: (content: unknown) => string;
  EnumField: (content: unknown) => string;
  EnumFieldsWrapper: (content: unknown) => string;
  ObjectWrapper: (content: unknown) => string;
  MultilineComment: (content: unknown) => string;
  TypeWithGeneric: (content: unknown) => string;
};

type PrimitiveTypeStructValue =
  | string
  | ((
      schema: Record<string, unknown>,
      parser: import("../src/schema-parser/schema-parser.js").SchemaParser,
    ) => string);

type PrimitiveTypeStruct = Record<
  "integer" | "number" | "boolean" | "object" | "file" | "string" | "array",
  | string
  | ({ $default: PrimitiveTypeStructValue } & Record<
      string,
      PrimitiveTypeStructValue
    >)
>;

interface GenerateApiParamsFromPath extends GenerateApiParamsBase {
  /**
   * path to swagger schema
   */
  input: string;
}

interface GenerateApiParamsFromUrl extends GenerateApiParamsBase {
  /**
   * url to swagger schema
   */
  url: string;
}

interface GenerateApiParamsFromSpecLiteral extends GenerateApiParamsBase {
  /**
   * swagger schema JSON
   */
  spec: import("swagger-schema-official").Spec;
}

export type GenerateApiParams =
  | GenerateApiParamsFromPath
  | GenerateApiParamsFromUrl
  | GenerateApiParamsFromSpecLiteral;

type BuildRouteParam = {
  /** {bar} */
  $match: string;
  name: string;
  required: boolean;
  type: "string";
  description: string;
  schema: {
    type: string;
  };
  in: "path" | "query";
};

type BuildRoutePath = {
  /** /foo/{bar}/baz */
  originalRoute: string;
  /** /foo/${bar}/baz */
  route: string;
  pathParams: BuildRouteParam[];
  queryParams: BuildRouteParam[];
};

export interface Hooks {
  /** calls before parse\process route path */
  onPreBuildRoutePath: (routePath: string) => string | undefined;
  /** calls after parse\process route path */
  onBuildRoutePath: (data: BuildRoutePath) => BuildRoutePath | undefined;
  /** calls before insert path param name into string path interpolation */
  onInsertPathParam: (
    paramName: string,
    index: number,
    arr: BuildRouteParam[],
    resultRoute: string,
  ) => string | undefined;
  /** calls after parse schema component */
  onCreateComponent: (
    component: SchemaComponent,
  ) => SchemaComponent | undefined;
  /** calls before parse any kind of schema */
  onPreParseSchema: (
    originalSchema: unknown,
    typeName: string,
    schemaType: string,
  ) => undefined;
  /** calls after parse any kind of schema */
  onParseSchema: (
    originalSchema: unknown,
    parsedSchema: unknown,
  ) => unknown | undefined;
  /** calls after parse route (return type: customized route (ParsedRoute), nothing change (void), false (ignore this route)) */
  onCreateRoute: (routeData: ParsedRoute) => ParsedRoute | false | undefined;
  /** Start point of work this tool (after fetching schema) */
  onInit?: <C extends GenerateApiConfiguration["config"]>(
    configuration: C,
    codeGenProcess: import("../src/code-gen-process.js").CodeGenProcess,
  ) => C | undefined;
  /** customize configuration object before sending it to ETA templates */
  onPrepareConfig?: <C extends GenerateApiConfiguration>(
    currentConfiguration: C,
  ) => C | undefined;
  /** customize route name as you need */
  onCreateRouteName?: (
    routeNameInfo: RouteNameInfo,
    rawRouteInfo: RawRouteInfo,
  ) => RouteNameInfo | undefined;
  /** customize request params (path params, query params) */
  onCreateRequestParams?: (
    rawType: SchemaComponent["rawTypeData"],
  ) => SchemaComponent["rawTypeData"] | undefined;
  /** customize name of model type */
  onFormatTypeName?: (
    typeName: string,
    rawTypeName?: string,
    schemaType?: "type-name" | "enum-key",
  ) => string | undefined;
  /** customize name of route (operationId), you can do it with using onCreateRouteName too */
  onFormatRouteName?: (
    routeInfo: RawRouteInfo,
    templateRouteName: string,
  ) => string | undefined;
}

export type RouteNameRouteInfo = Record<string, unknown>;

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
  name?: unknown;
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
    $parsed: ParsedSchema<
      | SchemaTypeObjectContent
      | SchemaTypeEnumContent
      | SchemaTypePrimitiveContent
    >;
  };
  componentName: "schemas" | "paths";
  typeData: ParsedSchema<
    SchemaTypeObjectContent | SchemaTypeEnumContent | SchemaTypePrimitiveContent
  > | null;
}

export enum RequestContentKind {
  JSON = "JSON",
  URL_ENCODED = "URL_ENCODED",
  FORM_DATA = "FORM_DATA",
  IMAGE = "IMAGE",
  OTHER = "OTHER",
  TEXT = "TEXT",
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

type MAIN_SCHEMA_TYPES =
  | SCHEMA_TYPES.PRIMITIVE
  | SCHEMA_TYPES.OBJECT
  | SCHEMA_TYPES.ENUM;

export type ExtractingOptions = {
  requestBodySuffix: string[];
  responseBodySuffix: string[];
  responseErrorSuffix: string[];
  requestParamsSuffix: string[];
  enumSuffix: string[];
  discriminatorMappingSuffix: string[];
  discriminatorAbstractPrefix: string[];
  requestBodyNameResolver: (
    name: string,
    reservedNames: string,
  ) => string | undefined;
  responseBodyNameResolver: (
    name: string,
    reservedNames: string,
  ) => string | undefined;
  responseErrorNameResolver: (
    name: string,
    reservedNames: string,
  ) => string | undefined;
  requestParamsNameResolver: (
    name: string,
    reservedNames: string,
  ) => string | undefined;
  enumNameResolver: (name: string, reservedNames: string) => string | undefined;
  discriminatorMappingNameResolver: (
    name: string,
    reservedNames: string,
  ) => string | undefined;
  discriminatorAbstractResolver: (
    name: string,
    reservedNames: string,
  ) => string | undefined;
};

export interface GenerateApiConfiguration {
  apiConfig: {
    baseUrl: string;
    title: string;
    version: string;
    description: string[];
    hasDescription: boolean;
  };
  config: {
    input: string;
    output: string | false;
    url: string;
    spec: unknown;
    fileName: string;
    templatePaths: {
      /** `templates/base` */
      base: string;
      /** `templates/default` */
      default: string;
      /** `templates/modular` */
      modular: string;
      /** usage path if `--templates` option is not set */
      original: string;
      /** custom path to templates (`--templates`) */
      custom: string | null;
    };
    authorizationToken?: string;
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
    extraTemplates: { name: string; path: string }[];
    extractRequestParams: boolean;
    unwrapResponseData: boolean;
    sortTypes: boolean;
    sortRoutes: boolean;
    singleHttpClient: boolean;
    typePrefix: string;
    typeSuffix: string;
    enumKeyPrefix: string;
    enumKeySuffix: string;
    patch: boolean;
    cleanOutput: boolean;
    debug: boolean;
    anotherArrayType: boolean;
    extractRequestBody: boolean;
    httpClientType: "axios" | "fetch" | "ofetch";
    addReadonly: boolean;
    extractResponseBody: boolean;
    extractResponseError: boolean;
    extractEnums: boolean;
    extractResponses: boolean;
    fixInvalidTypeNamePrefix: string;
    fixInvalidEnumKeyPrefix: string;
    defaultResponseType: string;
    toJS: boolean;
    disableThrowOnError: boolean;
    silent: boolean;
    hooks: Partial<Hooks>;
    enumNamesAsValues: boolean;
    version: string;
    compilerTsConfig: Record<string, unknown>;
    enumKeyResolverName: string;
    typeNameResolverName: string;
    specificArgNameResolverName: string;
    customTranslator?: new () => Translator;
    internalTemplateOptions: {
      addUtilRequiredKeysType: boolean;
    };
    componentTypeNameResolver: ComponentTypeNameResolver;
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
      dataContractJsDoc: string;
      interfaceDataContract: string;
      typeDataContract: string;
      enumDataContract: string;
      objectFieldJsDoc: string;
    };
    routeNameDuplicatesMap: Map<string, string>;
    apiClassName: string;
    requestOptions?: RequestInit;
    extractingOptions: ExtractingOptions;
  };
  modelTypes: ModelType[];
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
  requestOptions?: Partial<RequestInit>;
  utils: {
    formatDescription: (description: string, inline?: boolean) => string;
    internalCase: (value: string) => string;
    /** @deprecated */
    classNameCase: (value: string) => string;
    pascalCase: (value: string) => string;
    getInlineParseContent: (
      rawTypeData: SchemaComponent["rawTypeData"],
      typeName?: string,
    ) => string;
    getParseContent: (
      rawTypeData: SchemaComponent["rawTypeData"],
      typeName?: string,
    ) => ModelType;
    getComponentByRef: (ref: string) => SchemaComponent;
    parseSchema: (
      rawSchema: string | SchemaComponent["rawTypeData"],
      typeName?: string,
      formattersMap?: Record<MAIN_SCHEMA_TYPES, (content: ModelType) => string>,
    ) => ModelType;
    formatters: Record<
      MAIN_SCHEMA_TYPES,
      (content: string | object | string[] | object[]) => string
    >;
    inlineExtraFormatters: Record<
      Exclude<MAIN_SCHEMA_TYPES, SCHEMA_TYPES.PRIMITIVE>,
      (schema: ModelType) => string
    >;
    formatModelName: (name: string) => string;
    fmtToJSDocLine: (line: string, params?: { eol?: boolean }) => string;
    _: import("lodash").LoDashStatic;
    require: (path: string) => unknown;
  };
}

type FileInfo = {
  /** @example myFilename */
  fileName: string;
  /** @example .d.ts */
  fileExtension: string;
  /** content of the file */
  fileContent: string;
};

export interface GenerateApiOutput {
  configuration: GenerateApiConfiguration;
  files: FileInfo[];
  createFile: (params: {
    path: string;
    fileName: string;
    content: string;
    withPrefix: boolean;
  }) => void;
  renderTemplate: (
    templateContent: string,
    data: Record<string, unknown>,
    etaOptions?: Partial<import("eta").EtaConfig>,
  ) => Promise<string> | string;
  getTemplate: (params: {
    fileName?: string;
    name?: string;
    path?: string;
  }) => string;
  formatTSContent: (content: string) => Promise<string>;
}

export declare function generateApi(
  params: GenerateApiParams,
): Promise<GenerateApiOutput>;

export interface GenerateTemplatesParams {
  cleanOutput?: boolean;
  output?: string;
  httpClientType?: HttpClientType;
  modular?: boolean;
  silent?: boolean;
}

export interface GenerateTemplatesOutput
  extends Pick<GenerateApiOutput, "files" | "createFile"> {}

export declare function generateTemplates(
  params: GenerateTemplatesParams,
): Promise<GenerateTemplatesOutput>;
