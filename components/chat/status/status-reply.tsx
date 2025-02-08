import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface StatusReplyProps {
  showReply: boolean;
  reply: string;
  onReplyChange: (value: string) => void;
  onSubmit: () => void;
  onShowReply: () => void;
}

export function StatusReply({
  showReply,
  reply,
  onReplyChange,
  onSubmit,
  onShowReply
}: StatusReplyProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4">
      {showReply ? (
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }} className="flex gap-2">
          <Input
            value={reply}
            onChange={(e) => onReplyChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a reply..."
            className="bg-[#2a3942] border-none text-white placeholder:text-[#8696a0]"
            autoFocus
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="text-[#00a884]"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      ) : (
        <Button
          variant="secondary"
          className="w-full bg-[#2a3942] text-white hover:bg-[#374248]"
          onClick={onShowReply}
        >
          Reply to status
        </Button>
      )}
    </div>
  );
}