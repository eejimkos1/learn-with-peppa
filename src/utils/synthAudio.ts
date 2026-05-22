export function speakWord(word: string): void {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-GB';
  utterance.rate = 0.85;
  utterance.pitch = 1.1; // slightly higher for child-friendly
  speechSynthesis.speak(utterance);
}

export function speakSentence(sentence: string): void {
  const utterance = new SpeechSynthesisUtterance(sentence);
  utterance.lang = 'en-GB';
  utterance.rate = 0.8;
  utterance.pitch = 1.0;
  speechSynthesis.speak(utterance);
}

export function cancelSpeech(): void {
  speechSynthesis.cancel();
}

export function isSpeaking(): boolean {
  return speechSynthesis.speaking;
}
