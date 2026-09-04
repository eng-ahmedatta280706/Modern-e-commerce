import { colorsMap } from "../utils/colorsMap";
import { getBadgeColor } from "../utils/badgeColorsMap";

type ColorName = keyof typeof colorsMap;
type ColorDegree = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export const useColor = () => {
    const getColor = (color: string, degree?: number): string => {
        const colorKey = color.toLowerCase() as ColorName;

        if (!(colorKey in colorsMap)) {
            console.warn(`Color "${color}" not found.`);
            return color;
        }

        if (degree !== undefined) {
            const safeDegree = (degree in colorsMap[colorKey] ? degree : 500) as ColorDegree;
            return colorsMap[colorKey][safeDegree];
        } else {
            return colorsMap[colorKey][500 as ColorDegree];
        }
    };

    const colorClassMap: { [key: string]: string } = Object.fromEntries(
        Object.entries(colorsMap).map(([color, shades]) => {
            const shade500 = shades[500 as ColorDegree];
            return [color, `bg-[${shade500}]`];
        })
    );

    return { getColor, getBadgeColor, colorClassMap };
};