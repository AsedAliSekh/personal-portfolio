import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, CheckCircle2, AlertCircle, Shield, Sparkles, Terminal } from 'lucide-react';
import { portfolioApi } from '../services/api';
import { IProfile } from '../types';

interface ContactSectionProps {
  profile: IProfile | null;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    projectType: 'Full Stack Development',
    budget: '$5k - $15k',
    timeline: '1-3 Months',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatusMessage({ type: 'error', text: 'Please fill in all mandatory transmission parameters (Name, Email, Message).' });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatusMessage(null);
      await portfolioApi.sendContactMessage(formData);
      setStatusMessage({
        type: 'success',
        text: 'Encrypted Massage Transmission successfuly! directly to Ased\'s inbox.',
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        projectType: 'Full Stack Development',
        budget: '$5k - $15k',
        timeline: '1-3 Months',
      });
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Transmission error. Please verify network status.';
      setStatusMessage({ type: 'error', text: errMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-28 border-t border-white/5 overflow-hidden" style={{ background: '#08090d' }}>
      {/* Background Matrix Pattern */}
      <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-500/4 blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Uplink Credentials */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="section-eyebrow">
                13 // CONTACT
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                Initiate{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  Contact
                </span>
              </h2>
            </div>

            <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
              Whether you are looking to architect high-throughput full stack platforms, train specialized neural networks, or conduct a rigorous security audit, let's engineer something extraordinary together.
            </p>

            <div className="p-5 rounded-2xl border border-white/6 bg-[#0d1117]/80 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-400/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">DIRECT EMAIL</div>
                  <a href={`mailto:${profile?.email || 'asedalisekh.dev@gmail.com'}`} className="text-sm font-mono text-cyan-300 hover:underline">
                    {profile?.email || 'asedalisekh.dev@gmail.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-950/50 border border-purple-400/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Location</div>
                  <div className="text-sm font-mono text-gray-300">
                    {profile?.location || 'Kolkata, India / Remote Worldwide'}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-cyan-500/15 bg-cyan-950/8 flex items-start gap-3 text-xs font-mono text-cyan-400/80">
              <span className="relative flex h-2 w-2 mt-0.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>Response: Within 24 Earth standard hours. Messages stored persistently in MongoDB cluster.</span>
            </div>
          </div>

          {/* Right Column: Encrypted Submission Form */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-10 rounded-3xl border border-white/8 bg-[#0d1117]/95 shadow-[0_0_50px_rgba(0,0,0,0.7)] backdrop-blur-xl relative overflow-hidden">
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
              <h3 className="font-heading font-bold text-white text-xl mb-6 flex items-center gap-2.5">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <span>Transmit Encrypted Massage</span>
              </h3>

              {statusMessage && (
                <div
                  className={`p-4 rounded-xl mb-6 text-xs font-mono flex items-center gap-2 ${statusMessage.type === 'success'
                    ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
                    }`}
                >
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-400 block">
                      NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 rounded-xl border border-white/8 bg-[#08090d] text-white text-xs font-mono focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all duration-200 placeholder-gray-700"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-400 block">
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="test@domain.org"
                      className="w-full px-4 py-3 rounded-xl border border-white/8 bg-[#08090d] text-white text-xs font-mono focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all duration-200 placeholder-gray-700"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-400 block">
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Project Inquiry / Engineering Collaboration"
                    className="w-full px-4 py-3 rounded-xl border border-white/8 bg-[#08090d] text-white text-xs font-mono focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all duration-200 placeholder-gray-700"
                  />
                </div>

                {/* Project Type & Budget Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-400 block">
                      OBJECTIVE
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-800 bg-[#08090B] text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                    >
                      <option>Full Stack Development</option>
                      <option>AI / ML Model Integration</option>
                      <option>Cybersecurity &amp; Code Audit</option>
                      <option>Three.js / WebGL Experience</option>
                      <option>Full-Time Technical Role</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-400 block">
                      PROJECT BUDGET
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-800 bg-[#08090B] text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                    >
                      <option>&lt; $5,000</option>
                      <option>$5,000 - $15,000</option>
                      <option>$15,000 - $35,000</option>
                      <option>$35,000+</option>
                      <option>Full-Time Compensation</option>
                      <option>Custom </option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-400 block">
                    MESSAGE *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe your technical objectives, stack preferences, or opportunities..."
                    className="w-full px-4 py-3 rounded-xl border border-white/8 bg-[#08090d] text-white text-xs font-mono focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all duration-200 resize-none placeholder-gray-700"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-cyber-primary py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm tracking-wider cursor-pointer font-bold disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-cyan-400" />
                  <span>{isSubmitting ? 'DISPATCHING PACKET...' : 'TRANSMIT ENCRYPTED MESSAGE'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
