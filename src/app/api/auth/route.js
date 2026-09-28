import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 60) : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 100) : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim().replace(/\D/g, '').slice(0, 10) : '';
    const year = typeof body.year === 'string' ? body.year.trim().slice(0, 40) : 'Student';

    if (!name || !email || !phone || phone.length !== 10) {
      return NextResponse.json({ 
        success: false, 
        message: 'Valid student name, email, and 10-digit mobile number are required' 
      }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email address format' }, { status: 400 });
    }

    const domain = email.split('@')[1] || '';
    const college = domain.includes('.') ? domain.split('.')[0].toUpperCase() : 'BMSIT';

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
    return NextResponse.json({ success: false, message: 'Bad Request' }, { status: 400 });
  }
}
