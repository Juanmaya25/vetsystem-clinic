import { useState, useMemo, useCallback } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── DATA SEED ──────────────────────────────────────────────────────
const INIT_PETS = [
  { id:1, name:'Max',    species:'Perro',  breed:'Golden Retriever', age:3, owner:'Carlos Ruiz',   phone:'310-111-2222', status:'healthy',   lastVisit:'2025-04-20', nextVisit:'2025-07-20', weight:'28kg', vaccinated:true,  microchip:'982000123456789' },
  { id:2, name:'Luna',   species:'Gato',   breed:'Siamés',           age:5, owner:'María López',   phone:'310-333-4444', status:'treatment', lastVisit:'2025-04-28', nextVisit:'2025-05-05', weight:'4kg',  vaccinated:true,  microchip:'982000234567890' },
  { id:3, name:'Rocky',  species:'Perro',  breed:'Bulldog',          age:2, owner:'Juan García',   phone:'310-555-6666', status:'healthy',   lastVisit:'2025-03-15', nextVisit:'2025-06-15', weight:'22kg', vaccinated:true,  microchip:'982000345678901' },
  { id:4, name:'Pelusa', species:'Conejo', breed:'Angora',           age:1, owner:'Ana Martínez',  phone:'310-777-8888', status:'checkup',   lastVisit:'2025-04-10', nextVisit:'2025-05-10', weight:'2kg',  vaccinated:false, microchip:'982000456789012' },
  { id:5, name:'Toby',   species:'Perro',  breed:'Poodle',           age:7, owner:'Pedro Vargas',  phone:'310-999-0000', status:'critical',  lastVisit:'2025-04-30', nextVisit:'2025-05-02', weight:'6kg',  vaccinated:true,  microchip:'982000567890123' },
  { id:6, name:'Mochi',  species:'Gato',   breed:'Persa',            age:4, owner:'Sofía Castro',  phone:'310-121-3434', status:'healthy',   lastVisit:'2025-04-25', nextVisit:'2025-07-25', weight:'5kg',  vaccinated:true,  microchip:'982000678901234' },
];

const INIT_APPTS = [
  { id:1, time:'08:00', pet:'Max',    owner:'Carlos Ruiz',  type:'Vacunación',     vet:'Dr. Ramírez', status:'done',    notes:'Refuerzo anual completado',   date:'2025-05-01' },
  { id:2, time:'09:30', pet:'Luna',   owner:'María López',  type:'Control',        vet:'Dra. Torres', status:'done',    notes:'Tratamiento avanzando bien',  date:'2025-05-01' },
  { id:3, time:'11:00', pet:'Rocky',  owner:'Juan García',  type:'Baño y corte',   vet:'Dr. Ramírez', status:'next',    notes:'',                            date:'2025-05-01' },
  { id:4, time:'12:30', pet:'Pelusa', owner:'Ana Martínez', type:'Consulta',       vet:'Dra. Torres', status:'pending', notes:'Primera consulta',            date:'2025-05-01' },
  { id:5, time:'14:00', pet:'Toby',   owner:'Pedro Vargas', type:'Urgencia',       vet:'Dr. Ramírez', status:'pending', notes:'Caso critico',                date:'2025-05-01' },
  { id:6, time:'15:30', pet:'Mochi',  owner:'Sofía Castro', type:'Desparasitación',vet:'Dra. Torres', status:'pending', notes:'',                            date:'2025-05-01' },
];

const INIT_MEDS = [
  { id:1, name:'Amoxicilina 500mg',  stock:45, min:20, unit:'tabletas', price:2800,  category:'Antibiótico' },
  { id:2, name:'Ivermectina 1%',     stock:12, min:15, unit:'ml',       price:4500,  category:'Antiparasitario' },
  { id:3, name:'Frontline Spray',    stock:8,  min:10, unit:'frascos',  price:28000, category:'Pulgas' },
  { id:4, name:'Metronidazol 250mg', stock:60, min:20, unit:'tabletas', price:1200,  category:'Antibiótico' },
  { id:5, name:'Vitamina B12',       stock:3,  min:10, unit:'ampollas', price:5500,  category:'Vitamina' },
  { id:6, name:'Antiinflamatorio',   stock:32, min:15, unit:'tabletas', price:3200,  category:'Antiinflamatorio' },
];

const REVENUE_DATA = [
  { mes:'Nov', ingresos:8200000,  citas:42 },
  { mes:'Dic', ingresos:9800000,  citas:51 },
  { mes:'Ene', ingresos:7600000,  citas:38 },
  { mes:'Feb', ingresos:8900000,  citas:45 },
  { mes:'Mar', ingresos:10200000, citas:55 },
  { mes:'Abr', ingresos:11500000, citas:62 },
];

const SERVICE_DIST = [
  { name:'Consulta',      value:35, color:'#10b981' },
  { name:'Vacunación',    value:22, color:'#34d399' },
  { name:'Cirugía',       value:15, color:'#fb7185' },
  { name:'Baño/Estética', value:18, color:'#fbbf24' },
  { name:'Urgencias',     value:10, color:'#f87171' },
];

