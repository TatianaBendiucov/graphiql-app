import { NextRequest, NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages, cookieName } from '@/components/i18n/settings'

acceptLanguage.languages(languages)

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)']
}

export function middleware(req: NextRequest) {
  let language = fallbackLng;

  const response = NextResponse.next();
  if (req.cookies.has(cookieName)) {
    language = acceptLanguage.get(req.cookies.get(cookieName)?.value || fallbackLng) || fallbackLng;
  } else {
    response.cookies.set(cookieName, language);
  }

  return response;
}
