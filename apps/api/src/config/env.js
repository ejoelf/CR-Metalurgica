export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  apiPrefix: process.env.API_PREFIX || '/api',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'change_me_access_secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'change_me_refresh_secret',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  webUrl: process.env.WEB_URL || 'http://localhost:5173',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:5174',
};

export function isProduction() {
  return env.nodeEnv === 'production';
}
