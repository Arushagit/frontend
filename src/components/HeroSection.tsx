export default function HeroSection() {
  return (
    <section className="relative px-margin-mobile md:px-margin-desktop py-16 md:py-32 overflow-hidden bg-surface">
      <div className="max-w-container-max mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="w-full lg:w-1/2 z-10 text-center lg:text-left">
          <span className="inline-block px-3 py-1 rounded bg-on-tertiary-fixed-variant/10 text-on-tertiary-fixed-variant text-label-sm mb-4">
            STRATEGIC EXCELLENCE
          </span>
          <h2 className="text-headline-lg-mobile md:text-display-lg text-primary mb-6 leading-tight">
            Accelerate Your Business Growth
          </h2>
          <p className="text-body-lg text-on-surface-variant mb-10 max-w-lg mx-auto lg:mx-0">
            We partner with ambitious organizations to solve complex challenges and unlock sustainable high-performance value.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="bg-secondary text-on-secondary px-8 py-4 rounded-lg text-label-md text-lg active:scale-95 transition-all shadow-lg shadow-secondary/20">
              Get Started
            </button>
            <button className="border-2 border-primary text-primary px-8 py-4 rounded-lg text-label-md text-lg hover:bg-primary/5 transition-all">
              View Services
            </button>
          </div>
        </div>
        <div className="w-full lg:w-1/2 relative">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl z-10">
            <img
              src="/hero-consulting.webp"
              alt="Professional business consulting team in a modern boardroom"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary-container/20 rounded-full blur-3xl" />
          <div className="absolute -top-6 -right-6 w-48 h-48 bg-primary-container/10 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
}
