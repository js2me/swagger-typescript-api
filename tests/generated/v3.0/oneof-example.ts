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


export interface Dog {
  bark?: boolean;
  breed?: "Dingo" | "Husky" | "Retriever" | "Shepherd";
}

export interface Cat {
  hunts?: boolean;
  age?: number;
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

export class Api<SecurityDataType> {
  
  public baseUrl = "";
  public title = "Oneof Example";
  public version = "1.0.0";

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



  pets = {


    /**
    * @name petsPartialUpdate
    * @request PATCH:/pets
    * @response `200` `any` Updated
    */
    petsPartialUpdate: (data: Cat | Dog, params?: RequestParams) =>
      this.request<any, any>(`/pets`, "PATCH", params, data),
  }

}
