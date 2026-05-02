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
  { id:5, time:'14:00', pet:'Toby',   owner:'Pedro Vargas', type:'Urgencia',       vet:'Dr. Ramírez', status:'pending', notes:'⚠ Caso crítico',              date:'2025-05-01' },
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
  { name:'Consulta',      value:35, color:'#6c63ff' },
  { name:'Vacunación',    value:22, color:'#43e97b' },
  { name:'Cirugía',       value:15, color:'#ff6584' },
  { name:'Baño/Estética', value:18, color:'#f59e0b' },
  { name:'Urgencias',     value:10, color:'#ec4899' },
];

const themes = {
  light: { bg:'#f8f9ff', bg2:'#ffffff', bg3:'#f0f2ff', accent:'#6c63ff', accent2:'#ff6584', accent3:'#43e97b', text:'#2d3748', text2:'#718096', text3:'#a0aec0', border:'#e2e8f0', red:'#fc5c7d', orange:'#f6ad55', shadow:'0 2px 12px rgba(0,0,0,.04)' },
  dark:  { bg:'#0f0a1a', bg2:'#1a1230', bg3:'#241640', accent:'#a78bfa', accent2:'#f472b6', accent3:'#34d399', text:'#f1f5f9', text2:'#94a3b8', text3:'#64748b', border:'#2d1f4e', red:'#f87171', orange:'#fb923c', shadow:'0 2px 12px rgba(0,0,0,.3)' },
};

const statusInfo = {
  healthy:   { l:'Saludable',      bg:'rgba(67,233,123,.15)', c:'#16a34a', icon:'✓'  },
  treatment: { l:'En tratamiento', bg:'rgba(251,191,36,.15)', c:'#d97706', icon:'💊' },
  checkup:   { l:'Revisión',       bg:'rgba(59,130,246,.15)', c:'#2563eb', icon:'📋' },
  critical:  { l:'Crítico',        bg:'rgba(239,68,68,.15)',  c:'#dc2626', icon:'🚨' },
};

const apptStatus = {
  done:    { l:'Completada', bg:'rgba(67,233,123,.15)', c:'#16a34a' },
  next:    { l:'Siguiente',  bg:'rgba(59,130,246,.15)', c:'#2563eb' },
  pending: { l:'Pendiente',  bg:'rgba(251,191,36,.15)', c:'#d97706' },
};

const fmt = n => '$' + Number(n || 0).toLocaleString('es-CO');
const speciesIcon = sp => sp === 'Perro' ? '🐶' : sp === 'Gato' ? '🐱' : sp === 'Conejo' ? '🐰' : sp === 'Ave' ? '🐦' : '🐾';

// ─── PRESENTATIONAL COMPONENTS (top-level: estables entre renders) ──
// Definidos fuera de App para evitar el bug de re-mount que pierde el
// foco de los inputs en cada keystroke.

function KPI({ label, value, sub, color, icon, trend, C, S }) {
  return (
    <div
      style={{...S.card, display:'flex', alignItems:'center', gap:14, transition:'transform .2s'}}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{width:50, height:50, borderRadius:14, background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0}}>{icon}</div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:11, color:C.text2, fontWeight:600, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:4}}>{label}</div>
        <div style={{fontSize:22, fontWeight:700, color, fontFamily:'monospace', marginBottom:2}}>{value}</div>
        <div style={{fontSize:12, color:C.text2, display:'flex', alignItems:'center', gap:6}}>
          {trend !== undefined && trend !== null && (
            <span style={{color: trend > 0 ? C.accent3 : C.red, fontWeight:700}}>
              {trend > 0 ? '↑' : '↓'}{Math.abs(trend)}%
            </span>
          )}
          {sub}
        </div>
      </div>
    </div>
  );
}

