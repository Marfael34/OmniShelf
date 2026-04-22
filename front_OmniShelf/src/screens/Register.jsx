import React, { useActionState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function Register() {
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const email = formData.get("email");
      const password = formData.get("password");

      try {
        await register(email, password);
        navigate("/login"); // On redirige vers le login pour qu'il se connecte
        return null;
      } catch (err) {
        return err.response?.data?.error || "Erreur lors de l'inscription.";
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
          Inscription OmniShelf
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
          {isPending ? "Création..." : "S'inscrire"}
        </button>

        <p className="text-center text-sm text-slate-400">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-emerald-400 hover:underline">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}
