const _ = require("lodash");
const { generateId } = require("../util/id.js");
const {
  SpecificArgNameResolver,
} = require("./util/specific-arg-name-resolver");
const {
  DEFAULT_BODY_ARG_NAME,
  RESERVED_BODY_ARG_NAMES,
  RESERVED_HEADER_ARG_NAMES,
  RESERVED_PATH_ARG_NAMES,
  RESERVED_QUERY_ARG_NAMES,
} = require("../constants.js");
const { camelCase } = require("lodash");

const CONTENT_KIND = {
  JSON: "JSON",
  URL_ENCODED: "URL_ENCODED",
  FORM_DATA: "FORM_DATA",
  IMAGE: "IMAGE",
  OTHER: "OTHER",
  TEXT: "TEXT",
};

class SchemaRoutes {
  /**
   * @type {CodeGenConfig}
   */
  config;
  /**
   * @type {SchemaParserFabric}
   */
  schemaParserFabric;
  /**
   * @type {SchemaUtils}
   */
  schemaUtils;
  /**
   * @type {TypeNameFormatter}
   */
  typeNameFormatter;
  /**
   * @type {SchemaComponentsMap}
   */
  schemaComponentsMap;
  /**
   * @type {Logger}
   */
  logger;
  /**
   * @type {TemplatesWorker}
   */
  templatesWorker;

  FORM_DATA_TYPES = [];

  routes = [];
  hasSecurityRoutes = false;
  hasQueryRoutes = false;
  hasFormDataRoutes = false;

  constructor({
    config,
    schemaParserFabric,
    schemaComponentsMap,
    logger,
    templatesWorker,
    typeNameFormatter,
  }) {
    this.config = config;
    this.schemaParserFabric = schemaParserFabric;
    this.schemaUtils = this.schemaParserFabric.schemaUtils;
    this.typeNameFormatter = typeNameFormatter;
    this.schemaComponentsMap = schemaComponentsMap;
    this.logger = logger;
    this.templatesWorker = templatesWorker;

    this.FORM_DATA_TYPES = _.uniq([
      this.schemaUtils.getSchemaType({ type: "string", format: "file" }),
      this.schemaUtils.getSchemaType({ type: "string", format: "binary" }),
    ]);
  }

  createRequestsMap = (routeInfoByMethodsMap) => {
    const parameters = _.get(routeInfoByMethodsMap, "parameters");

    return _.reduce(
      routeInfoByMethodsMap,
      (acc, requestInfo, method) => {
        if (
          _.startsWith(method, "x-") ||
          ["parameters", "$ref"].includes(method)
        ) {
          return acc;
        }

        acc[method] = {
          ...requestInfo,
          parameters: _.compact(_.concat(parameters, requestInfo.parameters)),
        };

        return acc;
      },
      {},
    );
  };

  parseRouteName = (originalRouteName) => {
    const routeName =
      this.config.hooks.onPreBuildRoutePath(originalRouteName) ||
      originalRouteName;

    const pathParamMatches = (routeName || "").match(
      /({[a-zA-Z]([-_.]*[a-zA-Z0-9])*})|(:[a-zA-Z]([-_.]*[a-zA-Z0-9])*:?)/g,
    );

    // used in case when path parameters is not declared in requestInfo.parameters ("in": "path")
    const pathParams = _.reduce(
      pathParamMatches,
      (pathParams, match) => {
        const paramName = _.replace(match, /\{|\}|:/g, "");

        if (!paramName) return pathParams;

        if (_.includes(paramName, "-")) {
          this.logger.warn("wrong path param name", paramName);
        }

        pathParams.push({
          $match: match,
          name: _.camelCase(paramName),
          required: true,
          type: "string",
          description: "",
          schema: {
            type: "string",
          },
          in: "path",
        });

        return pathParams;
      },
      [],
    );

    let fixedRoute = _.reduce(
      pathParams,
      (fixedRoute, pathParam, i, arr) => {
        const insertion =
          this.config.hooks.onInsertPathParam(
            pathParam.name,
            i,
            arr,
            fixedRoute,
          ) || pathParam.name;
        return _.replace(fixedRoute, pathParam.$match, `\${${insertion}}`);
      },
      routeName || "",
    );

    const queryParamMatches = fixedRoute.match(/(\{\?.*\})/g);
    const queryParams = [];

    if (queryParamMatches && queryParamMatches.length) {
      queryParamMatches.forEach((match) => {
        fixedRoute = fixedRoute.replace(match, "");
      });

      _.uniq(
        queryParamMatches
          .join(",")
          .replace(/(\{\?)|(\})|\s/g, "")
          .split(","),
      ).forEach((paramName) => {
        if (_.includes(paramName, "-")) {
          this.logger.warn("wrong query param name", paramName);
        }

        queryParams.push({
          $match: paramName,
          name: _.camelCase(paramName),
          required: true,
          type: "string",
          description: "",
          schema: {
            type: "string",
          },
          in: "query",
        });
      });
    }

    const result = {
      originalRoute: originalRouteName || "",
      route: fixedRoute,
      pathParams,
      queryParams,
    };

    return this.config.hooks.onBuildRoutePath(result) || result;
  };

