import React, { useState, useEffect } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    email: 'info@iydani.com',
    phone: '+91 74115 44427',
    address: 'LIG 3rd Stage, Udaya Layout, Yelahanka New Town, Bengaluru, Karnataka 560064\nHamsalekha Music School'
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings(prev => ({
            ...prev,
            email: data.email || prev.email,
            phone: data.phone || prev.phone,
            address: data.address || prev.address
          }));
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    fetch('/api/submissions/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success) {
          setSuccess('Your inquiry has been submitted! We will contact you shortly.');
          setForm({ name: '', email: '', message: '' });
        } else {
          setError(data.error || 'Failed to submit inquiry.');
        }
      })
      .catch(() => {
        setLoading(false);
        setError('Network error. Failed to submit.');
      });
  };

  return (
    <div className="relative z-10 w-full min-h-screen bg-parchment pt-24 pb-16 px-6 md:px-16 select-text">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="space-y-3 text-center md:text-left">
          <span className="font-body text-xs tracking-[0.25em] text-sage font-bold uppercase block">
            Get In Touch
          </span>
          <h1 className="font-heading text-4xl md:text-6xl text-charcoal font-bold tracking-wide">
            Contact Us
          </h1>
          <p className="font-body text-charcoal-light text-sm md:text-base leading-relaxed font-light max-w-xl">
            Have a project query, music demo, or business collaboration? Fill in the form or visit our Bengaluru headquarters.
          </p>
        </div>

        {/* Contact Info & Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Info & Map */}
          <div className="space-y-6">
            <div className="bg-parchment-light border border-charcoal/5 p-6 rounded-2xl space-y-4 shadow-xs">
              <h3 className="font-heading text-xl text-charcoal font-bold tracking-wide">
                Bengaluru Head Office
              </h3>
              
              <div className="space-y-3 font-body text-xs text-charcoal-light leading-relaxed">
                <div className="flex items-start gap-3">
                  <span className="text-wood font-semibold">Address:</span>
                  <span>{settings.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-wood font-semibold">Phone:</span>
                  <span>{settings.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-wood font-semibold">Email:</span>
                  <span>{settings.email}</span>
                </div>
              </div>
            </div>

            {/* Embedded OpenStreetMap Iframe */}
            <div className="w-full aspect-[16/10] rounded-2xl border border-charcoal/10 overflow-hidden shadow-xs relative bg-parchment-warm">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight="0" 
                marginWidth="0" 
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.5358%2C12.9872%2C77.5558%2C13.0072&amp;layer=mapnik&amp;marker=12.9972%2C77.5458" 
                style={{ border: 0, filter: 'contrast(0.9) sepia(0.2)' }}
                title="Bengaluru Office Location Map"
              ></iframe>
              <div className="absolute bottom-2 left-2 bg-white/85 px-2 py-0.5 rounded text-[8px] font-body text-charcoal-light shadow-sm">
                © OpenStreetMap contributors
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-parchment-light border border-charcoal/5 p-8 rounded-3xl shadow-xs">
            <h3 className="font-heading text-2xl text-charcoal font-bold tracking-wide mb-4">
              Send an Inquiry
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 text-red-700 text-xs rounded-lg font-body">{error}</div>
              )}
              {success && (
                <div className="p-3 bg-green-100 text-green-700 text-xs rounded-lg font-body">{success}</div>
              )}

              <div className="space-y-1">
                <label htmlFor="contact-name" className="font-body text-[10px] tracking-wider uppercase font-bold text-charcoal-light">Your Name *</label>
                <input 
                  id="contact-name"
                  type="text" 
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="Full name"
                  className="w-full px-4 py-2.5 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label htmlFor="contact-email" className="font-body text-[10px] tracking-wider uppercase font-bold text-charcoal-light">Email Address *</label>
                <input 
                  id="contact-email"
                  type="email" 
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="yourname@domain.com"
                  className="w-full px-4 py-2.5 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="contact-message" className="font-body text-[10px] tracking-wider uppercase font-bold text-charcoal-light">Your Message *</label>
                <textarea 
                  id="contact-message"
                  rows="5"
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  placeholder="Describe your project, booking request, or feedback..."
                  className="w-full px-4 py-2.5 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none"
                  required
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-charcoal text-parchment hover:bg-wood hover:text-charcoal-dark font-body text-xs tracking-widest uppercase font-bold rounded-lg cursor-pointer transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
