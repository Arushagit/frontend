const services = [
  {
    icon: 'insights',
    title: 'Strategic Planning',
    description: 'Long-term roadmaps to navigate complex market shifts and ensure competitive dominance.',
  },
  {
    icon: 'analytics',
    title: 'Market Analysis',
    description: 'Data-driven insights to identify emerging opportunities and mitigate potential risks.',
  },
  {
    icon: 'account_balance',
    title: 'Financial Advisory',
    description: 'Optimizing capital structure and financial operations for maximum enterprise value.',
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h2 className="text-headline-lg md:text-[44px] font-semibold text-primary mb-4 leading-tight">
            Our Specialized Services
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Tailored strategies designed for modern markets and sustainable operational efficiency.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {services.map(({ icon, title, description }) => (
            <div
              key={title}
              className="bg-white p-10 rounded-2xl card-shadow border border-slate-100 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-14 h-14 bg-primary-container rounded-xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-white text-3xl">{icon}</span>
              </div>
              <h3 className="text-headline-md text-primary mb-4">{title}</h3>
              <p className="text-body-md text-on-surface-variant mb-6">{description}</p>
              <a
                href="#"
                className="inline-flex items-center text-secondary text-label-md gap-2 hover:gap-3 transition-all"
              >
                Learn More{' '}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
