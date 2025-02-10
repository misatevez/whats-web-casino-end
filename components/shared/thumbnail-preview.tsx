"use client"

import Image from "next/image"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Download } from "lucide-react"
import type { ThumbnailPreviewProps } from "@/types/interfaces"

// interface ThumbnailPreviewProps {
//   content: string
//   type: "text" | "image" | "document"
//   filename?: string
// }

export function ThumbnailPreview({ content, type, filename }: ThumbnailPreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  if (type === "image") {
    return (
      <>
        <div className="cursor-pointer" onClick={() => setIsPreviewOpen(true)}>
          <Image
            src={content || "/placeholder.svg"}
            alt="Image preview"
            width={200}
            height={200}
            className="rounded-lg object-cover"
          />
        </div>
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="bg-[#111b21] border-none text-[#e9edef] max-w-3xl p-0">
            <DialogHeader className="bg-[#202c33] px-4 py-3 flex-row items-center justify-between">
              <DialogTitle>Image Preview</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPreviewOpen(false)}
                className="text-[#aebac1] hover:text-[#e9edef]"
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogHeader>
            <div className="p-4">
              <Image
                src={content || "/placeholder.svg"}
                alt="Full size preview"
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  } else if (type === "document") {
    return (
      <a
        href={content}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center bg-[#2a3942] rounded-lg p-2 hover:bg-[#3a4952] transition-colors"
      >
        <svg
          className="w-6 h-6 mr-2 text-[#00a884]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        <span className="text-[#e9edef] text-sm flex-grow">{filename || "Document"}</span>
        <Download className="w-5 h-5 text-[#00a884] ml-2" />
      </a>
    )
  } else {
    return <p className="text-[#e9edef] text-sm">{content}</p>
  }
}

