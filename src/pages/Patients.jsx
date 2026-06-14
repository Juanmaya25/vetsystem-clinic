import { Icon } from '../components/icons.jsx';
import { PetAvatar } from '../components/PetAvatar.jsx';
import { statusInfo } from '../data/themes.js';

export function Patients({ pets, filteredPets, search, onSearch, filter, onFilter, selectedPet, onSelectPet, onExport, onNew, onEdit, onDelete, C, S, focusH }) {
  return (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:30, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Pacientes</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:6}}>{filteredPets.length} de {pets.length} mascotas registradas</div>
        </div>
        <div style={{display:'flex', gap:10}}>
          <button style={S.btnGhost} onClick={onExport}>
            <Icon.download /> Exportar
          </button>
          <button style={S.btnPri} onClick={onNew}>
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
            onChange={e => onSearch(e.target.value)}
            {...focusH}
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
              onClick={() => onFilter(f.v)}
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
            onClick={() => onSelectPet(selectedPet?.id === p.id ? null : p)}
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
                  <button style={{...S.btnGhost, flex:1, justifyContent:'center', background:`${C.accent}10`, color:C.accent, border:`1px solid ${C.accent}30`}} onClick={() => onEdit(p)}>
                    <Icon.pencil /> Editar
                  </button>
                  <button style={{...S.btnGhost, flex:1, justifyContent:'center', background:`${C.red}10`, color:C.red, border:`1px solid ${C.red}30`}} onClick={() => onDelete(p.id)}>
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
}
