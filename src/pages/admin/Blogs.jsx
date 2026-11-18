
import { useEffect, useState } from "react";
import {
  Search,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  CalendarDays,
  Plus,
  ImagePlus,
  LoaderCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getAllBlogs,
  createBlog,
} from "../../services/adminService";

const initialForm = {
  title: "",
  description: "",
  category: "Yoga",
  content: "",
};

const categories = [
  "Yoga",
  "Meditation",
  "Fitness",
  "Health",
  "Lifestyle",
];

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState(initialForm);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const itemsPerPage = 10;

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const response = await getAllBlogs();

      if (response?.success) {
        setBlogs(Array.isArray(response.data) ? response.data : []);
      } else {
        toast.error(response?.message || "Unable to load blogs");
      }
    } catch (error) {
      console.error("Blogs Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch blogs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Thumbnail selection and preview
  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB");
      e.target.value = "";
      return;
    }

    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  // Reset create form
  const resetCreateForm = () => {
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    setFormData(initialForm);
    setThumbnail(null);
    setThumbnailPreview("");
  };

  // Close create modal
  const closeCreateModal = () => {
    if (creating) return;

    resetCreateForm();
    setShowCreateForm(false);
  };

  // Create blog
  const handleCreateBlog = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.content.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setCreating(true);

      const data = new FormData();

      data.append("title", formData.title.trim());
      data.append("description", formData.description.trim());
      data.append("category", formData.category);
      data.append("content", formData.content.trim());

      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      }

      const response = await createBlog(data);

      if (!response?.success) {
        throw new Error(response?.message || "Failed to create blog");
      }

      toast.success(response.message || "Blog created successfully");

      resetCreateForm();
      setShowCreateForm(false);
      setCurrentPage(1);

      await fetchBlogs();
    } catch (error) {
      console.error("Create Blog Error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create blog"
      );
    } finally {
      setCreating(false);
    }
  };

  // Search blogs
  const filteredBlogs = blogs.filter((blog) => {
    const searchValue = search.toLowerCase();

    const title = blog.title?.toLowerCase() || "";
    const description = blog.description?.toLowerCase() || "";
    const category = blog.category?.toLowerCase() || "";

    const author =
      blog.authorId?.name?.toLowerCase() || "";

    return (
      title.includes(searchValue) ||
      description.includes(searchValue) ||
      category.includes(searchValue) ||
      author.includes(searchValue)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBlogs.length / itemsPerPage)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getCategoryClass = (category) => {
    switch (category) {
      case "Yoga":
        return "bg-emerald-100 text-emerald-700";
      case "Meditation":
        return "bg-purple-100 text-purple-700";
      case "Fitness":
        return "bg-blue-100 text-blue-700";
      case "Health":
        return "bg-red-100 text-red-700";
      case "Lifestyle":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* PAGE HEADER */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-1 font-medium text-emerald-600">
            Content Management
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Blogs
          </h1>

          <p className="mt-1 text-slate-500">
            Create and manage YogaConnect blog posts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* TOTAL BLOGS */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <FileText size={23} className="text-emerald-600" />
            </div>

            <div>
              <p className="text-sm text-slate-500">Total Blogs</p>
              <p className="text-2xl font-bold text-slate-900">
                {blogs.length}
              </p>
            </div>
          </div>

          {/* CREATE BLOG BUTTON */}
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus size={20} />
            Create Blog
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search blogs by title, category, author..."
            value={search}
            onChange={handleSearch}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      {/* BLOG TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                {[
                  "Blog",
                  "Category",
                  "Author",
                  "Created",
                  "Status",
                  "Action",
                ].map((heading) => (
                  <th
                    key={heading}
                    className={`whitespace-nowrap px-6 py-4 text-left text-sm font-semibold text-slate-500 ${
                      heading === "Action" ? "text-center" : ""
                    }`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-slate-500"
                  >
                    <LoaderCircle
                      size={22}
                      className="mx-auto mb-2 animate-spin"
                    />
                    Loading blogs...
                  </td>
                </tr>
              ) : currentBlogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-slate-500"
                  >
                    <FileText
                      size={32}
                      className="mx-auto mb-2 text-slate-300"
                    />
                    <p className="font-medium">No blogs found</p>
                    <p className="mt-1 text-sm">
                      Create a blog or try a different search.
                    </p>
                  </td>
                </tr>
              ) : (
                currentBlogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    {/* BLOG */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                          {blog.thumbnail?.url ? (
                            <img
                              src={blog.thumbnail.url}
                              alt={blog.title || "Blog thumbnail"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FileText
                              size={20}
                              className="text-slate-400"
                            />
                          )}
                        </div>

                        <div className="max-w-xs min-w-0">
                          <p className="truncate font-semibold text-slate-800">
                            {blog.title}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-400">
                            {blog.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-6 py-5">
                      <span
                        className={`inline-block whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${getCategoryClass(
                          blog.category
                        )}`}
                      >
                        {blog.category || "-"}
                      </span>
                    </td>

                    {/* AUTHOR */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-50">
                          {blog.authorId?.profileImage?.url ? (
                            <img
                              src={blog.authorId.profileImage.url}
                              alt={blog.authorId.name || "Author"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User
                              size={16}
                              className="text-emerald-600"
                            />
                          )}
                        </div>

                        <div>
                          <p className="whitespace-nowrap text-sm font-medium text-slate-700">
                            {blog.authorId?.name || "-"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {blog.authorId?.email || ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CREATED */}
                    <td className="whitespace-nowrap px-6 py-5 text-slate-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={16}
                          className="text-slate-400"
                        />
                        {formatDate(blog.createdAt)}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">
                      <span
                        className={`inline-block rounded-full px-3 py-1.5 text-xs font-semibold ${
                          blog.status
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {blog.status ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-5 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedBlog(blog)}
                        title="View blog"
                        className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!loading && filteredBlogs.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(
                  startIndex + itemsPerPage,
                  filteredBlogs.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {filteredBlogs.length}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentPage === 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="px-3 text-sm font-medium text-slate-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, totalPages)
                  )
                }
                disabled={currentPage >= totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE BLOG MODAL */}
      {showCreateForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeCreateModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-sm font-medium text-emerald-600">
                  Content Management
                </p>
                <h2 className="text-xl font-bold text-slate-900">
                  Create New Blog
                </h2>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                disabled={creating}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateBlog} className="space-y-5 p-6">
              {/* TITLE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Blog Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  maxLength={150}
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter blog title"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  maxLength={500}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write a short blog description"
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* CONTENT */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Blog Content *
                </label>
                <textarea
                  name="content"
                  required
                  rows={8}
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write the complete blog content..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 leading-7 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* THUMBNAIL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Thumbnail (optional)
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 p-4 transition hover:border-emerald-500 hover:bg-emerald-50/30">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                    <ImagePlus
                      size={22}
                      className="text-emerald-600"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-700">
                      {thumbnail
                        ? thumbnail.name
                        : "Choose a thumbnail image"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Image files up to 5 MB
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailChange}
                    disabled={creating}
                  />
                </label>

                {thumbnailPreview && (
                  <div className="relative mt-4 h-44 overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(thumbnailPreview);
                        setThumbnail(null);
                        setThumbnailPreview("");
                      }}
                      disabled={creating}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-700 shadow hover:text-red-600 disabled:opacity-50"
                    >
                      <X size={17} />
                    </button>
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-200 pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={creating}
                  className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating && (
                    <LoaderCircle size={18} className="animate-spin" />
                  )}
                  {creating ? "Creating Blog..." : "Create Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW BLOG DETAILS MODAL */}
      {selectedBlog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedBlog(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div className="min-w-0">
                <p className="text-sm font-medium text-emerald-600">
                  Blog Details
                </p>
                <h2 className="truncate text-xl font-bold text-slate-900">
                  {selectedBlog.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBlog(null)}
                className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 transition hover:bg-red-50 hover:text-red-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-6">
              {selectedBlog.thumbnail?.url && (
                <div className="mb-6 h-64 overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={selectedBlog.thumbnail.url}
                    alt={selectedBlog.title || "Blog thumbnail"}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="mb-4">
                <span
                  className={`inline-block rounded-full px-3 py-1.5 text-xs font-semibold ${getCategoryClass(
                    selectedBlog.category
                  )}`}
                >
                  {selectedBlog.category || "-"}
                </span>
              </div>

              <h2 className="mb-3 text-2xl font-bold text-slate-900">
                {selectedBlog.title}
              </h2>

              <p className="mb-6 leading-relaxed text-slate-500">
                {selectedBlog.description}
              </p>

              <div className="mb-6 flex flex-wrap gap-6 border-y border-slate-200 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-emerald-50">
                    {selectedBlog.authorId?.profileImage?.url ? (
                      <img
                        src={selectedBlog.authorId.profileImage.url}
                        alt={selectedBlog.authorId.name || "Author"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User
                        size={18}
                        className="text-emerald-600"
                      />
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Author</p>
                    <p className="font-semibold text-slate-700">
                      {selectedBlog.authorId?.name || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                    <CalendarDays
                      size={18}
                      className="text-slate-500"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Created</p>
                    <p className="font-semibold text-slate-700">
                      {formatDate(selectedBlog.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="mb-3 text-lg font-bold text-slate-800">
                Content
              </h3>

              <div className="whitespace-pre-line leading-7 text-slate-600">
                {selectedBlog.content || "No content available."}
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="break-all text-xs text-slate-400">
                    Blog ID: {selectedBlog._id}
                  </p>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      selectedBlog.status
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedBlog.status ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setSelectedBlog(null)}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 font-medium text-white transition hover:bg-emerald-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
