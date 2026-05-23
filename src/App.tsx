import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ExternalLink,
  Globe2,
  Link2,
  MessageCircle,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Store,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";

type TrustMetric = [string, string, string];
type WorkflowStep = [string, string, string];
type FaqItem = [string, string];
type EcosystemCategory = "Todos" | "Cobrar" | "Vender" | "Operar" | "Automatizar";
type ProductCategory = Exclude<EcosystemCategory, "Todos">;
type CommerceStory = { name: string; channel: string; ticket: string; method: string; result: string; accent: string; proof: string; icon: LucideIcon };
type EcosystemProduct = { name: string; category: ProductCategory; color: string; image: string; alt: string; description: string; benefit: string; metric: string; cta: string; url: string };
type PillarPosition = { x: number; h: number; z: number };

const brand = {
  black: "#1D1D1D",
  red: "#ED1C27",
  blue: "#0082C4",
  cta: "#1677DA",
  gray: "#5C5E60",
  light: "#F2F2F2",
  yellow: "#FFE11B",
  orange: "#F8991D",
  green: "#009056",
};

const trustMetrics: TrustMetric[] = [
  ["17k+", "negocios activos", "Placeholder: reemplace por dato real antes de publicar"],
  ["4", "formas de cobro", "Links, botones, checkout y canales digitales"],
  ["24/7", "operación digital", "Cobros online para vender sin depender de horarios"],
];

const benefits = ["Afiliación sin costo", "Ruta práctica para comenzar", "Herramientas listas para vender", "Web, redes sociales y WhatsApp", "Pensado para avanzar rápido"];

const commerceStories: CommerceStory[] = [
  { name: "Moda Urbana", channel: "Instagram + WhatsApp", ticket: "$95.000", method: "Link de cobro", result: "venta confirmada en conversación", accent: brand.red, icon: MessageCircle, proof: "Cliente pregunta por talla, recibe un link, paga en el momento y el negocio confirma el pedido sin cambiar de canal." },
  { name: "Café de barrio", channel: "Mostrador + QR", ticket: "$28.000", method: "QR Interoperable", result: "fila más fluida", accent: brand.orange, icon: Store, proof: "El cliente escanea, elige su entidad, paga y la caja recibe una confirmación clara para seguir atendiendo." },
  { name: "Tienda natural", channel: "Web + catálogo", ticket: "$142.000", method: "Checkout", result: "compra completa", accent: brand.green, icon: ShoppingCart, proof: "El comprador llega desde el catálogo, revisa el carrito, paga por PSE o tarjeta y recibe confirmación del pedido." },
  { name: "Academia online", channel: "Landing + plan mensual", ticket: "$79.000", method: "Suscripciones", result: "cobro automatizado", accent: "#EF074A", icon: TrendingUp, proof: "El estudiante elige un plan, activa la suscripción y el negocio reduce cobros manuales mes a mes." },
];

const ecosystemCategories: EcosystemCategory[] = ["Todos", "Cobrar", "Vender", "Operar", "Automatizar"];

const ecosystemMeta: Record<EcosystemCategory, { label: string; description: string; intent: string; accent: string }> = {
  Todos: { label: "Ecosistema ePayco", description: "Explore soluciones para cobrar, vender, operar y automatizar según la etapa actual de su negocio.", intent: "Vista general", accent: brand.red },
  Cobrar: { label: "Cobrar", description: "Soluciones para recibir pagos en canales digitales o presenciales con menos fricción.", intent: "Recibir pagos", accent: brand.green },
  Vender: { label: "Vender", description: "Herramientas para convertir canales digitales, tiendas y conversaciones en ventas reales.", intent: "Crear ventas", accent: "#BF0615" },
  Operar: { label: "Operar", description: "Productos para controlar, recaudar, dispersar y administrar mejor el dinero en movimiento.", intent: "Gestionar dinero", accent: brand.orange },
  Automatizar: { label: "Automatizar", description: "APIs, mensajes y cobros recurrentes para reducir tareas manuales y escalar procesos.", intent: "Escalar procesos", accent: brand.blue },
};

const ecosystemProducts: EcosystemProduct[] = [
  { name: "Suscripciones", category: "Automatizar", color: "#EF074A", image: "https://www.figma.com/api/mcp/asset/33ca4a04-fa4c-4579-b715-d1c345973a40", alt: "Suscripciones", description: "Automatice cobros recurrentes para membresías, planes y servicios periódicos.", benefit: "Reduce tareas manuales y mejora la continuidad de ingresos recurrentes.", metric: "Cobro recurrente", cta: "Ver Suscripciones", url: "/suscripciones" },
  { name: "Pagos", category: "Cobrar", color: brand.red, image: "https://www.figma.com/api/mcp/asset/5e45023d-5306-4fc3-8bbf-c2f7efb5f92f", alt: "Monedas", description: "Reciba pagos digitales de forma simple, segura y escalable.", benefit: "Acepta múltiples medios de pago desde una sola plataforma.", metric: "+ medios de pago", cta: "Conocer Pagos", url: "/pagos" },
  { name: "Desarrolladores", category: "Automatizar", color: brand.blue, image: "https://www.figma.com/api/mcp/asset/403e25c4-c874-4f38-9562-643da943eb9c", alt: "Desarrolladores", description: "Integre pagos, recaudos y flujos financieros con APIs.", benefit: "Cree experiencias a la medida con recursos para equipos técnicos.", metric: "API-ready", cta: "Ver docs", url: "/desarrolladores" },
  { name: "Venta social", category: "Vender", color: "#BF0615", image: "https://www.figma.com/api/mcp/asset/eba31b58-21e4-45bb-b3d9-1ccc2adaf163", alt: "Redes sociales", description: "Convierta sus canales sociales en oportunidades reales de venta.", benefit: "Conecta conversaciones, publicaciones y pagos de forma natural.", metric: "Social selling", cta: "Explorar venta", url: "/venta-social" },
  { name: "Email de cobro", category: "Automatizar", color: "#EF074A", image: "https://www.figma.com/api/mcp/asset/cf568ece-3b88-442e-916e-61fdd43d9ae1", alt: "Email de cobro", description: "Envíe solicitudes de pago directamente al correo del cliente.", benefit: "Facilita cobros puntuales sin crear una integración compleja.", metric: "Cobro enviado", cta: "Usar email", url: "/email-de-cobro" },
  { name: "Terminal", category: "Cobrar", color: brand.yellow, image: "https://www.figma.com/api/mcp/asset/a663f18f-b76f-4f0a-ba27-a44dd719e827", alt: "Datáfono", description: "Acepte pagos presenciales con datáfono y soporte operativo.", benefit: "Una solución práctica para comercios con atención física.", metric: "Presencial", cta: "Ver Terminal", url: "/terminal" },
  { name: "Control", category: "Operar", color: brand.blue, image: "https://www.figma.com/api/mcp/asset/73c88ab5-7b41-4d5d-b68e-edc6809b927c", alt: "Seguridad móvil", description: "Administre, proteja y monitoree la operación financiera de su negocio.", benefit: "Más visibilidad para reducir fricción y tomar mejores decisiones.", metric: "Más control", cta: "Conocer Control", url: "/control" },
  { name: "Pagos divididos", category: "Operar", color: brand.black, image: "https://www.figma.com/api/mcp/asset/cb39528c-0745-4803-a731-c96c476b6066", alt: "Pagos divididos", description: "Divida pagos entre múltiples participantes de forma simple y controlada.", benefit: "Ideal para marketplaces, aliados, comisiones y modelos colaborativos.", metric: "Split payments", cta: "Conocer Pagos divididos", url: "/pagos-divididos" },
  { name: "Link de cobro", category: "Cobrar", color: brand.red, image: "https://www.figma.com/api/mcp/asset/21b01813-0951-4990-9141-e2342911b8ac", alt: "Link de cobro", description: "Comparta enlaces de pago por WhatsApp, redes o canales digitales.", benefit: "Cobra sin tienda online y sin desarrollar un checkout completo.", metric: "Comparte y cobra", cta: "Crear link", url: "/link-de-cobro" },
  { name: "QR Interoperable", category: "Cobrar", color: brand.orange, image: "https://www.figma.com/api/mcp/asset/46f57c6d-3f1d-45eb-b595-9cfefe4b4d01", alt: "QR", description: "Cobre con QR desde múltiples entidades y simplifique el pago físico.", benefit: "Una experiencia rápida para comercios y clientes en punto de venta.", metric: "QR simple", cta: "Ver QR", url: "/qr-interoperable" },
  { name: "Checkout", category: "Cobrar", color: brand.green, image: "https://www.figma.com/api/mcp/asset/a0ce98eb-9b8a-4ebd-aa1f-9fdb6be2b6d1", alt: "Caja registradora", description: "Integre una experiencia de pago clara, segura y optimizada para convertir.", benefit: "Reduce fricción cuando el cliente va a pagar.", metric: "Conversión", cta: "Conocer Checkout", url: "/checkout" },
  { name: "Botón de cobro", category: "Vender", color: brand.green, image: "https://www.figma.com/api/mcp/asset/2d87e1a9-41d7-4775-bc23-734357fce4ac", alt: "Botón de cobro", description: "Agregue un botón de pago sencillo en sus canales digitales.", benefit: "Activa cobros rápidos sin construir una experiencia completa desde cero.", metric: "Implementación rápida", cta: "Crear botón", url: "/boton-de-cobro" },
  { name: "Payouts", category: "Operar", color: "#EF4307", image: "https://www.figma.com/api/mcp/asset/ea2db02c-4478-4b80-80f4-78a107af8781", alt: "Payouts", description: "Disperse dinero a usuarios, aliados, proveedores o comercios.", benefit: "Automatiza pagos salientes y reduce carga operativa.", metric: "Dispersión", cta: "Ver Payouts", url: "/payouts" },
  { name: "Recaudo", category: "Operar", color: brand.light, image: "https://www.figma.com/api/mcp/asset/e1cdc3a6-fa77-4283-b6d5-53296f4f1acb", alt: "Recaudo", description: "Centralice recaudos para procesos financieros más claros.", benefit: "Mejora la trazabilidad de pagos recurrentes, masivos o institucionales.", metric: "Trazabilidad", cta: "Ver Recaudo", url: "/recaudo" },
  { name: "ePayco.me", category: "Vender", color: "#BF0615", image: "https://www.figma.com/api/mcp/asset/871b31a9-7799-4308-baf3-b8ab10e7f8c2", alt: "ePayco.me", description: "Cree una presencia simple para vender y recibir pagos online.", benefit: "Ideal para emprendedores, marcas personales y negocios digitales.", metric: "Vende online", cta: "Ver ePayco.me", url: "/epayco-me" },
  { name: "Recaudo móvil", category: "Operar", color: brand.light, image: "https://www.figma.com/api/mcp/asset/ea164c4a-4b2f-4296-80a0-19fb9368b75c", alt: "Recaudo móvil", description: "Gestione pagos y recaudos desde experiencias móviles.", benefit: "Da flexibilidad a clientes y equipos en movimiento.", metric: "Mobile-first", cta: "Ver móvil", url: "/recaudo-movil" },
  { name: "SMS de cobro", category: "Automatizar", color: "#EF074A", image: "https://www.figma.com/api/mcp/asset/d9e9d9c0-ea63-4044-8781-69768b2e6dd9", alt: "SMS de cobro", description: "Envíe solicitudes de pago por SMS para llegar rápido al cliente.", benefit: "Útil para recordatorios, cobros puntuales y comunicaciones de pago.", metric: "Al instante", cta: "Enviar SMS", url: "/sms-de-cobro" },
  { name: "Shops", category: "Vender", color: "#BF0615", image: "https://www.figma.com/api/mcp/asset/0cc36b4b-6e2e-40b0-b178-c95b19fc4c32", alt: "Carrito", description: "Cree su tienda online y empiece a vender con pagos integrados.", benefit: "Pasa de catálogo a venta digital en menos pasos.", metric: "Tienda online", cta: "Crear tienda", url: "/shops" },
];

