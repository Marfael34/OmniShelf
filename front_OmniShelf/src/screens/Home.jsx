import { Link } from "react-router-dom";

const categories = [
  { id: "game", name: "Jeux Vidéo", color: "bg-cyan-900/40 border-cyan-500/30 text-cyan-400", path: "/search?category=game" },
  { id: "manga", name: "Mangas", color: "bg-indigo-900/40 border-indigo-500/30 text-indigo-400", path: "/search?category=manga" },
  { id: "vinyl", name: "Vinyles", color: "bg-purple-900/40 border-purple-500/30 text-purple-400", path: "/search?category=vinyl" },
  { id: "pop", name: "Figurines POP", color: "bg-teal-900/40 border-teal-500/30 text-teal-400", path: "/search?category=pop" },
];

const Home = () => {
  return (
    <div className="flex flex-col items-center py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-(--gradient-brand)">
          Votre univers en un coup d'œil
        </h1>
        <p className="text-xl text-(--text-dim)">
          OmniShelf est le hub ultime de votre collection personnelle. Organisez, découvrez et partagez vos passions.
        </p>
        <Link 
          to="/search" 
          className="inline-block mt-4 px-8 py-3 bg-(--color-accent) text-(--bg-main) font-bold rounded-xl shadow-(--shadow-soft) hover:opacity-90 transition-all hover:-translate-y-1"
        >
          Commencer à explorer
        </Link>
      </section>

      {/* Categories Section */}
      <section className="w-full max-w-5xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-(--text-main)">Découvrez par Thématique</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              to={cat.path}
              className={`flex flex-col items-center justify-center p-12 rounded-2xl border backdrop-blur-md transition-all hover:scale-[1.02] ${cat.color}`}
            >
              <h3 className="text-3xl font-bold">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
