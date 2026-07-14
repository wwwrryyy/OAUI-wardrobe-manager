import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const imgPath = searchParams.get('path');

    if (!imgPath) {
      return new NextResponse('Image path required', { status: 400 });
    }

    // Determine the absolute path
    let absolutePath = imgPath;
    if (!path.isAbsolute(imgPath)) {
      // Look inside the project root folder where Tkinter stored images, or inside frontend/public/uploads
      const rootPath = path.join('/Users/shawnsc/Projects/Projet1.0', imgPath);
      const publicPath = path.join(process.cwd(), 'public', imgPath);
      
      try {
        await fs.access(rootPath);
        absolutePath = rootPath;
      } catch {
        absolutePath = publicPath;
      }
    }

    // Read file buffer
    const buffer = await fs.readFile(absolutePath);

    // Determine content type
    const ext = path.extname(absolutePath).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };
    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Image serve error:', error);
    return new NextResponse('Image not found on local system', { status: 404 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Create uploads directory in project root if it doesn't exist
    const uploadsDir = path.join('/Users/shawnsc/Projects/Projet1.0', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Clean filename and make unique if needed
    const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, filename);

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      imagePath: filePath, // Store absolute path for consistency with main.py
    });
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save uploaded image.' },
      { status: 500 }
    );
  }
}
