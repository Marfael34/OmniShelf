const themes = [
  { id: "cyberpunk", label: "Cyberpunk", icon: "🤖" },
  { id: "space", label: "Espace", icon: "🚀" },
  { id: "horror", label: "Horreur", icon: "👻" },
  { id: "fantasy", label: "Fantasy", icon: "🧙‍♂️" },
  { id: "retro", label: "Rétro", icon: "🕹️" },
  { id: "anime", label: "Anime", icon: "🌸" },
];

const ThematicTags = ({ onSelect }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-10">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onSelect(theme.label)}
          className="flex items-center space-x-2 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl hover:border-accent hover:bg-accent/10 transition-all group"
        >
          <span className="text-xl group-hover:scale-125 transition-transform">{theme.icon}</span>
          <span className="font-black text-xs uppercase tracking-widest text-text-main">{theme.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThematicTags;
