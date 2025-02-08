import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StatusNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export function StatusNavigation({
  onPrevious,
  onNext,
  hasPrevious,
  hasNext
}: StatusNavigationProps) {
  return (
    <>
      <div className="absolute inset-y-0 left-4 flex items-center z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="text-white disabled:opacity-0"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      </div>
      <div className="absolute inset-y-0 right-4 flex items-center z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          disabled={!hasNext}
          className="text-white disabled:opacity-0"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>
    </>
  );
}