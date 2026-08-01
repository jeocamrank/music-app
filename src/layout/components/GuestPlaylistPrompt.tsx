const GuestPlaylistSkeleton = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Fake playlist items */}
      <div className="space-y-3 px-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 animate-pulse"
          >
            <div className="size-12 rounded-md bg-zinc-800" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 bg-zinc-800 rounded" />
              <div className="h-3 w-1/2 bg-zinc-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GuestPlaylistSkeleton
