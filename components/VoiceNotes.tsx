
import React, { useState, useRef } from 'react';
import { VoiceNote } from '../types';
import { getTranslation } from '../services/i18n';

export const VoiceNotes: React.FC<{ notes: VoiceNote[], onUpdate: (n: VoiceNote[]) => void, lang: string }> = ({ notes, onUpdate, lang }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [title, setTitle] = useState("");
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const t = (key: any) => getTranslation(lang, key);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    audioChunks.current = [];

    mediaRecorder.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const newNote: VoiceNote = {
          id: Date.now().toString(),
          title: title || `Log #${notes.length + 1}`,
          audioData: base64,
          duration: 0, // Simplified
          createdAt: Date.now()
        };
        onUpdate([newNote, ...notes]);
        setTitle("");
      };
    };

    mediaRecorder.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex space-x-2 mb-6 rtl:space-x-reverse">
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder={t('voice_placeholder')} 
          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500"
        />
        <button 
          onClick={isRecording ? stopRecording : startRecording} 
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-emerald-600'}`}
        >
          <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'} text-white`}></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
        {notes.map(note => (
          <div key={note.id} className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-center justify-between group">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center"><i className="fas fa-waveform text-emerald-500"></i></div>
              <div>
                <p className="font-bold text-white/90">{note.title}</p>
                <p className="text-[10px] text-white/20 uppercase tracking-widest">{new Date(note.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <button onClick={() => new Audio(note.audioData).play()} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-all">
              <i className="fas fa-play text-xs"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
