import { NextResponse } from 'next/server';
import { getPool, initDb } from '@/lib/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET(req: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId parameter is required.' }, { status: 400 });
    }

    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT ITEM_ID, USER_ID, CATEGORY, IMAGE_PATH FROM `WARDROBE_ITEM` WHERE USER_ID = ? ORDER BY ITEM_ID DESC',
      [userId]
    );

    return NextResponse.json({ success: true, items: rows });
  } catch (error: any) {
    console.error('Wardrobe GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch wardrobe items.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await initDb();
    const body = await req.json();
    const { userId, category, imagePath } = body;

    if (!userId || !category || !imagePath) {
      return NextResponse.json(
        { error: 'userId, category, and imagePath are required.' },
        { status: 400 }
      );
    }

    const pool = getPool();
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO `WARDROBE_ITEM` (USER_ID, CATEGORY, IMAGE_PATH) VALUES (?, ?, ?)',
      [userId, category, imagePath]
    );

    return NextResponse.json({
      success: true,
      item: {
        ITEM_ID: result.insertId,
        USER_ID: userId,
        CATEGORY: category,
        IMAGE_PATH: imagePath,
      },
    });
  } catch (error: any) {
    console.error('Wardrobe POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add wardrobe item.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('id');

    if (!itemId) {
      return NextResponse.json({ error: 'id parameter is required.' }, { status: 400 });
    }

    const pool = getPool();
    await pool.query('DELETE FROM `WARDROBE_ITEM` WHERE ITEM_ID = ?', [itemId]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Wardrobe DELETE error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete wardrobe item.' },
      { status: 500 }
    );
  }
}
