import { Link } from "react-router-dom";
import { Search, Book, ToyBrick, Music } from "lucide-react";

const CategoryLinks = ({ isMobile = false }) => {
    const links = [
        { to: "/search", icon: Search, label: "Recherche", color: "text-blue-400" },
    ];

    if (isMobile) {
        return (
            <>
                {links.map((link) => (
                    <Link 
                        key={link.to} 
                        to={link.to} 
                        className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all group"
                    >
                        <link.icon size={24} className="text-text-dim group-hover:text-accent mb-3 transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-dim group-hover:text-text-main transition-colors">
                            {link.label}
                        </span>
                    </Link>
                ))}
            </>
        );
    }

    return (
        <div className="flex items-center space-x-6 border-r border-white/5 pr-8">
            {links.map((link) => (
                <Link 
                    key={link.to} 
                    to={link.to} 
                    className="flex items-center space-x-2 group"
                >
                    <div className={`p-1.5 rounded-lg bg-white/5 group-hover:bg-accent/10 transition-all`}>
                        <link.icon size={13} className="text-text-dim group-hover:text-accent transition-colors" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-text-dim group-hover:text-text-main transition-colors">
                        {link.label}
                    </span>
                </Link>
            ))}
        </div>
    );
};

export default CategoryLinks;