  getRouteParams = (
    routeInfo,
    pathParamsFromRouteName,
    queryParamsFromRouteName,
  ) => {
    const { parameters } = routeInfo;

    const routeParams = {
      path: [],
      header: [],
      body: [],
      query: [],
      formData: [],
      cookie: [],
    };

    _.each(parameters, (parameter) => {
      const refTypeInfo =
        this.schemaParserFabric.schemaUtils.getSchemaRefType(parameter);
      let routeParam = null;

      if (
        refTypeInfo &&
        refTypeInfo.rawTypeData.in &&
        refTypeInfo.rawTypeData
      ) {
        if (!routeParams[refTypeInfo.rawTypeData.in]) {
          routeParams[refTypeInfo.rawTypeData.in] = [];
        }

        routeParam = {
          ...refTypeInfo.rawTypeData,
          ...(refTypeInfo.rawTypeData.schema || {}),
        };
      } else {
        if (!parameter.in) return;

        if (!routeParams[parameter.in]) {
          routeParams[parameter.in] = [];
        }

        routeParam = {
          ...parameter,
          ...(parameter.schema || {}),
        };
      }

      if (routeParam.in === "path") {
        if (!routeParam.name) return;

        routeParam.name = _.camelCase(routeParam.name);
      }

      if (routeParam) {
        routeParams[routeParam.in].push(routeParam);
      }
    });

    // used in case when path parameters is not declared in requestInfo.parameters ("in": "path")
    _.each(pathParamsFromRouteName, (pathParam) => {
      const alreadyExist = _.some(
        routeParams.path,
        (parameter) => parameter.name === pathParam.name,
      );

      if (!alreadyExist) {
        routeParams.path.push(pathParam);
      }
    });
    // used in case when path parameters is not declared in requestInfo.parameters ("in": "path")
    _.each(queryParamsFromRouteName, (queryParam) => {
      const alreadyExist = _.some(
        routeParams.query,
        (parameter) => parameter.name === queryParam.name,
      );

      if (!alreadyExist) {
        routeParams.query.push(queryParam);
      }
    });

    return routeParams;
  };

  getContentTypes = (requestInfo, extraContentTypes) =>
    _.uniq(
      _.compact([
        ...(extraContentTypes || []),
        ..._.flatten(
          _.map(
            requestInfo,
            (requestInfoData) =>
              requestInfoData && _.keys(requestInfoData.content),
          ),
        ),
      ]),
    );

  getContentKind = (contentTypes) => {
    if (
      _.some(contentTypes, (contentType) =>
        _.startsWith(contentType, "application/json"),
      ) ||
      _.some(contentTypes, (contentType) => _.endsWith(contentType, "+json"))
    ) {
      return CONTENT_KIND.JSON;
    }

    if (contentTypes.includes("application/x-www-form-urlencoded")) {
      return CONTENT_KIND.URL_ENCODED;
    }

    if (contentTypes.includes("multipart/form-data")) {
      return CONTENT_KIND.FORM_DATA;
    }

    if (
      _.some(contentTypes, (contentType) => _.includes(contentType, "image/"))
    ) {
      return CONTENT_KIND.IMAGE;
    }

    if (
      _.some(contentTypes, (contentType) => _.startsWith(contentType, "text/"))
    ) {
      return CONTENT_KIND.TEXT;
    }

    return CONTENT_KIND.OTHER;
  };

