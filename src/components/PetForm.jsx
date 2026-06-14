export function PetForm({ form, fv, S, focusH }) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16}}>
      <div><label style={S.label}>Nombre *</label><input style={S.input} value={form.name||''} onChange={fv('name')} placeholder="Max" autoComplete="off" {...focusH} /></div>
      <div><label style={S.label}>Especie</label>
        <select style={S.input} value={form.species||''} onChange={fv('species')} {...focusH}>
          <option value="">Seleccionar...</option>
          <option>Perro</option><option>Gato</option><option>Conejo</option><option>Ave</option><option>Otro</option>
        </select>
      </div>
      <div><label style={S.label}>Raza</label><input style={S.input} value={form.breed||''} onChange={fv('breed')} placeholder="Golden Retriever" autoComplete="off" {...focusH} /></div>
      <div><label style={S.label}>Edad (años)</label><input style={S.input} type="number" min="0" value={form.age||''} onChange={fv('age')} placeholder="3" {...focusH} /></div>
      <div><label style={S.label}>Peso</label><input style={S.input} value={form.weight||''} onChange={fv('weight')} placeholder="28kg" autoComplete="off" {...focusH} /></div>
      <div><label style={S.label}>Microchip</label><input style={S.input} value={form.microchip||''} onChange={fv('microchip')} placeholder="982000..." autoComplete="off" {...focusH} /></div>
      <div><label style={S.label}>Dueño *</label><input style={S.input} value={form.owner||''} onChange={fv('owner')} placeholder="Nombre completo" autoComplete="off" {...focusH} /></div>
      <div><label style={S.label}>Teléfono</label><input style={S.input} value={form.phone||''} onChange={fv('phone')} placeholder="310-000-0000" autoComplete="off" {...focusH} /></div>
    </div>
  );
}
