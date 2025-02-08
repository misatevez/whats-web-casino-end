import { toast } from "sonner";

export function showOfflineToast() {
  toast.warning(
    "You're offline",
    {
      description: "Some features may be limited. We'll try to reconnect automatically.",
      duration: 5000,
    }
  );
}

export function showOnlineToast() {
  toast.success(
    "You're back online",
    {
      description: "All features are now available.",
      duration: 3000,
    }
  );
}