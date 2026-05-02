# 🐾 VetSystem

> Sistema integral de gestión para clínicas veterinarias — pacientes, agenda, farmacia y reportes en un solo dashboard.

[![Deploy](https://github.com/Juanmaya25/vetsystem-clinic/actions/workflows/deploy.yml/badge.svg)](https://github.com/Juanmaya25/vetsystem-clinic/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Demo en vivo

**[https://juanmaya25.github.io/vetsystem-clinic](https://juanmaya25.github.io/vetsystem-clinic)**

## 📸 Screenshots

> _Pendiente — sube capturas a `public/screenshots/` y referénciales aquí._

## ✨ Características

- 📊 **Dashboard** con KPIs en tiempo real, alertas críticas y citas del día
- 🐕 **Gestión de pacientes** con historial, microchip, vacunación y estado clínico
- 📅 **Agenda diaria** con timeline, status visual y completar citas en un click
- 💊 **Farmacia** con control de stock, alertas de mínimos y barra de progreso
- 📈 **Reportes** con gráficas de ingresos, citas mensuales y distribución de servicios
- 🔍 **Búsqueda y filtros** por nombre, dueño, raza, estado
- 🌗 **Modo claro/oscuro** con paleta cuidada para cada tema
- 📥 **Exportación CSV** de pacientes, agenda y farmacia
- 🔔 **Notificaciones** automáticas para casos críticos y stock bajo
- 📱 **Responsive** — funciona en desktop, tablet y móvil

## 🛠️ Stack tecnológico

- **React 18** — hooks, `useMemo`, `useCallback`
- **Vite 5** — bundler ultrarrápido con HMR
- **Recharts** — gráficas (Bar, Line, Pie)
- **CSS-in-JS** — estilos inline temáticos, sin dependencias de UI
- **GitHub Actions + GitHub Pages** — CI/CD automático

## 💻 Instalación local

```bash
git clone https://github.com/Juanmaya25/vetsystem-clinic.git
cd vetsystem-clinic
npm install
npm run dev
```

Abre [http://localhost:5173/vetsystem-clinic/](http://localhost:5173/vetsystem-clinic/).

### Build de producción

```bash
npm run build      # genera dist/
npm run preview    # sirve dist/ localmente
```

## 📁 Estructura

```
vetsystem-clinic/
├── .github/workflows/deploy.yml    # CI/CD a GitHub Pages
├── src/
│   ├── App.jsx                     # Componente principal (5 secciones, modales, tema)
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Reset y estilos globales
├── index.html
├── vite.config.js                  # base: '/vetsystem-clinic/'
└── package.json
```

## 👨‍💻 Autor

**Juan José Maya** — devMaya
Full Stack Developer · San Pedro, Antioquia, Colombia

- 🌐 Portafolio: [juanmaya25.github.io](https://juanmaya25.github.io)
- 💼 GitHub: [@Juanmaya25](https://github.com/Juanmaya25)
- 📱 WhatsApp: [+57 301 439 4180](https://wa.me/573014394180)
- ✉️ Email: [juanjosemorales2510@gmail.com](mailto:juanjosemorales2510@gmail.com)

## 📄 Licencia

MIT © Juan José Maya
