import React, { useState, useRef } from 'react';
import {
  Plus, Edit, Trash2, BookOpen, Clock, Tag, X, Save,
  Upload, Image as ImageIcon, Bold, Italic, Code,
  List, ListOrdered, Quote, Link as LinkIcon, HelpCircle,
  Check, Copy, Table, Minus, ChevronDown, ChevronUp, Sparkles,
  Info, AlertTriangle, Columns, Eye, PenLine,
  Strikethrough, Highlighter, CheckSquare, FileText, Terminal
} from 'lucide-react';
import { AdminDashboardLayout } from './AdminDashboardLayout';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';
import { portfolioApi } from '../../services/api';
import { IBlogPost } from '../../types';
import { RichMarkdownRenderer } from '../../components/markdown/RichMarkdownRenderer';

export const AdminBlogPage: React.FC = () => {
  const { blogPosts, refreshData } = usePortfolioData();
  const [editingPost, setEditingPost] = useState<Partial<IBlogPost> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Tags raw text state to fix comma & space bug
  const [tagsInput, setTagsInput] = useState('');

  // Category state
  const [isNewCategoryMode, setIsNewCategoryMode] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Cover image upload state
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);

  // In-article image upload state
  const [isUploadingArticleImage, setIsUploadingArticleImage] = useState(false);
  const [articleImageFeedback, setArticleImageFeedback] = useState<string | null>(null);
  const [uploadedArticleImages, setUploadedArticleImages] = useState<string[]>([]);
  const [copiedImageUrl, setCopiedImageUrl] = useState<string | null>(null);

  // Markdown editor mode: write, split view, or preview
  const [editorTab, setEditorTab] = useState<'write' | 'split' | 'preview'>('write');

  // Markdown manual toggle
  const [showMarkdownManual, setShowMarkdownManual] = useState(false);

  // Textarea reference for inserting snippets at cursor
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Compute all unique existing categories
  const existingCategories = Array.from(
    new Set([
      'Cyber Security',
      'Full Stack',
      'Cloud & Architecture',
      'AI & Machine Learning',
      'Systems Engineering',
      ...blogPosts.map((p) => p.category).filter(Boolean),
    ])
  );

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  // ── Clean / Empty Blog Creation ──────────────────────────────────────────
  const handleCreate = () => {
    setEditingPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '', // Completely clean & empty
      coverImage: '', // Completely clean & empty
      author: 'Ased',
      category: existingCategories[0] || 'Cyber Security',
      tags: [],
      readTimeMinutes: 1,
      publishDate: new Date().toISOString().split('T')[0],
      isPublished: true,
      isFeatured: false,
    });
    setTagsInput('');
    setIsNewCategoryMode(false);
    setNewCategoryName('');
    setCoverUploadError(null);
    setArticleImageFeedback(null);
    setUploadedArticleImages([]);
    setEditorTab('write');
    setIsModalOpen(true);
  };

  const handleEdit = (post: IBlogPost) => {
    setEditingPost({ ...post });
    setTagsInput(post.tags ? post.tags.join(', ') : '');
    setIsNewCategoryMode(false);
    setNewCategoryName('');
    setCoverUploadError(null);
    setArticleImageFeedback(null);
    setUploadedArticleImages([]);
    setEditorTab('write');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this article from the database?')) return;
    try {
      await portfolioApi.deleteItem('blog', id);
      await refreshData();
      showFeedback('Article deleted successfully.');
    } catch {
      alert('Error deleting post');
    }
  };

  // ── Cover Image Upload ──────────────────────────────────────────────────
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploadingCover(true);
      setCoverUploadError(null);
      const uploadedItem = await portfolioApi.uploadMedia(formData);
      setEditingPost((prev) => (prev ? { ...prev, coverImage: uploadedItem.url } : null));
    } catch (err: any) {
      setCoverUploadError(err.response?.data?.message || 'Failed to upload cover image.');
    } finally {
      setIsUploadingCover(false);
      e.target.value = '';
    }
  };

  // ── In-Article Image Upload & Cursor Insertion ──────────────────────────
  const handleInArticleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploadingArticleImage(true);
      setArticleImageFeedback(null);
      const uploadedItem = await portfolioApi.uploadMedia(formData);

      // Track uploaded image in current session
      setUploadedArticleImages((prev) => [uploadedItem.url, ...prev]);

      // Insert markdown directly into editor at cursor
      const safeCaption = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const imageMarkdown = `\n\n![${safeCaption}](${uploadedItem.url})\n\n`;
      insertSnippet(imageMarkdown);

      setArticleImageFeedback('Image uploaded! Markdown inserted into article content.');
      setTimeout(() => setArticleImageFeedback(null), 4000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload article image.');
    } finally {
      setIsUploadingArticleImage(false);
      e.target.value = '';
    }
  };

  // ── Insert Snippet at Cursor Helper ────────────────────────────────────
  const insertSnippet = (snippet: string) => {
    if (!editingPost) return;
    const textarea = textareaRef.current;
    const currentContent = editingPost.content || '';

    if (!textarea) {
      setEditingPost({
        ...editingPost,
        content: currentContent + snippet,
      });
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentContent.substring(start, end);

    let replacement = snippet;
    if (selectedText && snippet.includes('text')) {
      replacement = snippet.replace('text', selectedText);
    }

    const newContent =
      currentContent.substring(0, start) + replacement + currentContent.substring(end);

    setEditingPost({
      ...editingPost,
      content: newContent,
    });

    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  // ── Wrap Selection with Formatting Helper ──────────────────────────────
  const wrapSelection = (before: string, after: string, defaultPlaceholder = 'text') => {
    if (!editingPost) return;
    const textarea = textareaRef.current;
    const current = editingPost.content || '';

    if (!textarea) {
      setEditingPost({
        ...editingPost,
        content: current + before + defaultPlaceholder + after,
      });
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = current.substring(start, end) || defaultPlaceholder;
    const replacement = before + selected + after;
    const updated = current.substring(0, start) + replacement + current.substring(end);

    setEditingPost({
      ...editingPost,
      content: updated,
    });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 50);
  };

  // ── Keyboard Shortcuts (Tab indent, Ctrl+B, Ctrl+I, Ctrl+K) ───────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea || !editingPost) return;

    // 1. Tab key -> Insert 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const current = editingPost.content || '';
      const updated = current.substring(0, start) + '  ' + current.substring(end);
      setEditingPost({ ...editingPost, content: updated });
      setTimeout(() => {
        textarea.setSelectionRange(start + 2, start + 2);
      }, 0);
      return;
    }

    // 2. Ctrl/Cmd + B -> Bold
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      wrapSelection('**', '**', 'bold text');
      return;
    }

    // 3. Ctrl/Cmd + I -> Italic
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      wrapSelection('*', '*', 'italic text');
      return;
    }

    // 4. Ctrl/Cmd + K -> Link
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      wrapSelection('[', '](https://)', 'link title');
      return;
    }
  };

  const copyMarkdownSnippet = (url: string, alt = 'Visual Diagram') => {
    const snippet = `![${alt}](${url})`;
    navigator.clipboard.writeText(snippet);
    setCopiedImageUrl(url);
    setTimeout(() => setCopiedImageUrl(null), 2500);
  };

  // ── Content Statistics ──────────────────────────────────────────────────
  const currentContent = editingPost?.content || '';
  const wordCount = currentContent.trim() ? currentContent.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = currentContent.length;
  const computedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  // ── Save Dispatch ───────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    // Resolve category (either newly typed or selected)
    const finalCategory = isNewCategoryMode
      ? (newCategoryName.trim() || editingPost.category || 'Engineering')
      : (editingPost.category || 'Engineering');

    // Parse tags from decoupled raw input
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Partial<IBlogPost> = {
      ...editingPost,
      category: finalCategory,
      tags: parsedTags,
      readTimeMinutes: editingPost.readTimeMinutes || computedReadTime,
    };

    try {
      setIsSaving(true);
      if (editingPost._id) {
        await portfolioApi.updateItem<IBlogPost>('blog', editingPost._id, payload);
        showFeedback('Article updated successfully.');
      } else {
        await portfolioApi.createItem<IBlogPost>('blog', payload);
        showFeedback('Article published successfully.');
      }
      await refreshData();
      setIsModalOpen(false);
      setEditingPost(null);
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error saving post');
    } finally {
      setIsSaving(false);
    }
  };

  const inputCls =
    'w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none text-xs font-mono';
  const labelCls = 'text-gray-400 block mb-1 text-[11px] uppercase tracking-wider font-mono';

  return (
    <AdminDashboardLayout activeSection="Blog & Journal CMS">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-cyan-400" />
              <span>Technical Dispatches &amp; Blog</span>
            </h2>
            <p className="text-gray-400 text-xs font-mono mt-1">
              Publish architectural essays, security audits, and engineering journals with advanced Markdown &amp; live preview.
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="btn-cyber-primary flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Dispatch</span>
          </button>
        </div>

        {feedback && (
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            {feedback}
          </div>
        )}

        {/* Existing Articles Table */}
        <div className="rounded-2xl border border-gray-800 bg-[#0d1117] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#08090B] border-b border-gray-800 text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Article</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Tags</th>
                  <th className="px-5 py-3.5">Stats</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-gray-300">
                {blogPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-800/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {post.coverImage && (
                          <img
                            src={post.coverImage}
                            alt=""
                            className="w-12 h-10 object-cover rounded-lg border border-gray-800 shrink-0"
                          />
                        )}
                        <div>
                          <div className="font-bold text-white font-sans text-sm line-clamp-1">
                            {post.title}
                          </div>
                          <div className="text-gray-500 text-[10px] line-clamp-1 mt-0.5">
                            /{post.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 text-[11px]">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {post.tags?.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="text-gray-400 text-[10px] bg-gray-900 px-1.5 py-0.5 rounded">
                            #{t}
                          </span>
                        ))}
                        {(post.tags?.length || 0) > 3 && (
                          <span className="text-gray-500 text-[10px]">
                            +{(post.tags?.length || 0) - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        <span>{post.readTimeMinutes} min read</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {post.isPublished ? (
                        <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Published
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-1 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-1.5 rounded-lg border border-gray-800 hover:border-cyan-400/50 text-gray-300 hover:text-cyan-300 cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="p-1.5 rounded-lg border border-gray-800 hover:border-rose-400/50 text-gray-300 hover:text-rose-400 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {blogPosts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-gray-500 font-mono">
                      No blog dispatches published yet. Click "New Dispatch" to write one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── CREATE / EDIT MODAL ─────────────────────────────────────────── */}
        {isModalOpen && editingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className={`w-full ${editorTab === 'split' ? 'max-w-6xl' : 'max-w-4xl'} bg-[#0d1117] border border-cyan-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-7 space-y-5 my-auto max-h-[95vh] overflow-y-auto shadow-2xl transition-all duration-200`}>
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-white">
                    {editingPost._id ? 'Edit Technical Dispatch' : 'Compose New Technical Dispatch'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white cursor-pointer p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5 font-mono text-xs">
                {/* Title & Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>ARTICLE TITLE *</label>
                    <input
                      type="text"
                      required
                      value={editingPost.title || ''}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          title: e.target.value,
                          slug: editingPost._id
                            ? editingPost.slug
                            : e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/^-|-$/g, ''),
                        })
                      }
                      className={inputCls}
                      placeholder="e.g. Zero-Trust Microsegmentation at Scale"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>SLUG PATH *</label>
                    <input
                      type="text"
                      required
                      value={editingPost.slug || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                      className={inputCls}
                      placeholder="zero-trust-microsegmentation"
                    />
                  </div>
                </div>

                {/* Category & Author & Read Time */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Dynamic Category Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className={labelCls + ' mb-0'}>CATEGORY *</label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsNewCategoryMode(!isNewCategoryMode);
                          if (!isNewCategoryMode) setNewCategoryName('');
                        }}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                      >
                        {isNewCategoryMode ? 'Choose Existing' : '+ New Category'}
                      </button>
                    </div>

                    {isNewCategoryMode ? (
                      <input
                        type="text"
                        required
                        value={newCategoryName}
                        onChange={(e) => {
                          setNewCategoryName(e.target.value);
                          setEditingPost({ ...editingPost, category: e.target.value });
                        }}
                        className={inputCls}
                        placeholder="Type new category name..."
                        autoFocus
                      />
                    ) : (
                      <select
                        value={editingPost.category || existingCategories[0] || 'Cyber Security'}
                        onChange={(e) => {
                          if (e.target.value === '__NEW__') {
                            setIsNewCategoryMode(true);
                            setNewCategoryName('');
                          } else {
                            setEditingPost({ ...editingPost, category: e.target.value });
                          }
                        }}
                        className={inputCls}
                      >
                        {existingCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="__NEW__">+ Enter New Category...</option>
                      </select>
                    )}
                  </div>

                  <div>
                    <label className={labelCls}>AUTHOR NAME</label>
                    <input
                      type="text"
                      value={editingPost.author || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                      className={inputCls}
                      placeholder="Ased Ali Sekh"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className={labelCls + ' mb-0'}>READ TIME (MIN)</label>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingPost({ ...editingPost, readTimeMinutes: computedReadTime })
                        }
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                        title="Auto-calculate from word count"
                      >
                        Auto-Sync ({computedReadTime}m)
                      </button>
                    </div>
                    <input
                      type="number"
                      min={1}
                      value={editingPost.readTimeMinutes || 1}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          readTimeMinutes: parseInt(e.target.value) || 1,
                        })
                      }
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Cover Image URL & Direct Upload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className={labelCls + ' mb-0'}>COVER IMAGE</label>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 text-[11px] font-mono transition-colors">
                      {isUploadingCover ? (
                        <>
                          <div className="w-3 h-3 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Cover Image</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        disabled={isUploadingCover}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    {editingPost.coverImage && (
                      <div className="relative group shrink-0">
                        <img
                          src={editingPost.coverImage}
                          alt="Cover Preview"
                          className="w-16 h-12 object-cover rounded-xl border border-gray-700 bg-black/40"
                        />
                      </div>
                    )}
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={editingPost.coverImage || ''}
                        onChange={(e) =>
                          setEditingPost({ ...editingPost, coverImage: e.target.value })
                        }
                        className={inputCls}
                        placeholder="https://images.unsplash.com/... or click Upload Cover Image above"
                      />
                      <div className="flex items-center justify-between text-[10px] text-gray-500">
                        <span>Enter image URL or directly upload an image file.</span>
                        {editingPost.coverImage && (
                          <button
                            type="button"
                            onClick={() => setEditingPost({ ...editingPost, coverImage: '' })}
                            className="text-rose-400 hover:text-rose-300 underline cursor-pointer"
                          >
                            Clear Cover
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {coverUploadError && (
                    <p className="text-[11px] text-rose-400 font-mono bg-rose-950/30 border border-rose-500/30 px-2.5 py-1 rounded-lg">
                      {coverUploadError}
                    </p>
                  )}
                </div>

                {/* Excerpt */}
                <div>
                  <label className={labelCls}>EXCERPT ABSTRACT *</label>
                  <textarea
                    rows={2}
                    required
                    value={editingPost.excerpt || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                    className={`${inputCls} resize-none`}
                    placeholder="Brief 1-2 sentence executive synopsis..."
                  />
                </div>

                {/* ── ADVANCED MARKDOWN WORKSPACE ───────────────────────────── */}
                <div className="space-y-3 pt-1 border-t border-gray-800/80">
                  {/* Workspace Header: Mode Tabs, In-Article Image Upload, Syntax Manual */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-3">
                      <label className={labelCls + ' mb-0 font-bold text-white'}>
                        MARKDOWN ESSAY WORKSPACE *
                      </label>

                      {/* Mode Tabs */}
                      <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#08090B] border border-gray-800">
                        <button
                          type="button"
                          onClick={() => setEditorTab('write')}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                            editorTab === 'write'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <PenLine className="w-3 h-3" />
                          <span>Write</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditorTab('split')}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                            editorTab === 'split'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <Columns className="w-3 h-3" />
                          <span>Split View (Live)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditorTab('preview')}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                            editorTab === 'preview'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <Eye className="w-3 h-3" />
                          <span>Preview</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* In-Article Image Upload */}
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 text-[11px] font-mono transition-colors">
                        {isUploadingArticleImage ? (
                          <>
                            <div className="w-3 h-3 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>+ Insert In-Article Image</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleInArticleImageUpload}
                          disabled={isUploadingArticleImage}
                          className="hidden"
                        />
                      </label>

                      {/* Syntax Manual Toggle */}
                      <button
                        type="button"
                        onClick={() => setShowMarkdownManual(!showMarkdownManual)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-800 bg-[#0d1117] text-gray-300 hover:text-cyan-300 text-[11px] font-mono transition-colors cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Syntax Guide</span>
                        {showMarkdownManual ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {articleImageFeedback && (
                    <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-500/40 text-purple-300 text-[11px] font-mono flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{articleImageFeedback}</span>
                    </div>
                  )}

                  {/* ── Advanced Markdown Toolbar ── */}
                  <div className="flex flex-wrap items-center gap-1 p-2 rounded-xl border border-gray-800 bg-[#08090B]">
                    {/* Headings */}
                    <button
                      type="button"
                      title="Heading 2 (## Section)"
                      onClick={() => insertSnippet('\n## Section Heading\n')}
                      className="px-2 py-1 rounded hover:bg-gray-800 text-gray-300 text-xs font-bold hover:text-white"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      title="Heading 3 (### Sub-heading)"
                      onClick={() => insertSnippet('\n### Sub-heading\n')}
                      className="px-2 py-1 rounded hover:bg-gray-800 text-gray-300 text-xs font-bold hover:text-white"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      title="Heading 4 (#### Minor Title)"
                      onClick={() => insertSnippet('\n#### Minor Topic\n')}
                      className="px-2 py-1 rounded hover:bg-gray-800 text-purple-400 text-xs font-bold hover:text-purple-300"
                    >
                      H4
                    </button>

                    <span className="w-px h-4 bg-gray-800 mx-1" />

                    {/* Inline Formats */}
                    <button
                      type="button"
                      title="Bold (Ctrl+B)"
                      onClick={() => wrapSelection('**', '**', 'bold text')}
                      className="p-1 rounded hover:bg-gray-800 text-gray-300 hover:text-white"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Italic (Ctrl+I)"
                      onClick={() => wrapSelection('*', '*', 'italic text')}
                      className="p-1 rounded hover:bg-gray-800 text-gray-300 hover:text-white"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Strikethrough (~~text~~)"
                      onClick={() => wrapSelection('~~', '~~', 'strikethrough text')}
                      className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white"
                    >
                      <Strikethrough className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Highlight (==text==)"
                      onClick={() => wrapSelection('==', '==', 'highlighted text')}
                      className="p-1 rounded hover:bg-gray-800 text-cyan-400 hover:text-cyan-300"
                    >
                      <Highlighter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Keyboard Tag (<kbd>Key</kbd>)"
                      onClick={() => wrapSelection('<kbd>', '</kbd>', 'Ctrl')}
                      className="px-1.5 py-0.5 rounded hover:bg-gray-800 text-gray-300 text-[10px] font-mono border border-gray-700/50"
                    >
                      KBD
                    </button>

                    <span className="w-px h-4 bg-gray-800 mx-1" />

                    {/* Code */}
                    <button
                      type="button"
                      title="Code Block with Copy"
                      onClick={() =>
                        insertSnippet(
                          '\n```typescript\n// Architectural implementation\nexport const execute = () => {\n  return { success: true };\n};\n```\n'
                        )
                      }
                      className="p-1 rounded hover:bg-gray-800 text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-mono">Code</span>
                    </button>
                    <button
                      type="button"
                      title="Inline Code (`code`)"
                      onClick={() => wrapSelection('`', '`', 'variable')}
                      className="px-1.5 py-0.5 rounded hover:bg-gray-800 text-cyan-400 text-[11px]"
                    >
                      {'{ }'}
                    </button>

                    <span className="w-px h-4 bg-gray-800 mx-1" />

                    {/* GitHub Callouts */}
                    <button
                      type="button"
                      title="Technical Note Callout"
                      onClick={() => insertSnippet('\n> [!NOTE]\n> Essential technical context or note.\n')}
                      className="px-1.5 py-0.5 rounded hover:bg-cyan-950/40 text-cyan-400 text-[10px] border border-cyan-500/20"
                    >
                      [!NOTE]
                    </button>
                    <button
                      type="button"
                      title="Architectural Tip Callout"
                      onClick={() => insertSnippet('\n> [!TIP]\n> Optimization or architectural tip.\n')}
                      className="px-1.5 py-0.5 rounded hover:bg-emerald-950/40 text-emerald-400 text-[10px] border border-emerald-500/20"
                    >
                      [!TIP]
                    </button>
                    <button
                      type="button"
                      title="Critical Specification Callout"
                      onClick={() => insertSnippet('\n> [!IMPORTANT]\n> Critical specification requirement.\n')}
                      className="px-1.5 py-0.5 rounded hover:bg-purple-950/40 text-purple-400 text-[10px] border border-purple-500/20"
                    >
                      [!SPEC]
                    </button>
                    <button
                      type="button"
                      title="System Warning Callout"
                      onClick={() => insertSnippet('\n> [!WARNING]\n> High risk or system warning alert.\n')}
                      className="px-1.5 py-0.5 rounded hover:bg-amber-950/40 text-amber-400 text-[10px] border border-amber-500/20"
                    >
                      [!WARN]
                    </button>
                    <button
                      type="button"
                      title="Security Caution Callout"
                      onClick={() => insertSnippet('\n> [!CAUTION]\n> Security vulnerability caution.\n')}
                      className="px-1.5 py-0.5 rounded hover:bg-rose-950/40 text-rose-400 text-[10px] border border-rose-500/20"
                    >
                      [!CAUTION]
                    </button>

                    <span className="w-px h-4 bg-gray-800 mx-1" />

                    {/* Structure: Lists, Tables, Quotes */}
                    <button
                      type="button"
                      title="Interactive Task List"
                      onClick={() => insertSnippet('\n- [ ] Task in progress\n- [x] Completed milestone\n')}
                      className="p-1 rounded hover:bg-gray-800 text-emerald-400 hover:text-emerald-300"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Bullet List"
                      onClick={() => insertSnippet('\n- Point 1\n- Point 2\n- Point 3\n')}
                      className="p-1 rounded hover:bg-gray-800 text-gray-300 hover:text-white"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Numbered List"
                      onClick={() => insertSnippet('\n1. Step one\n2. Step two\n3. Step three\n')}
                      className="p-1 rounded hover:bg-gray-800 text-gray-300 hover:text-white"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="GFM Data Table"
                      onClick={() =>
                        insertSnippet(
                          '\n| Parameter | Specification | Status |\n|:---|:---:|---:|\n| Latency | < 2ms | Optimal |\n| Throughput | 50k req/s | Verified |\n'
                        )
                      }
                      className="p-1 rounded hover:bg-gray-800 text-gray-300 hover:text-white"
                    >
                      <Table className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Quote"
                      onClick={() => insertSnippet('\n> Key architectural takeaway or statement\n')}
                      className="p-1 rounded hover:bg-gray-800 text-gray-300 hover:text-white"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Insert Link (Ctrl+K)"
                      onClick={() => wrapSelection('[', '](https://example.com)', 'Link Title')}
                      className="p-1 rounded hover:bg-gray-800 text-gray-300 hover:text-white"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Horizontal Divider"
                      onClick={() => insertSnippet('\n---\n')}
                      className="p-1 rounded hover:bg-gray-800 text-gray-300 hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    {/* Full Article Blueprint Template Button */}
                    <button
                      type="button"
                      title="Insert Complete Structured Article Template"
                      onClick={() =>
                        insertSnippet(
                          '\n## 1. Executive Summary\nOverview of the architectural challenge, threat model, or engineering objectives...\n\n> [!NOTE]\n> Production benchmark was evaluated on high-throughput clusters.\n\n## 2. Technical Implementation\n\n```typescript\n// Architectural implementation\nexport const configureGateway = async () => {\n  return { status: 200, latency: "1.2ms" };\n};\n```\n\n## 3. System Metrics & Performance\n\n| Metric | Baseline | Target | Status |\n|:---|:---:|:---:|---:|\n| Latency (p99) | 120ms | <15ms | Verified |\n| Concurrency | 10k req/s | 60k req/s | Optimal |\n\n## 4. Key Takeaways\n- [x] Zero-trust microsegmentation enforced\n- [x] Sub-millisecond telemetry verified\n'
                        )
                      }
                      className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-900/50 cursor-pointer"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Article Blueprint</span>
                    </button>
                  </div>

                  {/* ── Editor Canvas: Write / Split / Preview ── */}
                  {editorTab === 'write' && (
                    <div className="space-y-1">
                      <textarea
                        ref={textareaRef}
                        rows={14}
                        required
                        value={editingPost.content || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                        onKeyDown={handleKeyDown}
                        className="w-full px-3.5 py-3 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none font-mono text-xs resize-y leading-relaxed min-h-[300px]"
                        placeholder="Compose markdown article... (Tip: Press Tab to indent, Ctrl+B for bold, Ctrl+K for links)"
                      />
                    </div>
                  )}

                  {editorTab === 'split' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Left: Code Editor */}
                      <div className="space-y-1 flex flex-col">
                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 px-1">
                          <span>MARKDOWN SOURCE</span>
                          <span>{charCount} characters</span>
                        </div>
                        <textarea
                          ref={textareaRef}
                          rows={18}
                          required
                          value={editingPost.content || ''}
                          onChange={(e) =>
                            setEditingPost({ ...editingPost, content: e.target.value })
                          }
                          onKeyDown={handleKeyDown}
                          className="w-full h-[520px] px-3.5 py-3 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none font-mono text-xs resize-none leading-relaxed"
                          placeholder="Compose markdown article..."
                        />
                      </div>

                      {/* Right: Real-time Live Renderer */}
                      <div className="space-y-1 flex flex-col">
                        <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 px-1">
                          <span className="flex items-center gap-1.5 font-bold">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            LIVE PARSER PREVIEW
                          </span>
                          <span className="text-gray-500 text-[10px]">What readers will see</span>
                        </div>
                        <div className="h-[520px] overflow-y-auto p-4 sm:p-5 rounded-xl border border-cyan-500/25 bg-[#050608] shadow-inner text-xs">
                          <RichMarkdownRenderer content={editingPost.content || ''} />
                        </div>
                      </div>
                    </div>
                  )}

                  {editorTab === 'preview' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 px-1">
                        <span className="flex items-center gap-1.5 font-bold">
                          <Eye className="w-3.5 h-3.5" />
                          FULL RENDERED ARTICLE PREVIEW
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditorTab('write')}
                          className="text-cyan-400 hover:underline cursor-pointer"
                        >
                          Back to Editor
                        </button>
                      </div>
                      <div className="min-h-[350px] max-h-[580px] overflow-y-auto p-6 sm:p-8 rounded-xl border border-cyan-500/30 bg-[#050608] shadow-[0_0_35px_rgba(34,211,238,0.06)]">
                        <RichMarkdownRenderer content={editingPost.content || ''} />
                      </div>
                    </div>
                  )}

                  {/* ── Content Statistics Bar ── */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 rounded-xl bg-[#08090B] border border-gray-800/80 text-[11px] font-mono text-gray-400">
                    <div className="flex items-center gap-4">
                      <span>
                        Words: <strong className="text-white">{wordCount}</strong>
                      </span>
                      <span>
                        Chars: <strong className="text-white">{charCount}</strong>
                      </span>
                      <span>
                        Estimated Read: <strong className="text-cyan-300">{computedReadTime} min</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500">Shortcuts: Tab = Indent | Ctrl+B = Bold | Ctrl+K = Link</span>
                    </div>
                  </div>

                  {/* Shelf of Uploaded Images in this session */}
                  {uploadedArticleImages.length > 0 && (
                    <div className="p-3 rounded-xl border border-purple-500/20 bg-purple-950/10 space-y-2">
                      <div className="text-[11px] font-mono text-purple-300 font-bold flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                        <span>Recently Uploaded Article Media:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {uploadedArticleImages.map((imgUrl, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 p-1.5 rounded-lg border border-gray-800 bg-[#0d1117]"
                          >
                            <img
                              src={imgUrl}
                              alt=""
                              className="w-8 h-8 rounded object-cover border border-gray-700"
                            />
                            <button
                              type="button"
                              onClick={() => insertSnippet(`\n\n![Visual Schematic](${imgUrl})\n\n`)}
                              className="px-2 py-1 rounded bg-purple-950/50 border border-purple-500/30 text-purple-300 hover:text-white text-[10px] cursor-pointer"
                            >
                              Insert Here
                            </button>
                            <button
                              type="button"
                              onClick={() => copyMarkdownSnippet(imgUrl)}
                              className="p-1 text-gray-400 hover:text-cyan-300 cursor-pointer"
                              title="Copy markdown code"
                            >
                              {copiedImageUrl === imgUrl ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Markdown Manual & Guide */}
                  {showMarkdownManual && (
                    <div className="p-4 rounded-xl border border-cyan-500/30 bg-[#08090B] space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                        <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-cyan-400" />
                          <span>ADVANCED MARKDOWN SYNTAX &amp; CHEAT SHEET</span>
                        </span>
                        <span className="text-[10px] text-gray-500">Click any card to inject snippet</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-[11px]">
                        <div
                          onClick={() => insertSnippet('\n## Section Heading\n### Sub-section\n')}
                          className="space-y-1 p-2.5 rounded-lg bg-[#0d1117] border border-gray-800 hover:border-cyan-500/40 cursor-pointer transition-colors"
                        >
                          <div className="text-cyan-400 font-bold flex items-center justify-between">
                            <span>1. Headings</span>
                            <span className="text-[10px] text-gray-500">Insert</span>
                          </div>
                          <code className="text-gray-300 block">## Section Title</code>
                          <code className="text-gray-400 block">### Sub-section</code>
                          <code className="text-purple-400 block">#### Minor Topic</code>
                        </div>

                        <div
                          onClick={() => insertSnippet('\n![Schematic Diagram](https://example.com/image.png)\n')}
                          className="space-y-1 p-2.5 rounded-lg bg-[#0d1117] border border-gray-800 hover:border-cyan-500/40 cursor-pointer transition-colors"
                        >
                          <div className="text-cyan-400 font-bold flex items-center justify-between">
                            <span>2. Images &amp; Lightbox</span>
                            <span className="text-[10px] text-gray-500">Insert</span>
                          </div>
                          <code className="text-gray-300 block">![Caption](https://cdn-url)</code>
                          <span className="text-gray-500 text-[10px]">Click image in article to zoom</span>
                        </div>

                        <div
                          onClick={() =>
                            insertSnippet(
                              '\n> [!NOTE]\n> System context note\n\n> [!TIP]\n> Performance optimization\n'
                            )
                          }
                          className="space-y-1 p-2.5 rounded-lg bg-[#0d1117] border border-gray-800 hover:border-cyan-500/40 cursor-pointer transition-colors"
                        >
                          <div className="text-cyan-400 font-bold flex items-center justify-between">
                            <span>3. GitHub Callouts</span>
                            <span className="text-[10px] text-gray-500">Insert</span>
                          </div>
                          <code className="text-cyan-300 block">&gt; [!NOTE] System info</code>
                          <code className="text-emerald-300 block">&gt; [!TIP] Architectural tip</code>
                          <code className="text-amber-300 block">&gt; [!WARNING] Alert</code>
                        </div>

                        <div
                          onClick={() =>
                            insertSnippet(
                              '\n```typescript\nconst handler = async () => {\n  return { ok: true };\n};\n```\n'
                            )
                          }
                          className="space-y-1 p-2.5 rounded-lg bg-[#0d1117] border border-gray-800 hover:border-cyan-500/40 cursor-pointer transition-colors"
                        >
                          <div className="text-cyan-400 font-bold flex items-center justify-between">
                            <span>4. Code Blocks with Copy</span>
                            <span className="text-[10px] text-gray-500">Insert</span>
                          </div>
                          <code className="text-gray-300 block">```typescript</code>
                          <code className="text-gray-400 block">const res = await call();</code>
                          <code className="text-gray-300 block">```</code>
                        </div>

                        <div
                          onClick={() =>
                            insertSnippet(
                              '\n**Bold text** and *Italic* and ==Highlighted== and ~~Strikethrough~~\n'
                            )
                          }
                          className="space-y-1 p-2.5 rounded-lg bg-[#0d1117] border border-gray-800 hover:border-cyan-500/40 cursor-pointer transition-colors"
                        >
                          <div className="text-cyan-400 font-bold flex items-center justify-between">
                            <span>5. Advanced Text Formats</span>
                            <span className="text-[10px] text-gray-500">Insert</span>
                          </div>
                          <code className="text-gray-300 block">==Highlighted Text==</code>
                          <code className="text-gray-400 block">~~Strikethrough~~</code>
                          <code className="text-cyan-300 block">&lt;kbd&gt;Ctrl&lt;/kbd&gt;</code>
                        </div>

                        <div
                          onClick={() =>
                            insertSnippet(
                              '\n- [ ] Task pending\n- [x] Task completed\n\n| Param | Spec |\n|:---|---:|\n| Latency | <2ms |\n'
                            )
                          }
                          className="space-y-1 p-2.5 rounded-lg bg-[#0d1117] border border-gray-800 hover:border-cyan-500/40 cursor-pointer transition-colors"
                        >
                          <div className="text-cyan-400 font-bold flex items-center justify-between">
                            <span>6. Tasks &amp; Data Tables</span>
                            <span className="text-[10px] text-gray-500">Insert</span>
                          </div>
                          <code className="text-gray-300 block">- [ ] Task in progress</code>
                          <code className="text-emerald-400 block">- [x] Completed task</code>
                          <code className="text-gray-400 block">| Metric | Target |</code>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags (Decoupled input fixing comma & space bug) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={labelCls + ' mb-0'}>TAGS (COMMA-SEPARATED)</label>
                    <span className="text-[10px] text-gray-500">
                      Separate topics with commas and spaces
                    </span>
                  </div>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className={inputCls}
                    placeholder="Security, Architecture, TypeScript, WebGL"
                  />
                  {tagsInput && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {tagsInput
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean)
                        .map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/40 text-cyan-300 border border-cyan-500/30"
                          >
                            #{tag}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                {/* Publishing Options */}
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={!!editingPost.isPublished}
                      onChange={(e) =>
                        setEditingPost({ ...editingPost, isPublished: e.target.checked })
                      }
                      className="rounded bg-gray-800 border-gray-700 text-cyan-400"
                    />
                    <label htmlFor="isPublished" className="text-gray-300 cursor-pointer">
                      Published Immediately
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isFeaturedPost"
                      checked={!!editingPost.isFeatured}
                      onChange={(e) =>
                        setEditingPost({ ...editingPost, isFeatured: e.target.checked })
                      }
                      className="rounded bg-gray-800 border-gray-700 text-purple-400"
                    />
                    <label htmlFor="isFeaturedPost" className="text-gray-300 cursor-pointer">
                      Featured in Journal Header
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-800 text-gray-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-cyber-primary px-6 py-2 rounded-xl font-bold cursor-pointer"
                  >
                    {isSaving ? 'Saving Article...' : 'Save Dispatch'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};
