import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as registerApi } from "../services/api/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await registerApi(email, password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue lors de l'inscription.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-(--bg-bg-surface) rounded-2xl border border-gray-800 shadow-(--shadow-soft)">
      <h2 className="text-3xl font-bold mb-6 text-center text-(--color-accent)">Inscription</h2>
      
      {success ? (
        <div className="text-center text-green-500">
          <p className="text-xl font-bold">Compte créé !</p>
          <p>Redirection vers la page de connexion...</p>
        </div>
      ) : (
        <>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-(--bg-bg-main) border border-gray-700 rounded-xl focus:border-(--color-accent) outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-(--bg-bg-main) border border-gray-700 rounded-xl focus:border-(--color-accent) outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-(--bg-bg-main) border border-gray-700 rounded-xl focus:border-(--color-accent) outline-none transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-(--color-accent) text-(--bg-bg-main) font-bold py-3 rounded-xl hover:opacity-90 transition-opacity mt-4"
            >
              S'inscrire
            </button>
          </form>
          <p className="mt-6 text-center text-(--text-text-dim)">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-(--color-accent) hover:underline">
              Se connecter
            </Link>
          </p>
        </>
      )}
    </div>
  );
};

export default Register;
