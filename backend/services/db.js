const mysql = require('mysql2/promise');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

let pool;

async function getDbConfig() {
  if (process.env.DB_HOST) {
    return {
      host: process.env.DB_HOST,
      user: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'fruitharvest',
      port: Number(process.env.DB_PORT || 3306)
    };
  }

  const secretArn = process.env.DB_SECRET_ARN;
  if (!secretArn) {
    throw new Error('Missing DB_SECRET_ARN or DB_HOST configuration');
  }

  const client = new SecretsManagerClient({ region: process.env.AWS_REGION || 'ap-southeast-1' });
  const result = await client.send(new GetSecretValueCommand({ SecretId: secretArn }));
  const secret = JSON.parse(result.SecretString);

  return {
    host: secret.host,
    user: secret.username,
    password: secret.password,
    database: process.env.DB_NAME || 'fruitharvest',
    port: Number(secret.port || 3306)
  };
}

async function getPool() {
  if (!pool) {
    const config = await getDbConfig();
    pool = mysql.createPool({
      ...config,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
}

module.exports = { getPool };
