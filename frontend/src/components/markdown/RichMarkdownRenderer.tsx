import React, { useState } from 'react';
import {
  Check, Copy, Info, AlertTriangle,
  ExternalLink, Sparkles, Bookmark, ShieldAlert,
  Maximize2, X, ChevronRight, Terminal
} from 'lucide-react';

// ── Inline Markdown Parser ──────────────────────────────────────────────────
// Supports: bold, italic, strikethrough, highlights (==text==), inline code, kbd, links
export const renderInlineMarkdown = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // 1. Link: [label](url)
    const linkMatch = remaining.match(/^\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      parts.push(
        <a
          key={keyIdx++}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 underline font-mono inline-flex items-center gap-1 mx-0.5 transition-colors"
        >
          <span>{linkMatch[1]}</span>
          <ExternalLink className="w-3 h-3 inline opacity-70" />
        </a>
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // 2. Inline Code: `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      parts.push(
        <code
          key={keyIdx++}
          className="px-1.5 py-0.5 rounded text-xs font-mono bg-[#11151c] text-cyan-300 border border-cyan-500/25 mx-0.5"
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // 3. Highlight: ==text==
    const highlightMatch = remaining.match(/^==([^=]+)==/);
    if (highlightMatch) {
      parts.push(
        <mark
          key={keyIdx++}
          className="px-1.5 py-0.5 rounded text-xs font-semibold bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 mx-0.5"
        >
          {highlightMatch[1]}
        </mark>
      );
      remaining = remaining.slice(highlightMatch[0].length);
      continue;
    }

    // 4. Strikethrough: ~~text~~
    const strikeMatch = remaining.match(/^~~([^~]+)~~/);
    if (strikeMatch) {
      parts.push(
        <del key={keyIdx++} className="line-through text-gray-400 opacity-75">
          {strikeMatch[1]}
        </del>
      );
      remaining = remaining.slice(strikeMatch[0].length);
      continue;
    }

    // 5. Bold: **text**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      parts.push(
        <strong key={keyIdx++} className="font-bold text-white">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // 6. Italic: *text*
    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      parts.push(
        <em key={keyIdx++} className="italic text-gray-200">
          {italicMatch[1]}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // 7. Keyboard Tag: <kbd>key</kbd>
    const kbdMatch = remaining.match(/^<kbd>(.*?)<\/kbd>/i);
    if (kbdMatch) {
      parts.push(
        <kbd
          key={keyIdx++}
          className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#181d28] text-gray-300 border border-gray-700 shadow-sm mx-0.5"
        >
          {kbdMatch[1]}
        </kbd>
      );
      remaining = remaining.slice(kbdMatch[0].length);
      continue;
    }

    // Accumulate regular text
    const nextSpecial = remaining.search(/(\[|`|==|~~|\*\*|\*|<kbd>)/i);
    if (nextSpecial === -1) {
      parts.push(remaining);
      break;
    } else if (nextSpecial > 0) {
      parts.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    } else {
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    }
  }

  return <>{parts}</>;
};

// ── Code Block with Syntax Highlighting & Copy Button ───────────────────────
export const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-cyan-500/20 bg-[#08090B] shadow-[0_0_30px_rgba(34,211,238,0.08)] group/code">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#0d1117] text-[11px] font-mono text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          <span className="text-cyan-400 font-semibold tracking-wider uppercase ml-1.5 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            <span>{language || 'TERMINAL'}</span>
          </span>
        </div>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-gray-800 bg-[#08090b] text-gray-300 hover:text-white hover:border-cyan-400/40 transition-colors cursor-pointer text-xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-mono">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="font-mono">Copy Code</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 sm:p-5 font-mono text-xs overflow-x-auto leading-relaxed flex">
        {lines.length > 1 && (
          <div className="select-none pr-4 text-gray-600 border-r border-gray-800 text-right shrink-0">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}
        <pre className="pl-4 text-cyan-200 overflow-x-auto w-full">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

// ── Markdown Table Component with Alignment Support ─────────────────────────
export const MarkdownTable: React.FC<{ rawTable: string }> = ({ rawTable }) => {
  const lines = rawTable.trim().split('\n').filter(Boolean);
  if (lines.length < 2) return null;

  const headerLine = lines[0];
  const separatorLine = lines[1];
  const bodyLines = lines.slice(2);

  const parseRow = (line: string) => {
    return line
      .split('|')
      .map((c) => c.trim())
      .filter((_, idx, arr) => idx !== 0 && idx !== arr.length - 1);
  };

  const alignments = separatorLine
    ? separatorLine
        .split('|')
        .map((c) => c.trim())
        .filter((_, idx, arr) => idx !== 0 && idx !== arr.length - 1)
        .map((col) => {
          if (col.startsWith(':') && col.endsWith(':')) return 'text-center';
          if (col.endsWith(':')) return 'text-right';
          return 'text-left';
        })
    : [];

  const headers = parseRow(headerLine);
  const rows = bodyLines.map(parseRow);

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-cyan-500/20 bg-[#08090B] shadow-[0_0_30px_rgba(34,211,238,0.06)]">
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead className="bg-[#0d1117] border-b border-cyan-500/20 text-cyan-300 uppercase tracking-wider">
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className={`px-4 py-3 font-bold ${alignments[i] || 'text-left'}`}
                >
                  {renderInlineMarkdown(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-300">
            {rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className="hover:bg-white/[0.02] transition-colors odd:bg-[#08090B] even:bg-[#0a0d13]"
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className={`px-4 py-3 leading-relaxed ${alignments[cIdx] || 'text-left'}`}
                  >
                    {renderInlineMarkdown(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Smart Block Splitter ────────────────────────────────────────────────────
// Prevents code blocks or multi-line tables with blank lines from breaking into fragments
export const splitMarkdownBlocks = (markdown: string): string[] => {
  const lines = markdown.split('\n');
  const blocks: string[] = [];
  let currentBlockLines: string[] = [];
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      currentBlockLines.push(line);
      if (!inCodeBlock) {
        blocks.push(currentBlockLines.join('\n'));
        currentBlockLines = [];
      }
      continue;
    }

    if (inCodeBlock) {
      currentBlockLines.push(line);
      continue;
    }

    if (trimmed === '') {
      if (currentBlockLines.length > 0) {
        blocks.push(currentBlockLines.join('\n'));
        currentBlockLines = [];
      }
    } else {
      currentBlockLines.push(line);
    }
  }

  if (currentBlockLines.length > 0) {
    blocks.push(currentBlockLines.join('\n'));
  }

  return blocks;
};

// ── Main Rich Markdown Renderer ─────────────────────────────────────────────
export const RichMarkdownRenderer: React.FC<{ content: string; enableLightbox?: boolean }> = ({
  content,
  enableLightbox = true,
}) => {
  const [activeLightboxImg, setActiveLightboxImg] = useState<{ url: string; alt: string } | null>(null);

  if (!content || !content.trim()) {
    return (
      <div className="text-gray-500 font-mono text-xs italic py-6 text-center border border-dashed border-gray-800 rounded-xl">
        No content written yet.
      </div>
    );
  }

  const blocks = splitMarkdownBlocks(content);

  return (
    <div className="space-y-6 text-gray-200 font-sans leading-relaxed">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();

        // 1. Standalone in-article image: ![alt](url)
        const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (imgMatch) {
          const alt = imgMatch[1];
          const url = imgMatch[2];
          return (
            <figure
              key={idx}
              className="my-8 rounded-2xl overflow-hidden border border-cyan-500/30 bg-[#08090B] shadow-[0_0_35px_rgba(34,211,238,0.12)] group/fig"
            >
              <div
                className={`overflow-hidden bg-[#050505] flex items-center justify-center relative ${
                  enableLightbox ? 'cursor-pointer' : ''
                }`}
                onClick={() => enableLightbox && setActiveLightboxImg({ url, alt })}
              >
                <img
                  src={url}
                  alt={alt || 'Article visual'}
                  className="w-full h-auto object-cover max-h-[550px] transition-transform duration-500 group-hover/fig:scale-[1.02]"
                  loading="lazy"
                />
                {enableLightbox && (
                  <div className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 opacity-0 group-hover/fig:opacity-100 transition-opacity text-cyan-300">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                )}
              </div>
              {alt && (
                <figcaption className="p-3 text-center text-xs font-mono text-cyan-300/80 border-t border-white/5 bg-[#0d1117]/90 flex items-center justify-center gap-1.5">
                  <span className="text-cyan-500">//</span>
                  <span>{alt}</span>
                </figcaption>
              )}
            </figure>
          );
        }

        // 2. Code blocks: ```lang ... ```
        if (trimmed.startsWith('```')) {
          const lines = trimmed.split('\n');
          const firstLine = lines[0].replace('```', '').trim();
          const code = lines.slice(1, -1).join('\n');
          return <CodeBlock key={idx} code={code} language={firstLine} />;
        }

        // 3. Markdown Tables: starts with | and contains table rows
        if (trimmed.startsWith('|') && (trimmed.includes('|---') || trimmed.includes('|:---') || trimmed.includes('| ---'))) {
          return <MarkdownTable key={idx} rawTable={trimmed} />;
        }

        // 4. Headings (H1 to H4) with dynamic anchor IDs
        if (trimmed.startsWith('# ')) {
          const headingText = trimmed.replace('# ', '');
          const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return (
            <h1
              key={idx}
              id={id}
              className="text-3xl sm:text-4xl font-heading font-extrabold text-white pt-8 pb-3 border-b border-white/10 tracking-tight flex items-center gap-2 group/h"
            >
              <span>{renderInlineMarkdown(headingText)}</span>
            </h1>
          );
        }
        if (trimmed.startsWith('## ')) {
          const headingText = trimmed.replace('## ', '');
          const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return (
            <h2
              key={idx}
              id={id}
              className="text-2xl sm:text-3xl font-heading font-bold text-white pt-7 pb-2 border-b border-cyan-500/20 tracking-tight flex items-center gap-2.5 group/h"
            >
              <span className="w-1.5 h-6 rounded-full bg-cyan-400 inline-block shrink-0" />
              <span>{renderInlineMarkdown(headingText)}</span>
            </h2>
          );
        }
        if (trimmed.startsWith('### ')) {
          const headingText = trimmed.replace('### ', '');
          return (
            <h3
              key={idx}
              className="text-xl sm:text-2xl font-heading font-semibold text-cyan-300 pt-5 tracking-tight flex items-center gap-2"
            >
              <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{renderInlineMarkdown(headingText)}</span>
            </h3>
          );
        }
        if (trimmed.startsWith('#### ')) {
          const headingText = trimmed.replace('#### ', '');
          return (
            <h4
              key={idx}
              className="text-lg font-heading font-semibold text-purple-300 pt-4 tracking-tight"
            >
              {renderInlineMarkdown(headingText)}
            </h4>
          );
        }

        // 5. GitHub-Style Callouts & Alerts
        if (trimmed.startsWith('> [!NOTE]') || trimmed.startsWith('> [!INFO]')) {
          const text = trimmed.replace(/^> \[[!A-Z]+\]\s*/, '').replace(/^> ?/gm, '');
          return (
            <div key={idx} className="p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 space-y-1.5 shadow-sm">
              <div className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>TECHNICAL NOTE</span>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed font-sans">{renderInlineMarkdown(text)}</p>
            </div>
          );
        }
        if (trimmed.startsWith('> [!TIP]')) {
          const text = trimmed.replace(/^> \[!TIP\]\s*/, '').replace(/^> ?/gm, '');
          return (
            <div key={idx} className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-1.5 shadow-sm">
              <div className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ARCHITECTURAL TIP &amp; OPTIMIZATION</span>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed font-sans">{renderInlineMarkdown(text)}</p>
            </div>
          );
        }
        if (trimmed.startsWith('> [!IMPORTANT]')) {
          const text = trimmed.replace(/^> \[!IMPORTANT\]\s*/, '').replace(/^> ?/gm, '');
          return (
            <div key={idx} className="p-5 rounded-2xl border border-purple-500/30 bg-purple-950/20 space-y-1.5 shadow-sm">
              <div className="font-mono text-xs uppercase tracking-wider text-purple-400 font-bold flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-purple-400 shrink-0" />
                <span>CRITICAL SPECIFICATION</span>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed font-sans">{renderInlineMarkdown(text)}</p>
            </div>
          );
        }
        if (trimmed.startsWith('> [!WARNING]')) {
          const text = trimmed.replace(/^> \[!WARNING\]\s*/, '').replace(/^> ?/gm, '');
          return (
            <div key={idx} className="p-5 rounded-2xl border border-amber-500/30 bg-amber-950/20 space-y-1.5 shadow-sm">
              <div className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>SYSTEM &amp; PERFORMANCE WARNING</span>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed font-sans">{renderInlineMarkdown(text)}</p>
            </div>
          );
        }
        if (trimmed.startsWith('> [!CAUTION]')) {
          const text = trimmed.replace(/^> \[!CAUTION\]\s*/, '').replace(/^> ?/gm, '');
          return (
            <div key={idx} className="p-5 rounded-2xl border border-rose-500/30 bg-rose-950/20 space-y-1.5 shadow-sm">
              <div className="font-mono text-xs uppercase tracking-wider text-rose-400 font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>SECURITY CAUTION</span>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed font-sans">{renderInlineMarkdown(text)}</p>
            </div>
          );
        }
        if (trimmed.startsWith('> ')) {
          const text = trimmed.replace(/^> ?/gm, '');
          return (
            <blockquote key={idx} className="p-5 rounded-2xl border-l-4 border-cyan-400 bg-[#0d1117] text-gray-300 italic text-sm sm:text-base leading-relaxed">
              "{renderInlineMarkdown(text)}"
            </blockquote>
          );
        }

        // 6. Horizontal divider: --- or *** or ___
        if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
          return <hr key={idx} className="my-8 border-t border-cyan-500/20" />;
        }

        // 7. Task lists: - [ ] or - [x]
        if (trimmed.split('\n').every((line) => /^[-*]\s+\[[ xX]\]\s+/.test(line.trim()))) {
          const items = trimmed.split('\n').map((l) => {
            const isChecked = /^[-*]\s+\[[xX]\]\s+/.test(l.trim());
            const text = l.trim().replace(/^[-*]\s+\[[ xX]\]\s+/, '');
            return { isChecked, text };
          });
          return (
            <div key={idx} className="space-y-2 p-4 rounded-xl border border-gray-800 bg-[#08090B]">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      item.isChecked
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
                        : 'border-gray-700 bg-gray-900/40 text-transparent'
                    }`}
                  >
                    {item.isChecked && <Check className="w-3 h-3" />}
                  </div>
                  <span className={item.isChecked ? 'line-through text-gray-500' : 'text-gray-300'}>
                    {renderInlineMarkdown(item.text)}
                  </span>
                </div>
              ))}
            </div>
          );
        }

        // 8. Bullet lists: - item or * item
        if (trimmed.split('\n').every((line) => /^[-*]\s+/.test(line.trim()))) {
          const items = trimmed.split('\n').map((l) => l.trim().replace(/^[-*]\s+/, ''));
          return (
            <ul key={idx} className="space-y-2 pl-4">
              {items.map((it, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                  <span>{renderInlineMarkdown(it)}</span>
                </li>
              ))}
            </ul>
          );
        }

        // 9. Numbered lists: 1. item
        if (trimmed.split('\n').every((line) => /^\d+\.\s+/.test(line.trim()))) {
          const items = trimmed.split('\n').map((l) => l.trim().replace(/^\d+\.\s+/, ''));
          return (
            <ol key={idx} className="space-y-2 pl-4 counter-reset">
              {items.map((it, i) => (
                <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-gray-300">
                  <span className="font-mono text-xs text-cyan-400 font-bold shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, '0')}.
                  </span>
                  <span>{renderInlineMarkdown(it)}</span>
                </li>
              ))}
            </ol>
          );
        }

        // 10. Default paragraph
        return (
          <p key={idx} className="text-sm sm:text-base text-gray-300 leading-relaxed">
            {renderInlineMarkdown(trimmed)}
          </p>
        );
      })}

      {/* Lightbox Modal for In-Article Images */}
      {activeLightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setActiveLightboxImg(null)}
        >
          <div
            className="max-w-5xl max-h-[90vh] flex flex-col items-center gap-3 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveLightboxImg(null)}
              className="absolute -top-10 right-0 text-gray-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activeLightboxImg.url}
              alt={activeLightboxImg.alt}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.2)]"
            />
            {activeLightboxImg.alt && (
              <p className="text-xs font-mono text-cyan-300 text-center">
                // {activeLightboxImg.alt}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Aliases for compatibility
export const RichMarkdownContent = RichMarkdownRenderer;
export default RichMarkdownRenderer;

