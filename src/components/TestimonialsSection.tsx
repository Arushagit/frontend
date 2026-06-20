const testimonials = [
  {
    quote:
      '"ExpertiseCo didn\'t just provide a report; they delivered a transformation. Our operational efficiency increased by 40% within six months of implementing their strategic roadmap."',
    name: 'Sarah Jenkins',
    title: 'CEO, TechFlow Systems',
    avatar: '/testimonial-sarah.webp',
    dark: false,
  },
  {
    quote:
      '"The depth of their market analysis was staggering. They identified a niche market segment that has now become our primary revenue driver. A truly expert team."',
    name: 'David Chen',
    title: 'Managing Director, Global Logistics Corp',
    avatar: '/testimonial-david.webp',
    dark: true,
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-surface overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-headline-lg md:text-[44px] font-semibold text-primary mb-4 leading-tight">
              Trusted by Industry Leaders
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Hear from the executives and entrepreneurs who have scaled their operations with our guidance.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              className="w-12 h-12 rounded-full border border-outline flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              aria-label="Previous"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              className="w-12 h-12 rounded-full border border-outline flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              aria-label="Next"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          {testimonials.map(({ quote, name, title, avatar, dark }) => (
            <div
              key={name}
              className={`p-10 rounded-2xl relative ${
                dark
                  ? 'bg-primary-container text-white shadow-xl'
                  : 'bg-surface-container-high'
              }`}
            >
              <span
                className={`material-symbols-outlined text-8xl absolute top-6 right-6 ${
                  dark ? 'text-white/5' : 'text-primary/10'
                }`}
              >
                format_quote
              </span>
              <p
                className={`text-body-lg italic relative z-10 mb-8 leading-relaxed ${
                  dark ? 'text-white/90' : 'text-on-surface'
                }`}
              >
                {quote}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                  <img src={avatar} alt={name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className={`text-label-md ${dark ? 'text-white' : 'text-primary'}`}>{name}</div>
                  <div className={`text-sm ${dark ? 'opacity-70' : 'text-on-surface-variant'}`}>{title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
