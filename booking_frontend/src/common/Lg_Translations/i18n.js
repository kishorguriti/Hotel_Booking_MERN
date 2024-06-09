import resources from "./Resources";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { useEffect } from "react";

let selectedLanguage = localStorage.getItem("i18nextLng");
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: selectedLanguage,
    fallbackLng: "en",
    ns: ["translations"],
    defaultNS: "translations",
    keySeparator: false,
    interpolation: {
      escapeValue: false,
      formatSeparator: ",",
    },
    react: {
      useSuspense: true,
    },
    supportedLngs: Object.keys(resources) ?? ["en"],
  });

export default i18n;
export { resources };
