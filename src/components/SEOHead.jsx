import React, { useEffect, useState } from 'react'

/* ------------------------------------------------------------------ */
/*  Default page metadata                                             */
/* ------------------------------------------------------------------ */
const PAGE_META = {
  legend: {
    title: 'Iydani Entertainment — Premium Recording Studio & Creative Production in Bengaluru',
    description:
      'Professional music recording studio, audio dubbing, cinema green screen VFX, and creative production services in Mahalakshmipuram, Bengaluru. Founded under the vision of Dr. Hamsalekha.',
  },
  studio: {
    title: 'Studio Services — Iydani Entertainment, Bengaluru',
    description:
      'Explore our world-class recording rooms, dubbing suites, color grading bays, and cinema green screen studio. Professional music production in Bengaluru.',
  },
  about: {
    title: 'About Iydani Entertainment — Our Story & Team',
    description:
      'Learn about Iydani Entertainment, founded under the vision of Dr. Hamsalekha. Premium recording studio and entertainment production house in Bengaluru, Karnataka.',
  },
  services: {
    title: 'Our Services — Iydani Entertainment',
    description:
      'Music production, film production, artist management, music distribution, and digital content creation services at Iydani Entertainment, Bengaluru.',
  },
  contact: {
    title: 'Contact Iydani Entertainment — Recording Studio Bengaluru',
    description:
      'Get in touch with Iydani Entertainment. Visit our studio in Mahalakshmipuram, Bengaluru or call +91 74115 44427 for bookings.',
  },
  'audio-label': {
    title: 'Iydani Audio Label — Music Distribution & Publishing',
    description:
      'Submit your music to the Iydani Audio Label for distribution across Spotify, Apple Music, JioSaavn and all major streaming platforms.',
  },
  careers: {
    title: 'Careers at Iydani Entertainment',
    description:
      'Join our team of creative professionals. Sound engineers, VFX artists, music producers, and more opportunities in Bengaluru.',
  },
  news: {
    title: 'News & Updates — Iydani Entertainment',
    description:
      'Latest news, releases, and announcements from Iydani Entertainment recording studio and production house.',
  },
  privacy: {
    title: 'Privacy Policy — Iydani Entertainment',
    description:
      'Privacy policy and data handling practices of Iydani Entertainment.',
  },
}

/* ------------------------------------------------------------------ */
/*  Default business constants                                        */
/* ------------------------------------------------------------------ */
const DEFAULTS = {
  businessName: 'Iydani Entertainment',
  email: 'info@iyedani.com',
  phone: '+91 74115 44427',
  address: {
    street: '2nd Floor, 1092/93, 10th C Cross, 11th Main Road, Stage 2',
    locality: 'Mahalakshmipuram',
    city: 'Bengaluru',
    state: 'Karnataka',
    zip: '560086',
    country: 'IN',
  },
  hours: 'Mo-Sa 10:00-19:00',
  priceRange: '₹₹',
  websiteUrl: 'https://www.iydani.com',
  geoLat: 12.9972,
  geoLng: 77.5458,
  logoUrl: 'https://www.iydani.com/iydani_logo.png',
  sameAs: [
    'https://in.linkedin.com/company/iydani-entertainment',
    'https://www.instagram.com/iydanientertainment/',
    'https://www.youtube.com/@Iydani_Entertainment',
    'https://wa.me/9107411544427',
  ],
}

/* ------------------------------------------------------------------ */
/*  Studio FAQ data (for FAQPage schema)                              */
/* ------------------------------------------------------------------ */
const STUDIO_FAQ = [
  {
    question: 'What studio services does Iydani Entertainment offer?',
    answer:
      'Iydani Entertainment offers professional music recording, audio dubbing & post-production, cinema green screen & VFX compositing, color grading, and visual content creation services.',
  },
  {
    question: 'Where is Iydani Entertainment located?',
    answer:
      'Our studio is located on the 2nd Floor, 1092/93, 10th C Cross, 11th Main Road, Stage 2, Mahalakshmipuram, Bengaluru, Karnataka 560086.',
  },
  {
    question: 'How can I book a studio session?',
    answer:
      'You can book a session by calling us at +91 74115 44427, emailing info@iyedani.com, or visiting our Contact page.',
  },
  {
    question: 'What are the studio operating hours?',
    answer:
      'We are open Monday through Saturday, 10:00 AM to 7:00 PM.',
  },
]

