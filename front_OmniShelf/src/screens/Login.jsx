import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginApi } from "../services/api/auth";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const loginStore = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { token } = await loginApi(email, password);
      // Fetch user info to get the ID
      const userResponse = await api.get("/api/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      loginStore(userResponse.data, token);
      navigate("/");
    } catch {
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-(--bg-surface) rounded-2xl border border-gray-800 shadow-(--shadow-soft)">
      <h2 className="text-3xl font-bold mb-6 text-center text-(--color-accent)">Connexion</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-(--bg-main) border border-gray-700 rounded-xl focus:border-(--color-accent) outline-none transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-(--bg-main) border border-gray-700 rounded-xl focus:border-(--color-accent) outline-none transition-colors"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-(--color-accent) text-(--bg-main) font-bold py-3 rounded-xl hover:opacity-90 transition-opacity mt-4"
        >
          Se connecter
        </button>
      </form>
      <p className="mt-6 text-center text-(--text-dim)">
        Pas de compte ?{" "}
        <Link to="/register" className="text-(--color-accent) hover:underline">
          S'inscrire
        </Link>
      </p>
    </div>
  );
};

export default Login;
