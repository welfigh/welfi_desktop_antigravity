# Especificación de Requerimientos

**Aplicación Web Welfi**

| Versión: | 1.0 |
| :---- | :---- |
| **Fecha:** | 12/02/2026 |
| **Estado:** | Borrador para Desarrollo |
| **Autor:** | Equipo Producto Welfi |

# **Tabla de Contenidos**

\[La tabla de contenidos se generará automáticamente al abrir el documento en Word\]

# **1\. Resumen Ejecutivo**

## **1.1 Objetivo del Proyecto**

Desarrollar una aplicación web de Welfi con PARIDAD COMPLETA de funcionalidades respecto a la aplicación móvil existente. La web debe ofrecer todas las capacidades que mobile ofrece, más herramientas adicionales que aprovechen las ventajas del formato desktop (mayor espacio, multi-ventana, exportación de datos, análisis más profundos).

La web no es un "MVP reducido" sino una plataforma completa que sirve como "power product" para usuarios que necesitan gestión más sofisticada de sus inversiones, mientras mobile se mantiene optimizado para uso cotidiano y en movimiento.

## **1.2 Alcance**

**Principio rector:** La versión web debe tener PARIDAD COMPLETA con la aplicación mobile como mínimo. Todas las funcionalidades disponibles en mobile deben estar disponibles en web.

* Funcionalidades Core (paridad con mobile):

* Autenticación completa (login, 2FA, recuperación de contraseña)  
* Dashboard de patrimonio con vista multi-moneda (ARS/USD/Consolidado)  
* Welfi Pesos \- producto de corto plazo completo  
* Welfi Dólares/Dolarity \- producto de largo plazo completo  
* Objetivos Financieros \- creación, edición, seguimiento, automatización  
* Estrategias Recomendadas \- visualización, suscripción, bonificaciones  
* Packs Temáticos \- exploración, inversión, seguimiento  
* Visualización completa de tenencias (todas las posiciones)  
* Historial completo de movimientos con filtros  
* Gestión de órdenes \- creación, seguimiento, cancelación  
* Compra/venta de dólares (FX)  
* Sección de noticias y contenido educativo  
* Gestión de perfil y configuración de cuenta  
* Notificaciones y alertas

* Features Adicionales (exclusivas de web o mejoradas):

* Reportes exportables profesionales (PDF, Excel)  
* Simuladores avanzados de inversión  
* Filtros y búsqueda más potentes  
* Visualización multi-pantalla y densidad de información mayor  
* Herramientas de análisis y comparación más sofisticadas  
* Gestión batch de órdenes  
* Exportación masiva de datos históricos

## **1.3 Restricciones Clave**

* Paridad funcional obligatoria: La web DEBE tener todas las funcionalidades de mobile  
* Equipo pequeño: priorizar reuso del backend existente al máximo  
* Presupuesto limitado: desarrollo ágil pero completo, no reducido  
* Stack definido: React (frontend), Python/Go (backend), GCP (infraestructura)  
* Regulación AAGI/CNV: trazabilidad, logs y auditoría obligatorios  
* Timeline: 18-20 semanas para paridad completa \+ features exclusivas web

# **2\. Contexto del Negocio**

## **2.1 ¿Qué es Welfi?**

Welfi es una fintech argentina que ayuda a las personas a ahorrar e invertir de forma simple y guiada, con foco en objetivos financieros (no trading). La promesa de valor es: *"Contanos qué querés lograr, y nosotros te armamos la estrategia/portfolio ideal y te acompañamos en el proceso."*

* Regulación: AAGI (CNV)  
* Conectividad a mercado: API BROKER  
* Mercado objetivo: Argentina (contexto bimonetario ARS/USD)

## **2.2 Visión y Misión**

* Visión:

* Que cada persona pueda construir su futuro financiero en Latinoamérica con tecnología, sin depender de tener tiempo, conocimientos avanzados o un asesor caro.

* Misión:

* Automatizar las finanzas personales para que ahorrar e invertir sea algo natural (como usar una app), y no una carga mental.

* Tagline:

* *"Build your future" / "Construí tu futuro"*

## **2.3 Público Objetivo**

