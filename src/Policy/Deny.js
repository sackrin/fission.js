import _ from 'lodash';
import { buildRoles, buildScope } from './utils';
import { Isotope } from '../Isotope';
import type { BuiltRoles, BuiltScope } from './utils';

export type DenyArgs = {
  roles: any,
  scope: any
};

export type DenyGrantArgs = {
  isotope: Isotope,
  roles: Array<string | Function>,
  scope: Array<string | Function>,
  options?: Object
};

export class Deny {
  roles: Array<string | Function>;

  scope: Array<string | Function>;

  options: Object;

  constructor ({ roles, scope, ...options }: DenyArgs) {
    this.roles = _.isArray(roles) ? roles : [ roles ];
    this.scope = _.isArray(scope) ? scope : [ scope ];
    this.options = options;
  }

  getRoles = async ({ ...options }: { options: Object }): Promise<BuiltRoles> => {
    return buildRoles(this.roles, { policy: this.options, ...options });
  };

  getScope = async ({ ...options }: { options: Object }): Promise<BuiltScope> => {
    return buildScope(this.scope, { policy: this.options, ...options });
  };

  grant = async ({ isotope, roles, scope, ...options }: DenyGrantArgs): Promise<boolean> => {
    // Retrieve the roles array for this policy
    const forRoles: BuiltRoles = await buildRoles(this.roles, options);
    // Retrieve and build the roles array from the provided roles
    const againstRoles: BuiltRoles = await buildRoles(roles, options);
    // Conduct a compare check of the two roles arrays
    const roleCheck: Array<string> = _.difference(againstRoles, forRoles);
    // If none of the provided roles were found and this policy does not allow wildcare then grant
    if (roleCheck.length === againstRoles.length && forRoles.indexOf('*') === -1) return true;
    // Retrieve the scope for this policy
    const forScopes: BuiltScope = await buildScope(this.scope, options);
    // Retrieve the scope passed to this policy
    const againstScopes: BuiltScope = await buildScope(scope, options);
    // Conduct a compare check of the two scope arrays
    const scopeCheck: Array<string> = _.difference(againstScopes, forScopes);
    // Return a grant pass if mismatch or wildcard is not located
    return (scopeCheck.length === againstScopes.length && forScopes.indexOf('*') === -1);
  };
}

export default (args: DenyGrantArgs): Deny => (new Deny(args));
