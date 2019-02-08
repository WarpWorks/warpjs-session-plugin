# Releases

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
