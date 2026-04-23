import React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-surface border-2 border-red-500/20 rounded-3xl p-10 text-center space-y-6 shadow-2xl shadow-red-500/10 animate-zoom-in">
            <div className="inline-flex p-4 bg-red-500/10 rounded-2xl">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-main uppercase tracking-tighter italic">
                Erreur de Flux
              </h2>
              <p className="text-dim text-sm font-medium">
                Le système a rencontré une anomalie critique lors de l'hydratation des données.
              </p>
            </div>
            <div className="bg-black/40 p-4 rounded-xl border border-white/5 overflow-hidden">
                <code className="text-[10px] text-red-400 font-mono break-all">
                    {this.state.error?.message || "Erreur inconnue"}
                </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-red-500 text-white font-black rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCcw size={18} />
              <span>RÉINITIALISER LE SYSTÈME</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
