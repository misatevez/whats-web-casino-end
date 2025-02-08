interface PhoneInfoProps {
  phoneNumber: string;
}

export function PhoneInfo({ phoneNumber }: PhoneInfoProps) {
  return (
    <div className="flex items-center gap-2 bg-[#111b21] p-4 rounded-lg">
      <div className="text-[#8696a0]">
        <span className="block text-sm">Phone Number</span>
        <span className="text-base">{phoneNumber}</span>
      </div>
    </div>
  );
}