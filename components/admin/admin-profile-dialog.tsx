"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Edit2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { BaseDialog } from "@/components/shared/base-dialog"
import { updateAdminProfile, uploadProfilePicture } from "@/lib/firestore"
import type { AdminProfileDialogProps } from "@/types/interfaces"
import { Progress } from "@/components/ui/progress"
import type React from "react" // Added import for React

export function AdminProfileDialog({ profile, onUpdate, children }: AdminProfileDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(profile.name)
  const [about, setAbout] = useState(profile.about || "Hey there! I am using WhatsApp")
  const [avatar, setAvatar] = useState(profile.avatar)
  const [isEditing, setIsEditing] = useState({ name: false, about: false })
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    setName(profile.name)
    setAbout(profile.about || "Hey there! I am using WhatsApp")
    setAvatar(profile.avatar)
  }, [profile])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0]
        setUploadProgress(0)
        const downloadURL = await uploadProfilePicture(file, (progress) => {
          setUploadProgress(progress)
        })
        setAvatar(downloadURL)
        setUploadProgress(100)
      } catch (error) {
        console.error("Error uploading profile picture:", error)
        setUploadProgress(0)
      }
    }
  }

  const handleSave = async () => {
    try {
      await updateAdminProfile({ name, about, avatar })
      onUpdate(name, avatar, about)
      setIsOpen(false)
      setIsEditing({ name: false, about: false })
    } catch (error) {
      console.error("Error updating admin profile:", error)
    }
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      <BaseDialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Profile Settings">
        <div className="flex justify-center">
          <div className="relative">
            <Avatar className="h-32 w-32">
              <AvatarImage src={avatar} />
              <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-[#00a884] rounded-full p-2 cursor-pointer hover:bg-[#02906f]"
            >
              <Camera className="h-5 w-5 text-white" />
              <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && <Progress value={uploadProgress} className="w-full mt-2" />}

        <div className="space-y-1">
          <label className="text-xs text-[#8696a0] uppercase">Your Name</label>
          <div className="flex items-center gap-2 bg-[#202c33] rounded-lg p-3">
            {isEditing.name ? (
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent border-0 text-[#d1d7db] placeholder:text-[#8696a0] focus-visible:ring-0 p-0"
                autoFocus
              />
            ) : (
              <span className="flex-1">{name}</span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-[#00a884]"
              onClick={() => setIsEditing({ ...isEditing, name: !isEditing.name })}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-[#8696a0] uppercase">About</label>
          <div className="flex items-start gap-2 bg-[#202c33] rounded-lg p-3">
            {isEditing.about ? (
              <Textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="bg-transparent border-0 text-[#d1d7db] placeholder:text-[#8696a0] focus-visible:ring-0 p-0 min-h-[60px]"
                autoFocus
              />
            ) : (
              <span className="flex-1">{about}</span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-[#00a884]"
              onClick={() => setIsEditing({ ...isEditing, about: !isEditing.about })}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full bg-[#00a884] hover:bg-[#02906f] text-white">
          Save
        </Button>
      </BaseDialog>
    </>
  )
}

