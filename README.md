# swagger-typescript-api  

[![NPM badge](https://img.shields.io/npm/v/swagger-typescript-api.svg)](https://www.npmjs.com/package/swagger-typescript-api) 
[![CI](https://github.com/acacode/swagger-typescript-api/actions/workflows/main.yml/badge.svg?branch=next)](https://github.com/acacode/swagger-typescript-api/actions/workflows/main.yml) <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-20-orange.svg)](#contributors)
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

## 👀 Examples  

All examples you can find [**here**](https://github.com/acacode/swagger-typescript-api/tree/master/tests)  

## 📄 Usage  

```muse
Usage: sta [options]
Usage: swagger-typescript-api [options]

Options:
  -v, --version                 output the current version
  -p, --path <path>             path/url to swagger scheme
  -o, --output <output>         output path of typescript api file (default: "./")
  -n, --name <name>             name of output typescript api file (default: "Api.ts")
  -t, --templates <path>        path to folder containing templates
  -d, --default-as-success      use "default" response status code as success response too.
                                some swagger schemas use "default" response status code
                                as success response type by default. (default: false)
  -r, --responses               generate additional information about request responses
                                also add typings for bad responses (default: false)
  --union-enums                 generate all "enum" types as union types (T1 | T2 | TN) (default: false)
  --route-types                 generate type definitions for API routes (default: false)
  --no-client                   do not generate an API class
  --enum-names-as-values        use values in 'x-enumNames' as enum values (not only as keys) (default: false)
  --js                          generate js api module with declaration file (default: false)
  --extract-request-params      extract request params to data contract (default: false)
                                Also combine path params and query params into one object
  --extract-request-body        extract request body type to data contract (default: false)                         
  --module-name-index <number>  determines which path index should be used for routes separation (default: 0)
                                (example: GET:/fruites/getFruit -> index:0 -> moduleName -> fruites)
  --module-name-first-tag       splits routes based on the first tag
  --modular                     generate separated files for http client, data contracts, and routes (default: false)
  --disableStrictSSL            disabled strict SSL (default: false)
  --disableProxy                disabled proxy (default: false)
  --clean-output                clean output folder before generate api. WARNING: May cause data loss (default: false)
  --axios                       generate axios http client (default: false)
  --single-http-client          Ability to send HttpClient instance to Api constructor (default: false)
  --silent                      Output only errors to console (default: false)
  --default-response <type>     default type for empty response schema (default: "void")
  --type-prefix <string>        data contract name prefix (default: "")
  --type-suffix <string>        data contract name suffix (default: "")
  --patch                       fix up small errors in the swagger source definition (default: false)
  -h, --help                    display help for command
```

Also you can use `npx`:  
```
 npx swagger-typescript-api -p ./swagger.json -o ./src -n myApi.ts
```

You can use this package from nodejs:
```js
const { generateApi } = require('swagger-typescript-api');
const path = require("path");
const fs = require("fs");

/* NOTE: all fields are optional expect one of `output`, `url`, `spec` */
generateApi({
  name: "MySuperbApi.ts",
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
  httpClientType: "axios", // or "fetch"
  defaultResponseAsSuccess: false,
  generateRouteTypes: false,
  generateResponses: true,
  toJS: false,
  extractRequestParams: false,
  extractRequestBody: false,
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
  extraTemplates: [],
  hooks: {
    onCreateComponent: (component) => {},
    onCreateRequestParams: (rawType) => {},
    onCreateRoute: (routeData) => {},
    onCreateRouteName: (routeNameInfo, rawRouteInfo) => {},
    onFormatRouteName: (routeInfo, templateRouteName) => {},
    onFormatTypeName: (typeName, rawTypeName) => {},
    onInit: (configuration) => {},
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

```


## 💎 options   
### **`--templates`**  
This option needed for cases when you don't want to use the default `swagger-typescript-api` output structure  

Templates:  
- `api.eta` - Api class module (locations: [/templates/default](https://github.com/acacode/swagger-typescript-api/tree/next/templates/default/api.eta), [/templates/modular](https://github.com/acacode/swagger-typescript-api/tree/next/templates/modular/api.eta))  
- `data-contracts.eta` - all types (data contracts) from swagger schema (locations: [/templates/base](https://github.com/acacode/swagger-typescript-api/tree/next/templates/base/data-contracts.eta))  
- `http-client.eta` - HttpClient class module (locations: [/templates/base](https://github.com/acacode/swagger-typescript-api/tree/next/templates/base/http-client.eta))  
- `procedure-call.eta` - route in Api class (locations: [/templates/default](https://github.com/acacode/swagger-typescript-api/tree/next/templates/default/procedure-call.eta), [/templates/modular](https://github.com/acacode/swagger-typescript-api/tree/next/templates/modular/procedure-call.eta))  
- `route-docs.eta` - documentation for route in Api class (locations: [/templates/base](https://github.com/acacode/swagger-typescript-api/tree/next/templates/base/route-docs.eta))  
- `route-name.eta` - route name for route in Api class (locations: [/templates/base](https://github.com/acacode/swagger-typescript-api/tree/next/templates/base/route-name.eta))  
- `route-type.eta` - *(`--route-types` option)* (locations: [/templates/base](https://github.com/acacode/swagger-typescript-api/tree/next/templates/base/route-type.eta))  
- `route-types.eta` - *(`--route-types` option)* (locations: [/templates/base](https://github.com/acacode/swagger-typescript-api/tree/next/templates/base/route-types.eta))  

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
    - `includeFile("@base/data-contracts.eta", configuration)`  
    - `includeFile("@default/api.eta", configuration)`  
    - `includeFile("@default/procedure-call.eta", configuration)`  
    - `includeFile("@modular/api.eta", configuration)`  
    - `includeFile("@modular/procedure-call.eta", configuration)`  
    - `includeFile("@base/route-docs.eta", configuration)`  
    - `includeFile("@base/route-name.eta", configuration)`  
    - `includeFile("@base/route-type.eta", configuration)`  
    - `includeFile("@base/route-types.eta", configuration)`  

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


## 📄 Mass media  

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
  <tr>
    <td align="center"><a href="https://github.com/js2me"><img src="https://avatars1.githubusercontent.com/u/16340911?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sergey S. Volkov</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=js2me" title="Code">💻</a> <a href="https://github.com/acacode/swagger-typescript-api/commits?author=js2me" title="Documentation">📖</a> <a href="#design-js2me" title="Design">🎨</a> <a href="#example-js2me" title="Examples">💡</a> <a href="#maintenance-js2me" title="Maintenance">🚧</a> <a href="#ideas-js2me" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3Ajs2me" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/andrefilimono"><img src="https://avatars0.githubusercontent.com/u/7794526?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Filimonov Andrey</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=andrefilimono" title="Code">💻</a> <a href="#ideas-andrefilimono" title="Ideas, Planning, & Feedback">🤔</a> <a href="#design-andrefilimono" title="Design">🎨</a></td>
    <td align="center"><a href="https://github.com/Fl0pZz"><img src="https://avatars2.githubusercontent.com/u/9510124?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rafael Fakhreev</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=Fl0pZz" title="Code">💻</a> <a href="#ideas-Fl0pZz" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://azzola.dev"><img src="https://avatars3.githubusercontent.com/u/1297597?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lucas Azzola</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=azz" title="Code">💻</a> <a href="#ideas-azz" title="Ideas, Planning, & Feedback">🤔</a> <a href="#design-azz" title="Design">🎨</a></td>
    <td align="center"><a href="https://github.com/JennieJi"><img src="https://avatars3.githubusercontent.com/u/1913045?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jennie</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=JennieJi" title="Code">💻</a> <a href="#ideas-JennieJi" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/jomarquez21"><img src="https://avatars1.githubusercontent.com/u/16705169?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jose Enrique Marquez</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=jomarquez21" title="Code">💻</a> <a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3Ajomarquez21" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://glassechidna.com.au"><img src="https://avatars1.githubusercontent.com/u/482276?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Benjamin Dobell</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=Benjamin-Dobell" title="Code">💻</a> <a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3ABenjamin-Dobell" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://fixate.it"><img src="https://avatars0.githubusercontent.com/u/1510520?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Larry Botha</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=larrybotha" title="Code">💻</a> <a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3Alarrybotha" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/nikalun"><img src="https://avatars3.githubusercontent.com/u/13102962?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nikolay Lukinykh</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=nikalun" title="Code">💻</a> <a href="#ideas-nikalun" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3Anikalun" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/Mvbraathen"><img src="https://avatars0.githubusercontent.com/u/16756739?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Marius Bråthen</b></sub></a><br /><a href="#security-Mvbraathen" title="Security">🛡️</a></td>
    <td align="center"><a href="https://github.com/xesjkeee"><img src="https://avatars2.githubusercontent.com/u/17751886?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Evgeny Vlasov</b></sub></a><br /><a href="#ideas-xesjkeee" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/kel666"><img src="https://avatars1.githubusercontent.com/u/2040661?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Fabio</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3Akel666" title="Bug reports">🐛</a> <a href="https://github.com/acacode/swagger-typescript-api/commits?author=kel666" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Fabiencdp"><img src="https://avatars.githubusercontent.com/u/6182473?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Fabien</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3AFabiencdp" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://about.me/julienrousseau"><img src="https://avatars.githubusercontent.com/u/3296671?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rousseau Julien</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3ARoXuS" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://sebastianarias.dev"><img src="https://avatars.githubusercontent.com/u/9751266?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sebastián Arias</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3ALarox" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/Styn"><img src="https://avatars.githubusercontent.com/u/6705137?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Stijn Lammens</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3AStyn" title="Bug reports">🐛</a> <a href="https://github.com/acacode/swagger-typescript-api/commits?author=Styn" title="Code">💻</a></td>
    <td align="center"><a href="http://emilecantin.com"><img src="https://avatars.githubusercontent.com/u/885486?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Emile Cantin</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3Aemilecantin" title="Bug reports">🐛</a> <a href="https://github.com/acacode/swagger-typescript-api/commits?author=emilecantin" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/armsnyder"><img src="https://avatars.githubusercontent.com/u/9969202?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Adam Snyder</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=armsnyder" title="Code">💻</a> <a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3Aarmsnyder" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/jnpoyser"><img src="https://avatars.githubusercontent.com/u/7920428?v=4?s=100" width="100px;" alt=""/><br /><sub><b>James Poyser</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/commits?author=jnpoyser" title="Code">💻</a> <a href="#ideas-jnpoyser" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="http://ru.linkedin.com/in/lisikhin"><img src="https://avatars.githubusercontent.com/u/475367?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alexey</b></sub></a><br /><a href="https://github.com/acacode/swagger-typescript-api/issues?q=author%3ANihisil" title="Bug reports">🐛</a></td>
  </tr>
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
