import { useState, useContext } from "react";
import CustomModal from "../modals/ModalMenu";
import { Globe } from "lucide-react";
import { LanguageContext } from "../../contexts/LanguageContext";
import { Translations } from "../../utils/translations";

type LanguageCode = keyof Translations;

export default function LanguageSwitcher() {
    const [open, setOpen] = useState(false);
    const langContext = useContext(LanguageContext);

    if (!langContext) throw new Error("LanguageSwitcher must be used within LanguageProvider");

    const { language, changeLanguage } = langContext;

    const languages: { code: LanguageCode; label: string }[] = [
        { code: "en", label: "English 🇺🇸" },
        { code: "ar", label: "العربية 🇪🇬" },
        { code: "fr", label: "Français 🇫🇷" },
        { code: "es", label: "Español 🇪🇸" },
        { code: "de", label: "Deutsch 🇩🇪" },
        { code: "zh", label: "中文 🇨🇳" },
        { code: "ja", label: "日本語 🇯🇵" },
        { code: "ru", label: "Русский 🇷🇺" },
        { code: "pt", label: "Português 🇵🇹" },
        { code: "hi", label: "हिन्दी 🇮🇳" },
        { code: "it", label: "Italiano 🇮🇹" },
        { code: "ko", label: "한국어 🇰🇷" },
        { code: "nl", label: "Nederlands 🇳🇱" },
        { code: "sv", label: "Svenska 🇸🇪" },
        { code: "pl", label: "Polski 🇵🇱" },
        { code: "tr", label: "Türkçe 🇹🇷" },
    ];

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="p-2 rounded-full hover:bg-gray-200 transition flex items-center gap-1"
            >
                <Globe size={20} />
            </button>

            <CustomModal
                title="Language"
                isOpen={open}
                onClose={() => setOpen(false)}
                dividerAfterIndex={1}
                items={languages.map((lang) => ({
                    label: lang.label,
                    active: language === lang.code,
                    onClick: () => {
                        changeLanguage(lang.code);
                        setOpen(false);
                    },
                }))}
                buttons={[
                    {
                        label: "Cancel",
                        color: "bg-gray-500",
                        onClick: () => setOpen(false),
                    },
                ]}
            />
        </div>
    );
}