import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_FAQ_ITEMS = [
  {
    question: 'How much does recording studio time cost at Iydani Entertainment?',
    answer: 'Our recording sessions are competitively priced based on your project scope, session duration, and required equipment. We offer hourly, half-day, and full-day packages for vocal tracking, instrument recording, and full-band sessions. Contact us at +91 74115 44427 or email iydanientertainment@gmail.com for a personalized quote tailored to your project.'
  },
  {
    question: 'What professional equipment does Iydani Entertainment use for music recording?',
    answer: 'Our studio features industry-standard equipment including Neumann U87 Ai condenser microphones, Neve 1073 and SSL Alpha VHD preamps, Universal Audio and Tube-Tech outboard compressors, Antelope Audio Orion 32HD converters recording at 192kHz/32-bit, Coles 4038 ribbon microphones, Shure SM7B, AKG C414 XLS, Genelec 8040B monitors, and Avid Pro Tools Ultimate and Apple Logic Pro software.'
  },
  {
    question: 'How long does a typical music production session take?',
    answer: 'Session duration varies by project. A single vocal tracking session typically takes 2-4 hours. A full song production including recording, editing, and rough mixing can take 1-3 days. Album projects are scheduled over multiple sessions spanning several weeks. We recommend booking a consultation to plan your timeline.'
  },
  {
    question: 'Does Iydani Entertainment offer music production classes or training?',
    answer: 'Yes, Iydani Entertainment is committed to music education. We offer training programs in music production, sound engineering, and vocal performance under the mentorship philosophy of Dr. Hamsalekha. Programs range from beginner workshops to advanced production masterclasses. Contact us for current program availability and enrollment details.'
  },
  {
    question: 'What is the difference between recording, mixing, and mastering?',
    answer: 'Recording (tracking) captures the raw audio performance in our acoustically tuned studio. Mixing is the process of balancing, equalizing, and processing all recorded tracks into a cohesive stereo or surround mix. Mastering is the final step that optimizes the mixed audio for distribution, ensuring consistent loudness and tonal quality across all playback systems. We offer all three services at Iydani Entertainment.'
  },
  {
    question: 'Can I book the green screen studio for music video shoots?',
    answer: 'Absolutely! Our cinema-grade cyclorama green screen studio is available for music video productions, commercial shoots, and VFX projects. The 24ft x 20ft x 12ft space features pre-lit DMX-controlled LED panels, soundproofing for simultaneous audio recording, and camera rig integration including DJI Ronin 2 and dolly tracking systems.'
  },
  {
    question: 'Where is Iydani Entertainment located in Bengaluru?',
    answer: 'Iydani Entertainment is located at LIG 3rd Stage, Udaya Layout, Yelahanka New Town, Bengaluru, Karnataka 560064, at Hamsalekha Music School. We are easily accessible from all major areas of Bengaluru. Visit us by appointment.'
  },
  {
    question: 'Does Iydani Entertainment offer online music courses?',
    answer: 'We are developing online learning programs to extend our music education beyond our physical studio. Contact us at iydanientertainment@gmail.com to express your interest and be notified when online courses become available.'
  },
  {
    question: 'What genres of music can I record at Iydani Entertainment?',
    answer: 'Our studio is designed to accommodate all genres including Kannada film music, Bollywood, classical Indian (Carnatic and Hindustani), pop, hip-hop, EDM, rock, folk, devotional, and fusion. Our acoustically variable rooms and versatile equipment chain adapt to any style.'
  },
  {
    question: 'How do I submit a demo to the Iydani Audio Label?',
    answer: 'To submit your music to the Iydani Audio Label (Hamsalekha Strings & Iydani Entertainment), send your demo tracks, artist bio, and contact information to iydanientertainment@gmail.com. We review all submissions and will respond if your music aligns with our label direction. We distribute across Spotify, Apple Music, JioSaavn, and all major streaming platforms.'
  },
  {
    question: 'How do I book a recording session at Iydani Entertainment?',
    answer: 'You can book a session by contacting us via WhatsApp at +91 74115 44427, calling us directly, or sending an email to iydanientertainment@gmail.com. We recommend booking at least 3-5 days in advance. For large projects, early scheduling ensures availability of our premium studios.'
  },
  {
    question: 'What should I bring to a recording session?',
    answer: 'Bring your lyrics or sheet music, any reference tracks for the sound you want, a USB drive for file transfers, and your instrument if applicable. If you need specific backing tracks or beats, send them to us at least 24 hours before your session. We provide all studio equipment, microphones, headphones, and monitoring.'
  },
  {
    question: 'What are Iydani Entertainment\'s studio hours?',
    answer: 'Our studio operates Monday through Saturday, 10:00 AM to 7:00 PM. Extended hours and Sunday sessions can be arranged for ongoing projects by prior appointment. Contact us to discuss custom scheduling for your project needs.'
  },
  {
    question: 'Does Iydani Entertainment offer dubbing and ADR services?',
    answer: 'Yes, we offer professional dubbing and Automated Dialogue Replacement (ADR) services in our sound-isolated suites with precise LTC timecode synchronization. We handle movie dialogue dubbing, commercial voiceover, language localization, and post-production audio cleanup using iZotope RX Advanced spectral restoration.'
  },
  {
    question: 'Does Iydani Entertainment provide film production services?',
    answer: 'Yes, we offer end-to-end cinema production services including script development, pre-visualization, filming, VFX, DaVinci Resolve color grading, Dolby Atmos spatial audio mixing, and theater packaging. Our services span from independent short films to full-length feature films and commercial productions.'
  }
];

