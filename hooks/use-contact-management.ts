import { useState } from 'react';
import { Chat } from '@/lib/types';

export function useContactManagement() {
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showAddNumber, setShowAddNumber] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newContactName, setNewContactName] = useState("");

  const handleAddNumber = () => {
    if (newPhoneNumber.trim()) {
      const newContact: Chat = {
        id: Date.now().toString(),
        name: newPhoneNumber,
        phoneNumber: newPhoneNumber,
        lastMessage: "",
        time: "Just now",
        unread: 0,
        avatar: "https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Favatar.png?alt=media&token=54132d01-d241-429a-b131-1be8951406b7",
        online: false,
        messages: []
      };
      setNewPhoneNumber("");
      setShowAddNumber(false);
      return newContact;
    }
    return null;
  };

  const handleSaveContact = (chat: Chat) => {
    if (newContactName.trim()) {
      chat.name = newContactName;
      setNewContactName("");
      return true;
    }
    return false;
  };

  return {
    showContactInfo,
    setShowContactInfo,
    showAddNumber,
    setShowAddNumber,
    newPhoneNumber,
    setNewPhoneNumber,
    newContactName,
    setNewContactName,
    handleAddNumber,
    handleSaveContact
  };
}