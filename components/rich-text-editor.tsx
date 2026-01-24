"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Undo2,
  Redo2,
} from "lucide-react"
import { Label } from "@/components/ui/label"

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  label: string
  placeholder?: string
  required?: boolean
}

export function RichTextEditor({ value, onChange, label, placeholder, required = false }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false })],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run()
  const toggleItalic = () => editor.chain().focus().toggleItalic().run()
  const toggleHeading2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run()
  const toggleHeading3 = () => editor.chain().focus().toggleHeading({ level: 3 }).run()
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run()
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run()

  const setLink = () => {
    const url = window.prompt("Enter URL:")
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }
  }

  const isActive = (name: string) => {
    switch (name) {
      case "bold":
        return editor.isActive("bold")
      case "italic":
        return editor.isActive("italic")
      case "h2":
        return editor.isActive("heading", { level: 2 })
      case "h3":
        return editor.isActive("heading", { level: 3 })
      case "bullet":
        return editor.isActive("bulletList")
      case "ordered":
        return editor.isActive("orderedList")
      default:
        return false
    }
  }

  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted p-2 flex flex-wrap gap-1 border-b">
          <Button
            type="button"
            size="sm"
            variant={isActive("bold") ? "default" : "outline"}
            onClick={toggleBold}
            title="Bold"
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={isActive("italic") ? "default" : "outline"}
            onClick={toggleItalic}
            title="Italic"
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <div className="border-l border-muted-foreground/30 mx-1" />
          <Button
            type="button"
            size="sm"
            variant={isActive("h2") ? "default" : "outline"}
            onClick={toggleHeading2}
            title="Heading 2"
            className="h-8 w-8 p-0"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={isActive("h3") ? "default" : "outline"}
            onClick={toggleHeading3}
            title="Heading 3"
            className="h-8 w-8 p-0"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          <div className="border-l border-muted-foreground/30 mx-1" />
          <Button
            type="button"
            size="sm"
            variant={isActive("bullet") ? "default" : "outline"}
            onClick={toggleBulletList}
            title="Bullet List"
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={isActive("ordered") ? "default" : "outline"}
            onClick={toggleOrderedList}
            title="Numbered List"
            className="h-8 w-8 p-0"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <div className="border-l border-muted-foreground/30 mx-1" />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={setLink}
            title="Add Link"
            className="h-8 w-8 p-0"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <div className="border-l border-muted-foreground/30 mx-1" />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
            className="h-8 w-8 p-0"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
            className="h-8 w-8 p-0"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none focus:outline-none p-3 min-h-48 [&>div]:focus:outline-none"
        />
      </div>
      <p className="text-xs text-muted-foreground">{placeholder}</p>
    </div>
  )
}
