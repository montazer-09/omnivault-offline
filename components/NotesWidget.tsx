
import React, { useState, useRef, useEffect } from 'react';
import { Note, VaultFile } from '../types';

interface NotesWidgetProps {
  notes: Note[];
  files: VaultFile[];
  onUpdate: (notes: Note[]) => void;
  lang: string;
}

export const NotesWidget: React.FC<NotesWidgetProps> = ({ notes, files, onUpdate, lang }) => {
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showAttachments, setShowAttachments] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const lastSavedContent = useRef<string>("");

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  useEffect(() => {
    if (editorRef.current && activeNote) {
      if (editorRef.current.innerHTML !== activeNote.content) {
        editorRef.current.innerHTML = activeNote.content;
        lastSavedContent.current = activeNote.content;
      }
    }
  }, [activeNoteId]);

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (editorRef.current && activeNote) {
        const currentContent = editorRef.current.innerHTML;
        if (currentContent !== lastSavedContent.current) {
          handleSave();
        }
      }
    }, 15000);
    return () => clearInterval(autoSaveInterval);
  }, [activeNoteId, notes]);

  const handleSave = () => {
    if (editorRef.current && activeNote) {
      setSaveStatus('saving');
      const content = editorRef.current.innerHTML;
      onUpdate(notes.map(n => n.id === activeNote.id ? { ...n, content, updatedAt: Date.now() } : n));
      lastSavedContent.current = content;
      setTimeout(() => setSaveStatus('saved'), 500);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleInput = () => {
    if (editorRef.current && activeNote) {
      const content = editorRef.current.innerHTML;
      onUpdate(notes.map(n => n.id === activeNote.id ? { ...n, content, updatedAt: Date.now() } : n));
    }
  };

  const attachFile = (fileId: string) => {
    if (!activeNote) return;
    const currentAttachments = activeNote.attachments || [];
    if (!currentAttachments.includes(fileId)) {
      onUpdate(notes.map(n => n.id === activeNote.id ? { ...n, attachments: [...currentAttachments, fileId] } : n));
    }
    setShowAttachments(false);
  };

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: lang === 'ar' ? "سجل استخباراتي جديد" : "New Classified Intel",
      content: "<div>...</div>",
      updatedAt: Date.now(),
      attachments: []
    };
    onUpdate([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const execCommand = (cmd: string) => {
    document.execCommand(cmd, false);
    editorRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-black/20 rounded-3xl border border-white/5 overflow-hidden relative">
      <div className="flex items-center space-x-2 p-4 bg-white/5 border-b border-white/5 overflow-x-auto custom-scrollbar">
        <button onClick={createNote} className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all whitespace-nowrap">
          <i className="fas fa-plus mr-2"></i> {lang === 'ar' ? 'سجل جديد' : 'NEW INTEL'}
        </button>
        {notes.map(n => (
          <button key={n.id} onClick={() => setActiveNoteId(n.id)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeNoteId === n.id ? 'bg-white/10 text-emerald-400' : 'text-white/30 hover:bg-white/5'}`}>
            {n.title.slice(0, 15)}
          </button>
        ))}
      </div>
      
      <div className="flex items-center justify-between p-3 px-6 bg-white/5 border-b border-white/5">
        <div className="flex items-center space-x-6">
          <button onClick={() => execCommand('bold')} className="text-white/40 hover:text-emerald-500"><i className="fas fa-bold"></i></button>
          <button onClick={() => execCommand('italic')} className="text-white/40 hover:text-emerald-500"><i className="fas fa-italic"></i></button>
          <button onClick={() => setShowAttachments(!showAttachments)} className="text-white/40 hover:text-emerald-500"><i className="fas fa-paperclip"></i></button>
        </div>
        <div className="text-[9px] font-black uppercase tracking-widest text-emerald-500/50">
          {saveStatus === 'saving' ? 'Syncing...' : saveStatus === 'saved' ? 'Saved' : 'Auto-Save'}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div 
          ref={editorRef}
          contentEditable={true}
          onInput={handleInput}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
          className={`flex-1 p-8 text-white/80 focus:outline-none overflow-y-auto custom-scrollbar prose prose-invert max-w-none ${lang === 'ar' ? 'text-right' : 'text-left'}`}
        />
        
        {activeNote?.attachments && activeNote.attachments.length > 0 && (
          <div className="w-48 bg-white/5 border-l border-white/5 p-4 overflow-y-auto custom-scrollbar hidden lg:block">
            <h5 className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-4">Attachments</h5>
            <div className="space-y-3">
              {activeNote.attachments.map(id => {
                const file = files.find(f => f.id === id);
                if (!file) return null;
                return (
                  <div key={id} className="p-2 bg-white/5 rounded-xl border border-white/10 text-center">
                    <i className={`fas ${file.type.startsWith('image/') ? 'fa-image' : 'fa-file-pdf'} text-emerald-500 mb-2`}></i>
                    <p className="text-[8px] text-white/60 truncate">{file.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showAttachments && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-8">
          <div className="bg-slate-900 border border-white/10 rounded-[3rem] w-full max-w-lg p-8">
            <div className="flex justify-between mb-6">
              <h4 className="text-emerald-500 font-black uppercase tracking-widest">Select Asset</h4>
              <button onClick={() => setShowAttachments(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="grid grid-cols-3 gap-4 h-64 overflow-y-auto custom-scrollbar pr-2">
              {files.map(f => (
                <button key={f.id} onClick={() => attachFile(f.id)} className="p-4 bg-white/5 rounded-2xl hover:bg-emerald-500/20 transition-all border border-white/5">
                  <i className={`fas ${f.type.startsWith('image/') ? 'fa-image' : 'fa-file-pdf'} text-xl text-emerald-500 mb-2`}></i>
                  <p className="text-[8px] text-white/40 truncate">{f.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
