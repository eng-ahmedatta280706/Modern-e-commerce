import { useColor } from "../../hooks/useColor";
import type { badgeType } from "../../utils/badgeColorsMap";

const Badge = ({ text }: { text: string}) => {
    const { getBadgeColor } = useColor();

    return (
        <div className={`badge absolute top-[4%] left-[5%] text-white px-1.5 py-1 rounded-full text-xs font-bold`}
            style={{ backgroundColor: getBadgeColor(text.toLowerCase() as badgeType) }}>
            {text}
        </div>
    );
};

export default Badge;