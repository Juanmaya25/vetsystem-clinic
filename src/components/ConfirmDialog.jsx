import { Icon } from './icons.jsx';

export function ConfirmDialog({ confirm, onCancel, C, S }) {
  if (!confirm) return null;
  return (
    <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(28,24,22,.55)', backdropFilter:'blur(4px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16}} onClick={onCancel}>
      <div style={{...S.card, maxWidth:400, textAlign:'center', padding:32}} onClick={e => e.stopPropagation()}>
        <div style={{width:64, height:64, borderRadius:'50%', background:`${C.red}15`, color:C.red, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px'}}>
          {Icon.alert({width:28, height:28})}
        </div>
        <div style={{fontSize:17, fontWeight:700, marginBottom:8, color:C.text}}>{confirm.msg}</div>
        <div style={{fontSize:13, color:C.text2, marginBottom:24}}>Esta acción no se puede deshacer.</div>
        <div style={{display:'flex', gap:10, justifyContent:'center'}}>
          <button style={S.btnGhost} onClick={onCancel}>Cancelar</button>
          <button style={{...S.btnPri, background:C.red}} onClick={confirm.onYes}>Sí, eliminar</button>
        </div>
      </div>
    </div>
  );
}