const pillarLayout: PillarPosition[] = [
  { x: 8, h: 22, z: 31 }, { x: 8, h: 56, z: 11 }, { x: 20, h: 40, z: 32 }, { x: 20, h: 72, z: 12 }, { x: 32, h: 30, z: 35 }, { x: 32, h: 54, z: 25 }, { x: 32, h: 82, z: 15 }, { x: 45.5, h: 18, z: 38 }, { x: 45.5, h: 40, z: 28 }, { x: 45.5, h: 62, z: 18 }, { x: 45.5, h: 92, z: 8 }, { x: 59, h: 32, z: 37 }, { x: 59, h: 54, z: 27 }, { x: 59, h: 80, z: 17 }, { x: 71, h: 40, z: 33 }, { x: 71, h: 72, z: 13 }, { x: 83, h: 22, z: 34 }, { x: 83, h: 56, z: 14 },
];

const workflow: WorkflowStep[] = [
  ["01", "Entendemos su canal", "Cómo vende hoy, ticket promedio, volumen y etapa del negocio."],
  ["02", "Elegimos la ruta", "Le orientamos hacia links, botón, checkout o canal digital."],
  ["03", "Activa su cuenta", "Avanza con una ruta práctica para comenzar a recibir pagos online."],
  ["04", "Empieza a vender", "Valida su operación, mejora el cobro y crece con más claridad."],
];

const faqs: FaqItem[] = [
  ["¿Qué es un agregador de pagos?", "Es una solución para recibir pagos online de forma simple, ideal para negocios que quieren empezar a cobrar sin una ruta compleja desde el inicio."],
  ["¿Necesito página web para empezar?", "No necesariamente. También puede ser útil si vende por redes sociales, WhatsApp u otros canales digitales."],
  ["¿Qué formas de cobro puedo usar?", "Dependiendo de su necesidad, puede avanzar con checkout, links, botones y otras herramientas de cobro."],
  ["¿Es buena opción para negocios pequeños o en crecimiento?", "Sí. Es una ruta adecuada para negocios que están comenzando o que quieren crecer con menos fricción."],
  ["¿Después puedo evaluar otro modelo?", "Sí. Si su operación crece y requiere otra estructura, puede revisar una ruta más robusta como Gateway."],
];

export const designChecks = [
  { name: "No Stripe purple", pass: !JSON.stringify(brand).includes("#635BFF") },
  { name: "Ecosystem has 18 products", pass: ecosystemProducts.length === 18 },
  { name: "Pillar layout matches products", pass: pillarLayout.length === ecosystemProducts.length },
  { name: "Commerce stories restored", pass: commerceStories.length === 4 },
  { name: "FAQ content included", pass: faqs.length >= 5 },
  { name: "Trust metric counters restored", pass: trustMetrics.length === 3 },
  { name: "Typing headline restored", pass: true },
];

function Button({ children, href = "#cta-final", variant = "primary", className = "" }: { children: React.ReactNode; href?: string; variant?: "primary" | "dark" | "light"; className?: string }) {
  const styles = { primary: "bg-[#1677DA] text-white shadow-[0_16px_34px_rgba(0,130,196,.22)] hover:bg-[#0068BF]", dark: "bg-[#1D1D1D] text-white shadow-[0_16px_34px_rgba(29,29,29,.18)] hover:bg-black", light: "bg-white text-[#1D1D1D] ring-1 ring-[#1D1D1D]/10 shadow-[0_12px_28px_rgba(29,29,29,.08)] hover:ring-[#ED1C27]/30" };
  return <a href={href} className={`group inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-black transition duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0082C4]/20 ${styles[variant]} ${className}`}>{children}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></a>;
}

function BrandWordmark({ light = false }: { light?: boolean }) {
  return <div className="flex items-center gap-3"><div className={`grid h-11 w-11 place-items-center rounded-xl ${light ? "bg-white text-[#1D1D1D]" : "bg-[#1D1D1D] text-white"} shadow-[0_12px_26px_rgba(29,29,29,.16)]`}><span className="text-xl font-black italic leading-none text-[#ED1C27]">P</span></div><div><p className={`text-xl font-black italic leading-none tracking-[-0.05em] ${light ? "text-white" : "text-[#1D1D1D]"}`}>ePayco</p><p className={`mt-1 text-[10px] font-bold uppercase tracking-[0.2em] ${light ? "text-white/55" : "text-[#5C5E60]"}`}>Agregador</p></div></div>;
}

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <div className={`mb-5 inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] ${light ? "bg-white/10 text-white/80 ring-1 ring-white/15" : "bg-[#ED1C27]/8 text-[#ED1C27] ring-1 ring-[#ED1C27]/14"}`}><Sparkles className="h-3.5 w-3.5" />{children}</div>;
}