* Personas en Argentina que quieren ordenar su dinero y mejorar su estrategia de inversión  
* Perfil típico: trabajadores formales, 25-45 años, con capacidad de ahorro  
* Poco tiempo para investigar inversiones por cuenta propia  
* Operan en contexto bimonetario (ARS \+ USD)  
* Segmentos: Retail (mayoría) y Premium/Welfi Black (usuarios con montos altos \+ asesor)

## **2.4 Modelo de Negocio**

* Fuentes de ingreso:

* Fee de administración sobre AUM (Assets Under Management) invertido  
* Fees por transacciones (packs temáticos, operatoria especial)  
* Spread FX en compra-venta de dólares  
* Futuro: suscripciones, lending, tarjetas/spending

**Nota:** El fee principal se genera cuando el dinero está efectivamente invertido en productos/estrategias, no sobre saldo en efectivo.

# **3\. Mapa de Productos**

## **3.1 Welfi Pesos**

Producto de corto plazo tipo "cash management". Busca que el dinero en pesos rinda mejor que alternativas comunes (billeteras/plazo fijo) con liquidez inmediata. Primer producto para usuarios que recién empiezan.

* Características principales:

* Inversión automática en instrumentos de corto plazo  
* Liquidez diaria  
* Rendimiento superior a cuentas tradicionales  
* Onboarding simplificado

## **3.2 Welfi Dólares / Dolarity**

Producto orientado al largo plazo en USD o con exposición dolarizada. Estrategia de cartera para construir patrimonio en el tiempo.

* Características principales:

* Exposición en USD o MEP  
* Estrategias de largo plazo  
* Diversificación automática  
* Protección contra inflación

## **3.3 Objetivos Financieros (Goals)**

Motor central: el usuario define objetivos personales (viaje, casa, retiro, etc.) con plazo y perfil de riesgo, y Welfi recomienda una estrategia/portfolio óptima.

* Características principales:

* Configuración de objetivo (monto, plazo, propósito)  
* Sugerencia automática de aporte mensual  
* Seguimiento de progreso con visualizaciones  
* Automatización de inversión según estrategia  
* Alertas y recomendaciones personalizadas

## **3.4 Estrategias Recomendadas**

Plantillas predefinidas para necesidades comunes que los usuarios pueden adoptar sin configurar un objetivo desde cero.

* Características principales:

* Fondo de Emergencia  
* Fondo de Retiro  
* Otras estrategias según catálogo  
* Bonificaciones y promos activas  
* Sistema de elegibilidad (flags por usuario)  
* Tracking de beneficios en UI y backend

## **3.5 Packs Temáticos**

Carteras temáticas que permiten invertir en tendencias de largo plazo con UX simple. El usuario invierte en la "idea" completa, no en tickers individuales.

* Características principales:

* Tecnología, sustentabilidad, mercados emergentes, etc.  
* Rebalanceo automático  
* Entrada/salida simplificada  
* Transparencia en composición

## **3.6 Compra/Venta de Dólares**

Feature de compra-venta de USD (MEP u otros mecanismos) con trazabilidad completa, fundamental para el contexto argentino.

* Características principales:

* Cotizaciones en tiempo real  
* Proceso paso a paso con confirmaciones  
* Historial de operaciones FX  
* Integración con saldo ARS/USD

## **3.7 Sección de Noticias**

Curación de contenido educativo y de mercado dentro de la app para informar y aumentar engagement.

* Características principales:

* Noticias de mercado relevantes para Argentina  
* Contenido educativo sobre finanzas personales  
* Actualizaciones de productos Welfi  
* Push notifications para eventos importantes

# **4\. Requerimientos Técnicos**

## **4.1 Arquitectura General**

### **Stack Tecnológico**

**Frontend Web:** React (nueva aplicación web)

**Frontend Mobile:** React (existente, referencia)

**Backend:** Python \+ Go (existente)

**Infraestructura:** Google Cloud Platform (GCP)

**Conectividad Mercado:** API BROKER

**Base de Datos:** PostgreSQL / Cloud SQL (a confirmar)

**Autenticación:** JWT \+ OAuth (a confirmar)

### **Principios de Arquitectura**

