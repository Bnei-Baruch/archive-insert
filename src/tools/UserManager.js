import { Log as oidclog, UserManager } from 'oidc-client';
import {KJUR} from 'jsrsasign';

const AUTH_URL = 'https://accounts.kbb1.com/auth/realms/main';
export const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_BASE_URL : 'http://localhost:3000/';

oidclog.logger = console;
oidclog.level  = 0;

const userManagerConfig = {
    authority: AUTH_URL,
    client_id: 'workflow-insert',
    redirect_uri: `${BASE_URL}`,
    response_type: 'token id_token',
    scope: 'openid profile',
    post_logout_redirect_uri: `${BASE_URL}`,
    aautomaticSilentRenew: true,
    silent_redirect_uri: `${BASE_URL}/silent_renew.html`,
    filterProtocolClaims: true,
    loadUserInfo: true,
};

export const client = new UserManager(userManagerConfig);

client.events.addAccessTokenExpiring(() => {
    console.log("...RENEW TOKEN...");
});

client.events.addAccessTokenExpired(() => {
    console.log("...!TOKEN EXPIRED!...");
    client.signoutRedirect();
});

export const getUser = (cb) => client.getUser()
    .then((user) => {
        if(user){
            let at = KJUR.jws.JWS.parse(user.access_token);
            let roles = at.payloadObj.realm_access.roles;
            console.log(":: User's Roles: ", roles);
            user = {...user.profile, roles}
        }
        cb(user)
    })
    .catch((error) => {
    console.log("Error: ",error);
});

export default client;