function AnimatedNumber({ type, end, active }: { type: string; end: number; active: boolean }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const counter = { value: 0 };
    const tween = gsap.to(counter, {
      value: end,
      duration: type === "day" ? 1.45 : 1.15,
      ease: "power2.out",
      onUpdate: () => setValue(Math.round(counter.value)),
    });
    return () => tween.kill();
  }, [active, end, type]);

  if (!active) return <span>0</span>;
  if (type === "k") return <span>{value}k+</span>;
  if (type === "day") return <span>{value}/7</span>;
  return <span>{value}</span>;
}

function TypingHeadline({ text }: { text: string }) {
  const words = text.split(" ");
  const totalDelay = words.length * 0.095 + 0.75;

  return (
    <h2 className="relative text-balance text-4xl font-black tracking-[-0.04em] sm:text-[3.2rem] sm:leading-[0.95]" aria-label={text}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline">
        {words.map((word, wordIndex) => (
          <span key={`${word}-${wordIndex}`} className="relative mr-[0.22em] inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block whitespace-nowrap"
              initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.22, y: 8, filter: "blur(8px)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0)", opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.65 }}
              transition={{ duration: Math.min(0.5 + word.length * 0.032, 0.88), delay: 0.12 + wordIndex * 0.095, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
            <motion.span
              className="pointer-events-none absolute inset-y-[8%] right-0 w-[3px] rounded-full bg-[#ED1C27] shadow-[0_0_18px_rgba(237,28,39,.7)]"
              initial={{ opacity: 0, scaleY: 0.35 }}
              whileInView={{ opacity: [0, 1, 1, 0], scaleY: [0.35, 1, 1, 0.35] }}
              viewport={{ once: true, amount: 0.65 }}
              transition={{ duration: 0.52, delay: 0.12 + wordIndex * 0.095, ease: "easeOut" }}
            />
          </span>
        ))}
      </span>
      <motion.span
        className="ml-1 inline-block h-[0.86em] w-[4px] translate-y-[0.12em] rounded-full bg-[#ED1C27] shadow-[0_0_18px_rgba(237,28,39,.72)]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1, 0, 1, 0, 1, 0] }}
        viewport={{ once: true, amount: 0.65 }}
        transition={{ duration: 2.1, delay: totalDelay, ease: "steps(1)" }}
        aria-hidden="true"
      />
    </h2>
  );
}

function PageBackground() {
  return <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden"><div className="absolute inset-0 bg-[#F2F2F2]" /><div className="absolute -right-32 -top-28 h-[36rem] w-[72rem] rotate-[-7deg] rounded-[4rem] bg-[linear-gradient(135deg,rgba(237,28,39,.16),rgba(248,153,29,.10)_38%,rgba(0,130,196,.08)_76%,rgba(29,29,29,.05))]" /><div className="absolute -left-36 top-48 h-[26rem] w-[58rem] rotate-[-7deg] rounded-[3rem] bg-white/80" /><div className="absolute right-0 top-0 h-[28rem] w-[28rem] rounded-full bg-[#ED1C27]/8 blur-3xl" /><div className="absolute bottom-[-8rem] left-1/3 h-[28rem] w-[28rem] rounded-full bg-[#0082C4]/8 blur-3xl" /><div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-b from-transparent to-[#F2F2F2]" /></div>;
}

function MiniEvent({ Icon, title, text, color }: { Icon: LucideIcon; title: string; text: string; color: string }) {
  return <div className="flex items-center gap-3 rounded-2xl bg-white/[0.08] p-4 ring-1 ring-white/10"><div className="grid h-10 w-10 place-items-center rounded-lg bg-white/10" style={{ color }}><Icon className="h-4 w-4" /></div><div><p className="text-sm font-black text-white">{title}</p><p className="text-xs text-white/48">{text}</p></div></div>;
}

function PremiumProofRail() {
  const rail: Array<[LucideIcon, string, string]> = [[ShieldCheck, "Seguro", "Cobros con trazabilidad"], [Link2, "Link", "Listo para compartir"], [BadgeCheck, "Aprobado", "Cliente confirmado"]];
  return <div className="hero-soft mt-10 grid gap-3 md:grid-cols-3 lg:max-w-2xl">{rail.map(([Icon, title, text]) => <div key={title} className="group rounded-2xl border border-white/10 bg-white/[0.075] p-4 text-white shadow-[0_18px_50px_rgba(0,0,0,.16)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.095]"><Icon className="h-5 w-5 text-[#FFE11B]" /><p className="mt-4 text-sm font-black">{title}</p><p className="mt-1 text-xs leading-5 text-white/55">{text}</p></div>)}</div>;
}

function ProductProof() {
  return <div className="relative mx-auto w-full max-w-[640px]" aria-label="Mockup de pago con ePayco Agregador"><div className="absolute -right-6 -top-6 z-20 hidden rounded-2xl border border-[#1D1D1D]/10 bg-white p-4 shadow-[0_22px_60px_rgba(29,29,29,.16)] md:block"><p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#5C5E60]">estado</p><p className="mt-1 text-sm font-black text-[#009056]">Operación lista</p></div><motion.div initial={{ opacity: 0, y: 28, rotateX: 8, rotateZ: -1.5 }} animate={{ opacity: 1, y: 0, rotateX: 0, rotateZ: -1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative z-10 rounded-[2rem] border border-white/80 bg-white/92 p-3 shadow-[0_34px_110px_rgba(29,29,29,.22)] backdrop-blur-xl"><div className="overflow-hidden rounded-[1.55rem] bg-[#1D1D1D] text-white"><div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><BrandWordmark light /><span className="rounded-md bg-white/10 px-3 py-1 text-[11px] font-bold text-white/70">Cuenta validada</span></div><div className="grid md:grid-cols-[1fr_.78fr]"><div className="p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[.2em] text-white/55">Microhistoria del producto</p><div className="mt-5 rounded-2xl bg-white p-5 text-[#1D1D1D] shadow-[0_16px_45px_rgba(0,0,0,.22)]"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold text-[#5C5E60]">WhatsApp · Link de pago</p><p className="mt-1 text-4xl font-black tracking-[-0.04em]">$128.000</p></div><span className="rounded-md bg-[#009056]/10 px-3 py-1 text-xs font-black text-[#009056]">Pago exitoso</span></div><div className="mt-6 grid grid-cols-3 gap-2">{["PSE", "TC", "QR"].map((item) => <div key={item} className="rounded-lg border border-[#1D1D1D]/10 bg-[#F2F2F2] py-2 text-center text-xs font-black text-[#5C5E60]">{item}</div>)}</div><div className="mt-5 flex h-12 items-center justify-center rounded-md bg-[#1D1D1D] text-sm font-black text-white shadow-[0_12px_28px_rgba(29,29,29,.18)]">Confirmación enviada al cliente</div></div></div><div className="border-t border-white/10 bg-white/[0.045] p-5 md:border-l md:border-t-0"><div className="rounded-2xl bg-white/[0.08] p-4 ring-1 ring-white/10"><div className="flex items-center justify-between"><p className="text-xs font-bold text-white/55">Resultado visible</p><TrendingUp className="h-4 w-4 text-[#009056]" /></div><p className="mt-3 text-3xl font-black tracking-[-0.04em]">+76%</p><p className="mt-1 text-xs text-white/45">más claridad en el flujo de cobro</p><div className="mt-4 h-2 rounded-full bg-white/10"><motion.div className="h-2 rounded-full bg-[#009056]" initial={{ width: "24%" }} animate={{ width: "76%" }} transition={{ duration: 1.2, delay: 0.55 }} /></div></div><div className="mt-3 grid gap-3"><MiniEvent Icon={Link2} title="Link creado" text="Listo para compartir" color={brand.orange} /><MiniEvent Icon={BadgeCheck} title="Pago recibido" text="Cliente confirmado" color={brand.green} /></div></div></div></div></motion.div></div>;
}

function AnimatedTrustSection() {
  const trustRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(trustRef, { once: false, margin: "-18% 0px -18% 0px" });
  const metrics = [
    { label: "negocios activos", caption: "Placeholder: reemplace por dato real antes de publicar", type: "k", end: 17, accent: brand.red, note: "volumen" },
    { label: "formas de cobro", caption: "Links, botones, checkout y canales digitales", type: "plain", end: 4, accent: brand.blue, note: "opciones" },
    { label: "operación digital", caption: "Cobros online para vender sin depender de horarios", type: "day", end: 24, accent: brand.green, note: "disponible" },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(".trust-title-word", { y: 34, opacity: 0, rotateX: 8 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.7, stagger: 0.045, ease: "power3.out", scrollTrigger: { trigger: trustRef.current, start: "top 76%", once: true } });
      gsap.fromTo(".trust-card", { autoAlpha: 0, y: 54, scale: 0.965 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.75, stagger: 0.11, ease: "power3.out", scrollTrigger: { trigger: trustRef.current, start: "top 70%", once: true } });
      gsap.fromTo(".trust-orbit", { rotate: -7, y: 22 }, { rotate: 8, y: -18, ease: "none", scrollTrigger: { trigger: trustRef.current, start: "top bottom", end: "bottom top", scrub: 1.1 } });
    }, trustRef);
    return () => ctx.revert();
  }, []);

  return <section ref={trustRef} className="section-animate relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8"><div className="pointer-events-none absolute inset-x-0 top-8 h-64 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(237,28,39,.08),transparent_65%)] blur-3xl" /><div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start"><div className="rise relative lg:sticky lg:top-28"><SectionLabel>Confianza</SectionLabel><h2 className="text-balance text-5xl font-black leading-[0.96] tracking-[-0.05em] text-[#1D1D1D] sm:text-6xl">{"Señales claras antes de avanzar.".split(" ").map((word, index) => <span key={`${word}-${index}`} className="trust-title-word inline-block pr-[0.22em]">{word}</span>)}</h2><p className="mt-6 text-lg leading-8 text-[#5C5E60]">Menos ruido visual, más prueba: producto, métodos de cobro y una ruta simple para orientar mejor al usuario.</p><div className="trust-orbit mt-8 hidden rounded-[1.4rem] border border-[#1D1D1D]/10 bg-white/70 p-4 shadow-[0_18px_60px_rgba(29,29,29,.06)] backdrop-blur-xl lg:block"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#5C5E60]">lectura sugerida</p><p className="mt-2 text-sm font-bold leading-6 text-[#1D1D1D]">Datos visibles + contexto claro + interacción suave.</p></div></div><div className="rise grid gap-4">{metrics.map((metric, index) => <article key={metric.label} className="trust-card group relative overflow-hidden rounded-[1.8rem] border border-white/80 bg-white/92 p-6 shadow-[0_18px_55px_rgba(29,29,29,.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(29,29,29,.12)]"><div className="absolute inset-y-0 left-0 w-1.5 origin-top scale-y-0 transition duration-300 group-hover:scale-y-100" style={{ backgroundColor: metric.accent }} /><div className="absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-0 blur-3xl transition duration-500 group-hover:opacity-12" style={{ backgroundColor: metric.accent }} /><div className="relative grid gap-6 md:grid-cols-[.32fr_1fr_auto] md:items-center"><div><motion.p className="trust-number text-5xl font-black tracking-[-0.07em] text-[#1D1D1D] transition duration-300 group-hover:scale-[1.045] group-hover:text-[#ED1C27]" animate={isInView ? { scale: [1, 1.06, 1] } : { scale: 1 }} transition={{ duration: 0.55, delay: index * 0.12 }}><AnimatedNumber type={metric.type} end={metric.end} active={isInView} /></motion.p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#F2F2F2]"><motion.div className="h-full rounded-full" style={{ backgroundColor: metric.accent }} initial={{ width: "0%" }} animate={{ width: isInView ? "100%" : "0%" }} transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: "easeOut" }} /></div></div><div><p className="text-lg font-black tracking-[-0.025em] text-[#1D1D1D] transition duration-300 group-hover:translate-x-1">{metric.label}</p><p className="mt-2 text-sm leading-6 text-[#5C5E60] transition duration-300 group-hover:text-[#1D1D1D]">{metric.caption}</p></div><div className="flex items-center gap-3 md:flex-col md:items-end"><span className="rounded-full border border-[#1D1D1D]/10 bg-[#F2F2F2] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#5C5E60] transition duration-300 group-hover:bg-white" style={{ boxShadow: `0 12px 34px ${metric.accent}12` }}>{metric.note}</span><span className="text-sm font-black text-[#ED1C27]/45 transition duration-300 group-hover:text-[#ED1C27]">0{index + 1}</span></div></div></article>)}</div></div></section>;
}

function CommerceScrollShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(".commerce-title-word", { y: 34, opacity: 0, rotateX: 8 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.72, stagger: 0.035, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 72%", once: true } });
      gsap.fromTo(".commerce-track", { xPercent: -4 }, { xPercent: 4, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.1 } });
      gsap.utils.toArray<HTMLElement>(".commerce-wide-bullet").forEach((row, index) => {
        const directionX = index % 2 === 0 ? -120 : 120;
        const panel = row.querySelector<HTMLElement>(".commerce-wide-panel");
        const icon = row.querySelector<HTMLElement>(".commerce-row-icon");
        const indexMark = row.querySelector<HTMLElement>(".commerce-index-mark");
        const line = row.querySelector<HTMLElement>(".commerce-flow-line");
        const chips = row.querySelectorAll<HTMLElement>(".commerce-flow-chip");
        gsap.fromTo(row, { autoAlpha: 0, x: directionX, y: 92, scale: 0.94, rotateZ: index % 2 === 0 ? -1.4 : 1.4 }, { autoAlpha: 1, x: 0, y: 0, scale: 1, rotateZ: 0, ease: "none", scrollTrigger: { trigger: row, start: "top 94%", end: "center 50%", scrub: 0.75, onEnter: () => setActiveIndex(index), onEnterBack: () => setActiveIndex(index) } });
        gsap.to(row, { y: index % 2 === 0 ? -24 : -36, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: 1.05 } });
        if (panel) gsap.fromTo(panel, { x: index % 2 === 0 ? 74 : -74, opacity: 0.68, scale: 0.985 }, { x: 0, opacity: 1, scale: 1, ease: "none", scrollTrigger: { trigger: row, start: "top 86%", end: "bottom 38%", scrub: 0.85 } });
        if (icon) gsap.fromTo(icon, { rotate: index % 2 === 0 ? -10 : 10, scale: 0.9 }, { rotate: 0, scale: 1.08, ease: "none", scrollTrigger: { trigger: row, start: "top 88%", end: "center 48%", scrub: 0.55 } });
        if (indexMark) gsap.fromTo(indexMark, { y: 30, opacity: 0.08 }, { y: -16, opacity: 0.16, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: 0.9 } });
        if (line) gsap.fromTo(line, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: row, start: "top 80%", end: "center 48%", scrub: 0.7 } });
        if (chips.length) gsap.fromTo(chips, { y: 18, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, stagger: 0.06, ease: "power2.out", scrollTrigger: { trigger: row, start: "top 70%", toggleActions: "play none none reverse" } });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return <section ref={sectionRef} className="relative z-10 overflow-hidden bg-[#F7F7F8] py-32"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(237,28,39,.055),transparent_28%),radial-gradient(circle_at_92%_34%,rgba(0,130,196,.08),transparent_34%),linear-gradient(180deg,#FFFFFF_0%,#F7F7F8_48%,#FFFFFF_100%)]" /><div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(29,29,29,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(29,29,29,.03)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_74%)]" /><div className="commerce-track pointer-events-none absolute left-1/2 top-24 h-24 w-[140vw] -translate-x-1/2 rounded-full bg-[linear-gradient(90deg,transparent,rgba(237,28,39,.08),rgba(0,130,196,.08),transparent)] blur-2xl" /><div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="mb-14 grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-end"><div><SectionLabel>Comercios en movimiento</SectionLabel><h2 className="max-w-4xl text-balance text-4xl font-black leading-[.94] tracking-[-0.055em] text-[#1D1D1D] sm:text-6xl">{"Del canal de venta al cobro aprobado".split(" ").map((word, index) => <span key={`${word}-${index}`} className="commerce-title-word inline-block pr-[0.22em]">{word}</span>)}</h2></div><p className="max-w-2xl text-lg leading-8 text-[#5C5E60]">Lectura tipo franjas horizontales de ancho completo: cada comercio entra con movimiento direccional, profundidad y microflujo animado al hacer scroll hacia abajo o hacia arriba.</p></div></div><div className="relative left-1/2 w-screen -translate-x-1/2 space-y-5 px-4 sm:px-6 lg:px-8">{commerceStories.map((story, index) => { const Icon = story.icon; const isActive = index === activeIndex; return <button key={story.name} type="button" onClick={() => setActiveIndex(index)} className={`commerce-wide-bullet group relative block w-full overflow-hidden rounded-[1.65rem] border bg-white text-left shadow-[0_22px_80px_rgba(29,29,29,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_110px_rgba(29,29,29,.12)] ${isActive ? "border-[#1D1D1D]/18" : "border-[#1D1D1D]/8"}`}><div className="absolute inset-y-0 left-0 w-2" style={{ backgroundColor: story.accent }} /><div className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: story.accent }} /><div className="absolute -left-20 bottom-[-5rem] h-48 w-48 rounded-full opacity-0 blur-3xl transition duration-500 group-hover:opacity-10" style={{ backgroundColor: story.accent }} /><div className="relative mx-auto grid max-w-7xl gap-5 px-5 py-5 sm:px-7 lg:grid-cols-[.44fr_.56fr] lg:items-center lg:py-6"><div className="flex items-center gap-5"><div className="commerce-index-mark hidden text-6xl font-black tracking-[-0.08em] text-[#1D1D1D]/10 sm:block">0{index + 1}</div><div className="commerce-row-icon grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[#F2F2F2] text-[#1D1D1D] ring-1 ring-[#1D1D1D]/10 transition duration-300 group-hover:scale-105" style={{ boxShadow: isActive ? `0 18px 46px ${story.accent}22` : undefined }}><Icon className="h-7 w-7" /></div><div><p className="text-xs font-black uppercase tracking-[0.16em] text-[#ED1C27]">Caso de comercio</p><h3 className="mt-1 text-3xl font-black tracking-[-0.055em] text-[#1D1D1D] sm:text-4xl">{story.name}</h3><p className="mt-2 max-w-xl text-sm leading-6 text-[#5C5E60]">{story.proof}</p></div></div><div className="commerce-wide-panel grid gap-3 md:grid-cols-[.85fr_.7fr_.85fr]"><div className="rounded-2xl border border-[#1D1D1D]/10 bg-[#F2F2F2]/75 p-4"><p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#5C5E60]">Canal</p><p className="mt-2 text-lg font-black tracking-[-0.03em] text-[#1D1D1D]">{story.channel}</p></div><div className="rounded-2xl border border-[#1D1D1D]/10 bg-white p-4 shadow-sm"><p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#5C5E60]">Ticket</p><p className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#1D1D1D]">{story.ticket}</p></div><div className="rounded-2xl border border-[#1D1D1D]/10 bg-[#1D1D1D] p-4 text-white shadow-[0_16px_42px_rgba(29,29,29,.16)]"><p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/48">Método</p><div className="mt-2 flex items-center gap-2 text-lg font-black tracking-[-0.03em]"><Link2 className="h-5 w-5" style={{ color: story.accent }} />{story.method}</div></div><div className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-[#1D1D1D]/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between md:col-span-3"><div className="commerce-flow-line absolute left-4 right-4 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#1D1D1D]/18 to-transparent sm:block" /><div className="relative z-10 flex items-center gap-2 rounded-full bg-white pr-3 text-sm font-black text-[#1D1D1D]"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: story.accent }} />{story.result}</div><div className="relative z-10 grid grid-cols-4 gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-[#5C5E60] sm:min-w-[340px]">{["Inicio", "Cobro", "Pago", "OK"].map((step, stepIndex) => <span key={step} className="commerce-flow-chip rounded-full bg-[#F2F2F2] px-3 py-2 text-center"><span className="mr-1 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ backgroundColor: stepIndex === 3 ? story.accent : "rgba(29,29,29,.22)" }} />{step}</span>)}</div></div></div></div></button>; })}</div></section>;
}

function EvolutionConfidenceSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const [autoFilled, setAutoFilled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const frictionItems = ["Orientación según su etapa", "Enfoque en facilidad de uso", "Ruta pensada para empezar rápido", "Mejor entendimiento del lead"];
  const rightTitleWords = "No es solo registrarse. Es empezar con la solución correcta.".split(" ");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 58%",
        end: "bottom 42%",
        onEnter: () => {
          if (timerRef.current) window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => setAutoFilled(true), 4000);
        },
        onEnterBack: () => {
          if (timerRef.current) window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => setAutoFilled(true), 4000);
        },
        onLeave: () => {
          if (timerRef.current) window.clearTimeout(timerRef.current);
        },
        onLeaveBack: () => {
          if (timerRef.current) window.clearTimeout(timerRef.current);
          setAutoFilled(false);
        },
      });
    }, sectionRef);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="section-animate relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-8 h-72 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(237,28,39,.075),transparent_68%)] blur-3xl" />
      <div className="grid gap-7 lg:grid-cols-[1.08fr_.92fr]">
        <motion.article className="rise group relative min-h-[340px] overflow-hidden rounded-[2rem] bg-[#1D1D1D] p-8 text-white shadow-[0_24px_70px_rgba(29,29,29,.18)] transition duration-500 sm:p-10" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65, ease: "easeOut" }} whileHover={{ y: -6 }}>
          <div className="absolute left-0 top-0 h-full w-1.5 bg-[#ED1C27]" />
          <motion.div className="absolute -right-24 -top-20 h-64 w-64 rounded-full bg-[#ED1C27]/12 blur-3xl" animate={{ scale: [1, 1.14, 1], opacity: [0.62, 1, 0.62] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute -left-20 bottom-[-4rem] h-56 w-56 rounded-full bg-[#0082C4]/10 blur-3xl" animate={{ x: [0, 18, 0], y: [0, -10, 0] }} transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }} />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:34px_34px]" />
          <div className="relative z-10">
            <SectionLabel light>Ruta evolutiva</SectionLabel>
            <TypingHeadline text="Empiece simple hoy y evolucione cuando su negocio lo pida" />
            <motion.p className="mt-6 max-w-2xl text-lg leading-8 text-white/72 transition duration-300 group-hover:text-white/82" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.82 }}>
              Si hoy busca empezar a cobrar, validar su canal digital y vender sin fricción, Agregador es una ruta más natural. Más adelante podrá evaluar una estructura más robusta.
            </motion.p>
            <motion.div className="mt-8 flex flex-wrap gap-3" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.94 }}>
              {[["Empieza simple", "#ED1C27"], ["Escala con orden", "#0082C4"], ["Menos fricción", "#009056"]].map(([label, color], index) => <motion.span key={label} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/78 backdrop-blur transition duration-300 hover:bg-white/12" whileHover={{ y: -3, scale: 1.03 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}><motion.span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} animate={{ scale: [1, 1.35, 1] }} transition={{ duration: 1.8 + index * 0.25, repeat: Infinity, ease: "easeInOut" }} />{label}</motion.span>)}
            </motion.div>
          </div>
        </motion.article>

        <motion.article className="rise group relative min-h-[340px] overflow-hidden rounded-[2rem] border border-[#1D1D1D]/10 bg-white p-8 shadow-[0_18px_45px_rgba(29,29,29,.06)] transition duration-500 sm:p-10" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }} whileHover={{ y: -6 }}>
          <motion.div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#ED1C27]/8 blur-3xl" animate={{ scale: [1, 1.12, 1], opacity: [0.55, 1, 0.55] }} transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute -left-14 bottom-[-3rem] h-40 w-40 rounded-full bg-[#0082C4]/7 blur-3xl" animate={{ x: [0, 14, 0], y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
          <div className="relative z-10">
            <SectionLabel>Fricción reducida</SectionLabel>
            <h2 className="text-balance text-3xl font-black tracking-[-0.04em] text-[#1D1D1D] sm:text-[2.65rem] sm:leading-[0.97]">
              {rightTitleWords.map((word, index) => <motion.span key={`${word}-${index}`} className="inline-block pr-[0.22em]" initial={{ opacity: 0, y: 16, rotateX: 8 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true }} transition={{ duration: 0.42, delay: index * 0.02 }}>{word}</motion.span>)}
            </h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {frictionItems.map((item, index) => {
                const isFilled = autoFilled || hoveredIndex === index;
                return (
                  <motion.div key={item} className="group/item relative overflow-hidden rounded-[1.1rem] border border-[#1D1D1D]/8 bg-[#F2F2F2] p-4 shadow-[0_8px_18px_rgba(29,29,29,.03)] transition duration-300 hover:bg-white hover:shadow-[0_20px_40px_rgba(29,29,29,.08)]" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.42, delay: 0.12 + index * 0.05 }} whileHover={{ y: -4 }} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                    <div className={`absolute inset-y-0 left-0 w-1 origin-top bg-[#009056] transition duration-300 ${isFilled ? "scale-y-100" : "scale-y-0 group-hover/item:scale-y-100"}`} />
                    <div className="flex items-start gap-3">
                      <motion.div className={`relative mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full shadow-sm ring-1 transition-colors duration-300 ${isFilled ? "bg-[#009056] text-white ring-[#009056]/35" : "bg-white text-[#009056] ring-[#009056]/12 group-hover/item:bg-[#009056] group-hover/item:text-white"}`} animate={isFilled ? { scale: [1, 1.12, 1], rotate: [0, 8, 0] } : { scale: 1, rotate: 0 }} transition={{ duration: 0.42, ease: "easeOut" }}>
                        <motion.span className={`absolute inset-0 rounded-full transition-colors duration-300 ${isFilled ? "bg-[#009056]/22" : "bg-[#009056]/10"}`} animate={isFilled ? { scale: [1, 1.32, 1], opacity: [0.55, 0.18, 0.55] } : { scale: [1, 1.16, 1] }} transition={{ duration: isFilled ? 1.3 : 2.2, repeat: Infinity, ease: "easeInOut" }} />
                        <Check className="relative z-10 h-4 w-4 stroke-[3]" />
                      </motion.div>
                      <motion.p className="text-sm font-black leading-6 text-[#1D1D1D] transition duration-300 group-hover/item:translate-x-1">{item}</motion.p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <motion.div className="mt-6 rounded-[1rem] border border-[#1D1D1D]/8 bg-[#F8F8F8] px-4 py-3 text-sm font-medium leading-6 text-[#5C5E60]" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.28 }}>
              La experiencia reduce el ruido: primero orienta, luego activa la herramienta correcta.
            </motion.div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}

