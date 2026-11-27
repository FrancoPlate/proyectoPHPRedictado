import { Link } from "react-router-dom";

export default function HeaderComponent() {
  return (
    <header className="w-full bg-slate-950 border-b border-slate-800 shadow-lg py-4">

      <Link
        to="/"
        className="flex items-center justify-center gap-3 group"
      >
        {/* LOGO */}
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition">
          <span className="text-2xl">💬</span>
        </div>

        {/* TÍTULO */}
        <h1 className="text-2xl font-bold text-white tracking-tight group-hover:text-indigo-400 transition">
          <span className="text-indigo-400">WhatsApi</span>
        </h1>
      </Link>

    </header>
  );
}