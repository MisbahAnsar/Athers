"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import Vapi from "@vapi-ai/web";
import toast from "react-hot-toast";

/* eslint-disable @typescript-eslint/no-explicit-any */

type VapiMessage = 
  | { type: "assistant-speaking" }
  | { type: "assistant-done" }
  | { type: "volume-level", volume: number }
  | { type: "error", message: string }
  | { type: "call-start" }
  | { type: "call-end" }

// Singleton pattern to ensure Vapi is only instantiated once globally
let vapiInstance: Vapi | null = null;
let listenersInitialized = false;

// Shared state across all hook instances
let isCallActiveState = false;
const callStateListeners = new Set<() => void>();

const notifyCallStateChange = () => {
  callStateListeners.forEach(listener => listener());
};

const getVapiInstance = () => {
  if (!vapiInstance) {
    vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY!);
    console.log("Vapi SDK initialized (singleton)");
  }
  return vapiInstance;
};

// Get the singleton instance
const vapi = getVapiInstance();

// Initialize event listeners once
const initializeListeners = () => {
  if (listenersInitialized) return;
  listenersInitialized = true;
  
  console.log("Setting up Vapi event listeners (once)");

  vapi.on("call-start", () => {
    isCallActiveState = true;
    notifyCallStateChange();
    toast.success("Call started, Say Hello!");
  });

  vapi.on("call-end", () => {
    isCallActiveState = false;
    notifyCallStateChange();
    toast("Call ended");
    console.log("Vapi call-ended");
  });

  vapi.on("error", (error) => {
    // Filter out expected errors that occur during normal call termination
    const errorMessage = error?.errorMsg || error?.message || "";
    const errorType = error?.error?.type || "";
    
    // Ignore "Meeting has ended" errors as they're expected during call termination
    if (errorMessage.includes("Meeting has ended") || errorMessage.includes("Meeting ended")) {
      console.log("Call ended normally:", errorMessage);
      return;
    }

    // Handle timeout errors more gracefully
    if (errorType.includes("timeout") || errorMessage.includes("timeout")) {
      console.warn("Vapi timeout error:", error);
      toast.error("Connection timeout. Please try again.");
      // Ensure call state is updated on timeout
      if (isCallActiveState) {
        isCallActiveState = false;
        notifyCallStateChange();
      }
      return;
    }

    // Handle pipeline errors
    if (errorType.includes("pipeline-error") || errorMessage.includes("pipeline-error")) {
      console.warn("Vapi pipeline error:", error);
      toast.error("Connection issue. Please try again.");
      // Ensure call state is updated on pipeline error
      if (isCallActiveState) {
        isCallActiveState = false;
        notifyCallStateChange();
      }
      return;
    }

    // Log and show other unexpected errors
    console.error("Vapi error:", error);
    toast.error(`Error: ${errorMessage || "An unexpected error occurred"}`);
  });
};

export const useVapi = () => {
  const volumeLevelRef = useRef<number>(0);
  const messageHandlerRef = useRef<((message: VapiMessage) => void) | undefined>(undefined);
  
  // Use shared state for isCallActive
  const isCallActive = useSyncExternalStore(
    (callback) => {
      callStateListeners.add(callback);
      return () => callStateListeners.delete(callback);
    },
    () => isCallActiveState,
    () => isCallActiveState
  );

  const setMessageHandler = useCallback((handler: (message: VapiMessage) => void) => {
    messageHandlerRef.current = handler;
  }, []);

  useEffect(() => {
    // Initialize listeners once
    initializeListeners();

    // Set up message-specific listeners
    const handleSpeechStart = () => {
      messageHandlerRef.current?.({ type: "assistant-speaking" });
    };

    const handleSpeechEnd = () => {
      messageHandlerRef.current?.({ type: "assistant-done" });
    };

    const handleVolumeLevel = (volume: number) => {
      volumeLevelRef.current = volume;
    };

    const handleMessage = (message: any) => {
      // Handle status-update messages that may contain error information
      if (message?.type === "status-update") {
        const status = message.status;
        const endedReason = message.endedReason;

        // Log status updates for debugging (but not as errors)
        if (status === "ended") {
          console.log("Call status: ended", endedReason ? `(reason: ${endedReason})` : "");
          
          // Handle timeout errors in status updates
          if (endedReason?.includes("timeout")) {
            console.warn("Call ended due to timeout:", endedReason);
            toast.error("Connection timeout. Please try again.");
            if (isCallActiveState) {
              isCallActiveState = false;
              notifyCallStateChange();
            }
          } else if (endedReason?.includes("pipeline-error")) {
            console.warn("Call ended due to pipeline error:", endedReason);
            toast.error("Connection issue. Please try again.");
            if (isCallActiveState) {
              isCallActiveState = false;
              notifyCallStateChange();
            }
          }
          return;
        }
        
        // Log other status updates without showing toasts
        if (status !== "in-progress") {
          console.log("Call status:", status);
        }
        return;
      }

      // Handle other message types
      console.log("Message:", message);
      messageHandlerRef.current?.(message as VapiMessage);
    };

    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("volume-level", handleVolumeLevel);
    vapi.on("message", handleMessage);

    return () => {
      // Clean up only this component's listeners
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("volume-level", handleVolumeLevel);
      vapi.off("message", handleMessage);
    };
  }, []);

  const startCall = useCallback(async (options?: {
    voiceProvider?: "lmnt" | "playht" | "azure" | "openai";
    voiceId?: string;
  }) => {
    try {
      // Default to LMNT with lily voice, but allow override
      const voiceProvider = options?.voiceProvider || "lmnt";
      const voiceId = options?.voiceId || (voiceProvider === "lmnt" ? "lily" : "jennifer");

      return await vapi.start({
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en-US",
        },
        model: {
          // Cast to any so we can use the newer Gemini model
          provider: "google" as any,
          model: "gemini-3-flash-preview" as any,
          messages: [
            {
              role: "system",
              content: `
             Your name is Ather. You're a chill AI therapist who vibes with Gen Z and is super supportive.
            Style:

            - Speak warmly and chill. Keep it short and validating.
            - Use Gen Z lingo when it fits naturally.
            - No monologues — keep it brief and leave space for the other person.
            - Say things like, "Yo, I hear that," "That's fair fr," or "You're not alone."

            Behavior:

            - Always respond to what the user says.
            - If something's unclear, ask kindly for clarification.
            - Your whole vibe: safe, seen, supported.
            `.trim(),
            },
          ],
        },
        voice: {
          provider: voiceProvider,
          voiceId: voiceId,
        },
        name: "Ather",
        firstMessage: "Hey, I'm Ather. What's on your mind today?",
        artifactPlan: {
          recordingEnabled: false,
          transcriptPlan: {
            enabled: false,
          },
        },
      });
    } catch (error: any) {
      console.error("Error starting call:", error);
      toast.error("Failed to start call. Please try again.");
      // Ensure call state is not active if start fails
      if (isCallActiveState) {
        isCallActiveState = false;
        notifyCallStateChange();
      }
      throw error;
    }
  }, []);

  const stopCall = useCallback(() => {
    vapi.stop();
  }, []);

  const getVolumeLevel = useCallback(() => volumeLevelRef.current, []);

  return {
    startCall,
    stopCall,
    getVolumeLevel,
    setMessageHandler,
    isMuted: () => vapi.isMuted(),
    setMuted: (muted: boolean) => vapi.setMuted(muted),
    isCallActive,
  };
};