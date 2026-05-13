'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { isLocale, LOCALE_COOKIE } from '@/i18n/config';

export async function changeLocale(locale: string) {
  if (!isLocale(locale)) return;
  const c = await cookies();
  c.set(LOCALE_COOKIE, locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
  });
  revalidatePath('/', 'layout');
}
