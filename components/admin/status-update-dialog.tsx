"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Camera, X, Trash2 } from "lucide-react"
import Image from "next/image"
import { addAdminStatus, uploadStatusImage, fetchAdminStatuses, deleteAdminStatus } from "@/lib/firestore"
import type { AdminStatus } from "@/types/interfaces"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/contexts/ToastContext"

export function StatusUpdateDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [caption, setCaption] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [statuses, setStatuses] = useState<AdminStatus[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const { addToast } = useToast()

  useEffect(() => {
    const loadStatuses = async () => {
      try {
        const fetchedStatuses = await fetchAdminStatuses()
        setStatuses(fetchedStatuses)
      } catch (error) {
        console.error("Error fetching admin statuses:", error)
        addToast({
          title: "Error",
          description: "Failed to load statuses. Please try again.",
          variant: "destructive",
        })
      }
    }
    loadStatuses()
  }, [addToast])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0]
        setUploadProgress(0)
        const downloadURL = await uploadStatusImage(file, (progress) => {
          setUploadProgress(progress)
        })
        setSelectedImage(downloadURL)
        setUploadProgress(100)
      } catch (error) {
        console.error("Error uploading status image:", error)
        setUploadProgress(0)
        addToast({
          title: "Upload Error",
          description: "Failed to upload the image. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleUpload = async () => {
    if (selectedImage) {
      try {
        const newStatus: Omit<AdminStatus, "id"> = {
          imageUrl: selectedImage,
          caption: caption || "No caption",
          timestamp: new Date().toISOString(),
        }
        const statusId = await addAdminStatus(newStatus)
        setStatuses((prev) => [{ ...newStatus, id: statusId }, ...prev])
        setSelectedImage(null)
        setCaption("")
        addToast({
          title: "Status uploaded",
          description: "Your new status has been successfully uploaded.",
        })
      } catch (error) {
        console.error("Error adding status:", error)
        addToast({
          title: "Error",
          description: "Failed to upload the status. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteStatus = async (id: string) => {
    try {
      await deleteAdminStatus(id)
      setStatuses((prev) => prev.filter((status) => status.id !== id))
      addToast({
        title: "Status deleted",
        description: "The status has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting status:", error)
      addToast({
        title: "Error",
        description: "Failed to delete the status. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Button variant="ghost" size="icon" className="text-[#aebac1]" onClick={() => setIsOpen(true)}>
        <Camera className="h-5 w-5" />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#111b21] border-none text-[#e9edef] max-w-md p-0">
          <DialogHeader className="bg-[#202c33] px-4 py-3 flex-row items-center justify-between">
            <DialogTitle>Status Management</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-[#aebac1] hover:text-[#e9edef]"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogHeader>
          <div className="p-4 space-y-4">
            {/* Image Upload Area */}
            <div className="relative aspect-video bg-[#202c33] rounded-lg overflow-hidden">
              {selectedImage ? (
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  alt="Status preview"
                  layout="fill"
                  objectFit="contain"
                />
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                  <Camera className="h-12 w-12 text-[#00a884] mb-2" />
                  <span className="text-[#8696a0]">Click to upload image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && <Progress value={uploadProgress} className="w-full" />}

            {/* Caption Input */}
            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption..."
              className="bg-[#2a3942] border-0 text-[#d1d7db] placeholder:text-[#8696a0] focus-visible:ring-0"
            />

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!selectedImage}
              className="w-full bg-[#00a884] hover:bg-[#02906f] text-white disabled:opacity-50"
            >
              Upload Status
            </Button>

            {/* Active Statuses */}
            {statuses.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-[#8696a0] text-sm">Active Statuses ({statuses.length})</h3>
                {statuses.map((status) => (
                  <div key={status.id} className="flex items-center gap-3 bg-[#202c33] p-3 rounded-lg">
                    <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src={status.imageUrl || "/placeholder.svg"}
                        alt={status.caption}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#e9edef] truncate">{status.caption}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#ef4444] hover:text-[#ef4444] hover:bg-[#ef444420] flex-shrink-0"
                      onClick={() => handleDeleteStatus(status.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

