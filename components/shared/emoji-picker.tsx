import { Button } from "@/components/ui/button"
import { Smile } from "lucide-react"
import EmojiPickerComponent from "emoji-picker-react"
import type { EmojiPickerProps } from "@/types/interfaces"

export function EmojiPicker({ showPicker, onToggle, onEmojiSelect, disabled }: EmojiPickerProps) {
  return (
    <div className="relative">
      <Button type="button" variant="ghost" size="icon" onClick={onToggle} disabled={disabled}>
        <Smile className="h-5 w-5 sm:h-6 sm:w-6 text-[#8696a0]" />
      </Button>
      {showPicker && (
        <div className="absolute bottom-full left-0 z-50 mb-2">
          <EmojiPickerComponent onEmojiClick={onEmojiSelect} width={300} height={400} />
        </div>
      )}
    </div>
  )
}

