import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { keycloak } from './keycloak';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!keycloak.authenticated && !keycloak.refreshToken) {
      return next.handle(req);
    }

    return from(keycloak.updateToken(30)).pipe(
      catchError(() => of(false)),
      mergeMap(() => {
        const token = keycloak.token;
        if (!token) {
          return next.handle(req);
        }
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
        return next.handle(authReq);
      }),
    );
  }
}
