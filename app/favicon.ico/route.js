import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Fetch logo URL from site_settings
    const { data } = await supabase
      .from('site_settings')
      .select('logo_url')
      .limit(1)
      .maybeSingle();
    
    const logoUrl = data?.logo_url || '/logo1.jpeg';
    
    // If it's a remote URL (Supabase storage), fetch it
    if (logoUrl.startsWith('http')) {
      try {
        const response = await fetch(logoUrl);
        if (response.ok) {
          const imageBuffer = await response.arrayBuffer();
          const contentType = response.headers.get('Content-Type') || 'image/jpeg';
          return new NextResponse(imageBuffer, {
            headers: {
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=3600, must-revalidate',
            },
          });
        }
      } catch (error) {
        console.error('Error fetching remote logo:', error);
      }
    }
    
    // For local files, read from public folder
    try {
      const publicPath = path.join(process.cwd(), 'public', logoUrl.replace(/^\//, ''));
      if (fs.existsSync(publicPath)) {
        const imageBuffer = fs.readFileSync(publicPath);
        const ext = path.extname(publicPath).toLowerCase();
        const contentType = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/jpeg';
        
        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=3600, must-revalidate',
          },
        });
      }
    } catch (error) {
      console.error('Error reading local logo:', error);
    }
    
    // Fallback: return default logo
    const defaultPath = path.join(process.cwd(), 'public', 'logo1.jpeg');
    if (fs.existsSync(defaultPath)) {
      const imageBuffer = fs.readFileSync(defaultPath);
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=3600, must-revalidate',
        },
      });
    }
    
    // If all else fails, return 404
    return new NextResponse(null, { status: 404 });
    
  } catch (error) {
    console.error('Error loading favicon:', error);
    // Try to return default logo as last resort
    try {
      const defaultPath = path.join(process.cwd(), 'public', 'logo1.jpeg');
      if (fs.existsSync(defaultPath)) {
        const imageBuffer = fs.readFileSync(defaultPath);
        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=3600, must-revalidate',
          },
        });
      }
    } catch (fallbackError) {
      console.error('Error loading default favicon:', fallbackError);
    }
    return new NextResponse(null, { status: 404 });
  }
}
