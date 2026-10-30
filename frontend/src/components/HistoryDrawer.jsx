import React from 'react';
import { History, Trash2, Download, ExternalLink, Clock, Layers } from 'lucide-react';
import { getDownloadUrl } from '../api/api';

export default function HistoryDrawer({ history = [], onSelect, onClear }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 pt-8 border-t border-slate-800/80">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2 text-slate-300">
          <History className="w-4 h-4 text-purple-400" />
          <h4 className="text-sm font-bold uppercase tracking-wider">
            Recent Colorizations ({history.length})
          </h4>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {history.map((item, idx) => (
          <div
            key={item.id || idx}
            onClick={() => onSelect(item)}
            className="group relative rounded-2xl overflow-hidden glass-card border border-white/5 hover:border-purple-500/50 p-2.5 transition-all hover:scale-[1.02] cursor-pointer shadow-lg"
          >
            {/* Split Thumbnail preview */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 mb-2">
              <img
                src={item.colorizedImage}
                alt="Colorized thumbnail"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/70 text-emerald-400 backdrop-blur-sm border border-emerald-500/20">
                {item.processingTimeMs ? `${item.processingTimeMs}ms` : 'GAN'}
              </div>
            </div>

            {/* Info */}
            <div className="px-1">
              <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-purple-300">
                {item.filename || 'Colorized Photo'}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                <span>{item.metadata?.width} × {item.metadata?.height}</span>
                <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

