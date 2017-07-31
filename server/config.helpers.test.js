module.exports = {
    domainName: "Your-schema-domain",
    cookieSecret: "YourServerSecretToSignCookie",
    jwtSecret: "YourJsonWebTokenSecret",
    jwtCookieName: "NameOfYourJsonWebTokenCookie",
    admin: {
        username: "defaultAdminUsername",
        password: "bcryptPasswordForDefaultAdmin"
    }
};