* API-First: La web consume el mismo backend que mobile, priorizando el reuso  
* Microservicios cuando aplique: separación lógica de responsabilidades  
* Stateless: sesiones manejadas vía tokens, no en servidor  
* Real-time donde sea necesario: WebSockets o polling para cotizaciones y estados de órdenes  
* Responsive: la web debe funcionar bien en tablets (1024px+) aunque no sea mobile-first

## **4.2 Requerimientos de Backend**

* Endpoints Críticos (reuso o mejora):

* Autenticación: /auth/login, /auth/refresh, /auth/logout  
* Usuario: /user/profile, /user/settings, /user/kyc-status  
* Patrimonio: /portfolio/summary, /portfolio/holdings, /portfolio/performance  
* Movimientos: /transactions/history, /transactions/{id}  
* Órdenes: /orders/create, /orders/status, /orders/cancel  
* Objetivos: /goals, /goals/{id}, /goals/{id}/progress  
* Estrategias: /strategies, /strategies/{id}  
* Packs: /packs, /packs/{id}  
* FX: /fx/quote, /fx/execute  
* Mercado: /market/quotes, /market/hours

* Requerimientos de Datos:

* Toda entidad financiera debe tener currency nativa (ARS/USD)  
* Timestamps en UTC con zona horaria de Argentina para display  
* Tipo de cambio usado debe ser trazable (fuente \+ timestamp)  
* Snapshots históricos de patrimonio para gráficos consistentes  
* Manejo de horarios de mercado (trading hours, feriados argentinos)  
* Idempotencia en creación de órdenes (mismo request\_id no duplica)  
* Estados de órdenes: pending, processing, executed, failed, cancelled

## **4.3 Requerimientos de Frontend Web**

* Tecnologías y Librerías:

* React 18+ con TypeScript  
* State Management: Redux Toolkit o Zustand  
* Routing: React Router v6  
* UI Components: Material-UI o Ant Design (a definir)  
* Charts: Recharts o Chart.js para gráficos de patrimonio  
* Forms: React Hook Form \+ Yup para validación  
* API Client: Axios con interceptores para auth  
* Real-time: Socket.io o similar para actualizaciones live

* Estructura de Proyecto:

* /components \- Componentes reutilizables  
* /pages \- Páginas/vistas principales  
* /layouts \- Layouts (DashboardLayout, AuthLayout)  
* /hooks \- Custom hooks  
* /services \- Llamadas a API  
* /store \- Estado global  
* /utils \- Utilidades y helpers  
* /constants \- Constantes (currencies, reglas de negocio)  
* /types \- TypeScript types e interfaces

## **4.4 Contexto Bimonetario (ARS/USD)**

Argentina opera en un contexto bimonetario que impacta fuertemente en UX y arquitectura de datos. Los usuarios necesitan:

* Ver balances por moneda individual (ARS, USD)  
* Ver consolidado comparable (típicamente en USD MEP)  
* Entender qué tipo de cambio se usó y cuándo  
* Comparar performance histórica con tipo de cambio consistente  
* Filtrar movimientos por moneda

### **Implementación Técnica:**

| Aspecto | Implementación |
| :---- | :---- |
| **Modelo de Datos** | Todo monto tiene currency\_code (ARS/USD) |
| **Dashboard Toggle** | Selector visible: ARS | USD | Consolidado (USD MEP) |
| **Tipo de Cambio** | Mostrar fuente y timestamp: "USD MEP: $1.250 (12/02/2026 14:30)" |
| **Snapshots Históricos** | Guardar valuaciones diarias para gráficos consistentes |
| **Conversión en Tiempo Real** | API endpoint: /fx/rates con caché de 1-5 minutos |

# **5\. Requerimientos Funcionales por Módulo**

## **5.1 Autenticación y Sesión**

* RF-AUTH-001: Login

* El sistema debe permitir login con email \+ contraseña, validando credenciales contra el backend.

* RF-AUTH-002: Autenticación de Dos Factores (2FA)

* Si el usuario tiene 2FA habilitado, debe solicitar código OTP después de credenciales correctas.

* RF-AUTH-003: Gestión de Tokens

* El sistema debe almacenar access\_token y refresh\_token de forma segura (httpOnly cookies o localStorage cifrado).

* RF-AUTH-004: Refresh Automático

