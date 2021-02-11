/* tslint:disable */
/* eslint-disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
 * An order for a pets from the pet store
 * @example {"petId":6,"quantity":1,"id":0,"shipDate":"2000-01-23T04:56:07.000+00:00","complete":false,"status":"placed"}
 */
export interface Order {
  /** @format int64 */
  id?: number;

  /** @format int64 */
  petId?: number;

  /** @format int32 */
  quantity?: number;

  /** @format date-time */
  shipDate?: string;

  /** Order Status */
  status?: "placed" | "approved" | "delivered";
  complete?: boolean;
}

/**
 * A category for a pet
 * @example {"name":"name","id":6}
 */
export interface Category {
  /** @format int64 */
  id?: number;
  name?: string;
}

/**
 * A User who is purchasing from the pet store
 * @example {"firstName":"firstName","lastName":"lastName","password":"password","userStatus":6,"phone":"phone","id":0,"email":"email","username":"username"}
 */
export interface User {
  /** @format int64 */
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;

  /**
   * User Status
   * @format int32
   */
  userStatus?: number;
}

/**
 * A tag for a pet
 * @example {"name":"name","id":1}
 */
export interface Tag {
  /** @format int64 */
  id?: number;
  name?: string;
}

export enum PetNames {
  FluffyHero = "Fluffy Hero",
  PiggyPo = "Piggy Po",
  SwaggerTypescriptApi = "Swagger Typescript Api",
}

export type PetIds = 10 | 20 | 30 | 40;

/**
 * A pet for sale in the pet store
 * @example {"photoUrls":["photoUrls","photoUrls"],"name":"doggie","id":0,"category":{"name":"name","id":6},"tags":[{"name":"name","id":1},{"name":"name","id":1}],"status":"available"}
 */
export interface Pet {
  /** @format int64 */
  id?: number;

  /** A category for a pet */
  category?: Category;

  /** @example doggie */
  name: string;
  photoUrls: string[];
  tags?: Tag[];

  /** pet status in the store */
  status?: "available" | "pending" | "sold";
}

/**
 * Describes the result of uploading an image resource
 * @example {"code":0,"type":"type","message":"message"}
 */
export interface ApiResponse {
  /** @format int32 */
  code?: number;
  type?: string;
  message?: string;
}

/**
 * some description
 */
export interface Amount {
  /**
   * some description
   *
   * @format double
   * @min 0.01
   * @max 1000000000000000
   */
  value: number;

  /**
   * some description
   *
   */
  currency: Currency;
}

/**
 * some description
 * @pattern ^[A-Z]{3,3}$
 */
export type Currency = string;

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: keyof Omit<Body, "body" | "bodyUsed">;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

interface ApiConfig<SecurityDataType> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl">;
  securityWorker?: (securityData: SecurityDataType) => RequestParams;
}

interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://petstore.swagger.io/v2";
  private securityData: SecurityDataType = null as any;
  private securityWorker: null | ApiConfig<SecurityDataType>["securityWorker"] = null;

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {
      "Content-Type": ContentType.Json,
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType) => {
    this.securityData = data;
  };

  private addQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];

    return (
      encodeURIComponent(key) +
      "=" +
      encodeURIComponent(Array.isArray(value) ? value.join(",") : typeof value === "number" ? value : `${value}`)
    );
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) =>
        typeof query[key] === "object" && !Array.isArray(query[key])
          ? this.toQueryString(query[key] as QueryParamsType)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: JSON.stringify,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input).reduce((data, key) => {
        data.append(key, input[key]);
        return data;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  private mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  public request = <T = any, E = any>({
    body,
    secure,
    path,
    type = ContentType.Json,
    query,
    format = "json",
    baseUrl,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams = secure && this.securityWorker ? this.securityWorker(this.securityData) : {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);

    return fetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      headers: {
        "Content-Type": type,
        ...(requestParams.headers || {}),
      },
      ...requestParams,
      body: body ? (this.contentFormatters[type] ? this.contentFormatters[type](body) : body) : null,
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = (null as unknown) as T;
      r.error = (null as unknown) as E;

      const data = await response[format]()
        .then((data) => {
          if (r.ok) {
            r.data = data;
          } else {
            r.error = data;
          }
          return r;
        })
        .catch((e) => {
          r.error = e;
          return r;
        });

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Swagger Petstore
 * @version 1.0.0
 * @baseUrl http://petstore.swagger.io/v2
 * This is a sample server Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.
 */
export class Api<SecurityDataType = any> extends HttpClient<SecurityDataType> {
  pet = {
    /**
     * No description
     *
     * @tags pet
     * @name AddPet
     * @summary Add a new pet to the store
     * @request POST:api/v1/pet
     * @secure
     */
    addPet: (body: Pet, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `api/v1/pet`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags pet
     * @name UpdatePet
     * @summary Update an existing pet
     * @request PUT:api/v1/pet
     * @secure
     */
    updatePet: (body: Pet, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `api/v1/pet`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Multiple status values can be provided with comma separated strings
     *
     * @tags pet
     * @name FindPetsByStatus
     * @summary Finds Pets by status
     * @request GET:api/v1/pet/findByStatus
     * @secure
     */
    findPetsByStatus: (query: { status: ("available" | "pending" | "sold")[] }, params: RequestParams = {}) =>
      this.request<Pet[], any>({
        path: `api/v1/pet/findByStatus`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
     *
     * @tags pet
     * @name FindPetsByTags
     * @summary Finds Pets by tags
     * @request GET:api/v1/pet/findByTags
     * @secure
     */
    findPetsByTags: (query: { tags: string[] }, params: RequestParams = {}) =>
      this.request<Pet[], any>({
        path: `api/v1/pet/findByTags`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a single pet
     *
     * @tags pet
     * @name GetPetById
     * @summary Find pet by ID
     * @request GET:api/v1/pet/{petId}
     * @secure
     */
    getPetById: (petId: number, params: RequestParams = {}) =>
      this.request<Pet, any>({
        path: `api/v1/pet/${petId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags pet
     * @name UpdatePetWithForm
     * @summary Updates a pet in the store with form data
     * @request POST:api/v1/pet/{petId}
     * @secure
     */
    updatePetWithForm: (petId: number, data: { name?: string; status?: string }, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `api/v1/pet/${petId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags pet
     * @name DeletePet
     * @summary Deletes a pet
     * @request DELETE:api/v1/pet/{petId}
     * @secure
     */
    deletePet: (petId: number, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `api/v1/pet/${petId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags pet
     * @name UploadFile
     * @summary uploads an image
     * @request POST:api/v1/pet/{petId}/uploadImage
     * @secure
     */
    uploadFile: (petId: number, data: { additionalMetadata?: string; file?: File }, params: RequestParams = {}) =>
      this.request<ApiResponse, any>({
        path: `api/v1/pet/${petId}/uploadImage`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  store = {
    /**
     * @description Returns a map of status codes to quantities
     *
     * @tags store
     * @name GetInventory
     * @summary Returns pet inventories by status
     * @request GET:api/v1/store/inventory
     * @secure
     */
    getInventory: (params: RequestParams = {}) =>
      this.request<Record<string, number>, any>({
        path: `api/v1/store/inventory`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags store
     * @name PlaceOrder
     * @summary Place an order for a pet
     * @request POST:api/v1/store/order
     */
    placeOrder: (body: Order, params: RequestParams = {}) =>
      this.request<Order, any>({
        path: `api/v1/store/order`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description For valid response try integer IDs with value <= 5 or > 10. Other values will generated exceptions
     *
     * @tags store
     * @name GetOrderById
     * @summary Find purchase order by ID
     * @request GET:api/v1/store/order/{orderId}
     */
    getOrderById: (orderId: number, params: RequestParams = {}) =>
      this.request<Order, any>({
        path: `api/v1/store/order/${orderId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description For valid response try integer IDs with value < 1000. Anything above 1000 or nonintegers will generate API errors
     *
     * @tags store
     * @name DeleteOrder
     * @summary Delete purchase order by ID
     * @request DELETE:api/v1/store/order/{orderId}
     */
    deleteOrder: (orderId: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `api/v1/store/order/${orderId}`,
        method: "DELETE",
        ...params,
      }),
  };
  user = {
    /**
     * @description This can only be done by the logged in user.
     *
     * @tags user
     * @name CreateUser
     * @summary Create user
     * @request POST:api/v1/user
     */
    createUser: (body: User, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `api/v1/user`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name CreateUsersWithArrayInput
     * @summary Creates list of users with given input array
     * @request POST:api/v1/user/createWithArray
     */
    createUsersWithArrayInput: (body: User[], params: RequestParams = {}) =>
      this.request<any, any>({
        path: `api/v1/user/createWithArray`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name CreateUsersWithListInput
     * @summary Creates list of users with given input array
     * @request POST:api/v1/user/createWithList
     */
    createUsersWithListInput: (body: User[], params: RequestParams = {}) =>
      this.request<any, any>({
        path: `api/v1/user/createWithList`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name LoginUser
     * @summary Logs user into the system
     * @request GET:api/v1/user/login
     */
    loginUser: (query: { username: string; password: string }, params: RequestParams = {}) =>
      this.request<Currency, any>({
        path: `api/v1/user/login`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name LogoutUser
     * @summary Logs out current logged in user session
     * @request GET:api/v1/user/logout
     */
    logoutUser: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `api/v1/user/logout`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name GetUserByName
     * @summary Get user by user name
     * @request GET:api/v1/user/{username}
     */
    getUserByName: (username: string, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `api/v1/user/${username}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description This can only be done by the logged in user.
     *
     * @tags user
     * @name UpdateUser
     * @summary Updated user
     * @request PUT:api/v1/user/{username}
     */
    updateUser: (username: string, body: User, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `api/v1/user/${username}`,
        method: "PUT",
        body: body,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description This can only be done by the logged in user.
     *
     * @tags user
     * @name DeleteUser
     * @summary Delete user
     * @request DELETE:api/v1/user/{username}
     */
    deleteUser: (username: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `api/v1/user/${username}`,
        method: "DELETE",
        ...params,
      }),
  };
  username = {
    /**
     * No description
     *
     * @tags user
     * @name GetUserByName
     * @summary Get user by user name
     * @request GET:api/v1/{username}
     */
    getUserByName: (username: string, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `api/v1/${username}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description This can only be done by the logged in user.
     *
     * @tags user
     * @name UpdateUser
     * @summary Updated user
     * @request PUT:api/v1/{username}
     */
    updateUser: (username: string, body: User, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `api/v1/${username}`,
        method: "PUT",
        body: body,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description This can only be done by the logged in user.
     *
     * @tags user
     * @name DeleteUser
     * @summary Delete user
     * @request DELETE:api/v1/{username}
     */
    deleteUser: (username: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `api/v1/${username}`,
        method: "DELETE",
        ...params,
      }),
  };
}
