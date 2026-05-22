let iosUnlocked = false;

function unlockiOSSpeech(): void {
  if (iosUnlocked) return;
  const utterance = new SpeechSynthesisUtterance('');
  utterance.volume = 0;
  utterance.lang = 'en-GB';
  speechSynthesis.speak(utterance);
  iosUnlocked = true;
}

export function speakWord(word: string): void {
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-GB';
  utterance.rate = 0.85;
  utterance.pitch = 1.1;
  utterance.volume = 1;
  speechSynthesis.speak(utterance);
}

export function speakSentence(sentence: string): void {
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(sentence);
  utterance.lang = 'en-GB';
  utterance.rate = 0.8;
  utterance.pitch = 1.0;
  utterance.volume = 1;
  speechSynthesis.speak(utterance);
}

export function cancelSpeech(): void {
  speechSynthesis.cancel();
}

export function isSpeaking(): boolean {
  return speechSynthesis.speaking;
}

export function initSpeechOnUserGesture(): void {
  unlockiOSSpeech();
}
