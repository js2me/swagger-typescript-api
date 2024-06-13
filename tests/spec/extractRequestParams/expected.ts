/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Authentiq ID in JWT format, self-signed. */
export interface AuthentiqID {
  /** device token for push messages */
  devtoken?: string;
  /** UUID and public signing key */
  sub: string;
}

/** Claim in JWT format, self- or issuer-signed.  */
export interface Claims {
  email?: string;
  phone?: string;
  /** claim scope */
  scope: string;
  /** UUID */
  sub: string;
  type?: string;
}

export interface Error {
  detail?: string;
  error: number;
  title?: string;
  /** unique uri for this error */
  type?: string;
}

/** PushToken in JWT format, self-signed.  */
export interface PushToken {
  /** audience (URI) */
  aud: string;
  exp?: number;
  iat?: number;
  /** issuer (URI) */
  iss: string;
  nbf?: number;
  /** UUID and public signing key */
  sub: string;
}

export interface KeyRevokeNosecretParams {
  /** primary email associated to Key (ID) */
  email: string;
  /** primary phone number, international representation */
  phone: string;
  /** verification code sent by email */
  code?: string;
}

export interface KeyRevokeParams {
  /** revokation secret */
  secret: string;
  /** bar baz */
  barBaz: string;
  /** Public Signing Key - Authentiq ID (43 chars) */
  pk: string;
}

export interface KeyRevoke2Params {
  /** revokation secret */
  secret: string;
  /** Public Signing Key - Authentiq ID (43 chars) */
  pk: string;
}

export interface PushLoginRequestParams {
  /** URI App will connect to */
  callback: string;
}

