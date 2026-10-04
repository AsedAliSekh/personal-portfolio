import React, { useState } from 'react';
import { Plus, Edit, Trash2, BookOpen, Clock, Tag, X, Save } from 'lucide-react';
import { AdminDashboardLayout } from './AdminDashboardLayout';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';
import { portfolioApi } from '../../services/api';
import { IBlogPost } from '../../types';

export const AdminBlogPage: React.FC = () => {
  const { blogPosts, refreshData } = usePortfolioData();
  const [editingPost, setEditingPost] = useState<Partial<IBlogPost> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '## New Section\n\nWrite your technical analysis here...\n\n```typescript\n// Code snippet\n```',
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
      author: 'Ased',
      category: 'Cyber Security',
      tags: ['Security', 'Architecture', 'TypeScript'],
      readTimeMinutes: 5,
      publishDate: new Date().toISOString().split('T')[0],
      isPublished: true,
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (post: IBlogPost) => {
    setEditingPost({ ...post });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await portfolioApi.deleteItem('blog', id);
      await refreshData();
      setFeedback('Article deleted.');
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      alert('Error deleting post');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      setIsSaving(true);
      if (editingPost._id) {
        await portfolioApi.updateItem<IBlogPost>('blog', editingPost._id, editingPost);
        setFeedback('Article updated successfully.');
      } else {
        await portfolioApi.createItem<IBlogPost>('blog', editingPost);
        setFeedback('Article published successfully.');
      }
      await refreshData();
      setIsModalOpen(false);
      setEditingPost(null);
      setTimeout(() => setFeedback(null), 3000);
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error saving post');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminDashboardLayout activeSection="Blog & Journal CMS">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-white">
              Technical Journal Editor
            </h1>
            <p className="text-xs font-mono text-gray-400">
              Compose, revise, and publish technical markdown essays and dispatches.
            </p>
          </div>

          <button
            onClick={handleCreate}
            className="btn-cyber-primary px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>New Dispatch</span>
          </button>
        </div>

        {feedback && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            {feedback}
          </div>
        )}

        <div className="space-y-4">
          {blogPosts.map((post) => (
            <div
              key={post._id || post.slug}
              className="p-5 rounded-2xl border border-gray-800 bg-[#0d1117] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={post.coverImage}
                  alt=""
                  className="w-16 h-12 object-cover rounded-lg border border-gray-800 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-white text-base">{post.title}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-400/30 text-cyan-300">
                      {post.category}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-gray-400 mt-1">
                    {post.publishDate} • {post.readTimeMinutes}m read • {post.views || 0} views
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded text-xs font-mono ${
                  post.isPublished 
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-yellow-950/60 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {post.isPublished ? 'Published' : 'Draft'}
                </span>

                <button
                  onClick={() => handleEdit(post)}
                  className="p-2 rounded-xl border border-gray-800 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="p-2 rounded-xl border border-gray-800 hover:border-rose-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && editingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-3xl bg-[#0d1117] border border-cyan-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-4 my-auto max-h-[92vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-white">
                  {editingPost._id ? 'Edit Dispatch' : 'Compose New Article'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1">ARTICLE TITLE *</label>
                    <input
                      type="text"
                      required
                      value={editingPost.title || ''}
                      onChange={(e) => setEditingPost({
                        ...editingPost,
                        title: e.target.value,
                        slug: editingPost._id ? editingPost.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">SLUG PATH *</label>
                    <input
                      type="text"
                      required
                      value={editingPost.slug || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1">CATEGORY</label>
                    <input
                      type="text"
                      value={editingPost.category || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">AUTHOR</label>
                    <input
                      type="text"
                      value={editingPost.author || 'Ased'}
                      onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">ESTIMATED READ (MIN)</label>
                    <input
                      type="number"
                      value={editingPost.readTimeMinutes || 5}
                      onChange={(e) => setEditingPost({ ...editingPost, readTimeMinutes: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">COVER IMAGE URL</label>
                  <input
                    type="text"
                    value={editingPost.coverImage || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">EXCERPT ABSTRACT *</label>
                  <textarea
                    rows={2}
                    required
                    value={editingPost.excerpt || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">MARKDOWN ESSAY CONTENT *</label>
                  <textarea
                    rows={8}
                    required
                    value={editingPost.content || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none font-mono resize-y"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">TAGS (Comma-separated)</label>
                  <input
                    type="text"
                    value={editingPost.tags?.join(', ') || ''}
                    onChange={(e) => setEditingPost({
                      ...editingPost,
                      tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-800 bg-[#08090B] text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={!!editingPost.isPublished}
                      onChange={(e) => setEditingPost({ ...editingPost, isPublished: e.target.checked })}
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
                      onChange={(e) => setEditingPost({ ...editingPost, isFeatured: e.target.checked })}
                      className="rounded bg-gray-800 border-gray-700 text-purple-400"
                    />
                    <label htmlFor="isFeaturedPost" className="text-gray-300 cursor-pointer">
                      Featured in Journal Header
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-800 text-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-cyber-primary px-5 py-2 rounded-xl font-bold cursor-pointer"
                  >
                    {isSaving ? 'Saving...' : 'Save Article'}
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
