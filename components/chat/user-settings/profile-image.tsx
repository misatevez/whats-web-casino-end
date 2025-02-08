import { Camera } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";

interface ProfileImageProps {
  image: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export function ProfileImage({ image, onImageChange, disabled }: ProfileImageProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
          <Image
            src={image}
            alt="Profile"
            width={128}
            height={128}
            className="rounded-full"
          />
        </Avatar>
        <label className="absolute bottom-0 right-0 bg-[#00a884] p-2 rounded-full cursor-pointer">
          <Camera className="h-5 w-5 text-white" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
            disabled={disabled}
          />
        </label>
      </div>
    </div>
  );
}