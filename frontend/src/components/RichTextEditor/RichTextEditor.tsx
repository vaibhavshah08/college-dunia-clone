import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { ListItem } from "@tiptap/extension-list-item";
import { Link } from "@tiptap/extension-link";
import { Underline } from "@tiptap/extension-underline";
import { Strike } from "@tiptap/extension-strike";
import { TextAlign } from "@tiptap/extension-text-align";
import {
  Box,
  Paper,
  Toolbar,
  IconButton,
  Divider,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  FormatListBulleted,
  FormatListNumbered,
  Link as LinkIcon,
  LinkOff,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
} from "@mui/icons-material";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter description...",
  minHeight = 200,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      BulletList.configure({
        HTMLAttributes: {
          class: "bullet-list",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "ordered-list",
        },
      }),
      ListItem,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "link",
        },
      }),
      Underline,
      Strike,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
        style: `min-height: ${minHeight}px; padding: 12px;`,
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 1,
        "&:hover": {
          borderColor: "#1976d2",
        },
        "&:focus-within": {
          borderColor: "#1976d2",
          borderWidth: 2,
        },
      }}
    >
      <Toolbar
        sx={{
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#f5f5f5",
          minHeight: "48px !important",
          px: 1,
        }}
      >
        {/* Text Formatting */}
        <Tooltip title="Bold">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleBold().run()}
            color={editor.isActive("bold") ? "primary" : "default"}
          >
            <FormatBold />
          </IconButton>
        </Tooltip>

        <Tooltip title="Italic">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            color={editor.isActive("italic") ? "primary" : "default"}
          >
            <FormatItalic />
          </IconButton>
        </Tooltip>

        <Tooltip title="Underline">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            color={editor.isActive("underline") ? "primary" : "default"}
          >
            <FormatUnderlined />
          </IconButton>
        </Tooltip>

        <Tooltip title="Strikethrough">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            color={editor.isActive("strike") ? "primary" : "default"}
          >
            <FormatStrikethrough />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Lists */}
        <Tooltip title="Bullet List">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            color={editor.isActive("bulletList") ? "primary" : "default"}
          >
            <FormatListBulleted />
          </IconButton>
        </Tooltip>

        <Tooltip title="Numbered List">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            color={editor.isActive("orderedList") ? "primary" : "default"}
          >
            <FormatListNumbered />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Links */}
        <Tooltip title="Add Link">
          <IconButton size="small" onClick={addLink}>
            <LinkIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Remove Link">
          <IconButton
            size="small"
            onClick={removeLink}
            disabled={!editor.isActive("link")}
          >
            <LinkOff />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Text Alignment */}
        <Tooltip title="Align Left">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            color={
              editor.isActive({ textAlign: "left" }) ? "primary" : "default"
            }
          >
            <FormatAlignLeft />
          </IconButton>
        </Tooltip>

        <Tooltip title="Align Center">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            color={
              editor.isActive({ textAlign: "center" }) ? "primary" : "default"
            }
          >
            <FormatAlignCenter />
          </IconButton>
        </Tooltip>

        <Tooltip title="Align Right">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            color={
              editor.isActive({ textAlign: "right" }) ? "primary" : "default"
            }
          >
            <FormatAlignRight />
          </IconButton>
        </Tooltip>

        <Tooltip title="Justify">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            color={
              editor.isActive({ textAlign: "justify" }) ? "primary" : "default"
            }
          >
            <FormatAlignJustify />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Heading Level */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Heading</InputLabel>
          <Select
            value={editor.getAttributes("heading").level || "paragraph"}
            onChange={(e) => {
              const level = e.target.value;
              if (level === "paragraph") {
                editor.chain().focus().setParagraph().run();
              } else {
                editor
                  .chain()
                  .focus()
                  .toggleHeading({
                    level: parseInt(level) as 1 | 2 | 3 | 4 | 5 | 6,
                  })
                  .run();
              }
            }}
            label="Heading"
          >
            <MenuItem value="paragraph">Paragraph</MenuItem>
            <MenuItem value="1">Heading 1</MenuItem>
            <MenuItem value="2">Heading 2</MenuItem>
            <MenuItem value="3">Heading 3</MenuItem>
            <MenuItem value="4">Heading 4</MenuItem>
          </Select>
        </FormControl>
      </Toolbar>

      <Box
        sx={{
          "& .ProseMirror": {
            outline: "none",
            minHeight: `${minHeight}px`,
            padding: 2,
            "& p.is-editor-empty:first-child::before": {
              content: `"${placeholder}"`,
              float: "left",
              color: "#adb5bd",
              pointerEvents: "none",
              height: 0,
            },
            "& ul, & ol": {
              paddingLeft: "1.5rem",
            },
            "& li": {
              marginBottom: "0.25rem",
            },
            "& a": {
              color: "#1976d2",
              textDecoration: "underline",
              "&:hover": {
                textDecoration: "none",
              },
            },
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              marginTop: "1rem",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            },
            "& h1": { fontSize: "1.875rem" },
            "& h2": { fontSize: "1.5rem" },
            "& h3": { fontSize: "1.25rem" },
            "& h4": { fontSize: "1.125rem" },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  );
};

export default RichTextEditor;