function categoryAccent(category: EcosystemCategory) { return ecosystemMeta[category].accent; }
function safeAccent(color: string) { return color === brand.light || color === brand.yellow ? brand.red : color; }
function ProductImage({ product, className = "" }: { product: EcosystemProduct; className?: string }) { return <img src={product.image} alt={product.alt || product.name} loading="lazy" draggable="false" className={className} />; }
function EcosystemCategoryChip({ category, active, onClick }: { category: EcosystemCategory; active: boolean; onClick: () => void }) { const accent = categoryAccent(category); return <button type="button" aria-pressed={active} onClick={onClick} className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-black transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0082C4]/40 ${active ? "border-[#1D1D1D]/10 bg-white text-[#1D1D1D] shadow-[0_14px_34px_rgba(29,29,29,.10)]" : "border-[#1D1D1D]/10 bg-[#F2F2F2]/70 text-[#5C5E60] hover:-translate-y-0.5 hover:bg-white hover:text-[#1D1D1D]"}`}><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />{category}</button>; }

function ProductPillar({ product, index, isActive, isMuted, onActivate }: { product: EcosystemProduct; index: number; isActive: boolean; isMuted: boolean; onActivate: () => void }) {
  const item = pillarLayout[index] ?? { x: 50, h: 50, z: 1 };
  const glowColor = safeAccent(product.color);
  return <motion.button type="button" aria-label={`Explorar ${product.name}`} title={`${index + 1}. ${product.name}`} onMouseEnter={onActivate} onFocus={onActivate} onClick={onActivate} initial={{ opacity: 0, y: 100, scaleY: 0.78 }} whileInView={{ opacity: 1, y: 0, scaleY: 1 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.58, delay: index * 0.018, ease: [0.22, 1, 0.36, 1] }} className={`group absolute bottom-0 w-[7.35%] min-w-[42px] max-w-[68px] origin-bottom rounded-t-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${isMuted ? "opacity-25 grayscale" : "opacity-100"}`} style={{ left: `${item.x}%`, height: `${item.h}%`, zIndex: item.z }}><span className={`absolute inset-0 overflow-hidden rounded-t-full border-x border-white/[0.04] bg-[linear-gradient(90deg,#060708_0%,#14161b_18%,#3c3f47_50%,#1c1f25_76%,#060708_100%)] shadow-[inset_10px_0_18px_rgba(255,255,255,.06),inset_-14px_0_20px_rgba(0,0,0,.58),0_18px_32px_rgba(0,0,0,.24)] transition duration-300 ${isActive ? "brightness-110 saturate-125" : ""}`}><span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.085),transparent)] opacity-70" /><span className="absolute inset-0 opacity-45 transition duration-300 group-hover:opacity-70" style={{ background: `linear-gradient(180deg, ${glowColor}24, transparent 48%, rgba(0,0,0,.24))` }} /><span className="absolute inset-x-0 bottom-0 h-14 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.18)_26%,rgba(0,0,0,.56)_68%,rgba(0,0,0,.82)_100%)]" /></span><motion.span animate={{ y: isActive ? -8 : 0, scale: isActive ? 1.04 : 1 }} transition={{ type: "spring", stiffness: 250, damping: 21 }} className="absolute left-1/2 top-0 grid aspect-square w-[clamp(40px,4.7vw,64px)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/55 bg-white text-[#171717] shadow-[0_10px_30px_rgba(0,0,0,.28)]"><span aria-hidden="true" className={`absolute inset-[-6px] rounded-full blur-md transition duration-300 ${isActive ? "opacity-55" : "opacity-24 group-hover:opacity-45"}`} style={{ backgroundColor: glowColor }} /><span className="absolute inset-[4px] rounded-full bg-[radial-gradient(circle_at_40%_28%,#fff_0%,#fff_38%,#e7e7e7_100%)]" /><ProductImage product={product} className="relative z-10 h-[66%] w-[66%] object-contain" /></motion.span></motion.button>;
}

function EcosystemDetail({ product, onNext }: { product: EcosystemProduct; onNext: () => void }) {
  const accent = safeAccent(product.color);
  return <motion.aside key={product.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, ease: "easeOut" }} className="relative overflow-hidden rounded-[2rem] border border-[#1D1D1D]/10 bg-white p-6 text-[#1D1D1D] shadow-[0_24px_90px_rgba(29,29,29,.10)] lg:min-h-[560px]"><div className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: accent }} /><div className="absolute left-0 top-0 h-full w-1.5" style={{ backgroundColor: accent }} /><div className="relative z-10 flex h-full flex-col"><div className="mb-7 flex items-center justify-between gap-4"><span className="inline-flex items-center gap-2 rounded-full border border-[#1D1D1D]/10 bg-[#F2F2F2] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#5C5E60]"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />{product.category}</span><span className="rounded-full border border-[#1D1D1D]/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#5C5E60] shadow-sm">{product.metric}</span></div><div className="mb-7 flex items-start gap-5"><div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-[1.55rem] bg-white shadow-[0_18px_42px_rgba(29,29,29,.12)] ring-1 ring-[#1D1D1D]/10"><span className="absolute inset-[-10px] rounded-[1.8rem] opacity-16 blur-xl" style={{ backgroundColor: accent }} /><ProductImage product={product} className="relative z-10 h-[64%] w-[64%] object-contain" /></div><div><p className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#5C5E60]"><BadgeCheck className="h-4 w-4" /> Solución del ecosistema</p><h3 className="text-[clamp(2.1rem,4vw,3.9rem)] font-black leading-[.92] tracking-[-0.06em] text-[#1D1D1D]">{product.name}</h3></div></div><p className="max-w-md text-base leading-8 text-[#5C5E60]">{product.description}</p><div className="mt-5 rounded-[1.4rem] border border-[#1D1D1D]/10 bg-[#F2F2F2]/70 p-4"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#5C5E60]">Qué gana su negocio</p><p className="mt-2 text-sm leading-7 text-[#5C5E60]">{product.benefit}</p></div><div className="mt-5 grid grid-cols-2 gap-4"><div className="rounded-[1.35rem] border border-[#1D1D1D]/10 bg-white p-4 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#5C5E60]">Uso</p><p className="mt-3 text-xl font-black tracking-[-0.04em] text-[#1D1D1D]">{product.metric}</p></div><div className="rounded-[1.35rem] border border-[#1D1D1D]/10 bg-white p-4 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#5C5E60]">Ruta</p><p className="mt-3 text-xl font-black tracking-[-0.04em] text-[#1D1D1D]">{ecosystemMeta[product.category].intent}</p></div></div><div className="mt-auto pt-7"><div className="mb-4 flex items-center gap-2 rounded-full border border-[#1D1D1D]/10 bg-[#F2F2F2]/70 px-4 py-3 text-xs font-bold text-[#5C5E60]"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />Explore el producto o avance al siguiente pilar del ecosistema.</div><div className="flex flex-col gap-3 sm:flex-row"><a href={product.url} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-black text-white shadow-[0_16px_34px_rgba(29,29,29,.16)] transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0082C4]/40" style={{ backgroundColor: accent }}>{product.cta}<ArrowRight className="h-4 w-4" /></a><button type="button" onClick={onNext} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#1D1D1D]/10 bg-white px-5 text-sm font-black text-[#1D1D1D] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#F2F2F2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0082C4]/40">Siguiente<ArrowRight className="h-4 w-4" /></button></div></div></div></motion.aside>;
}

