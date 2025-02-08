import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface SendButtonProps {
  disabled?: boolean;
}

export function SendButton({ disabled }: SendButtonProps) {
  return (
    <Button 
      type="submit" 
      variant="ghost" 
      size="icon"
      disabled={disabled}
    >
      <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-[#8696a0]" />
    </Button>
  );
}