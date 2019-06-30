import { min } from './min';
import { max } from './max';

export function between(val, args) {
  return min(val, [args[0]]) && max(val, [args[1]]);
}