import React from 'react';

export default function AboutUs() {
  const team = [
    {
      name: 'Iydani Founder',
      role: 'Founder & CEO',
      bio: 'Visionary entrepreneur driving the integration of classic musical heritage with state-of-the-art cinematic technology.',
      initials: 'IF'
    },
    {
      name: 'Dr. Hamsalekha',
      role: 'Creative Mentor & Advisory Head',
      bio: 'Naada Brahma of Kannada cinema, shaping the acoustic philosophy and artistic standards of the studio.',
      initials: 'DH'
    },
    {
      name: 'Technical Director',
      role: 'Head of Sound & VFX',
      bio: 'A veteran engineer with over 15 years of experience setting up premium recording chains and virtual productions.',
      initials: 'TD'
    }
  ];

  const values = [
    {
      title: 'Creativity',
      desc: 'Pushing boundaries to craft timeless melodies and stunning visual narratives.'
    },
    {
      title: 'Innovation',
      desc: 'Integrating real-time virtual production and premium analog gear.'
    },
    {
      title: 'Quality',
      desc: 'Maintaining 192kHz/32-bit pristine capture and pixel-perfect color grading.'
    },
    {
      title: 'Professionalism',
      desc: 'Ensuring world-class artist treatment, on-time delivery, and seamless workflows.'
    }
  ];

  return (
    <div className="relative z-10 w-full min-h-screen bg-parchment pt-24 pb-16 px-6 md:px-16 select-text">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="space-y-3 text-center md:text-left">
          <span className="font-body text-xs tracking-[0.25em] text-sage font-bold uppercase block">
            Our Story
          </span>
          <h1 className="font-heading text-4xl md:text-6xl text-charcoal font-bold tracking-wide">
            About Us
          </h1>
          <p className="font-body text-charcoal-light text-sm md:text-base leading-relaxed font-light max-w-2xl">
            Established with a deep respect for acoustic purity and cinematic excellence, Iydani Entertainment merges legendary artistic direction with next-generation digital technology.
          </p>
        </div>

        {/* Company Overview & Journey */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-parchment-light border border-charcoal/5 p-8 rounded-2xl shadow-xs">
          <div className="space-y-4">
            <h2 className="font-heading text-2xl md:text-3xl text-charcoal font-semibold tracking-wide">
              The Journey & Growth
            </h2>
            <p className="font-body text-charcoal-light text-sm leading-relaxed font-light">
              Founded under the creative inspiration of the legendary composer Dr. Hamsalekha, Iydani Entertainment began as a boutique tracking suite. Over the years, we grew into a multi-disciplinary entertainment house covering film production, Dolby Atmos mixing, and virtual cyclorama studios.
            </p>
            <p className="font-body text-charcoal-light text-sm leading-relaxed font-light">
              Our state-of-the-art facility in Bengaluru stands as a testament to our growth—combining acoustic rooms designed by top global consultants with high-speed digital workflows.
            </p>
          </div>
          
          {/* Graphic Placeholder styled with the theme */}
          <div className="w-full aspect-[4/3] rounded-xl bg-parchment-warm border border-wood/20 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(#2a2d34_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03]"></div>
            <span className="font-heading text-6xl text-wood/15 select-none font-bold">EST. 2026</span>
            <div className="absolute inset-2 border border-wood/10 rounded-lg"></div>
            <div className="z-10 mt-2">
              <span className="font-body text-[10px] tracking-widest text-sage font-bold uppercase block">
                Corporate Headquarters
              </span>
              <span className="font-body text-xs text-charcoal-light mt-1 block">
                Bengaluru, India
              </span>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vision */}
          <div className="bg-[#white]/40 backdrop-blur-xs border border-charcoal/5 p-8 rounded-2xl space-y-3 relative">
            <div className="absolute top-4 right-6 text-wood/30 text-5xl font-heading select-none font-black">01</div>
            <h3 className="font-heading text-xl md:text-2xl text-charcoal font-bold tracking-wide">Our Vision</h3>
            <p className="font-body text-charcoal-light text-sm leading-relaxed font-light">
              To be the premier global sanctuary for audio-visual artists, where technological innovation never compromises the raw, organic soul of live musical performance.
            </p>
          </div>
          {/* Mission */}
          <div className="bg-[#white]/40 backdrop-blur-xs border border-charcoal/5 p-8 rounded-2xl space-y-3 relative">
            <div className="absolute top-4 right-6 text-wood/30 text-5xl font-heading select-none font-black">02</div>
            <h3 className="font-heading text-xl md:text-2xl text-charcoal font-bold tracking-wide">Our Mission</h3>
            <p className="font-body text-charcoal-light text-sm leading-relaxed font-light">
              Providing exceptional facilities, transparent distribution, and unmatched mentorship to enable creators to achieve local impact and global scale.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-6">
          <div className="text-center md:text-left">
            <span className="font-body text-xs tracking-[0.25em] text-sage font-bold uppercase block">
              Our Principles
            </span>
            <h2 className="font-heading text-2xl md:text-3xl text-charcoal font-semibold tracking-wide">
              Core Values
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <div 
                key={i} 
                className="bg-parchment-light border border-charcoal/5 p-6 rounded-xl space-y-2 hover:border-wood/35 hover:scale-[1.01] transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-wood/10 flex items-center justify-center text-wood text-xs font-bold font-body mb-2">
                  {i + 1}
                </div>
                <h4 className="font-heading text-lg text-charcoal font-bold">{v.title}</h4>
                <p className="font-body text-charcoal-light text-xs leading-relaxed font-light">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Team */}
        <div className="space-y-6">
          <div className="text-center md:text-left">
            <span className="font-body text-xs tracking-[0.25em] text-sage font-bold uppercase block">
              The Minds Behind
            </span>
            <h2 className="font-heading text-2xl md:text-3xl text-charcoal font-semibold tracking-wide">
              Leadership Team
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, idx) => (
              <div 
                key={idx} 
                className="group bg-white border border-charcoal/5 p-6 rounded-2xl shadow-xs flex flex-col justify-between hover:border-wood/30 hover:shadow-md transition-all duration-500"
              >
                <div className="space-y-4">
                  {/* Photo Placeholder */}
                  <div className="w-16 h-16 rounded-full bg-parchment-warm border border-wood/20 flex items-center justify-center font-heading text-xl text-wood-dark font-bold group-hover:scale-105 transition-transform duration-300">
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="font-heading text-xl text-charcoal font-bold tracking-wide">
                      {member.name}
                    </h3>
                    <span className="font-body text-[10px] tracking-widest text-sage font-bold uppercase block mt-0.5">
                      {member.role}
                    </span>
                  </div>
                  <p className="font-body text-charcoal-light text-xs leading-relaxed font-light">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
