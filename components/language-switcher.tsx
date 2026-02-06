"use client"

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button
      onClick={switchLocale}
      className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
    >
      <Languages className="h-4 w-4" />
      <span>{locale === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
}
