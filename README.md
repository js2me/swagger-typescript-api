# swagger-typescript-api  

[![NPM badge](https://img.shields.io/npm/v/swagger-typescript-api.svg)](https://www.npmjs.com/package/swagger-typescript-api) 
[![CI](https://github.com/acacode/swagger-typescript-api/actions/workflows/main.yml/badge.svg?branch=next)](https://github.com/acacode/swagger-typescript-api/actions/workflows/main.yml) <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-33-orange.svg)](#contributors)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

<img src="https://raw.githubusercontent.com/acacode/swagger-typescript-api/master/assets/swagger-typescript-api-logo.png" align="left"
     title="swagger-typescript-api logo by js2me" width="93" height="180">

Generate api via swagger scheme.  
Supports OA 3.0, 2.0, JSON, yaml  
Generated api module use [**Fetch Api**](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) or [**Axios**](https://github.com/axios/axios) to make requests.  

<br>
<br>

Any questions you can ask [**here**](https://github.com/acacode/swagger-typescript-api/issues) or in [**our slack**](https://join.slack.com/t/acacode/shared_invite/enQtOTQ5ODgyODQzMzYwLWYxOGI1MzQ3Yzg1ZWI5ZTI5NzNiZjExZTE5OWI1YjQ4NjBiNTk4NWVlNjM5YmU1ZWI2ZDkyMzZkZGIxNjA5NTQ)(**#swagger-typescript-api** channel)
  
<br>  

![](https://raw.githubusercontent.com/acacode/swagger-typescript-api/master/assets/components-converter-example.jpg)    

P.S. If you are creating the PR, please check your changes with using command `npm run prepare`  
P.S. If you want to contribute please use the `next` branch. All PRs that has target `master` will be declined!  


Thanks to [Jetbrains](https://www.jetbrains.com/?from=swaggertypescriptapi) for providing a free license for their excellent Webstorm IDE.  
<a href="https://www.jetbrains.com/?from=swaggertypescriptapi">
  <img src="https://upload.wikimedia.org/wikipedia/commons/1/1a/JetBrains_Logo_2016.svg" alt="Jetbrains">
</a>


## 👀 Examples  

All examples you can find [**here**](https://github.com/acacode/swagger-typescript-api/tree/master/tests)  

## 📄 Usage  

```muse
Usage: sta [options]
Usage: swagger-typescript-api [options]
Usage: swagger-typescript-api generate-templates [options]

Options:
  -v, --version                 output the current version
  -p, --path <string>           path/url to swagger scheme
  -o, --output <string>         output path of typescript api file (default: "./")
  -n, --name <string>           name of output typescript api file (default: "Api.ts")
  -t, --templates <string>      path to folder containing templates
  -d, --default-as-success      use "default" response status code as success response too.
                                some swagger schemas use "default" response status code as success response type by default. (default: false)
  -r, --responses               generate additional information about request responses
                                also add typings for bad responses (default: false)
  --union-enums                 generate all "enum" types as union types (T1 | T2 | TN) (default: false)
  --add-readonly                generate readonly properties (default: false)
  --route-types                 generate type definitions for API routes (default: false)
  --no-client                   do not generate an API class
  --enum-names-as-values        use values in 'x-enumNames' as enum values (not only as keys) (default: false)
  --extract-request-params      extract request params to data contract (Also combine path params and query params into one object) (default: false)
  --extract-request-body        extract request body type to data contract (default: false)
  --extract-response-body       extract response body type to data contract (default: false)
  --extract-response-error      extract response error type to data contract (default: false)
  --modular                     generate separated files for http client, data contracts, and routes (default: false)
  --js                          generate js api module with declaration file (default: false)
  --module-name-index <number>  determines which path index should be used for routes separation (example: GET:/fruites/getFruit -> index:0 -> moduleName -> fruites) (default: 0)
  --module-name-first-tag       splits routes based on the first tag (default: false)
  --disableStrictSSL            disabled strict SSL (default: false)
  --disableProxy                disabled proxy (default: false)
  --axios                       generate axios http client (default: false)
  --ky                          generate ky http client (default: false)
  --unwrap-response-data        unwrap the data item from the response (default: false)
  --disable-throw-on-error      Do not throw an error when response.ok is not true (default: false)
  --single-http-client          Ability to send HttpClient instance to Api constructor (default: false)
  --silent                      Output only errors to console (default: false)
  --default-response <type>     default type for empty response schema (default: "void")
  --type-prefix <string>        data contract name prefix (default: "")
  --type-suffix <string>        data contract name suffix (default: "")
  --clean-output                clean output folder before generate api. WARNING: May cause data loss (default: false)
  --api-class-name <string>     name of the api class (default: "Api")
  --patch                       fix up small errors in the swagger source definition (default: false)
  --debug                       additional information about processes inside this tool (default: false)
  --another-array-type          generate array types as Array<Type> (by default Type[]) (default: false)
  --sort-types                  sort fields and types (default: false)
  --sort-routes                 sort routes in alphabetical order (default: false)
  --custom-config <string>      custom config: primitiveTypeConstructs, hooks, ...  (default: "")
  --extract-enums               extract all enums from inline interface\type content to typescript enum construction (default: false)
  -h, --help                    display help for command

Commands:
  generate-templates              Generate ".ejs" templates needed for generate api
    -o, --output <string>         output path of generated templates
    -m, --modular                 generate templates needed to separate files for http client, data contracts, and routes (default: false)
    --http-client <string>        http client type (possible values: "fetch", "axios") (default: "fetch")
    -c, --clean-output            clean output folder before generate template. WARNING: May cause data loss (default: false)
    -r, --rewrite                 rewrite content in existing templates (default: false)
    --silent                      Output only errors to console (default: false)
    -h, --help                    display help for command
```

Also you can use `npx`:  
```
 npx swagger-typescript-api -p ./swagger.json -o ./src -n myApi.ts
```

You can use this package from nodejs:
```js
const { generateApi, generateTemplates } = require('swagger-typescript-api');
const path = require("path");
const fs = require("fs");

/* NOTE: all fields are optional expect one of `input`, `url`, `spec` */
generateApi({
  name: "MySuperbApi.ts",
  // set to `false` to prevent the tool from writing to disk
  output: path.resolve(process.cwd(), "./src/__generated__"),
  url: 'http://api.com/swagger.json',
  input: path.resolve(process.cwd(), './foo/swagger.json'),
  spec: {
    swagger: "2.0",
    info: {
      version: "1.0.0",
      title: "Swagger Petstore",
    },
    // ...
  },
  templates: path.resolve(process.cwd(), './api-templates'),
  httpClientType: "axios", // or "fetch" or "ky"
  defaultResponseAsSuccess: false,
  generateClient: true,
  generateRouteTypes: false,
  generateResponses: true,
  toJS: false,
  extractRequestParams: false,
  extractRequestBody: false,
  extractEnums: false,
  unwrapResponseData: false,
  prettier: { // By default prettier config is load from your project
    printWidth: 120,
    tabWidth: 2,
    trailingComma: "all",
    parser: "typescript",
  },
  defaultResponseType: "void",
  singleHttpClient: true,
  cleanOutput: false,
  enumNamesAsValues: false,
  moduleNameFirstTag: false,
  generateUnionEnums: false,
  typePrefix: '',
  typeSuffix: '',
  enumKeyPrefix: '',
  enumKeySuffix: '',
  addReadonly: false,
  sortTypes: false,
  sortRouters: false,
  extractingOptions: {
    requestBodySuffix: ["Payload", "Body", "Input"],
    requestParamsSuffix: ["Params"],
    responseBodySuffix: ["Data", "Result", "Output"],
    responseErrorSuffix: ["Error", "Fail", "Fails", "ErrorData", "HttpError", "BadResponse"],
  },
  /** allow to generate extra files based with this extra templates, see more below */
  extraTemplates: [],
  anotherArrayType: false,
  fixInvalidTypeNamePrefix: "Type",
  fixInvalidEnumKeyPrefix: "Value", 
  codeGenConstructs: (constructs) => ({
    ...constructs,
    RecordType: (key, value) => `MyRecord<key, value>`
  }),
  primitiveTypeConstructs: (constructs) => ({
      ...constructs,
      string: {
        'date-time': 'Date'
      }
  }),
  hooks: {
    onCreateComponent: (component) => {},
    onCreateRequestParams: (rawType) => {},
    onCreateRoute: (routeData) => {},
    onCreateRouteName: (routeNameInfo, rawRouteInfo) => {},
    onFormatRouteName: (routeInfo, templateRouteName) => {},
    onFormatTypeName: (typeName, rawTypeName, schemaType) => {},
    onInit: (configuration) => {},
    onPreParseSchema: (originalSchema, typeName, schemaType) => {},
    onParseSchema: (originalSchema, parsedSchema) => {},
    onPrepareConfig: (currentConfiguration) => {},
  }
})
  .then(({ files, configuration }) => {
    files.forEach(({ content, name }) => {
      fs.writeFile(path, content);
    });
  })
  .catch(e => console.error(e))


generateTemplates({
  cleanOutput: false,
  output: PATH_TO_OUTPUT_DIR,
  httpClientType: "fetch",
  modular: false,
  silent: false,
  rewrite: false,
})

```


## 💎 options   
### **`--templates`**  
This option needed for cases when you don't want to use the default `swagger-typescript-api` output structure  
You can create custom templates with extensions `.ejs` or `.eta`  

Templates:  
- `api.ejs` - *(generates file)* Api class module (locations: [/templates/default](https://github.com/acacode/swagger-typescript-api/tree/next/templates/default/api.ejs), [/templates/modular](https://github.com/acacode/swagger-typescript-api/tree/next/templates/modular/api.ejs))  
- `data-contracts.ejs` - *(generates file)* all types (data contracts) from swagger schema (locations: [/templates/base](https://github.com/acacode/swagger-typescript-api/tree/next/templates/base/data-contracts.ejs))  
- `http-client.ejs` - *(generates file)* HttpClient class module (locations: [/templates/base](https://github.com/acacode/swagger-typescript-api/tree/next/templates/base/http-client.ejs))  
- `procedure-call.ejs` - *(subtemplate)* route in Api class (locations: [/templates/default](https://github.com/acacode/swagger-typescript-api/tree/next/templates/default/procedure-call.ejs), [/templates/modular](https://github.com/acacode/swagger-typescript-api/tree/next/templates/modular/procedure-call.ejs))  
- `route-docs.ejs` - *(generates file)* documentation for route in Api class (locations: [/templates/base](https://github.com/acacode/swagger-typescript-api/tree/next/templates/base/route-docs.ejs))  
- `route-name.ejs` - *(subtemplate)*   route name for route in Api class (locations: [/templates/base](https://github.com/acacode/swagger-typescript-api/tree/next/templates/base/route-name.ejs))  
- `route-type.ejs` - *(`--route-types` option)* *(subtemplate)* (locations: [/templates/base](https://github.com/acacode/swagger-typescript-api/tree/next/templates/base/route-type.ejs))  
- `route-types.ejs` - *(`--route-types` option)* *(subtemplate)* (locations: [/templates/base](https://github.com/acacode/swagger-typescript-api/tree/next/templates/base/route-types.ejs))
- `data-contract-jsdoc.ejs` - *(subtemplate)* generates JSDOC for data contract (locations: [/templates/base](https://github.com/acacode/swagger-typescript-api/tree/next/templates/base/data-contract-jsdoc.ejs))  

[//]: # (- `enum-data-contract.ejs` - *&#40;subtemplate&#41;* generates `enum` data contract &#40;locations: [/templates/base]&#40;https://github.com/acacode/swagger-typescript-api/tree/next/templates/base/enum-data-contract.ejs&#41;&#41;)
[//]: # (- `interface-data-contract.ejs` - *&#40;subtemplate&#41;* generates `interface` data contract &#40;locations: [/templates/base]&#40;https://github.com/acacode/swagger-typescript-api/tree/next/templates/base/interface-data-contract.ejs&#41;&#41;)
[//]: # (- `type-data-contract.ejs` - *&#40;subtemplate&#41;* generates `type` data contract &#40;locations: [/templates/base]&#40;https://github.com/acacode/swagger-typescript-api/tree/next/templates/base/type-data-contract.ejs&#41;&#41;)


How to use it:  
1. copy `swagger-typescript-api` templates into your place in project
    - from [/templates/default](https://github.com/acacode/swagger-typescript-api/tree/next/templates/default) for single api file  
    - from [/templates/modular](https://github.com/acacode/swagger-typescript-api/tree/next/templates/modular) for multiple api files (with `--modular` option)  
    - from [/templates/base](https://github.com/acacode/swagger-typescript-api/tree/next/templates/base) for base templates (templates using both in default and modular)  
1. add `--templates PATH_TO_YOUR_TEMPLATES` option  
2. modify [ETA](https://eta.js.org/docs/syntax) templates as you like  

NOTE:  
  Eta has special directive to render template in your Eta templates - `includeFile(pathToTemplate, payload)`  
  If you want to use some default templates from this tool you can use path prefixes: `@base`, `@default`, `@modular`.  
    `@base` - [path to base templates](https://github.com/acacode/swagger-typescript-api/tree/next/templates/base)  
    `@default` - [path to single api file templates](https://github.com/acacode/swagger-typescript-api/tree/next/templates/default)  
    `@modular` - [path to multiple api files templates](https://github.com/acacode/swagger-typescript-api/tree/next/templates/modular)  
  Examples:  
    - `includeFile("@base/data-contracts.ejs", { ...yourData, ...it })`  
    - `includeFile("@default/api.ejs", { ...yourData, ...it })`  
    - `includeFile("@default/procedure-call.ejs", { ...yourData, ...it })`  
    - `includeFile("@modular/api.ejs", { ...yourData, ...it })`  
    - `includeFile("@modular/procedure-call.ejs", { ...yourData, ...it })`  
    - `includeFile("@base/route-docs.ejs", { ...yourData, ...it })`  
    - `includeFile("@base/route-name.ejs", { ...yourData, ...it })`  
    - `includeFile("@base/route-type.ejs", { ...yourData, ...it })`  
    - `includeFile("@base/route-types.ejs", { ...yourData, ...it })`  

### **`--module-name-index`**  
This option should be used in cases when you have api with one global prefix like `/api`   
Example:   
`GET:/api/fruits/getFruits`  
`POST:/api/fruits/addFruits`  
`GET:/api/vegetables/addVegetable`  
with `--module-name-index 0` Api class will have one property `api`  
When we change it to `--module-name-index 1` then Api class have two properties `fruits` and `vegetables`  

### **`--module-name-first-tag`**  
This option will group your API operations based on their first tag - mirroring how the Swagger UI groups displayed operations  

### `extraTemplates` (NodeJS option)  
type `(Record<string, any> & { name: string, path: string })[]`  
This thing allow you to generate extra ts\js files based on extra templates (one extra template for one ts\js file)   
[Example here](https://github.com/acacode/swagger-typescript-api/tree/next/tests/spec/extra-templates)    
 

## `generate-templates` command    
This command allows you to generate source templates which using with option `--templates`

## Modification internal codegen structs with NodeJS API:  

You are able to modify TypeScript internal structs using for generating output with using `generateApi` options `codeGenConstructs` and `primitiveTypeConstructs`.  

### `codeGenConstructs`  

This option has type `(struct: CodeGenConstruct) => Partial<CodeGenConstruct>`.

```ts
generateApi({
  // ...
  codeGenConstructs: (struct) => ({
      Keyword: {
          Number: "number",
          String: "string",
          Boolean: "boolean",
          Any: "any",
          Void: "void",
          Unknown: "unknown",
          Null: "null",
          Undefined: "undefined",
          Object: "object",
          File: "File",
          Date: "Date",
          Type: "type",
          Enum: "enum",
          Interface: "interface",
          Array: "Array",
          Record: "Record",
          Intersection: "&",
          Union: "|",
      },
      CodeGenKeyword: {
          UtilRequiredKeys: "UtilRequiredKeys",
      },
      /**
       * $A[] or Array<$A>
       */
      ArrayType: (content) => {
          if (this.anotherArrayType) {
              return `Array<${content}>`;
          }

          return `(${content})[]`;
      },
      /**
       * "$A"
       */
      StringValue: (content) => `"${content}"`,
      /**
       * $A
       */
      BooleanValue: (content) => `${content}`,
      /**
       * $A
       */
      NumberValue: (content) => `${content}`,
      /**
       * $A
       */
      NullValue: (content) => content,
      /**
       * $A1 | $A2
       */
      UnionType: (contents) => _.join(_.uniq(contents), ` | `),
      /**
       * ($A1)
       */
      ExpressionGroup: (content) => (content ? `(${content})` : ""),
      /**
       * $A1 & $A2
       */
      IntersectionType: (contents) => _.join(_.uniq(contents), ` & `),
      /**
       * Record<$A1, $A2>
       */
      RecordType: (key, value) => `Record<${key}, ${value}>`,
      /**
       * readonly $key?:$value
       */
      TypeField: ({ readonly, key, optional, value }) =>
          _.compact([readonly && "readonly ", key, optional && "?", ": ", value]).join(""),
      /**
       * [key: $A1]: $A2
       */
      InterfaceDynamicField: (key, value) => `[key: ${key}]: ${value}`,
      /**
       * $A1 = $A2
       */
      EnumField: (key, value) => `${key} = ${value}`,
      /**
       * $A0.key = $A0.value,
       * $A1.key = $A1.value,
       * $AN.key = $AN.value,
       */
      EnumFieldsWrapper: (contents) =>
          _.map(contents, ({ key, value }) => `  ${key} = ${value}`).join(",\n"),
      /**
       * {\n $A \n}
       */
      ObjectWrapper: (content) => `{\n${content}\n}`,
      /**
       * /** $A *\/
       */
      MultilineComment: (contents, formatFn) =>
          [
              ...(contents.length === 1
                  ? [`/** ${contents[0]} */`]
                  : ["/**", ...contents.map((content) => ` * ${content}`), " */"]),
          ].map((part) => `${formatFn ? formatFn(part) : part}\n`),
      /**
       * $A1<...$A2.join(,)>
       */
      TypeWithGeneric: (typeName, genericArgs) => {
          return `${typeName}${genericArgs.length ? `<${genericArgs.join(",")}>` : ""}`;
      },
  })
})
```  

For example, if you need to generate output `Record<string, any>` instead of `object` you can do it with using following code:  

```ts
generateApi({
    // ...
    codeGenConstructs: (struct) => ({
        Keyword: {
            Object: "Record<string, any>",
        }
    })
})
```

### `primitiveTypeConstructs`  

It is type mapper or translator swagger schema objects. `primitiveTypeConstructs` translates `type`/`format` schema fields to typescript structs.  
This option has type  
```ts
type PrimitiveTypeStructValue =
  | string
  | ((schema: Record<string, any>, parser: import("./src/schema-parser/schema-parser").SchemaParser) => string);

type PrimitiveTypeStruct = Record<
  "integer" | "number" | "boolean" | "object" | "file" | "string" | "array",
  string | ({ $default: PrimitiveTypeStructValue } & Record<string, PrimitiveTypeStructValue>)
>

declare const primitiveTypeConstructs: (struct: PrimitiveTypeStruct) => Partial<PrimitiveTypeStruct>

generateApi({
    // ...
    primitiveTypeConstructs: (struct) => ({
        integer: () => "number",
        number: () => "number",
        boolean: () => "boolean",
        object: () => "object",
        file: () => "File",
        string: {
            $default: () => "string",

            /** formats */
            binary: () => "File",
            file: () => "File",
            "date-time": () => "string",
            time: () => "string",
            date: () => "string",
            duration: () => "string",
            email: () => "string",
            "idn-email": () => "string",
            "idn-hostname": () => "string",
            ipv4: () => "string",
            ipv6: () => "string",
            uuid: () => "string",
            uri: () => "string",
            "uri-reference": () => "string",
            "uri-template": () => "string",
            "json-pointer": () => "string",
            "relative-json-pointer": () => "string",
            regex: () => "string",
        },
        array: (schema, parser) => {
            const content = parser.getInlineParseContent(schema.items);
            return parser.safeAddNullToType(schema, `(${content})[]`);
        },
    })
})
```

For example, if you need to change `"string"/"date-time"` default output as `string` to `Date` you can do it with using following code:  

```ts

generateApi({
    primitiveTypeConstructs: (struct) => ({
        string: {
            "date-time": "Date",
        },
    })
})

```

See more about [swagger schema type/format data here](https://json-schema.org/understanding-json-schema/reference/string.html#dates-and-times)  

## 📄 Mass media  

- [5 Lessons learned about swagger-typescript-api](https://christo8989.medium.com/5-lessons-learned-about-swagger-typescript-api-511240b34c1)  
- [Why Swagger schemes are needed in frontend development ?](https://dev.to/js2me/why-swagger-schemes-are-needed-in-frontend-development-2cb4)  
- [Migration en douceur vers TypeScript (French)](https://www.premieroctet.com/blog/migration-typescript/)  
- [swagger-typescript-api usage (Japanese)](https://zenn.dev/watahaya/articles/2f4a716c47903b)   

## 🛠️ Contribution  

❗❗❗ Please use the `next` branch :)   

If you need to check your changes at schemas in `tests` folder before create a PR just run command `npm run test-all`  

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/js2me"><img src="https://avatars1.githubusercontent.com/u/16340911?v=4?s=100" width="100px;" alt="Sergey S. Volkov"/><br /><sub><b>Sergey S. Volkov</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=js2me" title="Code">💻</a> <a href="https://github.com/acacode/swagger-typescript-api/commits?author=js2me" title="Documentation">📖</a> <a href="#design-js2me" title="Design">🎨</a> <a href="#example-js2me" title="Examples">💡</a> <a href="#maintenance-js2me" title="Maintenance">🚧</a> <a href="#ideas-js2me" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3Ajs2me" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://github.com/andrefilimono"><img src="https://avatars0.githubusercontent.com/u/7794526?v=4?s=100" width="100px;" alt="Filimonov Andrey"/><br /><sub><b>Filimonov Andrey</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=andrefilimono" title="Code">💻</a> <a href="#ideas-andrefilimono" title="Ideas, Planning, & Feedback">🤔</a> <a href="#design-andrefilimono" title="Design">🎨</a></td>
      <td align="center"><a href="https://github.com/Fl0pZz"><img src="https://avatars2.githubusercontent.com/u/9510124?v=4?s=100" width="100px;" alt="Rafael Fakhreev"/><br /><sub><b>Rafael Fakhreev</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=Fl0pZz" title="Code">💻</a> <a href="#ideas-Fl0pZz" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center"><a href="https://azzola.dev"><img src="https://avatars3.githubusercontent.com/u/1297597?v=4?s=100" width="100px;" alt="Lucas Azzola"/><br /><sub><b>Lucas Azzola</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=azz" title="Code">💻</a> <a href="#ideas-azz" title="Ideas, Planning, & Feedback">🤔</a> <a href="#design-azz" title="Design">🎨</a></td>
      <td align="center"><a href="https://github.com/JennieJi"><img src="https://avatars3.githubusercontent.com/u/1913045?v=4?s=100" width="100px;" alt="Jennie"/><br /><sub><b>Jennie</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=JennieJi" title="Code">💻</a> <a href="#ideas-JennieJi" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center"><a href="https://github.com/jomarquez21"><img src="https://avatars1.githubusercontent.com/u/16705169?v=4?s=100" width="100px;" alt="Jose Enrique Marquez"/><br /><sub><b>Jose Enrique Marquez</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=jomarquez21" title="Code">💻</a> <a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3Ajomarquez21" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://glassechidna.com.au"><img src="https://avatars1.githubusercontent.com/u/482276?v=4?s=100" width="100px;" alt="Benjamin Dobell"/><br /><sub><b>Benjamin Dobell</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=Benjamin-Dobell" title="Code">💻</a> <a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3ABenjamin-Dobell" title="Bug reports">🐛</a></td>
    </tr>
    <tr>
      <td align="center"><a href="http://fixate.it"><img src="https://avatars0.githubusercontent.com/u/1510520?v=4?s=100" width="100px;" alt="Larry Botha"/><br /><sub><b>Larry Botha</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=larrybotha" title="Code">💻</a> <a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3Alarrybotha" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://github.com/nikalun"><img src="https://avatars3.githubusercontent.com/u/13102962?v=4?s=100" width="100px;" alt="Nikolay Lukinykh"/><br /><sub><b>Nikolay Lukinykh</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=nikalun" title="Code">💻</a> <a href="#ideas-nikalun" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3Anikalun" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://github.com/Mvbraathen"><img src="https://avatars0.githubusercontent.com/u/16756739?v=4?s=100" width="100px;" alt="Marius Bråthen"/><br /><sub><b>Marius Bråthen</b></sub></a><br /><a href="#security-Mvbraathen" title="Security">🛡️</a></td>
      <td align="center"><a href="https://github.com/xesjkeee"><img src="https://avatars2.githubusercontent.com/u/17751886?v=4?s=100" width="100px;" alt="Evgeny Vlasov"/><br /><sub><b>Evgeny Vlasov</b></sub></a><br /><a href="#ideas-xesjkeee" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center"><a href="https://github.com/kel666"><img src="https://avatars1.githubusercontent.com/u/2040661?v=4?s=100" width="100px;" alt="Fabio"/><br /><sub><b>Fabio</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3Akel666" title="Bug reports">🐛</a> <a href="https://github.com/acacode/swagger-typescript-api/commits?author=kel666" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/Fabiencdp"><img src="https://avatars.githubusercontent.com/u/6182473?v=4?s=100" width="100px;" alt="Fabien"/><br /><sub><b>Fabien</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3AFabiencdp" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://about.me/julienrousseau"><img src="https://avatars.githubusercontent.com/u/3296671?v=4?s=100" width="100px;" alt="Rousseau Julien"/><br /><sub><b>Rousseau Julien</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3ARoXuS" title="Bug reports">🐛</a></td>
    </tr>
    <tr>
      <td align="center"><a href="http://sebastianarias.dev"><img src="https://avatars.githubusercontent.com/u/9751266?v=4?s=100" width="100px;" alt="Sebastián Arias"/><br /><sub><b>Sebastián Arias</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3ALarox" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://github.com/Styn"><img src="https://avatars.githubusercontent.com/u/6705137?v=4?s=100" width="100px;" alt="Stijn Lammens"/><br /><sub><b>Stijn Lammens</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3AStyn" title="Bug reports">🐛</a> <a href="https://github.com/acacode/swagger-typescript-api/commits?author=Styn" title="Code">💻</a></td>
      <td align="center"><a href="http://emilecantin.com"><img src="https://avatars.githubusercontent.com/u/885486?v=4?s=100" width="100px;" alt="Emile Cantin"/><br /><sub><b>Emile Cantin</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3Aemilecantin" title="Bug reports">🐛</a> <a href="https://github.com/acacode/swagger-typescript-api/commits?author=emilecantin" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/armsnyder"><img src="https://avatars.githubusercontent.com/u/9969202?v=4?s=100" width="100px;" alt="Adam Snyder"/><br /><sub><b>Adam Snyder</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=armsnyder" title="Code">💻</a> <a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3Aarmsnyder" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://github.com/jnpoyser"><img src="https://avatars.githubusercontent.com/u/7920428?v=4?s=100" width="100px;" alt="James Poyser"/><br /><sub><b>James Poyser</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=jnpoyser" title="Code">💻</a> <a href="#ideas-jnpoyser" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center"><a href="http://ru.linkedin.com/in/lisikhin"><img src="https://avatars.githubusercontent.com/u/475367?v=4?s=100" width="100px;" alt="Alexey"/><br /><sub><b>Alexey</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3ANihisil" title="Bug reports">🐛</a></td>
      <td align="center"><a href="http://imaniu.com"><img src="https://avatars.githubusercontent.com/u/50100681?v=4?s=100" width="100px;" alt="江麻妞"/><br /><sub><b>江麻妞</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=jiangmaniu" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center"><a href="https://kspr.dev"><img src="https://avatars.githubusercontent.com/u/5294519?v=4?s=100" width="100px;" alt="Kasper Moskwiak"/><br /><sub><b>Kasper Moskwiak</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=kmoskwiak" title="Code">💻</a> <a href="#ideas-kmoskwiak" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center"><a href="https://github.com/baggoedw"><img src="https://avatars.githubusercontent.com/u/92381702?v=4?s=100" width="100px;" alt="baggoedw"/><br /><sub><b>baggoedw</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=baggoedw" title="Code">💻</a></td>
      <td align="center"><a href="https://marcusdunn.github.io"><img src="https://avatars.githubusercontent.com/u/51931484?v=4?s=100" width="100px;" alt="Marcus Dunn"/><br /><sub><b>Marcus Dunn</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=MarcusDunn" title="Code">💻</a> <a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3AMarcusDunn" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://www.danielplayfaircal.com/"><img src="https://avatars.githubusercontent.com/u/1217649?v=4?s=100" width="100px;" alt="Daniel Playfair Cal"/><br /><sub><b>Daniel Playfair Cal</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=hedgepigdaniel" title="Code">💻</a> <a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3Ahedgepigdaniel" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://www.linkedin.com/in/patrick-shaw/"><img src="https://avatars.githubusercontent.com/u/5153619?v=4?s=100" width="100px;" alt="Patrick Shaw"/><br /><sub><b>Patrick Shaw</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/pulls?q=is%3Apr+reviewed-by%3APatrickShaw" title="Reviewed Pull Requests">👀</a></td>
      <td align="center"><a href="http://brook.dev"><img src="https://avatars.githubusercontent.com/u/9323190?v=4?s=100" width="100px;" alt="Brook Jordan"/><br /><sub><b>Brook Jordan</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=brookjordan" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/RoCat"><img src="https://avatars.githubusercontent.com/u/3562317?v=4?s=100" width="100px;" alt="RoCat"/><br /><sub><b>RoCat</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=RoCat" title="Code">💻</a> <a href="#ideas-RoCat" title="Ideas, Planning, & Feedback">🤔</a> <a href="#design-RoCat" title="Design">🎨</a></td>
    </tr>
    <tr>
      <td align="center"><a href="https://github.com/ApacheEx"><img src="https://avatars.githubusercontent.com/u/1918108?v=4?s=100" width="100px;" alt="Oleg Kuzava"/><br /><sub><b>Oleg Kuzava</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=ApacheEx" title="Code">💻</a> <a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3AApacheEx" title="Bug reports">🐛</a></td>
      <td align="center"><a href="http://nikz.se"><img src="https://avatars.githubusercontent.com/u/7352072?v=4?s=100" width="100px;" alt="Niklas Frank"/><br /><sub><b>Niklas Frank</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=nksfrank" title="Code">💻</a> <a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3Anksfrank" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://quentinbrunet.com"><img src="https://avatars.githubusercontent.com/u/20137632?v=4?s=100" width="100px;" alt="Quentin Brunet"/><br /><sub><b>Quentin Brunet</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=qboot" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/Soarc"><img src="https://avatars.githubusercontent.com/u/3385495?v=4?s=100" width="100px;" alt="Gor Rustamyan"/><br /><sub><b>Gor Rustamyan</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=Soarc" title="Code">💻</a> <a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3ASoarc" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://github.com/JochenDiekenbrock"><img src="https://avatars.githubusercontent.com/u/1625222?v=4?s=100" width="100px;" alt="Jochen Diekenbrock"/><br /><sub><b>Jochen Diekenbrock</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=JochenDiekenbrock" title="Code">💻</a> <a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3AJochenDiekenbrock" title="Bug reports">🐛</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!  

## 🚀 How it looks  

![](https://raw.githubusercontent.com/acacode/swagger-typescript-api/master/assets/npx.gif)  

![](https://raw.githubusercontent.com/acacode/swagger-typescript-api/master/assets/auth-example.gif)  

![](https://raw.githubusercontent.com/acacode/swagger-typescript-api/master/assets/typings1.gif)  


## 📝 License  
Licensed under the [MIT License](https://github.com/acacode/swagger-typescript-api/blob/master/LICENSE).