  isSuccessStatus = (status) =>
    (this.config.defaultResponseAsSuccess && status === "default") ||
    (+status >= this.config.successResponseStatusRange[0] &&
      +status <= this.config.successResponseStatusRange[1]) ||
    status === "2xx";

  getSchemaFromRequestType = (requestInfo) => {
    const content = _.get(requestInfo, "content");

    if (!content) return null;

    /* content: { "multipart/form-data": { schema: {...} }, "application/json": { schema: {...} } } */

    /* for example: dataType = "multipart/form-data" */
    for (const dataType in content) {
      if (content[dataType] && content[dataType].schema) {
        return {
          ...content[dataType].schema,
          dataType,
        };
      }
    }

    return null;
  };

  getTypeFromRequestInfo = ({
    requestInfo,
    parsedSchemas,
    operationId,
    defaultType,
    typeName,
  }) => {
    // TODO: make more flexible pick schema without content type
    const schema = this.getSchemaFromRequestType(requestInfo);
    const refTypeInfo =
      this.schemaParserFabric.schemaUtils.getSchemaRefType(requestInfo);

    if (schema) {
      const content = this.schemaParserFabric.getInlineParseContent(
        schema,
        typeName,
        [operationId],
      );
      const foundedSchemaByName = _.find(
        parsedSchemas,
        (parsedSchema) =>
          this.typeNameFormatter.format(parsedSchema.name) === content,
      );
      const foundSchemaByContent = _.find(parsedSchemas, (parsedSchema) =>
        _.isEqual(parsedSchema.content, content),
      );

      const foundSchema = foundedSchemaByName || foundSchemaByContent;

      return foundSchema
        ? this.typeNameFormatter.format(foundSchema.name)
        : content;
    }

    if (refTypeInfo) {
      // const refTypeWithoutOpId = refType.replace(operationId, '');
      // const foundedSchemaByName = _.find(parsedSchemas, ({ name }) => name === refType || name === refTypeWithoutOpId)

      // TODO:HACK fix problem of swagger2opeanpi
      const typeNameWithoutOpId = _.replace(
        refTypeInfo.typeName,
        operationId,
        "",
      );
      if (
        _.find(parsedSchemas, (schema) => schema.name === typeNameWithoutOpId)
      ) {
        return this.typeNameFormatter.format(typeNameWithoutOpId);
      }

      switch (refTypeInfo.componentName) {
        case "schemas":
          return this.typeNameFormatter.format(refTypeInfo.typeName);
        case "responses":
        case "requestBodies":
          return this.schemaParserFabric.getInlineParseContent(
            this.getSchemaFromRequestType(refTypeInfo.rawTypeData),
            refTypeInfo.typeName || null,
            [operationId],
          );
        default:
          return this.schemaParserFabric.getInlineParseContent(
            refTypeInfo.rawTypeData,
            refTypeInfo.typeName || null,
            [operationId],
          );
      }
    }

    return defaultType || this.config.Ts.Keyword.Any;
  };

  getRequestInfoTypes = ({
    requestInfos,
    parsedSchemas,
    operationId,
    defaultType,
  }) =>
    _.reduce(
      requestInfos,
      (acc, requestInfo, status) => {
        const contentTypes = this.getContentTypes([requestInfo]);

        return [
          ...acc,
          {
            ...(requestInfo || {}),
            contentTypes: contentTypes,
            contentKind: this.getContentKind(contentTypes),
            type: this.schemaParserFabric.schemaUtils.safeAddNullToType(
              requestInfo,
              this.getTypeFromRequestInfo({
                requestInfo,
                parsedSchemas,
                operationId,
                defaultType,
              }),
            ),
            description:
              this.schemaParserFabric.schemaFormatters.formatDescription(
                requestInfo.description || "",
                true,
              ),
            status: _.isNaN(+status) ? status : +status,
            isSuccess: this.isSuccessStatus(status),
          },
        ];
      },
      [],
    );