* Cuando el access\_token expire, el sistema debe renovarlo automáticamente usando refresh\_token sin interrumpir la sesión.

* RF-AUTH-005: Logout

* El usuario debe poder cerrar sesión, invalidando tokens en cliente y servidor.

* RF-AUTH-006: Recuperación de Contraseña

* El sistema debe permitir recuperar contraseña vía email con token temporal.

## **5.2 Dashboard de Patrimonio**

* RF-DASH-001: Vista Consolidada

* El dashboard debe mostrar patrimonio total con toggle entre ARS, USD y Consolidado (USD MEP).

* RF-DASH-002: Desglose por Producto

* Mostrar distribución del patrimonio por producto: Welfi Pesos, Welfi Dólares, Objetivos, Packs, Efectivo.

* RF-DASH-003: Gráfico de Evolución

* Gráfico de líneas mostrando evolución del patrimonio en el tiempo con opciones de período (1M, 3M, 6M, 1Y, Todo).

* RF-DASH-004: Performance

* Mostrar rendimiento (%) y ganancia/pérdida ($) para el período seleccionado.

* RF-DASH-005: Tipo de Cambio Visible

* Cuando se muestre vista consolidada en USD, indicar claramente: "USD MEP: $1.250 (actualizado: 12/02/2026 14:30)".

* RF-DASH-006: Acciones Rápidas

* Botones de acción rápida: Invertir, Retirar, Comprar USD, Ver Movimientos.

## **5.3 Tenencias (Holdings)**

* RF-HOLD-001: Lista de Posiciones

* Mostrar lista de todas las posiciones activas con: nombre del activo, cantidad, precio promedio, valor actual, ganancia/pérdida.

* RF-HOLD-002: Filtro por Producto

* Permitir filtrar tenencias por tipo: Welfi Pesos, Welfi Dólares, Objetivos, Packs.

* RF-HOLD-003: Filtro por Moneda

* Permitir filtrar por moneda: ARS, USD, Todas.

* RF-HOLD-004: Ordenamiento

* Permitir ordenar por: Valor (desc/asc), Performance (desc/asc), Nombre (A-Z).

* RF-HOLD-005: Detalle de Posición

* Al hacer click en una posición, mostrar detalle completo: historial de compras, gráfico de performance, acciones disponibles.

## **5.4 Movimientos y Actividad**

* RF-MOV-001: Historial de Transacciones

* Mostrar lista paginada de todas las transacciones con: fecha, tipo (compra/venta/depósito/retiro), monto, currency, estado.

* RF-MOV-002: Filtros Avanzados

* Filtrar por: período (custom date range), tipo de movimiento, moneda, producto, estado.

* RF-MOV-003: Búsqueda

* Buscador de texto libre para encontrar movimientos por concepto o ID de transacción.

* RF-MOV-004: Exportación

* Permitir exportar movimientos filtrados a CSV o Excel para análisis externo.

* RF-MOV-005: Detalle de Movimiento

* Vista detallada con toda la información de la transacción: comprobantes, estados intermedios, timestamps.

## **5.5 Gestión de Órdenes**

* RF-ORD-001: Creación de Orden

* Formulario para crear órdenes de compra/venta con validaciones de monto mínimo, saldo disponible, horario de mercado.

* RF-ORD-002: Estados en Tiempo Real

* Mostrar estado actual de cada orden: Pendiente, En Proceso, Ejecutada, Fallida, Cancelada.

* RF-ORD-003: Actualización Asíncrona

* Las órdenes deben actualizarse automáticamente sin refresh manual (polling o WebSocket).

* RF-ORD-004: Cancelación

* Permitir cancelar órdenes que aún no se ejecutaron, con confirmación del usuario.

* RF-ORD-005: Historial de Órdenes

* Vista histórica de todas las órdenes con filtros por estado, fecha, producto.

## **5.6 Objetivos Financieros**

* RF-GOAL-001: Crear Objetivo

* Wizard para crear objetivo: definir propósito, monto meta, plazo, perfil de riesgo (conservador/moderado/agresivo).

* RF-GOAL-002: Recomendación de Estrategia

* El sistema debe recomendar una estrategia de inversión óptima basada en los parámetros del objetivo.

* RF-GOAL-003: Sugerencia de Aporte

