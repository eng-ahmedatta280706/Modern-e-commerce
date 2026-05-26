import React, { useEffect } from "react";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
    url: string;
    title: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ url, title }) => {
    useEffect(() => {
        const menu = document.querySelector(".menu");
        const toggle = document.querySelector(".toggle");

        const handleToggle = () => {
            menu?.classList.toggle("active");
        };

        toggle?.addEventListener("click", handleToggle);
        return () => {
            toggle?.removeEventListener("click", handleToggle);
        };
    }, []);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title, url }).catch((error) => console.error("Error sharing:", error));
        } else {
            alert("Web Share API is not supported in your browser. Please copy the URL to share.");
        }
    };

    return (
        <div className="menu bg-gray-200 hover:bg-gray-300 text-gray-800 py-0 px-0 rounded-lg font-semibold transition-colors">
            <div className="toggle">
                <Share2 size={20} />
            </div>
            <ul>
                <li style={{ "--i": 0, "--clr": "#1877f2" } as React.CSSProperties} onClick={handleShare}>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                </li>
                <li style={{ "--i": 1, "--clr": "#25d366" } as React.CSSProperties} onClick={handleShare}>
                    <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title)}%20${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-whatsapp"></i>
                    </a>
                </li>
                <li style={{ "--i": 2, "--clr": "#1b1e21" } as React.CSSProperties} onClick={handleShare}>
                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-x-twitter"></i>
                    </a>
                </li>
                <li style={{ "--i": 3, "--clr": "#ff5733" } as React.CSSProperties} onClick={handleShare}>
                    <a href={`https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-reddit-alien"></i>
                    </a>
                </li>
                <li style={{ "--i": 4, "--clr": "#0a66c2" } as React.CSSProperties} onClick={handleShare}>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                </li>
                <li style={{ "--i": 5, "--clr": "#c32aa3" } as React.CSSProperties} onClick={handleShare}>
                    <a href={`https://www.instagram.com/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-instagram"></i>
                    </a>
                </li>
                <li style={{ "--i": 6, "--clr": "#1b1e21" } as React.CSSProperties} onClick={handleShare}>
                    <a href={`https://github.com`} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-github"></i>
                    </a>
                </li>
                <li style={{ "--i": 7, "--clr": "#ff0000" } as React.CSSProperties} onClick={handleShare}>
                    <a href={`https://www.youtube.com`} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-youtube"></i>
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default ShareButton;
