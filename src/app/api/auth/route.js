import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, phone, year } = await request.json();

    if (!name || !email || !phone || !year) {
      return NextResponse.json({ success: false, message: 'All student verification fields are required' }, { status: 400 });
    }

    const domain = email.split('@')[1] || '';
    const college = domain ? domain.split('.')[0].toUpperCase() : 'BMSIT';

    const verifiedUser = {
      name,
      email,
      phone,
      year,
      verified: true,
      college,
      timestamp: Date.now(),
    };

    return NextResponse.json({ success: true, user: verifiedUser });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
