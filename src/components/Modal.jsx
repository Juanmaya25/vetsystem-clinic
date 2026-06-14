import { Icon } from './icons.jsx';

export function Modal({ title, onSave, onClose, children, size='md', C, S }) {
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
