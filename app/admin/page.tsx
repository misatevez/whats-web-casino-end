"use client"

import { ToastProvider } from "@/contexts/ToastContext"
import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent"

export default function AdminDashboard() {
  return (
    <ToastProvider>
      <AdminDashboardContent />
    </ToastProvider>
  )
}