"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import * as VapiImport from "@vapi-ai/web";
import toast from "react-hot-toast";

/* eslint-disable @typescript-eslint/no-explicit-any */

type VapiMessage =
  | { type: "assistant-speaking" }
  | { type: "assistant-done" }
  | { type: "volume-level"; volume: number }
  | { type: "error"; message: string }
  | { type: "call-start" }
  | { type: "call-end" };

type VapiInstance = {
  start: (assistantIdOrConfig: any, assistantOverrides?: any) => Promise<any>;
  stop: () => void;
  isMuted: () => boolean;
  setMuted: (muted: boolean) => void;
  on: (event: string, cb: (...args: any[]) => void) => void;
  off: (event: string, cb: (...args: any[]) => void) => void;
};

function getVapiCtor(): any {
  // @vapi-ai/web is CJS; constructor may live under `.default` in ESM builds.
  return (VapiImport as any).default ?? (VapiImport as any);
}

function getOrCreateVapi(): VapiInstance {
  const g = globalThis as any;
  if (g.__atheraVapi) return g.__atheraVapi as VapiInstance;

  const publicKey = process.env.NEXT_PUBLIC_VAPI_KEY;
  const VapiCtor = getVapiCtor();
  g.__atheraVapi = new VapiCtor(publicKey);
  return g.__atheraVapi as VapiInstance;
}

function getEnv() {
  return {
    publicKey: process.env.NEXT_PUBLIC_VAPI_KEY,
    assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,
  };
}

// Shared state (store) for call UI.
let isCallActiveState = false;
let isCallConnectingState = false;
const storeListeners = new Set<() => void>();

function emitStoreChange() {
  storeListeners.forEach((l) => l());
}

function setCallState(next: { active?: boolean; connecting?: boolean }) {
  if (typeof next.active === "boolean") isCallActiveState = next.active;
  if (typeof next.connecting === "boolean") isCallConnectingState = next.connecting;
  emitStoreChange();
}

function ensureCoreListenersOnce() {
  const g = globalThis as any;
  if (g.__atheraVapiCoreListenersReady) return;
  g.__atheraVapiCoreListenersReady = true;

  const vapi = getOrCreateVapi();

  vapi.on("call-start", () => {
    setCallState({ connecting: false, active: true });
  });

  vapi.on("call-end", () => {
    setCallState({ connecting: false, active: false });
  });

  vapi.on("error", (err: any) => {
    const msg = err?.errorMsg || err?.message || err?.error?.message || "";
    // Daily often logs "Meeting has ended" as an "error" even on normal teardown.
    if (typeof msg === "string" && msg.toLowerCase().includes("meeting has ended")) {
      return;
    }
    console.error("Vapi error:", err);
    setCallState({ connecting: false, active: false });
    toast.error(msg || "Vapi error");
  });
}

export function useVapi() {
  const volumeLevelRef = useRef(0);
  const messageHandlerRef = useRef<((m: VapiMessage) => void) | undefined>(undefined);

  const subscribe = useCallback((cb: () => void) => {
    storeListeners.add(cb);
    return () => storeListeners.delete(cb);
  }, []);

  const isCallActive = useSyncExternalStore(
    subscribe,
    () => isCallActiveState,
    () => isCallActiveState
  );

  const isCallStarting = useSyncExternalStore(
    subscribe,
    () => isCallConnectingState,
    () => isCallConnectingState
  );

  const setMessageHandler = useCallback((handler: (message: VapiMessage) => void) => {
    messageHandlerRef.current = handler;
  }, []);

  useEffect(() => {
    const { publicKey } = getEnv();
    if (!publicKey) {
      console.error("Missing NEXT_PUBLIC_VAPI_KEY");
      return;
    }

    ensureCoreListenersOnce();
    const vapi = getOrCreateVapi();

    const onSpeechStart = () => messageHandlerRef.current?.({ type: "assistant-speaking" });
    const onSpeechEnd = () => messageHandlerRef.current?.({ type: "assistant-done" });
    const onVolume = (volume: number) => {
      volumeLevelRef.current = volume;
      messageHandlerRef.current?.({ type: "volume-level", volume });
    };
    const onMessage = (m: any) => {
      // surface status updates for debugging
      if (m?.type === "status-update" && m?.status) {
        console.log("Vapi status-update:", m.status, m.endedReason ? `(reason: ${m.endedReason})` : "");
      }
    };

    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("volume-level", onVolume);
    vapi.on("message", onMessage);

    return () => {
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("volume-level", onVolume);
      vapi.off("message", onMessage);
    };
  }, []);

  const startCall = useCallback(async () => {
    if (isCallActiveState || isCallConnectingState) return;

    const { publicKey, assistantId } = getEnv();
    if (!publicKey) {
      toast.error("Missing NEXT_PUBLIC_VAPI_KEY");
      return;
    }
    if (!assistantId) {
      toast.error("Missing NEXT_PUBLIC_VAPI_ASSISTANT_ID");
      return;
    }

    setCallState({ connecting: true });

    // Ask for mic access up-front (prevents connect-then-eject loops in many browsers).
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
    } catch (e) {
      console.warn("Microphone permission error:", e);
      setCallState({ connecting: false, active: false });
      toast.error("Microphone permission is required.");
      return;
    }

    try {
      ensureCoreListenersOnce();
      const vapi = getOrCreateVapi();

      // Start with assistant ID per Vapi Web SDK docs.
      // Disable background denoising to avoid Krisp processor crashes in some browsers.
      await vapi.start(assistantId, {
        recordingEnabled: false,
        backgroundSpeechDenoisingPlan: {
          smartDenoisingPlan: { enabled: false },
          fourierDenoisingPlan: { enabled: false },
        },
      });

      // Ensure the user's mic is actually live after connect.
      // Some setups/defaults may begin muted, which looks like "assistant doesn't reply".
      try {
        vapi.setMuted(false);
      } catch {
        // ignore
      }
    } catch (err: any) {
      if (err instanceof Response) {
        try {
          const text = await err.clone().text();
          console.error("Error starting call (HTTP Response):", err.status, text);
          toast.error(`Vapi error ${err.status}: ${text || "Bad request"}`);
        } catch {
          console.error("Error starting call (HTTP Response):", err.status);
          toast.error(`Vapi error ${err.status}`);
        }
      } else {
        console.error("Error starting call:", err);
      }
      setCallState({ connecting: false, active: false });
      if (!(err instanceof Response)) {
        const msg = err?.error?.message || err?.message || "Failed to start call.";
        toast.error(msg);
      }
    }
  }, []);

  const stopCall = useCallback(() => {
    try {
      getOrCreateVapi().stop();
    } finally {
      setCallState({ connecting: false, active: false });
    }
  }, []);

  return {
    startCall,
    stopCall,
    isMuted: () => getOrCreateVapi().isMuted(),
    setMuted: (muted: boolean) => getOrCreateVapi().setMuted(muted),
    getVolumeLevel: () => volumeLevelRef.current,
    setMessageHandler,
    isCallActive,
    isCallStarting,
  };
}