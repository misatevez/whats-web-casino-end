import { AdminProfileDialog } from "../admin-profile-dialog";
import { AdminContactDialog } from "../admin-contact-dialog";
import { Chat, UserProfile } from "@/lib/types";

interface AdminDialogsProps {
  showProfileSettings: boolean;
  setShowProfileSettings: (show: boolean) => void;
  showContactInfo: boolean;
  setShowContactInfo: (show: boolean) => void;
  adminData: UserProfile;
  setAdminData: (data: UserProfile) => void;
  selectedChat: Chat | null;
}

export function AdminDialogs({
  showProfileSettings,
  setShowProfileSettings,
  showContactInfo,
  setShowContactInfo,
  adminData,
  setAdminData,
  selectedChat,
}: AdminDialogsProps) {
  return (
    <>
      <AdminProfileDialog
        open={showProfileSettings}
        onOpenChange={setShowProfileSettings}
        profile={adminData}
        onProfileUpdate={setAdminData}
      />

      <AdminContactDialog
        open={showContactInfo}
        onOpenChange={setShowContactInfo}
        chat={selectedChat}
      />
    </>
  );
}