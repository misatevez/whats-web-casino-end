import type React from "react"

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="h-screen bg-background text-foreground">{children}</div>
}

