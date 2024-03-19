import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private oauthService: OAuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.oauthService.hasValidAccessToken()) {
      return true; // User has valid access token, allow access to route
    } else {
      // User doesn't have a valid access token, redirect to Keycloak login page
      this.oauthService.initLoginFlow();
      return false; // Prevent access to route
    }
  }
}
