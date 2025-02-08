import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";

interface AboutFieldProps {
  about: string;
  onChange: (about: string) => void;
  disabled?: boolean;
}

export function AboutField({ about, onChange, disabled }: AboutFieldProps) {
  return (
    <div>
      <label className="text-sm text-[#8696a0]">About</label>
      <div className="flex gap-2">
        <Input
          value={about}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Hey there! I am using WhatsApp"
          className="bg-[#2a3942] border-none text-[#d1d7db]"
          disabled={disabled}
        />
        <Button size="icon" variant="ghost">
          <Edit className="h-4 w-4 text-[#00a884]" />
        </Button>
      </div>
    </div>
  );
}