import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Brain, Shield, Sparkles, Quote, Star, Check } from 'lucide-react';
import { IService, ITestimonial } from '../types';

interface ServicesTestimonialsSectionProps {
  services: IService[];
  testimonials: ITestimonial[];
  showServices?: boolean;
  showTestimonials?: boolean;
}

const getServiceIcon = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case 'layers': return <Layers className="w-6 h-6 text-cyan-400" />;
    case 'brain': return <Brain className="w-6 h-6 text-purple-400" />;
    case 'shield': return <Shield className="w-6 h-6 text-emerald-400" />;
    case 'sparkles': return <Sparkles className="w-6 h-6 text-amber-300" />;
    default: return <Layers className="w-6 h-6 text-cyan-400" />;
  }
};

const TestimonialAvatar: React.FC<{ name: string; photoUrl?: string }> = ({ name, photoUrl }) => {
  const [imageFailed, setImageFailed] = React.useState(false);

  // Compute initials (e.g. Salim Aarav -> SA, Evelyn Vance -> EV, John -> J)
  const initials = React.useMemo(() => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [name]);

  const hasValidPhoto = Boolean(photoUrl && photoUrl.trim() && !imageFailed);

  return (
    <div className="relative shrink-0">
      {/* Outer cyber ring */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl p-[1.5px] bg-gradient-to-br from-purple-500/50 via-cyan-500/30 to-purple-800/40 shadow-[0_0_20px_rgba(168,85,247,0.18)] transition-all duration-300">
        <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#08090B] flex items-center justify-center relative">
          {hasValidPhoto ? (
            <img
              src={photoUrl}
              alt={name}
              onError={() => setImageFailed(true)}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-950/90 via-[#10141d] to-cyan-950/80 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-grid-cyber opacity-20 pointer-events-none" />
              <span className="font-mono font-bold text-xs sm:text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300 tracking-wider z-10">
                {initials}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Verified Pulse Indicator */}
      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0d1117] border border-purple-500/40 flex items-center justify-center shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </div>
    </div>
  );
};

export const ServicesTestimonialsSection: React.FC<ServicesTestimonialsSectionProps> = ({
  services,
  testimonials,
  showServices = true,
  showTestimonials = true,
}) => {
  const enabledServices = showServices ? services.filter(s => s.enabled) : [];
  const publishedTestimonials = showTestimonials ? testimonials.filter(t => t.published) : [];

  if (!showServices && !showTestimonials) {
    return null;
  }

  return (
    <section className="relative py-24 bg-[#050505] border-t border-cyan-500/10 overflow-hidden">
      {/* Background Matrix Pattern */}
      <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* 1. Services Section */}
        {enabledServices.length > 0 && (
          <div>
            <div className="space-y-2 mb-14 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                09 // PROFESSIONAL CAPABILITIES
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Architectural &nbsp;
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  &amp; Development Services
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {enabledServices.map((service, i) => (
                <motion.div
                  key={service._id || service.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="p-6 rounded-2xl border border-gray-800 bg-[#0d1117] hover:border-cyan-400/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.12)] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center">
                      {getServiceIcon(service.icon)}
                    </div>
                    <h3 className="font-heading font-bold text-white text-lg">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {service.features && service.features.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-white/5 space-y-1.5">
                      {service.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-mono text-gray-300">
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Testimonials Section */}
        {publishedTestimonials.length > 0 && (
          <div>
            <div className="space-y-2 mb-12 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-purple-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                10 // TESTIMONIALS
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                What Engineering &nbsp;
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  Leaders Say
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {publishedTestimonials.map((t, idx) => (
                <motion.div
                  key={t._id || t.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.1 }}
                  className="p-8 rounded-2xl border border-gray-800 bg-[#0d1117] hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] transition-all relative flex flex-col justify-between"
                >
                  <Quote className="w-8 h-8 text-purple-400/20 absolute top-6 right-6" />

                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-4">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>

                    <p className="text-sm sm:text-base text-gray-300 font-sans italic leading-relaxed mb-6">
                      "{t.content}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-white/5 gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <TestimonialAvatar name={t.name} photoUrl={t.photoUrl} />
                      <div className="min-w-0">
                        <h4 className="font-heading font-bold text-white text-base truncate">
                          {t.name}
                        </h4>
                        <p className="text-xs font-mono text-purple-400 truncate">
                          {t.role} • {t.company}
                        </p>
                      </div>
                    </div>

                    {t.linkedinUrl && (
                      <a
                        href={t.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline shrink-0"
                      >
                        LinkedIn Profile →
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
