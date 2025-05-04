"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "WHAT DOES ATHERS OFFER?",
    answer:
      "ATHERS offers a voice-first AI therapist that listens without judgment, 24/7.",
  },
  {
    question: "IS THIS A REAL THERAPIST?",
    answer:
      "Nope — it's an AI listener. Not a replacement for mental health professionals.",
  },
  {
    question: "IS MY DATA PRIVATE?",
    answer:
      "Yes. Conversations are not stored or used unless you choose to save them.",
  },
  {
    question: "DO I NEED TO SIGN UP?",
    answer: "You can try it for free without signing up. No pressure.",
  },
  {
    question: "HOW DO I START A SESSION?",
    answer:
      "Just hit the 'Talk to ATHERS' button and start speaking. No app installs needed.",
  },
  {
    question: "CAN I INTERRUPT THE AI?",
    answer:
      "Yes — it's designed to handle interruptions like a real conversation.",
  },
  {
    question: "WHAT MAKES ATHERS DIFFERENT?",
    answer:
      "ATHERS listens — it doesn't judge, doesn't talk over you, and never gets tired.",
  },
  {
    question: "CAN I CUSTOMIZE THE VOICE?",
    answer: "Not yet — but we're working on voice options for future updates.",
  },
];

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="flex flex-col items-center px-4"> {/* Removed -mt-40, added py-20 */}
      <h2 className="text-3xl md:text-5xl lg:text-7xl ibm-plex-mono-medium tracking-tighter mb-8 md:mb-14">
        FREQUENTLY ASKED QUESTIONS
      </h2>
      <div className="bg-[#1c1c1c] text-white w-full max-w-2xl rounded-2xl shadow-[10px_10px_0px_0px_rgba(255,0,255,0.6)] p-6 ibm-plex-mono-regular">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b border-neutral-600 py-4 cursor-pointer"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex items-center justify-between">
              <p className="uppercase tracking-wide text-sm">{faq.question}</p>
              <span className="text-lg">{openIndex === index ? "-" : "+"}</span>
            </div>

            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.p
                  className="mt-2 text-neutral-300 text-sm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {faq.answer}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
