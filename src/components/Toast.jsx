import { Icon } from './icons.jsx';

export function Toast({ toast, C }) {
  if (!toast) return null;
  return (
    <div role="status" aria-live="polite" style={{position:'fixed', bottom:24, right:24, background: toast.type === 'error' ? C.red : C.accent, color:'#fff', padding:'14px 22px', borderRadius:14, fontSize:14, fontWeight:600, zIndex:1001, boxShadow:'0 12px 40px rgba(0,0,0,.2)', display:'flex', alignItems:'center', gap:10, maxWidth:'calc(100vw - 48px)'}}>
      {toast.type === 'error' ? Icon.alert() : Icon.check()}
      {toast.msg}
    </div>
  );
}
