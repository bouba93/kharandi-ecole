import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { X, Bell, Send, CheckCheck, Smartphone } from 'lucide-react';

interface AlertsDrawerProps {
  onClose: () => void;
}

export const AlertsDrawer: React.FC<AlertsDrawerProps> = ({ onClose }) => {
  const { alerts } = useSchool();

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-[#18bfd6]" />
            <div>
              <h3 className="font-bold text-sm">Notifications Parentales Instantanées</h3>
              <p className="text-[10px] text-slate-400">Canal SMS / WhatsApp Guinée</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="p-6 flex-1 overflow-y-auto space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">Aucune alerte envoyée pour le moment.</p>
            </div>
          ) : (
            alerts.map((alt) => (
              <div
                key={alt.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-2xs hover:border-[#18bfd6]/40 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-[#18bfd6]" />
                    <span>{alt.studentName}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{alt.sentAt}</span>
                </div>

                <p className="text-xs text-slate-700 font-sans leading-relaxed mb-2 bg-white p-2.5 rounded-xl border border-slate-100">
                  {alt.message}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                  <span className="font-mono text-slate-600">Dest : {alt.parentPhone}</span>
                  <div className="flex items-center space-x-1 text-emerald-600 font-semibold">
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>{alt.channel} • {alt.status}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500">
            Inclus dans le <strong>Forfait Kharandi École 60 000 GNF/élève/an</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
