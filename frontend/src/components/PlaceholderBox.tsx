const PlaceholderBox = () => {
    return(
        <div className="relative h-[250px] sm:h-[320px]"> {/* Reduced height */}
        <div className="absolute -inset-1 bg-red-500/20 rounded-lg blur-sm"></div>
        <div className="relative h-full bg-neutral-800/80 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-neutral-700">
          <div className="h-full flex flex-col justify-between">
            {/* Window Controls */}
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-red-500 rounded-full" />
              <div className="h-2 w-2 bg-yellow-500 rounded-full" />
              <div className="h-2 w-2 bg-green-500 rounded-full" />
            </div>
            {/* Content Placeholder */}
            <div className="space-y-2 flex-1 flex flex-col justify-center">
              <div className="h-3 bg-neutral-700/60 rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-neutral-700/60 rounded animate-pulse" />
              <div className="h-3 bg-neutral-700/60 rounded w-5/6 animate-pulse" />
            </div>
            <div className="h-16 bg-neutral-700/60 rounded animate-pulse" /> {/* Smaller video placeholder */}
          </div>
        </div>
      </div>
  );}

export default PlaceholderBox;