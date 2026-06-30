"use client";

import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Placeholder from "@tiptap/extension-placeholder";
import TurndownService from "turndown";

// Highlight + Lowlight
import { common, createLowlight } from "lowlight";
const lowlight = createLowlight(common);

import { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatQuote,
  MdCode,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdLink,
  MdTableChart,
} from "react-icons/md";
import {
  Dialog,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { v4 as uuid } from "uuid";
import {
  AlertCircle,
  Archive,
  ArrowLeft,
  CheckCircle,
  ChevronDownIcon,
  Copy,
  ImageIcon,
  LayoutDashboard,
  PenBox,
  PencilIcon,
  PlusCircle,
  Save,
  Send,
  Trash,
  Trash2,
  TrashIcon,
  X,
  XCircle,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuList,
} from "@headlessui/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { blogCategories, blogSubCategoriesList } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/dbConfig";
import { Blogs } from "@/lib/schema";
import { getISTDate } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "../ImageUpload";
import NextImage from "next/image";
import CodeBlockComponent from "./EditorCodeBlock";
import ImageKit from "imagekit-javascript";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { ModeToggle } from "../theme-btn";
import { useRouter } from "next/navigation";

const MenuBar = ({ editor }) => {
  const imageInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  // useEffect(() => {
  //   const handleKeyDown = (e) => {
  //     const mod = isMac ? e.metaKey : e.ctrlKey;

  //     if (!editor) return;

  //     // Headings H1, H2, H3
  //     if (mod && e.altKey && e.key === "1") {
  //       e.preventDefault();
  //       editor.chain().focus().toggleHeading({ level: 1 }).run();
  //     } else if (mod && e.altKey && e.key === "2") {
  //       e.preventDefault();
  //       editor.chain().focus().toggleHeading({ level: 2 }).run();
  //     } else if (mod && e.altKey && e.key === "3") {
  //       e.preventDefault();
  //       editor.chain().focus().toggleHeading({ level: 3 }).run();
  //     }

  //     // Bullet List
  //     else if (mod && e.shiftKey && e.key === "8") {
  //       e.preventDefault();
  //       editor.chain().focus().toggleBulletList().run();
  //     }

  //     // Numbered List
  //     else if (mod && e.shiftKey && e.key === "7") {
  //       e.preventDefault();
  //       editor.chain().focus().toggleOrderedList().run();
  //     }

  //     // Bold
  //     else if (mod && e.key.toLowerCase() === "b") {
  //       e.preventDefault();
  //       editor.chain().focus().toggleBold().run();
  //     }

  //     // Italic
  //     else if (mod && e.key.toLowerCase() === "i") {
  //       e.preventDefault();
  //       editor.chain().focus().toggleItalic().run();
  //     }

  //     // Blockquote
  //     else if (mod && e.shiftKey && e.key.toLowerCase() === "b") {
  //       e.preventDefault();
  //       editor.chain().focus().toggleBlockquote().run();
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => window.removeEventListener("keydown", handleKeyDown);
  // }, []);

  if (!editor) return null;

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    const auth = await fetch("/api/upload-auth").then((res) => res.json());

    const imagekit = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
      urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT,
      authenticationEndpoint: "",
    });

    toast.info("Uploading image... Please wait.");

    imagekit.upload(
      {
        file,
        fileName: file.name,
        useUniqueFileName: true,
        folder: "/editor-images",
        token: auth.token,
        signature: auth.signature,
        expire: auth.expire,
      },
      async (err, result) => {
        if (err) {
          console.error("ImageKit upload error:", err);
          toast.error("Image upload failed");
        } else {
          editor.chain().focus().setImage({ src: result.url }).run();
          try {
            const res = await fetch("/api/save-upload", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                url: result.url,
                fileId: result.fileId,
              }),
            });

            if (!res.ok) throw new Error("Failed to save image in DB");
          } catch (err) {
            console.error("Failed to save to DB:", err);
            toast.warning("Image uploaded, but DB save failed.");
          }
          toast.success("Image added to editor");
        }
      },
    );
  };

  const insertLink = () => {
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
      setOpen(false);
      setUrl("");
    }
  };

  const buttonStyle = (isActive) =>
    `text-sm p-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
      isActive
        ? "bg-blue-500 text-white shadow-sm shadow-blue-500/20 dark:bg-blue-600"
        : "text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white"
    }`;

  return (
    <div className="sticky top-0 flex flex-wrap items-center justify-between rounded-t-3xl gap-2 border border-slate-200 dark:border-slate-800 p-3 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 z-30 shadow-sm">
      <div className="hidden xl:flex w-full gap-2 items-center justify-between">
        <div className="flex items-center space-x-1">
          {[1, 2, 3].map((level) => (
            <TooltipProvider key={level}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    key={level}
                    className={`${buttonStyle(
                      editor.isActive("heading", { level }),
                    )} font-bold w-9 h-9 text-xs`}
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level }).run()
                    }
                  >
                    H{level}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Heading {level}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}

          <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={buttonStyle(editor.isActive("bulletList"))}
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                >
                  <MdFormatListBulleted size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bullet List</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={buttonStyle(editor.isActive("orderedList"))}
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                >
                  <MdFormatListNumbered size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Numbered List</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={buttonStyle(editor.isActive("bold"))}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                >
                  <MdFormatBold size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bold</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={buttonStyle(editor.isActive("italic"))}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                  <MdFormatItalic size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Italics</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={buttonStyle(editor.isActive("blockquote"))}
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                >
                  <MdFormatQuote size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Quote</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={buttonStyle(editor.isActive("codeBlock"))}
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                >
                  <MdCode size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Code Block</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={buttonStyle(editor.isActive("table"))}
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                      .run()
                  }
                >
                  <MdTableChart size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Table</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={buttonStyle(editor.isActive("link"))}
                  onClick={() => setOpen(true)}
                >
                  <MdLink size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Link</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={buttonStyle(editor.isActive("image"))}
                  onClick={() => imageInputRef.current?.click()}
                >
                  <ImageIcon size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Clear Button */}
        <button 
          onClick={() => editor.commands.clearContent(true)}
          className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-650 transition-colors flex items-center justify-center"
          title="Clear content"
        >
          <Trash size={18} />
        </button>
      </div>

      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Link Insert Dialog */}
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(false);
          setUrl("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>
            <Button onClick={insertLink}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* TOOLBAR: Directly Shown Items */}
      <div className="flex xl:hidden items-center justify-between w-full gap-4">
        <div className="flex items-center">
          <div className="flex gap-2 items-center flex-wrap">
            {/* H1, H2 (Mobile+) */}
            {[1, 2].map((level) => (
              <TooltipProvider key={level}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      key={level}
                      className={buttonStyle(
                        editor.isActive("heading", { level }),
                      )}
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level }).run()
                      }
                    >
                      H{level}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Heading {level}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}

            {/* H3, Bullet List, Numbered List (Tablet+) */}
            <div className="hidden md:flex xl:hidden gap-2">
              <button
                className={buttonStyle(
                  editor.isActive("heading", { level: 3 }),
                )}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
              >
                H3
              </button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={buttonStyle(editor.isActive("bulletList"))}
                      onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                      }
                    >
                      <MdFormatListBulleted size={20} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bullet List</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={buttonStyle(editor.isActive("orderedList"))}
                      onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                      }
                    >
                      <MdFormatListNumbered size={20} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Numbered List</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* MENU: Shown on Mobile & Tablet */}
          <div className="xl:hidden flex">
            <Menu>
              <MenuButton className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors">
                Formatting
                <ChevronDownIcon className="size-4 text-slate-500" />
              </MenuButton>

              <MenuItems
                transition
                anchor="bottom end"
                className="w-56 mt-2 origin-top-right rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl p-1.5 shadow-xl focus:outline-none z-40"
              >
                {/* Bullet List */}
                <MenuItem className="flex md:hidden">
                  <button
                    className="group flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl text-slate-700 dark:text-slate-200 transition-colors"
                    onClick={() =>
                      editor.chain().focus().toggleBulletList().run()
                    }
                  >
                    <MdFormatListBulleted className="text-lg" /> Bullet
                  </button>
                </MenuItem>

                {/* Numbered List */}
                <MenuItem className="flex md:hidden">
                  <button
                    className="group flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl text-slate-700 dark:text-slate-200 transition-colors"
                    onClick={() =>
                      editor.chain().focus().toggleOrderedList().run()
                    }
                  >
                    <MdFormatListNumbered className="text-lg" /> Numbered
                  </button>
                </MenuItem>
                {/* Bold */}
                <MenuItem>
                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className="group flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <MdFormatBold className="text-lg" /> Bold
                  </button>
                </MenuItem>

                {/* Italic */}
                <MenuItem>
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className="group flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <MdFormatItalic className="text-lg" /> Italic
                  </button>
                </MenuItem>

                {/* Blockquote */}
                <MenuItem>
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleBlockquote().run()
                    }
                    className="group flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <MdFormatQuote className="text-lg" /> Quote
                  </button>
                </MenuItem>

                {/* Code Block */}
                <MenuItem>
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleCodeBlock().run()
                    }
                    className="group flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <MdCode className="text-lg" /> Code Block
                  </button>
                </MenuItem>

                {/* Table */}
                <MenuItem>
                  <button
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                        .run()
                    }
                    className="group flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <MdTableChart className="text-lg" /> Table
                  </button>
                </MenuItem>

                {/* Link */}
                <MenuItem>
                  <button
                    onClick={() => setOpen(true)}
                    className="group flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <MdLink className="text-lg" /> Link
                  </button>
                </MenuItem>

                {/* Image */}
                <MenuItem>
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="group flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <ImageIcon className="text-lg" /> Image
                  </button>
                </MenuItem>

                <div className="my-1 h-px bg-slate-200 dark:bg-slate-800 flex md:hidden" />
                <MenuItem className="flex md:hidden">
                  <button
                    onClick={() => editor.commands.clearContent(true)}
                    className="group flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
                  >
                    <Trash className="text-lg" /> Delete
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
        <button 
          onClick={() => editor.commands.clearContent(true)}
          className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-650 transition-colors flex items-center justify-center"
          title="Clear content"
        >
          <Trash size={18} />
        </button>
      </div>
    </div>
  );
};

