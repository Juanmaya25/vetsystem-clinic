// Paleta vet-care: verde menta cálido + coral + cremas
export const themes = {
  light: {
    bg:        '#fdfcf9',
    bg2:       '#ffffff',
    bg3:       '#f5f1ea',
    bgWarm:    '#fef3c7',
    bgMint:    '#d1fae5',
    accent:    '#059669',
    accent2:   '#fb7185',
    accent3:   '#f59e0b',
    text:      '#1f2937',
    text2:     '#6b7280',
    text3:     '#9ca3af',
    border:    '#ede9e3',
    red:       '#ef4444',
    orange:    '#f97316',
    shadow:    '0 4px 24px rgba(120,80,40,.05)',
    shadowLg:  '0 12px 48px rgba(120,80,40,.10)',
  },
  dark: {
    bg:        '#1c1816',
    bg2:       '#28231f',
    bg3:       '#332c27',
    bgWarm:    '#3d3022',
    bgMint:    '#1f3a30',
    accent:    '#34d399',
    accent2:   '#fb7185',
    accent3:   '#fbbf24',
    text:      '#f5f1ea',
    text2:     '#a8a29e',
    text3:     '#78716c',
    border:    '#3d3530',
    red:       '#f87171',
    orange:    '#fb923c',
    shadow:    '0 4px 24px rgba(0,0,0,.3)',
    shadowLg:  '0 12px 48px rgba(0,0,0,.5)',
  },
};

export const statusInfo = {
  healthy:   { l:'Saludable',      bg:'rgba(16,185,129,.12)',  c:'#059669', dot:'#10b981' },
  treatment: { l:'En tratamiento', bg:'rgba(245,158,11,.12)',  c:'#d97706', dot:'#f59e0b' },
  checkup:   { l:'Revisión',       bg:'rgba(59,130,246,.12)',  c:'#2563eb', dot:'#3b82f6' },
  critical:  { l:'Crítico',        bg:'rgba(251,113,133,.15)', c:'#e11d48', dot:'#fb7185' },
};

export const apptStatus = {
  done:    { l:'Completada', bg:'rgba(16,185,129,.12)',  c:'#059669' },
  next:    { l:'Siguiente',  bg:'rgba(59,130,246,.12)',  c:'#2563eb' },
  pending: { l:'Pendiente',  bg:'rgba(245,158,11,.12)',  c:'#d97706' },
};

// Avatar gradient por especie
export const speciesGradient = {
  Perro:  'linear-gradient(135deg, #fbbf24, #fb923c)',
  Gato:   'linear-gradient(135deg, #a78bfa, #f472b6)',
  Conejo: 'linear-gradient(135deg, #f9a8d4, #fbcfe8)',
  Ave:    'linear-gradient(135deg, #60a5fa, #34d399)',
  Otro:   'linear-gradient(135deg, #94a3b8, #64748b)',
};

export const speciesEmoji = sp => sp === 'Perro' ? '🐕' : sp === 'Gato' ? '🐈' : sp === 'Conejo' ? '🐇' : sp === 'Ave' ? '🐦' : '🐾';
