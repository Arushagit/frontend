const focusFeatures = [
  { text: 'Quarterly Strategic Review', included: true },
  { text: 'Bi-weekly Progress Calls', included: true },
  { text: 'Market Performance Dashboard', included: true },
  { text: 'On-site Integration', included: false },
];

const accelerateFeatures = [
  { text: 'Monthly Strategic Alignment' },
  { text: 'Unlimited Priority Advisory' },
  { text: 'Full Competitive Intelligence' },
  { text: 'On-site Executive Workshop' },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-16">
          <h2 className="text-headline-lg md:text-[44px] font-semibold text-primary mb-4 leading-tight">
            Investment for Growth
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Transparent engagement models for every stage of your business journey.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter max-w-5xl mx-auto">
          {/* Focus Package */}
          <div className="bg-white p-12 rounded-2xl border border-outline-variant/30 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <span className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-4">Focus Package</span>
            <div className="flex items-baseline mb-8">
              <span className="text-5xl font-bold text-primary">$4,900</span>
              <span className="text-on-surface-variant ml-2">/ month</span>
            </div>
            <ul className="space-y-4 mb-12 text-left w-full">
              {focusFeatures.map(({ text, included }) => (
                <li key={text} className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${included ? 'text-secondary' : 'text-outline'}`}>
                    {included ? 'check_circle' : 'cancel'}
                  </span>
                  <span className={`text-on-surface-variant ${!included ? 'line-through opacity-50' : ''}`}>
                    {text}
                  </span>
                </li>
              ))}
            </ul>
            <button className="w-full py-4 border-2 border-primary text-primary text-label-md rounded-lg hover:bg-primary hover:text-white transition-all mt-auto">
              Select Standard
            </button>
          </div>

          {/* Accelerate Package */}
          <div className="bg-primary-container p-12 rounded-2xl shadow-2xl relative flex flex-col items-center text-center overflow-hidden">
            <div className="absolute top-0 right-0 bg-secondary text-white px-6 py-2 text-label-sm rounded-bl-lg">
              MOST POPULAR
            </div>
            <span className="text-label-sm text-white/60 uppercase tracking-widest mb-4">Accelerate Package</span>
            <div className="flex items-baseline mb-8">
              <span className="text-5xl font-bold text-white">$9,500</span>
              <span className="text-white/60 ml-2">/ month</span>
            </div>
            <ul className="space-y-4 mb-12 text-left w-full">
              {accelerateFeatures.map(({ text }) => (
                <li key={text} className="flex items-center gap-3 text-white">
                  <span className="material-symbols-outlined text-secondary-container">check_circle</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-4 bg-secondary text-white text-label-md rounded-lg shadow-lg shadow-secondary/30 active:scale-95 transition-all mt-auto">
              Select Premium
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
