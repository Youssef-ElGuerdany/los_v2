import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text, targetLocales } = await request.json();
    
    if (!text || !targetLocales || !Array.isArray(targetLocales)) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const translations: Record<string, string> = {};

    const translationPromises = targetLocales.map(async (locale) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);

        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${locale}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (res.ok) {
          const json = await res.json();
          const translatedText = (json[0] as unknown[][]).map((item) => item[0] as string).join('');
          return { locale, text: translatedText };
        }
      } catch (err) {
        console.error(`Translation error for locale ${locale}:`, err);
      }
      return { locale, text }; // fallback
    });

    const results = await Promise.all(translationPromises);
    results.forEach((r) => {
      translations[r.locale] = r.text;
    });

    return NextResponse.json({ translations });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
