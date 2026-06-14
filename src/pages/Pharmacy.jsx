import { Icon } from '../components/icons.jsx';
import { fmt } from '../utils/format.js';

export function Pharmacy({ meds, lowMeds, onExport, onNew, onEdit, onDelete, C, S }) {
  return (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:30, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Farmacia</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:6}}>{meds.length} medicamentos · {lowMeds.length} con stock bajo</div>
        </div>
        <div style={{display:'flex', gap:10}}>
          <button style={S.btnGhost} onClick={onExport}>
            <Icon.download /> Exportar
          </button>
          <button style={S.btnPri} onClick={onNew}>
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
                        <button style={{...S.btnIcon, background:`${C.accent}15`, color:C.accent}} onClick={() => onEdit(m)} aria-label="Editar"><Icon.pencil /></button>
                        <button style={{...S.btnIcon, background:`${C.red}15`, color:C.red}} onClick={() => onDelete(m.id)} aria-label="Eliminar"><Icon.trash /></button>
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
}
