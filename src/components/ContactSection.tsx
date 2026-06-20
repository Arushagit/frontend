import { type FormEvent, useState } from 'react';
import { submitContactForm } from '../services/api';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await submitContactForm(form);
      setSubmitted(true);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };
      const apiErrors = axiosErr.response?.data?.errors;
      if (apiErrors) {
        const first = Object.values(apiErrors)[0];
        setError(Array.isArray(first) ? first[0] : String(first));
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="py-24 bg-surface relative">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[600px]">
          {/* Info panel */}
          <div className="w-full lg:w-2/5 p-12 md:p-20 bg-primary-container text-white flex flex-col justify-between">
            <div>
              <h2 className="text-headline-lg mb-6 leading-tight">Let's build your future.</h2>
              <p className="text-body-lg opacity-80 mb-12">
                Contact us today to schedule an initial consultation and discover how ExpertiseCo can transform your operations.
              </p>
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-secondary-container text-2xl">mail</span>
                  <span className="text-label-md">consult@expertiseco.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-secondary-container text-2xl">phone_iphone</span>
                  <span className="text-label-md">+1 (555) 000-0000</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-secondary-container text-2xl">location_on</span>
                  <span className="text-label-md">Manhattan Corporate HQ, NYC</span>
                </div>
              </div>
            </div>
            <div className="mt-20 pt-10 border-t border-white/10 flex gap-8">
              <span className="material-symbols-outlined cursor-pointer hover:text-secondary-container transition-colors">public</span>
              <span className="material-symbols-outlined cursor-pointer hover:text-secondary-container transition-colors">share</span>
              <span className="material-symbols-outlined cursor-pointer hover:text-secondary-container transition-colors">work</span>
            </div>
          </div>

          {/* Form panel */}
          <div className="w-full lg:w-3/5 p-12 md:p-20">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
                <span className="material-symbols-outlined text-secondary text-6xl">check_circle</span>
                <h3 className="text-headline-md text-primary">Message Sent!</h3>
                <p className="text-body-md text-on-surface-variant">We'll be in touch within one business day.</p>
                <p className="text-body-sm text-on-surface-variant opacity-60">A confirmation email has been sent to {form.email}.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }}
                  className="px-8 py-3 border border-slate-200 rounded-xl text-on-surface-variant text-label-md hover:bg-slate-50 transition-all"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="space-y-10" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <label className="text-label-sm text-on-surface-variant uppercase tracking-wider">Full Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full bg-transparent border-0 border-b-2 border-slate-200 py-4 px-0 focus:ring-0 focus:border-secondary transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-label-sm text-on-surface-variant uppercase tracking-wider">Corporate Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="john@company.com"
                      required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-transparent border-0 border-b-2 border-slate-200 py-4 px-0 focus:ring-0 focus:border-secondary transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-label-sm text-on-surface-variant uppercase tracking-wider">Message</label>
                  <textarea
                    id="contact-message"
                    placeholder="How can we help you?"
                    rows={4}
                    required
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full bg-transparent border-0 border-b-2 border-slate-200 py-4 px-0 focus:ring-0 focus:border-secondary transition-all resize-none outline-none"
                  />
                </div>

                {/* Error message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">error</span>
                    {error}
                  </div>
                )}

                <div className="pt-6">
                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-12 py-5 bg-secondary text-white text-label-md rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-3 group shadow-xl shadow-secondary/20 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
