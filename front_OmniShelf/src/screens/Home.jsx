import CategoryCard from "../components/UI/CategoryCard.jsx";

export default function Home() {
  const categories = [
    {
      id: "game",
      title: "Jeux Vidéo",
      icon: "🎮",
      link: "/search?category=game",
      desc: "Gérez vos cartouches et disques",
      color:
        "border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]",
    },
    {
      id: "manga",
      title: "Manga",
      icon: "📚",
      link: "/search?category=manga",
      desc: "Organisez votre bibliothèque",
      color:
        "border-indigo-500/30 hover:border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)]",
    },
    {
      id: "vinyl",
      title: "Vinyle",
      icon: "💿",
      link: "/search?category=vinyl",
      desc: "Votre discographie analogique",
      color:
        "border-purple-500/30 hover:border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]",
    },
    {
      id: "pop",
      title: "Figurine POP",
      icon: "🦸‍♂️",
      link: "/search?category=pop",
      desc: "Suivez vos personnages favoris",
      color:
        "border-teal-500/30 hover:border-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.1)] hover:shadow-[0_0_25px_rgba(20,184,166,0.4)]",
    },
  ];

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      {/* Hero Section */}
      <section className="text-center py-12 px-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-soft">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-6">
          Bienvenue sur OmniShelf
        </h1>
        <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Votre hub ultime de collection personnelle. Organisez, découvrez et
          partagez vos univers favoris en un clin d'œil.
        </p>
      </section>

      {/* Grille des catégories */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            title={cat.title}
            icon={cat.icon}
            description={cat.desc}
            colorClass={cat.color}
            linkTo={cat.link}
          />
        ))}
      </section>
    </div>
  );
}
