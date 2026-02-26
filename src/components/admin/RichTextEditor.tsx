"use client";

import { useCallback, useRef, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { upload } from "@vercel/blob/client";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// --- Toolbar button helper ---
function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded text-sm transition-colors ${
        active
          ? "bg-primary text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}

// --- Divider ---
function Divider() {
  return <div className="w-px h-6 bg-gray-200 mx-0.5 self-center" />;
}

// --- Icon: use material symbols text for common actions ---
function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span
      className={`material-symbols-outlined text-[18px] leading-none select-none ${className}`}
    >
      {name}
    </span>
  );
}

// --- Link Dialog ---
function LinkDialog({
  editor,
  onClose,
}: {
  editor: Editor;
  onClose: () => void;
}) {
  const currentUrl = editor.getAttributes("link").href || "";
  const [url, setUrl] = useState(currentUrl);

  function apply() {
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url.trim(), target: "_blank" })
        .run();
    }
    onClose();
  }

  function remove() {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-96 max-w-[90vw]">
        <h3 className="font-semibold text-primary mb-4">Bağlantı Ekle</h3>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL
        </label>
        <input
          autoFocus
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          placeholder="https://ornek.com"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mb-4"
        />
        <div className="flex justify-between">
          {currentUrl && (
            <button
              type="button"
              onClick={remove}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Bağlantıyı Kaldır
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={apply}
              className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
            >
              Uygula
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Image Dialog ---
function ImageDialog({
  editor,
  onClose,
}: {
  editor: Editor;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"url" | "upload">("url");
  const [url, setUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function insertImage(src: string) {
    editor
      .chain()
      .focus()
      .setImage({ src, alt: altText || "" })
      .run();
    onClose();
  }

  function applyUrl() {
    if (!url.trim()) return;
    insertImage(url.trim());
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const blob = await upload(`editor/${Date.now()}-${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
      });
      insertImage(blob.url);
    } catch {
      setUploadError("Yükleme başarısız, tekrar deneyin.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[420px] max-w-[90vw]">
        <h3 className="font-semibold text-primary mb-4">Görsel Ekle</h3>

        <div className="flex gap-2 mb-4 border-b border-gray-100">
          <button
            type="button"
            onClick={() => setTab("url")}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
              tab === "url"
                ? "border-primary text-primary"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            URL ile
          </button>
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
              tab === "upload"
                ? "border-primary text-primary"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Yükle
          </button>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alt Metin (İsteğe bağlı)
        </label>
        <input
          type="text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Görseli açıklayan metin"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mb-4"
        />

        {tab === "url" ? (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Görsel URL
            </label>
            <input
              autoFocus
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyUrl()}
              placeholder="https://ornek.com/gorsel.jpg"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mb-4"
            />
          </>
        ) : (
          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full py-8 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/40 transition-colors"
            >
              {uploading ? (
                <>
                  <Icon name="sync" className="animate-spin text-primary" />
                  <span className="text-sm text-gray-500">Yükleniyor...</span>
                </>
              ) : (
                <>
                  <Icon name="cloud_upload" className="text-gray-400 text-3xl" />
                  <span className="text-sm text-gray-500">
                    Görsel seçmek için tıklayın
                  </span>
                </>
              )}
            </button>
            {uploadError && (
              <p className="text-xs text-red-500 mt-1">{uploadError}</p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            İptal
          </button>
          {tab === "url" && (
            <button
              type="button"
              onClick={applyUrl}
              disabled={!url.trim()}
              className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-40"
            >
              Ekle
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Toolbar ---
function Toolbar({
  editor,
}: {
  editor: Editor;
}) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  const setHeading = useCallback(
    (level: 1 | 2 | 3 | 4) => {
      editor.chain().focus().toggleHeading({ level }).run();
    },
    [editor]
  );

  const currentHeading = [1, 2, 3, 4].find((l) =>
    editor.isActive("heading", { level: l })
  );

  return (
    <>
      {showLinkDialog && (
        <LinkDialog editor={editor} onClose={() => setShowLinkDialog(false)} />
      )}
      {showImageDialog && (
        <ImageDialog editor={editor} onClose={() => setShowImageDialog(false)} />
      )}

      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        {/* Undo / Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Geri Al (Ctrl+Z)"
        >
          <Icon name="undo" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="İleri Al (Ctrl+Shift+Z)"
        >
          <Icon name="redo" />
        </ToolbarButton>

        <Divider />

        {/* Heading dropdown */}
        <select
          value={currentHeading ?? "p"}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "p") {
              editor.chain().focus().setParagraph().run();
            } else {
              setHeading(Number(val) as 1 | 2 | 3 | 4);
            }
          }}
          className="text-sm border border-gray-200 rounded px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          title="Başlık"
        >
          <option value="p">Paragraf</option>
          <option value="1">Başlık 1</option>
          <option value="2">Başlık 2</option>
          <option value="3">Başlık 3</option>
          <option value="4">Başlık 4</option>
        </select>

        <Divider />

        {/* Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Kalın (Ctrl+B)"
        >
          <Icon name="format_bold" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="İtalik (Ctrl+I)"
        >
          <Icon name="format_italic" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Altı Çizili (Ctrl+U)"
        >
          <Icon name="format_underlined" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Üstü Çizili"
        >
          <Icon name="strikethrough_s" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()
          }
          active={editor.isActive("highlight")}
          title="Vurgula"
        >
          <Icon name="highlight" />
        </ToolbarButton>

        <Divider />

        {/* Text align */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Sola Hizala"
        >
          <Icon name="format_align_left" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Ortala"
        >
          <Icon name="format_align_center" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Sağa Hizala"
        >
          <Icon name="format_align_right" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          active={editor.isActive({ textAlign: "justify" })}
          title="Hizala"
        >
          <Icon name="format_align_justify" />
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Madde İşaretli Liste"
        >
          <Icon name="format_list_bulleted" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numaralı Liste"
        >
          <Icon name="format_list_numbered" />
        </ToolbarButton>

        <Divider />

        {/* Quote & Code */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Alıntı"
        >
          <Icon name="format_quote" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Satır İçi Kod"
        >
          <Icon name="code" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Kod Bloğu"
        >
          <Icon name="data_object" />
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <ToolbarButton
          onClick={() => setShowLinkDialog(true)}
          active={editor.isActive("link")}
          title="Bağlantı Ekle/Düzenle"
        >
          <Icon name="link" />
        </ToolbarButton>

        {/* Image */}
        <ToolbarButton
          onClick={() => setShowImageDialog(true)}
          title="Görsel Ekle"
        >
          <Icon name="image" />
        </ToolbarButton>

        <Divider />

        {/* HR */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Yatay Çizgi"
        >
          <Icon name="horizontal_rule" />
        </ToolbarButton>

        {/* Clear formatting */}
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          title="Biçimi Temizle"
        >
          <Icon name="format_clear" />
        </ToolbarButton>
      </div>
    </>
  );
}

// --- Main Editor ---
export default function RichTextEditor({
  value,
  onChange,
  placeholder = "İçeriğinizi buraya yazın...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[280px] p-4 text-gray-800",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  const charCount = editor.storage.characterCount.characters();
  const wordCount = editor.storage.characterCount.words();

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-colors">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <div className="flex justify-end items-center gap-4 px-4 py-1.5 border-t border-gray-100 bg-gray-50/50">
        <span className="text-xs text-gray-400">
          {wordCount} kelime · {charCount} karakter
        </span>
      </div>
    </div>
  );
}
