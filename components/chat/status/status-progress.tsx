interface StatusProgressProps {
  count: number;
  currentIndex: number;
  progress: number;
}

export function StatusProgress({
  count,
  currentIndex,
  progress
}: StatusProgressProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 p-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex-1 h-0.5 bg-[#ffffff40] overflow-hidden"
        >
          <div
            className="h-full bg-white transition-all duration-100"
            style={{
              width: index === currentIndex ? `${progress}%` : 
                     index < currentIndex ? "100%" : "0%"
            }}
          />
        </div>
      ))}
    </div>
  );
}