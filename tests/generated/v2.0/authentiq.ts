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
* Authentiq ID in JWT format, self-signed.

*/
export interface AuthentiqID {
  
  /**
  * device token for push messages
  */
  devtoken?: string;
  
  /**
  * UUID and public signing key
  */
  sub: string;
}

/**
* Claim in JWT format, self- or issuer-signed. 

*/
export interface Claims {
  email?: string;
  phone?: string;
  
  /**
  * claim scope
  */
  scope: string;
  
  /**
  * UUID
  */
  sub: string;
  type?: string;
}

export interface Error {
  detail?: string;
  error: number;
  title?: string;
  
  /**
  * unique uri for this error
  */
  type?: string;
}

/**
* PushToken in JWT format, self-signed. 

*/
export interface PushToken {
  
  /**
  * audience (URI)
  */
  aud: string;
  exp?: number;
  iat?: number;
  
  /**
  * issuer (URI)
  */
  iss: string;
  nbf?: number;
  
  /**
  * UUID and public signing key
  */
  sub: string;
}

export type RequestParams = Omit<RequestInit, "body" | "method"> & {
  secure?: boolean;
}

type ApiConfig<SecurityDataType> = {
  baseUrl?: string,
  baseApiParams?: RequestParams,
  securityWorker?: (securityData: SecurityDataType) => RequestParams,
}

/** Overrided Promise type. Needs for additional typings of `.catch` callback */
type TPromise<ResolveType, RejectType = any> = {
  then<TResult1 = ResolveType, TResult2 = never>(onfulfilled?: ((value: ResolveType) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: RejectType) => TResult2 | PromiseLike<TResult2>) | undefined | null): TPromise<TResult1 | TResult2, RejectType>;
  catch<TResult = never>(onrejected?: ((reason: RejectType) => TResult | PromiseLike<TResult>) | undefined | null): TPromise<ResolveType | TResult, RejectType>;
}

/** Strong authentication, without the passwords. */
export class Api<SecurityDataType> {
  
  public baseUrl = "https://6-dot-authentiqio.appspot.com/";
  public title = "Authentiq";
  public version = "6";

