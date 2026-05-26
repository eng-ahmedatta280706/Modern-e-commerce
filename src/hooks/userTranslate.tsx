import { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";
import { translations } from "../utils/translations";


export const useTranslate = () => {
    const contest = useContext(LanguageContext);


    if (!contest) {
        throw new Error("useTranslate hook must be used inside the LanguageProvider")
    }

    const { language } = contest;

    const t = (path: string): string => {
        const keys = path.split(".");

        let value: any = translations[language];

        for (const key of keys) {
            value = value?.[key];
        }

        return value || path
    };

    const isRTL = language === "ar";

    return { t, isRTL };
};










