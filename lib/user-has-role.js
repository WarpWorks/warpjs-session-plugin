module.exports = (user, role) => Boolean(user.Roles.filter((userRole) => userRole.id === role.id).length);
