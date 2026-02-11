import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  try {
    const key = request.nextUrl.searchParams.get('key') ?? '';
    const expected = process.env.NEXT_PUBLIC_GENERATOR_KEY ?? '';

    if (!expected) return NextResponse.next();

    if (key !== expected) {
      return NextResponse.rewrite(new URL('/', request.url));
    }
  } catch (e) {
    // On any error, be conservative and allow the request to proceed.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/g-link-studio-x92k'],
};
