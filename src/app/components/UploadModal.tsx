import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { UploadCloud, X, FileText, Loader2, CheckCircle } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadModal({ isOpen, onOpenChange }: UploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Pentadbiran');
  const [author, setAuthor] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !author) {
      alert("Sila lengkapkan semua maklumat dan pilih fail!");
      return;
    }
    
    setIsUploading(true);

    // Simulate an upload process for the UI
    setTimeout(() => {
      setIsUploading(false);
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
        onOpenChange(false);
        setTitle('');
        setAuthor('');
        setFile(null);
      }, 2000);
    }, 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#020604]/80 backdrop-blur-sm z-50 transition-opacity" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#05180d] border border-emerald-500/20 rounded-[24px] shadow-[0_16px_40px_0_rgba(0,0,0,0.85)] p-6 z-50 focus:outline-none">
          
          <div className="flex justify-between items-center mb-5">
            <Dialog.Title className="text-[#f5f7f2] font-extrabold tracking-widest uppercase text-sm flex items-center gap-2">
              <UploadCloud className="size-4 text-emerald-400" />
              Arkib Laporan Mesyuarat
            </Dialog.Title>
            <Dialog.Close className="text-[#f5f7f2]/50 hover:text-rose-400 transition-colors focus:outline-none">
              <X className="size-5" />
            </Dialog.Close>
          </div>

          {success ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <CheckCircle className="size-12 text-emerald-400 animate-pulse" />
              <p className="text-[#f5f7f2] font-bold tracking-widest uppercase text-xs">Muat Naik Berjaya!</p>
              <p className="text-[#f5f7f2]/50 text-[10px] text-center">Simulasi UI Berjalan Lancar.</p>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="flex flex-col gap-4">
              <div>
                <label className="block text-[9px] text-[#f5f7f2]/60 font-extrabold uppercase tracking-widest mb-1.5">Tajuk Laporan</label>
                <input 
                  required 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Contoh: Minit Mesyuarat Q3..." 
                  className="w-full bg-[#020a05] border border-emerald-900/60 rounded-xl py-2.5 px-3 text-xs text-[#f5f7f2] focus:border-emerald-500/50 outline-none font-medium" 
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-[9px] text-[#f5f7f2]/60 font-extrabold uppercase tracking-widest mb-1.5">Sektor / Jabatan</label>
                  <select 
                    value={department} 
                    onChange={(e) => setDepartment(e.target.value)} 
                    className="w-full bg-[#020a05] border border-emerald-900/60 rounded-xl py-2.5 px-3 text-xs text-[#f5f7f2] focus:border-emerald-500/50 outline-none font-bold"
                  >
                    <option value="Pentadbiran">Pentadbiran</option>
                    <option value="Kewangan">Kewangan</option>
                    <option value="Operasi">Operasi</option>
                    <option value="Aset">Aset</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-[9px] text-[#f5f7f2]/60 font-extrabold uppercase tracking-widest mb-1.5">Pegawai Pelapor</label>
                  <input 
                    required 
                    type="text" 
                    value={author} 
                    onChange={(e) => setAuthor(e.target.value)} 
                    placeholder="Nama Pegawai" 
                    className="w-full bg-[#020a05] border border-emerald-900/60 rounded-xl py-2.5 px-3 text-xs text-[#f5f7f2] focus:border-emerald-500/50 outline-none font-medium" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-[#f5f7f2]/60 font-extrabold uppercase tracking-widest mb-1.5">Fail PDF</label>
                <div className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-emerald-900/50 rounded-xl hover:bg-emerald-900/10 hover:border-emerald-500/50 transition-all cursor-pointer relative">
                  {file ? (
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold px-4 text-center truncate max-w-full">
                      <FileText className="size-4 flex-shrink-0" /> <span className="truncate">{file.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-[#f5f7f2]/40 text-xs pointer-events-none">
                      <UploadCloud className="size-5 mb-1 text-emerald-500/50" />
                      <span>Pilih fail atau seret ke sini</span>
                      <span className="text-[9px] font-mono text-emerald-600/60 font-bold uppercase tracking-widest">Format .PDF Sahaja</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                    onChange={handleFileChange} 
                  />
                </div>
              </div>

              <button 
                disabled={isUploading} 
                type="submit" 
                className="mt-2 w-full py-3 rounded-xl bg-emerald-400 text-black text-xs font-extrabold tracking-widest uppercase hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(52,211,153,0.15)]"
              >
                {isUploading ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
                {isUploading ? "Memproses Data..." : "Muat Naik (Simulasi)"}
              </button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}