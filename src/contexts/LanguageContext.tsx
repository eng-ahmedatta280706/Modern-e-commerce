import { createContext, useState, ReactNode, useEffect } from "react";
import { Translations } from "../utils/translations";

type LanguageCode = keyof Translations;

// Languages that render right-to-left. Add "he", "ur", "fa" here as they are introduced.
const RTL_LANGUAGES: LanguageCode[] = ["ar"];

const isRTL = (lang: LanguageCode) => RTL_LANGUAGES.includes(lang);

// Apply direction + lang attributes on the document so RTL and a11y/SEO stay in sync.
const applyDocumentLang = (lang: LanguageCode) => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL(lang) ? "rtl" : "ltr";
};

type LanguageContextType = {
    language: LanguageCode;
    changeLanguage: (lang: LanguageCode) => void;
};

export const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<LanguageCode>(
        (localStorage.getItem("lang") as LanguageCode) || "en");

    // Sync the document with the active language on mount and whenever it changes.
    useEffect(() => {
        applyDocumentLang(language);
    }, [language]);

    const changeLanguage = (lang: LanguageCode) => {
        setLanguage(lang);
        localStorage.setItem("lang", lang);
        applyDocumentLang(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
