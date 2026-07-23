import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileVideo, FileAudio, X } from 'lucide-react';
import { Reveal } from './ScrollAnimations';

const EXPO = [0.16, 1, 0.3, 1];

const Upload = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const supportedFormats = ['.mp4', '.mov', '.avi', '.wav', '.mp3'];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const extension = '.' + selectedFile.name.split('.').pop().toLowerCase();
    if (supportedFormats.includes(extension)) {
      setFile(selectedFile);
    } else {
      alert('Unsupported file format. Please upload MP4, MOV, AVI, WAV, or MP3.');
    }
  };

  const handleAnalyze = () => {
    if (file) {
      onUpload(file);
    }
  };

  return (
    <section id="demo" className="py-24 relative z-30 bg-[var(--color-dark)]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <Reveal delay={0}>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Experience the <span className="gold-gradient-text">Engine</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-gray-400">Upload an audio or video clip of your dog to detect their emotional state.</p>
          </Reveal>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.75, delay: 0.18, ease: EXPO }}
          className={`relative p-1 rounded-3xl transition-all duration-300 ${
            isDragging ? 'bg-gradient-to-r from-[var(--color-gold)] to-yellow-600 shadow-[0_0_40px_rgba(244,180,0,0.4)]' : 'glass border border-white/10'
          }`}
        >
          <div 
            className={`bg-[var(--color-dark)] rounded-[22px] p-12 flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed transition-all duration-300 ${
              isDragging ? 'border-transparent' : 'border-gray-600 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div 
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className={`p-6 rounded-full mb-6 transition-all duration-300 ${isDragging ? 'bg-[rgba(244,180,0,0.2)] scale-110' : 'bg-white/5'}`}>
                    <UploadCloud className={`w-16 h-16 ${isDragging ? 'text-[var(--color-gold)]' : 'text-gray-400'}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Drag & Drop your media here</h3>
                  <p className="text-gray-400 mb-8">Supported formats: MP4, MOV, AVI, WAV, MP3</p>
                  
                  <div className="flex items-center gap-4 w-full max-w-sm">
                    <div className="h-px bg-gray-700 flex-1"></div>
                    <span className="text-gray-500 uppercase text-xs font-bold">OR</span>
                    <div className="h-px bg-gray-700 flex-1"></div>
                  </div>
                  
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-8 px-8 py-3 glass-gold text-[var(--color-gold)] font-bold rounded-xl hover:bg-[var(--color-gold)] hover:text-black transition-all"
                  >
                    Browse Files
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".mp4,.mov,.avi,.wav,.mp3" 
                    onChange={handleFileChange}
                  />
                </motion.div>
              ) : (
                <motion.div 
                  key="file"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center w-full max-w-md"
                >
                  <div className="w-full glass p-6 rounded-2xl flex items-center justify-between mb-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-gold)] to-transparent opacity-10"></div>
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="p-3 bg-white/10 rounded-xl">
                        {file.type.includes('video') ? (
                          <FileVideo className="text-[var(--color-gold)]" />
                        ) : (
                          <FileAudio className="text-[var(--color-gold)]" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-white truncate max-w-[200px]">{file.name}</p>
                        <p className="text-xs text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setFile(null)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors relative z-10"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleAnalyze}
                    className="w-full py-4 bg-gradient-to-r from-[var(--color-gold)] to-yellow-600 text-black font-bold text-lg rounded-xl hover:shadow-[0_0_20px_rgba(244,180,0,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Analyze Media
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Upload;
