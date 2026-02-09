"use client";

import { Button } from "@/components/ui/button";
import { useVapi } from "@/lib/vapi";

export default function AtherPage() {
  const { startCall, stopCall, isMuted, setMuted } = useVapi();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Talk to Ather</h1>

      <div className="flex gap-4">
        <Button onClick={() => startCall()}>Start Call</Button>
        <Button onClick={stopCall} variant="secondary">End Call</Button>
      </div>

      <div className="mt-4 text-sm opacity-60">
        <button onClick={() => setMuted(true)}>Mute</button> |{" "}
        <button onClick={() => setMuted(false)}>Unmute</button> |{" "}
        <button onClick={() => alert(`Muted? ${isMuted()}`)}>Check Mute Status</button>
      </div>
    </div>
  );
}
