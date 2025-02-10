"use client"

import { useState } from "react"
import { X, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { CategoryManagementDialogProps, Category } from "@/types/interfaces"

export function CategoryManagementDialog({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  isOpen,
  onClose,
}: CategoryManagementDialogProps) {
  const [newCategory, setNewCategory] = useState({ name: "", color: "#000000" })
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const handleAddCategory = () => {
    if (newCategory.name) {
      onAddCategory({ ...newCategory, id: Date.now().toString() })
      setNewCategory({ name: "", color: "#000000" })
    }
  }

  const handleEditCategory = () => {
    if (editingCategory && editingCategory.name) {
      onEditCategory(editingCategory)
      setEditingCategory(null)
    }
  }

  const handleDeleteCategory = (categoryId: string) => {
    onDeleteCategory(categoryId)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#111b21] border-none text-[#e9edef]">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Input
              placeholder="Category Name"
              value={editingCategory ? editingCategory.name : newCategory.name}
              onChange={(e) =>
                editingCategory
                  ? setEditingCategory({ ...editingCategory, name: e.target.value })
                  : setNewCategory({ ...newCategory, name: e.target.value })
              }
              className="bg-[#2a3942] border-0 text-[#d1d7db] placeholder:text-[#8696a0]"
            />
            <div className="flex items-center space-x-2">
              <label htmlFor="color" className="text-sm">
                Color:
              </label>
              <input
                type="color"
                id="color"
                value={editingCategory ? editingCategory.color : newCategory.color}
                onChange={(e) =>
                  editingCategory
                    ? setEditingCategory({ ...editingCategory, color: e.target.value })
                    : setNewCategory({ ...newCategory, color: e.target.value })
                }
                className="w-8 h-8 rounded"
              />
            </div>
          </div>
          <Button
            onClick={editingCategory ? handleEditCategory : handleAddCategory}
            className="w-full bg-[#00a884] hover:bg-[#02906f] text-white"
          >
            {editingCategory ? "Update Category" : "Add Category"}
          </Button>
          {editingCategory && (
            <Button
              onClick={() => setEditingCategory(null)}
              className="w-full bg-[#3a4a53] hover:bg-[#2a3942] text-white"
            >
              Cancel Editing
            </Button>
          )}
        </div>
        <div className="space-y-2 mt-4">
          <h3 className="text-lg font-semibold">Existing Categories</h3>
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-2 rounded"
              style={{ backgroundColor: category.color + "20" }}
            >
              <span className="font-medium" style={{ color: category.color }}>
                {category.name}
              </span>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => setEditingCategory(category)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

