import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { keycloak } from './keycloak';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return from(
      keycloak.updateToken(30).catch((err) => {
        console.error('Failed to refresh token', err);
      }),
    ).pipe(
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
