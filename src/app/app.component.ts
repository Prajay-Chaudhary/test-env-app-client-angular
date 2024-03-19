import { Component, NgZone, OnInit } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Platform } from '@ionic/angular';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public userProfile: any;
  public hasValidAccessToken = false;
  public realmRoles: string[] = [];

  constructor(
    private oauthService: OAuthService,
    private zone: NgZone,
    private platform: Platform,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.platform.is('ios') && this.platform.is('capacitor')) {
      this.configureIOS();
    } else if (this.platform.is('desktop')) {
      this.configureWeb();
    } else {
      console.log('This platform is not supported.');
    }

    this.oauthService
      .loadDiscoveryDocument()
      .then((loadDiscoveryDocumentResult) => {
        console.log('loadDiscoveryDocument', loadDiscoveryDocumentResult);

        this.hasValidAccessToken = this.oauthService.hasValidAccessToken();

        this.oauthService.tryLogin().then((tryLoginResult) => {
          console.log('tryLogin', tryLoginResult);
          if (this.hasValidAccessToken) {
            this.loadUserProfile();
            this.realmRoles = this.getRealmRoles();
          }
        });
      })
      .catch((error) => {
        console.error('loadDiscoveryDocument', error);
      });

    this.oauthService.events.subscribe((eventResult) => {
      console.debug('LibEvent', eventResult);
      this.hasValidAccessToken = this.oauthService.hasValidAccessToken();
    });
  }

  private configureWeb(): void {
    console.log('Using web configuration');
    let authConfig: AuthConfig = {
      issuer: 'http://localhost:8080/realms/test-app-on-virtual-machine',
      redirectUri: 'http://localhost:4200/home',
      clientId: 'test-your-app',
      responseType: 'code',
      scope: 'openid profile email offline_access',
      // Revocation Endpoint must be set manually when using Keycloak
      revocationEndpoint:
        'http://localhost:8080/realms/test-app-on-virtual-machine/protocol/openid-connect/revoke',
      showDebugInformation: true,
      requireHttps: false,
    };
    this.oauthService.configure(authConfig);
    this.oauthService.setupAutomaticSilentRefresh();
  }

  private configureIOS(): void {
    console.log('Using iOS configuration');
    let authConfig: AuthConfig = {
      issuer: 'http://localhost:8080/realms/test-app-on-virtual-machine',
      redirectUri: 'myschema://login',
      clientId: 'test-your-app',
      responseType: 'code',
      scope: 'openid profile email offline_access',
      revocationEndpoint:
        'http://localhost:8080/realms/test-app-on-virtual-machine/protocol/openid-connect/revoke',
      showDebugInformation: true,
      requireHttps: false,
    };
    this.oauthService.configure(authConfig);
    this.oauthService.setupAutomaticSilentRefresh();

    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      let url = new URL(event.url);
      if (url.host != 'login') {
        return;
      }

      this.zone.run(() => {
        const queryParams: Params = {};
        url.searchParams.forEach((value, key) => {
          queryParams[key] = value;
        });

        this.router
          .navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge',
          })
          .then((navigateResult) => {
            this.oauthService.tryLogin().then((tryLoginResult) => {
              console.log('tryLogin', tryLoginResult);
              if (this.hasValidAccessToken) {
                this.loadUserProfile();
                this.realmRoles = this.getRealmRoles();
              }
            });
          })
          .catch((error) => console.error(error));
      });
    });
  }

  public login(): void {
    this.oauthService
      .loadDiscoveryDocumentAndLogin()
      .then((loadDiscoveryDocumentAndLoginResult) => {
        console.log(
          'loadDiscoveryDocumentAndLogin',
          loadDiscoveryDocumentAndLoginResult
        );
      })
      .catch((error) => {
        console.error('loadDiscoveryDocumentAndLogin', error);
      });
  }

  public logout(): void {
    this.oauthService
      .revokeTokenAndLogout()
      .then((revokeTokenAndLogoutResult) => {
        console.log('revokeTokenAndLogout', revokeTokenAndLogoutResult);
        this.userProfile = null;
        this.realmRoles = [];
      })
      .catch((error) => {
        console.error('revokeTokenAndLogout', error);
      });
  }

  public loadUserProfile(): void {
    this.oauthService
      .loadUserProfile()
      .then((loadUserProfileResult) => {
        console.log('loadUserProfile', loadUserProfileResult);
        this.userProfile = loadUserProfileResult;
      })
      .catch((error) => {
        console.error('loadUserProfile', error);
      });
  }

  public getRealmRoles(): string[] {
    let idClaims = this.oauthService.getIdentityClaims();
    if (!idClaims) {
      console.error(
        "Couldn't get identity claims, make sure the user is signed in."
      );
      return [];
    }
    if (!idClaims.hasOwnProperty('realm_roles')) {
      console.error(
        "Keycloak didn't provide realm_roles in the token. Have you configured the predefined mapper realm roles correct?"
      );
      return [];
    }

    let realmRoles = idClaims['realm_roles'];
    return realmRoles ?? [];
  }
}
