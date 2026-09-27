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
    if (!body.title || body.price === undefined) {
      return NextResponse.json({ success: false, message: 'Invalid product data' }, { status: 400 });
    }

    const newProduct = {
      id: body.id || Date.now(),
      title: body.title,
      category: body.category || 'General',
      price: Number(body.price),
      originalPrice: Number(body.originalPrice) || Number(body.price),
      condition: body.condition || 'Good',
      location: body.location || 'BMSIT Library Lobby',
      description: body.description || '',
      image: body.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      seller: body.seller || 'Verified Student',
      sellerEmail: body.sellerEmail || '',
      sellerPhone: body.sellerPhone || '',
      created: Date.now(),
    };

    serverProducts.unshift(newProduct);
    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
