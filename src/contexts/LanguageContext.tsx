import { createContext, useState, ReactNode, useEffect ,} from "react";
import { Translations } from "../utils/translations";
// import { Translation } from "react-i18next";

type LanguageContextType = {
    language: keyof Translations;
    changeLanguage: (lang: keyof Translations) => void;
};

export const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<keyof Translations>(
        (localStorage.getItem("lang") as keyof Translations) || "en");

    useEffect(() => {
        const saved = localStorage.getItem("lang");
        if (saved) {
            document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
        }
    }, []);

    const changeLanguage = (lang: keyof Translations) => {
        setLanguage(lang);
        localStorage.setItem("lang", lang);

        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};