* Calcular y mostrar aporte mensual sugerido para alcanzar la meta en el plazo definido.

* RF-GOAL-004: Seguimiento de Progreso

* Dashboard del objetivo mostrando: progreso (%), monto acumulado vs meta, proyección de cumplimiento.

* RF-GOAL-005: Automatización de Inversión

* Opción de configurar aportes automáticos mensuales que se invierten según la estrategia del objetivo.

* RF-GOAL-006: Edición y Pausado

* Permitir editar parámetros del objetivo (monto, plazo) o pausar aportes automáticos temporalmente.

# **6\. Requerimientos No Funcionales**

## **6.1 Performance**

**RNF-PERF-001:** Tiempo de carga inicial \< 3 segundos en conexión promedio

**RNF-PERF-002:** Dashboard debe cargar en \< 2 segundos

**RNF-PERF-003:** Actualizaciones de cotizaciones en tiempo real (\< 5s de delay)

**RNF-PERF-004:** Lazy loading de componentes pesados (gráficos, tablas extensas)

**RNF-PERF-005:** Optimización de imágenes y assets (\< 100KB por imagen)

## **6.2 Seguridad**

**RNF-SEC-001:** HTTPS obligatorio en todas las comunicaciones

**RNF-SEC-002:** Tokens JWT con expiración corta (15 min access, 7 días refresh)

**RNF-SEC-003:** Rate limiting en endpoints de autenticación (5 intentos/min)

**RNF-SEC-004:** XSS protection: sanitización de inputs y outputs

**RNF-SEC-005:** CSRF protection en formularios

**RNF-SEC-006:** Encriptación de datos sensibles en tránsito y reposo

**RNF-SEC-007:** Logout automático por inactividad (30 minutos)

## **6.3 Usabilidad**

**RNF-UX-001:** Interfaz responsive para tablets y desktop (1024px+)

**RNF-UX-002:** Navegación intuitiva con máximo 3 clicks a cualquier función core

**RNF-UX-003:** Mensajes de error claros y accionables (sin jerga técnica)

**RNF-UX-004:** Loading states visibles en todas las operaciones asíncronas

**RNF-UX-005:** Confirmaciones para acciones críticas (órdenes, retiros, cancelaciones)

**RNF-UX-006:** Tooltips explicativos en conceptos financieros complejos

## **6.4 Compatibilidad**

**RNF-COMP-001:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

**RNF-COMP-002:** Resoluciones: 1024x768 mínimo, optimizado para 1920x1080

**RNF-COMP-003:** Soporte para dispositivos táctiles (tablets)

## **6.5 Regulación y Cumplimiento (AAGI/CNV)**

**RNF-REG-001:** Trazabilidad completa de órdenes y transacciones con logs auditables

**RNF-REG-002:** Timestamps en UTC con conversión a ART para display

**RNF-REG-003:** Almacenamiento de evidencia: screenshots de confirmaciones, emails, etc.

**RNF-REG-004:** Disclaimers de riesgo visibles antes de operaciones

**RNF-REG-005:** Reportes de actividad exportables para auditoría externa

## **6.6 Escalabilidad**

**RNF-SCALE-001:** Arquitectura preparada para 10,000 usuarios concurrentes

**RNF-SCALE-002:** Backend stateless para permitir horizontal scaling

**RNF-SCALE-003:** CDN para assets estáticos (CloudFlare o GCP CDN)

**RNF-SCALE-004:** Caché inteligente para datos que cambian poco (perfiles, settings)

# **7\. Roadmap de Desarrollo**

**Nota importante:** El roadmap está diseñado para lograr paridad completa con mobile. El desarrollo es iterativo pero el objetivo es cubrir TODAS las funcionalidades de mobile, no solo un subconjunto.

## **7.1 Fase 1 \- Fundación y Core (10-12 semanas)**

### **Sprint 1-2: Infraestructura y Autenticación (2 semanas)**

* Setup de proyecto React \+ TypeScript  
* Configuración de CI/CD pipeline  
* Autenticación completa (login, 2FA, recuperación)  
* Layout base (sidebar, header, routing)  
* Integración con backend existente  
* Sistema de gestión de estado global

### **Sprint 3-4: Dashboard y Patrimonio (2 semanas)**

