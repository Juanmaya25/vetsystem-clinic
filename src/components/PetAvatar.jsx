import { speciesGradient, speciesEmoji } from '../data/themes.js';

// Avatar circular grande con gradiente y emoji por especie
export function PetAvatar({ species, name, size=56 }) {
  const initial = name?.[0] || '?';
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%',
      background: speciesGradient[species] || speciesGradient.Otro,
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'#fff', fontWeight:700, fontSize: size * 0.42,
      flexShrink:0, position:'relative',
      boxShadow:'0 4px 12px rgba(0,0,0,.08)',
    }}>
      <span style={{fontSize: size * 0.5, lineHeight:1}}>{speciesEmoji(species)}</span>
      <span style={{position:'absolute', bottom:-2, right:-2, background:'#fff', borderRadius:'50%', width:size*0.36, height:size*0.36, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.18, fontWeight:700, color:'#374151', boxShadow:'0 2px 6px rgba(0,0,0,.1)'}}>
        {initial}
      </span>
    </div>
  );
}
