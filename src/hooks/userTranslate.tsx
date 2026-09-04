import { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";
import { translations } from "../utils/translations";


export const useTranslate = () => {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error("useTranslate hook must be used inside the LanguageProvider");
    }

    const { language } = context;
    const t = (path: string): string => {
        const keys = path.split(".");

        // Fall back to English so a missing key in one language still shows real text
        // instead of the raw dotted path.
        let value: any = translations[language] ?? translations.en;

        for (const key of keys) {
            value = value?.[key];
        }
        if (typeof value !== "string") {
            let fallback: any = translations.en;
            for (const key of keys) {
                fallback = fallback?.[key];
            }
            value = fallback;
        }
        return typeof value === "string" ? value : path;
    };

    const isRTL = language === "ar";
    return { t, isRTL };
};