export interface SignRequestParams {
  /** test only mode, using test issuer */
  test?: number;
}

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
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://6-dot-authentiqio.appspot.com";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
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

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
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

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Authentiq
 * @version 6
 * @license Apache 2.0 (http://www.apache.org/licenses/LICENSE-2.0.html)
 * @termsOfService http://authentiq.com/terms/
 * @baseUrl https://6-dot-authentiqio.appspot.com
 * @contact Authentiq team <hello@authentiq.com> (http://authentiq.io/support)
 *
 * Strong authentication, without the passwords.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  key = {
    /**
     * @description Revoke an Authentiq ID using email & phone. If called with `email` and `phone` only, a verification code will be sent by email. Do a second call adding `code` to complete the revocation.
     *
     * @tags key, delete
     * @name KeyRevokeNosecret
     * @request DELETE:/key
     */
    keyRevokeNosecret: (query: KeyRevokeNosecretParams, params: RequestParams = {}) =>
      this.request<
        {
          /** pending or done */
          status?: string;
        },
        Error
      >({
        path: `/key`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Register a new ID `JWT(sub, devtoken)` v5: `JWT(sub, pk, devtoken, ...)` See: https://github.com/skion/authentiq/wiki/JWT-Examples
     *
     * @tags key, post
     * @name KeyRegister
     * @request POST:/key
     */
    keyRegister: (body: AuthentiqID, params: RequestParams = {}) =>
      this.request<
        {
          /** revoke key */
          secret?: string;
          /** registered */
          status?: string;
        },
        Error
      >({
        path: `/key`,
        method: "POST",
        body: body,
        format: "json",
        ...params,
      }),

    /**
     * @description Revoke an Identity (Key) with a revocation secret
     *
     * @name KeyRevoke
     * @request DELETE:/key/{bar-baz}/{PK}
     */
    keyRevoke: ({ barBaz, pk, ...query }: KeyRevokeParams, params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/key/${barBaz}/${pk}`,
        method: "DELETE",
        query: query,
        ...params,
      }),

    /**
     * @description Revoke an Identity (Key) with a revocation secret
     *
     * @tags key, delete
     * @name KeyRevoke2
     * @request DELETE:/key/{PK}
     * @originalName keyRevoke
     * @duplicate
     */
    keyRevoke2: ({ pk, ...query }: KeyRevoke2Params, params: RequestParams = {}) =>
      this.request<
        {
          /** done */
          status?: string;
        },
        Error
      >({
        path: `/key/${pk}`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Get public details of an Authentiq ID.
     *
     * @tags key, get
     * @name GetKey
     * @request GET:/key/{PK}
     */
    getKey: (pk: string, params: RequestParams = {}) =>
      this.request<
        {
          /** @format date-time */
          since?: string;
          status?: string;
          /** base64safe encoded public signing key */
          sub?: string;
        },
        Error
      >({
        path: `/key/${pk}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description HEAD info on Authentiq ID
     *
     * @tags key, head
     * @name HeadKey
     * @request HEAD:/key/{PK}
     */
    headKey: (pk: string, params: RequestParams = {}) =>
      this.request<void, Error>({
        path: `/key/${pk}`,
        method: "HEAD",
        ...params,
      }),

    /**
     * @description update properties of an Authentiq ID. (not operational in v4; use PUT for now) v5: POST issuer-signed email & phone scopes in a self-signed JWT See: https://github.com/skion/authentiq/wiki/JWT-Examples
     *
     * @tags key, post
     * @name KeyUpdate
     * @request POST:/key/{PK}
     */
    keyUpdate: (pk: string, body: AuthentiqID, params: RequestParams = {}) =>
      this.request<
        {
          /** confirmed */
          status?: string;
        },
        Error
      >({
        path: `/key/${pk}`,
        method: "POST",
        body: body,
        format: "json",
        ...params,
      }),

    /**
     * @description Update Authentiq ID by replacing the object. v4: `JWT(sub,email,phone)` to bind email/phone hash; v5: POST issuer-signed email & phone scopes and PUT to update registration `JWT(sub, pk, devtoken, ...)` See: https://github.com/skion/authentiq/wiki/JWT-Examples
     *
     * @tags key, put
     * @name KeyBind
     * @request PUT:/key/{PK}
     */
    keyBind: (pk: string, body: AuthentiqID, params: RequestParams = {}) =>
      this.request<
        {
          /** confirmed */
          status?: string;
        },
        Error
      >({
        path: `/key/${pk}`,
        method: "PUT",
        body: body,
        format: "json",
        ...params,
      }),
  };
  iKey = {
    /**
     * @description Get public details of an Authentiq ID.
     *
     * @tags key, get
     * @name IKeyDetail
     * @request GET:/i_key/{i_PK}
     */
    iKeyDetail: (iPk: string, params: RequestParams = {}) =>
      this.request<
        {
          /** @format date-time */
          since?: string;
          status?: string;
          /** base64safe encoded public signing key */
          sub?: string;
        },
        Error
      >({
        path: `/i_key/${iPk}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Get public details of an Authentiq ID.
     *
     * @tags key, get
     * @name UnderlinesDetail
     * @request GET:/i_key/underlines/{i__UK}
     */
    underlinesDetail: (iUk: string, params: RequestParams = {}) =>
      this.request<
        {
          /** base64safe encoded public signing key */
          sub?: string;
        },
        Error
      >({
        path: `/i_key/underlines/${iUk}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  login = {
    /**
     * @description push sign-in request See: https://github.com/skion/authentiq/wiki/JWT-Examples
     *
     * @tags login, post
     * @name PushLoginRequest
     * @request POST:/login
     */
    pushLoginRequest: (query: PushLoginRequestParams, body: PushToken, params: RequestParams = {}) =>
      this.request<
        {
          /** sent */
          status?: string;
        },
        Error
      >({
        path: `/login`,
        method: "POST",
        query: query,
        body: body,
        format: "json",
        ...params,
      }),
  };
  scope = {
    /**
     * @description scope verification request See: https://github.com/skion/authentiq/wiki/JWT-Examples
     *
     * @tags scope, post
     * @name SignRequest
     * @request POST:/scope
     */
    signRequest: (query: SignRequestParams, body: Claims, params: RequestParams = {}) =>
      this.request<
        {
          /** 20-character ID */
          job?: string;
          /** waiting */
          status?: string;
        },
        Error
      >({
        path: `/scope`,
        method: "POST",
        query: query,
        body: body,
        format: "json",
        ...params,
      }),

    /**
     * @description delete a verification job
     *
     * @tags scope, delete
     * @name SignDelete
     * @request DELETE:/scope/{job}
     */
    signDelete: (job: string, params: RequestParams = {}) =>
      this.request<
        {
          /** done */
          status?: string;
        },
        Error
      >({
        path: `/scope/${job}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description get the status / current content of a verification job
     *
     * @tags scope, get
     * @name SignRetrieve
     * @request GET:/scope/{job}
     */
    signRetrieve: (job: string, params: RequestParams = {}) =>
      this.request<
        {
          exp?: number;
          field?: string;
          /** base64safe encoded public signing key */
          sub?: string;
        },
        Error
      >({
        path: `/scope/${job}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description HEAD to get the status of a verification job
     *
     * @tags scope, head
     * @name SignRetrieveHead
     * @request HEAD:/scope/{job}
     */
    signRetrieveHead: (job: string, params: RequestParams = {}) =>
      this.request<void, Error>({
        path: `/scope/${job}`,
        method: "HEAD",
        ...params,
      }),

    /**
     * @description this is a scope confirmation
     *
     * @tags scope, post
     * @name SignConfirm
     * @request POST:/scope/{job}
     */
    signConfirm: (job: string, params: RequestParams = {}) =>
      this.request<
        {
          /** confirmed */
          status?: string;
        },
        Error
      >({
        path: `/scope/${job}`,
        method: "POST",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description authority updates a JWT with its signature See: https://github.com/skion/authentiq/wiki/JWT-Examples
     *
     * @tags scope, put
     * @name SignUpdate
     * @request PUT:/scope/{job}
     */
    signUpdate: (job: string, params: RequestParams = {}) =>
      this.request<
        {
          /** result is JWT or JSON?? */
          jwt?: string;
          /** ready */
          status?: string;
        },
        Error
      >({
        path: `/scope/${job}`,
        method: "PUT",
        ...params,
      }),
  };
}
