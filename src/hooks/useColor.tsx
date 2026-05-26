
const colorsMap: {
    [key: string]: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
    };
} = {
    red: {
        50: '#FEF2F2',
        100: '#FEE2E2',
        200: '#FECACA',
        300: '#FCA5A5',
        400: '#F87171',
        500: '#EF4444',
        600: '#DC2626',
        700: '#B91C1C',
        800: '#991B1B',
        900: '#7F1D1D',
    },
    blue: {
        50: '#EFF6FF',
        100: '#DBEAFE',
        200: '#BFDBFE',
        300: '#93C5FD',
        400: '#60A5FA',
        500: '#3B82F6',
        600: '#2563EB',
        700: '#1D4ED8',
        800: '#1E40AF',
        900: '#1E3A8A',
    },
    green: {
        50: '#ECFDF5',
        100: '#D1FAE5',
        200: '#A7F3D0',
        300: '#6EE7B7',
        400: '#34D399',
        500: '#10B981',
        600: '#059669',
        700: '#047857',
        800: '#065F46',
        900: '#064E3B',
    },
    yellow: {
        50: '#FFFBEB',
        100: '#FEF3C7',
        200: '#FDE68A',
        300: '#FCD34D',
        400: '#FBBF24',
        500: '#F59E0B',
        600: '#D97706',
        700: '#B45309',
        800: '#92400E',
        900: '#78350F',
    },
    purple: {
        50: '#F5F3FF',
        100: '#EDE9FE',
        200: '#DDD6FE',
        300: '#C4B5FD',
        400: '#A78BFA',
        500: '#8B5CF6',
        600: '#7C3AED',
        700: '#6D28D9',
        800: '#5B21B6',
        900: '#4C1D95',
    },
    pink: {
        50: '#FDF2F8',
        100: '#FCE7F3',
        200: '#FBCFE8',
        300: '#F9A8D4',
        400: '#F472B6',
        500: '#EC4899',
        600: '#DB2777',
        700: '#BE185D',
        800: '#9D174D',
        900: '#831843',
    },
    gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    },
    brown: {
        50: '#EFEBE9',
        100: '#D7CCC8',
        200: '#BCAAA4',
        300: '#A1887F',
        400: '#8D6E63',
        500: '#795548',
        600: '#6D4C41',
        700: '#5D4037',
        800: '#4E342E',
        900: '#3E2723',
    },
    navy: {
        50: '#E6EAF2',
        100: '#C0C9E0',
        200: '#9AA8CD',
        300: '#7486BA',
        400: '#4F65A7',
        500: '#2A4494',
        600: '#233A7F',
        700: '#1E316A',
        800: '#192755',
        900: '#141E40',
    },
    black: {
        50: '#F5F5F5',
        100: '#E5E5E5',
        200: '#D4D4D4',
        300: '#A3A3A3',
        400: '#737373',
        500: '#525252',
        600: '#404040',
        700: '#262626',
        800: '#171717',
        900: '#000000',
    },
    white: {
        50: '#FFFFFF',
        100: '#FAFAFA',
        200: '#F5F5F5',
        300: '#E5E5E5',
        400: '#D4D4D4',
        500: '#A3A3A3',
        600: '#737373',
        700: '#525252',
        800: '#404040',
        900: '#262626',
    },
    beige: {
        50: '#FAF3E0',
        100: '#F5E6CC',
        200: '#EAD3A8',
        300: '#DFC084',
        400: '#D4AD60',
        500: '#C99A3C',
        600: '#A67E30',
        700: '#836224',
        800: '#604618',
        900: '#3D2A0C',
    },
};

type ColorName = keyof typeof colorsMap;
type ColorDegree = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export const useColor = () => {
    const getColor = (color: string, degree: number): string => {
        const colorKey = color.toLowerCase() as ColorName;

        if (!(colorKey in colorsMap)) {
            console.warn(`Color "${color}" not found.`);
            return color;
        }

        const safeDegree = (degree in colorsMap[colorKey] ? degree : 500) as ColorDegree;

        return colorsMap[colorKey][safeDegree];
    };

    return { getColor };
};