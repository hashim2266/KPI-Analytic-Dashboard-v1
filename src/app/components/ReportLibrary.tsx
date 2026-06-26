import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, BookOpen, Search, FileText, ExternalLink, Calendar } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  department: string;
  author: string;
  pdf_url: string;
  created_at: string;
}

interface ReportLibraryProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Minit Mesyuarat Pengurusan Q1 2026',
    department: 'Pentadbiran',
    author: 'Ahmad Faiz',
    pdf_url: '#',
    created_at: '2026-06-15T08:00:00Z'
  },
  {
    id: '2',
    title: 'Laporan Audit Kewangan Tahunan',
    department: 'Kewangan',
    author: 'Nurul Huda',
    pdf_url: '#',
    created_at: '2026-06-10T10:30:00Z'
  },
  {
    id: '3',
    title: 'Penilaian Prestasi Aset Suku Kedua',
    department: 'Aset',
    author: 'Kamal Ariffin',
    pdf_url: '#',
    created_at: '2026-06-05T14:15:00Z'
  },
  {
    id: '4',
    title: 'Status Operasi MyPPSM',
    department: 'Operasi',
    author: 'Sarah Lin',
    pdf_url: '#',
    created_at: '2026-06-01T09:00:00Z'
  }
];

export function ReportLibrary({ isOpen, onOpenChange }: ReportLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = mockReports.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#020604]/85 backdrop-blur-sm z-50 transition-opacity" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[85vh] flex flex-col bg-[#05180d] border border-emerald-500/20 rounded-[24px] shadow-[0_16px_60px_0_rgba(0,0,0,0.9)] overflow-hidden z-50 focus:outline-none">
          
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-emerald-900/40 bg-gradient-to-r from-emerald-950/20 to-transparent">
            <Dialog.Title className="text-[#f5f7f2] font-extrabold tracking-widest uppercase text-sm flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <BookOpen className="size-4 text-emerald-400" />
              </div>
              Report Library
            </Dialog.Title>
            <Dialog.Close className="text-[#f5f7f2]/50 hover:text-rose-400 transition-colors p-2 rounded-lg hover:bg-rose-500/10 focus:outline-none">
              <X className="size-5" />
            </Dialog.Close>
          </div>

          {/* Search Bar */}
          <div className="p-6 pb-2">
            <div className="relative">
              <input 
                type="text"
                placeholder="Cari berdasarkan tajuk, jabatan, atau pengarang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#020a05] border border-emerald-900/60 rounded-xl py-3 pl-10 pr-4 text-xs text-[#f5f7f2] placeholder-[#f5f7f2]/30 focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
              />
              <Search className="absolute left-3.5 top-3.5 size-4 text-[#f5f7f2]/40" />
            </div>
          </div>

          {/* Report List */}
          <div className="flex-1 overflow-y-auto p-6 pt-4 scrollbar-thin scrollbar-thumb-emerald-900/50 scrollbar-track-transparent">
            {filteredReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 border-2 border-dashed border-emerald-900/30 rounded-2xl bg-[#020a05]/30">
                <FileText className="size-8 text-[#f5f7f2]/20" />
                <p className="text-[#f5f7f2]/50 text-xs font-bold tracking-wider uppercase">Tiada laporan ditemui.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 rounded-xl border border-emerald-900/30 bg-[#020a05]/50 hover:bg-emerald-950/40 hover:border-emerald-500/40 transition-all group shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-emerald-900/20 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all">
                        <FileText className="size-5" />
                      </div>
                      <div>
                        <h4 className="text-[#f5f7f2] text-xs font-extrabold uppercase tracking-wider mb-1">{report.title}</h4>
                        <div className="flex items-center gap-3 text-[9px] text-[#f5f7f2]/50 font-bold tracking-widest uppercase">
                          <span className="text-emerald-400/80 px-1.5 py-0.5 rounded bg-emerald-950/50 border border-emerald-900/50">{report.department}</span>
                          <span className="flex items-center gap-1"><Calendar className="size-2.5" /> {new Date(report.created_at).toLocaleDateString('ms-MY')}</span>
                          <span>Oleh: {report.author}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert(`Buka ${report.title} (Hanya UI)`)}
                      className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold tracking-widest uppercase flex items-center gap-2 hover:bg-emerald-400 hover:text-black transition-all"
                    >
                      Buka PDF <ExternalLink className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}