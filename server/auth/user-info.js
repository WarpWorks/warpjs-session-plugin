/**
 *  This module will extract all the information of the user needed for the
 *  JWT. It will return a promise which resolves to an object of the format of
 *  the DEFAULT_ADMIN_USER below.
 *
 *  FIXME: This implementation is specific to a given schema (User->Account).
 */
const Promise = require('bluebird');

function roleMapper(role) {
    return {
        id: role.id,
        type: role.type,
        Name: role.Name,
        Description: role.Description,
        label: role.Name // FIXME: Should use the entity's getDisplayName().
    };
}

function userInfoObject(accountInstance, userInstance, roles) {
    return {
        id: userInstance.id,
        type: userInstance.type,
        Name: userInstance.Name,
        UserName: accountInstance.UserName,
        Roles: roles
    };
}

function userInfo(persistence, accountEntity, accountInstance) {
    return Promise.resolve()
        .then(() => accountEntity.getParentEntity(accountInstance))
        .then((userEntity) => Promise.resolve()
            .then(() => userEntity.getDocuments(persistence, {_id: accountInstance.parentID}, true))
            .then((docs) => (docs && docs.length && docs.pop()) || null)
            .then((userInstance) => Promise.resolve()
                .then(() => userEntity.getRelationshipByName('Roles'))
                .then((relationship) => relationship.getDocuments(persistence, userInstance))
                .then((roles) => roles.map((role) => roleMapper(role)))
                .then((roles) => userInfoObject(accountInstance, userInstance, roles))
            )
        )
    ;
}

userInfo.DEFAULT_ADMIN_USER = {
    id: "-1",
    type: "User",
    Name: "Default admin",
    UserName: "admin",
    Roles: [{
        type: "Role",
        label: "admin"
    }]
};

module.exports = userInfo;
