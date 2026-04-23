import { Link } from "react-router-dom";

export default function CategoryCard({
  title,
  icon,
  colorClass,
  linkTo,
  description,
}) {
  return (
    <Link
      to={linkTo}
      className={`relative overflow-hidden group rounded-xl border bg-slate-800 p-6 transition-all duration-300 ${colorClass}`}
    >
      {/* Overlay subtil au survol */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-900/50 group-hover:to-slate-900/10 transition-colors duration-300"></div>

      <div className="relative z-10 flex flex-col items-center text-center gap-4">
        <span className="text-6xl transform group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-300">
          {icon}
        </span>
        <h3 className="text-2xl font-bold text-slate-50">{title}</h3>
        <p className="text-slate-300 text-sm font-medium">{description}</p>
      </div>
    </Link>
  );
}
