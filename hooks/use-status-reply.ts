import { useState } from 'react';

export function useStatusReply() {
  const [showReply, setShowReply] = useState(false);
  const [reply, setReply] = useState("");

  const handleReplySubmit = (callback: (reply: string) => void) => {
    if (reply.trim()) {
      callback(reply);
      setReply("");
      setShowReply(false);
    }
  };

  const resetReply = () => {
    setShowReply(false);
    setReply("");
  };

  return {
    showReply,
    reply,
    setShowReply,
    setReply,
    handleReplySubmit,
    resetReply
  };
}