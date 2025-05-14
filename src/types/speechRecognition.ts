export interface SpeechRecognitionEvent {
  results: Array<{ 0: { transcript: string } }>;
  error?: { error: string };
}

export interface SpeechRecognitionInstance {
  start: () => void;
  stop: () => void;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart?: () => void;
  onerror?: (event: { error: string }) => void;
  onend?: () => void;
  onresult?: (event: SpeechRecognitionEvent) => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}