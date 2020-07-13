/**
 *  This module will extract all the information of the user needed for the
 *  JWT. It will return a promise which resolves to an object of the format of
 *  the DEFAULT_ADMIN_USER below.
 *
 *  FIXME: This implementation is specific to a given schema (User->Account).
 */

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
        Email: userInstance.Email,
        Roles: roles
    };
}

const userInfo = async (persistence, accountEntity, accountInstance) => {
    const userEntity = await accountEntity.getParentEntity(accountInstance);
    const docs = await userEntity.getDocuments(persistence, { _id: accountInstance.parentID }, true);
    const userInstance = (docs && docs.length) ? docs.pop() : null;

    const relationship = userEntity.getRelationshipByName('Roles');
    const roleDocuments = await relationship.getDocuments(persistence, userInstance);
    const roleObjects = roleDocuments.map((role) => roleMapper(role));
    return userInfoObject(accountInstance, userInstance, roleObjects);
};

userInfo.DEFAULT_ADMIN_USER = {
    id: "-1",
    type: "User",
    Name: "Default admin",
    UserName: "admin",
    Email: "noreply@nowhere.com",
    Roles: [{
        type: "Role",
        Name: "admin",
        Description: "Administrator role",
        label: "admin"
    }]
};

module.exports = userInfo;
