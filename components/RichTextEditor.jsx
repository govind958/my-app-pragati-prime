"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button1";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Link as LinkIcon
} from "lucide-react";

export default function RichTextEditor({ value, onChange, id = "content" }) {
  const editorRef = useRef(null);
  const textareaRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Sync contentEditable with value prop (only if not focused to avoid conflicts)
    if (editorRef.current && !isFocused) {
      const currentContent = editorRef.current.innerHTML;
      const newValue = value || "";
      if (currentContent !== newValue) {
        editorRef.current.innerHTML = newValue;
      }
    }
  }, [value, isFocused]);

  const handleInput = () => {
    if (editorRef.current && textareaRef.current) {
      const html = editorRef.current.innerHTML;
      // Update hidden textarea
      textareaRef.current.value = html;
      // Trigger onChange - use "content" as name to match form expectations
      if (onChange) {
        onChange({
          target: {
            name: "content",
            value: html
          }
        });
      }
    }
  };

  const executeCommand = (command, value = null, evt = null) => {
    if (evt) {
      evt.preventDefault();
    }
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    // Small delay to ensure command is executed before reading content
    setTimeout(handleInput, 10);
  };

  const insertHTML = (html) => {
    document.execCommand("insertHTML", false, html);
    editorRef.current?.focus();
    setTimeout(handleInput, 10);
  };

  const handleLink = (evt) => {
    evt.preventDefault();
    const url = prompt("Enter URL:");
    if (url) {
      const selection = window.getSelection();
      const selectedText = selection.toString();
      if (selectedText) {
        insertHTML(`<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText}</a>`);
      } else {
        insertHTML(`<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
      }
    }
  };

  return (
    <div className="border border-input rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="border-b border-border bg-muted/50 p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => executeCommand("bold", null, e)}
          title="Bold (Ctrl+B)"
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => executeCommand("italic", null, e)}
          title="Italic (Ctrl+I)"
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => executeCommand("underline", null, e)}
          title="Underline (Ctrl+U)"
          className="h-8 w-8 p-0"
        >
          <Underline className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => executeCommand("formatBlock", "<h1>", e)}
          title="Heading 1"
          className="h-8 w-8 p-0"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => executeCommand("formatBlock", "<h2>", e)}
          title="Heading 2"
          className="h-8 w-8 p-0"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => executeCommand("insertUnorderedList", null, e)}
          title="Bullet List"
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => executeCommand("insertOrderedList", null, e)}
          title="Numbered List"
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => executeCommand("formatBlock", "<blockquote>", e)}
          title="Quote"
          className="h-8 w-8 p-0"
        >
          <Quote className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => executeCommand("justifyLeft", null, e)}
          title="Align Left"
          className="h-8 w-8 p-0"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => executeCommand("justifyCenter", null, e)}
          title="Align Center"
          className="h-8 w-8 p-0"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => executeCommand("justifyRight", null, e)}
          title="Align Right"
          className="h-8 w-8 p-0"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleLink}
          title="Insert Link"
          className="h-8 w-8 p-0"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          id={`editor-${id}`}
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            handleInput();
          }}
          className="min-h-[400px] p-4 focus:outline-none [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-5 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-3 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3 [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80"
          style={{
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            overflowY: "auto"
          }}
          suppressContentEditableWarning={true}
        />
        
        {/* Hidden textarea for form submission */}
        <textarea
          ref={textareaRef}
          name={id}
          id={id}
          value={value || ""}
          onChange={onChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

