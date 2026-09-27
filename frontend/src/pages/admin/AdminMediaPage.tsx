import React, { useState, useEffect } from 'react';
import { 
  Upload, Image as ImageIcon, FileText, Trash2, 
  Copy, Check, ExternalLink, AlertCircle, RefreshCw 
} from 'lucide-react';
import { AdminDashboardLayout } from './AdminDashboardLayout';
import { portfolioApi } from '../../services/api';
import type { IMediaItem } from '../../types';

export const AdminMediaPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<IMediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'document'>('all');

  const loadMedia = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await portfolioApi.getMedia();
      setMediaList(data || []);
    } catch (err: any) {
      setError('Failed to fetch media assets from backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds the 10MB threshold.');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append('file', file);
      const uploadedItem = await portfolioApi.uploadMedia(formData);
      setMediaList(prev => [uploadedItem, ...prev]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'File upload failed. Ensure server is online.');
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    try {
      await portfolioApi.deleteMedia(id);
      setMediaList(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      alert('Failed to delete media asset.');
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    // If relative, construct full URL
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = mediaList.filter(item => {
    if (filterType === 'all') return true;
    if (filterType === 'image') return item.mimeType?.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(item.url);
    if (filterType === 'document') return item.mimeType?.includes('pdf') || /\.(pdf|doc|docx)$/i.test(item.url);
    return true;
  });

  return (
    <AdminDashboardLayout activeSection="Media Uploads">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-heading font-extrabold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-cyan-400" />
              <span>Media Assets & File Storage</span>
            </h1>
            <p className="text-xs font-mono text-gray-400 mt-1">
              Upload and manage images, architecture schematics, PDFs, and certificates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadMedia}
              className="p-2.5 rounded-xl border border-gray-800 bg-[#0d1117] hover:border-cyan-400/40 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh Media List"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <label className="btn-cyber-primary px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold cursor-pointer">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>{isUploading ? 'UPLOADING...' : 'UPLOAD NEW FILE'}</span>
              <input
                type="file"
                className="hidden"
                disabled={isUploading}
                onChange={handleFileUpload}
                accept="image/*,application/pdf"
              />
            </label>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Filter bar */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
          {(['all', 'image', 'document'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer ${
                filterType === tab
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'all' ? `All Files (${mediaList.length})` : tab === 'image' ? 'Images' : 'Documents (PDF)'}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        {isLoading ? (
          <div className="text-center py-20 font-mono text-xs text-gray-500 flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
            <span>CONNECTING TO ASSET REPOSITORY...</span>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="border border-dashed border-gray-800 rounded-2xl p-12 text-center bg-[#0d1117]/30">
            <Upload className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="font-mono text-sm text-gray-400">No media assets in this category.</p>
            <p className="font-mono text-xs text-gray-600 mt-1">Upload screenshots, project thumbnails, or your resume PDF.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.map(item => {
              const isImg = item.mimeType?.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(item.url);
              return (
                <div
                  key={item._id}
                  className="rounded-2xl border border-gray-800/80 bg-[#0d1117] hover:border-cyan-400/30 transition-all flex flex-col overflow-hidden group shadow-lg"
                >
                  {/* Thumbnail Preview */}
                  <div className="h-40 bg-[#08090b] relative flex items-center justify-center overflow-hidden border-b border-gray-800/60">
                    {isImg ? (
                      <img
                        src={item.url}
                        alt={item.altText || item.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-cyan-400">
                        <FileText className="w-12 h-12" />
                        <span className="text-[10px] font-mono uppercase bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                          PDF DOCUMENT
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-mono text-xs font-semibold text-white truncate" title={item.filename}>
                        {item.filename}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 mt-1">
                        <span>{item.size ? `${(item.size / 1024).toFixed(1)} KB` : 'Local Asset'}</span>
                        {item.width && item.height && <span>• {item.width}x{item.height}</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-800/60">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => copyToClipboard(item.url, item._id)}
                          className="p-1.5 rounded-lg bg-gray-800/60 hover:bg-cyan-950 hover:text-cyan-300 text-gray-400 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                          title="Copy Asset URL"
                        >
                          {copiedId === item._id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-[10px] text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[10px]">URL</span>
                            </>
                          )}
                        </button>

                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                          title="Open in New Tab"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <button
                        onClick={() => handleDelete(item._id, item.filename)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};
