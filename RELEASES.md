# Releases

## 2.0.6 - 2022-02-11

- Fix list of companies API request.

## 2.0.2 - 2021-06-22

- Updated bcrypt lib.

## 2.0.1 - 2021-06-21

- Merging into master branch and latest tag.

## 1.2.30 - 2020-07-13

- Adding the email address to the JWT.

## 1.2.29 - 2019-12-06

- Adding check for search engines to by-pass SSO.

## 1.2.28 - 2019-11-11

- WarpWorks/warpjs#289: Fixed Status, Versionable, and WriteAccess on member and user creation.

## 1.2.27 - 2019-07-22

- WarpWorks/warpjs#254: Fixing new company creation by SSO.

## 1.2.26 - 2019-05-16

- #9: Refixed user update after fixing company issues.

## 1.2.25 - 2019-05-16

- #9: Fixed variable name broken during refactoring.

## 1.2.24 - 2019-05-16

- #9: SSO update user's organization and username.

## 1.2.23 - 2019-05-15

- #9: SSO update some fields for User.

## 1.2.22 - 2019-05-15

- #9: SSO create User.

## 1.2.21 - 2019-05-14

- Fixed error during promise -> async/await conversion.

## 1.2.20 - 2019-05-14

- #9: List all users and info on a single user.

## 1.2.19 - 2019-03-28

- #10: Fixed SSO session.

## 1.2.18 - 2019-03-18

- #7: Fixed enabled: true/false

## 1.2.17 - 2019-03-18

- #7: Adding handling of company category.

## 1.2.16 - 2019-03-14

- #8: Send PUT to PATCH to support SSO implementatiion.

## 1.2.15 - 2019-03-07

- #6: Company CRUD.

## 1.2.14 - 2019-02-13

- #5: Added list of companies and company info.

## 1.2.13 - 2019-02-08

- #5: Changed SameSite=Lax instead of Strict because it breaks the flow on
  AWS-Docker.

## 1.2.12 - 2019-02-05

- #5: Trying removing a dangling call to `next()` in middleware.

## 1.2.11 - 2019-02-04

- #5: Fixed infinite redirect loop and login returns to current page.

## 1.2.10 - 2019-01-29

- #5: Added CAS SSO support.

## 1.2.9 - 2018-09-17

- Fixed issue when user is not logged in.

## 1.2.8 - 2018-08-03

- #1: Refactored for warpjsUtils.sendPortalIndex().

## 1.2.7 - 2018-08-01

- Portal new header.

## 1.2.6 - 2018-06-19

- Fixed form enctype following usage of plugin for file upload.

## 1.2.5 - 2018-01-09

- Revert changes to `.getDomainByName()`.
- Version named assets.

## 1.2.4 - 2018-01-08

- `.getDomainByName(persistence, domainName)`.

## 1.2.3 - 2018-01-05

- Updated warpjs-utils.

## 1.2.2 - 2017-12-08

- Fixed access for entity without `WriteAccess`.

## 1.2.1 - 2017-12-01

- Using new header with search.

## 0.3.2 - 2017-11-06

- Added proper role's Name to the admin user object.

## 0.3.1 - 2017-10-31

- Restructured code to be more lisible.

## 0.3.0 - 2017-10-30

- Moving session management of users into the plugin instead of core. Password
  fields are now encrypted.

## 0.2.2 - 2017-10-11

- Update warpjs-utils.

## 0.2.1 - 2017-10-06

- Fixed to use partials and helpers from warpjs-utils.

## 0.2.0 - 2017-10-06

- Refactored for warpjs-utils@0.3.x (chai@4.x).

## 0.1.0 - 2017-07-31

- Initial release.
