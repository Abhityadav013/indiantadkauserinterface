'use client';

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Avatar from '@mui/material/Avatar';
import { useLocale } from "next-intl";

const languages = [
  { code: 'en', label: 'EN', flagUrl: 'https://flagcdn.com/w20/gb.png' },
  { code: 'de', label: 'DE', flagUrl: 'https://flagcdn.com/w20/de.png' },
];

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/;`;
}

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setCookie('lang', locale, 7);
  }, [locale]);

  function handleLanguageSwitch(code: string) {

    // Extract current path without locale
    const pathSegments = pathname.split('/');
    const currentLocale = pathSegments[1];

    // If already localized, replace it; otherwise, add locale
    if (languages.some(lang => lang.code === currentLocale)) {
      pathSegments[1] = code;
    } else {
      pathSegments.unshift('', code); // adds "/[code]/..."
    }

    const newPath = pathSegments.join('/');
    router.push(newPath);
  }

  return (
    <div className="flex justify-end items-center space-x-1 text-xs px-2 py-0">
      {languages.map((language, index) => (
        <div key={language.code} className="flex items-center space-x-0.5">
          <div
            className={`flex items-center cursor-pointer px-1 py-0.5 rounded transition-all duration-200 ${locale === language.code
              ? 'text-blue-600 font-semibold'
              : 'text-gray-600 hover:text-blue-500'
              }`}
            onClick={() => handleLanguageSwitch(language.code)}
          >
            <Avatar
              alt={language.label}
              src={language.flagUrl}
              sx={{ width: 12, height: 12 }}
              variant="rounded"
            />
            <span className="ml-1 text-[11px]">{language.label}</span>
          </div>
          {index < languages.length - 1 && (
            <span className="text-gray-400 px-1 text-[10px]">|</span>
          )}
        </div>
      ))}
    </div>
  );
}
