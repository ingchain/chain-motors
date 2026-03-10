const services = [
  {
    key: "lavadero",
    name: "Lavadero Express",
    desc: "Limpieza premium de alto brillo en menos de 40 minutos."
  },
  {
    key: "mecanica",
    name: "Mecanica",
    desc: "Diagnostico avanzado y ajuste de rendimiento certificado."
  },
  {
    key: "tuning",
    name: "Tuning",
    desc: "Configuraciones de potencia y estilo con enfoque futurista."
  }
];

export default function ServiceCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {services.map((service) => (
        <article key={service.key} className="neon-border rounded-xl bg-chain-900/35 p-5 transition hover:scale-[1.01]">
          <h3 className="font-display text-lg uppercase tracking-wider text-chain-200">{service.name}</h3>
          <p className="mt-2 text-sm text-chain-100/85">{service.desc}</p>
        </article>
      ))}
    </div>
  );
}
