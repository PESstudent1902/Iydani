import React, { useState, useEffect } from 'react';

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('entertainment');

  const [entertainmentServices, setEntertainmentServices] = useState([
    {
      title: 'Film Production',
      desc: 'End-to-end cinema production from script development and pre-visualization to filming, VFX, and theater packaging.',
      icon: '🎬'
    },
    {
      title: 'Music Production',
      desc: 'Full songwriting, arranging, tracking, and mixing with legendary director mentorship for albums and movie soundtracks.',
      icon: '🎵'
    },
    {
      title: 'Music Distribution & Label',
      desc: 'Seamless publishing across major streaming platforms worldwide (Spotify, Apple Music, JioSaavn) under the Iydani Audio Label.',
      icon: '💿'
    },
    {
      title: 'Artist Management',
      desc: 'Mentoring rising vocalists and composers, booking gigs, setting up licensing deals, and guiding media careers.',
      icon: '👑'
    },
    {
      title: 'Digital Content Creation',
      desc: 'Premium brand campaigns, high-end promotional videos, motion assets, and commercial layouts.',
      icon: '📱'
    }
  ]);

  const [studioServices, setStudioServices] = useState([
    {
      title: 'Acoustic Tracking & Recording',
      desc: 'Premium tracking room optimized for live drums, string ensembles, and vocal capture with Class-A analog chains.',
      icon: '🎙️'
    },
    {
      title: 'Dubbing & Dialogue Replacement',
      desc: 'Sound-isolated ADR suites with precise timecode sync for movie and commercial language localization.',
      icon: '🎧'
    },
    {
      title: 'Cinematic Color Grading',
      desc: 'DaVinci Resolve color-grading suite with D65 lighting and reference monitors for UHD/HDR master exports.',
      icon: '🎨'
    },
    {
      title: 'Cinema Green Screen Studio',
      desc: 'Pre-lit cyclorama chroma key space with high-CRI panels, dolly track systems, and virtual tracking overlays.',
      icon: '🟩'
    },
    {
      title: 'Dolby Atmos Mixing & Post',
      desc: 'Spatial audio mix room optimized for cinema standard surround mixes, audio cleanup, and sound design.',
      icon: '🔊'
    },
    {
      title: 'Graphic Designing',
      desc: 'Timeless visual branding, digital illustrations, album arts, and custom layouts tailored for entertainment and media.',
      icon: '🎨'
    }
  ]);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.entertainmentServices && Array.isArray(data.entertainmentServices) && data.entertainmentServices.length > 0) {
            setEntertainmentServices(data.entertainmentServices);
          }
          if (data.studioServices && Array.isArray(data.studioServices) && data.studioServices.length > 0) {
            setStudioServices(data.studioServices);
          }
        }
      })
      .catch(err => console.error(err));
  }, []);

  const currentList = activeTab === 'entertainment' ? entertainmentServices : studioServices;

  return (
    <div className="relative z-10 w-full min-h-screen bg-parchment pt-24 pb-16 px-6 md:px-16 select-text">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="space-y-3 text-center md:text-left">
          <span className="font-body text-xs tracking-[0.25em] text-sage font-bold uppercase block">
            What We Do
          </span>
          <h1 className="font-heading text-4xl md:text-6xl text-charcoal font-bold tracking-wide">
            Our Services
          </h1>
          <p className="font-body text-charcoal-light text-sm md:text-base leading-relaxed font-light max-w-xl">
            Explore our world-class entertainment production divisions and state-of-the-art acoustic tracking workspaces.
          </p>
        </div>

        {/* Tab Buttons (Google Labs style) */}
        <div className="flex border-b border-charcoal/10 gap-6 pb-2">
          <button
            onClick={() => setActiveTab('entertainment')}
            className={`font-body text-sm tracking-wider uppercase font-bold relative py-2 transition-all cursor-pointer duration-300 ${
              activeTab === 'entertainment' ? 'text-charcoal' : 'text-charcoal-light opacity-50 hover:opacity-100'
            }`}
          >
            Entertainment Services
            {activeTab === 'entertainment' && (
              <span className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-wood rounded-full"></span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('studio')}
            className={`font-body text-sm tracking-wider uppercase font-bold relative py-2 transition-all cursor-pointer duration-300 ${
              activeTab === 'studio' ? 'text-charcoal' : 'text-charcoal-light opacity-50 hover:opacity-100'
            }`}
          >
            Studio & Production Services
            {activeTab === 'studio' && (
              <span className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-wood rounded-full"></span>
            )}
          </button>
        </div>

        {/* Grid Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentList.map((service, index) => (
            <div 
              key={index} 
              className="group bg-parchment-light border border-charcoal/5 p-6 rounded-2xl flex items-start gap-4 hover:border-wood/35 hover:scale-[1.01] hover:shadow-xs transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-parchment-warm border border-charcoal/5 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-inner">
                {service.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-heading text-xl text-charcoal font-semibold tracking-wide">
                  {service.title}
                </h3>
                <p className="font-body text-charcoal-light text-xs leading-relaxed font-light">
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic call to action */}
        <div className="bg-[#white]/40 backdrop-blur-xs border border-charcoal/5 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-heading text-xl md:text-2xl text-charcoal font-bold tracking-wide">Have a specific project in mind?</h4>
            <p className="font-body text-charcoal-light text-xs font-light">Get in touch with our team to map out custom rates and hardware needs.</p>
          </div>
          <a 
            href="#/contact" 
            className="px-6 py-3 bg-charcoal text-parchment hover:bg-wood hover:text-charcoal-dark font-body text-xs tracking-widest uppercase font-bold rounded-full transition-all duration-300 shadow-sm whitespace-nowrap"
          >
            Start Project &rarr;
          </a>
        </div>

      </div>
    </div>
  );
}
