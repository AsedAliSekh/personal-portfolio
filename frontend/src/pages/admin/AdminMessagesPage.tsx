import React, { useEffect, useState } from 'react';
import { Mail, Check, Trash2, Archive, Clock, User, DollarSign, Calendar, MessageSquare } from 'lucide-react';
import { AdminDashboardLayout } from './AdminDashboardLayout';
import { portfolioApi } from '../../services/api';
import { IMessage } from '../../types';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<IMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const res = await portfolioApi.getMessages();
      setMessages(res.data);
      if (res.data.length > 0 && !selectedMsg) {
        setSelectedMsg(res.data[0]);
      }
    } catch (e) {
      console.error('Failed to fetch messages', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id: string, isRead: boolean) => {
    try {
      const updated = await portfolioApi.markMessageRead(id, isRead);
      setMessages(messages.map(m => m._id === id ? updated : m));
      if (selectedMsg?._id === id) setSelectedMsg(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete message permanently?')) return;
    try {
      await portfolioApi.deleteMessage(id);
      const remaining = messages.filter(m => m._id !== id);
      setMessages(remaining);
      setSelectedMsg(remaining.length > 0 ? remaining[0] : null);
    } catch (e) {
      alert('Failed to delete message');
    }
  };

  return (
    <AdminDashboardLayout activeSection="Inbox Messages">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-white">
              Visitor Transmissions Inbox
            </h1>
            <p className="text-xs font-mono text-gray-400">
              Inquiries, recruiter contacts, and collaboration requests received through encrypted uplink.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-cyan-300">
            {messages.filter(m => !m.isRead).length} Unread
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-gray-800 bg-[#0d1117] font-mono text-xs text-gray-500">
            No incoming transmissions recorded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 min-h-[500px]">
            {/* Messages List (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-gray-800 bg-[#0d1117] overflow-y-auto max-h-[320px] lg:max-h-[650px] divide-y divide-gray-800/60">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => {
                    setSelectedMsg(msg);
                    if (!msg.isRead) handleMarkRead(msg._id, true);
                  }}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedMsg?._id === msg._id
                      ? 'bg-cyan-500/10 border-l-4 border-l-cyan-400'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-heading font-bold text-white text-sm flex items-center gap-1.5">
                      {!msg.isRead && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />}
                      <span className="truncate">{msg.name}</span>
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 shrink-0 ml-2">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-cyan-400 truncate mb-1">
                    {msg.subject || 'No Subject'}
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-2 font-sans">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>

            {/* Message Detail Pane (7 cols) */}
            <div className="lg:col-span-7 rounded-2xl border border-gray-800 bg-[#0d1117] p-4 sm:p-8 flex flex-col justify-between">
              {selectedMsg ? (
                <div className="space-y-6">
                  {/* Header info */}
                  <div className="flex items-start justify-between pb-6 border-b border-gray-800">
                    <div>
                      <h2 className="text-xl font-heading font-bold text-white">
                        {selectedMsg.subject || 'Project Inquiry'}
                      </h2>
                      <div className="text-xs font-mono text-cyan-400 mt-1">
                        From: {selectedMsg.name} &lt;<a href={`mailto:${selectedMsg.email}`} className="underline">{selectedMsg.email}</a>&gt;
                      </div>
                      <div className="text-[11px] font-mono text-gray-500 mt-0.5">
                        Received: {new Date(selectedMsg.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(selectedMsg._id)}
                        className="p-2 rounded-xl border border-gray-800 hover:border-rose-500 hover:text-rose-400 transition-colors"
                        title="Delete Message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata Chips */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-gray-800 bg-[#08090B] text-xs font-mono text-gray-300">
                    <div>
                      <span className="text-gray-500 block text-[10px]">DOMAIN TYPE</span>
                      <span className="text-cyan-300">{selectedMsg.projectType || 'General Influx'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">BUDGET TIER</span>
                      <span className="text-emerald-400">{selectedMsg.budget || 'Unspecified'}</span>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="p-4 rounded-xl border border-white/5 bg-[#08090B]/60 text-sm font-sans text-gray-200 leading-relaxed whitespace-pre-line min-h-[160px]">
                    {selectedMsg.message}
                  </div>

                  <div className="pt-4">
                    <a
                      href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject || 'Portfolio Inquiry')}`}
                      className="btn-cyber-primary px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4 text-cyan-400" />
                      <span>Reply via Email Direct</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-xs font-mono text-gray-500">
                  Select a transmission from the left pane to view message details.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};
