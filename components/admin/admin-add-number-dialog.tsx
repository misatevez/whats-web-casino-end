"use client";

import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface AdminAddNumberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumber: string;
  onPhoneNumberChange: (number: string) => void;
  onAdd: () => void;
}

export function AdminAddNumberDialog({
  open,
  onOpenChange,
  phoneNumber,
  onPhoneNumberChange,
  onAdd
}: AdminAddNumberDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#222e35] text-[#e9edef] border-none">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-[#8696a0]">Phone Number</label>
            <div className="flex gap-2">
              <Input
                value={phoneNumber}
                onChange={(e) => onPhoneNumberChange(e.target.value)}
                placeholder="+54 9 11 1234 5678"
                className="bg-[#2a3942] border-none text-[#d1d7db]"
              />
              <Button size="icon" variant="ghost">
                <Phone className="h-4 w-4 text-[#00a884]" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={onAdd}
            className="bg-[#00a884] hover:bg-[#02906f] text-white"
          >
            Add Contact
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}