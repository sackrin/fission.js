import { Context } from '../Context/Types';
import { Policies } from '../../Policy/Types';
import { SanitizerApplyArgs, Sanitizers } from '../../Sanitize/Types';
import { PolicyGrantArgs } from '../../Policy';
import {
  ValidatorResult,
  Validators,
  ValidatorValidateArgs,
} from '../../Validate/Types';
import { Blueprints, Polymorphic } from './index';
import { Effect } from '../../Effect/Types';
import Conditions from '../../Condition/Types/Conditions';
import { Collider } from '../../Interact/Types';

export interface Blueprint {
  context: Context;
  machine: string;
  label?: string;
  description?: string;
  tags?: string[];
  parent?: Blueprint;
  defaultValue?: any;
  blueprints: Blueprints | Polymorphic;
  options: any;
  policies: Policies;
  conditions: Conditions;
  sanitizers: Sanitizers;
  validators: Validators;
  setters: Function[];
  getters: Function[];
  setBlueprints(blueprints?: Blueprints): void;
  setSanitizers(sanitizers?: Sanitizers): void;
  setValidators(validators?: Validators): void;
  getDefault(options?: any): any;
  grant({ scope, roles, options }: PolicyGrantArgs): boolean;
  presence({
    collider,
    hydrate,
    ...options
  }: {
    collider: Collider;
    hydrate: Effect;
    options?: any;
  }): boolean;
  validate({ effect, options }: ValidatorValidateArgs): ValidatorResult;
  sanitize({ effect, options }: SanitizerApplyArgs): any;
  applyGetters({ effect, options }: { effect: Effect; options?: any }): any;
  applySetters({ effect, options }: { effect: Effect; options?: any }): any;
}

export default Blueprint;