function Modal({ title, onSave, onClose, children, size='md', C, S }) {
  return (
    <div
      style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,.7)', zIndex:999, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'40px 16px', overflowY:'auto'}}
      onClick={onClose}
    >
      <div
        style={{...S.card, width:'100%', maxWidth: size==='lg' ? 720 : 520, boxShadow:'0 30px 80px rgba(0,0,0,.4)'}}
        onClick={e => e.stopPropagation()}
      >
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
          <h2 style={{fontSize:16, fontWeight:700, margin:0, color:C.text}}>{title}</h2>
          <button onClick={onClose} aria-label="Cerrar" style={{background:'transparent', border:'none', color:C.text2, fontSize:22, cursor:'pointer', padding:0, lineHeight:1}}>×</button>
        </div>
        {children}
        <div style={{display:'flex', gap:10, justifyContent:'flex-end', marginTop:22}}>
          <button style={S.btnGhost} onClick={onClose}>Cancelar</button>
          <button style={S.btnPri} onClick={onSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

// ─── APP ────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme]             = useState('light');
  const [page, setPage]               = useState('dashboard');
  const [pets, setPets]               = useState(INIT_PETS);
  const [appts, setAppts]             = useState(INIT_APPTS);
  const [meds, setMeds]               = useState(INIT_MEDS);
  const [search, setSearch]           = useState('');
  const [filter, setFilter]           = useState('all');
  const [modal, setModal]             = useState(null);
  const [editTarget, setEditTarget]   = useState(null);
  const [form, setForm]               = useState({});
  const [toast, setToast]             = useState(null);
  const [confirm, setConfirm]         = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showNotifs, setShowNotifs]   = useState(false);

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
    if (!data.length) { showToast('No hay datos para exportar', 'error'); return; }
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

  // Mapa rápido nombre-de-mascota → especie, para iconos correctos en agenda
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
    ...criticalPets.map(p => ({ type:'error',   text:`Paciente crítico: ${p.name}`, time:'hace 30 min' })),
    ...lowMeds.map(m     => ({ type:'warning', text:`Stock bajo: ${m.name}`,        time:'hace 1 h' })),
  ];

  const navItems = [
    { id:'dashboard', label:'Dashboard', icon:'🏠' },
    { id:'patients',  label:'Pacientes', icon:'🐾' },
    { id:'schedule',  label:'Agenda',    icon:'📅' },
    { id:'pharmacy',  label:'Farmacia',  icon:'💊' },
    { id:'analytics', label:'Reportes',  icon:'📊' },
  ];

  const S = {
    card:     { background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:22, boxShadow:C.shadow },
    input:    { background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, padding:'9px 14px', fontSize:13, color:C.text, outline:'none', fontFamily:'inherit', width:'100%', boxSizing:'border-box' },
    label:    { fontSize:11, color:C.text2, fontWeight:600, display:'block', marginBottom:6, letterSpacing:'.5px', textTransform:'uppercase' },
    btnPri:   { background:`linear-gradient(135deg,${C.accent},${C.accent2})`, color:'#fff', border:'none', borderRadius:10, padding:'10px 20px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' },
    btnGhost: { background:'transparent', color:C.text2, border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 20px', fontSize:13, cursor:'pointer', fontFamily:'inherit' },
    btnEdit:  { background:`${C.accent}25`, color:C.accent, border:'none', borderRadius:6, padding:'5px 12px', fontSize:12, cursor:'pointer', fontFamily:'inherit' },
    btnDel:   { background:`${C.red}20`, color:C.red, border:'none', borderRadius:6, padding:'5px 10px', fontSize:12, cursor:'pointer', fontFamily:'inherit' },
  };

  // ─── PAGE RENDERERS (funciones, NO componentes — evitan re-mount) ─

  const renderDashboard = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6, flexWrap:'wrap', gap:10}}>
        <div>
          <div style={{fontSize:22, fontWeight:700}}>Dashboard</div>
          <div style={{fontSize:13, color:C.text2}}>Jueves 1 Mayo 2025 — Clínica VetCare</div>
        </div>
        <button style={S.btnGhost} onClick={() => exportCSV(appts, 'agenda_dia')}>📥 Exportar agenda</button>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:14, marginBottom:18, marginTop:18}}>
        <KPI C={C} S={S} label="Pacientes hoy"  value={todayAppts.length}                                  sub={`${todayAppts.filter(a => a.status === 'done').length} completadas`} color={C.accent}  icon="📋" trend={12} />
        <KPI C={C} S={S} label="En tratamiento" value={pets.filter(p => p.status === 'treatment').length} sub="Requieren seguimiento" color={C.orange}  icon="💉" />
        <KPI C={C} S={S} label="Críticos"       value={criticalPets.length}                               sub="Urgente atención"      color={C.red}     icon="🚨" />
        <KPI C={C} S={S} label="Ingresos hoy"   value={fmt(380000)}                                       sub="3 servicios"           color={C.accent3} icon="💰" trend={8} />
      </div>
      <div style={{display:'grid', gridTemplateColumns:'minmax(0,1.5fr) minmax(0,1fr)', gap:14, marginBottom:14}}>
        <div style={S.card}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14}}>
            <div style={{fontSize:15, fontWeight:700}}>Citas del día</div>
            <button style={{...S.btnGhost, fontSize:12, padding:'5px 12px'}} onClick={() => setPage('schedule')}>Ver agenda →</button>
          </div>
          {todayAppts.map(a => (
            <div key={a.id} style={{display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:`1px solid ${C.border}`}}>
              <div style={{fontSize:14, fontWeight:700, color:C.accent, width:42, flexShrink:0, fontFamily:'monospace'}}>{a.time}</div>
              <div style={{fontSize:24, flexShrink:0}}>{speciesIcon(petByName[a.pet]?.species)}</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontWeight:600, fontSize:14}}>{a.pet}</div>
                <div style={{fontSize:12, color:C.text2}}>{a.type} · {a.vet}</div>
              </div>
              {a.status === 'pending' && (
                <button onClick={() => completeAppt(a.id)} style={{...S.btnEdit, fontSize:11, padding:'4px 10px'}}>✓ Completar</button>
              )}
              <span style={{fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:12, background:apptStatus[a.status].bg, color:apptStatus[a.status].c, whiteSpace:'nowrap'}}>{apptStatus[a.status].l}</span>
            </div>
          ))}
        </div>
        <div>
          {criticalPets.length > 0 && (
            <div style={{...S.card, marginBottom:14, background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:'none'}}>
              <div style={{fontSize:13, color:'rgba(255,255,255,.8)', marginBottom:8}}>⚠ Alerta crítica</div>
              <div style={{fontSize:18, fontWeight:700, color:'#fff', marginBottom:4}}>{criticalPets[0].name}</div>
              <div style={{fontSize:13, color:'rgba(255,255,255,.85)'}}>{criticalPets[0].owner} · {criticalPets[0].phone}</div>
              <div style={{marginTop:12, background:'rgba(255,255,255,.2)', borderRadius:8, padding:'8px 14px', fontSize:12, color:'#fff'}}>
                Próxima cita: {criticalPets[0].nextVisit}
              </div>
            </div>
          )}
          <div style={S.card}>
            <div style={{fontSize:14, fontWeight:700, marginBottom:14}}>Stock bajo ({lowMeds.length})</div>
            {lowMeds.slice(0, 4).map(m => (
              <div key={m.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:`1px solid ${C.border}`}}>
                <div style={{minWidth:0, flex:1, marginRight:8}}>
                  <div style={{fontSize:13, fontWeight:600}}>{m.name}</div>
                  <div style={{fontSize:11, color:C.text3}}>{m.unit}</div>
                </div>
                <span style={{fontFamily:'monospace', fontWeight:700, color:C.red, fontSize:13}}>{m.stock}</span>
              </div>
            ))}
            {lowMeds.length === 0 && (
              <div style={{fontSize:12, color:C.text2, textAlign:'center', padding:14}}>✓ Todo en orden</div>
            )}
          </div>
        </div>
      </div>
      <div style={S.card}>
        <div style={{fontSize:14, fontWeight:700, marginBottom:14}}>Ingresos últimos 6 meses</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={REVENUE_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
            <XAxis dataKey="mes" tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} />
            <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000000).toFixed(0)}M`} />
            <Tooltip contentStyle={{background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12}} formatter={v => [fmt(v), 'Ingresos']} />
            <Bar dataKey="ingresos" fill={C.accent} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderPatients = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4, flexWrap:'wrap', gap:10}}>
        <div style={{fontSize:22, fontWeight:700}}>Pacientes</div>
        <div style={{display:'flex', gap:8}}>
          <button style={S.btnGhost} onClick={() => exportCSV(filteredPets, 'pacientes')}>📥 Exportar</button>
          <button style={S.btnPri} onClick={() => { setModal('pet'); setEditTarget(null); setForm({}); }}>+ Nuevo paciente</button>
        </div>
      </div>
      <div style={{fontSize:13, color:C.text2, marginBottom:18}}>{filteredPets.length} de {pets.length} pacientes</div>
      <div style={{display:'flex', gap:10, marginBottom:16, flexWrap:'wrap'}}>
        <input style={{...S.input, maxWidth:280}} placeholder="🔍 Buscar nombre, dueño o raza..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={{...S.input, width:'auto'}} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">Todos los estados</option>
          <option value="healthy">Saludable</option>
          <option value="treatment">En tratamiento</option>
          <option value="checkup">Revisión</option>
          <option value="critical">Crítico</option>
        </select>
        {(search || filter !== 'all') && (
          <button style={S.btnGhost} onClick={() => { setSearch(''); setFilter('all'); }}>Limpiar</button>
        )}
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:14}}>
        {filteredPets.map(p => (
          <div key={p.id}
            style={{...S.card, cursor:'pointer', transition:'transform .2s, box-shadow .2s'}}
            onClick={() => setSelectedPet(selectedPet?.id === p.id ? null : p)}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14}}>
              <div style={{width:50, height:50, borderRadius:14, background:`${C.accent}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26}}>{speciesIcon(p.species)}</div>
              <span style={{fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:12, background:statusInfo[p.status].bg, color:statusInfo[p.status].c}}>{statusInfo[p.status].icon} {statusInfo[p.status].l}</span>
            </div>
            <div style={{fontWeight:700, fontSize:16, marginBottom:2}}>{p.name}</div>
            <div style={{fontSize:13, color:C.text2, marginBottom:10}}>{p.species} · {p.breed} · {p.age} años · {p.weight}</div>
            <div style={{borderTop:`1px solid ${C.border}`, paddingTop:12}}>
              <div style={{fontSize:12, color:C.text2, marginBottom:3}}>👤 {p.owner}</div>
              <div style={{fontSize:12, color:C.text2, marginBottom:3}}>📞 {p.phone}</div>
              <div style={{fontSize:11, color: p.vaccinated ? C.accent3 : C.red, marginTop:6, fontWeight:600}}>{p.vaccinated ? '✓ Vacunas al día' : '⚠ Sin vacunar'}</div>
            </div>
            {selectedPet?.id === p.id && (
              <div style={{marginTop:14, background:C.bg3, borderRadius:10, padding:14}}>
                <div style={{fontSize:11, color:C.text2, marginBottom:3}}>Microchip: <strong style={{color:C.text, fontFamily:'monospace'}}>{p.microchip}</strong></div>
                <div style={{fontSize:12, color:C.text2, marginBottom:3}}>Última visita: <strong style={{color:C.text}}>{p.lastVisit}</strong></div>
                <div style={{fontSize:12, color:C.accent, marginBottom:10, fontWeight:600}}>Próxima cita: {p.nextVisit}</div>
                <div style={{display:'flex', gap:8}} onClick={e => e.stopPropagation()}>
                  <button style={{...S.btnEdit, flex:1, fontSize:12}} onClick={() => { setModal('pet'); setEditTarget(p); setForm({ ...p }); }}>✏️ Editar</button>
                  <button style={{...S.btnDel,  flex:1, fontSize:12}} onClick={() => delPet(p.id)}>🗑️ Eliminar</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredPets.length === 0 && (
          <div style={{...S.card, gridColumn:'1 / -1', textAlign:'center', color:C.text2}}>
            Ningún paciente coincide con los filtros.
          </div>
        )}
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18, flexWrap:'wrap', gap:10}}>
        <div>
          <div style={{fontSize:22, fontWeight:700}}>Agenda</div>
          <div style={{fontSize:13, color:C.text2}}>Jueves 1 Mayo 2025 — {todayAppts.length} citas</div>
        </div>
        <button style={S.btnPri} onClick={() => { setModal('appt'); setForm({}); }}>+ Nueva cita</button>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:12, marginBottom:18}}>
        <KPI C={C} S={S} label="Total hoy"   value={todayAppts.length}                                  sub="Programadas"   color={C.accent}  icon="📅" />
        <KPI C={C} S={S} label="Completadas" value={todayAppts.filter(a => a.status === 'done').length}    sub="Atendidas hoy" color={C.accent3} icon="✓" />
        <KPI C={C} S={S} label="Pendientes"  value={todayAppts.filter(a => a.status === 'pending').length} sub="Por atender"   color={C.orange}  icon="⏰" />
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:10}}>
        {todayAppts.map(a => (
          <div key={a.id} style={{...S.card, display:'flex', alignItems:'center', gap:18, borderLeft:`4px solid ${a.status === 'done' ? C.accent3 : a.status === 'next' ? C.accent : C.border}`, flexWrap:'wrap'}}>
            <div style={{textAlign:'center', minWidth:54}}>
              <div style={{fontSize:18, fontWeight:700, color:C.accent, fontFamily:'monospace'}}>{a.time}</div>
            </div>
            <div style={{fontSize:30}}>{speciesIcon(petByName[a.pet]?.species)}</div>
            <div style={{flex:1, minWidth:200}}>
              <div style={{fontWeight:700, fontSize:15}}>{a.pet} <span style={{fontSize:13, color:C.text2, fontWeight:400}}>— {a.owner}</span></div>
              <div style={{fontSize:13, color:C.text2, marginTop:2}}>{a.type} · {a.vet}</div>
              {a.notes && <div style={{fontSize:12, color:C.text3, marginTop:3, fontStyle:'italic'}}>{a.notes}</div>}
            </div>
            <span style={{fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:12, background:apptStatus[a.status].bg, color:apptStatus[a.status].c, flexShrink:0}}>{apptStatus[a.status].l}</span>
            {a.status === 'pending' && <button style={S.btnEdit} onClick={() => completeAppt(a.id)}>✓ Completar</button>}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPharmacy = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4, flexWrap:'wrap', gap:10}}>
        <div style={{fontSize:22, fontWeight:700}}>Farmacia</div>
        <div style={{display:'flex', gap:8}}>
          <button style={S.btnGhost} onClick={() => exportCSV(meds, 'farmacia')}>📥 Exportar</button>
          <button style={S.btnPri} onClick={() => { setModal('med'); setEditTarget(null); setForm({}); }}>+ Agregar medicamento</button>
        </div>
      </div>
      <div style={{fontSize:13, color:C.text2, marginBottom:18}}>{meds.length} medicamentos · {lowMeds.length} con stock bajo</div>
      <div style={S.card}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:700}}>
            <thead>
              <tr>{['Medicamento','Categoría','Stock','Mín','Unidad','Precio','Estado',''].map(h => (
                <th key={h} style={{fontSize:11, color:C.text2, fontWeight:600, textAlign:'left', padding:'10px 12px', borderBottom:`1px solid ${C.border}`, textTransform:'uppercase', letterSpacing:'.3px'}}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {meds.map(m => {
                const low = m.stock < m.min;
                const pct = Math.min(100, Math.round(m.stock / m.min * 100));
                return (
                  <tr key={m.id}
                    style={{background: low ? `${C.red}08` : 'transparent', transition:'background .15s'}}
                    onMouseEnter={e => e.currentTarget.style.background = C.bg3}
                    onMouseLeave={e => e.currentTarget.style.background = low ? `${C.red}08` : 'transparent'}>
                    <td style={{padding:'12px', fontWeight:600, fontSize:13}}>{m.name}</td>
                    <td style={{padding:'12px', fontSize:12, color:C.text2}}>{m.category}</td>
                    <td style={{padding:'12px'}}>
                      <div style={{display:'flex', alignItems:'center', gap:8}}>
                        <div style={{width:60, height:5, borderRadius:3, background:C.bg3}}>
                          <div style={{width:`${pct}%`, height:'100%', borderRadius:3, background: low ? C.red : C.accent3, transition:'width .3s'}} />
                        </div>
                        <span style={{fontFamily:'monospace', fontWeight:700, fontSize:13, color: low ? C.red : C.text}}>{m.stock}</span>
                      </div>
                    </td>
                    <td style={{padding:'12px', fontSize:13, color:C.text2}}>{m.min}</td>
                    <td style={{padding:'12px', fontSize:13, color:C.text2}}>{m.unit}</td>
                    <td style={{padding:'12px', fontFamily:'monospace', fontWeight:600, fontSize:13}}>{fmt(m.price)}</td>
                    <td style={{padding:'12px'}}>
                      <span style={{fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:12, background: low ? `${C.red}20` : `${C.accent3}20`, color: low ? C.red : C.accent3}}>{low ? '⚠ Stock bajo' : '✓ Normal'}</span>
                    </td>
                    <td style={{padding:'12px'}}>
                      <div style={{display:'flex', gap:6}}>
                        <button style={S.btnEdit} onClick={() => { setModal('med'); setEditTarget(m); setForm({ ...m }); }}>✏️</button>
                        <button style={S.btnDel}  onClick={() => delMed(m.id)}>🗑️</button>
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

  const renderAnalytics = () => (
    <div className="fade-in">
      <div style={{fontSize:22, fontWeight:700, marginBottom:4}}>Reportes & Analytics</div>
      <div style={{fontSize:13, color:C.text2, marginBottom:24}}>Análisis de la clínica · últimos 6 meses</div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:12, marginBottom:18}}>
        <KPI C={C} S={S} label="Ingresos totales"  value={fmt(totalRevenue)}                                 sub="6 meses"     color={C.accent3} icon="💰" trend={15} />
        <KPI C={C} S={S} label="Citas totales"     value={REVENUE_DATA.reduce((s, r) => s + r.citas, 0)} sub="Atendidas"   color={C.accent}  icon="📅" trend={12} />
        <KPI C={C} S={S} label="Promedio mensual"  value={fmt(Math.round(totalRevenue / 6))}                 sub="Por mes"     color={C.accent2} icon="📊" />
        <KPI C={C} S={S} label="Pacientes activos" value={pets.length}                                       sub="Registrados" color={C.orange}  icon="🐾" />
      </div>
      <div style={{display:'grid', gridTemplateColumns:'minmax(0,1.5fr) minmax(0,1fr)', gap:14, marginBottom:14}}>
        <div style={S.card}>
          <div style={{fontSize:14, fontWeight:700, marginBottom:14}}>Tendencia de ingresos</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000000).toFixed(0)}M`} />
              <Tooltip contentStyle={{background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12}} formatter={v => [fmt(v), 'Ingresos']} />
              <Line type="monotone" dataKey="ingresos" stroke={C.accent} strokeWidth={3} dot={{fill:C.accent, r:5}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={S.card}>
          <div style={{fontSize:14, fontWeight:700, marginBottom:14}}>Servicios prestados</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={SERVICE_DIST} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {SERVICE_DIST.map(e => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12}} />
              <Legend wrapperStyle={{fontSize:11}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={S.card}>
        <div style={{fontSize:14, fontWeight:700, marginBottom:14}}>Citas por mes</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={REVENUE_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
            <XAxis dataKey="mes" tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} />
            <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12}} />
            <Bar dataKey="citas" fill={C.accent2} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const pageRender = {
    dashboard: renderDashboard,
    patients:  renderPatients,
    schedule:  renderSchedule,
    pharmacy:  renderPharmacy,
    analytics: renderAnalytics,
  }[page] || renderDashboard;

  return (
    <div style={{position:'relative', minHeight:'100vh', background:C.bg, fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", color:C.text, fontSize:14}}>

      {/* MODALS — JSX inline (no subcomponentes) para evitar re-mount y pérdida de foco */}
      {modal === 'pet' && (
        <Modal title={editTarget ? 'Editar paciente' : 'Nuevo paciente'} onSave={savePet} onClose={closeModal} C={C} S={S}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            <div><label style={S.label}>Nombre *</label><input style={S.input} value={form.name||''} onChange={fv('name')} placeholder="Max" autoComplete="off" /></div>
            <div><label style={S.label}>Especie</label>
              <select style={S.input} value={form.species||''} onChange={fv('species')}>
                <option value="">Seleccionar...</option>
                <option>Perro</option><option>Gato</option><option>Conejo</option><option>Ave</option><option>Otro</option>
              </select>
            </div>
            <div><label style={S.label}>Raza</label><input style={S.input} value={form.breed||''} onChange={fv('breed')} placeholder="Golden Retriever" autoComplete="off" /></div>
            <div><label style={S.label}>Edad (años)</label><input style={S.input} type="number" min="0" value={form.age||''} onChange={fv('age')} placeholder="3" /></div>
            <div><label style={S.label}>Peso</label><input style={S.input} value={form.weight||''} onChange={fv('weight')} placeholder="28kg" autoComplete="off" /></div>
            <div><label style={S.label}>Microchip</label><input style={S.input} value={form.microchip||''} onChange={fv('microchip')} placeholder="982000..." autoComplete="off" /></div>
            <div><label style={S.label}>Dueño *</label><input style={S.input} value={form.owner||''} onChange={fv('owner')} placeholder="Nombre completo" autoComplete="off" /></div>
            <div><label style={S.label}>Teléfono</label><input style={S.input} value={form.phone||''} onChange={fv('phone')} placeholder="310-000-0000" autoComplete="off" /></div>
          </div>
        </Modal>
      )}

      {modal === 'appt' && (
        <Modal title="Nueva cita" onSave={saveAppt} onClose={closeModal} C={C} S={S}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Mascota *</label>
              <select style={S.input} value={form.pet||''} onChange={fv('pet')}>
                <option value="">Seleccionar paciente...</option>
                {pets.map(p => <option key={p.id} value={p.name}>{p.name} — {p.owner}</option>)}
              </select>
            </div>
            <div><label style={S.label}>Hora *</label><input style={S.input} type="time" value={form.time||''} onChange={fv('time')} /></div>
            <div><label style={S.label}>Veterinario</label>
              <select style={S.input} value={form.vet||''} onChange={fv('vet')}>
                <option value="">Asignar...</option>
                <option>Dr. Ramírez</option><option>Dra. Torres</option>
              </select>
            </div>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Tipo de servicio *</label>
              <select style={S.input} value={form.type||''} onChange={fv('type')}>
                <option value="">Seleccionar...</option>
                <option>Consulta</option><option>Vacunación</option><option>Cirugía</option>
                <option>Baño y corte</option><option>Desparasitación</option><option>Urgencia</option>
              </select>
            </div>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Notas</label><textarea style={{...S.input, height:70, resize:'none'}} value={form.notes||''} onChange={fv('notes')} placeholder="Observaciones..." /></div>
          </div>
        </Modal>
      )}

      {modal === 'med' && (
        <Modal title={editTarget ? 'Editar medicamento' : 'Nuevo medicamento'} onSave={saveMed} onClose={closeModal} C={C} S={S}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Nombre *</label><input style={S.input} value={form.name||''} onChange={fv('name')} placeholder="Amoxicilina 500mg" autoComplete="off" /></div>
            <div><label style={S.label}>Categoría</label>
              <select style={S.input} value={form.category||''} onChange={fv('category')}>
                <option value="">Seleccionar...</option>
                <option>Antibiótico</option><option>Antiparasitario</option><option>Vitamina</option>
                <option>Antiinflamatorio</option><option>Pulgas</option><option>Otro</option>
              </select>
            </div>
            <div><label style={S.label}>Unidad</label><input style={S.input} value={form.unit||''} onChange={fv('unit')} placeholder="tabletas" autoComplete="off" /></div>
            <div><label style={S.label}>Stock actual *</label><input style={S.input} type="number" min="0" value={form.stock||''} onChange={fv('stock')} /></div>
            <div><label style={S.label}>Stock mínimo</label><input style={S.input} type="number" min="0" value={form.min||''} onChange={fv('min')} placeholder="10" /></div>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Precio (COP)</label><input style={S.input} type="number" min="0" value={form.price||''} onChange={fv('price')} placeholder="2800" /></div>
          </div>
        </Modal>
      )}

      {/* CONFIRM */}
      {confirm && (
        <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,.7)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16}} onClick={() => setConfirm(null)}>
          <div style={{...S.card, maxWidth:380, textAlign:'center'}} onClick={e => e.stopPropagation()}>
            <div style={{fontSize:36, marginBottom:14}}>⚠️</div>
            <div style={{fontSize:15, fontWeight:600, marginBottom:20}}>{confirm.msg}</div>
            <div style={{display:'flex', gap:10, justifyContent:'center'}}>
              <button style={S.btnGhost} onClick={() => setConfirm(null)}>Cancelar</button>
              <button style={{...S.btnPri, background:C.red}} onClick={confirm.onYes}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div role="status" aria-live="polite" style={{position:'fixed', bottom:24, right:24, background: toast.type === 'error' ? C.red : C.accent3, color:'#fff', padding:'12px 20px', borderRadius:10, fontSize:13, fontWeight:600, zIndex:1001, boxShadow:'0 8px 24px rgba(0,0,0,.3)', display:'flex', alignItems:'center', gap:10}}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}

      <div style={{display:'grid', gridTemplateColumns:'230px 1fr'}}>
        {/* SIDEBAR */}
        <div style={{background:C.bg2, borderRight:`1px solid ${C.border}`, minHeight:'100vh', padding:'24px 0', display:'flex', flexDirection:'column', position:'sticky', top:0}}>
          <div style={{padding:'0 20px 24px', borderBottom:`1px solid ${C.border}`, marginBottom:16}}>
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <div style={{width:40, height:40, background:`linear-gradient(135deg,${C.accent},${C.accent2})`, borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22}}>🐾</div>
              <div>
                <div style={{fontWeight:700, fontSize:15}}>VetSystem</div>
                <div style={{fontSize:11, color:C.text2}}>Clínica VetCare · v2.0</div>
              </div>
            </div>
          </div>
          {navItems.map(n => (
            <div key={n.id} onClick={() => setPage(n.id)} role="button" tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPage(n.id); } }}
              style={{display:'flex', alignItems:'center', gap:10, padding:'11px 20px', cursor:'pointer', fontSize:13, background: page === n.id ? `${C.accent}12` : 'transparent', color: page === n.id ? C.accent : C.text2, borderRight: page === n.id ? `3px solid ${C.accent}` : '3px solid transparent', fontWeight: page === n.id ? 600 : 400, transition:'all .15s', marginBottom:2, userSelect:'none'}}>
              <span style={{fontSize:17}}>{n.icon}</span>{n.label}
            </div>
          ))}
          <div style={{marginTop:'auto', padding:'20px', borderTop:`1px solid ${C.border}`}}>
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:12}}>
              <div style={{width:34, height:34, background:`linear-gradient(135deg,${C.accent},${C.accent2})`, borderRadius:50, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:'#fff', fontWeight:700}}>JM</div>
              <div><div style={{fontSize:13, fontWeight:600}}>Dr. Maya</div><div style={{fontSize:11, color:C.text2}}>Veterinario</div></div>
            </div>
            <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} style={{...S.btnGhost, fontSize:12, padding:'7px 14px', width:'100%'}}>
              {theme === 'light' ? '🌙 Modo oscuro' : '☀️ Modo claro'}
            </button>
          </div>
        </div>

        {/* MAIN */}
        <div style={{padding:'20px 32px', overflowY:'auto'}}>
          <div style={{display:'flex', justifyContent:'flex-end', gap:12, marginBottom:18, position:'relative'}}>
            <button onClick={() => setShowNotifs(s => !s)} aria-label="Notificaciones" style={{background:'transparent', border:'none', cursor:'pointer', position:'relative', fontSize:18, color:C.text}}>
              🔔
              {notifs.length > 0 && (
                <span style={{position:'absolute', top:-4, right:-4, background:C.red, color:'#fff', fontSize:10, fontWeight:700, padding:'2px 5px', borderRadius:10, minWidth:16, textAlign:'center'}}>{notifs.length}</span>
              )}
            </button>
            {showNotifs && (
              <div style={{position:'absolute', top:32, right:0, background:C.bg2, border:`1px solid ${C.border}`, borderRadius:12, padding:14, width:300, boxShadow:'0 12px 32px rgba(0,0,0,.2)', zIndex:50}}>
                <div style={{fontSize:13, fontWeight:700, marginBottom:10}}>Notificaciones ({notifs.length})</div>
                {notifs.length === 0
                  ? <div style={{fontSize:12, color:C.text2, textAlign:'center', padding:14}}>Sin notificaciones</div>
                  : notifs.map((n, i) => (
                      <div key={i} style={{display:'flex', gap:10, padding:'8px 0', borderBottom:`1px solid ${C.border}`, fontSize:12}}>
                        <span>{n.type === 'error' ? '🔴' : '🟠'}</span>
                        <div style={{flex:1}}>
                          <div>{n.text}</div>
                          <div style={{color:C.text2, fontSize:10, marginTop:2}}>{n.time}</div>
                        </div>
                      </div>
                    ))}
              </div>
            )}
          </div>
          {pageRender()}
        </div>
      </div>
    </div>
  );
}