/* ------------------------------------------------------------------ */
/*  Helper – build the breadcrumb path for a page                     */
/* ------------------------------------------------------------------ */
const PAGE_LABELS = {
  legend: 'Home',
  studio: 'Studio',
  about: 'About',
  services: 'Services',
  contact: 'Contact',
  'audio-label': 'Audio Label',
  careers: 'Careers',
  news: 'News',
  privacy: 'Privacy Policy',
}

function buildBreadcrumbs(page, baseUrl) {
  const crumbs = [{ name: 'Home', url: baseUrl + '/' }]
  if (page && page !== 'legend') {
    crumbs.push({
      name: PAGE_LABELS[page] || page,
      url: `${baseUrl}/#/${page}`,
    })
  }
  return crumbs
}

/* ================================================================== */
/*  SEOHead Component                                                 */
/* ================================================================== */
export default function SEOHead({ currentPage }) {
  const [seoSettings, setSeoSettings] = useState({})

  /* Fetch SEO overrides from API once on mount */
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.seoOverrides) {
          setSeoSettings(data.seoOverrides)
        }
      })
      .catch(() => {})
  }, [])

  /* Update <title>, meta description, and JSON-LD whenever page or settings change */
  useEffect(() => {
    const page = currentPage || 'legend'
    const meta = PAGE_META[page] || PAGE_META.legend

    // --- resolve values with settings overrides ---
    const businessName = seoSettings.seoBusinessName || DEFAULTS.businessName
    const email = seoSettings.seoEmail || DEFAULTS.email
    const phone = seoSettings.seoPhone || DEFAULTS.phone
    const hours = seoSettings.seoHours || DEFAULTS.hours
    const priceRange = seoSettings.seoPriceRange || DEFAULTS.priceRange
    const baseUrl = seoSettings.seoWebsiteUrl || DEFAULTS.websiteUrl
    const geoLat = seoSettings.seoGeoLat ?? DEFAULTS.geoLat
    const geoLng = seoSettings.seoGeoLng ?? DEFAULTS.geoLng

    const addressOverride = seoSettings.seoAddress
    const streetAddress = addressOverride || DEFAULTS.address.street
    const addressLocality = DEFAULTS.address.locality
    const addressRegion = DEFAULTS.address.state
    const postalCode = DEFAULTS.address.zip
    const addressCountry = DEFAULTS.address.country

    // 1. Update document title
    document.title = meta.title

    // 2. Update meta description
    let descTag = document.querySelector('meta[name="description"]')
    if (!descTag) {
      descTag = document.createElement('meta')
      descTag.setAttribute('name', 'description')
      document.head.appendChild(descTag)
    }
    descTag.setAttribute('content', meta.description)

    // 3. Build JSON-LD structured data
    const jsonLdScripts = []

    // --- LocalBusiness ---
    jsonLdScripts.push({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}/#localbusiness`,
      name: businessName,
      image: DEFAULTS.logoUrl,
      url: baseUrl,
      telephone: phone,
      email: email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: streetAddress,
        addressLocality: addressLocality,
        addressRegion: addressRegion,
        postalCode: postalCode,
        addressCountry: addressCountry,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: geoLat,
        longitude: geoLng,
      },
      openingHours: hours,
      priceRange: priceRange,
      sameAs: DEFAULTS.sameAs,
    })

    // --- Organization ---
    jsonLdScripts.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: businessName,
      url: baseUrl,
      logo: DEFAULTS.logoUrl,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: phone,
        email: email,
        contactType: 'customer service',
        availableLanguage: ['English', 'Kannada', 'Hindi'],
      },
      sameAs: DEFAULTS.sameAs,
    })

    // --- WebSite with SearchAction ---
    jsonLdScripts.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      name: businessName,
      url: baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    })

    // --- BreadcrumbList ---
    const crumbs = buildBreadcrumbs(page, baseUrl)
    jsonLdScripts.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    })

    // --- FAQPage (studio page only) ---
    if (page === 'studio') {
      jsonLdScripts.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: STUDIO_FAQ.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      })
    }

    // 4. Inject a single JSON-LD script tag into the <head>
    const SCRIPT_ID = 'seo-jsonld'
    let scriptEl = document.getElementById(SCRIPT_ID)
    if (!scriptEl) {
      scriptEl = document.createElement('script')
      scriptEl.id = SCRIPT_ID
      scriptEl.setAttribute('type', 'application/ld+json')
      document.head.appendChild(scriptEl)
    }
    scriptEl.textContent = JSON.stringify(jsonLdScripts)

    // Cleanup: remove the script tag on unmount
    return () => {
      const el = document.getElementById(SCRIPT_ID)
      if (el) el.remove()
    }
  }, [currentPage, seoSettings])

  // This component only manages side-effects — no visible UI
  return null
}
