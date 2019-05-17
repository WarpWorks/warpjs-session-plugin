// const debug = require('./debug')('create-user');
const serverUtils = require('./../utils');
const ssoUtils = require('./../../lib/sso-utils');

const REQUIRED_FIELDS = [ 'contactId', 'username', 'fullname', 'email', 'organization' ];

module.exports = async (req, res) => {
    const { body } = req;

    const resource = ssoUtils.makeResource(req, {
        description: "Create new user"
    });

    const errors = REQUIRED_FIELDS.reduce(
        (memo, field) => {
            if (!body[field] || !body[field].trim()) {
                return memo.concat(`'${field}'`);
            } else {
                return memo;
            }
        },
        []
    );

    if (errors.length) {
        serverUtils.resourceErrorMessage(resource, `Missing ${errors.join(', ')} in payload.`);
        ssoUtils.sendResource(res, 400, resource);
        return;
    }

    const persistence = serverUtils.getPersistence(req);

    try {
        const domain = await serverUtils.getDomain(req);
        const accountEntity = domain.getEntityByName(ssoUtils.ENTITIES.ACCOUNT);
        const userEntity = domain.getEntityByName(ssoUtils.ENTITIES.USER);
        const memberEntity = domain.getEntityByName(ssoUtils.ENTITIES.MEMBER);

        const contactId = body.contactId.trim();
        const accountDocuments = await accountEntity.getDocuments(persistence, {
            ssoID: contactId
        });
        if (accountDocuments.length) {
            serverUtils.resourceErrorMessage(resource, `Contact ID '${contactId}' exists.`);
            ssoUtils.sendResource(res, 400, resource);
            return;
        }

        const username = body.username.trim();
        const accountDocumentsByUsername = await accountEntity.getDocuments(persistence, {
            UserName: username
        });
        if (accountDocumentsByUsername.length) {
            serverUtils.resourceErrorMessage(resource, `Username '${username}' exists.`);
            ssoUtils.sendResource(res, 400, resource);
            return;
        }

        const organizationData = await serverUtils.getOrganization(persistence, domain);
        const organizationUsersRelationship = organizationData.model.getRelationshipByName(ssoUtils.RELATIONSHIPS.USERS);

        // Create new user.
        const newUser = userEntity.createContentChildForRelationship(
            organizationUsersRelationship,
            organizationData.model,
            organizationData.instance
        );
        newUser.Name = body.fullname;
        newUser.Email = body.email;
        const savedUser = await userEntity.createDocument(persistence, newUser);

        // Create new account.
        const userAccountRelationship = userEntity.getRelationshipByName(ssoUtils.RELATIONSHIPS.ACCOUNTS);
        const newAccount = accountEntity.createContentChildForRelationship(
            userAccountRelationship,
            userEntity,
            savedUser
        );
        newAccount.UserName = username;
        newAccount.ssoID = contactId;
        await accountEntity.createDocument(persistence, newAccount);

        // Link company
        const memberDocuments = await memberEntity.getDocuments(persistence, {
            Name: body.organization.trim()
        });
        if (memberDocuments.length) {
            const memberDocument = memberDocuments[0];
            const data = {
                id: memberDocument.id,
                type: memberEntity.name,
                typeID: memberEntity.id,
                desc: (body.title || '').trim(),
                position: 1
            };
            const userMemberRelationship = userEntity.getRelationshipByName(ssoUtils.RELATIONSHIPS.WORKING_FOR);
            await userMemberRelationship.addAssociation(savedUser, data, persistence);
            await userEntity.updateDocument(persistence, savedUser);
        } else {
            serverUtils.resourceErrorMessage(resource, `Organization '${body.organization.trim()}' not found.`);
        }

        const userResource = await ssoUtils.userResource(req, persistence, userEntity, savedUser);
        resource.embed('items', userResource);
        ssoUtils.sendResource(res, 200, resource);
    } catch (err) {
        ssoUtils.sendErrorResource(res, err, resource);
    } finally {
        persistence.close();
    }
};
