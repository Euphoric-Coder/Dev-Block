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
    `text-md px-3 py-1 rounded-xl transition ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white dark:from-blue-600 dark:to-purple-700"
        : "text-foreground hover:bg-muted/80 dark:hover:bg-slate-700"
    }`;

  return (
    <div className="sticky top-0 flex flex-wrap items-center justify-between rounded-tr-2xl rounded-tl-2xl gap-2 border-r border-l border-2 border-blue-600 dark:border-blue-400 p-4 backdrop-blur-md bg-white/60 dark:bg-slate-900/60">
      <div className="hidden xl:flex w-full gap-1 items-center justify-between">
        <div className="flex items-center">
          {[1, 2, 3].map((level) => (
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

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={buttonStyle(editor.isActive("bulletList"))}
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                >
                  <MdFormatListBulleted size={30} className="mr-1" />
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
                  <MdFormatListNumbered size={30} className="mr-1" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Numbered List</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={buttonStyle(editor.isActive("bold"))}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                >
                  <MdFormatBold size={30} className="mr-1" />
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
                  <MdFormatItalic size={30} className="mr-1" />
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
                  <MdFormatQuote size={30} className="mr-1" />
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
                  <MdCode size={30} className="mr-1" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Code Block</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
                  <MdTableChart className="mr-1" />
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
                  <MdLink className="mr-1" />
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
                  <ImageIcon className="mr-1" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Clear Button */}
        <button onClick={() => editor.commands.clearContent(true)}>
          <Trash />
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
                      <MdFormatListBulleted size={30} className="mr-1" />
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
                      <MdFormatListNumbered size={30} className="mr-1" />
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
              <MenuButton className="inline-flex items-center gap-2 rounded-md bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Options
                <ChevronDownIcon className="size-4 text-gray-600 dark:text-gray-400" />
              </MenuButton>

              <MenuItems
                transition
                anchor="bottom end"
                className="w-60 mt-2 origin-top-right rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1 shadow-lg ring-1 ring-black/10 dark:ring-white/10 focus:outline-none"
              >
                {/* Bullet List */}
                <MenuItem className="flex md:hidden">
                  <button
                    className="group flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted/80 dark:hover:bg-gray-800 rounded-md"
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
                    className="group flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted/80 dark:hover:bg-gray-800 rounded-md"
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
                    className="group flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted/80 dark:hover:bg-gray-800 rounded-md"
                  >
                    <MdFormatBold className="text-lg" /> Bold
                  </button>
                </MenuItem>

                {/* Italic */}
                <MenuItem>
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className="group flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted/80 dark:hover:bg-gray-800 rounded-md"
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
                    className="group flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted/80 dark:hover:bg-gray-800 rounded-md"
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
                    className="group flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted/80 dark:hover:bg-gray-800 rounded-md"
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
                    className="group flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted/80 dark:hover:bg-gray-800 rounded-md"
                  >
                    <MdTableChart className="text-lg" /> Table
                  </button>
                </MenuItem>

                {/* Link */}
                <MenuItem>
                  <button
                    onClick={() => setOpen(true)}
                    className="group flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted/80 dark:hover:bg-gray-800 rounded-md"
                  >
                    <MdLink className="text-lg" /> Link
                  </button>
                </MenuItem>

                {/* Image */}
                <MenuItem>
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="group flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted/80 dark:hover:bg-gray-800 rounded-md"
                  >
                    <ImageIcon className="text-lg" /> Image
                  </button>
                </MenuItem>

                <div className="my-1 h-px bg-black/10 dark:bg-white/10 flex md:hidden" />
                <MenuItem className="flex md:hidden">
                  <button
                    onClick={() => console.log("deleting")}
                    className="group flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-muted/80 dark:hover:bg-gray-800 rounded-md"
                  >
                    <Trash className="text-lg" /> Delete
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
        <button onClick={() => editor.commands.clearContent(true)}>
          <Trash />
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
          "prose dark:prose-invert max-w-none p-4 min-h-[300px] rounded-b-3xl border-top-none border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none",
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Dedicated Navigation Bar */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-teal-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border-b border-blue-200/50 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left Side - Navigation */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={handleBack}
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors p-2 sm:p-0 font-medium"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </button>
            </div>

            {/* Center - Title */}
            <div className="flex-1 text-center px-2 sm:px-4">
              <h1 className="text-sm sm:text-base lg:text-lg font-bold bg-gradient-to-r from-blue-700 via-teal-600 to-blue-700 bg-clip-text text-transparent truncate">
                <span className="hidden md:inline">Creating Snippet: </span>
                <span className="md:hidden">Snippet: </span>
                <HoverCard>
                  {title.length > limit ? (
                    <>
                      <HoverCardTrigger asChild>
                        <span className="cursor-pointer">
                          {title.slice(0, limit)}...
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent className="max-w-xs break-words whitespace-normal p-2">
                        {title}
                      </HoverCardContent>
                    </>
                  ) : (
                    <span>{title === "" ? "Untitled" : title}</span>
                  )}
                </HoverCard>
              </h1>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <ModeToggle />
              {/* Tablet and Desktop buttons */}
              <button
                onClick={handleBackToDashboard}
                className="inline-flex items-center px-3 lg:px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 border border-blue-300 dark:border-gray-600 rounded-3xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 text-sm lg:text-base font-medium"
              >
                <LayoutDashboard className="md:mr-2" />
                <span className="md:inline hidden">Dashboard</span>
              </button>

              {/* Mobile-only save button */}
              <button
                onClick={AddBlog}
                className="sm:hidden p-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-3xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                title="Save Snippet"
              >
                <Save />
              </button>

              <button
                onClick={AddBlog}
                className="hidden sm:inline-flex items-center px-3 lg:px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-semibold rounded-3xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25 text-sm lg:text-base"
              >
                <Save className="mr-1 lg:mr-2" />
                <span className="hidden lg:inline">Save Snippet</span>
                <span className="lg:hidden">Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Pending Expense Alert */}
      {unfinishedBlog && !editing && (
        <div className="container mx-auto justify-center">
          <Alert
            variant="warning"
            className="mt-10 mb-5 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-gray-800 dark:to-gray-700 border border-yellow-400 dark:border-gray-600 shadow-lg p-4 rounded-3xl flex items-center hover:shadow-xl"
          >
            {/* Content that grows to fill space */}
            <div className="flex flex-col gap-2 flex-grow">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <AlertTitle className="text-yellow-700 text-sm md:text-lg dark:text-yellow-300 font-bold">
                  Pending Blog
                </AlertTitle>
              </div>
              <div className="flex items-center gap-2">
                <AlertDescription className="w-full">
                  <div
                    className="rounded-xl border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/10 
                       px-4 py-3 text-sm sm:text-base text-justify leading-relaxed text-yellow-800 dark:text-yellow-200 
                       shadow-sm transition-all"
                  >
                    <p className="text-wrap break-words">
                      You have an unfinished Blog: &quot;
                      <b className="font-semibold">
                        {title === ""
                          ? "Untitled"
                          : `${title.slice(0, 50)}${
                              title.length > 50 ? " ..." : ""
                            }`}
                      </b>
                      &quot;. Would you like to continue?
                    </p>
                  </div>
                </AlertDescription>
                {/* Button on the right */}
                <div className="flex flex-col md:flex-row items-center gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    className="accept hover:bg-green-300 hover:text-green-700 dark:hover:text-green-400 [&_svg]:size-6"
                    onClick={() => setUnfinishedBlog(false)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Continue
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="del3 hover:bg-red-300 hover:text-red-500 [&_svg]:size-6"
                    onClick={removePendingBlogData}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </Alert>
        </div>
      )}

      <div className="p-6">
        <div className="mt-10 w-full bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-[#111827] dark:via-[#0f172a] dark:to-[#1e1b4b] border-2 border-blue-400 dark:border-blue-500 rounded-2xl p-6 shadow-md mb-8 transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Title & subtitle */}
            <div>
              <h1 className="text-4xl p-1 font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                {editing ? "Edit Your Blog" : "Create a New Blog"}
              </h1>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 max-w-lg">
                Start writing your thoughts, stories, or tutorials. This is your
                creative space.
              </p>
              <p className="text-xs mt-1 italic text-blue-500 dark:text-cyan-400">
                &quot;Writing is the painting of the voice&quot;
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                // onClick={handleClear}
                className="px-4 py-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-[#1b1b1b] border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm hover:bg-gray-200 dark:hover:bg-[#2a2a2a] transition-all"
                onClick={() => {
                  clearData;
                }}
              >
                <Trash2 />
                Clear
              </button>
            </div>
          </div>
        </div>
        <div>
          <Label
            htmlFor="blog-title"
            className="text-lg font-semibold text-blue-100 bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 px-3 py-1 rounded-full shadow-md transform -translate-y-12 -translate-x-1/5 transition-all duration-300 ease-in-out z-20 cursor-pointer hover:scale-105"
          >
            Blog Title
          </Label>
          <Input
            type="text"
            id="blog-title"
            className={`my-4 w-full px-4 py-2 ${
              errors.title
                ? "input-error-field focus-visible:ring-red-500 dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-red-400 focus-visible:ring-[4px]"
                : "input-field focus-visible:ring-blue-500 dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-blue-400 focus-visible:ring-[4px]"
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
        <div>
          <Label
            htmlFor="blog-description"
            className="text-lg font-semibold text-blue-100 bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 px-3 py-1 rounded-full shadow-md transform -translate-y-12 -translate-x-1/5 transition-all duration-300 ease-in-out z-20 cursor-pointer hover:scale-105"
          >
            Blog Description
          </Label>
          <Textarea
            type="text"
            id="blog-description"
            className={`my-4 w-full px-4 py-2 ${
              errors.description
                ? "input-error-field focus-visible:ring-red-500 dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-red-400 focus-visible:ring-[4px]"
                : "input-field focus-visible:ring-blue-500 dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-blue-400 focus-visible:ring-[4px]"
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
          <div className="mb-6">
            <Label
              htmlFor="blog-cover-image"
              className="text-lg font-semibold text-blue-100 bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 px-3 py-1 rounded-full shadow-md transform -translate-y-12 -translate-x-1/5 transition-all duration-300 ease-in-out z-20 cursor-pointer hover:scale-105"
            >
              Blog Cover Image
            </Label>
            <div className="relative flex flex-col items-center gap-6 mt-4 p-6 border-2 border-dashed border-blue-300 rounded-2xl bg-gradient-to-br from-cyan-50 to-indigo-100 shadow-lg hover:shadow-xl transition-all duration-300">
              {/* Image Block */}
              <div className="flex-1 max-w-md overflow-hidden rounded-xl shadow-md transition-transform duration-300 hover:scale-105">
                <NextImage
                  src={editBlogCoverImageURL}
                  alt="Blog Cover"
                  width={500}
                  height={500}
                  className="w-full h-[300px] object-cover rounded-xl"
                  draggable={false}
                />
              </div>

              {/* Info and Actions - stacked below image for better alignment */}
              <div className="flex flex-col gap-3 justify-center items-center w-full md:w-auto md:items-start text-center md:text-left">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  Cover Image Uploaded
                </h3>
                <Button
                  onClick={() => {
                    setEditCoverImage(false);
                  }}
                  className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white font-medium px-5 py-2 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
                >
                  Reupload Image
                </Button>
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
        <div className="mt-1 space-y-4 mb-10">
          <Label
            htmlFor="blog-category"
            className="text-lg font-semibold text-blue-100 bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 px-3 py-1 rounded-full shadow-md transform -translate-y-12 -translate-x-1/5 transition-all duration-300 ease-in-out z-20 cursor-pointer hover:scale-105"
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
              className={`
                        mt-1 w-full rounded-lg px-3 py-2 border transition-colors input-field focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-[3px]
                      `}
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="blog-select-content mt-2">
              <ScrollArea className="max-h-60 overflow-auto">
                {blogCategories.map((category, index) => (
                  <SelectItem
                    key={index}
                    value={category.toLowerCase()}
                    className="blog-select-item"
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
              className={`relative max-h-[200px] mt-2 overflow-y-auto p-3 shadow-sm rounded-xl 
              ${
                errors.subcategories
                  ? "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900 dark:to-red-950 border-[2px] border-red-500 dark:border-red-700 transition-all"
                  : "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 border-[2px] border-blue-500 dark:border-blue-900 transition-all"
              }`}
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                {/* Title & Selected Badge */}
                <div className="flex items-center gap-2">
                  <label
                    className={`${errors.subcategories ? "text-red-600 dark:text-red-400" : "blog-text1"} font-semibold`}
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
                    <Badge className="border-0 bg-gradient-to-r from-green-400 to-green-600 text-white px-2 py-1 rounded-full text-xs dark:from-green-500 dark:to-green-700 ">
                      Selected: {selectedCount}
                    </Badge>
                  )}
                </div>
                <div>
                  {/* Clear Button */}
                  {selectedCount > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedSubCategories([]);
                        handleInputChange("subcategories", []); // <- Clear in localStorage too
                      }}
                      className="text-sm rounded-full text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 dark:border-gray-300"
                      size="sm"
                    >
                      Clear Selection
                    </Button>
                  )}
                </div>
              </div>

              {/* Subcategories List */}
              <div className="flex flex-wrap gap-2 mt-3">
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
                      className={`border-0 rounded-full text-sm cursor-pointer px-3 py-1 transition-all
                  ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
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

        <div>
          <Label
            htmlFor="tag-input"
            className="text-lg font-semibold text-blue-100 bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 px-3 py-1 rounded-full shadow-md transform -translate-y-12 -translate-x-1/5 transition-all duration-300 ease-in-out z-20 cursor-pointer hover:scale-105"
          >
            Blog Category
          </Label>

          {/* Input container with badges inside */}
          <div
            className="mt-4 w-full relative flex items-start border rounded-3xl min-h-[42px] input-field focus-within:ring-blue-500 dark:focus-within:ring-offset-gray-800 dark:focus-within:ring-blue-400 focus-within:ring-[4px]"
            onClick={() => document.getElementById("tag-input")?.focus()}
          >
            {/* Badges inside input field */}
            <div className="flex flex-wrap gap-2 flex-grow p-2 pr-20">
              {tags.map((t) => (
                <Badge
                  key={t}
                  className="inline-flex items-center gap-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-2 py-1 rounded-3xl text-sm dark:bg-indigo-900 hover:dark:bg-indigo-700 dark:text-indigo-100 cursor-pointer"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="text-indigo-500 hover:text-red-600 focus:outline-none dark:text-indigo-300 dark:hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
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
                placeholder={tags.length === 0 ? "Add a tag" : ""}
                className="flex-grow bg-transparent border-none outline-none p-1 text-gray-700 dark:text-white min-w-[120px]"
              />
            </div>

            {/* Right: Clear Button */}
            {tags.length > 0 && (
              <Button
                onClick={() => setTags([])}
                className="absolute right-3 top-1/2 -translate-y-1/2 del3"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        <div className="mt-5 space-y-5">
          <Label className="text-lg font-semibold text-blue-100 bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 px-3 py-1 rounded-full shadow-md transform -translate-y-12 -translate-x-1/5 transition-all duration-300 ease-in-out z-20 cursor-pointer hover:scale-105">
            Blog Editor
          </Label>
          <div>
            <MenuBar editor={editor} />
            <EditorContent
              editor={editor}
              className="overflow-y-auto max-h-[500px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
