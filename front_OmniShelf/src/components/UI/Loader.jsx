import { Loader2 } from "lucide-react";

const Loader = ({ fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-accent blur-xl opacity-20 animate-pulse"></div>
        <Loader2 className="w-16 h-16 text-accent animate-spin relative z-10" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-main font-black tracking-[0.2em] uppercase italic animate-pulse">
          Synchronisation
        </p>
        <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-accent animate-[scan_2s_linear_infinite] w-1/2"></div>
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-bg-main z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full py-24 flex items-center justify-center">
      {content}
    </div>
  );
};

export default Loader;
