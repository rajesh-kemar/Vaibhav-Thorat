import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Authservice } from '../services/authservice';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: Authservice) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the JWT token from AuthService
    const token = this.auth.getToken();

    // Only add the Authorization header if the token exists
    const authReq = token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' // optional, ensures JSON payloads are correctly typed
          }
        })
      : req;

    return next.handle(authReq);
  }
}
