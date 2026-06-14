import { Icon } from './icons.jsx';

export const NAV_ITEMS = [
  { id:'dashboard', label:'Inicio',     icon: Icon.home },
  { id:'patients',  label:'Pacientes',  icon: Icon.pawprint },
  { id:'schedule',  label:'Agenda',     icon: Icon.calendar },
  { id:'pharmacy',  label:'Farmacia',   icon: Icon.pill },
  { id:'analytics', label:'Reportes',   icon: Icon.chart },
];

export function Header({ page, onNavigate, theme, onToggleTheme, notifs, showNotifs, onToggleNotifs, C, S }) {
  return (
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
        {NAV_ITEMS.map(n => {
          const active = page === n.id;
          return (
            <button
              key={n.id}
              onClick={() => onNavigate(n.id)}
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
        <button onClick={onToggleNotifs} aria-label="Notificaciones" style={{...S.btnIcon, position:'relative', width:40, height:40}}>
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
        <button onClick={onToggleTheme} aria-label="Tema" style={{...S.btnIcon, width:40, height:40}}>
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
  );
}
