import { Link } from "react-router-dom";
import { Monitor, Book, ToyBrick, Music } from "lucide-react";

const CategoryLinks = () => {
    const links = [
        { to: "/search?category=game", icon: Monitor, label: "Jeux", color: "text-blue-400" },
        { to: "/search?category=manga", icon: Book, label: "Livres", color: "text-green-400" },
        { to: "/search?category=pop", icon: ToyBrick, label: "Pops", color: "text-purple-400" },
        { to: "/search?category=vinyl", icon: Music, label: "Vinyls", color: "text-pink-400" },
    ];

    return (
        <div className="hidden lg:flex items-center space-x-6 mr-6 border-r border-white/5 pr-6">
            {links.map((link) => (
                <Link 
                    key={link.to} 
                    to={link.to} 
                    className="flex items-center space-x-2 group"
                >
                    <div className={`p-1.5 rounded-lg bg-white/5 group-hover:bg-accent/10 transition-all`}>
                        <link.icon size={14} className="text-text-dim group-hover:text-accent transition-colors" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-text-dim group-hover:text-text-main transition-colors">
                        {link.label}
                    </span>
                </Link>
            ))}
        </div>
    );
};

export default CategoryLinks;
