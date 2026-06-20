const serviceLinks = ['Strategic Planning', 'Market Analysis', 'Financial Advisory', 'Operations'];
const companyLinks = ['About Us', 'Case Studies', 'Insights', 'Careers'];
const legalLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Policy'];

export default function Footer() {
  return (
    <footer className="bg-primary-container w-full">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="col-span-1">
            <h2 className="text-headline-md font-bold text-white mb-6">ExpertiseCo</h2>
            <p className="text-body-md text-on-primary-container/80 max-w-xs">
              Elevating businesses through precision strategy and forward-thinking leadership advisory.
            </p>
          </div>
          <div>
            <h4 className="text-label-md text-white mb-6 uppercase tracking-widest text-xs">Services</h4>
            <ul className="space-y-4">
              {serviceLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-body-md text-on-primary-container/80 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-label-md text-white mb-6 uppercase tracking-widest text-xs">Company</h4>
            <ul className="space-y-4">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-body-md text-on-primary-container/80 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-label-md text-white mb-6 uppercase tracking-widest text-xs">Legal</h4>
            <ul className="space-y-4">
              {legalLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-body-md text-on-primary-container/80 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-body-md text-on-primary-container/60">
            &copy; 2024 ExpertiseCo Consulting. All rights reserved.
          </p>
          <div className="flex gap-8">
            <span className="material-symbols-outlined text-on-primary-container/60 cursor-pointer hover:text-white transition-colors">language</span>
            <span className="material-symbols-outlined text-on-primary-container/60 cursor-pointer hover:text-white transition-colors">group</span>
            <span className="material-symbols-outlined text-on-primary-container/60 cursor-pointer hover:text-white transition-colors">business</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