export default function BlogEditor({
  initialTitle = "",
  initialDescription = "",
  initialCategory = "",
  initialSubCategories = [],
  initialTags = [],
  initialContent = "",
  initialCoverImageURL = null,
  initialfileId = null,
  editing = false,
}) {
  const router = useRouter();
  const [title, setTitle] = useState(editing ? initialTitle : "");
  const [description, setDescription] = useState(
    editing ? initialDescription : "",
  );
  const [content, setContent] = useState("");
  const [uploadData, setUploadData] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [unfinishedBlog, setUnfinishedBlog] = useState(false);
  const [editBlogCoverImageURL, setEditBlogCoverImageURL] = useState(
    editing ? initialCoverImageURL : null,
  );
  const [editBlogCoverImageId, setEditBlogCoverImageId] = useState(
    editing ? initialfileId : null,
  );
  const [editCoverImage, setEditCoverImage] = useState(editing ? true : false);
  const [category, setCategory] = useState(
    editing ? initialCategory.toLowerCase() : blogCategories[0],
  );
  const [selectedSubCategories, setSelectedSubCategories] = useState(
    editing ? initialSubCategories : [],
  );
  const selectedCount = selectedSubCategories
    ? selectedSubCategories.length
    : 0;

  const [tags, setTags] = useState(editing ? initialTags : []);
  const [tag, setTag] = useState("");
  const [errors, setErrors] = useState({});

  const { user } = useUser();
  const previousImagesRef = useRef([]);

  // Generate a unique key for current blog's pending content
  const storageKey = `pendingBlogData-${user?.id}`;

  const [screenSize, setScreenSize] = useState("");

  // Update state based on window width
  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      if (width <= 640)
        setScreenSize("sm"); // Mobile
      else if (width <= 768)
        setScreenSize("md"); // iPad Mini
      else if (width <= 1024)
        setScreenSize("lg"); // iPad Air/Pro
      else if (width <= 1280)
        setScreenSize("xl"); // Desktop
      else setScreenSize("2xl"); // Large Desktop
    };

    checkScreen(); // Run on mount
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Character limit based on screen size
  const limit = (() => {
    switch (screenSize) {
      case "sm": // Mobile
        return 7;
      case "md": // iPad Mini
        return 18;
      case "lg": // iPad Air/Pro
        return 24;
      case "xl": // Normal desktop
        return 30;
      case "2xl": // Big desktop
        return 40;
      default:
        return 30;
    }
  })();

  useEffect(() => {
    if (!editor) return;

    const storedBlogData = JSON.parse(localStorage.getItem(storageKey) || "{}");
    if (
      (storedBlogData.title ||
        storedBlogData.content ||
        storedBlogData.fileId ||
        storedBlogData.uploadData ||
        storedBlogData.category ||
        storedBlogData.subcategories ||
        storedBlogData.description) &&
      !editing
    ) {
      console.log("Stored blog data found:", storedBlogData.content);
      setTitle(storedBlogData.title || "");
      setDescription(storedBlogData.description || "");
      setUploadData(storedBlogData.uploadData || "");
      setFileId(storedBlogData.fileId || "");
      setContent(storedBlogData?.content || "");
      editor.commands.setContent(storedBlogData?.content || "<p></p>");
      setCategory(storedBlogData.category || blogCategories[0]);
      setSelectedSubCategories(storedBlogData.subcategories || []);
      setTags(storedBlogData.tags || []);
      setUnfinishedBlog(true);
    }
  }, [storageKey]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Placeholder.configure({ placeholder: "Start writing your blog here..." }),
      Document,
      Paragraph,
      Text,
      Link,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
    ],
    content: content,
    onCreate({ editor }) {
      // The editor is ready.
      if (content && unfinishedBlog) {
        editor.commands.setContent(content); // false = no history entry
        console.log("content", content);
        previousImagesRef.current = getImageUrlsFromHTML(content);
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none p-6 min-h-[400px] bg-white/50 dark:bg-slate-950/20 outline-none",
      },
    },
    onUpdate: async ({ editor }) => {
      const html = editor.getHTML();
      console.log("Updated HTML:", html);
      setContent(html);
      handleInputChange("content", html);

      const currentImages = getImageUrlsFromHTML(html);
      const previousImages = previousImagesRef.current;

      const deletedImages = previousImages.filter(
        (url) => !currentImages.includes(url),
      );

      for (const url of deletedImages) {
        console.log("Deleting image from DB:", url);
        try {
          toast.info("Deleting image from DB... Please wait.");
          const res = await fetch("/api/editor-image/fetch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
          });

          const { fileId } = await res.json();

          // Try deleting from ImageKit
          const imageKitDeleteSuccess = await deleteEditorImage(fileId, url);

          if (!imageKitDeleteSuccess) {
            // Reinstate in the editor
            editor.chain().focus().setImage({ src: url }).run();

            toast.error("Deletion failed — image added back to editor.");
            continue;
          }

          toast.success("Image Deleted from DB");
        } catch (error) {
          console.log("Failed to delete image:", url, error);
        }
      }

      previousImagesRef.current = currentImages;
    },
  });

  const getImageUrlsFromHTML = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const imgs = tempDiv.querySelectorAll("img");
    return Array.from(imgs).map((img) => img.src);
  };

  const deleteEditorImage = async (fileId, url) => {
    if (!fileId) return false;

    try {
      const res = await fetch("/api/delete-image", {
        method: "POST",
        body: JSON.stringify({ fileId }),
      });

      const res1 = await fetch("/api/editor-image/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok || !res1.ok) {
        console.error("One of the delete operations failed", {
          imageKit: await res.text(),
          db: await res1.text(),
        });
        return false;
      }

      console.log("Deleted file:", fileId);
      return true;
    } catch (err) {
      console.error("Delete failed", err);
      return false;
    }
  };

  const AddBlog = async () => {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // remove all non-alphanumeric characters except space/hyphen
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/-+/g, "-"); // collapse multiple hyphens

    const turndownService = new TurndownService({ headingStyle: "atx" });

    // ✅ Add custom rule for code blocks with language
    turndownService.addRule("fencedCodeBlockWithLang", {
      filter: (node) =>
        node.nodeName === "PRE" &&
        node.firstChild &&
        node.firstChild.nodeName === "CODE",
      replacement: (content, node) => {
        const codeNode = node.firstChild;
        const language = (codeNode.getAttribute("class") || "")
          .replace("language-", "")
          .trim();

        return `\n\n\`\`\`${language || ""}\n${
          codeNode.textContent
        }\n\`\`\`\n\n`;
      },
    });

    // Add rule for converting HTML tables to Markdown
    turndownService.addRule("table", {
      filter: "table",
      replacement: function (content, node) {
        const rows = Array.from(node.querySelectorAll("tr"));
        const tableData = rows.map((row) =>
          Array.from(row.children).map((cell) => cell.textContent.trim()),
        );

        if (tableData.length === 0) return "";

        const header = tableData[0];
        const separator = header.map(() => "---");
        const body = tableData.slice(1);

        const formatRow = (row) => `| ${row.join(" | ")} |`;

        return [
          "",
          formatRow(header),
          formatRow(separator),
          ...body.map(formatRow),
          "",
        ].join("\n");
      },
    });

    const markdown = turndownService.turndown(content);

    console.log({
      id: `${slug}--${uuid()}`,
      title: title,
      blogImage: uploadData?.url,
      blogImageId: fileId,
      content: content,
      author: user?.fullName,
      categories: category,
      subCategories: selectedSubCategories,
      tags: tags,
      date: new Date().toISOString(),
      createdBy: user?.primaryEmailAddress.emailAddress,
    });

    const newErrors = {};

    // --- Tutorial-level checks ---
    if (!title) newErrors.title = "Title is required";
    if (!description) newErrors.description = "Description is required";
    if (!category) newErrors.category = "Category is required";
    if (selectedCount === 0)
      newErrors.subcategories = "Subcategory is required";

    console.log(selectedCount);

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return; // Stop submission

    const addBlog = await db
      .insert(Blogs)
      .values({
        id: `${slug}--${uuid()}`,
        title: title,
        blogImage: uploadData?.url,
        blogImageId: fileId,
        description: description,
        content: content,
        author: user?.fullName,
        categories: category,
        subCategories: selectedSubCategories,
        tags: tags,
        date: new Date().toISOString(),
        createdBy: user?.primaryEmailAddress.emailAddress,
      })
      .returning({
        id: Blogs.id,
      });
    console.log("Blog added successfully:", addBlog);
    if (!addBlog) {
      toast.error("Failed to add blog");
      return;
    } else {
      clearDataAfterAdding();
      toast.success("Blog added successfully!");
    }
  };

  const EditBlog = async () => {
    if (!title && content) {
      toast.error("Please enter a title and content");
      return;
    }

    const slug = title.toLowerCase().replace(/ /g, "-");

    const turndownService = new TurndownService({ headingStyle: "atx" });

    // Add custom rule for code blocks with language
    turndownService.addRule("fencedCodeBlockWithLang", {
      filter: (node) =>
        node.nodeName === "PRE" &&
        node.firstChild &&
        node.firstChild.nodeName === "CODE",
      replacement: (content, node) => {
        const codeNode = node.firstChild;
        const language = (codeNode.getAttribute("class") || "")
          .replace("language-", "")
          .trim();

        return `\n\n\`\`\`${language || ""}\n${
          codeNode.textContent
        }\n\`\`\`\n\n`;
      },
    });

    const markdown = turndownService.turndown(content);

    console.log({
      id: `${slug}--${uuid()}`,
      title: title,
      blogImage:
        editing && uploadData ? uploadData?.url : editBlogCoverImageURL,
      blogImageId: editing && fileId ? fileId : editBlogCoverImageId,
      content: content,
      author: user?.fullName,
      categories: category,
      subCategories: selectedSubCategories,
      date: new Date().toISOString(),
      createdBy: user?.primaryEmailAddress.emailAddress,
    });

    if (editing && fileId && uploadData) {
      await deleteFile(editBlogCoverImageId);
    }

    // const editBlog = await db
    //   .update(Blogs)
    //   .set({
    //     id: `${slug}--${uuid()}`,
    //     title: title,
    //     blogImage:
    //       editing && uploadData ? uploadData?.url : editBlogCoverImageURL,
    //     mdFormat: markdown,
    //     content: content,
    //     author: user?.fullName,
    //     categories: category,
    //     subCategories: selectedSubCategories,
    //     date: getISTDate(),
    //     createdBy: user?.primaryEmailAddress.emailAddress,
    //   })
    //   .where(eq(Blogs.id, blogId))
    //   .returning({
    //     id: Blogs.id,
    //   });

    console.log({
      id: `${slug}--${uuid()}`,
      title: title,
      blogImage:
        editing && uploadData ? uploadData?.url : editBlogCoverImageURL,
      mdFormat: markdown,
      content: content,
      author: user?.fullName,
      categories: category,
      subCategories: selectedSubCategories,
      date: getISTDate(),
      createdBy: user?.primaryEmailAddress.emailAddress,
    });
  };

  const deleteFile = async (fileId) => {
    if (!fileId) return;
    console.log("Deleting file with ID:", fileId);
    try {
      await fetch("/api/delete-image", {
        method: "POST",
        body: JSON.stringify({ fileId }),
      });
      console.log("Deleted previous file:", fileId);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleInputChange = (field, value) => {
    if (editing) return;
    const updatedBlogData = {
      title: field === "title" ? value : title,
      description: field === "description" ? value : description,
      fileId: field === "coverImage" ? value.fileId : fileId,
      uploadData: field === "coverImage" ? value.data : uploadData,
      content: field === "content" ? value : content,
      category: field === "category" ? value : category,
      subcategories: field === "subcategories" ? value : selectedSubCategories,
      tags: field === "tags" ? value : tags,
    };

    console.log("Updated blog data:", updatedBlogData);
    console.log("Updated Conent: ", updatedBlogData.content);
    localStorage.setItem(storageKey, JSON.stringify(updatedBlogData));
  };

  const clearDataAfterAdding = () => {
    localStorage.removeItem(storageKey);
    setTitle("");
    setDescription("");
    setContent("");
    setUploadData(null);
    setFileId(null);
    setUnfinishedBlog(false);
    setTags([]);
    setTag("");
    editor.commands.clearContent();
  };

  const clearData = () => {
    localStorage.removeItem(storageKey);
    if (fileId) deleteFile(fileId);
    setTitle("");
    setDescription("");
    setContent("");
    setUploadData(null);
    setFileId(null);
    setUnfinishedBlog(false);
    setTags([]);
    setTag("");
    editor.commands.clearContent();
  };

  const removePendingBlogData = () => {
    localStorage.removeItem(storageKey);
    if (fileId) deleteFile(fileId);
    setTitle("");
    setDescription("");
    setContent("");
    setUploadData(null);
    setFileId(null);
    setUnfinishedBlog(false);
    setTags([]);
    setTag("");
    editor.commands.clearContent();
  };

  const addTag = () => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      handleInputChange("tags", [...tags, tag]);
      setTag("");
    } else {
      toast.error("Please Avoid Using Duplicate Value!");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
    handleInputChange("tags", (prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-700">
      {/* Dedicated Navigation Bar */}
      <div className="bg-white/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left Side - Navigation */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={handleBack}
                className="inline-flex items-center justify-center p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-white/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-850 hover:scale-105 active:scale-95 transition-all duration-200 font-bold text-xs px-4 py-2 uppercase tracking-wider"
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                <span>Back</span>
              </button>
            </div>

            {/* Center - Title */}
            <div className="flex-1 text-center px-4 max-w-xl">
              <h1 className="text-sm sm:text-base font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 dark:from-teal-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent truncate flex items-center justify-center gap-1.5">
                <span className="font-semibold text-slate-400 dark:text-slate-500">Blog:</span>
                <HoverCard>
                  {title.length > limit ? (
                    <>
                      <HoverCardTrigger asChild>
                        <span className="cursor-pointer border-b border-dashed border-slate-350 dark:border-slate-700">
                          {title.slice(0, limit)}...
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent className="max-w-xs break-words whitespace-normal p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl">
                        {title}
                      </HoverCardContent>
                    </>
                  ) : (
                    <span>{title === "" ? "Untitled Blog" : title}</span>
                  )}
                </HoverCard>
              </h1>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center space-x-3">
              <ModeToggle />
              {/* Tablet and Desktop buttons */}
              <button
                onClick={handleBackToDashboard}
                className="inline-flex items-center px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-50 dark:hover:bg-slate-850 hover:scale-105 active:scale-95 transition-all duration-200 text-sm font-semibold"
              >
                <LayoutDashboard className="h-4 w-4 mr-1.5" />
                <span className="md:inline hidden">Dashboard</span>
              </button>

              <button
                onClick={AddBlog}
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-bold rounded-full transition-all duration-200 shadow-[0_4px_15px_rgba(59,130,246,0.15)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.35)] hover:scale-105 active:scale-95 text-sm"
              >
                <Save className="h-4 w-4 mr-1.5" />
                <span>Save Blog</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Pending Blog Alert */}
      {unfinishedBlog && !editing && (
        <div className="container mx-auto px-6 mt-8">
          <Alert
            className="relative bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/25 dark:border-amber-500/20 shadow-lg p-6 rounded-3xl overflow-hidden"
          >
            {/* Decorative side accent */}
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-400 to-orange-500" />
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <AlertTitle className="text-amber-800 dark:text-amber-300 font-bold text-base">
                  Unsaved Blog Draft Found
                </AlertTitle>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <AlertDescription className="text-slate-650 dark:text-slate-355 text-sm max-w-2xl leading-relaxed">
                  You have an unfinished blog draft in progress: &quot;
                  <b className="font-semibold text-slate-800 dark:text-slate-200">
                    {title === ""
                      ? "Untitled Blog"
                      : `${title.slice(0, 70)}${title.length > 70 ? " ..." : ""}`}
                  </b>
                  &quot;. Would you like to restore it and continue writing?
                </AlertDescription>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30 hover:bg-emerald-100/50 hover:scale-105 active:scale-95 transition-all text-xs font-bold uppercase tracking-wider px-4 py-2"
                    onClick={() => setUnfinishedBlog(false)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1.5" />
                    Continue
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30 hover:bg-rose-100/50 hover:scale-105 active:scale-95 transition-all text-xs font-bold uppercase tracking-wider px-4 py-2"
                    onClick={removePendingBlogData}
                  >
                    <XCircle className="h-4 w-4 mr-1.5" />
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </Alert>
        </div>
      )}

      <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8">
        {/* Title & Banner */}
        <div className="relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-[2rem] p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.02)] overflow-hidden">
          {/* Ambient Glow in Banner */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6 z-10">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100/50 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                Editor Mode
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                {editing ? "Edit Your Blog" : "Create a New Blog"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl font-medium">
                Start writing your thoughts, stories, or tutorials. This is your creative space to build, design, and share.
              </p>
            </div>

            {/* Clear Button */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                className="px-5 py-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-500 hover:text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-full shadow-sm hover:bg-rose-100/50 hover:scale-105 active:scale-95 transition-all"
                onClick={clearData}
              >
                <Trash2 className="h-4 w-4" />
                Clear Draft
              </button>
            </div>
          </div>
        </div>

        {/* Form Fields Card Container */}
        <div className="space-y-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.01)]">
          {/* Blog Title */}
          <div className="space-y-3">
            <Label
              htmlFor="blog-title"
              className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/50 border border-blue-100/30 dark:border-blue-900/20 px-3.5 py-1.5 rounded-full shadow-sm cursor-pointer hover:scale-105 transition-transform"
            >
              Blog Title
            </Label>
            <Input
              type="text"
              id="blog-title"
              className={`w-full px-5 py-6 rounded-2xl text-base shadow-sm border font-medium transition-all duration-300 bg-white/50 dark:bg-slate-900/50 ${
                errors.title
                  ? "border-red-500 dark:border-red-700/80 focus-visible:ring-4 focus-visible:ring-red-500/10 focus-visible:border-red-500"
                  : "border-slate-200 dark:border-slate-800 focus-visible:ring-4 focus-visible:ring-blue-500/10 focus-visible:border-blue-500 dark:focus-visible:border-teal-500 dark:focus-visible:ring-teal-500/10"
              }`}
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: "" }));
                handleInputChange("title", e.target.value);
              }}
            />
          </div>

          {/* Blog Description */}
          <div className="space-y-3">
            <Label
              htmlFor="blog-description"
              className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/50 border border-blue-100/30 dark:border-blue-900/20 px-3.5 py-1.5 rounded-full shadow-sm cursor-pointer hover:scale-105 transition-transform"
            >
              Blog Description
            </Label>
            <Textarea
              id="blog-description"
              className={`w-full px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-sm border font-medium transition-all duration-300 min-h-[100px] bg-white/50 dark:bg-slate-900/50 ${
                errors.description
                  ? "border-red-500 dark:border-red-700/80 focus-visible:ring-4 focus-visible:ring-red-500/10 focus-visible:border-red-500"
                  : "border-slate-200 dark:border-slate-800 focus-visible:ring-4 focus-visible:ring-blue-500/10 focus-visible:border-blue-500 dark:focus-visible:border-teal-500 dark:focus-visible:ring-teal-500/10"
              }`}
              placeholder="Enter a brief description of your blog..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors((prev) => ({ ...prev, description: "" }));
                handleInputChange("description", e.target.value);
              }}
            />
          </div>

            {editCoverImage &&
          editBlogCoverImageURL &&
          editBlogCoverImageURL !== "" ? (
            <div className="space-y-3">
              <Label
                htmlFor="blog-cover-image"
                className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/50 border border-blue-100/30 dark:border-blue-900/20 px-3.5 py-1.5 rounded-full shadow-sm cursor-pointer hover:scale-105 transition-transform"
              >
                Blog Cover Image
              </Label>
              <div className="relative flex flex-col items-center gap-6 mt-2 p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50 shadow-sm hover:shadow-md transition-all duration-300">
                {/* Image Block */}
                <div className="relative max-w-md w-full overflow-hidden rounded-2xl shadow-lg transition-transform duration-500 hover:scale-[1.02]">
                  <NextImage
                    src={editBlogCoverImageURL}
                    alt="Blog Cover"
                    width={500}
                    height={500}
                    className="w-full h-[250px] object-cover rounded-2xl"
                    draggable={false}
                  />
                </div>

                {/* Info and Actions - stacked below image for better alignment */}
                <div className="flex flex-col gap-3 justify-center items-center text-center">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Cover Image Uploaded
                  </h3>
                  <button
                    onClick={() => {
                      setEditCoverImage(false);
                    }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 font-bold px-6 py-2.5 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-wider"
                  >
                    Reupload Image
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <ImageUpload
              uploadData={uploadData}
              setUploadData={setUploadData}
              fileId={fileId}
              setFileId={setFileId}
              handleInputChange={handleInputChange}
            />
          )}

          {/* Categories  */}
          <div className="space-y-3">
            <Label
              htmlFor="blog-category"
              className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/50 border border-blue-100/30 dark:border-blue-900/20 px-3.5 py-1.5 rounded-full shadow-sm cursor-pointer hover:scale-105 transition-transform"
            >
              Blog Category
            </Label>
            <Select
              value={category.toLowerCase()}
              onValueChange={(e) => {
                setCategory(e);
                setSelectedSubCategories([]);
                handleInputChange("category", e); // <- Add this
                setErrors((prev) => ({ ...prev, category: "" }));
                handleInputChange("subcategories", []); // Reset subcategories too
              }}
            >
              <SelectTrigger
                id="blog-category"
                className="w-full px-5 py-6 rounded-2xl text-sm shadow-sm border font-medium transition-all duration-300 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 dark:focus:ring-teal-500/10 dark:focus:border-teal-500"
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="blog-select-content mt-2 border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-2xl shadow-xl">
                <ScrollArea className="max-h-60 overflow-auto">
                  {blogCategories.map((category, index) => (
                    <SelectItem
                      key={index}
                      value={category.toLowerCase()}
                      className="blog-select-item py-2.5 px-4 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>

            {/* Sub-Categories (Only Show When Category is Selected) */}
            {category && blogSubCategoriesList[category.toLowerCase()] && (
              <div
                className={`relative max-h-[220px] mt-3 overflow-y-auto p-5 shadow-sm rounded-2xl border transition-all duration-300 bg-white/30 dark:bg-slate-900/30 ${
                  errors.subcategories
                    ? "border-red-500 dark:border-red-700/80 bg-red-50/5 dark:bg-red-950/5"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  {/* Title & Selected Badge */}
                  <div className="flex items-center gap-2">
                    <label
                      className={`${
                        errors.subcategories
                          ? "text-red-505 dark:text-red-400"
                          : "text-slate-700 dark:text-slate-300"
                      } font-bold text-xs uppercase tracking-wider`}
                    >
                      Sub-Categories (
                      {
                        new Set(
                          blogSubCategoriesList[category.toLowerCase()] || [],
                        ).size
                      }
                      )
                    </label>

                    {/* Show Selected Count Badge */}
                    {selectedCount > 0 && (
                      <Badge className="border-0 bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        Selected: {selectedCount}
                      </Badge>
                    )}
                  </div>
                  <div>
                    {/* Clear Button */}
                    {selectedCount > 0 && (
                      <button
                        onClick={() => {
                          setSelectedSubCategories([]);
                          handleInputChange("subcategories", []); // <- Clear in localStorage too
                        }}
                        className="text-xs font-bold uppercase tracking-wider text-rose-500 hover:text-rose-600 px-3 py-1.5 rounded-full bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/30 dark:border-rose-900/20 transition-colors"
                      >
                        Clear Selection
                      </button>
                    )}
                  </div>
                </div>

                {/* Subcategories List */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {[
                    ...new Set(
                      blogSubCategoriesList[category.toLowerCase()] || [],
                    ),
                  ].map((subCategory) => {
                    const isSelected = Array.isArray(selectedSubCategories)
                      ? selectedSubCategories.includes(subCategory)
                      : selectedSubCategories?.split(", ").includes(subCategory);

                    return (
                      <Badge
                        key={subCategory}
                        onClick={() => {
                          setSelectedSubCategories((prev) => {
                            let subCategoriesArray = Array.isArray(prev)
                              ? [...prev]
                              : prev
                                ? prev.split(", ")
                                : [];

                            if (isSelected) {
                              subCategoriesArray = subCategoriesArray.filter(
                                (c) => c !== subCategory,
                              );
                            } else {
                              subCategoriesArray.push(subCategory);
                            }

                            handleInputChange(
                              "subcategories",
                              subCategoriesArray,
                            ); // pass array directly
                            return subCategoriesArray;
                          });
                          setErrors((prev) => ({ ...prev, subcategories: "" }));
                        }}
                        className={`border rounded-full text-xs font-semibold cursor-pointer px-3 py-1.5 transition-all duration-205 shadow-sm ${
                          isSelected
                            ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600 shadow-md shadow-blue-500/10"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-850"
                        }`}
                      >
                        {subCategory}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Tags Section */}
          <div className="space-y-3">
            <Label
              htmlFor="tag-input"
              className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/50 border border-blue-100/30 dark:border-blue-900/20 px-3.5 py-1.5 rounded-full shadow-sm cursor-pointer hover:scale-105 transition-transform"
            >
              Blog Tags
            </Label>

            {/* Input container with badges inside */}
            <div
              className="mt-2 w-full relative flex items-start border border-slate-200 dark:border-slate-800 rounded-2xl min-h-[52px] bg-white/50 dark:bg-slate-900/50 focus-within:ring-4 focus-within:ring-blue-500/10 dark:focus-within:ring-teal-500/10 focus-within:border-blue-500 dark:focus-within:border-teal-500 transition-all duration-300"
              onClick={() => document.getElementById("tag-input")?.focus()}
            >
              {/* Badges inside input field */}
              <div className="flex flex-wrap gap-2 flex-grow p-2.5 pr-20">
                {tags.map((t) => (
                  <Badge
                    key={t}
                    className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/50 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer shadow-sm"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTag(t);
                      }}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                ))}

                {/* Input field */}
                <input
                  id="tag-input"
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder={tags.length === 0 ? "Add tags (press Enter)" : ""}
                  className="flex-grow bg-transparent border-none outline-none p-1 text-sm text-slate-800 dark:text-white min-w-[150px]"
                />
              </div>

              {/* Right: Clear Button */}
              {tags.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTags([]);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full bg-rose-50/50 dark:bg-rose-950/20 text-rose-500 hover:text-rose-600 hover:bg-rose-100/50 border border-rose-100/30 dark:border-rose-900/20 text-[10px] font-bold uppercase tracking-wider shadow-sm transition-all"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Editor Section */}
          <div className="space-y-3 pt-4">
            <Label className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/50 border border-blue-100/30 dark:border-blue-900/20 px-3.5 py-1.5 rounded-full shadow-sm cursor-pointer hover:scale-105 transition-transform">
              Blog Editor
            </Label>
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-slate-900/30">
              <MenuBar editor={editor} />
              <EditorContent
                editor={editor}
                className="overflow-y-auto max-h-[600px] scrollbar-thin"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
