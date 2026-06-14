import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Icon } from '../components/icons.jsx';
import { PetAvatar } from '../components/PetAvatar.jsx';
import { fmt } from '../utils/format.js';
import { apptStatus } from '../data/themes.js';
import { REVENUE_DATA } from '../data/seed.js';

export function Dashboard({ pets, petByName, todayAppts, criticalPets, lowMeds, onNewAppt, onComplete, onNavigate, C, S }) {
  return (
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
            <div style={{fontSize:13, color:C.text2, fontWeight:600, letterSpacing:'.4px', marginBottom:6}}>Lunes 4 de Mayo 2026 · Clínica VetCare</div>
            <h1 style={{fontSize:32, fontWeight:800, color:C.text, margin:0, letterSpacing:'-1px', lineHeight:1.15}}>
              Buenos días, <span style={{color:C.accent}}>Dr. Maya</span> 👋
            </h1>
            <div style={{fontSize:15, color:C.text2, marginTop:10, maxWidth:600, lineHeight:1.6}}>
              Tienes <strong style={{color:C.text}}>{todayAppts.length} citas hoy</strong>, {criticalPets.length > 0 ? <><strong style={{color:C.accent2}}>{criticalPets.length} paciente{criticalPets.length>1?'s':''} crítico{criticalPets.length>1?'s':''}</strong> y </> : ''}
              <strong style={{color:C.text}}>{lowMeds.length} medicamento{lowMeds.length!==1?'s':''}</strong> con stock bajo.
            </div>
          </div>
          <button style={{...S.btnPri, background:'#fff', color:C.accent, boxShadow:'0 4px 14px rgba(0,0,0,.06)'}} onClick={onNewAppt}>
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
      <div className="vet-cols-dash" style={{display:'grid', gap:20}}>
        {/* AGENDA HOY */}
        <div style={S.card}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
            <h2 style={{fontSize:18, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.3px'}}>Agenda de hoy</h2>
            <button style={{...S.btnGhost, padding:'8px 14px', fontSize:12}} onClick={() => onNavigate('schedule')}>Ver todas →</button>
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
                    <button onClick={() => onComplete(a.id)} style={{...S.btnIcon, background:`${C.accent}15`, color:C.accent}} aria-label="Completar">
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
}