* Dashboard de patrimonio con toggle ARS/USD/Consolidado  
* Desglose por productos (Pesos, Dólares, Objetivos, Packs, Efectivo)  
* Gráfico de evolución temporal con períodos  
* Integración de tipo de cambio en tiempo real  
* Métricas de performance (rendimiento, ganancia/pérdida)  
* Acciones rápidas (Invertir, Retirar, Comprar USD)

### **Sprint 5-6: Productos Base (Pesos y Dólares) (2 semanas)**

* Módulo completo de Welfi Pesos  
* Módulo completo de Welfi Dólares/Dolarity  
* Visualización de rendimientos y posiciones  
* Operatoria de inversión/desinversión  
* Integración con flujos de liquidación

### **Sprint 7-8: Tenencias y Movimientos (2 semanas)**

* Página de tenencias completa con filtros y ordenamiento  
* Detalle de cada posición con histórico  
* Historial completo de movimientos con paginación  
* Filtros avanzados y búsqueda  
* Exportación a CSV/Excel  
* Estados de transacciones detallados

### **Sprint 9-10: Órdenes y FX (2 semanas)**

* Sistema completo de gestión de órdenes  
* Creación de órdenes con validaciones  
* Estados en tiempo real (WebSocket o polling)  
* Cancelación de órdenes  
* Módulo de compra/venta de dólares (FX)  
* Cotizaciones en tiempo real  
* Historial de operaciones FX

### **Sprint 11-12: QA Fase 1 y Deploy Beta (2 semanas)**

* Testing end-to-end de todas las funcionalidades  
* Performance optimization  
* Fixes de UI/UX  
* Documentación  
* Deploy a staging  
* Beta cerrada con usuarios internos

## **7.2 Fase 2 \- Productos Avanzados (8-10 semanas)**

### **Sprint 13-14: Objetivos Financieros (2 semanas)**

* Wizard de creación de objetivos completo  
* Recomendación de estrategias según perfil  
* Cálculo de aporte sugerido  
* Dashboard de objetivo individual  
* Seguimiento de progreso con visualizaciones  
* Automatización de inversión  
* Edición y pausado de objetivos

### **Sprint 15-16: Estrategias y Packs Temáticos (2 semanas)**

* Catálogo de estrategias recomendadas  
* Suscripción a estrategias  
* Sistema de bonificaciones y promos  
* Gestión de elegibilidad por usuario  
* Catálogo de packs temáticos  
* Inversión en packs  
* Seguimiento de performance de packs  
* Rebalanceo automático

### **Sprint 17-18: Noticias y Perfil (2 semanas)**

* Sección de noticias completa  
* Curación de contenido  
* Sistema de notificaciones  
* Gestión completa de perfil de usuario  
* Configuración de cuenta y preferencias  
* KYC status y documentación  
* Configuración de seguridad (2FA, contraseña)

### **Sprint 19-20: QA Integral y Launch (2 semanas)**

* Testing de regresión completo  
* UAT con usuarios beta externos  
* Performance y seguridad audit  
* Preparación para producción  
* Plan de rollout gradual  
* Launch público

## **7.3 Fase 3 \- Features Exclusivas Web (6-8 semanas)**

* Reportes exportables profesionales (PDF con branding)  
* Exportación masiva de datos históricos  
* Simuladores avanzados de inversión  
* Comparadores de estrategias  
* Herramientas de análisis y proyección  
* Gestión batch de múltiples órdenes  
* Dashboard personalizable con widgets  
* Vistas multi-cuenta (si aplica para Premium)  
* Integración con herramientas externas (calendarios, etc.)

## **7.4 Fase 4 \- Optimización Continua (Ongoing)**

* A/B testing de flujos críticos  
* Analytics avanzados y optimización de conversión  
* SEO y contenido educativo en web  
* Features Premium/Welfi Black exclusivas  
* Mejoras basadas en feedback de usuarios  
* Actualizaciones de seguridad y compliance

# **8\. Consideraciones de Diseño y UX**

## **8.1 Principios de Diseño**

**Simplicidad:** Evitar abrumar al usuario. Menos es más. Priorizar claridad sobre densidad de información.

