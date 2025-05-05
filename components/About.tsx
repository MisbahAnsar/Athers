import Image from 'next/image'
import { WobbleCard } from './ui/wobble-card'

export default function Page() {
  return (
    <div id="about" className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 lg:py-12">
      {/* First Card (Double Width on Desktop) */}
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[300px] sm:min-h-[400px] lg:min-h-[300px] relative"
        className=""
      >
        <div className="max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6">
          <h2 className="text-left text-balance text-xl sm:text-2xl md:text-3xl ibm-plex-mono-normal tracking-[-0.015em] text-white">
            Your voice. Your space. Your AI therapist.
          </h2>
          <p className="mt-2 sm:mt-4 text-left ibm-plex-mono-thin text-neutral-200 text-sm sm:text-base">
            A calm, judgment-free zone where an AI actually listens. Talk, vent, or just vibe — whenever you need.
          </p>
        </div>
        <Image
          src="/guy.png"
          width={400}
          height={400}
          alt="ai therapy session"
          className="absolute right-4 sm:right-8 md:right-12 lg:right-4 xl:right-8 -bottom-4 sm:-bottom-8 md:-bottom-10 w-64 lg:w-72 xl:w-80 object-contain opacity-20 rounded-2xl"
        />
      </WobbleCard>

      {/* Second Card */}
      <WobbleCard containerClassName="col-span-1 min-h-[250px] sm:min-h-[300px]">
        <div className="p-4 sm:p-6">
          <h2 className="max-w-80 text-left text-balance text-xl sm:text-2xl md:text-3xl ibm-plex-mono-normal tracking-[-0.015em] text-white">
            Would u ever use an AI voice therapist?
          </h2>
          <p className="mt-2 sm:mt-4 text-left ibm-plex-mono-thin text-neutral-200 text-sm sm:text-base">
            Real talk. It&rsquo;s private, always available, and actually cares about what you&rsquo;re saying.
          </p>
        </div>
      </WobbleCard>

      {/* Third Card (Full Width on Desktop) */}
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[300px] sm:min-h-[400px] lg:min-h-[250px] xl:min-h-[300px] relative overflow-hidden">
        <div className="max-w-sm sm:max-w-md md:max-w-lg p-4 sm:p-6">
          <h2 className="text-left text-balance text-xl sm:text-2xl md:text-3xl ibm-plex-mono-normal tracking-[-0.015em] text-white">
            Try voice-first therapy with your personal AI listener.
          </h2>
          <p className="mt-2 sm:mt-4 text-left ibm-plex-mono-thin text-neutral-200 text-sm sm:text-base">
            No awkward video calls. No pressure. Just your voice — and an AI that gets it.
          </p>
        </div>

        {/* Arrow beside girl image */}
        <Image 
          src="/arrows1.png" 
          width={200}
          height={200}
          alt="arrow"
          className="absolute top-8 sm:top-12 lg:top-6 right-16 sm:right-24 md:right-32 lg:right-[28%] w-16 sm:w-24 md:w-32 object-contain rotate-[145deg] hidden lg:block opacity-50"
        />

        {/* Girl image */}
        <Image
          src="/girl2.png"
          width={400}
          height={400}
          alt="ai therapy session"
          className="absolute right-4 sm:right-8 md:right-12 lg:right-4 xl:right-8 -bottom-4 sm:-bottom-8 md:-bottom-10 w-64 lg:w-72 xl:w-80 object-contain opacity-20 rounded-2xl"
        />
      </WobbleCard>
    </div>
  )
}