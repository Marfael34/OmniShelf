const SearchHeader = () => (
  <div className="text-center space-y-4 max-w-3xl mx-auto relative mb-12">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 blur-[120px] -z-10 rounded-full"></div>
    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-text-main animate-in fade-in slide-in-from-bottom-4 duration-700">
      Recherche <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-purple-400">Avancée</span>
    </h1>
    <p className="text-xl text-text-dim font-medium italic opacity-70 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      Explorez des millions de références à travers l'univers.
    </p>
  </div>
);

export default SearchHeader;
