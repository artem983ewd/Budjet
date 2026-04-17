export interface IJwtConfig {
  accessSecret: string;
  refreshSecret: string;
  accessExpires: '15m';
  refreshExpires: '7d';
}
