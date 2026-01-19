"use client"

import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Bold,
    Italic,
    Strikethrough,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Code,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorToolbarProps {
    editor: Editor | null;
}

interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
}

const ToolbarButton = ({ onClick, isActive, disabled, children, title }: ToolbarButtonProps) => (
    <Button
        type="button"
        variant="ghost"
        size="iconSm"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={cn(
            "h-8 w-8 rounded-md transition-colors",
            isActive && "bg-secondary text-foreground"
        )}
    >
        {children}
    </Button>
);

export const EditorToolbar = ({ editor }: EditorToolbarProps) => {
    if (!editor) return null;

    return (
        <div className="flex items-center gap-1 p-2 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-0.5">
                <ToolbarButton
                    onClick={() => editor.chain().toggleMark("bold").run()}
                    isActive={editor.isActive("bold")}
                    title="Bold (Ctrl+B)"
                >
                    <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().toggleMark("italic").run()}
                    isActive={editor.isActive("italic")}
                    title="Italic (Ctrl+I)"
                >
                    <Italic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().toggleMark("strike").run()}
                    isActive={editor.isActive("strike")}
                    title="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().toggleMark("code").run()}
                    isActive={editor.isActive("code")}
                    title="Inline Code"
                >
                    <Code className="h-4 w-4" />
                </ToolbarButton>
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-0.5">
                <ToolbarButton
                    onClick={() => editor.chain().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                    title="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().toggleBlockquote().run()}
                    isActive={editor.isActive("blockquote")}
                    title="Quote"
                >
                    <Quote className="h-4 w-4" />
                </ToolbarButton>
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-0.5">
                <ToolbarButton
                    onClick={() => editor.chain().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Undo (Ctrl+Z)"
                >
                    <Undo className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Redo (Ctrl+Shift+Z)"
                >
                    <Redo className="h-4 w-4" />
                </ToolbarButton>
            </div>
        </div>
    );
};
