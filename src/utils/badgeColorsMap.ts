import { colorsMap } from "./colorsMap";

export type badgeType =
    | "new"
    | "sale"
    | "limited"
    | "exclusive"
    | "hot"
    | "trending"
    | "popular"
    | "featured";

export function getBadgeColor(type: badgeType): string {
    switch (type) {
        case "new":
            return colorsMap.green[500];
        case "sale":
            return colorsMap.red[500];
        case "limited":
            return colorsMap.yellow[500];
        case "exclusive":
            return colorsMap.purple[500];
        case "hot":
            return colorsMap.orange[500];
        case "trending":
            return colorsMap.blue[500];
        case "popular":
            return colorsMap.pink[500];
        case "featured":
            return colorsMap.teal[500];
        default:
            return colorsMap.gray[500];
    }
}
