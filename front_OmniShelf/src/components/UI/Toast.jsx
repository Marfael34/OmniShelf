import { useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-24 right-6 flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl z-100 animate-in fade-in slide-in-from-right-10 duration-300 ${
      type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
    }`}>
      {type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <span className="font-bold">{message}</span>
    </div>
  );
};

export default Toast;
