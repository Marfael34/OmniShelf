import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="px-4 pb-12 flex flex-col gap-12">
      {/* Hero Section */}
      <section className="text-center py-16 px-6 bg-slate-800/40 rounded-3xl border border-slate-700 shadow-[0_0_30px_rgba(0,255,128,0.1)] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-6 font-mono tracking-widest uppercase">
          OmniShelf
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto text-lg mb-8 leading-relaxed">
          Le nexus de vos collections. Scannez, organisez et explorez vos jeux
          vidéo, mangas, vinyles et figurines POP dans une interface
          centralisée.
        </p>
      </section>

      {/* Grille des Catégories */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Jeux Vidéo */}
        <Link
          to="/search?category=game"
          className="group relative overflow-hidden rounded-2xl aspect-[4/5] border border-slate-700 hover:border-blue-500 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-blue-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"
            alt="Jeux Vidéo"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end items-center text-center">
            <span className="text-5xl mb-4 group-hover:animate-bounce">🎮</span>
            <h2 className="text-2xl font-bold text-white font-mono tracking-wider group-hover:text-blue-400 transition-colors">
              JEUX VIDÉO
            </h2>
          </div>
        </Link>

        {/* Manga */}
        <Link
          to="/search?category=manga"
          className="group relative overflow-hidden rounded-2xl aspect-[4/5] border border-slate-700 hover:border-red-500 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-red-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"
            alt="Manga"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end items-center text-center">
            <span className="text-5xl mb-4 group-hover:animate-bounce">📚</span>
            <h2 className="text-2xl font-bold text-white font-mono tracking-wider group-hover:text-red-400 transition-colors">
              MANGA
            </h2>
          </div>
        </Link>

        {/* Vinyle */}
        <Link
          to="/search?category=vinyl"
          className="group relative overflow-hidden rounded-2xl aspect-[4/5] border border-slate-700 hover:border-yellow-500 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-yellow-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&w=800&q=80"
            alt="Vinyle"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end items-center text-center">
            <span className="text-5xl mb-4 group-hover:animate-bounce">💿</span>
            <h2 className="text-2xl font-bold text-white font-mono tracking-wider group-hover:text-yellow-400 transition-colors">
              VINYLE
            </h2>
          </div>
        </Link>

        {/* Figurine POP */}
        <Link
          to="/search?category=pop"
          className="group relative overflow-hidden rounded-2xl aspect-[4/5] border border-slate-700 hover:border-green-500 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-green-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=800&q=80"
            alt="Figurine POP"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end items-center text-center">
            <span className="text-5xl mb-4 group-hover:animate-bounce">🦸‍♂️</span>
            <h2 className="text-2xl font-bold text-white font-mono tracking-wider group-hover:text-green-400 transition-colors">
              FIGURINE POP
            </h2>
          </div>
        </Link>
      </section>
    </div>
  );
}
