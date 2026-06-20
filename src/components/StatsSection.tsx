const stats = [
  { value: '500+', label: 'Global Clients', highlight: false },
  { value: '98%', label: 'Success Rate', highlight: true },
  { value: '15+', label: 'Years Expertise', highlight: false },
  { value: '$2B+', label: 'Value Created', highlight: false },
];

export default function StatsSection() {
  return (
    <section className="py-12 md:py-20 bg-surface">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {stats.map(({ value, label, highlight }) =>
            highlight ? (
              <div
                key={label}
                className="p-10 bg-primary-container text-white rounded-xl text-center shadow-xl"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{value}</div>
                <div className="text-label-md opacity-80">{label}</div>
              </div>
            ) : (
              <div
                key={label}
                className="p-10 bg-surface-container-low rounded-xl border border-outline-variant/30 text-center"
              >
                <div className="text-secondary text-4xl md:text-5xl font-bold mb-2">{value}</div>
                <div className="text-label-md text-on-surface-variant">{label}</div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
