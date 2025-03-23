import * as migration_20250323_172746 from './20250323_172746';
import * as migration_20250323_175748 from './20250323_175748';

export const migrations = [
  {
    up: migration_20250323_172746.up,
    down: migration_20250323_172746.down,
    name: '20250323_172746',
  },
  {
    up: migration_20250323_175748.up,
    down: migration_20250323_175748.down,
    name: '20250323_175748'
  },
];
