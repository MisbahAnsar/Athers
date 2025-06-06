"use client"

import { Github } from "lucide-react";
import { DiscordLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  const scrollToFaqs = () => {
    const faqsSection = document.getElementById('faqs-section');
    if (faqsSection) {
      faqsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHome = () => {
    const homeSection = document.getElementById('home-section');
    if (homeSection) {
      homeSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  return (
    <footer className="bg-black text-white w-full px-6 py-16 mt-20 rounded-t-3xl shadow-[0_-5px_50px_rgba(255,0,255,0.1)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 ibm-plex-mono-regular">
        
        {/* Brand */}
        <div>
          <h3 className="text-xl font-semibold mb-4 tracking-tight">ATHERS</h3>
          <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
            Voice-first AI therapy that listens. No judgment. No pressure. Just real talk.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-md font-semibold mb-4 text-neutral-200">Explore</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li><button onClick={scrollToHome} className="hover:text-white transition">Home</button></li>
            <li><Link href="/ather" className="hover:text-white transition">Try ATHERS</Link></li>
            <li><button onClick={scrollToFaqs} className="hover:text-white transition">FAQs</button></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-md font-semibold mb-4 text-neutral-200">Say hi 👋</h4>
          <p className="text-sm text-neutral-400">Email: <a href="mailto:misbaansari114@gmail.com" className="hover:text-white transition">misbaansari114@gmail.com</a></p>
          <p className="text-sm text-neutral-400 mt-3">Built for you - the ones who just need someone to listen.</p>
        </div>

        {/* Socials */}
        <div>
          <h4 className="text-md font-semibold mb-4 text-neutral-200">Follow us</h4>
          <div className="flex space-x-5 text-neutral-400">
            <Link href="https://x.com/Misba8069" target="_blank" rel="noopener noreferrer" className="hover:text-white transition text-xl">
              <TwitterLogoIcon width={20} height={20} />
            </Link>
            <Link href="https://github.com/MisbahAnsar/Ather" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <Github size={20} />
            </Link>
            <Link href="https://discord.gg/dK7rfcQGkC" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <DiscordLogoIcon width={20} height={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="mt-16 border-t border-neutral-800 pt-6 text-center text-neutral-500 text-xs">
        © {new Date().getFullYear()} ATHERS. All rights reserved.
      </div>
    </footer>
  );
}
