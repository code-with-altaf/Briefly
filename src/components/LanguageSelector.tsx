"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { IconLanguage, IconCheck } from '@tabler/icons-react';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
];

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  isRegenerating?: boolean;
}

export default function LanguageSelector({ 
  currentLanguage, 
  onLanguageChange,
  isRegenerating = false 
}: LanguageSelectorProps) {
  const current = SUPPORTED_LANGUAGES.find(l => l.name === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <Menu as="div" className="relative">
      <MenuButton 
        disabled={isRegenerating}
        className="p-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        title="Change language"
      >
        <IconLanguage size={20} className="text-black dark:text-white" />
        <span className="text-sm font-medium text-black dark:text-white hidden sm:inline">
          {current.flag} {current.name}
        </span>
      </MenuButton>
      
      <MenuItems
        anchor="bottom end"
        className="mt-2 w-56 origin-top-right rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-1 text-sm shadow-lg focus:outline-none z-50 max-h-[400px] overflow-y-auto"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <MenuItem key={lang.code}>
            {({ focus }) => (
              <button
                onClick={() => onLanguageChange(lang.name)}
                disabled={isRegenerating}
                className={`${
                  focus ? 'bg-neutral-100 dark:bg-neutral-800' : ''
                } group flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-neutral-900 dark:text-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                </span>
                {current.code === lang.code && (
                  <IconCheck size={16} className="text-green-500" />
                )}
              </button>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
