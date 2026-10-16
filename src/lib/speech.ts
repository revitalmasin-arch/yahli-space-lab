// Optional read-aloud using the device's speech synthesis. Never autoplays; one utterance at a time.

type Lang = 'he' | 'en';

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function voiceFor(lang: Lang): SpeechSynthesisVoice | undefined {
  if (!speechSupported()) return undefined;
  const voices = window.speechSynthesis.getVoices();
  const prefix = lang === 'he' ? ['he', 'iw'] : ['en'];
  return voices.find((v) => prefix.some((p) => v.lang.toLowerCase().startsWith(p)));
}

let listeners: ((speaking: boolean) => void)[] = [];
export function onSpeakingChange(fn: (speaking: boolean) => void): () => void {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}
const emit = (s: boolean) => listeners.forEach((l) => l(s));

export function stopSpeaking(): void {
  if (speechSupported()) window.speechSynthesis.cancel();
  emit(false);
}

/** Returns false if no suitable voice exists (caller shows a short message). */
export function speak(text: string, lang: Lang): boolean {
  if (!speechSupported()) return false;
  const voice = voiceFor(lang);
  if (!voice) return false;
  window.speechSynthesis.cancel(); // prevent overlapping playback
  const u = new SpeechSynthesisUtterance(text);
  u.voice = voice;
  u.lang = voice.lang;
  u.rate = lang === 'he' ? 0.85 : 0.95;
  u.onend = () => emit(false);
  u.onerror = () => emit(false);
  emit(true);
  window.speechSynthesis.speak(u);
  return true;
}
