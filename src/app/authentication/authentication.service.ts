import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { Http, Headers } from "@angular/http";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";

import { environment } from './../../environments/environment.prod';

import { GlobalEventsManager } from './../_shared/global-events-manager.service';

@Injectable()
export class AuthenticationService {
  public jwt: string;

  constructor(
    private http: Http,
    private router: Router,
    private globalEventsManager: GlobalEventsManager
  ) {
    this.jwt = sessionStorage.getItem("jwt");
  }

  login(usernameEmail: string, password: string): Observable<boolean> {
    return this.http
      .post(
        `${environment.apiUrl}/auth/login`,
        JSON.stringify({
          user: {
            username_or_email: usernameEmail,
            password: password
          }
        }),
        { headers: this.getHeaders() }
      )
      .map(res => {
        let jwt = res.json().jwt;
        if (jwt) {
          this.jwt = jwt;
          sessionStorage.setItem("jwt", this.jwt);
          this.globalEventsManager.showNavBar(true);
          this.router.navigate(["/assets"]);
          return true;
        } else {
          return false;
        }
      })
      .catch((err: any) => {
        return Observable.throw(new Error(err.json().message));
      });
  }

  logout(): void {
    this.jwt = null;
    sessionStorage.removeItem("jwt");
    this.globalEventsManager.showNavBar(false);
    this.router.navigate(["/"]);
  }

  private getHeaders() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return headers;
  }

  public isUsuarioAutenticado() {
    return this.jwt !== null;
  }
}
