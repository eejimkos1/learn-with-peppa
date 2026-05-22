import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { FloatingElements } from '../common/FloatingElements';
import { PeppaCharacter } from '../common/PeppaCharacter';

export function AuthScreen() {
  const { login, register } = useUser();
  const { dispatch } = useGame();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    const result = mode === 'login'
      ? await login(name, password)
      : await register(name, password);
    setLoading(false);
    if (result.success) {
      dispatch({ type: 'LOAD_USER' });
      dispatch({ type: 'SET_SCREEN', screen: 'home' });
    } else {
      setError(result.error || 'Κάτι πήγε στραβά!');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim() && password) handleSubmit();
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #FFF0F5, #FFB6C1, #FF69B4)',
      position: 'relative', overflow: 'hidden', padding: '20px', gap: '16px',
    }}>
      <FloatingElements elements={['💖', '🌸', '⭐', '🎀', '✨']} count={10} />

      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} style={{ zIndex: 1 }}>
        <PeppaCharacter mood="happy" size="medium" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          fontFamily: 'var(--font-heading)', fontSize: '24px',
          color: '#E91E63', textAlign: 'center', zIndex: 1,
        }}
      >
        {mode === 'login' ? 'Σύνδεση 🐷' : 'Εγγραφή 🐷'}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ zIndex: 1, width: '100%', maxWidth: '280px', display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        <input
          type="text" value={name} onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown} placeholder="Όνομα 💖" maxLength={20}
          style={{
            width: '100%', padding: '14px 18px', borderRadius: 'var(--radius-md)',
            border: '2px solid #FF69B4', background: 'rgba(255,255,255,0.9)',
            color: '#E91E63', fontSize: '16px', fontFamily: 'var(--font-body)',
            textAlign: 'center', outline: 'none',
          }}
        />
        <input
          type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown} placeholder="Κωδικός (4-8) 🔑" maxLength={8}
          style={{
            width: '100%', padding: '14px 18px', borderRadius: 'var(--radius-md)',
            border: '2px solid #FF69B4', background: 'rgba(255,255,255,0.9)',
            color: '#E91E63', fontSize: '16px', fontFamily: 'var(--font-body)',
            textAlign: 'center', outline: 'none',
          }}
        />
      </motion.div>

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: '#D32F2F', fontSize: '14px', textAlign: 'center', zIndex: 1, background: 'rgba(255,255,255,0.8)', padding: '6px 12px', borderRadius: '8px' }}>
          {error}
        </motion.p>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        style={{ zIndex: 1, display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        <Button onClick={handleSubmit} variant="primary" size="large" disabled={loading || !name.trim() || !password}>
          {loading ? '...' : mode === 'login' ? 'Είσοδος 🎉' : 'Δημιουργία 🎉'}
        </Button>
        <button
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
          style={{
            background: 'none', border: 'none', color: '#E91E63',
            fontSize: '14px', cursor: 'pointer', textDecoration: 'underline',
            fontFamily: 'var(--font-body)',
          }}
        >
          {mode === 'login' ? 'Δεν έχεις λογαριασμό; Εγγραφή' : 'Έχεις ήδη λογαριασμό; Σύνδεση'}
        </button>
      </motion.div>
    </div>
  );
}
