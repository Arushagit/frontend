import { useState } from 'react';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm h-[72px]">
      <div className="flex justify-between items-center h-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex items-center gap-12">
          <h1 className="text-headline-md font-bold text-primary tracking-tight">ExpertiseCo</h1>
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-label-md text-on-surface-variant hover:text-primary transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden material-symbols-outlined text-primary text-2xl"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? 'close' : 'menu'}
          </button>
          <a
            href="#contact"
            className="bg-secondary text-on-secondary px-6 py-2 rounded-lg text-label-md hover:opacity-90 active:scale-95 transition-all"
          >
            Get Started
          </a>
        </div>
      </div>
      {mobileOpen && (
        <div className="lg:hidden bg-surface border-b border-outline-variant/30 px-margin-mobile py-4 flex flex-col gap-4">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-label-md text-on-surface-variant hover:text-primary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
