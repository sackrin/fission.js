import _ from 'lodash';
import { buildRoles, buildScope } from './utils';

export class PolicyGroup {
  policies = []

  constructor (policies) {
    this.policies = policies;
  }

  async grant (isotope, roles, scope) {
    if (this.policies.length === 0) { return true; }

    _.find(this.policies, () => {

    });

    const forScopes = await buildScope(scope);
    const forRoles = await buildRoles(roles);
  }
}