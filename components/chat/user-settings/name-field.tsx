import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";

interface NameFieldProps {
  name: string;
  onChange: (name: string) => void;
  disabled?: boolean;
}

export function NameField({ name, onChange, disabled }: NameFieldProps) {
  return (
    <div>
      <label className="text-sm text-[#8696a0]">Your Name</label>
      <div className="flex gap-2">
        <Input
          value={name}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your name"
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