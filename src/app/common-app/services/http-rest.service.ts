import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {
  IRestService,
  IRestQueryParam,
  IRestResponse,
} from '@jacquesparis/objects-client';
import { Observable } from 'rxjs';
import * as _ from 'lodash-es';

interface HttpErrorInterface {
  headers?: { [header: string]: any };
  status?: number; // 405
  statusCode?: number; // 405,
  statusText?: string; // "Method Not Allowed",
  url?: string; // "http://localhost:3000/api/object-nodes/84f55252-c50b-453e-b549-ef5568c0aa97",
  ok?: boolean; // false,
  name: string; // "HttpErrorResponse",
  message: string; // "Http failure response for http://localhost:3000...: 405 Method Not Allowed",
  error?: {
    error?: HttpErrorInterface;
  };
}

export class HttpRestError extends Error {
  constructor(public error: HttpErrorInterface) {
    super(HttpRestError.buildMessage(error));
  }
  public static buildMessage(error: HttpErrorInterface): string {
    if (error.error && error.error.error) {
      return this.buildMessage(error.error.error);
    }
    return error.message ? error.message : 'Unexpected error';
  }
}

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
          queryParams[key].forEach((element) => {
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
      throw new HttpRestError(error);
    }
    return response;
  }

  public async put<T>(
    uri: string,
    entity: T,
    formDataUri?: string
  ): Promise<IRestResponse<void>> {
    return this.patchOdPushOrPost('put', uri, entity, formDataUri) as Promise<
      IRestResponse<void>
    >;
  }

  public patch<T>(
    uri: string,
    entity: T,
    formDataUri?: string
  ): Promise<IRestResponse<void>> {
    return this.patchOdPushOrPost('patch', uri, entity, formDataUri) as Promise<
      IRestResponse<void>
    >;
  }

  public post<T>(
    uri: string,
    entity: T,
    formDataUri?: string
  ): Promise<IRestResponse<T>> {
    return this.patchOdPushOrPost('post', uri, entity, formDataUri) as Promise<
      IRestResponse<T>
    >;
  }

  public async delete<T>(uri: string): Promise<IRestResponse<void>> {
    const response: IRestResponse<void> = { result: null, status: null };
    const options: any = { responseType: 'json', observe: 'events' };
    try {
      const httpResponse: HttpResponse<void> = (await ((this.httpClient.delete(
        uri,
        options
      ) as unknown) as Observable<
        HttpResponse<void>
      >).toPromise()) as HttpResponse<void>;
      response.result = httpResponse.body;
      response.status = httpResponse.status;
    } catch (error) {
      throw new HttpRestError(error);
    }
    return response;
  }

  protected lookForFormData(
    value: any,
    formData = new FormData(),
    jsonPath = ''
  ): boolean | FormData {
    let fileFound = false;
    if ('File' === value?.constructor?.name) {
      const file = (value as unknown) as File;
      formData.append(jsonPath, file, file.name);
      fileFound = true;
    } else if (_.isObject(value)) {
      // tslint:disable-next-line: forin
      for (const key in value) {
        fileFound =
          fileFound ||
          !!this.lookForFormData(
            value[key],
            formData,
            ('' !== jsonPath ? jsonPath + '.' : '') + key
          );
      }
    } else if (_.isArray(value)) {
      // tslint:disable-next-line: forin
      for (const index in value) {
        fileFound =
          fileFound ||
          !!this.lookForFormData(
            value[index],
            formData,
            jsonPath + '[' + index + ']'
          );
      }
    } else {
      formData.append(jsonPath, JSON.stringify(value));
    }
    return fileFound ? formData : false;
  }

  protected async patchOdPushOrPost<T>(
    type: 'patch' | 'put' | 'post',
    uri: string,
    entity: T,
    formDataUri?: string
  ): Promise<IRestResponse<void | T>> {
    const response: IRestResponse<void | T> = { result: null, status: null };
    const options: any = {
      responseType: 'json',
      observe: 'events',
    };
    try {
      let postData: any = entity;
      let postUri = uri;
      if (formDataUri) {
        const formData = this.lookForFormData(entity);
        if (formData) {
          postData = formData;
          postUri = formDataUri;
        }
      }
      const httpResponse: HttpResponse<void | T> = (await ((this.httpClient[
        type
      ](postUri, postData, options) as unknown) as Observable<
        HttpResponse<void | T>
      >).toPromise()) as HttpResponse<void | T>;
      response.result = httpResponse.body;
      response.status = httpResponse.status;
    } catch (error) {
      throw new HttpRestError(error);
    }
    return response;
  }
}
