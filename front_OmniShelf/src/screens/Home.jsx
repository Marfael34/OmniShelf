import { Link } from "react-router-dom";

const categories = [
  {
    id: "game",
    title: "Jeux Vidéo",
    icon: "🎮",
    classes:
      "from-blue-700 to-blue-950 border-blue-500/30 hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] hover:border-blue-400",
  },
  {
    id: "manga",
    title: "Manga",
    icon: "📚",
    classes:
      "from-red-700 to-red-950 border-red-500/30 hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] hover:border-red-400",
  },
  {
    id: "vinyl",
    title: "Vinyle",
    icon: "💿",
    classes:
      "from-yellow-600 to-yellow-950 border-yellow-500/30 hover:shadow-[0_0_25px_rgba(234,179,8,0.6)] hover:border-yellow-400",
  },
  {
    id: "pop",
    title: "Figurine POP",
    icon: "🦸‍♂️",
    classes:
      "from-purple-700 to-purple-950 border-purple-500/30 hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:border-purple-400",
  },
];

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-16 py-8">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500 drop-shadow-[0_0_15px_rgba(0,255,128,0.5)]">
          Bienvenue sur OmniShelf
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Votre gestionnaire de collections ultime. Explorez, scannez et ajoutez
          vos objets favoris à votre étagère numérique.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl px-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/search?category=${cat.id}`}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${cat.classes} border p-8 flex flex-col items-center justify-center gap-6 transition-all duration-300 transform hover:-translate-y-2`}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-300"></div>
            <span className="text-7xl drop-shadow-2xl z-10 transition-transform group-hover:scale-110 duration-300">
              {cat.icon}
            </span>
            <h2 className="text-2xl font-bold text-white tracking-widest z-10 drop-shadow-md uppercase">
              {cat.title}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
