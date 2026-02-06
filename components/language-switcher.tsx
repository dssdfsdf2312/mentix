"use client"

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    // Remove the current locale from pathname and add the new one
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={switchLocale}
      className="flex items-center gap-2"
    >
      <Languages className="h-4 w-4" />
      <span>{locale === 'en' ? 'العربية' : 'English'}</span>
    </Button>
  );
}
