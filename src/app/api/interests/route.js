import { NextResponse } from 'next/server';

let serverInterests = [];

export async function GET() {
  return NextResponse.json({ success: true, count: serverInterests.length, data: serverInterests });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newInterest = {
      id: Date.now(),
      productId: body.productId,
      title: body.title,
      price: body.price,
      seller: body.seller,
      buyer: body.buyer,
      buyerPhone: body.buyerPhone,
      meetupSpot: body.meetupSpot || 'BMSIT Library Lobby',
      note: body.note || '',
      status: 'Awaiting Seller Confirmation',
      created: Date.now(),
    };

    serverInterests.unshift(newInterest);
    return NextResponse.json({ success: true, data: newInterest }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