**Confianza:** Transparencia en números, tipo de cambio, fees. Disclaimers claros sin asustar.

**Guía:** La app debe sentirse como un asesor amigable, no como una plataforma de trading compleja.

**Consistencia:** Misma paleta de colores, tipografía, componentes que mobile (cuando aplique).

**Performance Percibido:** Skeletons, loading states, optimistic updates para que se sienta rápido.

## **8.2 Paleta de Colores (Referencia)**

Nota: Los colores exactos deben alinearse con el brand de Welfi. Aquí algunos lineamientos generales:

**Primario:** Azul Welfi (acciones principales, CTAs)

**Secundario:** Verde (positivo, ganancias) / Rojo (negativo, pérdidas)

**Neutros:** Grises para fondos, textos secundarios

**Alerts:** Amarillo (warnings), Rojo (errores), Verde (success)

## **8.3 Tipografía**

Fuente primaria: Sans-serif moderna (Roboto, Inter, o custom de Welfi)

Tamaños: Jerarquía clara (H1: 32px, H2: 24px, Body: 16px, Small: 14px)

Pesos: Regular, Medium, Bold para jerarquía

## **8.4 Componentes Reutilizables Clave**

* MoneyDisplay: Mostrar montos con currency, separadores de miles, colores según positivo/negativo  
* CurrencyToggle: Selector ARS/USD/Consolidado  
* PerformanceCard: Tarjeta con rendimiento, gráfico sparkline, período  
* TransactionRow: Fila de movimiento con ícono, fecha, monto, estado  
* OrderCard: Tarjeta de orden con estado, timestamps, acciones  
* GoalProgress: Barra de progreso con meta, % completado, monto faltante  
* RiskBadge: Badge de perfil de riesgo (Conservador/Moderado/Agresivo)  
* ExchangeRateTooltip: Tooltip mostrando tipo de cambio usado y fuente

# **9\. Estrategia de Testing y QA**

## **9.1 Testing Unitario**

Framework: Jest \+ React Testing Library

Cobertura objetivo: 80% en componentes críticos (auth, dashboard, órdenes)

Tests de: utilidades, hooks custom, formatters (monedas, fechas)

## **9.2 Testing de Integración**

Framework: Cypress o Playwright

* Flujos críticos:

* Login → Dashboard → Ver tenencias → Logout  
* Crear orden → Verificar estado → Cancelar  
* Cambiar currency toggle → Verificar cifras consistentes  
* Filtrar movimientos → Exportar CSV

## **9.3 Testing Manual**

Test Plan con casos de uso por módulo

Foco en edge cases: saldos en cero, órdenes fallidas, tipo de cambio desactualizado

UAT (User Acceptance Testing) con usuarios beta internos

## **9.4 Testing de Performance**

Lighthouse CI: Score mínimo 90 en Performance, Accessibility

Bundle analysis: Identificar y code-split bundles grandes

Real User Monitoring (RUM) post-deploy

## **9.5 Testing de Seguridad**

Penetration testing básico

Verificación de OWASP Top 10

Dependency scanning (npm audit, Snyk)

# **10\. Deployment y DevOps**

## **10.1 Ambientes**

**Development:** Local dev con backend mock o dev backend

**Staging:** Réplica de producción con datos de prueba

**Production:** Ambiente real con usuarios

## **10.2 CI/CD Pipeline**

Plataforma: GitHub Actions, GitLab CI, o Circle CI

* Pipeline:

* Lint (ESLint, Prettier)  
* Unit tests (Jest)  
* Build (optimizado para producción)  
* E2E tests (Cypress)  
* Deploy a staging (automático en merge a develop)  
* Deploy a production (manual approval, tags de release)

## **10.3 Hosting**

Opción recomendada: GCP (Cloud Run o App Engine) para consistencia con backend

Alternativas: Vercel, Netlify (más simple pero fuera de GCP)

CDN: CloudFlare o GCP CDN para assets estáticos

## **10.4 Monitoring y Observabilidad**

**Error Tracking:** Sentry para captura de errores en tiempo real

**Analytics:** Google Analytics o Mixpanel para comportamiento de usuarios

**Performance:** Lighthouse CI \+ Real User Monitoring

**Logs:** Stackdriver (GCP) o equivalente para logs centralizados

