export function ApptForm({ form, fv, pets, S, focusH }) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16}}>
      <div style={{gridColumn:'1/-1'}}><label style={S.label}>Mascota *</label>
        <select style={S.input} value={form.pet||''} onChange={fv('pet')} {...focusH}>
          <option value="">Seleccionar paciente...</option>
          {pets.map(p => <option key={p.id} value={p.name}>{p.name} — {p.owner}</option>)}
        </select>
      </div>
      <div><label style={S.label}>Hora *</label><input style={S.input} type="time" value={form.time||''} onChange={fv('time')} {...focusH} /></div>
      <div><label style={S.label}>Veterinario</label>
        <select style={S.input} value={form.vet||''} onChange={fv('vet')} {...focusH}>
          <option value="">Asignar...</option>
          <option>Dr. Ramírez</option><option>Dra. Torres</option>
        </select>
      </div>
      <div style={{gridColumn:'1/-1'}}><label style={S.label}>Tipo de servicio *</label>
        <select style={S.input} value={form.type||''} onChange={fv('type')} {...focusH}>
          <option value="">Seleccionar...</option>
          <option>Consulta</option><option>Vacunación</option><option>Cirugía</option>
          <option>Baño y corte</option><option>Desparasitación</option><option>Urgencia</option>
        </select>
      </div>
      <div style={{gridColumn:'1/-1'}}><label style={S.label}>Notas</label><textarea style={{...S.input, height:80, resize:'none'}} value={form.notes||''} onChange={fv('notes')} placeholder="Observaciones..." {...focusH} /></div>
    </div>
  );
}
