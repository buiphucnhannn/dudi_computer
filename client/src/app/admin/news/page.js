"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Newspaper,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Calendar,
  Upload,
  RefreshCw,
  X,
  AlertTriangle,
  Tag,
  FolderTree,
  ChevronLeft,
  ChevronRight,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  RemoveFormatting,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ExternalLink,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import ConfirmModal from "@/components/admin/ConfirmModal";

// Hàm tạo slug chuẩn SEO không dấu
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

export default function AdminNewsPage() {
  const [activeTab, setActiveTab] = useState("articles"); // 'articles' | 'categories'

  // --- State Danh Sách Bài Viết ---
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPublishStatus, setSelectedPublishStatus] = useState("all");
  const [articlePage, setArticlePage] = useState(1);
  const articlePageSize = 8;

  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [articleModalMode, setArticleModalMode] = useState("create");
  const [currentArticle, setCurrentArticle] = useState(null);
  const [savingArticle, setSavingArticle] = useState(false);
  const [isAsyncUploading, setIsAsyncUploading] = useState(false);

  // --- State Ảnh Đại Diện (Mutual Exclusive 1 trong 2: File hoặc URL, chỉ upload khi nhấn Đăng) ---
  const [thumbnailMode, setThumbnailMode] = useState("none"); // 'none' | 'file' | 'url'
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState("");

  // --- Custom Rich Editor Modals & Selection State ---
  const [savedRange, setSavedRange] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [linkModalData, setLinkModalData] = useState({
    isOpen: false,
    url: "https://",
    text: "",
    openInNewTab: true,
  });
  const [imageModalData, setImageModalData] = useState({
    isOpen: false,
    tab: "upload", // 'upload' | 'url'
    url: "",
    alt: "",
    uploading: false,
  });

  const fileInputRef = useRef(null);
  const inlineImageInputRef = useRef(null);
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);

  const [articleForm, setArticleForm] = useState({
    title: "",
    category: "Tin công nghệ",
    thumbnail: "",
    summary: "",
    content: "",
    tags: "",
    authorName: "DUDI Software",
    isPublished: true,
  });

  // --- State Danh Mục Tin Tức ---
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [categoryPage, setCategoryPage] = useState(1);
  const categoryPageSize = 8;

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState("create");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [savingCategory, setSavingCategory] = useState(false);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  // --- Common UI States ---
  const [toast, setToast] = useState(null);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Xác nhận",
    type: "danger",
    onConfirm: null,
    loading: false,
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Đóng modal bằng phím ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (selectedImage) setSelectedImage(null);
        else if (linkModalData.isOpen) setLinkModalData((p) => ({ ...p, isOpen: false }));
        else if (imageModalData.isOpen) setImageModalData((p) => ({ ...p, isOpen: false }));
        else if (isArticleModalOpen && !savingArticle) setIsArticleModalOpen(false);
        else if (isCategoryModalOpen && !savingCategory) setIsCategoryModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedImage,
    linkModalData.isOpen,
    imageModalData.isOpen,
    isArticleModalOpen,
    isCategoryModalOpen,
    savingArticle,
    savingCategory,
  ]);

  // Đồng bộ nội dung vào contentEditable khi mở modal
  useEffect(() => {
    if (isArticleModalOpen && editorRef.current) {
      editorRef.current.innerHTML = articleForm.content || "";
    }
  }, [isArticleModalOpen]);

  // --- Fetch Dữ Liệu Dùng apiClient Tự Động Refresh Token Khi Hết Hạn ---
  const fetchNews = async () => {
    setLoadingArticles(true);
    try {
      let url = `/news/admin/all?search=${encodeURIComponent(searchTerm)}`;
      if (selectedCategory !== "all") url += `&category=${encodeURIComponent(selectedCategory)}`;
      if (selectedPublishStatus !== "all")
        url += `&isPublished=${selectedPublishStatus === "published"}`;

      const res = await apiClient.get(url);
      const json = res.data;
      if (json.statusCode === 200 || json.success) {
        setArticles(json.data.news || []);
      }
    } catch (error) {
      showToast("Không thể tải danh sách bài viết!", "error");
    } finally {
      setLoadingArticles(false);
    }
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await apiClient.get("/news-categories/admin/all");
      const json = res.data;
      if (json.statusCode === 200 || json.success) {
        setCategories(Array.isArray(json.data) ? json.data : (json.data?.categories || []));
      }
    } catch (error) {
      try {
        const publicRes = await apiClient.get("/news-categories");
        const list = Array.isArray(publicRes.data?.data) ? publicRes.data.data : [];
        setCategories(list);
      } catch (e) {
        console.error("Lỗi tải danh mục tin tức:", e);
        showToast("Không thể tải danh mục tin tức!", "error");
      }
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchNews();
    setArticlePage(1);
  }, [selectedCategory, selectedPublishStatus]);

  // --- Rich Text Editor Formatting Commands (WYSIWYG Word-like Realtime) ---
  const formatDoc = (cmd, value = null) => {
    if (typeof document !== "undefined") {
      if (cmd === "formatBlock" && value) {
        document.execCommand("formatBlock", false, value);
      } else {
        document.execCommand(cmd, false, value);
      }
      if (editorRef.current) {
        const html = editorRef.current.innerHTML;
        setArticleForm((prev) => ({
          ...prev,
          content: html,
        }));
      }
    }
  };

  const handleEditorInput = (e) => {
    const html = e.currentTarget ? e.currentTarget.innerHTML : (editorRef.current ? editorRef.current.innerHTML : "");
    setArticleForm((prev) => ({
      ...prev,
      content: html,
    }));
  };

  // Bắt sự kiện click vào ảnh trong editor để hiển thị thanh thao tác (Xóa ảnh, Căn lề)
  const handleEditorClick = (e) => {
    if (e.target.tagName === "IMG") {
      const img = e.target;
      if (editorContainerRef.current) {
        const containerRect = editorContainerRef.current.getBoundingClientRect();
        const imgRect = img.getBoundingClientRect();
        setSelectedImage({
          element: img,
          top: imgRect.top - containerRect.top,
          left: imgRect.left - containerRect.left + (imgRect.width / 2),
        });
      }
    } else {
      setSelectedImage(null);
    }
  };

  // Xóa ảnh đang chọn trong trình soạn thảo
  const handleDeleteSelectedImage = (e) => {
    e.stopPropagation();
    if (selectedImage?.element) {
      const parent = selectedImage.element.parentElement;
      selectedImage.element.remove();
      if (parent && parent.innerHTML.trim() === "") {
        parent.remove();
      }
      setSelectedImage(null);
      if (editorRef.current) {
        setArticleForm((prev) => ({
          ...prev,
          content: editorRef.current.innerHTML,
        }));
      }
      showToast("Đã xóa hình ảnh khỏi bài viết!");
    }
  };

  // Lưu selection trước khi mở modal
  const saveCurrentSelection = () => {
    if (typeof window !== "undefined") {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        setSavedRange(range);
        return { range, text: range.toString() };
      }
    }
    return { range: null, text: "" };
  };

  // Khôi phục selection sau khi modal submit
  const restoreSavedSelection = () => {
    if (typeof window !== "undefined" && editorRef.current) {
      editorRef.current.focus();
      if (savedRange) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(savedRange);
      }
    }
  };

  // 1. Mở Modal Chèn Link Tùy Biến
  const handleOpenLinkModal = (e) => {
    if (e) e.preventDefault();
    const { text } = saveCurrentSelection();
    setLinkModalData({
      isOpen: true,
      url: "https://",
      text: text || "",
      openInNewTab: true,
    });
  };

  // Áp dụng chèn link
  const handleApplyLink = (e) => {
    e.preventDefault();
    if (!linkModalData.url.trim() || linkModalData.url.trim() === "https://") {
      showToast("Vui lòng nhập đường dẫn liên kết URL hợp lệ", "warning");
      return;
    }

    restoreSavedSelection();

    const displayTxt = linkModalData.text.trim() || linkModalData.url.trim();
    const targetAttr = linkModalData.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
    const linkHtml = `<a href="${linkModalData.url.trim()}"${targetAttr}>${displayTxt}</a>`;

    document.execCommand("insertHTML", false, linkHtml);

    if (editorRef.current) {
      setArticleForm((prev) => ({
        ...prev,
        content: editorRef.current.innerHTML,
      }));
    }

    setLinkModalData((p) => ({ ...p, isOpen: false }));
    showToast("Đã chèn liên kết vào bài viết!");
  };

  // 2. Mở Modal Chèn Ảnh Tùy Biến
  const handleOpenImageModal = (e) => {
    if (e) e.preventDefault();
    saveCurrentSelection();
    setImageModalData({
      isOpen: true,
      tab: "upload",
      url: "",
      alt: "",
      uploading: false,
    });
  };

  // Xử lý tải ảnh trong Modal Chèn Ảnh (Dùng apiClient tự động Refresh Token để 100% thành công ngay lần đầu)
  const handleInlineImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Tạo preview tức thì local blob để người dùng thấy ảnh ngay lập tức
    const localPreviewUrl = URL.createObjectURL(file);
    setImageModalData((p) => ({
      ...p,
      url: localPreviewUrl,
      uploading: true,
    }));
    setIsAsyncUploading(true);

    // 2. Chạy upload qua apiClient (Có response interceptor tự động refresh token)
    const data = new FormData();
    data.append("image", file);
    data.append("folder", "dudi_software/news/content");

    try {
      const res = await apiClient.post("/upload/image", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data?.data?.url || res.data?.url;
      if (url) {
        setImageModalData((p) => ({ ...p, url, uploading: false }));

        // Nếu người dùng đã bấm chèn trước khi upload xong, tự động thay thế blob URL bằng server URL
        if (editorRef.current && editorRef.current.innerHTML.includes(localPreviewUrl)) {
          editorRef.current.innerHTML = editorRef.current.innerHTML.replaceAll(localPreviewUrl, url);
          setArticleForm((prev) => ({
            ...prev,
            content: editorRef.current.innerHTML,
          }));
        }
      }
    } catch (err) {
      console.error("Upload inline image error:", err);
      const errMsg =
        err.response?.status === 401
          ? "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại"
          : err.response?.data?.message || err.message || "Tải ảnh thất bại";
      showToast(errMsg, "error");
      setImageModalData((p) => ({ ...p, uploading: false }));
    } finally {
      setIsAsyncUploading(false);
    }
  };

  // Áp dụng chèn ảnh (Chỉ xuất hiện 1 Toast duy nhất khi chèn)
  const handleApplyImage = (e) => {
    e.preventDefault();
    if (!imageModalData.url.trim()) {
      showToast("Vui lòng tải ảnh lên hoặc nhập URL ảnh", "warning");
      return;
    }

    restoreSavedSelection();

    const altAttr = imageModalData.alt.trim() ? ` alt="${imageModalData.alt.trim()}"` : ' alt="Hình ảnh bài viết"';
    const imgHtml = `<p style="text-align: center;"><img src="${imageModalData.url.trim()}"${altAttr} /></p><p><br></p>`;

    document.execCommand("insertHTML", false, imgHtml);

    if (editorRef.current) {
      setArticleForm((prev) => ({
        ...prev,
        content: editorRef.current.innerHTML,
      }));
    }

    setImageModalData((p) => ({ ...p, isOpen: false }));
    showToast("Đã chèn ảnh vào nội dung bài viết!");
  };

  // 3. Xóa Triệt Để Toàn Bộ Định Dạng (Tx) Về Văn Bản Thường
  const handleClearFormat = (e) => {
    if (e) e.preventDefault();
    if (editorRef.current) {
      editorRef.current.focus();
      // Xóa định dạng font inline (bold, italic, underline, strike, color...)
      document.execCommand("removeFormat", false, null);
      // Xóa liên kết
      document.execCommand("unlink", false, null);
      // Chuyển block (H2, H3, Blockquote...) về thẻ đoạn văn <p> thông thường
      document.execCommand("formatBlock", false, "p");

      setArticleForm((prev) => ({
        ...prev,
        content: editorRef.current.innerHTML,
      }));
      showToast("Đã xóa định dạng về văn bản thường!");
    }
  };

  // --- Xử Lý Bài Viết ---
  const handleOpenCreateArticle = () => {
    setArticleModalMode("create");
    setCurrentArticle(null);
    setSelectedImage(null);

    // Không gán ảnh mặc định, để trống để người dùng tự chọn 1 trong 2
    setThumbnailMode("none");
    setSelectedThumbnailFile(null);
    setThumbnailPreviewUrl("");

    setArticleForm({
      title: "",
      category: categories[0]?.name || "Tin công nghệ",
      thumbnail: "",
      summary: "",
      content: "",
      tags: "Công nghệ, Phần cứng, DUDI",
      authorName: "DUDI Software",
      isPublished: true,
    });
    setIsArticleModalOpen(true);
  };

  const handleOpenEditArticle = (art) => {
    setArticleModalMode("edit");
    setCurrentArticle(art);
    setSelectedImage(null);

    // Khởi tạo trạng thái ảnh đại diện hiện tại
    setSelectedThumbnailFile(null);
    if (art.thumbnail && art.thumbnail.trim()) {
      setThumbnailMode("url");
      setThumbnailPreviewUrl(art.thumbnail);
    } else {
      setThumbnailMode("none");
      setThumbnailPreviewUrl("");
    }

    setArticleForm({
      title: art.title || "",
      category: art.category || categories[0]?.name || "Tin công nghệ",
      thumbnail: art.thumbnail || "",
      summary: art.summary || "",
      content: art.content || "",
      tags: Array.isArray(art.tags) ? art.tags.join(", ") : art.tags || "",
      authorName: art.authorName || "DUDI Software",
      isPublished: art.isPublished !== undefined ? art.isPublished : true,
    });
    setIsArticleModalOpen(true);
  };

  // Chọn file ảnh từ máy tính (CHỈ tạo preview cục bộ, CHƯA upload lên Cloudinary để tiết kiệm tài nguyên)
  const handleThumbnailFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setSelectedThumbnailFile(file);
    setThumbnailPreviewUrl(localUrl);
    setThumbnailMode("file");
    setArticleForm((prev) => ({ ...prev, thumbnail: "" }));
  };

  // Xóa ảnh đại diện đang chọn (Reset về trạng thái ban đầu để người dùng chọn lại 1 trong 2)
  const handleClearThumbnail = () => {
    setSelectedThumbnailFile(null);
    setThumbnailPreviewUrl("");
    setThumbnailMode("none");
    setArticleForm((prev) => ({ ...prev, thumbnail: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Submit bài viết (Lúc này mới upload file ảnh đại diện lên Cloudinary nếu có chọn file từ máy)
  const handleSubmitArticle = async (e) => {
    e.preventDefault();
    const finalContent = editorRef.current ? editorRef.current.innerHTML : articleForm.content;

    if (!articleForm.title.trim() || !finalContent || finalContent === "<p><br></p>" || !finalContent.trim()) {
      showToast("Vui lòng điền tiêu đề và nội dung bài viết", "error");
      return;
    }

    if (isAsyncUploading) {
      showToast("Hình ảnh trong bài viết đang được tải lên, vui lòng chờ trong giây lát...", "warning");
      return;
    }

    setSavingArticle(true);
    try {
      let finalThumbnail = "";

      // Nếu người dùng chọn file từ máy tính, lúc này mới tải lên Cloudinary
      if (thumbnailMode === "file" && selectedThumbnailFile) {
        const formData = new FormData();
        formData.append("image", selectedThumbnailFile);
        formData.append("folder", "dudi_software/news");

        const uploadRes = await apiClient.post("/upload/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        finalThumbnail = uploadRes.data?.data?.url || uploadRes.data?.url || "";
      } else if (thumbnailMode === "url" || articleForm.thumbnail) {
        finalThumbnail = articleForm.thumbnail.trim();
      }

      const plainTextSnippet = finalContent.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim().slice(0, 180);
      const payload = {
        ...articleForm,
        thumbnail: finalThumbnail,
        summary: plainTextSnippet || articleForm.title,
        content: finalContent,
        slug: generateSlug(articleForm.title),
        tags: articleForm.tags
          ? articleForm.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      };

      const url =
        articleModalMode === "create"
          ? `/news`
          : `/news/${currentArticle._id}`;

      if (articleModalMode === "create") {
        await apiClient.post(url, payload);
      } else {
        await apiClient.put(url, payload);
      }

      showToast(
        articleModalMode === "create"
          ? "Tạo bài viết mới thành công!"
          : "Cập nhật bài viết thành công!"
      );
      setIsArticleModalOpen(false);
      fetchNews();
      fetchCategories();
    } catch (error) {
      showToast(error.response?.data?.message || error.message || "Lỗi lưu bài viết", "error");
    } finally {
      setSavingArticle(false);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await apiClient.patch(`/news/${id}/publish`);
      showToast("Đã thay đổi trạng thái xuất bản!");
      fetchNews();
    } catch (error) {
      showToast(error.response?.data?.message || error.message || "Lỗi cập nhật", "error");
    }
  };

  const handleDeleteArticle = (id, title) => {
    setConfirmState({
      isOpen: true,
      title: "Xóa bài viết vĩnh viễn?",
      message: `Bạn có chắc chắn muốn xóa bài viết "${title}"? Bài viết sẽ bị gỡ bỏ hoàn toàn khỏi hệ thống và không thể khôi phục.`,
      confirmText: "Xóa bài viết",
      type: "danger",
      loading: false,
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, loading: true }));
        try {
          await apiClient.delete(`/news/${id}`);
          showToast("Đã xóa bài viết thành công!");
          setConfirmState((prev) => ({ ...prev, isOpen: false, loading: false }));
          fetchNews();
          fetchCategories();
        } catch (error) {
          showToast(error.response?.data?.message || error.message || "Lỗi xóa bài viết", "error");
          setConfirmState((prev) => ({ ...prev, loading: false }));
        }
      },
    });
  };

  // --- Xử Lý Danh Mục Tin Tức ---
  const handleOpenCreateCategory = () => {
    setCategoryModalMode("create");
    setCurrentCategory(null);
    setCategoryForm({
      name: "",
      description: "",
      isActive: true,
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setCategoryModalMode("edit");
    setCurrentCategory(cat);
    setCategoryForm({
      name: cat.name || "",
      description: cat.description || "",
      isActive: cat.isActive !== undefined ? cat.isActive : true,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showToast("Vui lòng nhập tên chuyên mục", "error");
      return;
    }

    setSavingCategory(true);
    try {
      const payload = {
        ...categoryForm,
        slug: generateSlug(categoryForm.name),
      };

      const url =
        categoryModalMode === "create"
          ? `/news-categories`
          : `/news-categories/${currentCategory._id}`;

      if (categoryModalMode === "create") {
        await apiClient.post(url, payload);
      } else {
        await apiClient.put(url, payload);
      }

      showToast(
        categoryModalMode === "create"
          ? "Tạo chuyên mục tin tức mới thành công!"
          : "Cập nhật chuyên mục thành công!"
      );
      setIsCategoryModalOpen(false);
      fetchCategories();
    } catch (error) {
      showToast(error.response?.data?.message || error.message || "Lỗi lưu chuyên mục", "error");
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = (cat) => {
    if (cat.articleCount > 0) {
      showToast(
        `Chuyên mục "${cat.name}" đang có ${cat.articleCount} bài viết. Vui lòng chuyển bài viết sang danh mục khác trước khi xóa!`,
        "error"
      );
      return;
    }

    setConfirmState({
      isOpen: true,
      title: "Xóa chuyên mục tin tức?",
      message: `Bạn có chắc muốn xóa chuyên mục "${cat.name}"? Hành động này không thể hoàn tác.`,
      confirmText: "Xóa chuyên mục",
      type: "danger",
      loading: false,
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, loading: true }));
        try {
          await apiClient.delete(`/news-categories/${cat._id}`);
          showToast("Đã xóa chuyên mục tin tức thành công!");
          setConfirmState((prev) => ({ ...prev, isOpen: false, loading: false }));
          fetchCategories();
        } catch (error) {
          showToast(error.response?.data?.message || error.message || "Lỗi xóa chuyên mục", "error");
          setConfirmState((prev) => ({ ...prev, loading: false }));
        }
      },
    });
  };

  // --- Filtering & Pagination ---
  const filteredArticles = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    return articles.filter((art) => {
      if (query && !art.title?.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [articles, searchTerm]);

  const totalArticlePages = Math.ceil(filteredArticles.length / articlePageSize) || 1;
  const paginatedArticles = useMemo(() => {
    const start = (articlePage - 1) * articlePageSize;
    return filteredArticles.slice(start, start + articlePageSize);
  }, [filteredArticles, articlePage, articlePageSize]);

  const filteredCategories = useMemo(() => {
    const query = categorySearchTerm.toLowerCase().trim();
    return categories.filter((c) => {
      if (query && !c.name?.toLowerCase().includes(query) && !c.description?.toLowerCase().includes(query))
        return false;
      return true;
    });
  }, [categories, categorySearchTerm]);

  const totalCategoryPages = Math.ceil(filteredCategories.length / categoryPageSize) || 1;
  const paginatedCategories = useMemo(() => {
    const start = (categoryPage - 1) * categoryPageSize;
    return filteredCategories.slice(start, start + categoryPageSize);
  }, [filteredCategories, categoryPage, categoryPageSize]);

  return (
    <div className="space-y-6">
      {/* CSS Toàn Cục Định Dạng Chuẩn Word Realtime & Tối Ưu Scale Ảnh */}
      <style jsx global>{`
        .dudi-rich-editor {
          font-family: inherit;
        }
        .dudi-rich-editor h2 {
          font-size: 1.25rem !important;
          font-weight: 800 !important;
          color: #0f172a !important;
          margin-top: 1rem !important;
          margin-bottom: 0.5rem !important;
          line-height: 1.35 !important;
        }
        .dudi-rich-editor h3 {
          font-size: 1.1rem !important;
          font-weight: 700 !important;
          color: #1e293b !important;
          margin-top: 0.75rem !important;
          margin-bottom: 0.35rem !important;
          line-height: 1.4 !important;
        }
        .dudi-rich-editor p {
          margin-bottom: 0.6rem !important;
          line-height: 1.65 !important;
          color: #334155 !important;
        }
        .dudi-rich-editor blockquote {
          border-left: 4px solid #eb1c24 !important;
          padding-left: 1rem !important;
          padding-top: 0.25rem !important;
          padding-bottom: 0.25rem !important;
          margin: 0.75rem 0 !important;
          color: #475569 !important;
          font-style: italic !important;
          background: #f8fafc !important;
          border-radius: 0 0.5rem 0.5rem 0 !important;
        }
        .dudi-rich-editor ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin: 0.5rem 0 !important;
        }
        .dudi-rich-editor ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin: 0.5rem 0 !important;
        }
        .dudi-rich-editor li {
          margin-bottom: 0.25rem !important;
          color: #334155 !important;
        }
        .dudi-rich-editor a {
          color: #eb1c24 !important;
          text-decoration: underline !important;
          font-weight: 600 !important;
        }
        /* Scale ảnh trong editor nhỏ gọn vừa mắt, không tràn màn hình */
        .dudi-rich-editor img {
          max-width: 100% !important;
          max-height: 220px !important;
          width: auto !important;
          object-fit: contain !important;
          border-radius: 0.75rem !important;
          margin: 0.6rem auto !important;
          border: 2px solid #e2e8f0 !important;
          display: block !important;
          cursor: pointer !important;
          transition: all 0.15s ease !important;
        }
        .dudi-rich-editor img:hover {
          border-color: #eb1c24 !important;
          box-shadow: 0 0 0 3px rgba(235, 28, 36, 0.2) !important;
        }
      `}</style>

      {/* Toast Alert Đồng Bộ Góc Trên Bên Phải (Top-Right) */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-70 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold shadow-2xl animate-in slide-in-from-top-4 duration-200 ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : toast.type === "warning"
              ? "bg-amber-600 text-white"
              : "bg-slate-900 text-white border border-slate-700"
          }`}
        >
          {toast.type === "error" || toast.type === "warning" ? (
            <AlertTriangle className="w-5 h-5 text-amber-200" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header & Segmented Tabs Navigation */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-red-50 text-[#eb1c24] border border-red-100 shadow-xs shrink-0">
              <Newspaper className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Quản Lý Tin Tức & Chuyên Mục
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Soạn thảo bài viết công nghệ, chia sẻ thủ thuật và quản trị cây chuyên mục tin tức
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                fetchNews();
                fetchCategories();
                setArticlePage(1);
                setCategoryPage(1);
              }}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition shadow-2xs cursor-pointer"
              title="Làm mới toàn bộ dữ liệu"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  loadingArticles || loadingCategories ? "animate-spin text-[#eb1c24]" : ""
                }`}
              />
            </button>

            {activeTab === "articles" ? (
              <button
                onClick={handleOpenCreateArticle}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#eb1c24] hover:bg-[#c9121a] text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-600/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Viết Bài Mới</span>
              </button>
            ) : (
              <button
                onClick={handleOpenCreateCategory}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#eb1c24] hover:bg-[#c9121a] text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-600/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Chuyên Mục</span>
              </button>
            )}
          </div>
        </div>

        {/* 2 Tab Switcher Đồng Bộ Tông Đỏ Thương Hiệu Chuẩn */}
        <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab("articles")}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === "articles"
                ? "bg-[#eb1c24] text-white shadow-md shadow-red-600/25"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60"
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Danh Sách Bài Viết</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                activeTab === "articles" ? "bg-white/25 text-white" : "bg-slate-300/80 text-slate-700"
              }`}
            >
              {articles.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === "categories"
                ? "bg-[#eb1c24] text-white shadow-md shadow-red-600/25"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60"
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Quản Lý Chuyên Mục</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                activeTab === "categories" ? "bg-white/25 text-white" : "bg-slate-300/80 text-slate-700"
              }`}
            >
              {categories.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DANH SÁCH BÀI VIẾT                                                */}
      {/* ========================================================================= */}
      {activeTab === "articles" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết theo tiêu đề..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setArticlePage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-red-500 transition shadow-2xs"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 font-semibold focus:outline-hidden focus:border-red-500 transition shadow-2xs"
              >
                <option value="all">Tất cả chuyên mục</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedPublishStatus}
                onChange={(e) => setSelectedPublishStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 font-semibold focus:outline-hidden focus:border-red-500 transition shadow-2xs"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="published">Đã xuất bản</option>
                <option value="draft">Bản nháp</option>
              </select>
            </div>
          </div>

          {/* Articles Table (Độ rộng & Cân đối chuẩn) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4 w-14 text-center whitespace-nowrap">STT</th>
                    <th className="py-3.5 px-4 min-w-[280px] whitespace-nowrap text-left">Bài Viết</th>
                    <th className="py-3.5 px-4 w-48 text-center whitespace-nowrap">Chuyên Mục</th>
                    <th className="py-3.5 px-4 w-36 text-center whitespace-nowrap">Lượt Xem</th>
                    <th className="py-3.5 px-4 min-w-[160px] text-center whitespace-nowrap">Ngày Đăng</th>
                    <th className="py-3.5 px-4 w-40 text-center whitespace-nowrap">Trạng Thái</th>
                    <th className="py-3.5 px-4 w-28 text-center whitespace-nowrap">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {loadingArticles ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#eb1c24] mb-2" />
                        Đang tải danh sách bài viết...
                      </td>
                    </tr>
                  ) : paginatedArticles.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        Không tìm thấy bài viết nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    paginatedArticles.map((art, idx) => {
                      const itemIndex = (articlePage - 1) * articlePageSize + idx + 1;

                      return (
                        <tr key={art._id} className="hover:bg-slate-50/80 transition group">
                          <td className="py-3.5 px-4 text-center text-slate-400 font-mono font-medium whitespace-nowrap">
                            {itemIndex}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-left">
                            <div className="flex items-center gap-3.5">
                              <img
                                src={
                                  art.thumbnail ||
                                  "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200"
                                }
                                alt={art.title}
                                className="w-12 h-8 object-cover rounded-lg border border-slate-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <a
                                  href={`/news/${art.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-bold text-slate-900 hover:text-[#eb1c24] transition inline-block max-w-[280px] lg:max-w-[360px] truncate text-sm"
                                  title={art.title}
                                >
                                  {art.title}
                                </a>
                              </div>
                            </div>
                          </td>

                          {/* Chuyên mục: Bỏ badge màu, hiển thị pill xám trung tính thanh lịch */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs">
                              {art.category}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center font-bold text-slate-700 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              {art.views?.toLocaleString("vi-VN") || 0}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center text-slate-600 font-medium whitespace-nowrap text-xs">
                            <div className="inline-flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{new Date(art.createdAt).toLocaleDateString("vi-VN")}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleTogglePublish(art._id)}
                              className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
                                art.isPublished
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-slate-100 text-slate-500 border-slate-200"
                              }`}
                            >
                              {art.isPublished ? (
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 shrink-0" />
                              )}
                              <span>{art.isPublished ? "Đã Xuất Bản" : "Bản Nháp"}</span>
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditArticle(art)}
                                className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                                title="Chỉnh sửa bài viết"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteArticle(art._id, art.title)}
                                className="p-1.5 rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                                title="Xóa bài viết"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân Trang Bài Viết */}
            {filteredArticles.length > 0 && (
              <div className="p-4 bg-white flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">
                  Hiển thị{" "}
                  <strong className="text-slate-800 font-bold">
                    {(articlePage - 1) * articlePageSize + 1}-
                    {Math.min(articlePage * articlePageSize, filteredArticles.length)}
                  </strong>{" "}
                  trong tổng số{" "}
                  <strong className="text-slate-800 font-bold">{filteredArticles.length}</strong> bài viết
                </span>

                <div className="flex items-center gap-1">
                  <button
                    disabled={articlePage === 1}
                    onClick={() => setArticlePage((prev) => Math.max(prev - 1, 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                    title="Trang trước"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalArticlePages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setArticlePage(page)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                        page === articlePage
                          ? "bg-[#eb1c24] text-white shadow-xs"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={articlePage === totalArticlePages}
                    onClick={() => setArticlePage((prev) => Math.min(prev + 1, totalArticlePages))}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                    title="Trang sau"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: QUẢN LÝ CHUYÊN MỤC TIN TỨC                                         */}
      {/* ========================================================================= */}
      {activeTab === "categories" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Category Filter Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm chuyên mục tin tức..."
                value={categorySearchTerm}
                onChange={(e) => {
                  setCategorySearchTerm(e.target.value);
                  setCategoryPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-red-500 transition shadow-2xs"
              />
            </div>
          </div>

          {/* Categories Table (Bỏ màu hiển thị, bỏ thứ tự) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4 w-14 text-center whitespace-nowrap">STT</th>
                    <th className="py-3.5 px-4 min-w-[220px] whitespace-nowrap text-left">Tên Chuyên Mục</th>
                    <th className="py-3.5 px-4 min-w-[280px] whitespace-nowrap text-left">Mô Tả Chuyên Mục</th>
                    <th className="py-3.5 px-4 w-44 text-center whitespace-nowrap">Số Bài Viết</th>
                    <th className="py-3.5 px-4 w-40 text-center whitespace-nowrap">Trạng Thái</th>
                    <th className="py-3.5 px-4 w-28 text-center whitespace-nowrap">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {loadingCategories ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#eb1c24] mb-2" />
                        Đang tải danh mục tin tức...
                      </td>
                    </tr>
                  ) : paginatedCategories.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        Không tìm thấy chuyên mục nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    paginatedCategories.map((cat, idx) => {
                      const itemIndex = (categoryPage - 1) * categoryPageSize + idx + 1;

                      return (
                        <tr key={cat._id} className="hover:bg-slate-50/80 transition group">
                          <td className="py-3.5 px-4 text-center text-slate-400 font-mono font-medium whitespace-nowrap">
                            {itemIndex}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-left">
                            <span className="font-bold text-slate-900 group-hover:text-[#eb1c24] transition text-sm">
                              {cat.name}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 text-left">
                            <span className="line-clamp-1">{cat.description || "—"}</span>
                          </td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs">
                              <Newspaper className="w-3.5 h-3.5 text-slate-500" />
                              <span>{cat.articleCount || 0} bài viết</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            {cat.isActive ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Kích hoạt</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 font-semibold text-xs">
                                <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>Tạm ẩn</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditCategory(cat)}
                                className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                                title="Chỉnh sửa chuyên mục"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat)}
                                className="p-1.5 rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                                title="Xóa chuyên mục"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân Trang Chuyên Mục */}
            {filteredCategories.length > 0 && (
              <div className="p-4 bg-white flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">
                  Hiển thị{" "}
                  <strong className="text-slate-800 font-bold">
                    {(categoryPage - 1) * categoryPageSize + 1}-
                    {Math.min(categoryPage * categoryPageSize, filteredCategories.length)}
                  </strong>{" "}
                  trong tổng số{" "}
                  <strong className="text-slate-800 font-bold">{filteredCategories.length}</strong> chuyên mục
                </span>

                <div className="flex items-center gap-1">
                  <button
                    disabled={categoryPage === 1}
                    onClick={() => setCategoryPage((prev) => Math.max(prev - 1, 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                    title="Trang trước"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalCategoryPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCategoryPage(page)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                        page === categoryPage
                          ? "bg-[#eb1c24] text-white shadow-xs"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={categoryPage === totalCategoryPages}
                    onClick={() => setCategoryPage((prev) => Math.min(prev + 1, totalCategoryPages))}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                    title="Trang sau"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: SOẠN THẢO BÀI VIẾT (WYSIWYG WORD-LIKE, ĐÃ ẨN SLUG)              */}
      {/* ========================================================================= */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
            onClick={() => {
              if (!savingArticle) setIsArticleModalOpen(false);
            }}
            aria-hidden="true"
          />

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 bg-white max-w-3xl w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-100 text-[#eb1c24]">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {articleModalMode === "create" ? "Soạn Thảo Bài Viết Mới" : "Chỉnh Sửa Bài Viết"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Định dạng trực tiếp như Word và tối ưu hiển thị tin tức
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isAsyncUploading && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#eb1c24]" />
                    <span>Đang upload ảnh...</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitArticle} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tiêu đề bài viết <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hướng Dẫn Build PC Gaming i5 13400F + RTX 4060 Chiến Mọi Game..."
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-red-500 focus:outline-hidden text-slate-900 font-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Chuyên mục bài viết <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={articleForm.category}
                    onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:border-red-500 focus:outline-hidden"
                  >
                    {categories
                      .filter((c) => c.isActive)
                      .map((c) => (
                        <option key={c._id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tác giả hiển thị
                  </label>
                  <input
                    type="text"
                    value={articleForm.authorName}
                    onChange={(e) => setArticleForm({ ...articleForm, authorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-700 focus:border-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Upload Hình Ảnh Đại Diện (Chỉ chọn 1 trong 2: File từ máy HOẶC Dán URL, chưa upload cho đến khi Đăng) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-slate-700">
                    Ảnh đại diện bài viết
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">
                    (Chọn 1 trong 2: Dán link URL hoặc Tải từ máy tính)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder={
                      thumbnailMode === "file"
                        ? "Đã chọn file ảnh từ máy tính (Đang khóa ô URL)"
                        : "Dán liên kết ảnh đại diện (https://...)"
                    }
                    value={thumbnailMode === "file" ? "" : articleForm.thumbnail}
                    disabled={thumbnailMode === "file"}
                    onChange={(e) => {
                      const val = e.target.value;
                      setArticleForm((prev) => ({ ...prev, thumbnail: val }));
                      if (val.trim()) {
                        setThumbnailMode("url");
                        setThumbnailPreviewUrl(val.trim());
                      } else {
                        setThumbnailMode("none");
                        setThumbnailPreviewUrl("");
                      }
                    }}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs focus:border-red-500 focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleThumbnailFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={thumbnailMode === "url" && Boolean(articleForm.thumbnail.trim())}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs text-xs"
                    title={
                      thumbnailMode === "url" && Boolean(articleForm.thumbnail.trim())
                        ? "Vui lòng xóa URL trước nếu muốn tải ảnh từ máy"
                        : "Chọn file ảnh từ máy tính"
                    }
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải từ máy</span>
                  </button>
                </div>

                {/* Preview Thumbnail với nút X xóa ảnh */}
                {thumbnailPreviewUrl && (
                  <div className="mt-2.5">
                    <div className="relative inline-block group">
                      <img
                        src={thumbnailPreviewUrl}
                        alt="Preview ảnh đại diện"
                        className="h-16 w-24 rounded-xl border border-slate-200 object-cover shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={handleClearThumbnail}
                        className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md transition cursor-pointer"
                        title="Xóa ảnh đại diện này"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bộ Soạn Thảo Văn Bản Trực Tiếp (WYSIWYG Word-Like Realtime) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">
                    Nội dung chi tiết bài viết <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Mẹo: Bấm trực tiếp vào ảnh trong bài viết để hiện nút xóa ảnh
                  </span>
                </div>

                {/* Banner Thông Báo Đang Tải Lên Hình Ảnh Nổi Bật Trên Khung Soạn Thảo */}
                {isAsyncUploading && (
                  <div className="flex items-center justify-between gap-2.5 text-xs font-bold text-amber-900 bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-300 shadow-xs mb-2 animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#eb1c24] shrink-0" />
                      <span>
                        Hệ thống đang tải lên hình ảnh của bạn lên server... Bạn vẫn có thể tiếp tục gõ và định dạng bài viết bình thường!
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-wider bg-amber-200/80 px-2 py-0.5 rounded-md text-amber-800 shrink-0">
                      Đang xử lý
                    </span>
                  </div>
                )}
                
                <div
                  ref={editorContainerRef}
                  className="relative border border-slate-200 rounded-2xl overflow-hidden focus-within:border-red-500 transition shadow-2xs"
                >
                  {/* Floating Action Pill Khi Click Vào Ảnh Trong Editor */}
                  {selectedImage && (
                    <div
                      style={{
                        top: `${Math.max(selectedImage.top - 44, 8)}px`,
                        left: `${selectedImage.left}px`,
                        transform: "translateX(-50%)",
                      }}
                      className="absolute z-30 flex items-center gap-2 bg-slate-950/90 backdrop-blur-xs text-white px-3.5 py-1.5 rounded-full shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 duration-150 select-none"
                    >
                      <span className="text-[11px] text-slate-300 font-medium">Đang chọn ảnh</span>
                      <button
                        type="button"
                        onClick={handleDeleteSelectedImage}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eb1c24] hover:bg-[#c9121a] text-white font-bold text-xs shadow-xs transition cursor-pointer"
                        title="Xóa hình ảnh này khỏi bài viết"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa ảnh này</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedImage(null)}
                        className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                        title="Đóng thanh công cụ ảnh"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Toolbar Định Dạng Chuẩn Word */}
                  <div className="p-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-1 select-none">
                    {/* Headings */}
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        formatDoc("formatBlock", "h2");
                      }}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 font-black text-xs transition border border-transparent hover:border-slate-200 cursor-pointer"
                      title="Tiêu đề lớn (H2)"
                    >
                      <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        formatDoc("formatBlock", "h3");
                      }}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 font-bold text-xs transition border border-transparent hover:border-slate-200 cursor-pointer"
                      title="Tiêu đề vừa (H3)"
                    >
                      <Heading3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        formatDoc("formatBlock", "p");
                      }}
                      className="px-2 py-1 rounded-lg hover:bg-white text-slate-700 font-bold text-[11px] transition border border-transparent hover:border-slate-200 cursor-pointer"
                      title="Đoạn văn bản thường"
                    >
                      Văn bản
                    </button>

                    <div className="w-px h-5 bg-slate-200 mx-1" />

                    {/* Font Styling */}
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        formatDoc("bold");
                      }}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition border border-transparent hover:border-slate-200 cursor-pointer"
                      title="In đậm (Ctrl+B)"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        formatDoc("italic");
                      }}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition border border-transparent hover:border-slate-200 cursor-pointer"
                      title="In nghiêng (Ctrl+I)"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        formatDoc("underline");
                      }}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition border border-transparent hover:border-slate-200 cursor-pointer"
                      title="Gạch chân (Ctrl+U)"
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        formatDoc("strikeThrough");
                      }}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition border border-transparent hover:border-slate-200 cursor-pointer"
                      title="Gạch ngang chữ"
                    >
                      <Strikethrough className="w-4 h-4" />
                    </button>

                    <div className="w-px h-5 bg-slate-200 mx-1" />

                    {/* Alignments */}
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        formatDoc("justifyLeft");
                      }}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition border border-transparent hover:border-slate-200 cursor-pointer"
                      title="Căn trái"
                    >
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        formatDoc("justifyCenter");
                      }}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition border border-transparent hover:border-slate-200 cursor-pointer"
                      title="Căn giữa"
                    >
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        formatDoc("justifyRight");
                      }}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition border border-transparent hover:border-slate-200 cursor-pointer"
                      title="Căn phải"
                    >
                      <AlignRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        formatDoc("justifyFull");
                      }}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition border border-transparent hover:border-slate-200 cursor-pointer"
                      title="Căn đều hai bên"
                    >
                      <AlignJustify className="w-4 h-4" />
                    </button>

                    <div className="w-px h-5 bg-slate-200 mx-1" />

                    {/* Lists & Quote */}
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        formatDoc("insertUnorderedList");
                      }}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition border border-transparent hover:border-slate-200 cursor-pointer"
                      title="Danh sách dấu chấm"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        formatDoc("insertOrderedList");
                      }}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition border border-transparent hover:border-slate-200 cursor-pointer"
                      title="Danh sách đánh số"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        formatDoc("formatBlock", "blockquote");
                      }}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition border border-transparent hover:border-slate-200 cursor-pointer"
                      title="Khối trích dẫn"
                    >
                      <Quote className="w-4 h-4" />
                    </button>

                    <div className="w-px h-5 bg-slate-200 mx-1" />

                    {/* Links & Image (Mở Modal Custom Đẹp Mắt) */}
                    <button
                      type="button"
                      onMouseDown={handleOpenLinkModal}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition border border-transparent hover:border-slate-200 cursor-pointer"
                      title="Chèn liên kết URL"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={handleOpenImageModal}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition border border-transparent hover:border-slate-200 cursor-pointer flex items-center gap-1"
                      title="Chèn hình ảnh"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>

                    {/* Nút Tx Xóa Triệt Để Định Dạng */}
                    <button
                      type="button"
                      onMouseDown={handleClearFormat}
                      className="p-1.5 rounded-lg hover:bg-white text-red-600 transition border border-transparent hover:border-slate-200 cursor-pointer"
                      title="Xóa định dạng (Trả về chữ thường)"
                    >
                      <RemoveFormatting className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Vùng Nhập Liệu Hiển Thị Trực Tiếp Realtime (contentEditable) */}
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleEditorInput}
                    onClick={handleEditorClick}
                    className="dudi-rich-editor p-4 min-h-[240px] max-h-[380px] overflow-y-auto bg-white text-slate-900 text-sm focus:outline-hidden"
                    style={{ minHeight: "240px" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tags (Phân cách bởi dấu phẩy)
                  </label>
                  <input
                    type="text"
                    placeholder="Laptop Gaming, RTX 4060, Thủ thuật..."
                    value={articleForm.tags}
                    onChange={(e) => setArticleForm({ ...articleForm, tags: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 focus:border-red-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isPublishedArt"
                    checked={articleForm.isPublished}
                    onChange={(e) => setArticleForm({ ...articleForm, isPublished: e.target.checked })}
                    className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                  />
                  <label htmlFor="isPublishedArt" className="font-bold text-slate-800 cursor-pointer">
                    Xuất bản công khai ngay
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={savingArticle || isAsyncUploading}
                  className="px-5 py-2.5 rounded-xl bg-[#eb1c24] hover:bg-[#c9121a] text-white font-bold transition shadow-md shadow-red-600/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {savingArticle ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang xử lý & lưu bài...</span>
                    </>
                  ) : articleModalMode === "create" ? (
                    "Đăng Bài Viết"
                  ) : (
                    "Lưu Thay Đổi"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: THÊM / CHỈNH SỬA CHUYÊN MỤC TIN TỨC                              */}
      {/* ========================================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
            onClick={() => {
              if (!savingCategory) setIsCategoryModalOpen(false);
            }}
            aria-hidden="true"
          />

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 bg-white max-w-lg w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-100 text-[#eb1c24]">
                  <FolderTree className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {categoryModalMode === "create" ? "Thêm Chuyên Mục Tin Tức" : "Chỉnh Sửa Chuyên Mục"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Phân loại bài viết theo chuyên đề tin tức công nghệ
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCategory} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tên chuyên mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Góc Setup PC, Tin Game, Thủ thuật..."
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-red-500 focus:outline-hidden text-slate-900 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mô tả ngắn chuyên mục
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả tóm tắt về chuyên đề này..."
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-red-500 focus:outline-hidden text-slate-700"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveCat"
                  checked={categoryForm.isActive}
                  onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
                <label htmlFor="isActiveCat" className="font-bold text-slate-800 cursor-pointer">
                  Kích hoạt chuyên mục này
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={savingCategory}
                  className="px-5 py-2.5 rounded-xl bg-[#eb1c24] hover:bg-[#c9121a] text-white font-bold transition shadow-md shadow-red-600/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {savingCategory ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : categoryModalMode === "create" ? (
                    "Tạo Chuyên Mục"
                  ) : (
                    "Lưu Thay Đổi"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CHÈN ĐƯỜNG DẪN LIÊN KẾT (CUSTOM LINK MODAL)                      */}
      {/* ========================================================================= */}
      {linkModalData.isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
            onClick={() => setLinkModalData((p) => ({ ...p, isOpen: false }))}
            aria-hidden="true"
          />

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 bg-white max-w-md w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-50 text-[#eb1c24] border border-red-100">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Chèn Liên Kết (URL)</h3>
                  <p className="text-[11px] text-slate-500">Tạo liên kết dẫn đến trang web hoặc bài viết khác</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLinkModalData((p) => ({ ...p, isOpen: false }))}
                className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyLink} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Địa chỉ liên kết (URL) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="https://example.com"
                  value={linkModalData.url}
                  onChange={(e) => setLinkModalData({ ...linkModalData, url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-red-500 focus:outline-hidden text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Văn bản hiển thị (Anchor text)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bấm xem chi tiết tại đây..."
                  value={linkModalData.text}
                  onChange={(e) => setLinkModalData({ ...linkModalData, text: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-red-500 focus:outline-hidden text-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="openLinkInNewTab"
                  checked={linkModalData.openInNewTab}
                  onChange={(e) => setLinkModalData({ ...linkModalData, openInNewTab: e.target.checked })}
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
                <label htmlFor="openLinkInNewTab" className="font-bold text-slate-700 cursor-pointer">
                  Mở liên kết trong tab mới (new tab)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setLinkModalData((p) => ({ ...p, isOpen: false }))}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#eb1c24] hover:bg-[#c9121a] text-white font-bold transition shadow-md shadow-red-600/20 cursor-pointer"
                >
                  Chèn Liên Kết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CHÈN HÌNH ẢNH (CÓ NÚT X XÓA ẢNH & UPLOAD THÔNG MINH)             */}
      {/* ========================================================================= */}
      {imageModalData.isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
            onClick={() => setImageModalData((p) => ({ ...p, isOpen: false }))}
            aria-hidden="true"
          />

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 bg-white max-w-md w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-50 text-[#eb1c24] border border-red-100">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Chèn Hình Ảnh Vào Bài Viết</h3>
                  <p className="text-[11px] text-slate-500">Tải ảnh từ máy tính hoặc chèn qua đường dẫn URL</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setImageModalData((p) => ({ ...p, isOpen: false }))}
                className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyImage} className="p-6 space-y-4 text-xs">
              {/* Segmented Switcher Tab */}
              <div className="flex p-1 bg-slate-100 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setImageModalData((p) => ({ ...p, tab: "upload" }))}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition text-xs cursor-pointer ${
                    imageModalData.tab === "upload"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Tải từ máy tính
                </button>
                <button
                  type="button"
                  onClick={() => setImageModalData((p) => ({ ...p, tab: "url" }))}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition text-xs cursor-pointer ${
                    imageModalData.tab === "url"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Dán liên kết (URL)
                </button>
              </div>

              {imageModalData.tab === "upload" ? (
                <div>
                  <input
                    type="file"
                    ref={inlineImageInputRef}
                    onChange={handleInlineImageFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div
                    onClick={() => {
                      if (!imageModalData.url) inlineImageInputRef.current?.click();
                    }}
                    className="border-2 border-dashed border-slate-200 hover:border-red-400 bg-slate-50 hover:bg-red-50/30 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2"
                  >
                    {imageModalData.url ? (
                      <div className="space-y-2 relative inline-block">
                        <div className="relative inline-block group">
                          <img
                            src={imageModalData.url}
                            alt="Uploaded Preview"
                            className="h-28 mx-auto object-cover rounded-xl border border-slate-200 shadow-xs"
                          />
                          {/* Nút X Xóa Ảnh Tải Lên */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageModalData((p) => ({ ...p, url: "", uploading: false }));
                              if (inlineImageInputRef.current) inlineImageInputRef.current.value = "";
                            }}
                            className="absolute -top-2.5 -right-2.5 p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md transition cursor-pointer z-10"
                            title="Xóa hình ảnh này"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-center">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              inlineImageInputRef.current?.click();
                            }}
                            className="text-[11px] font-bold text-[#eb1c24] hover:underline cursor-pointer"
                          >
                            Chọn ảnh khác
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="p-3 rounded-full bg-white shadow-2xs text-slate-600">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block text-xs">
                            Nhấn để chọn ảnh từ máy tính
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Hỗ trợ JPG, PNG, WEBP, GIF (Tối đa 10MB)
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Đường dẫn hình ảnh (URL) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    value={imageModalData.url}
                    onChange={(e) => setImageModalData({ ...imageModalData, url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-red-500 focus:outline-hidden text-slate-900 font-medium"
                  />
                  {imageModalData.url && (
                    <div className="relative inline-block mt-2.5 mx-auto text-center w-full">
                      <div className="relative inline-block group">
                        <img
                          src={imageModalData.url}
                          alt="URL Preview"
                          className="h-24 mx-auto object-cover rounded-xl border border-slate-200"
                        />
                        {/* Nút X Xóa Ảnh URL */}
                        <button
                          type="button"
                          onClick={() => setImageModalData((p) => ({ ...p, url: "" }))}
                          className="absolute -top-2 -right-2 p-1 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md transition cursor-pointer"
                          title="Xóa URL ảnh"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mô tả hình ảnh (Alt Text)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Hình ảnh minh họa card đồ họa RTX 4060..."
                  value={imageModalData.alt}
                  onChange={(e) => setImageModalData({ ...imageModalData, alt: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-red-500 focus:outline-hidden text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setImageModalData((p) => ({ ...p, isOpen: false }))}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={!imageModalData.url}
                  className="px-5 py-2 rounded-xl bg-[#eb1c24] hover:bg-[#c9121a] text-white font-bold transition shadow-md shadow-red-600/20 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Chèn Hình Ảnh</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirm Modal */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        type={confirmState.type}
        loading={confirmState.loading}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmState.onConfirm}
      />
    </div>
  );
}