function PaymentCarousel() {
  const checkoutIndex = ecosystemProducts.findIndex((item) => item.name === "Checkout");
  const [activeCategory, setActiveCategory] = useState<EcosystemCategory>("Todos");
  const [activeIndex, setActiveIndex] = useState(checkoutIndex >= 0 ? checkoutIndex : 0);
  const filteredProducts = useMemo(() => activeCategory === "Todos" ? ecosystemProducts : ecosystemProducts.filter((product) => product.category === activeCategory), [activeCategory]);
  const activeProduct = ecosystemProducts[activeIndex] ?? ecosystemProducts[0];
  const activeMeta = ecosystemMeta[activeCategory];
  function handleCategory(category: EcosystemCategory) { setActiveCategory(category); if (category === "Todos") return; const nextIndex = ecosystemProducts.findIndex((item) => item.category === category); if (nextIndex >= 0) setActiveIndex(nextIndex); }
  function handleNext() { const pool = activeCategory === "Todos" ? ecosystemProducts : filteredProducts; if (!pool.length) return; const currentInPool = pool.findIndex((item) => item.name === activeProduct.name); const next = pool[(Math.max(currentInPool, 0) + 1) % pool.length]; if (!next) return; const nextIndex = ecosystemProducts.findIndex((item) => item.name === next.name); if (nextIndex >= 0) setActiveIndex(nextIndex); }
  return <section id="formas" className="section-animate relative z-10 overflow-hidden bg-[#F2F2F2] px-4 py-28 sm:px-6 lg:px-8"><div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] border border-[#1D1D1D]/10 bg-white p-5 text-[#1D1D1D] shadow-[0_34px_110px_rgba(29,29,29,.12)] md:p-8 lg:p-10"><div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#ED1C27]/8 blur-3xl" /><div className="pointer-events-none absolute -left-28 bottom-0 h-80 w-80 rounded-full bg-[#0082C4]/7 blur-3xl" /><div className="pointer-events-none absolute inset-0 opacity-[0.4] [background-image:linear-gradient(rgba(29,29,29,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(29,29,29,.03)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(circle_at_center,black,transparent_76%)]" /><div className="relative z-10"><div className="rise mb-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><SectionLabel>Ecosistema ePayco</SectionLabel><h2 className="max-w-4xl text-balance text-4xl font-black leading-[0.94] tracking-[-0.055em] text-[#1D1D1D] md:text-6xl">Encuentre la solución de pago ideal para su negocio</h2><p className="mt-5 max-w-2xl text-base leading-7 text-[#5C5E60] md:text-lg">Explore los pilares del ecosistema ePayco por necesidad: cobrar, vender, operar o automatizar sin salir de la misma experiencia.</p></div><div className="flex flex-wrap gap-2 lg:max-w-xl lg:justify-end" aria-label="Filtrar productos ePayco">{ecosystemCategories.map((category) => <EcosystemCategoryChip key={category} category={category} active={activeCategory === category} onClick={() => handleCategory(category)} />)}</div></div><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_410px] xl:grid-cols-[minmax(0,1fr)_440px]"><div className="rise relative overflow-hidden rounded-[2rem] border border-[#1D1D1D]/10 bg-[#F2F2F2]/70 p-5 shadow-[0_22px_70px_rgba(29,29,29,.08)] sm:p-7"><div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,.72),transparent_38%,rgba(255,255,255,.36))]" /><div className="relative z-10 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#1D1D1D]/10 bg-white text-[#1D1D1D] shadow-sm"><Globe2 className="h-5 w-5" /></div><div><h3 className="text-2xl font-black tracking-[-0.04em] text-[#1D1D1D]">{activeMeta.label}</h3><p className="mt-1 max-w-xl text-sm leading-6 text-[#5C5E60]">{activeMeta.description}</p></div></div><span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#1D1D1D]/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#5C5E60] shadow-sm">{filteredProducts.length} soluciones</span></div><div className="relative z-10 h-[560px] overflow-visible rounded-[1.75rem] border border-[#1D1D1D]/10 bg-[linear-gradient(135deg,#101216_0%,#1A1D23_24%,#4F5258_58%,#24272D_78%,#16191F_100%)] p-[1px] shadow-[inset_0_1px_0_rgba(255,255,255,.10)] sm:h-[620px]"><div className="relative h-full overflow-visible rounded-[calc(1.75rem-1px)] bg-[linear-gradient(135deg,#0E1116_0%,#181C22_22%,#4D5056_52%,#252930_72%,#171A20_100%)]"><div className="pointer-events-none absolute inset-0 rounded-[calc(1.75rem-1px)] bg-[radial-gradient(circle_at_88%_10%,rgba(255,255,255,.20),transparent_22%),radial-gradient(circle_at_15%_88%,rgba(255,255,255,.10),transparent_24%),linear-gradient(135deg,#0E1116_0%,#1A1D23_24%,#50545A_55%,#252930_76%,#171A20_100%)]" /><div className="pointer-events-none absolute inset-[1px] rounded-[calc(1.75rem-2px)] border border-white/[0.06]" /><div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.022)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" /><div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 rounded-b-[calc(1.75rem-1px)] bg-[linear-gradient(180deg,rgba(8,10,14,0)_0%,rgba(8,10,14,.16)_20%,rgba(8,10,14,.42)_48%,rgba(8,10,14,.72)_72%,rgba(8,10,14,.92)_100%)]" /><div className="pointer-events-none absolute inset-x-10 bottom-0 h-24 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,.55),rgba(0,0,0,.14)_48%,transparent_76%)] blur-2xl" /><div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,.06),transparent)]" /><div className="absolute inset-x-0 bottom-0 top-10 mx-auto max-w-[940px] [mask-image:linear-gradient(to_bottom,black_0%,black_84%,rgba(0,0,0,.92)_91%,rgba(0,0,0,.75)_96%,transparent_100%)]">{ecosystemProducts.map((product, index) => { const matches = activeCategory === "Todos" || product.category === activeCategory; const isActive = product.name === activeProduct.name; return <ProductPillar key={product.name} product={product} index={index} isActive={isActive} isMuted={!matches || (!isActive && activeCategory !== "Todos")} onActivate={() => setActiveIndex(index)} />; })}</div></div></div></div><EcosystemDetail product={activeProduct} onNext={handleNext} /></div></div></div></section>;
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return <div className="rounded-xl border border-[#1D1D1D]/10 bg-white p-5 shadow-[0_6px_20px_rgba(29,29,29,.045)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(29,29,29,.08)]"><button type="button" onClick={() => setOpen((current) => !current)} className="flex w-full items-center justify-between gap-4 text-left" aria-expanded={open}><span className="text-base font-black tracking-[-0.02em] text-[#1D1D1D]">{question}</span><span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#F2F2F2] text-[#ED1C27]"><ChevronDown className={`h-5 w-5 transition ${open ? "rotate-180" : ""}`} /></span></button><div className={`grid transition-all duration-300 ${open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}><p className="overflow-hidden text-sm leading-7 text-[#5C5E60]">{answer}</p></div></div>;
}

