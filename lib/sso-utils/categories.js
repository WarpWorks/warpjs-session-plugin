const extend = require('lodash/extend');
const reduce = require('lodash/reduce');

const RH_TO_SSO = Object.freeze({
    FoundingMember: 'Founder',
    ContributingMember: 'Contributing',
    LargeIndustryMember: 'Large Industry',
    SmallIndustryMember: 'Small Industry',
    NonprofitOrAcademiaMember: 'Nonprofit',
    GovernmentMember: 'Government',
    NonMember: 'Individual Non-members',
    Staff: 'Staff',
    LargeInnovator: 'LargeInnovator'
});

const SSO_TO_RH = Object.freeze(reduce(RH_TO_SSO, (memo, value, key) => extend(memo, { [value]: key }), {}));

module.exports = Object.freeze({
    fromRhToSso: (category) => RH_TO_SSO[category] || null,
    fromSsoToRh: (category) => SSO_TO_RH[category] || null
});
