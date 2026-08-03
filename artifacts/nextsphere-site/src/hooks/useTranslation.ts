import { useLanguage } from '../contexts/LanguageContext';
import { translations, TranslationKey } from '../i18n/translations';

export function useTranslation() {
  const { lang } = useLanguage();

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  return { t, lang };
}
