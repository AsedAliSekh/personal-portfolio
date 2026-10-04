import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Award, ExternalLink, Calendar, MapPin, Eye, X, ZoomIn, ShieldCheck } from 'lucide-react';
import { IEducation, ICertification } from '../types';

interface EducationCertificationsSectionProps {
  education: IEducation[];
  certifications: ICertification[];
  showEducation?: boolean;
  showCertifications?: boolean;
}

export const EducationCertificationsSection: React.FC<EducationCertificationsSectionProps> = ({
  education,
  certifications,
  showEducation = true,
  showCertifications = true,
}) => {
  const [selectedCert, setSelectedCert] = useState<ICertification | null>(null);

  // If neither section is enabled, do not render the container
  if (!showEducation && !showCertifications) {
    return null;
  }

  const isTwoColumn = showEducation && showCertifications;

  return (
    <section id="education" className="relative py-28 border-t border-white/5 overflow-hidden" style={{ background: '#050508' }}>
      {/* Background Matrix Pattern */}
      <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full bg-cyan-500/4 blur-[130px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={isTwoColumn ? "grid grid-cols-1 lg:grid-cols-2 gap-14" : "max-w-4xl mx-auto"}>
          {/* Left Column: Education (07 // ACADEMIC FOUNDATION) */}
          {showEducation && (
            <div>
              <div className="space-y-3 mb-10">
                <div className="section-eyebrow">
                  07 // ACADEMIC FOUNDATION
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  Education{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"> &amp; Theory</span>
                </h2>
              </div>

              <div className="space-y-6">
                {education.map((edu, i) => (
                  <motion.div
                    key={edu._id || edu.degree}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="p-6 rounded-2xl border border-white/6 bg-[#0d1117] hover:border-cyan-400/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.07)] transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-heading font-bold text-white text-lg sm:text-xl">
                          {edu.degree}
                        </h3>
                        <div className="text-sm font-mono text-cyan-400 font-medium mt-0.5">
                          {edu.institution}
                        </div>
                      </div>
                      {edu.grade && (
                        <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-400/30 text-cyan-300 shrink-0">
                          {edu.grade}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {edu.startYear} — {edu.endYear}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {edu.location}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-300 mt-3 font-sans leading-relaxed">
                      {edu.description}
                    </p>

                    {/* Coursework Tags */}
                    {edu.coursework && edu.coursework.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-white/5">
                        <span className="text-[11px] font-mono text-gray-500 uppercase block mb-1.5">
                          Key Rigorous Coursework //
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {edu.coursework.map((c) => (
                            <span
                              key={c}
                              className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#11151c] text-gray-300 border border-gray-800"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Right Column: Certifications (08 // INDUSTRY ACCREDITATIONS) */}
          {showCertifications && (
            <div>
              <div className="space-y-3 mb-10">
                <div className="section-eyebrow" style={{ color: '#a78bfa' }}>
                  08 // INDUSTRY ACCREDITATIONS
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  Verified{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Credentials</span>
                </h2>
              </div>

              <div className="space-y-4">
                {certifications.map((cert, i) => (
                  <motion.div
                    key={cert._id || cert.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="p-5 rounded-2xl border border-white/6 bg-[#0d1117] hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.08)] transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Certificate Thumbnail or Fallback Icon */}
                      {cert.certificateImageUrl ? (
                        <div
                          onClick={() => setSelectedCert(cert)}
                          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-purple-500/30 bg-[#08090b] shrink-0 group/thumb cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all"
                          title="Click to view full certificate"
                        >
                          <img
                            src={cert.certificateImageUrl}
                            alt={cert.title}
                            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-[10px] font-mono text-purple-200">
                            <Eye className="w-4 h-4 text-purple-300" />
                            <span>PREVIEW</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl border border-purple-500/20 bg-purple-950/20 flex items-center justify-center shrink-0 text-purple-400">
                          <Award className="w-6 h-6" />
                        </div>
                      )}

                      {/* Certification Details */}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-heading font-bold text-white text-base sm:text-lg">
                            {cert.title}
                          </h3>
                        </div>
                        <div className="text-xs font-mono text-purple-400">
                          {cert.issuer} • Issued {cert.issueDate}
                          {cert.expirationDate && ` · Expires ${cert.expirationDate}`}
                        </div>
                        {cert.description && (
                          <p className="text-xs text-gray-400 font-sans line-clamp-2">
                            {cert.description}
                          </p>
                        )}
                        {cert.credentialId && (
                          <div className="text-[10px] font-mono text-gray-500 pt-0.5">
                            ID: {cert.credentialId}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {cert.certificateImageUrl && (
                        <button
                          onClick={() => setSelectedCert(cert)}
                          className="px-3 py-2 rounded-xl border border-purple-500/20 bg-[#11151c] text-purple-300 hover:text-white hover:border-purple-400/50 hover:bg-purple-950/30 transition-all flex items-center gap-1.5 text-xs font-mono cursor-pointer"
                          title="View Certificate"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Inspect</span>
                        </button>
                      )}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl border border-gray-800 bg-[#11151c] text-purple-300 hover:text-white hover:border-purple-400/40 transition-colors shrink-0 flex items-center gap-1.5 text-xs font-mono"
                          title="Verify Credential"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="hidden sm:inline">Verify</span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Certificate Image Lightbox Modal */}
      <AnimatePresence>
        {selectedCert && selectedCert.certificateImageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#0d1117] border border-purple-500/40 rounded-3xl p-5 sm:p-6 shadow-[0_0_60px_rgba(168,85,247,0.25)] cursor-default overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-base sm:text-lg">
                      {selectedCert.title}
                    </h3>
                    <p className="text-xs font-mono text-purple-300/80">
                      {selectedCert.issuer} • Issued {selectedCert.issueDate}
                      {selectedCert.credentialId && ` • ID: ${selectedCert.credentialId}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedCert.credentialUrl && (
                    <a
                      href={selectedCert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-950/30 text-purple-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Verify Online</span>
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="p-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Full Certificate Image */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/80 flex items-center justify-center flex-1 min-h-0">
                <img
                  src={selectedCert.certificateImageUrl}
                  alt={selectedCert.title}
                  className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                />
              </div>

              {selectedCert.description && (
                <div className="pt-3 text-xs text-gray-400 font-sans shrink-0">
                  {selectedCert.description}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
