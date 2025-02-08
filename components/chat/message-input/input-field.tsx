import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface MessageInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function MessageInputField({
  value,
  onChange,
  onSubmit
}: MessageInputFieldProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message"
        className="flex-1 bg-[#2a3942] border-none text-[#d1d7db] placeholder:text-[#8696a0] text-sm sm:text-base h-9 sm:h-10"
      />
      <Button type="submit" variant="ghost" size="icon">
        <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-[#8696a0]" />
      </Button>
    </>
  );
}