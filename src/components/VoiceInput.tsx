import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInputProps {
  onResult: (text: string) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  lang?: string;
  showText?: boolean;
}

export default function VoiceInput({ onResult, isListening, setIsListening, lang = 'hi-IN', showText = false }: VoiceInputProps) {
  const [recognition, setRecognition] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.interimResults = false;
        reco.lang = lang;
        
        reco.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          onResult(text);
          setIsListening(false);
          setErrorMsg('');
        };
        
        reco.onerror = (event: any) => {
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setErrorMsg('Microphone access denied. Please allow it in your browser settings.');
          } else if (event.error === 'no-speech') {
            setErrorMsg('No speech detected. Please try again.');
          } else {
            setErrorMsg('Audio capture failed. Please check your microphone.');
          }
          
          setTimeout(() => setErrorMsg(''), 4000);
        };
        
        reco.onend = () => {
          setIsListening(false);
        };
        
        setRecognition(reco);
      }
    }
  }, [onResult, setIsListening, lang]);

  if (!recognition) return null;

  return (
    <div className="relative inline-flex items-center">
      {errorMsg && (
        <div className="absolute bottom-full mb-2 right-0 bg-red-100 text-red-700 text-xs px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap z-10">
          {errorMsg}
        </div>
      )}
      {isListening && showText && (
        <div className="absolute right-full mr-2 text-red-500 text-xs font-medium animate-pulse whitespace-nowrap">
          Listening... / सुन रहे हैं...
        </div>
      )}
      <button
        type="button"
        onClick={() => {
          if (isListening) {
            recognition.stop();
            setIsListening(false);
          } else {
            try {
              recognition.start();
              setIsListening(true);
              setErrorMsg('');
            } catch (err) {
              console.error(err);
              setIsListening(false);
            }
          }
        }}
        className={`p-2 flex items-center justify-center rounded-full transition-colors ${
          isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
        title="Speak to type"
      >
        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </button>
    </div>
  );
}
