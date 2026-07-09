import React, { useState, useEffect } from 'react';

export default function AudioLabel() {
  const [releases, setReleases] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', demoUrl: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/releases')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setReleases(data);
        } else {
          // Default mock releases if DB is empty
          setReleases([
            { id: 'm1', title: 'Premaloka Remastered', artist: 'Hamsalekha', genre: 'Soundtrack', releaseDate: '2026-05-15', image: '' },
            { id: 'm2', title: 'Agumbeya Sanje (Lofi Mix)', artist: 'Various Artists', genre: 'Lofi Fusion', releaseDate: '2026-06-01', image: '' }
          ]);
        }
      })
      .catch(() => {
        setReleases([
          { id: 'm1', title: 'Premaloka Remastered', artist: 'Hamsalekha', genre: 'Soundtrack', releaseDate: '2026-05-15', image: '' },
          { id: 'm2', title: 'Agumbeya Sanje (Lofi Mix)', artist: 'Various Artists', genre: 'Lofi Fusion', releaseDate: '2026-06-01', image: '' }
        ]);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.demoUrl) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Send to contact submission endpoint
    fetch('/api/submissions/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        message: `AUDIO LABEL SUBMISSION\nDemo Link: ${form.demoUrl}\nNotes: ${form.message}`
      })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success) {
          setSuccess('Demo submitted successfully! Our A&R team will review it.');
          setForm({ name: '', email: '', demoUrl: '', message: '' });
        } else {
          setError(data.error || 'Failed to submit demo.');
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
            Publishing & Distribution
          </span>
          <h1 className="font-heading text-4xl md:text-6xl text-charcoal font-bold tracking-wide">
            Iydani Audio Label
          </h1>
          <p className="font-body text-charcoal-light text-sm md:text-base leading-relaxed font-light max-w-xl">
            Distributing premium soundtracks, classical fusion, and independent regional artists across Spotify, Apple Music, and all global platforms.
          </p>
        </div>

        {/* Global Distribution Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-parchment-light border border-charcoal/5 p-6 rounded-2xl space-y-2">
            <div className="text-xl">🌐</div>
            <h3 className="font-heading text-lg text-charcoal font-bold">Global Reach</h3>
            <p className="font-body text-charcoal-light text-xs leading-relaxed font-light">
              Your audio published in over 180 countries on 150+ stores, with metadata customized to target regional dialects.
            </p>
          </div>
          <div className="bg-parchment-light border border-charcoal/5 p-6 rounded-2xl space-y-2">
            <div className="text-xl">📊</div>
            <h3 className="font-heading text-lg text-charcoal font-bold">Transparent Splits</h3>
            <p className="font-body text-charcoal-light text-xs leading-relaxed font-light">
              Manage automatic revenue splits directly between vocalists, composers, and lyricists without complex accounting.
            </p>
          </div>
          <div className="bg-parchment-light border border-charcoal/5 p-6 rounded-2xl space-y-2">
            <div className="text-xl">🎓</div>
            <h3 className="font-heading text-lg text-charcoal font-bold">A&R Mentorship</h3>
            <p className="font-body text-charcoal-light text-xs leading-relaxed font-light">
              Selected releases receive composition and mixing guidance from Hamsalekha-backed studio engineers.
            </p>
          </div>
        </div>

        {/* Releases Grid */}
        <div className="space-y-6">
          <h2 className="font-heading text-2xl md:text-3xl text-charcoal font-semibold tracking-wide">
            Latest Releases
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {releases.map((release) => (
              <div 
                key={release.id} 
                className="group bg-parchment-light border border-charcoal/5 p-3 rounded-2xl flex flex-col hover:border-wood/35 transition-all duration-300"
              >
                {/* Album Cover */}
                <div className="w-full aspect-square rounded-xl bg-parchment-warm border border-charcoal/5 flex flex-col items-center justify-center p-3 text-center relative overflow-hidden mb-3">
                  {release.image ? (
                    <img src={release.image} alt={release.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-wood/10 to-sage/10 opacity-30"></div>
                      <span className="font-heading text-3xl font-black text-wood/25 select-none uppercase tracking-wide">
                        {release.title.charAt(0)}
                      </span>
                    </>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 bg-charcoal/10 backdrop-blur-xs py-1 rounded">
                    <span className="font-body text-[8px] text-charcoal tracking-widest uppercase font-bold">
                      {release.genre}
                    </span>
                  </div>
                </div>
                {/* Release Meta */}
                <div className="px-1 flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-heading text-sm text-charcoal font-bold leading-tight truncate" title={release.title}>
                      {release.title}
                    </h4>
                    <p className="font-body text-[10px] text-charcoal-light leading-normal truncate">
                      {release.artist}
                    </p>
                  </div>
                  <span className="font-mono text-[8px] text-sage-dark mt-2 block">
                    REL: {release.releaseDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submissions Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-parchment-light border border-charcoal/5 p-8 rounded-3xl">
          <div className="space-y-4">
            <h2 className="font-heading text-2xl md:text-3xl text-charcoal font-semibold tracking-wide">
              Submit Your Demo
            </h2>
            <p className="font-body text-charcoal-light text-xs leading-relaxed font-light">
              Are you a producer, singer, or composer looking for label representation? Fill in the form to send your unreleased work directly to our A&R desk.
            </p>
            <p className="font-body text-charcoal-light text-xs leading-relaxed font-light">
              Please provide streaming links (SoundCloud, Google Drive, Dropbox) with access settings set to public or shared link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 text-red-700 text-xs rounded-lg font-body">{error}</div>
            )}
            {success && (
              <div className="p-3 bg-green-100 text-green-700 text-xs rounded-lg font-body">{success}</div>
            )}

            <div className="space-y-1">
              <label htmlFor="submit-name" className="font-body text-[10px] tracking-wider uppercase font-bold text-charcoal-light">Artist / Band Name *</label>
              <input 
                id="submit-name"
                type="text" 
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                placeholder="Artist name"
                className="w-full px-4 py-2.5 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="submit-email" className="font-body text-[10px] tracking-wider uppercase font-bold text-charcoal-light">Email Address *</label>
              <input 
                id="submit-email"
                type="email" 
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                placeholder="yourname@domain.com"
                className="w-full px-4 py-2.5 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="submit-demourl" className="font-body text-[10px] tracking-wider uppercase font-bold text-charcoal-light">Demo Audio Stream Link *</label>
              <input 
                id="submit-demourl"
                type="url" 
                value={form.demoUrl}
                onChange={e => setForm({...form, demoUrl: e.target.value})}
                placeholder="SoundCloud / Drive / Dropbox link"
                className="w-full px-4 py-2.5 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="submit-message" className="font-body text-[10px] tracking-wider uppercase font-bold text-charcoal-light">Message / Release Pitch</label>
              <textarea 
                id="submit-message"
                rows="3"
                value={form.message}
                onChange={e => setForm({...form, message: e.target.value})}
                placeholder="Tell us about your track..."
                className="w-full px-4 py-2.5 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-wood text-white hover:bg-wood-dark font-body text-xs tracking-widest uppercase font-bold rounded-lg transition-colors cursor-pointer duration-300 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Demo'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
