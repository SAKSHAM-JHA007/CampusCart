import { NextResponse } from 'next/server';

let serverInterests = [];

export async function GET() {
  return NextResponse.json({ success: true, count: serverInterests.length, data: serverInterests });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const title = typeof body.title === 'string' ? body.title.trim().slice(0, 120) : '';
    const buyer = typeof body.buyer === 'string' ? body.buyer.trim().slice(0, 60) : '';
    const buyerPhone = typeof body.buyerPhone === 'string' ? body.buyerPhone.trim().replace(/\D/g, '').slice(0, 10) : '';

    if (!title || !buyer || !buyerPhone) {
      return NextResponse.json({ success: false, message: 'Missing required interest reservation details' }, { status: 400 });
    }

    const newInterest = {
      id: Date.now(),
      productId: Number(body.productId) || 0,
      title,
      price: Number(body.price) || 0,
      seller: typeof body.seller === 'string' ? body.seller.trim().slice(0, 60) : 'Seller',
      buyer,
      buyerPhone,
      meetupSpot: typeof body.meetupSpot === 'string' ? body.meetupSpot.trim().slice(0, 80) : 'BMSIT Library Lobby',
      note: typeof body.note === 'string' ? body.note.trim().slice(0, 300) : '',
      status: 'Awaiting Seller Confirmation',
      created: Date.now(),
    };

    serverInterests.unshift(newInterest);
    if (serverInterests.length > 500) {
      serverInterests = serverInterests.slice(0, 500);
    }

    return NextResponse.json({ success: true, data: newInterest }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Bad Request' }, { status: 400 });
  }
}
