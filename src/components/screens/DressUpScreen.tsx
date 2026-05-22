import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { REWARDS } from '../../data/rewards';
import { PeppaCharacter } from '../common/PeppaCharacter';
import { FloatingElements } from '../common/FloatingElements';
import { Button } from '../common/Button';
import { ItemSlot } from '../../types';

export function DressUpScreen() {
  const { state, dispatch } = useGame();
  const { equippedItems, unlockedRewards } = state.progress;

  const wearableRewards = REWARDS.filter(
    r => r.slot && unlockedRewards.includes(r.id)
  );

  function handleToggleItem(rewardId: string, slot: ItemSlot) {
    if (equippedItems[slot] === rewardId) {
      dispatch({ type: 'UNEQUIP_ITEM', slot });
    } else {
      dispatch({ type: 'EQUIP_ITEM', slot, rewardId });
    }
  }

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', background: 'linear-gradient(160deg, #FFF0F5 0%, #FCE4EC 40%, #F8BBD0 80%, #CE93D8 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <FloatingElements elements={['🎀', '👗', '👑', '💎', '✨']} count={5} />

      {/* Header */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          width: '100%', padding: 'clamp(12px, 3vh, 16px) clamp(14px, 4vw, 20px) clamp(8px, 2vh, 12px)',
          background: 'linear-gradient(135deg, rgba(206,147,216,0.9), rgba(233,30,99,0.85))',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 4px 20px rgba(206,147,216,0.4)', zIndex: 2,
        }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'home' })}
          style={{
            background: 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '50%',
            width: 'clamp(30px, 8vw, 36px)', height: 'clamp(30px, 8vw, 36px)', fontSize: 'clamp(14px, 4vw, 18px)', cursor: 'pointer', color: 'white',
          }}
        >
          ←
        </motion.button>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(14px, 4vw, 18px)', color: 'white', fontWeight: 800 }}>
          🎀 Ντύσε την Πέπα!
        </div>
        <div style={{ width: 'clamp(30px, 8vw, 36px)' }} />
      </motion.div>

      {/* Peppa preview */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 16, delay: 0.2 }}
        style={{
          marginTop: 'clamp(16px, 4vh, 24px)', marginBottom: 'clamp(10px, 2.5vh, 16px)', zIndex: 1,
          position: 'relative',
        }}
      >
        <motion.div
          animate={{
            boxShadow: [
              '0 0 20px rgba(206,147,216,0.4)',
              '0 0 40px rgba(255,105,180,0.6)',
              '0 0 20px rgba(206,147,216,0.4)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{
            position: 'absolute', inset: '-20px',
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          }}
        />
        <PeppaCharacter mood="happy" size="large" equippedItems={equippedItems} />
      </motion.div>

      {/* Slot indicators */}
      <div style={{
        display: 'flex', gap: 'clamp(6px, 2vw, 8px)', marginBottom: 'clamp(8px, 2vh, 12px)', zIndex: 1, flexWrap: 'wrap', justifyContent: 'center',
      }}>
        {(['head', 'body', 'feet', 'back', 'hand'] as ItemSlot[]).map(slot => {
          const equipped = equippedItems[slot];
          const reward = equipped ? REWARDS.find(r => r.id === equipped) : null;
          const slotLabels: Record<ItemSlot, string> = {
            head: '👑', body: '👗', feet: '🥾', back: '🧚', hand: '🎤',
          };
          return (
            <motion.div
              key={slot}
              whileTap={equipped ? { scale: 0.9 } : {}}
              onClick={() => equipped && dispatch({ type: 'UNEQUIP_ITEM', slot })}
              style={{
                width: 'clamp(36px, 10vw, 44px)', height: 'clamp(36px, 10vw, 44px)', borderRadius: '12px',
                background: equipped ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                border: equipped ? '2px solid #FFD700' : '2px dashed rgba(233,30,99,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(16px, 4.5vw, 20px)', cursor: equipped ? 'pointer' : 'default',
                boxShadow: equipped ? '0 2px 8px rgba(255,215,0,0.4)' : 'none',
              }}
              title={equipped ? `${reward?.name} (tap to remove)` : slot}
            >
              {reward ? reward.icon : slotLabels[slot]}
            </motion.div>
          );
        })}
      </div>

      {/* Items grid */}
      <div style={{
        flex: 1, width: '100%', overflowY: 'auto', padding: '0 clamp(12px, 3vw, 16px) clamp(60px, 15vh, 80px)',
        zIndex: 1,
      }}>
        {wearableRewards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center', padding: '30px', color: '#E91E63',
              fontFamily: 'var(--font-body)', fontSize: '15px',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
            Κέρδισε αστέρια για να ξεκλειδώσεις ρούχα!
            <br />
            <span style={{ fontSize: '13px', color: '#999' }}>Win stars to unlock clothes!</span>
          </motion.div>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(8px, 2.5vw, 10px)',
            maxWidth: 'min(360px, 100%)', margin: '0 auto',
          }}>
            {wearableRewards.map((reward, i) => {
              const isEquipped = equippedItems[reward.slot!] === reward.id;
              return (
                <motion.button
                  key={reward.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.06, y: -3 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleToggleItem(reward.id, reward.slot!)}
                  style={{
                    background: isEquipped
                      ? 'linear-gradient(135deg, #FFD700, #FF8C00)'
                      : 'rgba(255,255,255,0.85)',
                    border: isEquipped ? '3px solid #FFD700' : '2px solid rgba(233,30,99,0.3)',
                    borderRadius: '16px',
                    padding: 'clamp(10px, 2.5vh, 14px) clamp(6px, 2vw, 8px)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                    cursor: 'pointer',
                    boxShadow: isEquipped
                      ? '0 4px 16px rgba(255,215,0,0.5)'
                      : '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                >
                  <span style={{ fontSize: '28px' }}>{reward.icon}</span>
                  <span style={{
                    fontSize: '10px', fontFamily: 'var(--font-body)',
                    color: isEquipped ? 'white' : '#E91E63',
                    textAlign: 'center', lineHeight: 1.2, fontWeight: isEquipped ? 700 : 500,
                  }}>
                    {reward.name}
                  </span>
                  {isEquipped && (
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.9)' }}>✓ Equipped</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom button */}
      <div style={{ position: 'sticky', bottom: 'clamp(12px, 3vh, 20px)', zIndex: 2 }}>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'home' })} variant="secondary" size="medium">
          Πίσω 🔙
        </Button>
      </div>
    </div>
  );
}
