import { Policy } from './index';
import PolicyGrantArgs from './PolicyGrantArgs';
import { Options } from '../../Common';

export interface Policies {
  policies: Policy[];
  options: Options;
  grant({
    roles,
    scope,
    ...options
  }: PolicyGrantArgs): Promise<boolean>;
}

export default Policies;
