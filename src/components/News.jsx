import React, { useState, useEffect } from 'react';

export default function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setNews(data);
        } else {
          setNews([
            {
              id: '1',
              title: 'Iydani Studio Upgrades to Dolby Atmos mixing',
              category: 'Studio Update',
              date: 'May 10, 2026',
              summary: 'We are proud to announce that our main mixing suite is now fully certified for Dolby Atmos spatial audio mixing, raising regional post-production standards.',
              content: 'Full details on certification...'
            },
            {
              id: '2',
              title: 'Dr. Hamsalekha Mentorship Program Launches',
              category: 'Mentorship',
              date: 'June 02, 2026',
              summary: 'An exclusive opportunity for next-gen lyricists and vocalists to receive direct composition feedback and studio time under Naada Brahma.',
              content: 'Registration forms open soon...'
            }
          ]);
        }
      })
      .catch(() => {
        setNews([
          {
            id: '1',
            title: 'Iydani Studio Upgrades to Dolby Atmos mixing',
            category: 'Studio Update',
            date: 'May 10, 2026',
            summary: 'We are proud to announce that our main mixing suite is now fully certified for Dolby Atmos spatial audio mixing, raising regional post-production standards.',
            content: 'Full details on certification...'
          },
          {
            id: '2',
            title: 'Dr. Hamsalekha Mentorship Program Launches',
            category: 'Mentorship',
            date: 'June 02, 2026',
            summary: 'An exclusive opportunity for next-gen lyricists and vocalists to receive direct composition feedback and studio time under Naada Brahma.',
            content: 'Registration forms open soon...'
          }
        ]);
      });
  }, []);

  return (
    <div className="relative z-10 w-full min-h-screen bg-parchment pt-24 pb-16 px-6 md:px-16 select-text">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="space-y-3 text-center md:text-left">
          <span className="font-body text-xs tracking-[0.25em] text-sage font-bold uppercase block">
            Press & Blog
          </span>
          <h1 className="font-heading text-4xl md:text-6xl text-charcoal font-bold tracking-wide">
            News & Updates
          </h1>
          <p className="font-body text-charcoal-light text-sm md:text-base leading-relaxed font-light max-w-xl">
            Stay informed with the latest milestones, tech integrations, and artist signings at Iydani Entertainment.
          </p>
        </div>

        {/* Masonry / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item) => (
            <div 
              key={item.id} 
              className="bg-parchment-light border border-charcoal/5 p-6 rounded-2xl flex flex-col justify-between hover:border-wood/35 hover:scale-[1.01] transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="bg-parchment-warm text-charcoal-light font-body text-[9px] tracking-wider px-2 py-0.5 rounded uppercase font-semibold">
                    {item.category}
                  </span>
                  <span className="font-mono text-[9px] text-sage-dark">
                    {item.date}
                  </span>
                </div>
                <h3 className="font-heading text-xl md:text-2xl text-charcoal font-bold leading-tight">
                  {item.title}
                </h3>
                <p className="font-body text-charcoal-light text-xs leading-relaxed font-light">
                  {item.summary}
                </p>
              </div>

              {/* Graphic element for style */}
              <div className="mt-4 pt-3 border-t border-charcoal/5 flex justify-between items-center text-[10px] tracking-widest text-wood font-bold uppercase">
                <span>Iydani News</span>
                <span>Read &bull;</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
