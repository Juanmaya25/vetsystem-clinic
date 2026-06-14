import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { fmt } from '../utils/format.js';
import { REVENUE_DATA, SERVICE_DIST } from '../data/seed.js';

export function Analytics({ pets, totalRevenue, C, S }) {
  const totalAppts = REVENUE_DATA.reduce((s, r) => s + r.citas, 0);
  return (
    <div className="fade-in">
      <div style={{marginBottom:8}}>
        <h1 style={{fontSize:30, fontWeight:800, margin:0, color:C.text, letterSpacing:'-.8px'}}>Reportes</h1>
        <div style={{fontSize:14, color:C.text2, marginTop:6}}>Análisis de la clínica · últimos 6 meses</div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14, margin:'24px 0'}}>
        {[
          { l:'Ingresos totales',  v:fmt(totalRevenue),                                  c:C.accent,  bg:C.bgMint  },
          { l:'Citas totales',     v:totalAppts.toLocaleString('es-CO'),                 c:C.accent3, bg:C.bgWarm  },
          { l:'Promedio mensual',  v:fmt(Math.round(totalRevenue / 6)),                  c:C.accent2, bg:'rgba(251,113,133,.1)' },
          { l:'Pacientes activos', v:pets.length,                                        c:C.text,    bg:C.bg3 },
        ].map(k => (
          <div key={k.l} style={{...S.card, background:k.bg, border:'none'}}>
            <div style={{fontSize:11, color:C.text2, fontWeight:600, letterSpacing:'.3px', textTransform:'uppercase', marginBottom:8}}>{k.l}</div>
            <div style={{fontSize:24, fontWeight:800, color:k.c, fontFamily:'monospace', letterSpacing:'-.5px'}}>{k.v}</div>
          </div>
        ))}
      </div>

      <div className="vet-cols-analytics" style={{display:'grid', gap:20, marginBottom:20}}>
        <div style={S.card}>
          <h2 style={{fontSize:16, fontWeight:700, margin:'0 0 18px 0', color:C.text, letterSpacing:'-.3px'}}>Tendencia de ingresos</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" tick={{fontSize:12, fill:C.text2}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000000).toFixed(0)}M`} />
              <Tooltip contentStyle={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:12, fontSize:12, boxShadow:C.shadow}} formatter={v => [fmt(v), 'Ingresos']} />
              <Line type="monotone" dataKey="ingresos" stroke={C.accent} strokeWidth={3} dot={{fill:C.accent, r:6, strokeWidth:0}} activeDot={{r:8}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={S.card}>
          <h2 style={{fontSize:16, fontWeight:700, margin:'0 0 18px 0', color:C.text, letterSpacing:'-.3px'}}>Servicios prestados</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={SERVICE_DIST} cx="50%" cy="50%" innerRadius={55} outerRadius={88} paddingAngle={4} dataKey="value">
                {SERVICE_DIST.map(e => <Cell key={e.name} fill={e.color} stroke={C.bg2} strokeWidth={2} />)}
              </Pie>
              <Tooltip contentStyle={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:12, fontSize:12, boxShadow:C.shadow}} />
              <Legend wrapperStyle={{fontSize:11}} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={S.card}>
        <h2 style={{fontSize:16, fontWeight:700, margin:'0 0 18px 0', color:C.text, letterSpacing:'-.3px'}}>Citas por mes</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={REVENUE_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
            <XAxis dataKey="mes" tick={{fontSize:12, fill:C.text2}} axisLine={false} tickLine={false} />
            <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:12, fontSize:12, boxShadow:C.shadow}} />
            <Bar dataKey="citas" fill={C.accent2} radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
