import React, { useActionState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  // React 19: Gestion native des actions de formulaire
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const email = formData.get("email");
      const password = formData.get("password");

      try {
        await login(email, password);
        navigate("/"); // Redirection vers l'accueil
        return null;
      } catch (err) {
        return "Identifiants incorrects ou serveur injoignable.";
      }
    },
    null,
  );

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form
        action={submitAction}
        className="bg-slate-800 p-8 rounded-lg shadow-[0_0_15px_rgba(0,255,128,0.2)] w-full max-w-md border border-slate-700"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-400">
          Connexion OmniShelf
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-slate-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full p-3 rounded bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium mb-2 text-slate-300">
            Mot de passe
          </label>
          <input
            type="password"
            name="password"
            required
            className="w-full p-3 rounded bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <button
          disabled={isPending}
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded transition-all disabled:opacity-50 shadow-[0_0_10px_rgba(0,255,128,0.4)] mb-4"
        >
          {isPending ? "Connexion en cours..." : "Se connecter"}
        </button>

        <p className="text-center text-sm text-slate-400">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-emerald-400 hover:underline">
            S'inscrire
          </Link>
        </p>
      </form>
    </div>
  );
}
