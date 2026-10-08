import React, { useState, useEffect } from 'react';
import { 
  Upload, Image as ImageIcon, FileText, Trash2, 
  Copy, Check, ExternalLink, AlertCircle, RefreshCw,
  Search, Link as LinkIcon, CheckCircle2, Layers,
  AlertTriangle
} from 'lucide-react';
import { AdminDashboardLayout } from './AdminDashboardLayout';
import { portfolioApi } from '../../services/api';
import type { IMediaItem } from '../../types';

export const AdminMediaPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<IMediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'in-use' | 'unused' | 'image' | 'document'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
      setSuccessMsg(`File "${file.name}" uploaded to Cloud CDN and registered.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'File upload failed. Ensure server is online.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (item: IMediaItem) => {
    const usageSummary = item.usedIn && item.usedIn.length > 0
      ? `\n\nWARNING: This file is currently linked in:\n${item.usedIn.map(u => `• [${u.type}] ${u.title} (${u.field})`).join('\n')}\n\nPermanently deleting it will purge it from Cloud CDN storage and break all links across the live portfolio.`
      : `\n\nThis file will be permanently deleted from Cloud CDN storage.`;

    if (!window.confirm(`Permanently delete "${item.filename}"?${usageSummary}`)) return;

    try {
      await portfolioApi.deleteMedia(item._id);
      setMediaList(prev => prev.filter(m => m._id !== item._id));
      setSuccessMsg(`Asset permanently purged from CDN and database.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete media asset.');
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Counts
  const inUseCount = mediaList.filter(m => (m.usedIn?.length || 0) > 0).length;
  const unusedCount = mediaList.filter(m => (m.usedIn?.length || 0) === 0).length;
  const imageCount = mediaList.filter(m => m.mimeType?.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(m.url)).length;
  const docCount = mediaList.filter(m => m.mimeType?.includes('pdf') || /\.(pdf|doc|docx)$/i.test(m.url)).length;

  const filteredMedia = mediaList.filter(item => {
    // 1. Filter by category
    if (filterType === 'in-use') {
      if (!item.usedIn || item.usedIn.length === 0) return false;
    } else if (filterType === 'unused') {
      if (item.usedIn && item.usedIn.length > 0) return false;
    } else if (filterType === 'image') {
      const isImg = item.mimeType?.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(item.url);
      if (!isImg) return false;
    } else if (filterType === 'document') {
      const isDoc = item.mimeType?.includes('pdf') || /\.(pdf|doc|docx)$/i.test(item.url);
      if (!isDoc) return false;
    }

    // 2. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inFilename = item.filename?.toLowerCase().includes(q);
      const inOriginalName = item.originalName?.toLowerCase().includes(q);
      const inUrl = item.url?.toLowerCase().includes(q);
      const inUsages = item.usedIn?.some(u => 
        u.title.toLowerCase().includes(q) || 
        u.type.toLowerCase().includes(q) || 
        u.field.toLowerCase().includes(q)
      );
      return inFilename || inOriginalName || inUrl || inUsages;
    }

    return true;
  });

  return (
    <AdminDashboardLayout activeSection="Media Uploads">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-cyan-400" />
              <span>Centralized Media Controller &amp; CDN Storage</span>
            </h1>
            <p className="text-xs font-mono text-gray-400 mt-1">
              Universal repository managing all assets across Blog, Projects, Skills, Testimonials, Certifications &amp; Profile.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadMedia}
              className="px-3 py-2 rounded-xl border border-gray-800 bg-[#0d1117] hover:border-cyan-400/40 text-gray-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
              title="Rescan and sync all portfolio media usages"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Sync Registry</span>
            </button>

            <label className="btn-cyber-primary px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold cursor-pointer">
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

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                filterType === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Assets ({mediaList.length})
            </button>
            <button
              onClick={() => setFilterType('in-use')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                filterType === 'in-use'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              In Use Across Portfolio ({inUseCount})
            </button>
            <button
              onClick={() => setFilterType('unused')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                filterType === 'unused'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Unlinked Assets ({unusedCount})
            </button>
            <button
              onClick={() => setFilterType('image')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                filterType === 'image'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Images ({imageCount})
            </button>
            <button
              onClick={() => setFilterType('document')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                filterType === 'document'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Documents ({docCount})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[260px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets or usages..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-800 bg-[#08090B] text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Media Grid */}
        {isLoading ? (
          <div className="text-center py-24 font-mono text-xs text-gray-500 flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
            <span>SCANNING CENTRALIZED MEDIA REPOSITORY...</span>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="border border-dashed border-gray-800 rounded-2xl p-12 text-center bg-[#0d1117]/30">
            <Upload className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="font-mono text-sm text-gray-400">No media assets match your selection.</p>
            <p className="font-mono text-xs text-gray-600 mt-1">Upload screenshots, project thumbnails, or certificates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.map(item => {
              const isImg = item.mimeType?.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(item.url);
              const usages = item.usedIn || [];
              const isLinked = usages.length > 0;

              return (
                <div
                  key={item._id}
                  className="rounded-2xl border border-gray-800/80 bg-[#0d1117] hover:border-cyan-400/40 transition-all flex flex-col overflow-hidden group shadow-lg"
                >
                  {/* Thumbnail Preview */}
                  <div className="h-44 bg-[#08090b] relative flex items-center justify-center overflow-hidden border-b border-gray-800/60">
                    {isImg ? (
                      <img
                        src={item.url}
                        alt={item.altText || item.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-cyan-400 p-4 text-center">
                        <FileText className="w-12 h-12 text-cyan-400" />
                        <span className="text-[10px] font-mono uppercase bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                          PDF DOCUMENT
                        </span>
                      </div>
                    )}

                    {/* In-Use Badge on top left of preview */}
                    <div className="absolute top-2 left-2">
                      {isLinked ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>Linked ({usages.length})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-gray-900/80 text-gray-400 border border-gray-700/40 backdrop-blur-md">
                          <span>Unlinked</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-mono text-xs font-semibold text-white truncate" title={item.originalName || item.filename}>
                        {item.originalName || item.filename}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 mt-1">
                        <span>{item.size ? `${(item.size / 1024).toFixed(1)} KB` : 'Cloud CDN Asset'}</span>
                        {item.uploadedAt && <span>• {new Date(item.uploadedAt).toLocaleDateString()}</span>}
                      </div>

                      {/* Linked Usage Tags */}
                      <div className="mt-2.5 pt-2 border-t border-gray-800/60 space-y-1">
                        <div className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                          <LinkIcon className="w-3 h-3 text-cyan-400" />
                          <span>Active Linkages:</span>
                        </div>
                        {isLinked ? (
                          <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                            {usages.map((u, uIdx) => {
                              const badgeCls = 
                                u.type === 'Blog' ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30' :
                                u.type === 'Project' ? 'bg-purple-950/60 text-purple-300 border-purple-500/30' :
                                u.type === 'Testimonial' ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30' :
                                u.type === 'Skill' ? 'bg-amber-950/60 text-amber-300 border-amber-500/30' :
                                u.type === 'Certification' ? 'bg-blue-950/60 text-blue-300 border-blue-500/30' :
                                'bg-rose-950/60 text-rose-300 border-rose-500/30';

                              return (
                                <span
                                  key={uIdx}
                                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded border line-clamp-1 ${badgeCls}`}
                                  title={`${u.type}: ${u.title} (${u.field})`}
                                >
                                  {u.type}: {u.title}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-gray-600 italic block">
                            Not currently linked in active sections
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-gray-800/60">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => copyToClipboard(item.url, item._id)}
                          className="px-2 py-1 rounded-lg bg-gray-800/60 hover:bg-cyan-950 hover:text-cyan-300 text-gray-300 transition-colors text-xs flex items-center gap-1 cursor-pointer font-mono"
                          title="Copy Asset CDN URL"
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
                          title="Open CDN Asset in New Tab"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <button
                        onClick={() => handleDelete(item)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Permanently delete from Cloud CDN & registry"
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