  getResponseBodyInfo = (routeInfo, parsedSchemas) => {
    const { produces, operationId, responses } = routeInfo;

    const contentTypes = this.getContentTypes(responses, [
      ...(produces || []),
      routeInfo["x-accepts"],
    ]);

    const responseInfos = this.getRequestInfoTypes({
      requestInfos: responses,
      parsedSchemas,
      operationId,
      defaultType: this.config.defaultResponseType,
    });

    const successResponse = responseInfos.find(
      (response) => response.isSuccess,
    );
    const errorResponses = responseInfos.filter(
      (response) =>
        !response.isSuccess && response.type !== this.config.Ts.Keyword.Any,
    );

    const handleResponseHeaders = (src) => {
      if (!src) {
        return "headers: {},";
      }
      const headerTypes = Object.fromEntries(
        Object.entries(src).map(([k, v]) => {
          return [k, this.schemaUtils.getSchemaType(v)];
        }),
      );
      const r = `headers: { ${Object.entries(headerTypes)
        .map(([k, v]) => `"${k}": ${v}`)
        .join(",")} },`;
      return r;
    };

    return {
      contentTypes,
      responses: responseInfos,
      success: {
        schema: successResponse,
        type:
          (successResponse && successResponse.type) ||
          this.config.Ts.Keyword.Any,
      },
      error: {
        schemas: errorResponses,
        type:
          this.config.Ts.UnionType(
            errorResponses.map((response) => response.type),
          ) || this.config.Ts.Keyword.Any,
      },
      full: {
        types:
          this.config.Ts.UnionType(
            responseInfos.map(
              (response) => `{
      data: ${response.type}, status: ${response.status}, statusCode: ${
        response.status
      }, statusText: "${response.description}", ${handleResponseHeaders(
        response.headers,
      )} config: {} }`,
            ),
          ) || this.config.Ts.Keyword.Any,
      },
    };
  };

  convertRouteParamsIntoObject = (params) => {
    return _.reduce(
      params,
      (objectSchema, schemaPart) => {
        if (!schemaPart || !schemaPart.name) return objectSchema;

        let usageName = `${schemaPart.name}`;

        if (usageName.includes(".")) {
          usageName = camelCase(usageName);
        }

        return {
          ...objectSchema,
          properties: {
            ...objectSchema.properties,
            [usageName]: {
              ...schemaPart,
              ...(schemaPart.schema || {}),
              $origName: schemaPart.name,
              name: usageName,
            },
          },
        };
      },
      {
        properties: {},
        type: "object",
      },
    );
  };

  getRequestBodyInfo = (routeInfo, routeParams, parsedSchemas, routeName) => {
    const { requestBody, consumes, requestBodyName, operationId } = routeInfo;
    let schema = null;
    let content = null;

    const contentTypes = this.getContentTypes(
      [requestBody],
      [...(consumes || []), routeInfo["x-contentType"]],
    );
    let contentKind = this.getContentKind(contentTypes);

    let typeName = null;

    if (this.config.extractRequestBody) {
      typeName = this.schemaUtils.resolveTypeName(routeName.usage, {
        suffixes: this.config.extractingOptions.requestBodySuffix,
        resolver: this.config.extractingOptions.requestBodyNameResolver,
      });
    }

    if (routeParams.formData.length) {
      contentKind = CONTENT_KIND.FORM_DATA;
      schema = this.convertRouteParamsIntoObject(routeParams.formData);
      content = this.schemaParserFabric.getInlineParseContent(
        schema,
        typeName,
        [operationId],
      );
    } else if (contentKind === CONTENT_KIND.FORM_DATA) {
      schema = this.getSchemaFromRequestType(requestBody);
      content = this.schemaParserFabric.getInlineParseContent(
        schema,
        typeName,
        [operationId],
      );
    } else if (requestBody) {
      schema = this.getSchemaFromRequestType(requestBody);
      content = this.schemaParserFabric.schemaUtils.safeAddNullToType(
        requestBody,
        this.getTypeFromRequestInfo({
          requestInfo: requestBody,
          parsedSchemas,
          operationId,
          typeName,
        }),
      );

      // TODO: Refactor that.
      // It needed for cases when swagger schema is not declared request body type as form data
      // but request body data type contains form data types like File
      if (
        this.FORM_DATA_TYPES.some((dataType) =>
          _.includes(content, `: ${dataType}`),
        )
      ) {
        contentKind = CONTENT_KIND.FORM_DATA;
      }
    }

    if (schema && !schema.$ref && this.config.extractRequestBody) {
      schema = this.schemaParserFabric.createParsedComponent({
        schema,
        typeName,
        schemaPath: [operationId],
      });
      content = this.schemaParserFabric.getInlineParseContent({
        $ref: schema.$ref,
      });
    }

    return {
      paramName:
        requestBodyName ||
        (requestBody && requestBody.name) ||
        DEFAULT_BODY_ARG_NAME,
      contentTypes,
      contentKind,
      schema,
      type: content,
      required:
        requestBody &&
        (typeof requestBody.required === "undefined" || !!requestBody.required),
    };
  };

