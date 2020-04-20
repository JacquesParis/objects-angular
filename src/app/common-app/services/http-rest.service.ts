import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import {
  IRestService,
  IRestQueryParam,
  IRestResponse,
} from '@jacquesparis/objects-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpRestService implements IRestService {
  constructor(protected httpClient: HttpClient) {}
  public async get<T>(
    uri: string,
    queryParams?: IRestQueryParam
  ): Promise<IRestResponse<T>> {
    const response: IRestResponse<T> = { result: null, status: null };
    const options: any = { responseType: 'json', observe: 'response' };
    if (queryParams && 0 < Object.keys(queryParams).length) {
      options.params = {};
      Object.keys(queryParams).forEach((key) => {
        if (Array.isArray(queryParams[key])) {
          options.params[key] = [];
          queryParams[key].array.forEach((element) => {
            options.params[key].push(JSON.stringify(element));
          });
        } else {
          options.params[key] = JSON.stringify(queryParams[key]);
        }
      });
    }
    try {
      const httpResponse: HttpResponse<T> = (await ((this.httpClient.get(
        uri,
        options
      ) as unknown) as Observable<
        HttpResponse<T>
      >).toPromise()) as HttpResponse<T>;
      response.result = httpResponse.body;
      response.status = httpResponse.status;
    } catch (error) {
      throw error;
    }
    return response;
  }

  public async put<T>(uri: string, entity: T): Promise<IRestResponse<void>> {
    const response: IRestResponse<void> = { result: null, status: null };
    const options: any = {
      responseType: 'json',
      observe: 'events',
    };
    try {
      const httpResponse: HttpResponse<void> = (await ((this.httpClient.put(
        uri,
        entity,
        options
      ) as unknown) as Observable<
        HttpResponse<void>
      >).toPromise()) as HttpResponse<void>;
      response.result = httpResponse.body;
      response.status = httpResponse.status;
    } catch (error) {
      throw error;
    }
    return response;
  }

  public patch<T>(uri: string, entity: T): Promise<IRestResponse<void>> {
    return this.patchOdPushOrPost('patch', uri, entity) as Promise<
      IRestResponse<void>
    >;
  }

  public post<T>(uri: string, entity: T): Promise<IRestResponse<T>> {
    return this.patchOdPushOrPost('post', uri, entity) as Promise<
      IRestResponse<T>
    >;
  }

  protected async patchOdPushOrPost<T>(
    type: 'patch' | 'put' | 'post',
    uri: string,
    entity: T
  ): Promise<IRestResponse<void | T>> {
    const response: IRestResponse<void> = { result: null, status: null };
    const options: any = {
      responseType: 'json',
      observe: 'events',
    };
    try {
      const httpResponse: HttpResponse<void> = (await ((this.httpClient[type](
        uri,
        entity,
        options
      ) as unknown) as Observable<
        HttpResponse<void>
      >).toPromise()) as HttpResponse<void>;
      response.result = httpResponse.body;
      response.status = httpResponse.status;
    } catch (error) {
      throw error;
    }
    return response;
  }
}
