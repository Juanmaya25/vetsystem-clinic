import { useState, useMemo, useCallback } from 'react';

import { INIT_PETS, INIT_APPTS, INIT_MEDS, REVENUE_DATA } from './data/seed.js';
import { themes } from './data/themes.js';
import { makeStyles, makeFocusHandlers } from './utils/styles.js';
import { downloadCSV } from './utils/csv.js';
import { nextId } from './utils/ids.js';
import { useToast } from './hooks/useToast.js';

import { Header } from './components/Header.jsx';
import { Modal } from './components/Modal.jsx';
import { ConfirmDialog } from './components/ConfirmDialog.jsx';
import { Toast } from './components/Toast.jsx';
import { PetForm } from './components/PetForm.jsx';
import { ApptForm } from './components/ApptForm.jsx';
import { MedForm } from './components/MedForm.jsx';

import { Dashboard } from './pages/Dashboard.jsx';
import { Patients } from './pages/Patients.jsx';
import { Schedule } from './pages/Schedule.jsx';
import { Pharmacy } from './pages/Pharmacy.jsx';
import { Analytics } from './pages/Analytics.jsx';

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
  const [confirm, setConfirm]           = useState(null);
  const [selectedPet, setSelectedPet]   = useState(null);
  const [showNotifs, setShowNotifs]     = useState(false);

  const [toast, showToast] = useToast();

  const C = themes[theme];
  const S = useMemo(() => makeStyles(C), [C]);
  const focusH = useMemo(() => makeFocusHandlers(C), [C]);

  const fv = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
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
    setAppts(aa => [...aa, { ...form, id: nextId(aa), status:'pending', date:'2026-05-04', notes: form.notes || '' }]);
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
    downloadCSV(data, name);
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
  const todayAppts    = useMemo(() => appts.filter(a => a.date === '2026-05-04'), [appts]);
  const totalRevenue  = REVENUE_DATA.reduce((s, r) => s + r.ingresos, 0);

  const notifs = [
    ...criticalPets.map(p => ({ key:`crit-${p.id}`, type:'error',   text:`Paciente crítico: ${p.name}`, time:'hace 30 min' })),
    ...lowMeds.map(m     => ({ key:`low-${m.id}`,  type:'warning', text:`Stock bajo: ${m.name}`,        time:'hace 1 h' })),
  ];

  const pages = {
    dashboard: (
      <Dashboard
        pets={pets} petByName={petByName} todayAppts={todayAppts}
        criticalPets={criticalPets} lowMeds={lowMeds}
        onNewAppt={() => { setPage('schedule'); setModal('appt'); setForm({}); }}
        onComplete={completeAppt} onNavigate={setPage}
        C={C} S={S}
      />
    ),
    patients: (
      <Patients
        pets={pets} filteredPets={filteredPets}
        search={search} onSearch={setSearch} filter={filter} onFilter={setFilter}
        selectedPet={selectedPet} onSelectPet={setSelectedPet}
        onExport={() => exportCSV(filteredPets, 'pacientes')}
        onNew={() => { setModal('pet'); setEditTarget(null); setForm({}); }}
        onEdit={p => { setModal('pet'); setEditTarget(p); setForm({ ...p }); }}
        onDelete={delPet}
        C={C} S={S} focusH={focusH}
      />
    ),
    schedule: (
      <Schedule
        todayAppts={todayAppts} petByName={petByName}
        onNew={() => { setModal('appt'); setForm({}); }}
        onComplete={completeAppt}
        C={C} S={S}
      />
    ),
    pharmacy: (
      <Pharmacy
        meds={meds} lowMeds={lowMeds}
        onExport={() => exportCSV(meds, 'farmacia')}
        onNew={() => { setModal('med'); setEditTarget(null); setForm({}); }}
        onEdit={m => { setModal('med'); setEditTarget(m); setForm({ ...m }); }}
        onDelete={delMed}
        C={C} S={S}
      />
    ),
    analytics: <Analytics pets={pets} totalRevenue={totalRevenue} C={C} S={S} />,
  };

  return (
    <div style={{minHeight:'100vh', background:C.bg, fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif", color:C.text, fontSize:14}}>

      {/* MODALS */}
      {modal === 'pet' && (
        <Modal title={editTarget ? 'Editar paciente' : 'Nuevo paciente'} onSave={savePet} onClose={closeModal} C={C} S={S}>
          <PetForm form={form} fv={fv} S={S} focusH={focusH} />
        </Modal>
      )}

      {modal === 'appt' && (
        <Modal title="Nueva cita" onSave={saveAppt} onClose={closeModal} C={C} S={S}>
          <ApptForm form={form} fv={fv} pets={pets} S={S} focusH={focusH} />
        </Modal>
      )}

      {modal === 'med' && (
        <Modal title={editTarget ? 'Editar medicamento' : 'Nuevo medicamento'} onSave={saveMed} onClose={closeModal} C={C} S={S}>
          <MedForm form={form} fv={fv} S={S} focusH={focusH} />
        </Modal>
      )}

      <ConfirmDialog confirm={confirm} onCancel={() => setConfirm(null)} C={C} S={S} />
      <Toast toast={toast} C={C} />

      <Header
        page={page} onNavigate={setPage}
        theme={theme} onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        notifs={notifs} showNotifs={showNotifs} onToggleNotifs={() => setShowNotifs(s => !s)}
        C={C} S={S}
      />

      {/* MAIN */}
      <main style={{maxWidth:1400, margin:'0 auto', padding:'28px 32px 60px'}}>
        {pages[page] || pages.dashboard}
      </main>
    </div>
  );
}
