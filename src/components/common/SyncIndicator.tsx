import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSyncStatus, addSyncListener, SyncStatus } from '../../utils/gistSync';

export function SyncIndicator() {
  const [status, setStatus] = useState<SyncStatus>(getSyncStatus());

  useEffect(() => {
    return addSyncListener(setStatus);
  }, []);

  if (status === 'unconfigured') return null;

  const config: Record<SyncStatus, { icon: string; color: string; title: string }> = {
    idle: { icon: '☁️', color: '#4CAF50', title: 'Synced' },
    syncing: { icon: '⟳', color: '#FFC107', title: 'Syncing...' },
    error: { icon: '⚠️', color: '#F44336', title: 'Sync error' },
    offline: { icon: '☁️', color: '#9E9E9E', title: 'Offline' },
    unconfigured: { icon: '', color: '', title: '' },
  };

  const { icon, color, title } = config[status];

  return (
    <motion.div
      title={title}
      animate={status === 'syncing' ? { rotate: 360 } : { rotate: 0 }}
      transition={status === 'syncing' ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
      style={{
        fontSize: '18px',
        color,
        opacity: status === 'idle' ? 0.6 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        cursor: 'default',
      }}
    >
      {icon}
    </motion.div>
  );
}
