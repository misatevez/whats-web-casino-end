export interface MessagePreview {
  type: 'image' | 'document';
  name: string;
  url: string;
  size?: string;
}

export interface Message {
  id: string;
  content: string;
  time: string;
  sent: boolean;
  status?: "sent" | "delivered" | "read";
  preview?: MessagePreview;
}

export interface Status {
  id: number;
  imageUrl: string;
  timestamp: string;
  caption?: string;
}

export interface Chat {
  id: string;
  name: string;
  phoneNumber: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
  messages: Message[];
  about?: string;
  statuses?: Status[];
}

export interface UserProfile {
  name: string;
  image: string;
  about: string;
  statuses?: Status[];
}

// Initial states for immediate loading
export const initialAdminProfile: UserProfile = {
  name: "WhatsApp Support",
  image: "https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Favatar.png?alt=media&token=54132d01-d241-429a-b131-1be8951406b7",
  about: "Official WhatsApp Support",
  statuses: []
};

export const initialChat: Chat = {
  id: "",
  name: "",
  phoneNumber: "",
  lastMessage: "",
  time: "",
  unread: 0,
  avatar: "https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Favatar.png?alt=media&token=54132d01-d241-429a-b131-1be8951406b7",
  online: false,
  messages: []
};