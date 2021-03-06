# WarpJS session plugin

This plugin will handle the login and credentials.

This plugin will inject/work with an user object on `req.warpjsUser`.


## Configuration

Add the following configuration section to your project:

    {
      "plugins": [{
        "name": "Session manager",
        "moduleName": "@warp-works/warpjs-session-plugin",
        "path": "/session",
        "type": "session",
        "config": {
          "jwtSecret": "YourJsonWebTokenSecret",
          "jwtCookieName": "NameOfYourJsonWebTokenCookie"
          "roles": {
            "admin": "admin",
            "content": "content"
          },
          "admin": {
            "username": "defaultAdminUsername",
            "password": "bcryptPasswordForDefaultAdmin"
          },
          "casSSO": {
            "enabled": true,
            "urlPrefix": "https://cas-server/sso",
            "userAttribute": "ssoID"
          }
        }
      }]
    }


- `casSSO`: Add this section if cas SSO is used.
    - `enabled`: If we should use CAS SSO integration.
    - `urlPrefix`: CAS SSO url prefix to use.
    - `userAttribute`: Attribute name added to the account entity (`users.entity`).


## Exposed routes

This plugin exposes the following routes:

- `W2:plugin:session:login` To process login.
- `W2:plugin:session:logout` To process logout.


## Usage

    const warpjsSession = require('@warp-works/warpjs-session-plugin');

    const sessionMiddlewares = warpjsSession.middlewares(

TODO...