function AngledSection({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <section className={`relative z-10 overflow-hidden ${className}`}><div className="absolute inset-x-0 top-0 h-24 -skew-y-2 bg-inherit origin-top-left" />{children}</section>; }

export default function EpaycoAgregadorLanding() {
  const rootRef = useRef<HTMLElement | null>(null);
  const headline = "Empiece a recibir pagos online y dele nivel a su negocio".split(" ");
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".hero-word", { opacity: 0, y: 30, duration: 0.72, ease: "power3.out", stagger: 0.035 });
      gsap.from(".hero-soft", { opacity: 0, y: 18, duration: 0.75, delay: 0.2, ease: "power3.out", stagger: 0.08 });
      gsap.utils.toArray<HTMLElement>(".section-animate").forEach((section) => {
        const items = section.querySelectorAll<HTMLElement>(".rise");
        if (!items.length) return;
        gsap.fromTo(items, { opacity: 0.001, y: 34 }, { opacity: 1, y: 0, duration: 0.72, ease: "power3.out", stagger: 0.055, clearProps: "transform,opacity,visibility", scrollTrigger: { trigger: section, start: "top 88%", once: true } });
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return <main ref={rootRef} className="relative min-h-screen overflow-x-hidden bg-[#F2F2F2] font-[Davivienda,Inter,system-ui,sans-serif] text-[#1D1D1D] selection:bg-[#ED1C27] selection:text-white"><div className="pointer-events-none fixed inset-0 z-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(#1D1D1D 1px, transparent 1px)", backgroundSize: "18px 18px" }} /><PageBackground /><header className="sticky top-0 z-50 bg-white/84 shadow-[0_1px_0_rgba(29,29,29,.08)] backdrop-blur-xl"><nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Navegación principal"><a href="#inicio" aria-label="Ir al inicio"><BrandWordmark /></a><div className="hidden items-center gap-7 text-sm font-bold text-[#5C5E60] md:flex"><a href="#formas" className="transition hover:text-[#ED1C27]">Ecosistema</a><a href="#como-funciona" className="transition hover:text-[#ED1C27]">Cómo funciona</a><a href="#faq" className="transition hover:text-[#ED1C27]">FAQs</a></div><Button className="hidden md:inline-flex">Empezar ahora</Button></nav></header><section id="inicio" className="relative z-10 px-4 pb-20 pt-10 sm:px-6 lg:px-8"><div className="relative mx-auto grid min-h-[82vh] max-w-7xl items-center gap-12 overflow-hidden rounded-[2.25rem] bg-[#1D1D1D] p-6 text-white shadow-[0_36px_120px_rgba(29,29,29,.22)] sm:p-10 lg:grid-cols-[.92fr_1.08fr] lg:p-14"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(237,28,39,.18),transparent_28%),radial-gradient(circle_at_84%_76%,rgba(0,130,196,.13),transparent_34%)]" /><div className="pointer-events-none absolute -right-24 -top-16 h-72 w-[44rem] rotate-[-8deg] rounded-[3rem] bg-white/[0.035]" /><div className="relative"><div className="hero-soft mb-6 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/75 ring-1 ring-white/15"><Zap className="h-4 w-4 text-[#FFE11B]" /> Empiece a cobrar online con menos fricción</div><h1 className="max-w-4xl text-balance text-5xl font-black leading-[0.92] tracking-[-0.052em] text-white sm:text-6xl lg:text-7xl">{headline.map((word, index) => <span key={`${word}-${index}`} className="hero-word inline-block pr-[0.22em]">{word}</span>)}</h1><p className="hero-soft mt-7 max-w-2xl text-lg leading-8 text-white/66">Con ePayco Agregador usted puede activar cobros por internet con una ruta simple, clara y pensada para negocios que venden por web, redes sociales, WhatsApp o checkout.</p><div className="hero-soft mt-9 flex flex-col gap-3 sm:flex-row"><Button>Quiero empezar con Agregador</Button><Button variant="light" href="#formas">Ver ecosistema</Button></div><PremiumProofRail /></div><div className="relative"><div className="absolute -left-4 top-8 z-20 hidden rounded-2xl border border-white/10 bg-white/[0.08] p-4 text-white backdrop-blur-xl lg:block"><p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/45">flujo</p><p className="mt-2 max-w-[12rem] text-sm font-bold leading-5">chat → link → pago aprobado</p></div><ProductProof /></div></div></section><section className="section-animate relative z-10 mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8"><div className="relative overflow-hidden rounded-[1.6rem] border border-[#1D1D1D]/10 bg-white/88 p-3 text-[#1D1D1D] shadow-[0_22px_70px_rgba(29,29,29,.10)] backdrop-blur-xl"><div className="absolute left-0 top-0 h-full w-1 bg-[#ED1C27]" /><div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{benefits.map((benefit) => <div key={benefit} className="rise flex items-center gap-3 rounded-xl bg-[#F2F2F2]/80 p-4 ring-1 ring-[#1D1D1D]/8"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white text-[#ED1C27] shadow-sm"><Check className="h-4 w-4" /></div><p className="text-sm font-bold leading-5">{benefit}</p></div>)}</div></div></section><AnimatedTrustSection /><CommerceScrollShowcase /><PaymentCarousel /><AngledSection id="como-funciona" className="section-animate relative overflow-hidden bg-[#1D1D1D] py-32 text-white"><div className="pointer-events-none absolute -left-32 top-8 h-[32rem] w-[32rem] rounded-full bg-[#ED1C27]/14 blur-3xl" /><div className="pointer-events-none absolute -right-28 bottom-0 h-[34rem] w-[34rem] rounded-full bg-[#0082C4]/14 blur-3xl" /><div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="rise max-w-3xl"><SectionLabel light>Cómo funciona</SectionLabel><h2 className="text-balance text-4xl font-black tracking-[-0.035em] sm:text-5xl">Un flujo claro para empezar sin perderse</h2></div><div className="rise mt-12 h-px w-full bg-gradient-to-r from-transparent via-white/22 to-transparent" /><div className="mt-16 grid gap-5 lg:grid-cols-4">{workflow.map(([num, title, text]) => <div key={num} className="rise relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-[0_20px_80px_rgba(0,0,0,.18)] transition duration-500 hover:-translate-y-2 hover:bg-white/[0.09]"><p className="text-5xl font-black tracking-[-0.03em] text-[#FFE11B]">{num}</p><h3 className="mt-9 text-lg font-black tracking-[-0.02em]">{title}</h3><p className="mt-3 text-sm leading-6 text-white/60">{text}</p></div>)}</div></div></AngledSection><EvolutionConfidenceSection /><section id="faq" className="section-animate relative z-10 mx-auto max-w-5xl px-4 py-28 sm:px-6 lg:px-8"><div className="rise text-center"><SectionLabel>Preguntas frecuentes</SectionLabel><h2 className="text-balance text-4xl font-black tracking-[-0.035em] text-[#1D1D1D] sm:text-5xl">Respuestas antes de avanzar</h2></div><div className="mt-10 grid gap-3">{faqs.map(([question, answer], index) => <FAQItem key={question} question={question} answer={answer} index={index} />)}</div></section><section id="cta-final" className="relative z-10 px-4 pb-16 sm:px-6 lg:px-8"><div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.4rem] border border-white/10 bg-[#1D1D1D] p-10 text-white shadow-[0_40px_140px_rgba(29,29,29,.28)] sm:p-14 lg:p-20"><div className="absolute left-0 top-0 h-full w-1.5 bg-[#ED1C27]" /><div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_.85fr]"><div><p className="mb-5 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-white/70"><ExternalLink className="h-3.5 w-3.5" /> Empezar</p><h2 className="text-balance text-4xl font-black tracking-[-0.035em] sm:text-5xl">Empiece a cobrar online con una solución simple, rápida y hecha para vender</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-white/64">Déjenos sus datos y le ayudamos a empezar con la ruta correcta para su negocio.</p></div><div className="flex flex-col gap-3 sm:flex-row lg:flex-col"><Button href="#cta-final" className="w-full">Empezar con Agregador</Button><Button href="#cta-final" variant="light" className="w-full">Hablar con un asesor</Button></div></div></div></section><footer className="relative z-10 border-t border-[#1D1D1D]/10 bg-white px-4 py-8 text-center text-sm font-semibold text-[#5C5E60] sm:px-6 lg:px-8">SEO sugerido: /agregador-de-pagos-colombia · Meta title: Agregador de pagos para vender online en Colombia | ePayco</footer><style>{`.hero-word,.hero-soft,.rise,.commerce-title-word,.commerce-wide-bullet,.commerce-wide-panel{transform:translateZ(0)}@media(prefers-reduced-motion:reduce){.hero-word,.hero-soft,.rise,.commerce-title-word,.commerce-wide-bullet,.commerce-wide-panel{opacity:1!important;transform:none!important}}`}</style></main>;
}
