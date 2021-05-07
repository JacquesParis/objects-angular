import { EntityObservationService } from './entity-observation.service';
import { IRestEntity } from '@jacquesparis/objects-model';
import { isObject } from 'lodash-es';
import { Observable } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';

import * as jsonLogic from 'json-logic-js';

export interface IEntityObserver {
  observe(entity: IRestEntity);
}

@Injectable({
  providedIn: 'root',
})
export class EntityObservationInterceptor implements HttpInterceptor {
  constructor(private entityObservationService: EntityObservationService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((result) => {
        if (result instanceof HttpResponse && result.body) {
          if (isObject(result.body) && result.body.entityCtx?.entityType) {
            for (const observerCandidate of this.entityObservationService
              .observers) {
              if (
                (0 === observerCandidate.observed ||
                  !observerCandidate.options.once) &&
                jsonLogic.apply(observerCandidate.rule, result.body)
              ) {
                observerCandidate.observer.observe(result.body);
                observerCandidate.observed++;
              }
            }
          }
        }
      })
    );
    /*
    return result.subscribe((result) => {
      if (result instanceof HttpResponse && result.body) {
        if (isObject(result.body) && result.body.entityCtx?.entityType) {
          for (const observerCandidate of this.entityObservationService
            .observers) {
            if (
              (0 === observerCandidate.observed ||
                !observerCandidate.options.once) &&
              jsonLogic.apply(observerCandidate.rule, result.body)
            ) {
              observerCandidate.observer.observe(result.body);
              observerCandidate.observed++;
            }
          }
        }
      }
    });
    return result;*/
  }
}
