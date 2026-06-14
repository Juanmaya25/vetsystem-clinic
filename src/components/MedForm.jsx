export function MedForm({ form, fv, S, focusH }) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16}}>
      <div style={{gridColumn:'1/-1'}}><label style={S.label}>Nombre *</label><input style={S.input} value={form.name||''} onChange={fv('name')} placeholder="Amoxicilina 500mg" autoComplete="off" {...focusH} /></div>
      <div><label style={S.label}>Categoría</label>
        <select style={S.input} value={form.category||''} onChange={fv('category')} {...focusH}>
          <option value="">Seleccionar...</option>
          <option>Antibiótico</option><option>Antiparasitario</option><option>Vitamina</option>
          <option>Antiinflamatorio</option><option>Pulgas</option><option>Otro</option>
        </select>
      </div>
      <div><label style={S.label}>Unidad</label><input style={S.input} value={form.unit||''} onChange={fv('unit')} placeholder="tabletas" autoComplete="off" {...focusH} /></div>
      <div><label style={S.label}>Stock actual *</label><input style={S.input} type="number" min="0" value={form.stock||''} onChange={fv('stock')} {...focusH} /></div>
      <div><label style={S.label}>Stock mínimo</label><input style={S.input} type="number" min="0" value={form.min||''} onChange={fv('min')} placeholder="10" {...focusH} /></div>
      <div style={{gridColumn:'1/-1'}}><label style={S.label}>Precio (COP)</label><input style={S.input} type="number" min="0" value={form.price||''} onChange={fv('price')} placeholder="2800" {...focusH} /></div>
    </div>
  );
}
