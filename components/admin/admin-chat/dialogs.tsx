import { AdminProfileDialog } from "../admin-profile-dialog";
import { AdminContactDialog } from "../admin-contact-dialog";
import { AdminStatusDialog } from "../admin-status-dialog";
import { AdminAddNumberDialog } from "../admin-add-number-dialog";
import { Chat, UserProfile } from "@/lib/types";

interface AdminDialogsProps {
  showProfileSettings: boolean;
  setShowProfileSettings: (show: boolean) => void;
  showContactInfo: boolean;
  setShowContactInfo: (show: boolean) => void;
  showStatusUpload: boolean;
  setShowStatusUpload: (show: boolean) => void;
  showStatusViewer: boolean;
  setShowStatusViewer: (show: boolean) => void;
  showAddNumber: boolean;
  setShowAddNumber: (show: boolean) => void;
  adminData: UserProfile;
  setAdminData: (data: UserProfile) => void;
  selectedChat: Chat | null;
  newPhoneNumber: string;
  setNewPhoneNumber: (number: string) => void;
  handleAddNumber: () => void;
  handleStatusUpload: (file: File, caption?: string) => void;
  handleStatusDelete: (statusId: number) => void;
}

export function AdminDialogs({
  showProfileSettings,
  setShowProfileSettings,
  showContactInfo,
  setShowContactInfo,
  showStatusUpload,
  setShowStatusUpload,
  showStatusViewer,
  setShowStatusViewer,
  showAddNumber,
  setShowAddNumber,
  adminData,
  setAdminData,
  selectedChat,
  newPhoneNumber,
  setNewPhoneNumber,
  handleAddNumber,
  handleStatusUpload,
  handleStatusDelete
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

      <AdminStatusDialog
        open={showStatusUpload}
        onOpenChange={setShowStatusUpload}
        statuses={adminData.statuses || []}
        onStatusUpload={handleStatusUpload}
        onStatusDelete={handleStatusDelete}
        viewOnly={false}
      />

      <AdminStatusDialog
        open={showStatusViewer}
        onOpenChange={setShowStatusViewer}
        statuses={adminData.statuses || []}
        viewOnly={true}
      />

      <AdminAddNumberDialog
        open={showAddNumber}
        onOpenChange={setShowAddNumber}
        phoneNumber={newPhoneNumber}
        onPhoneNumberChange={setNewPhoneNumber}
        onAdd={handleAddNumber}
      />
    </>
  );
}