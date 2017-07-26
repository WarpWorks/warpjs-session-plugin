# WarpJS session plugin

This plugin will handle the login and credentials.

## Configuration

Add the following configuration section to your project:

    {
      "plugins": [{
        "name": "@warp-works/warpjs-session-plugin",
        "path": "/session",
        "config": {
          "cookieSecret": "YourServerSecretToSignCookie",
          "jwtSecret": "YourJsonWebTokenSecret",
          "jwtCookieName": "NameOfYourJsonWebTokenCookie"
        }
      }]
    }
