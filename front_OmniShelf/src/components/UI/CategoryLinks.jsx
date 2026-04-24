import { Link } from "react-router-dom";
import { Gamepad2, BookOpen, Ghost, Disc } from "lucide-react";

const CategoryLinks = () => {
    return (
        <div className="hidden lg:flex items-center space-x-1 border-r border-white/10 pr-4 mr-2">
            <Link to="/search?category=game" className="p-2 text-text-dim hover:text-accent transition-colors" title="Jeux Vidéo"><Gamepad2 size={18} /></Link>
            <Link to="/search?category=manga" className="p-2 text-text-dim hover:text-accent transition-colors" title="Mangas"><BookOpen size={18} /></Link>
            <Link to="/search?category=pop" className="p-2 text-text-dim hover:text-accent transition-colors" title="Figurines POP"><Ghost size={18} /></Link>
            <Link to="/search?category=vinyl" className="p-2 text-text-dim hover:text-accent transition-colors" title="Vinyles"><Disc size={18} /></Link>
        </div>
    );
};

export default CategoryLinks;
