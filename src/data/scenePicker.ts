export interface ScenePickerItem {
  word: string;
  wordGreek: string;
  emoji: string;
  belongs: boolean;
}

export interface ScenePickerConfig {
  worldId: string;
  sceneName: string;
  sceneNameGreek: string;
  sceneEmoji: string;
  sceneBackground: string;
  items: ScenePickerItem[];
}

export const SCENE_PICKER_DATA: ScenePickerConfig[] = [
  {
    worldId: 'house',
    sceneName: 'The Kitchen',
    sceneNameGreek: 'Η Κουζίνα',
    sceneEmoji: '🍳',
    sceneBackground: 'linear-gradient(180deg, #FFECD2 0%, #FCB69F 100%)',
    items: [
      { word: 'plate', wordGreek: 'πιάτο', emoji: '🍽️', belongs: true },
      { word: 'cup', wordGreek: 'φλιτζάνι', emoji: '☕', belongs: true },
      { word: 'spoon', wordGreek: 'κουτάλι', emoji: '🥄', belongs: true },
      { word: 'fridge', wordGreek: 'ψυγείο', emoji: '🧊', belongs: true },
      { word: 'cake', wordGreek: 'τούρτα', emoji: '🎂', belongs: true },
      { word: 'apple', wordGreek: 'μήλο', emoji: '🍎', belongs: true },
      { word: 'car', wordGreek: 'αυτοκίνητο', emoji: '🚗', belongs: false },
      { word: 'tree', wordGreek: 'δέντρο', emoji: '🌳', belongs: false },
      { word: 'ball', wordGreek: 'μπάλα', emoji: '⚽', belongs: false },
      { word: 'fish', wordGreek: 'ψάρι', emoji: '🐟', belongs: false },
    ],
  },
  {
    worldId: 'park',
    sceneName: 'The Park',
    sceneNameGreek: 'Το Πάρκο',
    sceneEmoji: '🌳',
    sceneBackground: 'linear-gradient(180deg, #87CEEB 0%, #87CEEB 60%, #4CAF50 60%, #4CAF50 100%)',
    items: [
      { word: 'tree', wordGreek: 'δέντρο', emoji: '🌳', belongs: true },
      { word: 'flower', wordGreek: 'λουλούδι', emoji: '🌸', belongs: true },
      { word: 'swing', wordGreek: 'κούνια', emoji: '🎠', belongs: true },
      { word: 'bird', wordGreek: 'πουλί', emoji: '🐦', belongs: true },
      { word: 'butterfly', wordGreek: 'πεταλούδα', emoji: '🦋', belongs: true },
      { word: 'bench', wordGreek: 'παγκάκι', emoji: '🪑', belongs: true },
      { word: 'bed', wordGreek: 'κρεβάτι', emoji: '🛏️', belongs: false },
      { word: 'computer', wordGreek: 'υπολογιστής', emoji: '💻', belongs: false },
      { word: 'plate', wordGreek: 'πιάτο', emoji: '🍽️', belongs: false },
      { word: 'book', wordGreek: 'βιβλίο', emoji: '📖', belongs: false },
    ],
  },
  {
    worldId: 'school',
    sceneName: 'The Classroom',
    sceneNameGreek: 'Η Τάξη',
    sceneEmoji: '🏫',
    sceneBackground: 'linear-gradient(180deg, #BBDEFB 0%, #90CAF9 100%)',
    items: [
      { word: 'book', wordGreek: 'βιβλίο', emoji: '📖', belongs: true },
      { word: 'pencil', wordGreek: 'μολύβι', emoji: '✏️', belongs: true },
      { word: 'teacher', wordGreek: 'δασκάλα', emoji: '👩‍🏫', belongs: true },
      { word: 'desk', wordGreek: 'θρανίο', emoji: '🪑', belongs: true },
      { word: 'bag', wordGreek: 'τσάντα', emoji: '🎒', belongs: true },
      { word: 'ruler', wordGreek: 'χάρακας', emoji: '📏', belongs: true },
      { word: 'sun', wordGreek: 'ήλιος', emoji: '☀️', belongs: false },
      { word: 'boat', wordGreek: 'βάρκα', emoji: '⛵', belongs: false },
      { word: 'ice cream', wordGreek: 'παγωτό', emoji: '🍦', belongs: false },
      { word: 'lion', wordGreek: 'λιοντάρι', emoji: '🦁', belongs: false },
    ],
  },
  {
    worldId: 'supermarket',
    sceneName: 'The Supermarket',
    sceneNameGreek: 'Το Σούπερ Μάρκετ',
    sceneEmoji: '🛒',
    sceneBackground: 'linear-gradient(180deg, #E1BEE7 0%, #CE93D8 100%)',
    items: [
      { word: 'cart', wordGreek: 'καρότσι', emoji: '🛒', belongs: true },
      { word: 'bread', wordGreek: 'ψωμί', emoji: '🍞', belongs: true },
      { word: 'milk', wordGreek: 'γάλα', emoji: '🥛', belongs: true },
      { word: 'banana', wordGreek: 'μπανάνα', emoji: '🍌', belongs: true },
      { word: 'cheese', wordGreek: 'τυρί', emoji: '🧀', belongs: true },
      { word: 'juice', wordGreek: 'χυμός', emoji: '🧃', belongs: true },
      { word: 'elephant', wordGreek: 'ελέφαντας', emoji: '🐘', belongs: false },
      { word: 'swing', wordGreek: 'κούνια', emoji: '🎠', belongs: false },
      { word: 'star', wordGreek: 'αστέρι', emoji: '⭐', belongs: false },
      { word: 'pencil', wordGreek: 'μολύβι', emoji: '✏️', belongs: false },
    ],
  },
  {
    worldId: 'beach',
    sceneName: 'The Beach',
    sceneNameGreek: 'Η Παραλία',
    sceneEmoji: '🏖️',
    sceneBackground: 'linear-gradient(180deg, #87CEEB 0%, #87CEEB 55%, #F4A460 55%, #F4A460 100%)',
    items: [
      { word: 'sunglasses', wordGreek: 'γυαλιά ηλίου', emoji: '🕶️', belongs: true },
      { word: 'towel', wordGreek: 'πετσέτα', emoji: '🏖️', belongs: true },
      { word: 'swimsuit', wordGreek: 'μαγιό', emoji: '👙', belongs: true },
      { word: 'bucket', wordGreek: 'κουβαδάκι', emoji: '🪣', belongs: true },
      { word: 'shell', wordGreek: 'κοχύλι', emoji: '🐚', belongs: true },
      { word: 'sun cream', wordGreek: 'αντηλιακό', emoji: '🧴', belongs: true },
      { word: 'umbrella', wordGreek: 'ομπρέλα', emoji: '⛱️', belongs: true },
      { word: 'scarf', wordGreek: 'κασκόλ', emoji: '🧣', belongs: false },
      { word: 'gloves', wordGreek: 'γάντια', emoji: '🧤', belongs: false },
      { word: 'snowman', wordGreek: 'χιονάνθρωπος', emoji: '⛄', belongs: false },
    ],
  },
  {
    worldId: 'zoo',
    sceneName: 'The Zoo',
    sceneNameGreek: 'Ο Ζωολογικός',
    sceneEmoji: '🦁',
    sceneBackground: 'linear-gradient(180deg, #B2DFDB 0%, #80CBC4 60%, #A5D6A7 100%)',
    items: [
      { word: 'lion', wordGreek: 'λιοντάρι', emoji: '🦁', belongs: true },
      { word: 'elephant', wordGreek: 'ελέφαντας', emoji: '🐘', belongs: true },
      { word: 'monkey', wordGreek: 'μαϊμού', emoji: '🐒', belongs: true },
      { word: 'parrot', wordGreek: 'παπαγάλος', emoji: '🦜', belongs: true },
      { word: 'zebra', wordGreek: 'ζέβρα', emoji: '🦓', belongs: true },
      { word: 'tiger', wordGreek: 'τίγρη', emoji: '🐯', belongs: true },
      { word: 'pizza', wordGreek: 'πίτσα', emoji: '🍕', belongs: false },
      { word: 'car', wordGreek: 'αυτοκίνητο', emoji: '🚗', belongs: false },
      { word: 'television', wordGreek: 'τηλεόραση', emoji: '📺', belongs: false },
      { word: 'phone', wordGreek: 'τηλέφωνο', emoji: '📱', belongs: false },
    ],
  },
  {
    worldId: 'party',
    sceneName: 'The Party',
    sceneNameGreek: 'Το Πάρτι',
    sceneEmoji: '🎉',
    sceneBackground: 'linear-gradient(135deg, #FFF9C4 0%, #FFE082 50%, #FFCC02 100%)',
    items: [
      { word: 'balloon', wordGreek: 'μπαλόνι', emoji: '🎈', belongs: true },
      { word: 'cake', wordGreek: 'τούρτα', emoji: '🎂', belongs: true },
      { word: 'present', wordGreek: 'δώρο', emoji: '🎁', belongs: true },
      { word: 'candle', wordGreek: 'κερί', emoji: '🕯️', belongs: true },
      { word: 'music', wordGreek: 'μουσική', emoji: '🎵', belongs: true },
      { word: 'hat', wordGreek: 'καπέλο', emoji: '🎩', belongs: true },
      { word: 'hammer', wordGreek: 'σφυρί', emoji: '🔨', belongs: false },
      { word: 'umbrella', wordGreek: 'ομπρέλα', emoji: '☂️', belongs: false },
      { word: 'toothbrush', wordGreek: 'οδοντόβουρτσα', emoji: '🪥', belongs: false },
      { word: 'soap', wordGreek: 'σαπούνι', emoji: '🧼', belongs: false },
    ],
  },
];