function FAQItem({ item, isOpen, onToggle }) {
  const contentRef = useRef(null);

  return (
    <div className="bg-parchment-light border border-charcoal/5 rounded-2xl hover:border-wood/35 transition-all duration-300">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="font-heading text-charcoal font-semibold text-sm md:text-base leading-snug">
          {item.question}
        </span>
        <svg
          className={`w-5 h-5 flex-shrink-0 text-wood transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden transition-[max-height] duration-400 ease-in-out"
        style={{
          maxHeight: isOpen ? (contentRef.current?.scrollHeight ?? 0) + 'px' : '0px'
        }}
      >
        <div className="px-6 pb-5 pt-0">
          <p className="font-body text-charcoal-light text-sm leading-relaxed font-light">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [faqItems, setFaqItems] = useState(DEFAULT_FAQ_ITEMS);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.faqItems && Array.isArray(data.faqItems) && data.faqItems.length > 0) {
          setFaqItems(data.faqItems);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleToggle = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  // Build JSON-LD FAQPage structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };

  return (
    <div className="relative z-10 w-full bg-parchment border-t border-charcoal/5 py-8 px-6 md:px-16 select-text">
      {/* JSON-LD FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto space-y-8">

        {/* Section Header */}
        <div className="space-y-3 text-center md:text-left">
          <span className="font-body text-xs tracking-[0.25em] text-sage font-bold uppercase block">
            Common Questions
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-charcoal font-bold tracking-wide">
            Frequently Asked Questions
          </h2>
          <p className="font-body text-charcoal-light text-sm md:text-base leading-relaxed font-light max-w-2xl">
            Everything you need to know about our recording studio, music production services, and creative facilities in Bengaluru.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="bg-[#white]/40 backdrop-blur-xs border border-charcoal/5 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-heading text-xl md:text-2xl text-charcoal font-bold tracking-wide">
              Still have questions?
            </h4>
            <p className="font-body text-charcoal-light text-xs font-light">
              Get in touch with our team and we'll be happy to help.
            </p>
          </div>
          <a
            href="#/contact"
            className="px-6 py-3 bg-charcoal text-parchment hover:bg-wood hover:text-charcoal-dark font-body text-xs tracking-widest uppercase font-bold rounded-full transition-all duration-300 shadow-sm whitespace-nowrap"
          >
            Get In Touch &rarr;
          </a>
        </div>

      </div>
    </div>
  );
}
