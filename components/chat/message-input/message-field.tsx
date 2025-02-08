import { Input } from "@/components/ui/input";

interface MessageFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
}

export function MessageField({
  value,
  onChange,
  onSubmit,
  disabled
}: MessageFieldProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={handleKeyPress}
      placeholder="Type a message"
      className="flex-1 bg-[#2a3942] border-none text-[#d1d7db] placeholder:text-[#8696a0] text-sm sm:text-base h-9 sm:h-10"
      disabled={disabled}
    />
  );
}