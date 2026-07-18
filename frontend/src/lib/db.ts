import mysql from 'mysql2/promise';
import crypto from 'crypto';

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    const host = process.env.DB_HOST || 'localhost';
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'ouai';

    pool = mysql.createPool({
      host,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export async function initDb(): Promise<void> {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'ouai';

  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection({
      host,
      user,
      password,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
  } catch (e) {
    // Ignore if connection without db fails or restricted
  } finally {
    if (connection) {
      await connection.end();
    }
  }

  const p = getPool();
  // Create tables if they do not exist (escape USER as it is a reserved word in MySQL 8.0+)
  await p.query(`
    CREATE TABLE IF NOT EXISTS \`USER\` (
      USER_ID INT AUTO_INCREMENT PRIMARY KEY,
      USERNAME VARCHAR(18) UNIQUE NOT NULL,
      PASSWORD_HASH VARCHAR(255) NOT NULL
    )
  `);

  try {
    await p.query(`ALTER TABLE \`USER\` ADD COLUMN IF NOT EXISTS PASSWORD_HASH VARCHAR(255) NOT NULL`);
  } catch {}
  try {
    await p.query(`ALTER TABLE \`USER\` MODIFY COLUMN PASSWORD_HASH VARCHAR(255) NOT NULL`);
  } catch {}

  await p.query(`
    CREATE TABLE IF NOT EXISTS \`WARDROBE_ITEM\` (
      ITEM_ID INT AUTO_INCREMENT PRIMARY KEY,
      USER_ID INT NOT NULL,
      CATEGORY VARCHAR(20) NOT NULL,
      IMAGE_PATH VARCHAR(255) NOT NULL,
      FOREIGN KEY (USER_ID) REFERENCES \`USER\`(USER_ID) ON DELETE CASCADE
    )
  `);
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  return `${salt}:${key.toString('hex')}`;
}

export function verifyPassword(storedHash: string, providedPassword: string): boolean {
  try {
    const [salt, keyHex] = storedHash.split(':');
    if (!salt || !keyHex) return false;
    const key = crypto.pbkdf2Sync(providedPassword, salt, 100000, 32, 'sha256');
    return crypto.timingSafeEqual(Buffer.from(key.toString('hex'), 'hex'), Buffer.from(keyHex, 'hex'));
  } catch {
    return false;
  }
}