**Uptime:** Pingdom, UptimeRobot o GCP Monitoring para alertas de caídas

# **11\. Riesgos y Estrategias de Mitigación**

| Riesgo | Impacto | Mitigación |
| :---- | :---- | :---- |
| **Backend no está preparado para web (endpoints faltantes/incompletos)** | Alto: bloquea desarrollo de features | Mapeo temprano de APIs necesarias. Priorizar mejoras de backend en paralelo. |
| **Tipo de cambio desactualizado o inconsistente** | Alto: pérdida de confianza del usuario | Fuente de datos confiable con fallback. Timestamp visible siempre. Monitoreo de discrepancias. |
| **Performance pobre en gráficos con muchos datos** | Medio: UX negativa | Lazy loading, virtualización de listas, agregación en backend, caché de snapshots. |
| **Adopción baja de usuarios (prefieren mobile)** | Medio: ROI cuestionable | Features exclusivas en web (reportes, simuladores). Marketing dirigido a power users. |
| **Problemas de regulación/auditoría post-launch** | Alto: multas, suspensión | Revisión legal temprana. Logs auditables desde día 1\. Disclaimers claros. |

# **12\. Métricas de Éxito**

## **12.1 Métricas de Producto**

**DAU/MAU:** Daily/Monthly Active Users. Target: 20% DAU/MAU ratio en primeros 3 meses

**Time in App:** Tiempo promedio por sesión. Target: \> 5 minutos

**Feature Adoption:** % usuarios que usan cada feature core. Target: Dashboard 100%, Tenencias 70%, Órdenes 30%

**Conversion Rate:** % usuarios que crean al menos 1 orden. Target: \> 15%

**Retention:** Retención semanal. Target: \> 40% week 1, \> 25% week 4

## **12.2 Métricas Técnicas**

**Page Load Time:** Target: \< 3s (P95)

**API Response Time:** Target: \< 500ms (P95)

**Error Rate:** Target: \< 0.5% de requests

**Uptime:** Target: 99.9%

**Lighthouse Score:** Target: \> 90 en Performance, Accessibility

## **12.3 Métricas de Negocio**

**AUM Growth:** Incremento en Assets Under Management vía web

**Revenue per User (web):** Fee promedio generado por usuario web vs mobile

**Support Tickets:** Reducción de tickets comparado con mobile (target: \-20%)

**NPS (Net Promoter Score):** Target: \> 50 en primeros 6 meses

# **13\. Anexos**

## **13.1 Glosario**

**AUM:** Assets Under Management \- Patrimonio total bajo gestión

**AAGI:** Agente de Administración Global de Inversiones \- regulación CNV

**CNV:** Comisión Nacional de Valores \- regulador argentino

**MEP:** Mercado Electrónico de Pagos \- mecanismo de compra/venta USD en Argentina

**DXA:** Twentieth of a point \- unidad de medida en Word (1440 DXA \= 1 inch)

**FX:** Foreign Exchange \- operaciones de cambio de divisas

**KYC:** Know Your Customer \- proceso de identificación de usuario

**OTP:** One-Time Password \- código de un solo uso para 2FA

**2FA:** Two-Factor Authentication \- autenticación de dos factores

**JWT:** JSON Web Token \- formato de token para autenticación

**API:** Application Programming Interface

**MVP:** Minimum Viable Product \- producto mínimo viable

**UAT:** User Acceptance Testing \- pruebas de aceptación de usuario

**P95:** Percentil 95 \- métrica que excluye el 5% de casos más lentos

## **13.2 Referencias**

* Documentación de API BROKER (interna)  
* Normativa CNV para AAGI  
* Guías de UX para fintech (Nielsen Norman Group)  
* React Best Practices (docs.react.dev)  
* Material sobre bimonetarismo argentino

## **13.3 Contactos del Proyecto**

* CEO: \[Nombre\] \- *\[email\]*  
* CPO: \[Nombre\] \- *\[email\]*  
* Tech Lead: \[Nombre\] \- *\[email\]*  
* Partner Desarrollo (Lila Software): \[Contacto\] \- *\[email\]*

**Documento generado el:** 12/02/2026 23:54

**Versión:** 1.0 \- Borrador para Desarrollo