  createRequestParamsSchema = ({
    queryParams,
    queryObjectSchema,
    pathArgsSchemas,
    extractRequestParams,
    routeName,
  }) => {
    if (!queryParams || !queryParams.length) return null;

    const pathParams = _.reduce(
      pathArgsSchemas,
      (acc, pathArgSchema) => {
        if (pathArgSchema.name) {
          acc[pathArgSchema.name] = {
            ...pathArgSchema,
            in: "path",
          };
        }

        return acc;
      },
      {},
    );

    const fixedQueryParams = _.reduce(
      _.get(queryObjectSchema, "properties", {}),
      (acc, property, name) => {
        if (name && _.isObject(property)) {
          acc[name] = {
            ...property,
            in: "query",
          };
        }

        return acc;
      },
      {},
    );

    const schema = {
      ...queryObjectSchema,
      properties: {
        ...fixedQueryParams,
        ...pathParams,
      },
    };

    const fixedSchema = this.config.hooks.onCreateRequestParams(schema);

    if (fixedSchema) return fixedSchema;

    if (extractRequestParams) {
      const generatedTypeName = this.schemaUtils.resolveTypeName(
        routeName.usage,
        {
          suffixes: this.config.extractingOptions.requestParamsSuffix,
          resolver: this.config.extractingOptions.requestParamsNameResolver,
        },
      );

      return this.schemaParserFabric.createParsedComponent({
        typeName: generatedTypeName,
        schema: schema,
      });
    }

    return schema;
  };

  extractResponseBodyIfItNeeded = (routeInfo, responseBodyInfo, routeName) => {
    if (
      responseBodyInfo.responses.length &&
      responseBodyInfo.success &&
      responseBodyInfo.success.schema
    ) {
      const typeName = this.schemaUtils.resolveTypeName(routeName.usage, {
        suffixes: this.config.extractingOptions.responseBodySuffix,
        resolver: this.config.extractingOptions.responseBodyNameResolver,
      });

      const idx = responseBodyInfo.responses.indexOf(
        responseBodyInfo.success.schema,
      );

      let successResponse = responseBodyInfo.success;

      if (successResponse.schema && !successResponse.schema.$ref) {
        const schema = this.getSchemaFromRequestType(successResponse.schema);
        successResponse.schema = this.schemaParserFabric.createParsedComponent({
          schema,
          typeName,
          schemaPath: [routeInfo.operationId],
        });
        successResponse.type = this.schemaParserFabric.getInlineParseContent({
          $ref: successResponse.schema.$ref,
        });

        if (idx > -1) {
          _.assign(responseBodyInfo.responses[idx], {
            ...successResponse.schema,
            type: successResponse.type,
          });
        }
      }
    }
  };

