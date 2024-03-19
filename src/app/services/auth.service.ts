import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private oauthService: OAuthService) {}

  getRoles(): string[] {
    const token = this.oauthService.getAccessToken();
    if (token) {
      const decodedToken = this.oauthService.getIdentityClaims();
      console.log('decoded token', decodedToken);

      const rolesArray = decodedToken['realm_roles'];
      rolesArray.forEach((role: any, index: number) => {
        console.log(`Role ${index + 1}: ${role}`);
      });
      return rolesArray;
    }
    return [];
  }
}
