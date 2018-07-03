import assert from 'assert';
import GrantSinglePolicy from '../GrantSinglePolicy';
import Allow from '../Allow';
import Deny from '../Deny';
import { Isotope } from '../../Isotope';

describe('Grant Single Policy', function () {
  const isotope = Isotope({});

  const simplePolicies = [
    Deny({ roles: ['member'], scope: ['read', 'write'] }),
    Allow({ roles: ['user', 'admin'], scope: ['read', 'write'] })
  ];

  const complexPolicies = [
    Deny({
      roles: [() => (new Promise(function (resolve, reject) { setTimeout(resolve, 100, ['member']); }))],
      scope: [() => (new Promise(function (resolve, reject) { setTimeout(resolve, 100, ['read', 'write']); }))]
    }),
    Allow({
      roles: [() => (new Promise(function (resolve, reject) { setTimeout(resolve, 100, ['user', 'admin']); }))],
      scope: ['read', 'write', () => (new Promise(function (resolve, reject) { setTimeout(resolve, 100, ['read', 'write']); }))]
    })
  ];

  it('can be created and have policies added to it', () => {
    const policyGroup = GrantSinglePolicy(simplePolicies);
    assert.deepEqual(policyGroup.policies, simplePolicies);
  });

  it('perform a pass grant test with no policies', () => {
    const policyGroup = GrantSinglePolicy([]);
    return policyGroup.grant({ isotope, roles: ['user'], scope: ['write'] })
      .then(result => {
        assert.equal(result, true);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('perform a simple pass grant', () => {
    const policyGroup = GrantSinglePolicy(simplePolicies);
    return policyGroup.grant({ isotope, roles: ['user'], scope: ['write'] })
      .then(result => {
        assert.equal(result, true);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('perform a mixed pass grant', () => {
    const policyGroup = GrantSinglePolicy(complexPolicies);
    return policyGroup.grant({ isotope, roles: ['user'], scope: ['write'] })
      .then(result => {
        assert.equal(result, true);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('perform a simple denied grant', () => {
    const policyGroup = GrantSinglePolicy(simplePolicies);
    return policyGroup.grant({ isotope, roles: ['member'], scope: ['write'] })
      .then(result => {
        assert.equal(result, false);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('perform a mixed denied grant', () => {
    const policyGroup = GrantSinglePolicy(complexPolicies);
    return policyGroup.grant({ isotope, roles: ['member'], scope: ['write'] })
      .then(result => {
        assert.equal(result, false);
      })
      .catch((msg) => { throw new Error(msg); });
  });
});