  extractResponseErrorIfItNeeded = (routeInfo, responseBodyInfo, routeName) => {
    if (
      responseBodyInfo.responses.length &&
      responseBodyInfo.error.schemas &&
      responseBodyInfo.error.schemas.length
    ) {
      const typeName = this.schemaUtils.resolveTypeName(routeName.usage, {
        suffixes: this.config.extractingOptions.responseErrorSuffix,
        resolver: this.config.extractingOptions.responseErrorNameResolver,
      });

      const errorSchemas = responseBodyInfo.error.schemas
        .map(this.getSchemaFromRequestType)
        .filter(Boolean);

      if (!errorSchemas.length) return;

      const schema = this.schemaParserFabric.parseSchema(
        {
          oneOf: errorSchemas,
          title: errorSchemas
            .map((schema) => schema.title)
            .filter(Boolean)
            .join(" "),
          description: errorSchemas
            .map((schema) => schema.description)
            .filter(Boolean)
            .join("\n"),
        },
        null,
        [routeInfo.operationId],
      );
      const component = this.schemaComponentsMap.createComponent(
        this.schemaComponentsMap.createRef(["components", "schemas", typeName]),
        { ...schema },
      );
      responseBodyInfo.error.schemas = [component];
      responseBodyInfo.error.type = this.typeNameFormatter.format(
        component.typeName,
      );
    }
  };

  getRouteName = (rawRouteInfo) => {
    const { moduleName } = rawRouteInfo;
    const { routeNameDuplicatesMap, templatesToRender } = this.config;
    const routeNameTemplate = templatesToRender.routeName;

    const routeNameFromTemplate = this.templatesWorker.renderTemplate(
      routeNameTemplate,
      {
        routeInfo: rawRouteInfo,
      },
    );

    const routeName =
      this.config.hooks.onFormatRouteName(
        rawRouteInfo,
        routeNameFromTemplate,
      ) || routeNameFromTemplate;

    const duplicateIdentifier = `${moduleName}|${routeName}`;

    if (routeNameDuplicatesMap.has(duplicateIdentifier)) {
      routeNameDuplicatesMap.set(
        duplicateIdentifier,
        routeNameDuplicatesMap.get(duplicateIdentifier) + 1,
      );

      this.logger.warn(
        `Module "${moduleName}" already has method "${routeName}()"`,
        `\nThis method has been renamed to "${
          routeName + routeNameDuplicatesMap.get(duplicateIdentifier)
        }()" to solve conflict names.`,
      );
    } else {
      routeNameDuplicatesMap.set(duplicateIdentifier, 1);
    }

    const duplicates = routeNameDuplicatesMap.get(duplicateIdentifier);

    const routeNameInfo = {
      usage: routeName + (duplicates > 1 ? duplicates : ""),
      original: routeName,
      duplicate: duplicates > 1,
    };

    return (
      this.config.hooks.onCreateRouteName(routeNameInfo, rawRouteInfo) ||
      routeNameInfo
    );
  };

