# WarpJS session plugin

This plugin will handle the login and credentials.

This plugin will inject/work with an user object on `req.warpjsUser`.

## Configuration

Add the following configuration section to your project:

    {
      "auth-plugin": "@warp-works/warpjs-session-plugin",
      "plugins": [{
        "name": "@warp-works/warpjs-session-plugin",
        "path": "/session",
        "config": {
          "cookieSecret": "YourServerSecretToSignCookie",
          "jwtSecret": "YourJsonWebTokenSecret",
          "jwtCookieName": "NameOfYourJsonWebTokenCookie"
          "admin": {
            "username": "defaultAdminUsername",
            "password": "bcryptPasswordForDefaultAdmin"
          }
        }
      }]
    }

## Exposed routes

This plugin exposes the following routes:

- `W2:plugin:session:login` To process login.
- `W2:plugin:session:logout` To process logout.

## Usage

    const warpjsSession = require('@warp-works/warpjs-session-plugin');

    const sessionMiddlewares = warpjsSession.middlewares(
