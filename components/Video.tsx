export default function Video() {
  return (
    <div className="relative flex justify-center py-10 sm:py-16 md:py-20 overflow-visible md:px-6">
      {/* Card container with video */}
      <div className="w-full max-w-4xl md:max-w-5xl lg:max-w-6xl h-64 sm:h-96 md:h-96 lg:h-[500px] xl:h-[650px] border-4 border-[#A9A9A9] bg-[#1D1D1D] rounded-xl md:rounded-2xl lg:rounded-3xl shadow-md p-1 sm:p-2 flex items-center justify-center relative z-10">
        {/* Video container - using aspect-ratio for better responsiveness */}
        <div className="w-full h-full aspect-video overflow-hidden rounded-lg md:rounded-xl">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/BBJa32lCaaY?rel=0&modestbranding=1&si=XM3D0meOKsq5y7rM"
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}