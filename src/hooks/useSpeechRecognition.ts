import { useState, useCallback } from 'react';
import type { SpeechRecognitionInstance } from '@/types/speechRecognition';

export const useSpeechRecognition = (onTranscript: (text: string) => void) => {
  const [isActive, setIsActive] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const startDictation = useCallback(() => {
    try {
      if (isActive && recognition) {
        recognition.stop();
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        throw new Error('Spracheingabe wird nicht unterstützt');
      }
  
      const newRecognition = new SpeechRecognition();
      newRecognition.lang = 'de-DE';
      newRecognition.continuous = false;     // Changed to false
      newRecognition.interimResults = false; // Changed to false
  
      newRecognition.onstart = () => {
        setIsActive(true);
        console.log('Spracherkennung gestartet');
      };

      newRecognition.onend = () => {
        setIsActive(false);
        console.log('Spracherkennung beendet');
      };
      
      newRecognition.onerror = (event: any) => {
        console.error('Spracherkennungsfehler:', event.error);
        setIsActive(false);
      };
  
      newRecognition.onresult = (event: any) => {
        const finalTranscript = event.results[0][0].transcript;
        onTranscript(finalTranscript);
      };
  
      newRecognition.start();
      setRecognition(newRecognition);

    } catch (error) {
      console.error('Fehler bei der Spracherkennung:', error);
      setIsActive(false);
    }
  }, [isActive, onTranscript, recognition]);

  return { isActive, startDictation };
};