import Keycloak from 'keycloak-js';
import { environment } from '../environments/environment';

export const keycloak = new Keycloak({
  url: environment.keycloakUrl,
  realm: 'sport-archive',
  clientId: 'sport-archive',
});
