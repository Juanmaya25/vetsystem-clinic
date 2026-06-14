export const makeStyles = C => ({
  card:     { background:C.bg2, border:`1px solid ${C.border}`, borderRadius:20, padding:24, boxShadow:C.shadow },
  cardSoft: { background:C.bg3, borderRadius:20, padding:20 },
  input:    { background:C.bg2, border:`1px solid ${C.border}`, borderRadius:12, padding:'11px 16px', fontSize:14, color:C.text, outline:'none', fontFamily:'inherit', width:'100%', boxSizing:'border-box', transition:'border-color .2s, box-shadow .2s' },
  label:    { fontSize:11, color:C.text2, fontWeight:600, display:'block', marginBottom:8, letterSpacing:'.3px', textTransform:'uppercase' },
  btnPri:   { background:C.accent, color:'#fff', border:'none', borderRadius:14, padding:'12px 22px', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:8, transition:'transform .15s, box-shadow .2s' },
  btnGhost: { background:'transparent', color:C.text2, border:`1px solid ${C.border}`, borderRadius:14, padding:'12px 18px', fontSize:14, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:6 },
  btnIcon:  { background:C.bg3, color:C.text2, border:'none', borderRadius:10, width:34, height:34, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', justifyContent:'center', transition:'background .15s, color .15s' },
});

export const makeFocusHandlers = C => ({
  onFocus: e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accent}25`; },
  onBlur:  e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; },
});
