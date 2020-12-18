import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Documentation for the i18n config can be found at the link below.
// https://www.i18next.com/configuration-options.html

i18n
  .use(initReactI18next)
  .use(Backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',

    // Have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    debug: false,

    interpolation: {
      escapeValue: false, // Not needed for react!!
    },

    react: {
      wait: true,
      useSuspense: true
    }
  });


export default i18n;