// Paleta vet-care: verde menta cálido + coral + cremas
const themes = {
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

const statusInfo = {
  healthy:   { l:'Saludable',      bg:'rgba(16,185,129,.12)',  c:'#059669', dot:'#10b981' },
  treatment: { l:'En tratamiento', bg:'rgba(245,158,11,.12)',  c:'#d97706', dot:'#f59e0b' },
  checkup:   { l:'Revisión',       bg:'rgba(59,130,246,.12)',  c:'#2563eb', dot:'#3b82f6' },
  critical:  { l:'Crítico',        bg:'rgba(251,113,133,.15)', c:'#e11d48', dot:'#fb7185' },
};

const apptStatus = {
  done:    { l:'Completada', bg:'rgba(16,185,129,.12)',  c:'#059669' },
  next:    { l:'Siguiente',  bg:'rgba(59,130,246,.12)',  c:'#2563eb' },
  pending: { l:'Pendiente',  bg:'rgba(245,158,11,.12)',  c:'#d97706' },
};

const fmt = n => '$' + Number(n || 0).toLocaleString('es-CO');

// Avatar gradient por especie
const speciesGradient = {
  Perro:  'linear-gradient(135deg, #fbbf24, #fb923c)',
  Gato:   'linear-gradient(135deg, #a78bfa, #f472b6)',
  Conejo: 'linear-gradient(135deg, #f9a8d4, #fbcfe8)',
  Ave:    'linear-gradient(135deg, #60a5fa, #34d399)',
  Otro:   'linear-gradient(135deg, #94a3b8, #64748b)',
};

const speciesEmoji = sp => sp === 'Perro' ? '🐕' : sp === 'Gato' ? '🐈' : sp === 'Conejo' ? '🐇' : sp === 'Ave' ? '🐦' : '🐾';

// ─── SVG ICONS (no emojis para evitar problemas de rendering) ──────
const Icon = {
  pencil: (props={}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  trash: (props={}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/>
      <path d="M14 11v6"/>
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  check: (props={}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  download: (props={}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  plus: (props={}) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  search: (props={}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  bell: (props={}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  sun: (props={}) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  moon: (props={}) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  alert: (props={}) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  pawprint: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="6" cy="9" rx="2" ry="3" transform="rotate(-20 6 9)"/>
      <ellipse cx="18" cy="9" rx="2" ry="3" transform="rotate(20 18 9)"/>
      <ellipse cx="9" cy="5" rx="1.6" ry="2.4" transform="rotate(-15 9 5)"/>
      <ellipse cx="15" cy="5" rx="1.6" ry="2.4" transform="rotate(15 15 5)"/>
      <path d="M12 11c-3 0-5 2-5 5 0 2 1.5 4 5 4s5-2 5-4c0-3-2-5-5-5z"/>
    </svg>
  ),
  syringe: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2l4 4-2 2-4-4 2-2z"/>
      <path d="M12 8l-9 9 4 4 9-9-4-4z"/>
      <path d="M14 6l4 4"/>
      <path d="M5 17l2 2"/>
    </svg>
  ),
  pill: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.5 20.5L20.5 10.5a4.95 4.95 0 0 0-7-7L3.5 13.5a4.95 4.95 0 0 0 7 7z"/>
      <path d="M8.5 8.5l7 7"/>
    </svg>
  ),
  calendar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  chart: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  home: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  phone: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  user: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  close: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

// ─── REUSABLE COMPONENTS ────────────────────────────────────────────

function Modal({ title, onSave, onClose, children, size='md', C, S }) {
  return (
    <div
      style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(28,24,22,.55)', backdropFilter:'blur(4px)', zIndex:999, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'40px 16px', overflowY:'auto'}}
      onClick={onClose}
    >
      <div
        style={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:24, padding:28, width:'100%', maxWidth: size==='lg' ? 720 : 540, boxShadow:C.shadowLg}}
        onClick={e => e.stopPropagation()}
      >
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22}}>
          <h2 style={{fontSize:20, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.5px'}}>{title}</h2>
          <button onClick={onClose} aria-label="Cerrar" style={{background:C.bg3, border:'none', color:C.text2, width:34, height:34, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>
            {Icon.close()}
          </button>
        </div>
        {children}
        <div style={{display:'flex', gap:10, justifyContent:'flex-end', marginTop:24}}>
          <button style={S.btnGhost} onClick={onClose}>Cancelar</button>
          <button style={S.btnPri} onClick={onSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

// Avatar circular grande con gradiente y emoji por especie
function PetAvatar({ species, name, size=56 }) {
  const initial = name?.[0] || '?';
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%',
      background: speciesGradient[species] || speciesGradient.Otro,
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'#fff', fontWeight:700, fontSize: size * 0.42,
      flexShrink:0, position:'relative',
      boxShadow:'0 4px 12px rgba(0,0,0,.08)',
    }}>
      <span style={{fontSize: size * 0.5, lineHeight:1}}>{speciesEmoji(species)}</span>
      <span style={{position:'absolute', bottom:-2, right:-2, background:'#fff', borderRadius:'50%', width:size*0.36, height:size*0.36, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.18, fontWeight:700, color:'#374151', boxShadow:'0 2px 6px rgba(0,0,0,.1)'}}>
        {initial}
      </span>
    </div>
  );
}

// ─── APP ────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme]               = useState('light');
  const [page, setPage]                 = useState('dashboard');
  const [pets, setPets]                 = useState(INIT_PETS);
  const [appts, setAppts]               = useState(INIT_APPTS);
  const [meds, setMeds]                 = useState(INIT_MEDS);
  const [search, setSearch]             = useState('');
  const [filter, setFilter]             = useState('all');
  const [modal, setModal]               = useState(null);
  const [editTarget, setEditTarget]     = useState(null);
  const [form, setForm]                 = useState({});
  const [toast, setToast]               = useState(null);
  const [confirm, setConfirm]           = useState(null);
  const [selectedPet, setSelectedPet]   = useState(null);
  const [showNotifs, setShowNotifs]     = useState(false);

  const C = themes[theme];

  const showToast = useCallback((msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fv = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const nextId = arr => (arr.length ? Math.max(...arr.map(x => x.id)) : 0) + 1;
  const closeModal = useCallback(() => { setModal(null); setEditTarget(null); setForm({}); }, []);

  const validate = (fields) => {
    for (const [k, v] of fields) {
      if (!v && v !== 0) { showToast(`"${k}" es requerido`, 'error'); return false; }
    }
    return true;
  };

  const savePet = () => {
    if (!validate([['Nombre', form.name], ['Dueño', form.owner]])) return;
    const p = { ...form, age: +form.age || 0 };
    if (!editTarget) {
      setPets(pp => [...pp, { ...p, id: nextId(pp), status:'healthy', vaccinated:false, lastVisit:'-', nextVisit:'-' }]);
      showToast('Paciente agregado');
    } else {
      setPets(pp => pp.map(x => x.id === editTarget.id ? { ...x, ...p } : x));
      showToast('Paciente actualizado');
    }
    closeModal();
  };

  const delPet = id => setConfirm({
    msg: '¿Eliminar este paciente?',
    onYes: () => { setPets(pp => pp.filter(x => x.id !== id)); showToast('Paciente eliminado'); setConfirm(null); }
  });

  const saveAppt = () => {
    if (!validate([['Mascota', form.pet], ['Hora', form.time], ['Tipo', form.type]])) return;
    setAppts(aa => [...aa, { ...form, id: nextId(aa), status:'pending', date:'2025-05-01', notes: form.notes || '' }]);
    showToast('Cita agendada — recordatorio WhatsApp enviado');
    closeModal();
  };

  const completeAppt = id => {
    setAppts(aa => aa.map(a => a.id === id ? { ...a, status:'done' } : a));
    showToast('Cita completada');
  };

  const saveMed = () => {
    if (!validate([['Nombre', form.name], ['Stock', form.stock]])) return;
    const m = { ...form, stock: +form.stock || 0, min: +form.min || 10, price: +form.price || 0 };
    if (!editTarget) {
      setMeds(mm => [...mm, { ...m, id: nextId(mm) }]);
      showToast('Medicamento agregado');
    } else {
      setMeds(mm => mm.map(x => x.id === editTarget.id ? { ...x, ...m } : x));
      showToast('Medicamento actualizado');
    }
    closeModal();
  };

  const delMed = id => setConfirm({
    msg: '¿Eliminar este medicamento?',
    onYes: () => { setMeds(mm => mm.filter(x => x.id !== id)); showToast('Medicamento eliminado'); setConfirm(null); }
  });

  const exportCSV = (data, name) => {
    if (!data.length) { showToast('No hay datos', 'error'); return; }
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(r => headers.map(h => `"${(r[h] ?? '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `${name}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${name}.csv descargado`);
  };

  const petByName = useMemo(() => {
    const m = {};
    pets.forEach(p => { m[p.name] = p; });
    return m;
  }, [pets]);

  const filteredPets = useMemo(() => pets.filter(p => {
    const q = search.toLowerCase();
    const matchQ = p.name.toLowerCase().includes(q) || p.owner.toLowerCase().includes(q) || p.breed.toLowerCase().includes(q);
    const matchF = filter === 'all' || p.status === filter;
    return matchQ && matchF;
  }), [pets, search, filter]);

  const lowMeds       = useMemo(() => meds.filter(m => m.stock < m.min), [meds]);
  const criticalPets  = useMemo(() => pets.filter(p => p.status === 'critical'), [pets]);
  const todayAppts    = useMemo(() => appts.filter(a => a.date === '2025-05-01'), [appts]);
  const totalRevenue  = REVENUE_DATA.reduce((s, r) => s + r.ingresos, 0);

  const notifs = [
    ...criticalPets.map(p => ({ key:`crit-${p.id}`, type:'error',   text:`Paciente crítico: ${p.name}`, time:'hace 30 min' })),
    ...lowMeds.map(m     => ({ key:`low-${m.id}`,  type:'warning', text:`Stock bajo: ${m.name}`,        time:'hace 1 h' })),
  ];

  const navItems = [
    { id:'dashboard', label:'Inicio',     icon: Icon.home },
    { id:'patients',  label:'Pacientes',  icon: Icon.pawprint },
    { id:'schedule',  label:'Agenda',     icon: Icon.calendar },
    { id:'pharmacy',  label:'Farmacia',   icon: Icon.pill },
    { id:'analytics', label:'Reportes',   icon: Icon.chart },
  ];

  const S = {
    card:     { background:C.bg2, border:`1px solid ${C.border}`, borderRadius:20, padding:24, boxShadow:C.shadow },
    cardSoft: { background:C.bg3, borderRadius:20, padding:20 },
    input:    { background:C.bg2, border:`1px solid ${C.border}`, borderRadius:12, padding:'11px 16px', fontSize:14, color:C.text, outline:'none', fontFamily:'inherit', width:'100%', boxSizing:'border-box', transition:'border-color .2s, box-shadow .2s' },
    label:    { fontSize:11, color:C.text2, fontWeight:600, display:'block', marginBottom:8, letterSpacing:'.3px', textTransform:'uppercase' },
    btnPri:   { background:C.accent, color:'#fff', border:'none', borderRadius:14, padding:'12px 22px', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:8, transition:'transform .15s, box-shadow .2s' },
    btnGhost: { background:'transparent', color:C.text2, border:`1px solid ${C.border}`, borderRadius:14, padding:'12px 18px', fontSize:14, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:6 },
    btnIcon:  { background:C.bg3, color:C.text2, border:'none', borderRadius:10, width:34, height:34, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', justifyContent:'center', transition:'background .15s, color .15s' },
  };

  const inputFocusHandlers = {
    onFocus: e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accent}25`; },
    onBlur:  e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; },
  };

  // ─── PAGE RENDERERS ───────────────────────────────────────────────

  const renderDashboard = () => (
    <div className="fade-in" style={{display:'flex', flexDirection:'column', gap:24}}>
      {/* HERO */}
      <div style={{
        background: `linear-gradient(135deg, ${C.bgMint} 0%, ${C.bgWarm} 100%)`,
        borderRadius:28, padding:'32px 36px', position:'relative', overflow:'hidden',
        border:`1px solid ${C.border}`,
      }}>
        <div style={{position:'absolute', right:-20, top:-20, fontSize:160, opacity:.08}}>🐾</div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:20, position:'relative'}}>
          <div>
            <div style={{fontSize:13, color:C.text2, fontWeight:600, letterSpacing:'.4px', marginBottom:6}}>Jueves 1 de Mayo · Clínica VetCare</div>
            <h1 style={{fontSize:32, fontWeight:800, color:C.text, margin:0, letterSpacing:'-1px', lineHeight:1.15}}>
              Buenos días, <span style={{color:C.accent}}>Dr. Maya</span> 👋
            </h1>
            <div style={{fontSize:15, color:C.text2, marginTop:10, maxWidth:600, lineHeight:1.6}}>
              Tienes <strong style={{color:C.text}}>{todayAppts.length} citas hoy</strong>, {criticalPets.length > 0 ? <><strong style={{color:C.accent2}}>{criticalPets.length} paciente{criticalPets.length>1?'s':''} crítico{criticalPets.length>1?'s':''}</strong> y </> : ''}
              <strong style={{color:C.text}}>{lowMeds.length} medicamento{lowMeds.length!==1?'s':''}</strong> con stock bajo.
            </div>
          </div>
          <button style={{...S.btnPri, background:'#fff', color:C.accent, boxShadow:'0 4px 14px rgba(0,0,0,.06)'}} onClick={() => { setPage('schedule'); setModal('appt'); setForm({}); }}>
            <Icon.plus /> Nueva cita
          </button>
        </div>
      </div>

      {/* STATS ROW */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16}}>
        {[
          { l:'Pacientes hoy',   v:todayAppts.length,      sub:`${todayAppts.filter(a => a.status === 'done').length} atendidos`, c:C.accent,  bg:C.bgMint },
          { l:'En tratamiento',  v:pets.filter(p => p.status === 'treatment').length, sub:'Seguimiento', c:C.accent3, bg:C.bgWarm },
          { l:'Críticos',        v:criticalPets.length,    sub:'Atención urgente',         c:C.accent2, bg:'rgba(251,113,133,.1)' },
          { l:'Total pacientes', v:pets.length,            sub:'Registrados',              c:C.text,    bg:C.bg3 },
        ].map(k => (
          <div key={k.l} style={{...S.card, background:k.bg, border:'none'}}>
            <div style={{fontSize:12, color:C.text2, fontWeight:600, letterSpacing:'.3px', textTransform:'uppercase', marginBottom:10}}>{k.l}</div>
            <div style={{fontSize:36, fontWeight:800, color:k.c, lineHeight:1, marginBottom:6, letterSpacing:'-1px'}}>{k.v}</div>
            <div style={{fontSize:13, color:C.text2}}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* TWO COLUMNS */}
      <div style={{display:'grid', gridTemplateColumns:'minmax(0,1.4fr) minmax(0,1fr)', gap:20}}>
        {/* AGENDA HOY */}
        <div style={S.card}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
            <h2 style={{fontSize:18, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.3px'}}>Agenda de hoy</h2>
            <button style={{...S.btnGhost, padding:'8px 14px', fontSize:12}} onClick={() => setPage('schedule')}>Ver todas →</button>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:10}}>
            {todayAppts.map(a => {
              const pet = petByName[a.pet];
              return (
                <div key={a.id} style={{display:'flex', alignItems:'center', gap:14, padding:'10px 0', borderBottom:`1px solid ${C.border}`}}>
                  <div style={{minWidth:60, fontSize:15, fontWeight:700, color:C.accent, fontFamily:'monospace'}}>{a.time}</div>
                  <PetAvatar species={pet?.species} name={a.pet} size={42} />
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontSize:14, fontWeight:600, color:C.text}}>{a.pet}</div>
                    <div style={{fontSize:12, color:C.text2, marginTop:2}}>{a.type} · {a.vet}</div>
                  </div>
                  {a.status === 'pending' && (
                    <button onClick={() => completeAppt(a.id)} style={{...S.btnIcon, background:`${C.accent}15`, color:C.accent}} aria-label="Completar">
                      <Icon.check />
                    </button>
                  )}
                  <span style={{fontSize:11, fontWeight:600, padding:'5px 12px', borderRadius:100, background:apptStatus[a.status].bg, color:apptStatus[a.status].c, whiteSpace:'nowrap'}}>
                    {apptStatus[a.status].l}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CRITICAL ALERT + STOCK */}
        <div style={{display:'flex', flexDirection:'column', gap:16}}>
          {criticalPets.length > 0 && (
            <div style={{
              borderRadius:20, padding:22,
              background: `linear-gradient(135deg, ${C.accent2}, ${C.red})`,
              color:'#fff', position:'relative', overflow:'hidden',
              boxShadow:'0 12px 32px rgba(251,113,133,.25)',
            }}>
              <div style={{position:'absolute', right:-10, bottom:-10, opacity:.15, fontSize:120}}>🚨</div>
              <div style={{display:'flex', alignItems:'center', gap:8, fontSize:12, fontWeight:700, letterSpacing:'.6px', textTransform:'uppercase', marginBottom:10, position:'relative'}}>
                <Icon.alert /> Caso crítico
              </div>
              <div style={{fontSize:24, fontWeight:800, marginBottom:6, position:'relative', letterSpacing:'-.3px'}}>{criticalPets[0].name}</div>
              <div style={{fontSize:13, opacity:.9, position:'relative'}}>{criticalPets[0].owner} · {criticalPets[0].phone}</div>
              <div style={{marginTop:14, background:'rgba(255,255,255,.18)', borderRadius:12, padding:'10px 14px', fontSize:13, position:'relative', backdropFilter:'blur(10px)'}}>
                Próxima cita: <strong>{criticalPets[0].nextVisit}</strong>
              </div>
            </div>
          )}
          <div style={S.card}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14}}>
              <h2 style={{fontSize:16, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.3px'}}>Stock bajo</h2>
              <span style={{fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:100, background:`${C.accent3}20`, color:C.accent3}}>{lowMeds.length} alertas</span>
            </div>
            {lowMeds.slice(0, 4).map(m => (
              <div key={m.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.border}`}}>
                <div style={{minWidth:0, flex:1, marginRight:8}}>
                  <div style={{fontSize:13, fontWeight:600, color:C.text}}>{m.name}</div>
                  <div style={{fontSize:11, color:C.text3, marginTop:2}}>{m.unit}</div>
                </div>
                <span style={{fontFamily:'monospace', fontWeight:700, color:C.red, fontSize:14}}>{m.stock}</span>
              </div>
            ))}
            {lowMeds.length === 0 && <div style={{fontSize:13, color:C.text2, textAlign:'center', padding:14}}>Todo en orden</div>}
          </div>
        </div>
      </div>

      {/* CHART */}
      <div style={S.card}>
        <h2 style={{fontSize:16, fontWeight:700, margin:'0 0 18px 0', color:C.text, letterSpacing:'-.3px'}}>Ingresos · últimos 6 meses</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={REVENUE_DATA}>
            <defs>
              <linearGradient id="vetbar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.accent} />
                <stop offset="100%" stopColor={C.accent3} stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
            <XAxis dataKey="mes" tick={{fontSize:12, fill:C.text2}} axisLine={false} tickLine={false} />
            <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000000).toFixed(0)}M`} />
            <Tooltip contentStyle={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:12, fontSize:12, boxShadow:C.shadow}} formatter={v => [fmt(v), 'Ingresos']} />
            <Bar dataKey="ingresos" fill="url(#vetbar)" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderPatients = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:30, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Pacientes</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:6}}>{filteredPets.length} de {pets.length} mascotas registradas</div>
        </div>
        <div style={{display:'flex', gap:10}}>
          <button style={S.btnGhost} onClick={() => exportCSV(filteredPets, 'pacientes')}>
            <Icon.download /> Exportar
          </button>
          <button style={S.btnPri} onClick={() => { setModal('pet'); setEditTarget(null); setForm({}); }}>
            <Icon.plus /> Nuevo paciente
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div style={{display:'flex', gap:10, margin:'24px 0 20px', flexWrap:'wrap'}}>
        <div style={{flex:1, minWidth:240, position:'relative', maxWidth:360}}>
          <span style={{position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:C.text3}}>{Icon.search()}</span>
          <input
            style={{...S.input, paddingLeft:38}}
            placeholder="Buscar por nombre, dueño o raza..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            {...inputFocusHandlers}
          />
        </div>
        <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
          {[
            { v:'all',       l:'Todas' },
            { v:'healthy',   l:'Saludable' },
            { v:'treatment', l:'Tratamiento' },
            { v:'checkup',   l:'Revisión' },
            { v:'critical',  l:'Crítico' },
          ].map(f => (
            <button
              key={f.v}
              onClick={() => setFilter(f.v)}
              style={{
                background: filter === f.v ? C.accent : C.bg2,
                color:      filter === f.v ? '#fff'   : C.text2,
                border:     `1px solid ${filter === f.v ? C.accent : C.border}`,
                borderRadius:100, padding:'10px 18px', fontSize:13, fontWeight: filter === f.v ? 600 : 500,
                cursor:'pointer', fontFamily:'inherit', transition:'all .15s',
              }}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {/* PATIENTS GRID */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:16}}>
        {filteredPets.map(p => (
          <div key={p.id}
            style={{...S.card, cursor:'pointer', transition:'transform .2s, box-shadow .2s', position:'relative'}}
            onClick={() => setSelectedPet(selectedPet?.id === p.id ? null : p)}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = C.shadowLg; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';   e.currentTarget.style.boxShadow = C.shadow; }}>

            <div style={{position:'absolute', top:18, right:18}}>
              <span style={{fontSize:11, fontWeight:700, padding:'5px 12px', borderRadius:100, background:statusInfo[p.status].bg, color:statusInfo[p.status].c, display:'inline-flex', alignItems:'center', gap:6}}>
                <span style={{width:6, height:6, borderRadius:'50%', background:statusInfo[p.status].dot}} />
                {statusInfo[p.status].l}
              </span>
            </div>

            <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:18}}>
              <PetAvatar species={p.species} name={p.name} size={64} />
              <div style={{minWidth:0}}>
                <div style={{fontWeight:800, fontSize:20, color:C.text, letterSpacing:'-.3px', lineHeight:1.1}}>{p.name}</div>
                <div style={{fontSize:13, color:C.text2, marginTop:4}}>{p.species} · {p.breed}</div>
                <div style={{fontSize:12, color:C.text3, marginTop:2}}>{p.age} años · {p.weight}</div>
              </div>
            </div>

            <div style={{borderTop:`1px solid ${C.border}`, paddingTop:14, display:'flex', flexDirection:'column', gap:6}}>
              <div style={{fontSize:13, color:C.text2, display:'flex', alignItems:'center', gap:8}}>
                <span style={{color:C.text3}}>{Icon.user()}</span>
                {p.owner}
              </div>
              <div style={{fontSize:13, color:C.text2, display:'flex', alignItems:'center', gap:8}}>
                <span style={{color:C.text3}}>{Icon.phone()}</span>
                {p.phone}
              </div>
              <div style={{fontSize:12, fontWeight:600, color: p.vaccinated ? C.accent : C.red, marginTop:6}}>
                {p.vaccinated ? '✓ Vacunas al día' : '⚠ Sin vacunar'}
              </div>
            </div>

            {selectedPet?.id === p.id && (
              <div style={{marginTop:16, background:C.bg3, borderRadius:14, padding:16}}>
                <div style={{fontSize:12, color:C.text2, marginBottom:6}}>
                  <span style={{color:C.text3}}>Microchip:</span> <strong style={{color:C.text, fontFamily:'monospace'}}>{p.microchip}</strong>
                </div>
                <div style={{fontSize:12, color:C.text2, marginBottom:6}}>
                  <span style={{color:C.text3}}>Última visita:</span> <strong style={{color:C.text}}>{p.lastVisit}</strong>
                </div>
                <div style={{fontSize:12, color:C.accent, marginBottom:14, fontWeight:700}}>
                  Próxima cita: {p.nextVisit}
                </div>
                <div style={{display:'flex', gap:8}} onClick={e => e.stopPropagation()}>
                  <button style={{...S.btnGhost, flex:1, justifyContent:'center', background:`${C.accent}10`, color:C.accent, border:`1px solid ${C.accent}30`}} onClick={() => { setModal('pet'); setEditTarget(p); setForm({ ...p }); }}>
                    <Icon.pencil /> Editar
                  </button>
                  <button style={{...S.btnGhost, flex:1, justifyContent:'center', background:`${C.red}10`, color:C.red, border:`1px solid ${C.red}30`}} onClick={() => delPet(p.id)}>
                    <Icon.trash /> Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredPets.length === 0 && (
          <div style={{...S.card, gridColumn:'1 / -1', textAlign:'center', padding:40, color:C.text2}}>
            <div style={{fontSize:48, marginBottom:10, opacity:.3}}>🔍</div>
            Ningún paciente coincide con los filtros.
          </div>
        )}
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:30, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Agenda del día</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:6}}>Jueves 1 de Mayo · {todayAppts.length} citas programadas</div>
        </div>
        <button style={S.btnPri} onClick={() => { setModal('appt'); setForm({}); }}>
          <Icon.plus /> Nueva cita
        </button>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:14, margin:'24px 0'}}>
        {[
          { l:'Total hoy',   v:todayAppts.length,                                              c:C.accent },
          { l:'Completadas', v:todayAppts.filter(a => a.status === 'done').length,             c:C.accent  },
          { l:'Siguiente',   v:todayAppts.filter(a => a.status === 'next').length,             c:C.accent3 },
          { l:'Pendientes',  v:todayAppts.filter(a => a.status === 'pending').length,          c:C.accent2 },
        ].map(k => (
          <div key={k.l} style={{...S.card, padding:'18px 22px'}}>
            <div style={{fontSize:11, color:C.text2, fontWeight:600, letterSpacing:'.3px', textTransform:'uppercase', marginBottom:6}}>{k.l}</div>
            <div style={{fontSize:30, fontWeight:800, color:k.c, lineHeight:1, letterSpacing:'-1px'}}>{k.v}</div>
          </div>
        ))}
      </div>

      <div style={{display:'flex', flexDirection:'column', gap:12}}>
        {todayAppts.map(a => {
          const pet = petByName[a.pet];
          return (
            <div key={a.id} style={{
              ...S.card,
              padding:'18px 22px',
              display:'flex', alignItems:'center', gap:18, flexWrap:'wrap',
              borderLeft:`5px solid ${a.status === 'done' ? C.accent : a.status === 'next' ? '#3b82f6' : C.accent3}`,
            }}>
              <div style={{textAlign:'center', minWidth:64}}>
                <div style={{fontSize:22, fontWeight:800, color:C.accent, fontFamily:'monospace', letterSpacing:'-.5px'}}>{a.time}</div>
                <div style={{fontSize:10, color:C.text3, fontWeight:600, marginTop:2, letterSpacing:'.3px'}}>HRS</div>
              </div>
              <PetAvatar species={pet?.species} name={a.pet} size={48} />
              <div style={{flex:1, minWidth:200}}>
                <div style={{fontWeight:700, fontSize:16, color:C.text, letterSpacing:'-.2px'}}>
                  {a.pet} <span style={{fontSize:13, color:C.text2, fontWeight:400}}>— {a.owner}</span>
                </div>
                <div style={{fontSize:13, color:C.text2, marginTop:3}}>{a.type} · {a.vet}</div>
                {a.notes && <div style={{fontSize:12, color:C.text3, marginTop:4, fontStyle:'italic'}}>"{a.notes}"</div>}
              </div>
              <span style={{fontSize:11, fontWeight:600, padding:'6px 14px', borderRadius:100, background:apptStatus[a.status].bg, color:apptStatus[a.status].c}}>
                {apptStatus[a.status].l}
              </span>
              {a.status === 'pending' && (
                <button style={{...S.btnGhost, background:`${C.accent}10`, color:C.accent, border:`1px solid ${C.accent}30`}} onClick={() => completeAppt(a.id)}>
                  <Icon.check /> Completar
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPharmacy = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:30, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Farmacia</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:6}}>{meds.length} medicamentos · {lowMeds.length} con stock bajo</div>
        </div>
        <div style={{display:'flex', gap:10}}>
          <button style={S.btnGhost} onClick={() => exportCSV(meds, 'farmacia')}>
            <Icon.download /> Exportar
          </button>
          <button style={S.btnPri} onClick={() => { setModal('med'); setEditTarget(null); setForm({}); }}>
            <Icon.plus /> Agregar
          </button>
        </div>
      </div>

      <div style={{...S.card, marginTop:24, padding:0, overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:780}}>
            <thead>
              <tr style={{background:C.bg3}}>
                {['Medicamento','Categoría','Stock','Mínimo','Precio','Estado',''].map(h => (
                  <th key={h} style={{fontSize:11, color:C.text2, fontWeight:700, textAlign:'left', padding:'14px 18px', letterSpacing:'.4px', textTransform:'uppercase'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {meds.map(m => {
                const low = m.stock < m.min;
                const pct = Math.min(100, Math.round(m.stock / m.min * 100));
                return (
                  <tr key={m.id}
                    style={{transition:'background .15s', borderBottom:`1px solid ${C.border}`}}
                    onMouseEnter={e => e.currentTarget.style.background = C.bg3}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{padding:'16px 18px'}}>
                      <div style={{fontWeight:700, fontSize:14, color:C.text}}>{m.name}</div>
                      <div style={{fontSize:11, color:C.text3, marginTop:2}}>{m.unit}</div>
                    </td>
                    <td style={{padding:'16px 18px', fontSize:13, color:C.text2}}>{m.category}</td>
                    <td style={{padding:'16px 18px'}}>
                      <div style={{display:'flex', alignItems:'center', gap:10}}>
                        <div style={{width:80, height:6, borderRadius:3, background:C.bg3, overflow:'hidden'}}>
                          <div style={{width:`${pct}%`, height:'100%', background: low ? C.red : C.accent, transition:'width .3s'}} />
                        </div>
                        <span style={{fontFamily:'monospace', fontWeight:700, fontSize:14, color: low ? C.red : C.text}}>{m.stock}</span>
                      </div>
                    </td>
                    <td style={{padding:'16px 18px', fontSize:13, color:C.text2, fontFamily:'monospace'}}>{m.min}</td>
                    <td style={{padding:'16px 18px', fontFamily:'monospace', fontWeight:700, color:C.text}}>{fmt(m.price)}</td>
                    <td style={{padding:'16px 18px'}}>
                      <span style={{fontSize:11, fontWeight:700, padding:'5px 12px', borderRadius:100, background: low ? `${C.red}15` : `${C.accent}15`, color: low ? C.red : C.accent, whiteSpace:'nowrap'}}>
                        {low ? 'Stock bajo' : 'En stock'}
                      </span>
                    </td>
                    <td style={{padding:'16px 18px'}}>
                      <div style={{display:'flex', gap:6}}>
                        <button style={{...S.btnIcon, background:`${C.accent}15`, color:C.accent}} onClick={() => { setModal('med'); setEditTarget(m); setForm({ ...m }); }} aria-label="Editar"><Icon.pencil /></button>
                        <button style={{...S.btnIcon, background:`${C.red}15`, color:C.red}} onClick={() => delMed(m.id)} aria-label="Eliminar"><Icon.trash /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => {
    const totalAppts = REVENUE_DATA.reduce((s, r) => s + r.citas, 0);
    return (
      <div className="fade-in">
        <div style={{marginBottom:8}}>
          <h1 style={{fontSize:30, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Reportes</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:6}}>Análisis de la clínica · últimos 6 meses</div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14, margin:'24px 0'}}>
          {[
            { l:'Ingresos totales',  v:fmt(totalRevenue),                                  c:C.accent,  bg:C.bgMint  },
            { l:'Citas totales',     v:totalAppts.toLocaleString('es-CO'),                 c:C.accent3, bg:C.bgWarm  },
            { l:'Promedio mensual',  v:fmt(Math.round(totalRevenue / 6)),                  c:C.accent2, bg:'rgba(251,113,133,.1)' },
            { l:'Pacientes activos', v:pets.length,                                        c:C.text,    bg:C.bg3 },
          ].map(k => (
            <div key={k.l} style={{...S.card, background:k.bg, border:'none'}}>
              <div style={{fontSize:11, color:C.text2, fontWeight:600, letterSpacing:'.3px', textTransform:'uppercase', marginBottom:8}}>{k.l}</div>
              <div style={{fontSize:24, fontWeight:800, color:k.c, fontFamily:'monospace', letterSpacing:'-.5px'}}>{k.v}</div>
            </div>
          ))}
        </div>

        <div style={{display:'grid', gridTemplateColumns:'minmax(0,1.5fr) minmax(0,1fr)', gap:20, marginBottom:20}}>
          <div style={S.card}>
            <h2 style={{fontSize:16, fontWeight:700, margin:'0 0 18px 0', color:C.text, letterSpacing:'-.3px'}}>Tendencia de ingresos</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="mes" tick={{fontSize:12, fill:C.text2}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000000).toFixed(0)}M`} />
                <Tooltip contentStyle={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:12, fontSize:12, boxShadow:C.shadow}} formatter={v => [fmt(v), 'Ingresos']} />
                <Line type="monotone" dataKey="ingresos" stroke={C.accent} strokeWidth={3} dot={{fill:C.accent, r:6, strokeWidth:0}} activeDot={{r:8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={S.card}>
            <h2 style={{fontSize:16, fontWeight:700, margin:'0 0 18px 0', color:C.text, letterSpacing:'-.3px'}}>Servicios prestados</h2>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={SERVICE_DIST} cx="50%" cy="50%" innerRadius={55} outerRadius={88} paddingAngle={4} dataKey="value">
                  {SERVICE_DIST.map(e => <Cell key={e.name} fill={e.color} stroke={C.bg2} strokeWidth={2} />)}
                </Pie>
                <Tooltip contentStyle={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:12, fontSize:12, boxShadow:C.shadow}} />
                <Legend wrapperStyle={{fontSize:11}} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={S.card}>
          <h2 style={{fontSize:16, fontWeight:700, margin:'0 0 18px 0', color:C.text, letterSpacing:'-.3px'}}>Citas por mes</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" tick={{fontSize:12, fill:C.text2}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:12, fontSize:12, boxShadow:C.shadow}} />
              <Bar dataKey="citas" fill={C.accent2} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const pageRender = {
    dashboard: renderDashboard,
    patients:  renderPatients,
    schedule:  renderSchedule,
    pharmacy:  renderPharmacy,
    analytics: renderAnalytics,
  }[page] || renderDashboard;

  return (
    <div style={{minHeight:'100vh', background:C.bg, fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif", color:C.text, fontSize:14}}>

      {/* MODALS */}
      {modal === 'pet' && (
        <Modal title={editTarget ? 'Editar paciente' : 'Nuevo paciente'} onSave={savePet} onClose={closeModal} C={C} S={S}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
            <div><label style={S.label}>Nombre *</label><input style={S.input} value={form.name||''} onChange={fv('name')} placeholder="Max" autoComplete="off" {...inputFocusHandlers} /></div>
            <div><label style={S.label}>Especie</label>
              <select style={S.input} value={form.species||''} onChange={fv('species')} {...inputFocusHandlers}>
                <option value="">Seleccionar...</option>
                <option>Perro</option><option>Gato</option><option>Conejo</option><option>Ave</option><option>Otro</option>
              </select>
            </div>
            <div><label style={S.label}>Raza</label><input style={S.input} value={form.breed||''} onChange={fv('breed')} placeholder="Golden Retriever" autoComplete="off" {...inputFocusHandlers} /></div>
            <div><label style={S.label}>Edad (años)</label><input style={S.input} type="number" min="0" value={form.age||''} onChange={fv('age')} placeholder="3" {...inputFocusHandlers} /></div>
            <div><label style={S.label}>Peso</label><input style={S.input} value={form.weight||''} onChange={fv('weight')} placeholder="28kg" autoComplete="off" {...inputFocusHandlers} /></div>
            <div><label style={S.label}>Microchip</label><input style={S.input} value={form.microchip||''} onChange={fv('microchip')} placeholder="982000..." autoComplete="off" {...inputFocusHandlers} /></div>
            <div><label style={S.label}>Dueño *</label><input style={S.input} value={form.owner||''} onChange={fv('owner')} placeholder="Nombre completo" autoComplete="off" {...inputFocusHandlers} /></div>
            <div><label style={S.label}>Teléfono</label><input style={S.input} value={form.phone||''} onChange={fv('phone')} placeholder="310-000-0000" autoComplete="off" {...inputFocusHandlers} /></div>
          </div>
        </Modal>
      )}

      {modal === 'appt' && (
        <Modal title="Nueva cita" onSave={saveAppt} onClose={closeModal} C={C} S={S}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Mascota *</label>
              <select style={S.input} value={form.pet||''} onChange={fv('pet')} {...inputFocusHandlers}>
                <option value="">Seleccionar paciente...</option>
                {pets.map(p => <option key={p.id} value={p.name}>{p.name} — {p.owner}</option>)}
              </select>
            </div>
            <div><label style={S.label}>Hora *</label><input style={S.input} type="time" value={form.time||''} onChange={fv('time')} {...inputFocusHandlers} /></div>
            <div><label style={S.label}>Veterinario</label>
              <select style={S.input} value={form.vet||''} onChange={fv('vet')} {...inputFocusHandlers}>
                <option value="">Asignar...</option>
                <option>Dr. Ramírez</option><option>Dra. Torres</option>
              </select>
            </div>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Tipo de servicio *</label>
              <select style={S.input} value={form.type||''} onChange={fv('type')} {...inputFocusHandlers}>
                <option value="">Seleccionar...</option>
                <option>Consulta</option><option>Vacunación</option><option>Cirugía</option>
                <option>Baño y corte</option><option>Desparasitación</option><option>Urgencia</option>
              </select>
            </div>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Notas</label><textarea style={{...S.input, height:80, resize:'none'}} value={form.notes||''} onChange={fv('notes')} placeholder="Observaciones..." {...inputFocusHandlers} /></div>
          </div>
        </Modal>
      )}

      {modal === 'med' && (
        <Modal title={editTarget ? 'Editar medicamento' : 'Nuevo medicamento'} onSave={saveMed} onClose={closeModal} C={C} S={S}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Nombre *</label><input style={S.input} value={form.name||''} onChange={fv('name')} placeholder="Amoxicilina 500mg" autoComplete="off" {...inputFocusHandlers} /></div>
            <div><label style={S.label}>Categoría</label>
              <select style={S.input} value={form.category||''} onChange={fv('category')} {...inputFocusHandlers}>
                <option value="">Seleccionar...</option>
                <option>Antibiótico</option><option>Antiparasitario</option><option>Vitamina</option>
                <option>Antiinflamatorio</option><option>Pulgas</option><option>Otro</option>
              </select>
            </div>
            <div><label style={S.label}>Unidad</label><input style={S.input} value={form.unit||''} onChange={fv('unit')} placeholder="tabletas" autoComplete="off" {...inputFocusHandlers} /></div>
            <div><label style={S.label}>Stock actual *</label><input style={S.input} type="number" min="0" value={form.stock||''} onChange={fv('stock')} {...inputFocusHandlers} /></div>
            <div><label style={S.label}>Stock mínimo</label><input style={S.input} type="number" min="0" value={form.min||''} onChange={fv('min')} placeholder="10" {...inputFocusHandlers} /></div>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Precio (COP)</label><input style={S.input} type="number" min="0" value={form.price||''} onChange={fv('price')} placeholder="2800" {...inputFocusHandlers} /></div>
          </div>
        </Modal>
      )}

      {/* CONFIRM */}
      {confirm && (
        <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(28,24,22,.55)', backdropFilter:'blur(4px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16}} onClick={() => setConfirm(null)}>
          <div style={{...S.card, maxWidth:400, textAlign:'center', padding:32}} onClick={e => e.stopPropagation()}>
            <div style={{width:64, height:64, borderRadius:'50%', background:`${C.red}15`, color:C.red, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px'}}>
              {Icon.alert({width:28, height:28})}
            </div>
            <div style={{fontSize:17, fontWeight:700, marginBottom:8, color:C.text}}>{confirm.msg}</div>
            <div style={{fontSize:13, color:C.text2, marginBottom:24}}>Esta acción no se puede deshacer.</div>
            <div style={{display:'flex', gap:10, justifyContent:'center'}}>
              <button style={S.btnGhost} onClick={() => setConfirm(null)}>Cancelar</button>
              <button style={{...S.btnPri, background:C.red}} onClick={confirm.onYes}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div role="status" aria-live="polite" style={{position:'fixed', bottom:24, right:24, background: toast.type === 'error' ? C.red : C.accent, color:'#fff', padding:'14px 22px', borderRadius:14, fontSize:14, fontWeight:600, zIndex:1001, boxShadow:'0 12px 40px rgba(0,0,0,.2)', display:'flex', alignItems:'center', gap:10, maxWidth:'calc(100vw - 48px)'}}>
          {toast.type === 'error' ? Icon.alert() : Icon.check()}
          {toast.msg}
        </div>
      )}

      {/* TOP NAV */}
      <header style={{
        background:C.bg2, borderBottom:`1px solid ${C.border}`, padding:'14px 32px',
        display:'flex', alignItems:'center', gap:24, position:'sticky', top:0, zIndex:50,
        backdropFilter:'blur(12px)',
      }}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <div style={{
            width:42, height:42, borderRadius:14,
            background: `linear-gradient(135deg, ${C.accent}, ${C.accent3})`,
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#fff', boxShadow:'0 4px 12px rgba(16,185,129,.25)',
          }}>
            {Icon.pawprint()}
          </div>
          <div>
            <div style={{fontWeight:800, fontSize:17, letterSpacing:'-.5px', color:C.text}}>VetCare</div>
            <div style={{fontSize:11, color:C.text2}}>Clínica · v2.0</div>
          </div>
        </div>

        <nav style={{display:'flex', gap:4, marginLeft:32, flex:1, overflowX:'auto'}}>
          {navItems.map(n => {
            const active = page === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setPage(n.id)}
                style={{
                  background: active ? C.bgMint : 'transparent',
                  color:      active ? C.accent : C.text2,
                  border:'none', borderRadius:12, padding:'10px 18px',
                  fontSize:14, fontWeight: active ? 700 : 500,
                  cursor:'pointer', fontFamily:'inherit',
                  display:'inline-flex', alignItems:'center', gap:8,
                  whiteSpace:'nowrap', transition:'all .15s',
                }}
              >
                {n.icon()}
                {n.label}
              </button>
            );
          })}
        </nav>

        <div style={{display:'flex', alignItems:'center', gap:10, position:'relative'}}>
          <button onClick={() => setShowNotifs(s => !s)} aria-label="Notificaciones" style={{...S.btnIcon, position:'relative', width:40, height:40}}>
            {Icon.bell()}
            {notifs.length > 0 && (
              <span style={{position:'absolute', top:4, right:4, background:C.accent2, color:'#fff', fontSize:10, fontWeight:700, padding:'1px 5px', borderRadius:100, minWidth:16, textAlign:'center', lineHeight:1.4}}>{notifs.length}</span>
            )}
          </button>
          {showNotifs && (
            <div style={{position:'absolute', top:46, right:0, background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:16, width:320, boxShadow:C.shadowLg, zIndex:60}}>
              <div style={{fontSize:14, fontWeight:700, marginBottom:12, color:C.text}}>Notificaciones ({notifs.length})</div>
              {notifs.length === 0
                ? <div style={{fontSize:13, color:C.text2, textAlign:'center', padding:14}}>Sin notificaciones</div>
                : notifs.map(n => (
                    <div key={n.key} style={{display:'flex', gap:12, padding:'10px 0', borderBottom:`1px solid ${C.border}`, fontSize:13}}>
                      <div style={{width:8, height:8, borderRadius:'50%', background: n.type === 'error' ? C.red : C.accent3, marginTop:6, flexShrink:0}} />
                      <div style={{flex:1}}>
                        <div style={{color:C.text}}>{n.text}</div>
                        <div style={{color:C.text3, fontSize:11, marginTop:2}}>{n.time}</div>
                      </div>
                    </div>
                  ))}
            </div>
          )}
          <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} aria-label="Tema" style={{...S.btnIcon, width:40, height:40}}>
            {theme === 'light' ? Icon.moon() : Icon.sun()}
          </button>
          <div style={{
            display:'flex', alignItems:'center', gap:10, padding:'4px 12px 4px 4px',
            background:C.bg3, borderRadius:100,
          }}>
            <div style={{width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${C.accent},${C.accent3})`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13}}>JM</div>
            <div>
              <div style={{fontSize:13, fontWeight:700, color:C.text, lineHeight:1}}>Dr. Maya</div>
              <div style={{fontSize:10, color:C.text2, marginTop:2}}>Veterinario</div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main style={{maxWidth:1400, margin:'0 auto', padding:'28px 32px 60px'}}>
        {pageRender()}
      </main>
    </div>
  );
}