  private securityData: SecurityDataType = (null as any);
  private securityWorker: ApiConfig<SecurityDataType>["securityWorker"] = (() => {}) as any
  
  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  }

  constructor({ baseUrl,baseApiParams,securityWorker, }: ApiConfig<SecurityDataType> = {}) {
    this.baseUrl = baseUrl || this.baseUrl;
    this.baseApiParams = baseApiParams || this.baseApiParams;
    this.securityWorker = securityWorker || this.securityWorker;
  }

  public setSecurityData = (data: SecurityDataType) => {
    this.securityData = data
  }

  private addQueryParams(query: object): string {
    const keys = Object.keys(query);
    return keys.length ? (
      '?' +
      keys.reduce((paramsArray, param) => [
        ...paramsArray,
        param + '=' + encodeURIComponent(query[param])
      ], []).join('&')
    ) : ''
  }

  private mergeRequestOptions(params: RequestParams, securityParams?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params,
      ...(securityParams || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params.headers || {}),
        ...((securityParams && securityParams.headers) || {})
      }
    }
  }
  
  private safeParseResponse = <T = any, E = any>(response: Response): TPromise<T, E> =>
    response.json()
      .then(data => data)
      .catch(e => response.text);
  
  public request = <T = any, E = any>(
    path: string,
    method: string,
    { secure, ...params }: RequestParams = {},
    body?: any,
    secureByDefault?: boolean,
  ): TPromise<T, E> =>
    fetch(`${this.baseUrl}${path}`, {
      // @ts-ignore
      ...this.mergeRequestOptions(params, (secureByDefault || secure) && this.securityWorker(this.securityData)),
      method,
      body: body ? JSON.stringify(body) : null,
    }).then(async response => {
      const data = await this.safeParseResponse<T, E>(response);
      if (!response.ok) throw data
      return data
    })



  key = {


    /**
    * @tags key, delete
    * @name key_revoke_nosecret
    * @request DELETE:/key
    * @description Revoke an Authentiq ID using email & phone. If called with `email` and `phone` only, a verification code will be sent by email. Do a second call adding `code` to complete the revocation.
    * @response `200` `{ status?: string }` Successfully deleted
    * @response `401` `Error` Authentication error `auth-error`
    * @response `404` `Error` Unknown key `unknown-key`
    * @response `409` `Error` Confirm with code sent `confirm-first`
    * @response `default` `any` 
    */
    keyRevokeNosecret: (query: { email: string, phone: string, code?: string }, params?: RequestParams) =>
      this.request<{ status?: string }, Error>(`/key${this.addQueryParams(query)}`, "DELETE", params, null),


    /**
    * @tags key, post
    * @name key_register
    * @request POST:/key
    * @description Register a new ID `JWT(sub, devtoken)` v5: `JWT(sub, pk, devtoken, ...)` See: https://github.com/skion/authentiq/wiki/JWT-Examples
    * @response `201` `{ secret?: string, status?: string }` Successfully registered
    * @response `409` `Error` Key already registered `duplicate-key`
    * @response `default` `any` 
    */
    keyRegister: (body: AuthentiqID, params?: RequestParams) =>
      this.request<{ secret?: string, status?: string }, Error>(`/key`, "POST", params, body),


    /**
    * @tags key, delete
    * @name key_revoke
    * @request DELETE:/key/{PK}
    * @description Revoke an Identity (Key) with a revocation secret
    * @response `200` `{ status?: string }` Successful response
    * @response `401` `Error` Key not found / wrong code `auth-error`
    * @response `404` `Error` Unknown key `unknown-key`
    * @response `default` `any` 
    */
    keyRevoke: (PK: string, query: { secret: string }, params?: RequestParams) =>
      this.request<{ status?: string }, Error>(`/key/${PK}${this.addQueryParams(query)}`, "DELETE", params, null),


    /**
    * @tags key, get
    * @name getKey
    * @request GET:/key/{PK}
    * @description Get public details of an Authentiq ID.
    * @response `200` `{ since?: string, status?: string, sub?: string }` Successfully retrieved
    * @response `404` `Error` Unknown key `unknown-key`
    * @response `410` `Error` Key is revoked (gone). `revoked-key`
    * @response `default` `any` 
    */
    getKey: (PK: string, params?: RequestParams) =>
      this.request<{ since?: string, status?: string, sub?: string }, Error>(`/key/${PK}`, "GET", params, null),


    /**
    * @tags key, head
    * @name headKey
    * @request HEAD:/key/{PK}
    * @description HEAD info on Authentiq ID
    * @response `200` `any` Key exists
    * @response `404` `any` Unknown key `unknown-key`
    * @response `410` `any` Key is revoked `revoked-key`
    * @response `default` `any` 
    */
    headKey: (PK: string, params?: RequestParams) =>
      this.request<any, any>(`/key/${PK}`, "HEAD", params, null),


    /**
    * @tags key, post
    * @name key_update
    * @request POST:/key/{PK}
    * @description update properties of an Authentiq ID. (not operational in v4; use PUT for now) v5: POST issuer-signed email & phone scopes in a self-signed JWT See: https://github.com/skion/authentiq/wiki/JWT-Examples
    * @response `200` `{ status?: string }` Successfully updated
    * @response `404` `Error` Unknown key `unknown-key`
    * @response `default` `any` 
    */
    keyUpdate: (PK: string, body: AuthentiqID, params?: RequestParams) =>
      this.request<{ status?: string }, Error>(`/key/${PK}`, "POST", params, body),


    /**
    * @tags key, put
    * @name key_bind
    * @request PUT:/key/{PK}
    * @description Update Authentiq ID by replacing the object. v4: `JWT(sub,email,phone)` to bind email/phone hash; v5: POST issuer-signed email & phone scopes and PUT to update registration `JWT(sub, pk, devtoken, ...)` See: https://github.com/skion/authentiq/wiki/JWT-Examples
    * @response `200` `{ status?: string }` Successfully updated
    * @response `404` `Error` Unknown key `unknown-key`
    * @response `409` `Error` Already bound to another key `duplicate-hash`
    * @response `default` `any` 
    */
    keyBind: (PK: string, body: AuthentiqID, params?: RequestParams) =>
      this.request<{ status?: string }, Error>(`/key/${PK}`, "PUT", params, body),
  }
  login = {


    /**
    * @tags login, post
    * @name push_login_request
    * @request POST:/login
    * @description push sign-in request See: https://github.com/skion/authentiq/wiki/JWT-Examples
    * @response `200` `{ status?: string }` Successful response
    * @response `401` `Error` Unauthorized for this callback audience `aud-error` or JWT should be self-signed `auth-error`
    * @response `default` `any` 
    */
    pushLoginRequest: (query: { callback: string }, body: any, params?: RequestParams) =>
      this.request<{ status?: string }, Error>(`/login${this.addQueryParams(query)}`, "POST", params, body),
  }
  scope = {


    /**
    * @tags scope, post
    * @name sign_request
    * @request POST:/scope
    * @description scope verification request See: https://github.com/skion/authentiq/wiki/JWT-Examples
    * @response `201` `{ job?: string, status?: string }` Successful response
    * @response `429` `Error` Too Many Requests on same address / number `rate-limit`
    * @response `default` `any` 
    */
    signRequest: (query: { test?: number }, body: any, params?: RequestParams) =>
      this.request<{ job?: string, status?: string }, Error>(`/scope${this.addQueryParams(query)}`, "POST", params, body),


    /**
    * @tags scope, delete
    * @name sign_delete
    * @request DELETE:/scope/{job}
    * @description delete a verification job
    * @response `200` `{ status?: string }` Successfully deleted
    * @response `404` `Error` Job not found `unknown-job`
    * @response `default` `any` 
    */
    signDelete: (job: string, params?: RequestParams) =>
      this.request<{ status?: string }, Error>(`/scope/${job}`, "DELETE", params, null),


    /**
    * @tags scope, get
    * @name sign_retrieve
    * @request GET:/scope/{job}
    * @description get the status / current content of a verification job
    * @response `200` `{ exp?: number, field?: string, sub?: string }` Successful response (JWT)
    * @response `204` `any` Confirmed, waiting for signing
    * @response `404` `Error` Job not found `unknown-job`
    * @response `default` `any` 
    */
    signRetrieve: (job: string, params?: RequestParams) =>
      this.request<{ exp?: number, field?: string, sub?: string }, Error>(`/scope/${job}`, "GET", params, null),


    /**
    * @tags scope, head
    * @name sign_retrieve_head
    * @request HEAD:/scope/{job}
    * @description HEAD to get the status of a verification job
    * @response `200` `any` Confirmed and signed
    * @response `204` `any` Confirmed, waiting for signing
    * @response `404` `Error` Job not found `unknown-job`
    * @response `default` `any` 
    */
    signRetrieveHead: (job: string, params?: RequestParams) =>
      this.request<any, Error>(`/scope/${job}`, "HEAD", params, null),


    /**
    * @tags scope, post
    * @name sign_confirm
    * @request POST:/scope/{job}
    * @description this is a scope confirmation
    * @response `202` `{ status?: string }` Successfully confirmed
    * @response `401` `Error` Confirmation error `auth-error`
    * @response `404` `Error` Job not found `unknown-job`
    * @response `405` `Error` JWT POSTed to scope `not-supported`
    * @response `default` `any` 
    */
    signConfirm: (job: string, params?: RequestParams) =>
      this.request<{ status?: string }, Error>(`/scope/${job}`, "POST", params, null),


    /**
    * @tags scope, put
    * @name sign_update
    * @request PUT:/scope/{job}
    * @description authority updates a JWT with its signature See: https://github.com/skion/authentiq/wiki/JWT-Examples
    * @response `200` `any` Successfully updated
    * @response `404` `any` Job not found `unknown-job`
    * @response `409` `any` Job not confirmed yet `confirm-first`
    * @response `default` `any` 
    */
    signUpdate: (job: string, params?: RequestParams) =>
      this.request<any, any>(`/scope/${job}`, "PUT", params, null),
  }

}
