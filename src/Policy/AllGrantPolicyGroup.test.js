import assert from 'assert';
import { AllGrantPolicyGroup } from './AllGrantPolicyGroup';
import { Allow } from './Allow';
import { Deny } from './Deny';
import { Isotope } from '../';

describe('All Grant Policy Group', function () {
  const isotope = new Isotope();

  const simplePolicies = [
    new Deny(['member'], ['read', 'write']),
    new Allow(['user', 'admin'], ['read', 'write'])
  ];

  const complexPolicies = [
    new Deny([() => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['member']);
    }))], [() => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['read', 'write']);
    }))]),
    new Allow(['member', () => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['user', 'admin']);
    }))], ['read', 'write', () => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['read', 'write']);
    }))])
  ];

  it('can be created and have policies added to it', () => {
    const policyGroup = new AllGrantPolicyGroup(simplePolicies);
    assert.deepEqual(policyGroup.policies, simplePolicies);
  });

  it('perform a pass grant test with no policies', () => {
    const policyGroup = new AllGrantPolicyGroup([]);
    return policyGroup.grant(isotope, ['user'], ['write'])
      .then(result => {
        assert.equal(result, true);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('perform a simple pass grant', () => {
    const policyGroup = new AllGrantPolicyGroup(simplePolicies);
    return policyGroup.grant(isotope, ['user'], ['write'])
      .then(result => {
        assert.equal(result, true);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('perform a mixed pass grant', () => {
    const policyGroup = new AllGrantPolicyGroup(complexPolicies);
    return policyGroup.grant(isotope, ['user'], ['write'])
      .then(result => {
        assert.equal(result, true);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('perform a simple denied grant', () => {
    const policyGroup = new AllGrantPolicyGroup(simplePolicies);
    return policyGroup.grant(isotope, ['member'], ['write'])
      .then(result => {
        assert.equal(result, false);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('perform a mixed denied grant', () => {
    const policyGroup = new AllGrantPolicyGroup(complexPolicies);
    return policyGroup.grant(isotope, ['member'], ['write'])
      .then(result => {
        assert.equal(result, false);
      })
      .catch((msg) => { throw new Error(msg); });
  });
});