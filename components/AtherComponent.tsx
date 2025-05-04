"use client";

import { useVapi } from "@/lib/vapi";
import { Button } from "@/components/ui/button";
import { Toaster } from "react-hot-toast";

export default function AtherComponent() {
  const { startCall, stopCall, isCallActive } = useVapi();

  const handleStartCall = () => {
    startCall();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
          },
        }}
      />
      <h1 className="text-4xl font-bold">Talk to Ather</h1>

      {/* Voice activity indicator - only shows during call and properly centered */}
      {isCallActive && (
        <div className="flex justify-center items-center h-16 w-full">
          <div className="flex space-x-2 items-end h-12">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-2 bg-green-400 rounded-full"
                style={{
                  animation: `voicePulse 1.4s infinite ${i * 0.2}s`,
                  height: `${Math.random() * 12 + 4}px`
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        {/* Status indicator */}
        <div
          className={`absolute -inset-1 rounded-lg blur opacity-75 transition-all duration-500 ${
            isCallActive
              ? "bg-green-500 animate-pulse"
              : "bg-red-500"
          }`}
        ></div>

        <div className="relative flex gap-4 bg-background p-4 rounded-lg">
          <Button 
            onClick={handleStartCall}
            disabled={isCallActive}
            className={isCallActive ? "opacity-50 cursor-not-allowed" : ""}
          >
            Start Call
          </Button>
          <Button
            className="hover:bg-gray-200"
            onClick={stopCall}
            variant="secondary"
            disabled={!isCallActive}
          >
            End Call
          </Button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes voicePulse {
          0%, 100% { transform: scaleY(1); opacity: 0.6; }
          50% { transform: scaleY(1.8); opacity: 1; }
        }
      `}</style>
    </div>
  );
}