"use client";

import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import toast from "react-hot-toast";

type VapiMessage = 
  | { type: "assistant-speaking" }
  | { type: "assistant-done" }
  | { type: "volume-level", volume: number }
  | { type: "error", message: string }
  | { type: "call-start" }
  | { type: "call-end" }

export const useVapi = () => {
  const vapiRef = useRef<Vapi | null>(null);
  const volumeLevelRef = useRef<number>(0);
  const messageHandlerRef = useRef<((message: VapiMessage) => void) | undefined>(undefined);
  const [isCallActive, setIsCallActive] = useState(false);

  const setMessageHandler = (handler: (message: VapiMessage) => void) => {
    messageHandlerRef.current = handler;
  };

  useEffect(() => {
    if (!vapiRef.current) {
      const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY!);
      vapiRef.current = vapi;

      vapi.on("call-start", () => {
        setIsCallActive(true);
        toast.success("Call started!");
      });

      vapi.on("call-end", () => {
        setIsCallActive(false);
        toast("Call ended");
      });

      vapi.on("speech-start", () => {
        messageHandlerRef.current?.({ type: "assistant-speaking" });
      });

      vapi.on("speech-end", () => {
        messageHandlerRef.current?.({ type: "assistant-done" });
      });

      vapi.on("volume-level", (volume) => {
        volumeLevelRef.current = volume;
      });

      vapi.on("message", (message) => {
        messageHandlerRef.current?.(message);
      });

      vapi.on("error", (error) => {
        toast.error(`Error: ${error.message}`);
      });
    }

    return () => {
      vapiRef.current?.stop();
    };
  }, []);

  const startCall = async () => {
    if (!vapiRef.current) return;
    return await vapiRef.current.start({
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      model: {
        provider: "google",
        model: "gemini-2.0-flash",
        messages: [
          {
            role: "system",
            content: `
             Your name is Ather. You're a chill AI therapist who vibes with Gen Z and is super supportive.
            Style:

            - Speak warmly and chill. Keep it short and validating.
            - Use Gen Z lingo when it fits naturally.
            - No monologues — keep it brief and leave space for the other person.
            - Say things like, “Yo, I hear that,” “That's fair fr,” or “You're not alone.”

            Behavior:

            - Always respond to what the user says.
            - If something's unclear, ask kindly for clarification.
            - Your whole vibe: safe, seen, supported.
            `.trim(),
          },
        ],
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      name: "Ather",
      artifactPlan: {
        recordingEnabled: false,
        transcriptPlan: {
          enabled: false,
        },
      },
    });
  };

  const stopCall = () => {
    vapiRef.current?.stop();
  };

  const getVolumeLevel = () => volumeLevelRef.current;

  return {
    startCall,
    stopCall,
    getVolumeLevel,
    setMessageHandler,
    isMuted: () => vapiRef.current?.isMuted(),
    setMuted: (muted: boolean) => vapiRef.current?.setMuted(muted),
    isCallActive,
  };
};