module.exports = (user, role) => Boolean(user && user.Roles.find((userRole) => userRole.id === role.id));
