import { getMixedResult } from '../Utils';

export class GrantSinglePolicy {
  policies = [];

  options = {};

  constructor ({ policies, ...options }) {
    this.policies = policies;
    this.options = options;
  }

  grant = async ({ isotope, roles, scope, ...options }) => {
    // If no policies then return a pass grant
    if (this.policies.length === 0) { return true; }
    // Retrieve the built passed scope and roles
    const builtScope = await getMixedResult(scope, options);
    const builtRoles = await getMixedResult(roles, options);
    // Loop through and search for a granting policy
    // Only one policy is required in order to achieve a policy grant
    // This is why best practice is to add a deny *, * policy to all policy groups
    return this.policies.reduce(async (flag, policy) => {
      const currFlag = await flag;
      return await policy.grant({
        isotope,
        roles: builtRoles,
        scope: builtScope,
        ...options
      }) ? true : currFlag;
    }, false);
  }
}

export default (policies, options = {}) => (new GrantSinglePolicy({ policies, ...options }));