  parseRouteInfo = (
    rawRouteName,
    routeInfo,
    method,
    usageSchema,
    parsedSchemas,
  ) => {
    const { security: globalSecurity } = usageSchema;
    const { moduleNameIndex, moduleNameFirstTag, extractRequestParams } =
      this.config;
    const {
      operationId,
      requestBody,
      security,
      // eslint-disable-next-line no-unused-vars
      parameters,
      summary,
      description,
      tags,
      responses,
      // eslint-disable-next-line no-unused-vars
      requestBodyName,
      produces,
      consumes,
      ...otherInfo
    } = routeInfo;
    const {
      route,
      pathParams: pathParamsFromRouteName,
      queryParams: queryParamsFromRouteName,
    } = this.parseRouteName(rawRouteName);

    const routeId = generateId();
    const firstTag = tags && tags.length > 0 ? tags[0] : null;
    const moduleName =
      moduleNameFirstTag && firstTag
        ? _.camelCase(firstTag)
        : _.camelCase(_.compact(_.split(route, "/"))[moduleNameIndex]);
    let hasSecurity = !!(globalSecurity && globalSecurity.length);
    if (security) {
      hasSecurity = security.length > 0;
    }

    const routeParams = this.getRouteParams(
      routeInfo,
      pathParamsFromRouteName,
      queryParamsFromRouteName,
    );

    const pathArgs = routeParams.path.map((pathArgSchema) => ({
      name: pathArgSchema.name,
      optional: !pathArgSchema.required,
      // mark it as any for now, because "getInlineParseContent" breaks type names of extracted enums
      type: this.config.Ts.Keyword.Any,
      description: pathArgSchema.description,
    }));
    const pathArgsNames = pathArgs.map((arg) => arg.name);

    const responseBodyInfo = this.getResponseBodyInfo(routeInfo, parsedSchemas);

    const rawRouteInfo = {
      ...otherInfo,
      pathArgs,
      operationId,
      method,
      route: rawRouteName,
      moduleName,
      responsesTypes: responseBodyInfo.responses,
      description,
      tags,
      summary,
      responses,
      produces,
      requestBody,
      consumes,
    };

    const queryObjectSchema = this.convertRouteParamsIntoObject(
      routeParams.query,
    );
    const pathObjectSchema = this.convertRouteParamsIntoObject(
      routeParams.path,
    );
    const headersObjectSchema = this.convertRouteParamsIntoObject(
      routeParams.header,
    );

    const routeName = this.getRouteName(rawRouteInfo);

    const requestBodyInfo = this.getRequestBodyInfo(
      routeInfo,
      routeParams,
      parsedSchemas,
      routeName,
    );

    const requestParamsSchema = this.createRequestParamsSchema({
      queryParams: routeParams.query,
      pathArgsSchemas: routeParams.path,
      queryObjectSchema,
      extractRequestParams,
      routeName,
    });

    if (this.config.extractResponseBody) {
      this.extractResponseBodyIfItNeeded(
        routeInfo,
        responseBodyInfo,
        routeName,
      );
    }
    if (this.config.extractResponseError) {
      this.extractResponseErrorIfItNeeded(
        routeInfo,
        responseBodyInfo,
        routeName,
      );
    }

    const typeName = this.schemaUtils.resolveTypeName(routeName.usage, {
      suffixes: this.config.extractingOptions.requestParamsSuffix,
      resolver: this.config.extractingOptions.requestParamsNameResolver,
      shouldReserve: false,
    });

    const queryType = routeParams.query.length
      ? this.schemaParserFabric.getInlineParseContent(queryObjectSchema, null, [
          typeName,
        ])
      : null;
    const pathType = routeParams.path.length
      ? this.schemaParserFabric.getInlineParseContent(pathObjectSchema, null, [
          typeName,
        ])
      : null;
    const headersType = routeParams.header.length
      ? this.schemaParserFabric.getInlineParseContent(
          headersObjectSchema,
          null,
          [typeName],
        )
      : null;

    const nameResolver = new SpecificArgNameResolver(
      this.config,
      this.logger,
      pathArgsNames,
    );

    const specificArgs = {
      query: queryType
        ? {
            name: nameResolver.resolve(RESERVED_QUERY_ARG_NAMES),
            optional: this.schemaParserFabric.parseSchema(
              queryObjectSchema,
              null,
              [routeName.usage],
            ).allFieldsAreOptional,
            type: queryType,
          }
        : void 0,
      body: requestBodyInfo.type
        ? {
            name: nameResolver.resolve([
              requestBodyInfo.paramName,
              ...RESERVED_BODY_ARG_NAMES,
            ]),
            optional: !requestBodyInfo.required,
            type: requestBodyInfo.type,
          }
        : void 0,
      pathParams: pathType
        ? {
            name: nameResolver.resolve(RESERVED_PATH_ARG_NAMES),
            optional: this.schemaParserFabric.parseSchema(
              pathObjectSchema,
              null,
              [routeName.usage],
            ).allFieldsAreOptional,
            type: pathType,
          }
        : void 0,
      headers: headersType
        ? {
            name: nameResolver.resolve(RESERVED_HEADER_ARG_NAMES),
            optional: this.schemaParserFabric.parseSchema(
              headersObjectSchema,
              null,
              [routeName.usage],
            ).allFieldsAreOptional,
            type: headersType,
          }
        : void 0,
    };

    pathArgs.forEach((pathArg, i) => {
      pathArg.type = this.schemaParserFabric.getInlineParseContent(
        routeParams.path[i].schema,
        null,
        [typeName],
      );
    });

    return {
      id: routeId,
      namespace: _.replace(moduleName, /^(\d)/, "v$1"),
      routeName,
      routeParams,
      requestBodyInfo,
      responseBodyInfo,
      specificArgs,
      queryObjectSchema,
      pathObjectSchema,
      headersObjectSchema,
      responseBodySchema: responseBodyInfo.success.schema,
      requestBodySchema: requestBodyInfo.schema,
      specificArgNameResolver: nameResolver,
      request: {
        contentTypes: requestBodyInfo.contentTypes,
        parameters: pathArgs,
        path: route,
        formData: requestBodyInfo.contentKind === CONTENT_KIND.FORM_DATA,
        isQueryBody: requestBodyInfo.contentKind === CONTENT_KIND.URL_ENCODED,
        security: hasSecurity,
        method: method,
        requestParams: requestParamsSchema,

        payload: specificArgs.body,
        query: specificArgs.query,
        pathParams: specificArgs.pathParams,
        headers: specificArgs.headers,
      },
      response: {
        contentTypes: responseBodyInfo.contentTypes,
        type: responseBodyInfo.success.type,
        errorType: responseBodyInfo.error.type,
        fullTypes: responseBodyInfo.full.types,
      },
      raw: rawRouteInfo,
    };
  };

