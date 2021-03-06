import { BlueprintsType, Blueprint } from './index';

export interface Blueprints {
  blueprints: BlueprintsType;
  parent?: Blueprint;
  options: any;
  setParent(parent: Blueprint): void;
  all(): BlueprintsType;
  resolve(values: any): this;
}

export default Blueprints;
