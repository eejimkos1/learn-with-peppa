import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useUser } from '../../context/UserContext';
import { setGistConfig, readGist } from '../../utils/gistApi';
import { Button } from '../common/Button';
import { FloatingElements } from '../common/FloatingElements';
import { PeppaCharacter } from '../common/PeppaCharacter';
import { SyncIndicator } from '../common/SyncIndicator';

export function SettingsScreen() {
  const { state, dispatch } = useGame();
  const { logout } = useUser();
  const [showConfirm, setShowConfirm] = useState(false);

  // Admin panel state
  const [tapCount, setTapCount] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [adminGistId, setAdminGistId] = useState('');
  const [adminMsg, setAdminMsg] = useState('');

  const handleReset = () => {
    dispatch({ type: 'RESET_PROGRESS' });
    setShowConfirm(false);
  };

  const handleVersionTap = () => {
    const next = tapCount + 1;
    setTapCount(next);
    if (next >= 5) {
      setShowAdmin(true);
      setTapCount(0);
    }
  };

  const handleSaveGist = async () => {
    if (!adminToken.trim() || !adminGistId.trim()) {
      setAdminMsg('Συμπλήρωσε και τα δύο πεδία!');
      return;
    }
    setGistConfig(adminToken.trim(), adminGistId.trim());
    setAdminMsg('Έλεγχος σύνδεσης...');
    const result = await readGist({ token: adminToken.trim(), gistId: adminGistId.trim() });
    if (result.success) {
      setAdminMsg('Επιτυχία! Το sync είναι ενεργό.');
      setTimeout(() => setShowAdmin(false), 1500);
    } else {
      setAdminMsg(`Σφάλμα: ${result.error}`);
    }
  };

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', background: 'linear-gradient(180deg, #FFF0F5, #FFB6C1)',
      position: 'relative', overflow: 'auto', padding: 'clamp(14px, 3.5vh, 20px)', gap: 'clamp(12px, 3vh, 16px)',
    }}>
      <FloatingElements elements={['⚙️', '🎵', '✨', '💖']} count={6} />

      <motion.h1
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px, 6vw, 26px)', color: '#E91E63', zIndex: 1 }}
      >
        Ρυθμίσεις ⚙️
      </motion.h1>

      <PeppaCharacter mood="idle" size="small" />

      <div style={{ width: '100%', maxWidth: 'min(300px, 90%)', display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vh, 16px)', zIndex: 1 }}>
        {/* Volume */}
        <div style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-body)', fontSize: '14px', color: '#4A0028' }}>
            <span>🔊 Ένταση</span>
            <span>{Math.round(state.settings.volume * 100)}%</span>
          </label>
          <input
            type="range" min="0" max="100" value={state.settings.volume * 100}
            onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', settings: { volume: Number(e.target.value) / 100 } })}
            style={{ width: '100%', marginTop: '8px', accentColor: '#FF69B4' }}
          />
        </div>

        {/* Music toggle */}
        <div style={{
          background: 'rgba(255,255,255,0.8)', borderRadius: 'var(--radius-md)', padding: '16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#4A0028' }}>🎵 Μουσική</span>
          <button
            onClick={() => dispatch({ type: 'UPDATE_SETTINGS', settings: { musicEnabled: !state.settings.musicEnabled } })}
            style={{
              width: '50px', height: '28px', borderRadius: '14px',
              background: state.settings.musicEnabled ? '#FF69B4' : '#ddd',
              position: 'relative', transition: 'background 0.3s', border: 'none', cursor: 'pointer',
            }}
          >
            <div style={{
              width: '22px', height: '22px', borderRadius: '50%', background: 'white',
              position: 'absolute', top: '3px',
              left: state.settings.musicEnabled ? '25px' : '3px',
              transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </button>
        </div>

        {/* SFX toggle */}
        <div style={{
          background: 'rgba(255,255,255,0.8)', borderRadius: 'var(--radius-md)', padding: '16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#4A0028' }}>🔔 Ήχοι</span>
          <button
            onClick={() => dispatch({ type: 'UPDATE_SETTINGS', settings: { sfxEnabled: !state.settings.sfxEnabled } })}
            style={{
              width: '50px', height: '28px', borderRadius: '14px',
              background: state.settings.sfxEnabled ? '#FF69B4' : '#ddd',
              position: 'relative', transition: 'background 0.3s', border: 'none', cursor: 'pointer',
            }}
          >
            <div style={{
              width: '22px', height: '22px', borderRadius: '50%', background: 'white',
              position: 'absolute', top: '3px',
              left: state.settings.sfxEnabled ? '25px' : '3px',
              transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </button>
        </div>

        {/* Sync status */}
        <div style={{
          background: 'rgba(255,255,255,0.8)', borderRadius: 'var(--radius-md)', padding: '16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#4A0028' }}>☁️ Cloud Sync</span>
          <SyncIndicator />
        </div>

        {/* Reset */}
        <div style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center' }}>
          {!showConfirm ? (
            <button onClick={() => setShowConfirm(true)}
              style={{ background: 'none', border: 'none', color: '#FF5252', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              🗑️ Διαγραφή προόδου
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ fontSize: '13px', color: '#D32F2F' }}>Είσαι σίγουρη; Θα χαθούν τα αστέρια σου!</p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <Button onClick={handleReset} variant="primary" size="small">Ναι 😢</Button>
                <Button onClick={() => setShowConfirm(false)} variant="secondary" size="small">Όχι 💖</Button>
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button onClick={() => { logout(); dispatch({ type: 'SET_SCREEN', screen: 'auth' }); }}
          style={{ background: 'none', border: 'none', color: '#999', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)', marginTop: '8px' }}>
          Αποσύνδεση 👋
        </button>
      </div>

      <div style={{ marginTop: '16px', zIndex: 1 }}>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'home' })} variant="secondary" size="medium">
          Πίσω 🔙
        </Button>
      </div>

      {/* Version tap (hidden admin trigger) */}
      <div
        onClick={handleVersionTap}
        style={{
          position: 'absolute', bottom: '8px', right: '12px',
          fontSize: '11px', color: 'rgba(150,100,120,0.4)',
          cursor: 'default', userSelect: 'none', zIndex: 1,
        }}
      >
        v1.0.0
      </div>

      {/* Admin panel overlay */}
      <AnimatePresence>
        {showAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.9)',
              zIndex: 9999,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '20px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              style={{
                background: '#1a1a2e', borderRadius: '20px',
                padding: '28px', width: '100%', maxWidth: '340px',
                border: '2px solid #333',
              }}
            >
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#FFD700', marginBottom: '16px', textAlign: 'center' }}>
                Admin Panel
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }}>GitHub Token</label>
                  <input
                    type="password"
                    value={adminToken}
                    onChange={e => setAdminToken(e.target.value)}
                    placeholder="ghp_..."
                    style={{
                      width: '100%', padding: '10px 12px',
                      borderRadius: '10px', border: '1px solid #444',
                      background: '#222', color: 'white', fontSize: '14px',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }}>Gist ID</label>
                  <input
                    type="text"
                    value={adminGistId}
                    onChange={e => setAdminGistId(e.target.value)}
                    placeholder="abc123..."
                    style={{
                      width: '100%', padding: '10px 12px',
                      borderRadius: '10px', border: '1px solid #444',
                      background: '#222', color: 'white', fontSize: '14px',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>

                {adminMsg && (
                  <div style={{
                    fontSize: '13px', textAlign: 'center', padding: '8px',
                    borderRadius: '8px',
                    background: adminMsg.includes('Επιτυχία') ? 'rgba(76,175,80,0.2)' : 'rgba(244,67,54,0.2)',
                    color: adminMsg.includes('Επιτυχία') ? '#4CAF50' : '#FF5252',
                  }}>
                    {adminMsg}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button
                    onClick={handleSaveGist}
                    style={{
                      flex: 1, padding: '10px',
                      background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
                      border: 'none', borderRadius: '12px',
                      color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                    }}
                  >
                    Test & Save
                  </button>
                  <button
                    onClick={() => { setShowAdmin(false); setAdminMsg(''); }}
                    style={{
                      flex: 1, padding: '10px',
                      background: '#333',
                      border: '1px solid #555', borderRadius: '12px',
                      color: '#ccc', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