  attachSchema = ({ usageSchema, parsedSchemas }) => {
    this.config.routeNameDuplicatesMap.clear();

    const pathsEntries = _.entries(usageSchema.paths);

    _.forEach(pathsEntries, ([rawRouteName, routeInfoByMethodsMap]) => {
      const routeInfosMap = this.createRequestsMap(routeInfoByMethodsMap);

      _.forEach(routeInfosMap, (routeInfo, method) => {
        const parsedRouteInfo = this.parseRouteInfo(
          rawRouteName,
          routeInfo,
          method,
          usageSchema,
          parsedSchemas,
        );
        const processedRouteInfo =
          this.config.hooks.onCreateRoute(parsedRouteInfo);
        if (processedRouteInfo !== false) {
          const route = processedRouteInfo || parsedRouteInfo;

          if (!this.hasSecurityRoutes && route.security) {
            this.hasSecurityRoutes = route.security;
          }
          if (!this.hasQueryRoutes && route.hasQuery) {
            this.hasQueryRoutes = route.hasQuery;
          }
          if (!this.hasFormDataRoutes && route.hasFormDataParams) {
            this.hasFormDataRoutes = route.hasFormDataParams;
          }

          this.routes.push(route);
        }
      });
    });
  };

  getGroupedRoutes = () => {
    const groupedRoutes = this.routes.reduce(
      (modules, route) => {
        if (route.namespace) {
          if (!modules[route.namespace]) {
            modules[route.namespace] = [];
          }

          modules[route.namespace].push(route);
        } else {
          modules.$outOfModule.push(route);
        }

        return modules;
      },
      {
        $outOfModule: [],
      },
    );

    const routeGroups = _.reduce(
      groupedRoutes,
      (acc, routesGroup, moduleName) => {
        if (moduleName === "$outOfModule") {
          acc.outOfModule = routesGroup;
        } else {
          if (!acc.combined) acc.combined = [];

          acc.combined.push({
            moduleName,
            routes: _.map(routesGroup, (route) => {
              const { original: originalName, usage: usageName } =
                route.routeName;

              // TODO: https://github.com/acacode/swagger-typescript-api/issues/152
              // TODO: refactor
              if (
                routesGroup.length > 1 &&
                usageName !== originalName &&
                !_.some(
                  routesGroup,
                  ({ routeName, id }) =>
                    id !== route.id && originalName === routeName.original,
                )
              ) {
                return {
                  ...route,
                  routeName: {
                    ...route.routeName,
                    usage: originalName,
                  },
                };
              }

              return route;
            }),
          });
        }
        return acc;
      },
      {},
    );

    if (this.config.sortRoutes) {
      if (routeGroups.outOfModule) {
        routeGroups.outOfModule = this.sortRoutes(routeGroups.outOfModule);
      }
      if (routeGroups.combined) {
        _.each(routeGroups.combined, (routeGroup) => {
          routeGroup.routes = this.sortRoutes(routeGroup.routes);
        });
      }
    }

    return routeGroups;
  };

  sortRoutes = (routes) => {
    return _.slice(routes).sort((routeA, routeB) =>
      routeA.routeName.usage.localeCompare(routeB.routeName.usage),
    );
  };
}

module.exports = {
  SchemaRoutes,
};
