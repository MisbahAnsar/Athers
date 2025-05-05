import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Landing() {
  return (
    <div id="home-section" className="px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-center ibm-plex-mono-medium tracking-tight leading-[1.2] sm:leading-[1.3] md:leading-[1.4] lg:leading-[1.5] xl:leading-[6.2rem] mt-4">
        ATHERS: YOUR <span className="text-[#DD89FE]">VOICE </span>
        <br className="hidden sm:block" />
        AI THERAPIST
      </div>
      <div className="mt-6 sm:mt-8 text-center text-base sm:text-lg md:text-xl ibm-plex-mono-regular uppercase tracking-wide leading-relaxed sm:leading-[1.8] md:leading-[2.2rem] opacity-60 max-w-3xl mx-auto px-4">
        The future of mental wellness is here - are you ready to talk?
        <br className="hidden sm:block" />
        Discover the power of voice-first therapy with your personal AI listener, Athers.
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 sm:mt-12">
        <Link href="https://discord.gg/dK7rfcQGkC" className="w-full sm:w-auto">
          <Button className="rounded-md hover:bg-black p-4 sm:p-6 md:p-8 ibm-plex-mono-regular text-base sm:text-lg md:text-xl w-full sm:w-auto text-center">
            JOIN THE COMMUNITY
          </Button>
        </Link>
        <Link href="/ather" className="w-full sm:w-auto">
          <Button className="bg-white border hover:bg-white text-black rounded-md p-4 sm:p-6 md:p-8 ibm-plex-mono-regular text-base sm:text-lg md:text-xl w-full">
            TRY ATHERS NOW
          </Button>
        </Link>
      </div>
    </div>
  );
}