import { NextResponse } from 'next/server';
import { getPool, initDb, hashPassword, verifyPassword } from '@/lib/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function POST(req: Request) {
  try {
    await initDb();
    const body = await req.json();
    const { action, username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const pool = getPool();

    if (action === 'signup') {
      // Check if username already exists
      const [existing] = await pool.query<RowDataPacket[]>(
        'SELECT USER_ID FROM USER WHERE USERNAME = ?',
        [username]
      );

      if (existing && existing.length > 0) {
        return NextResponse.json(
          { error: 'Username already taken. Please choose another.' },
          { status: 409 }
        );
      }

      const passwordHash = hashPassword(password);
      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO USER (USERNAME, PASSWORD_HASH) VALUES (?, ?)',
        [username, passwordHash]
      );

      return NextResponse.json({
        success: true,
        user: {
          id: result.insertId,
          username,
        },
      });
    } else if (action === 'login') {
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT USER_ID, USERNAME, PASSWORD_HASH FROM USER WHERE USERNAME = ?',
        [username]
      );

      if (!rows || rows.length === 0) {
        return NextResponse.json(
          { error: 'Invalid username or password.' },
          { status: 401 }
        );
      }

      const userRow = rows[0];
      const isValid = verifyPassword(userRow.PASSWORD_HASH, password);

      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid username or password.' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: userRow.USER_ID,
          username: userRow.USERNAME,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Must be login or signup.' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { error: error.message || 'Database error occurred during authentication.' },
      { status: 500 }
    );
  }
}
