import { NextResponse } from 'next/server';

// Server-side in-memory cache / fallback for API
let serverProducts = [];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  let filtered = [...serverProducts];
  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (p) => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
    );
  }

  return NextResponse.json({ success: true, count: filtered.length, data: filtered });
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Strict input validation
    const title = typeof body.title === 'string' ? body.title.trim().slice(0, 120) : '';
    const numericPrice = Number(body.price);

    if (!title || isNaN(numericPrice) || numericPrice < 0) {
      return NextResponse.json({ success: false, message: 'Invalid product title or price' }, { status: 400 });
    }

    const ALLOWED_CATEGORIES = ['Books & Notes', 'Hostel Essentials', 'Appliances', 'Lab & Drafter', 'Furniture', 'Donate', 'General'];
    const category = ALLOWED_CATEGORIES.includes(body.category) ? body.category : 'General';

    // Safe image URL sanitization
    let image = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
    if (typeof body.image === 'string') {
      const trimmed = body.image.trim();
      if (trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('data:image/')) {
        image = trimmed;
      }
    }

    const newProduct = {
      id: Number(body.id) || Date.now(),
      title,
      category,
      price: numericPrice,
      originalPrice: Number(body.originalPrice) || numericPrice,
      condition: typeof body.condition === 'string' ? body.condition.slice(0, 30) : 'Good',
      location: typeof body.location === 'string' ? body.location.slice(0, 80) : 'BMSIT Library Lobby',
      description: typeof body.description === 'string' ? body.description.trim().slice(0, 1000) : '',
      image,
      seller: typeof body.seller === 'string' ? body.seller.trim().slice(0, 60) : 'Verified Student',
      sellerEmail: typeof body.sellerEmail === 'string' ? body.sellerEmail.trim().slice(0, 100) : '',
      sellerPhone: typeof body.sellerPhone === 'string' ? body.sellerPhone.trim().slice(0, 15) : '',
      created: Date.now(),
    };

    serverProducts.unshift(newProduct);
    // Limit server in-memory list to latest 500 items
    if (serverProducts.length > 500) {
      serverProducts = serverProducts.slice(0, 500);
    }

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Bad Request' }, { status: 400 });
  }
}
