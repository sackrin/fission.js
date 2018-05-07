import assert from 'assert';
import { SimpleValidator } from './SimpleValidator';

describe('Simple Validator', function () {
  const simpleStringRule = 'required|min:5';
  const simplePromiseRule = () => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, ['email']);
  }));

  it('can create a simple rule validator', () => {
    const validator = new SimpleValidator({ rules: [simpleStringRule], options: { test: true } });
    assert.deepEqual(validator.config.rules, [simpleStringRule]);
    assert.deepEqual(validator.options.test, true);
  });

  it('can create a mixed rule validator', () => {
    const validator = new SimpleValidator({ rules: [simpleStringRule, simplePromiseRule] });
    assert.deepEqual(validator.config.rules, [simpleStringRule, simplePromiseRule]);
  });

  it('get rules produces a usable validator string', () => {
    const validator = new SimpleValidator({ rules: [simpleStringRule, simplePromiseRule] });
    return validator.getRules().then(rules => {
      assert.deepEqual(rules, 'required|min:5|email');
    }).catch((msg) => { throw new Error(msg); });
  });

  it('validates against a simple value and passes', () => {
    const validator = new SimpleValidator({ rules: [simpleStringRule, simplePromiseRule] });
    return validator
      .validate({ value: 'Johnny' })
      .then(({ result, messages }) => {
        assert.equal(result, true);
      }).catch((msg) => { throw new Error(msg); });
  });
  //
  // it('validates against a simple value and fails', () => {
  //
  // });
});
