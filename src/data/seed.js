// ─── DATA SEED ──────────────────────────────────────────────────────
export const INIT_PETS = [
  { id:1, name:'Max',    species:'Perro',  breed:'Golden Retriever', age:3, owner:'Carlos Ruiz',   phone:'310-111-2222', status:'healthy',   lastVisit:'2026-04-20', nextVisit:'2026-07-20', weight:'28kg', vaccinated:true,  microchip:'982000123456789' },
  { id:2, name:'Luna',   species:'Gato',   breed:'Siamés',           age:5, owner:'María López',   phone:'310-333-4444', status:'treatment', lastVisit:'2026-04-28', nextVisit:'2026-05-05', weight:'4kg',  vaccinated:true,  microchip:'982000234567890' },
  { id:3, name:'Rocky',  species:'Perro',  breed:'Bulldog',          age:2, owner:'Juan García',   phone:'310-555-6666', status:'healthy',   lastVisit:'2026-03-15', nextVisit:'2026-06-15', weight:'22kg', vaccinated:true,  microchip:'982000345678901' },
  { id:4, name:'Pelusa', species:'Conejo', breed:'Angora',           age:1, owner:'Ana Martínez',  phone:'310-777-8888', status:'checkup',   lastVisit:'2026-04-10', nextVisit:'2026-05-10', weight:'2kg',  vaccinated:false, microchip:'982000456789012' },
  { id:5, name:'Toby',   species:'Perro',  breed:'Poodle',           age:7, owner:'Pedro Vargas',  phone:'310-999-0000', status:'critical',  lastVisit:'2026-04-30', nextVisit:'2026-05-02', weight:'6kg',  vaccinated:true,  microchip:'982000567890123' },
  { id:6, name:'Mochi',  species:'Gato',   breed:'Persa',            age:4, owner:'Sofía Castro',  phone:'310-121-3434', status:'healthy',   lastVisit:'2026-04-25', nextVisit:'2026-07-25', weight:'5kg',  vaccinated:true,  microchip:'982000678901234' },
];

export const INIT_APPTS = [
  { id:1, time:'08:00', pet:'Max',    owner:'Carlos Ruiz',  type:'Vacunación',     vet:'Dr. Ramírez', status:'done',    notes:'Refuerzo anual completado',   date:'2026-05-04' },
  { id:2, time:'09:30', pet:'Luna',   owner:'María López',  type:'Control',        vet:'Dra. Torres', status:'done',    notes:'Tratamiento avanzando bien',  date:'2026-05-04' },
  { id:3, time:'11:00', pet:'Rocky',  owner:'Juan García',  type:'Baño y corte',   vet:'Dr. Ramírez', status:'next',    notes:'',                            date:'2026-05-04' },
  { id:4, time:'12:30', pet:'Pelusa', owner:'Ana Martínez', type:'Consulta',       vet:'Dra. Torres', status:'pending', notes:'Primera consulta',            date:'2026-05-04' },
  { id:5, time:'14:00', pet:'Toby',   owner:'Pedro Vargas', type:'Urgencia',       vet:'Dr. Ramírez', status:'pending', notes:'Caso critico',                date:'2026-05-04' },
  { id:6, time:'15:30', pet:'Mochi',  owner:'Sofía Castro', type:'Desparasitación',vet:'Dra. Torres', status:'pending', notes:'',                            date:'2026-05-04' },
];

export const INIT_MEDS = [
  { id:1, name:'Amoxicilina 500mg',  stock:45, min:20, unit:'tabletas', price:2800,  category:'Antibiótico' },
  { id:2, name:'Ivermectina 1%',     stock:12, min:15, unit:'ml',       price:4500,  category:'Antiparasitario' },
  { id:3, name:'Frontline Spray',    stock:8,  min:10, unit:'frascos',  price:28000, category:'Pulgas' },
  { id:4, name:'Metronidazol 250mg', stock:60, min:20, unit:'tabletas', price:1200,  category:'Antibiótico' },
  { id:5, name:'Vitamina B12',       stock:3,  min:10, unit:'ampollas', price:5500,  category:'Vitamina' },
  { id:6, name:'Antiinflamatorio',   stock:32, min:15, unit:'tabletas', price:3200,  category:'Antiinflamatorio' },
];

export const REVENUE_DATA = [
  { mes:'Nov', ingresos:8200000,  citas:42 },
  { mes:'Dic', ingresos:9800000,  citas:51 },
  { mes:'Ene', ingresos:7600000,  citas:38 },
  { mes:'Feb', ingresos:8900000,  citas:45 },
  { mes:'Mar', ingresos:10200000, citas:55 },
  { mes:'Abr', ingresos:11500000, citas:62 },
];

export const SERVICE_DIST = [
  { name:'Consulta',      value:35, color:'#10b981' },
  { name:'Vacunación',    value:22, color:'#34d399' },
  { name:'Cirugía',       value:15, color:'#fb7185' },
  { name:'Baño/Estética', value:18, color:'#fbbf24' },
  { name:'Urgencias',     value:10, color:'#f87171' },
];
