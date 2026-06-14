import { Icon } from '../components/icons.jsx';
import { PetAvatar } from '../components/PetAvatar.jsx';
import { apptStatus } from '../data/themes.js';

export function Schedule({ todayAppts, petByName, onNew, onComplete, C, S }) {
  return (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:30, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Agenda del día</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:6}}>Lunes 4 de Mayo 2026 · {todayAppts.length} citas programadas</div>
        </div>
        <button style={S.btnPri} onClick={onNew}>
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
                <button style={{...S.btnGhost, background:`${C.accent}10`, color:C.accent, border:`1px solid ${C.accent}30`}} onClick={() => onComplete(a.id)}>
                  <Icon.check /> Completar
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
