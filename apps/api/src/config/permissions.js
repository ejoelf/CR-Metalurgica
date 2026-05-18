export const MODULES = {
  dashboard: 'dashboard',
  clients: 'clients',
  jobs: 'jobs',
  quotes: 'quotes',
  finances: 'finances',
  agenda: 'agenda',
  gallery: 'gallery',
  messages: 'messages',
  notifications: 'notifications',
  settings: 'settings',
  users: 'users',
  audit: 'audit',
};

export const ACTIONS = {
  read: 'read',
  create: 'create',
  update: 'update',
  delete: 'delete',
  export: 'export',
  configure: 'configure',
};

export const ROLE_PERMISSIONS = {
  super_admin: ['*'],
  admin: ['*'],
  staff: [
    'dashboard:read',
    'clients:read',
    'clients:create',
    'clients:update',
    'jobs:read',
    'jobs:create',
    'jobs:update',
    'quotes:read',
    'quotes:create',
    'quotes:update',
    'agenda:read',
    'agenda:create',
    'agenda:update',
    'gallery:read',
    'gallery:create',
    'gallery:update',
    'messages:read',
    'messages:update',
    'notifications:read',
    'notifications:update',
  ],
  viewer: [
    'dashboard:read',
    'clients:read',
    'jobs:read',
    'quotes:read',
    'agenda:read',
    'gallery:read',
    'messages:read',
    'notifications:read',
  ],
};

export function can(role, moduleName, action) {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes('*') || permissions.includes(`${moduleName}:${action}`);
}
