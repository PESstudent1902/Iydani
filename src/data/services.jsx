import React from 'react'
import StudioMicrophone from '../components/assets/StudioMicrophone'
import AudioWaveform from '../components/assets/AudioWaveform'
import DigitalCanvas from '../components/assets/DigitalCanvas'
import CinemaCamera from '../components/assets/CinemaCamera'

export const services = [
  {
    id: 'visuals',
    num: '01 / Commercial Grading',
    title: 'Visual Content & Image Editing',
    description: 'High-end commercial color grading, graphic design, and brand asset generation. We translate artistic ideas into compelling visual campaigns, matching premium sound with stunning graphic precision.',
    features: ['Commercial Color Grading', 'Digital Stylus Illustration', 'Brand Layout & Assets'],
    imageAlign: 'left',
    model: <DigitalCanvas />,
    cameraPos: [0, 0, 5.6],
    modelPos: [0, 0, 0],
    cardLabel: '01',
    cardSublabel: 'VISUAL CREATIVE',
    image: '/visual_editing.jpg',
    seoAlt: 'Professional visual content editing and commercial color grading workspace at Iydani Entertainment studio, Bengaluru',

    // Details Page Content
    subtitle: 'Commercial Color Grading & Layout Design',
    longDescription1: 'Premium audio deserves matching visual representation. Our graphic design and visual grading suite works in tandem with our audio production, crafting stunning brand layouts, promotional materials, and commercial color grading that brings digital illustrations and video content to life.',
    longDescription2: 'We assist artists and brands in building cohesive visual languages. From single-artwork and vinyl packaging layout to digital branding campaigns and promotional assets, we focus on layout, typography, and color theory to deliver premium, stand-out designs.',
    technicalSpecs: [
      { category: 'Grading Suite', items: ['Color-controlled workspace with D65 neutral lighting', 'DaVinci Resolve Studio with physical grading panel', 'Eizo ColorEdge hardware-calibrated reference monitors'] },
      { category: 'Design Suite', items: ['Adobe Photoshop, Illustrator, and InDesign CC', 'Figma for digital interface & brand layout design', 'Wacom Intuos Pro pen tablets for illustration'] },
      { category: 'Deliverables', items: ['Ultra-HD master files in Rec.709, DCI-P3, and HDR', 'Print-ready packaging formats (CMYK / Pantone)', 'Optimized social media asset kits'] }
    ],
    imagePlaceholders: [
      { name: 'Color Grading Bay', aspect: 'aspect-video', size: '1200 x 675', icon: 'camera' },
      { name: 'Editing Workstations', aspect: 'aspect-[4/3]', size: '800 x 600', image: '/visual_gallery_1.jpg' },
      { name: 'Suite Audio Monitoring', aspect: 'aspect-square', size: '600 x 600', image: '/visual_gallery_2.jpg' },
      { name: 'Console Mixing Desk', aspect: 'aspect-[4/3]', size: '800 x 600', image: '/visual_gallery_3.jpg' }
    ]
  },
  {
    id: 'recording',
    num: '02 / Pristine Sound Capture',
    title: 'Professional Music Recording',
    description: 'State-of-the-art acoustic design meets premium vintage and modern hardware. We provide a tailored recording environment optimized for vocals, solo instruments, and full ensembles, capturing every nuance with absolute clarity.',
    features: ['Acoustically Tuned Rooms', 'High-End Analog Signal Path', 'Class-A Preamps & Mics'],
    imageAlign: 'right',
    model: <StudioMicrophone />,
    cameraPos: [0, 0.2, 4.0],
    modelPos: [0, -0.4, 0],
    cardLabel: '02',
    cardSublabel: 'RECORDING STUDIO',
    image: '/music_recording.jpg',
    seoAlt: 'Professional music recording studio with premium analog signal path and Neumann U87 microphones at Iydani Entertainment, Bengaluru',
    
    // Details Page Content
    subtitle: 'High-End Studio Tracking & Acoustic Spaces',
    longDescription1: 'Our flagship tracking rooms are built around acoustics that balance liveliness and control. We believe that capturing the perfect performance requires a space that inspires the performer and a signal path that retains every harmonic detail. Our live room boasts vaulted ceilings and custom-tuned diffusion, while our vocal booth offers absolute isolation for clean, pristine tracks.',
    longDescription2: 'From modern pop vocals to complex acoustic ensemble recordings, we tailor the signal chain specifically to the source. Vintage tube microphones, premium solid-state outboard compressors, and class-A conversion ensure your recording stands the test of time, needing minimal processing to sit perfectly in a professional mix.',
    technicalSpecs: [
      { category: 'Studio Space', items: ['35ft x 24ft Live Room with 15ft vaulted ceilings', 'Variable acoustic wood paneling & bass trapping', 'Private artist lounge & dedicated machine room'] },
      { category: 'Analog Signal Path', items: ['Neve 1073 and SSL Alpha VHD microphone preamps', 'Universal Audio & Tube-Tech outboard compressors', 'Antelope Audio Orion 32HD converters (192kHz)'] },
      { category: 'Microphone Locker', items: ['Neumann U87 Ai condenser microphone', 'Coles 4038 ribbon microphones (matched pair)', 'Shure SM7B, AKG C414 XLS, and Sennheiser MD421'] }
    ],
    imagePlaceholders: [
      { name: 'Live Recording Room', aspect: 'aspect-video', size: '1200 x 675', icon: 'mic' },
      { name: 'Outboard Hardware Rack', aspect: 'aspect-[4/3]', size: '800 x 600', image: '/recording_gallery_1.jpg' },
      { name: 'Control Room Console', aspect: 'aspect-square', size: '600 x 600', image: '/recording_gallery_2.jpg' },
      { name: 'Console Monitoring', aspect: 'aspect-[4/3]', size: '800 x 600', image: '/recording_gallery_3.jpg' }
    ]
  },
  {
    id: 'dubbing',
    num: '03 / Precise Post-Production',
    title: 'Music Editing & Audio Dubbing',
    description: 'Flawless multi-track alignment, dialogue replacement (ADR), and cinematic audio post-production. Our engineering workflow guarantees pristine alignment, noise restoration, and seamless dubbing for global distribution.',
    features: ['ADR / Dialogue Matching', 'Noise Restoration & Cleanup', 'Multi-Track DAW Workflows'],
    imageAlign: 'left',
    model: <AudioWaveform />,
    cameraPos: [0, 0.2, 8.0],
    modelPos: [0, -0.2, 0],
    cardLabel: '03',
    cardSublabel: 'AUDIO POST',
    image: '/control_room.jpg',
    seoAlt: 'Audio dubbing and ADR post-production control room with Pro Tools and spectral editing at Iydani Entertainment studio, Bengaluru',

    // Details Page Content
    subtitle: 'Cinematic Post-Production & Dialogue Integration',
    longDescription1: 'In the modern production pipeline, precision editing is where raw performances become master-class releases. We specialize in seamless dialogue replacement (ADR), vocal tuning, and detailed multi-track alignment that retains the natural feel and dynamics of the original performance.',
    longDescription2: 'Using industry-leading spectral editing and restoration software, we clean up compromised files, remove background hums, and level out uneven audio. Our engineers are trained in the art of ADR matching, ensuring that studio-recorded dialogue sounds perfectly integrated into the visual environment.',
    technicalSpecs: [
      { category: 'Editing Suite', items: ['Acoustically deadened ADR recording booth', 'Precise synchronization hardware with LTC timecode', 'Stereo and 5.1 surround sound monitor configuration'] },
      { category: 'Software & Tools', items: ['Avid Pro Tools Ultimate & Apple Logic Pro', 'iZotope RX Advanced spectral restoration suite', 'Synchro Arts Revoice Pro for alignment & tuning'] },
      { category: 'Monitoring', items: ['Genelec 8040B active nearfield monitors', 'SubPac tactile bass monitoring system', 'Beyerdynamic DT 990 Pro reference headphones'] }
    ],
    imagePlaceholders: [
      { name: 'Editing Suite Workspace', aspect: 'aspect-video', size: '1200 x 675', icon: 'sliders' },
      { name: 'ADR Dubbing Studio', aspect: 'aspect-[4/3]', size: '800 x 600', image: '/dubbing_gallery_2.jpg' },
      { name: 'Dialogue Microphone', aspect: 'aspect-square', size: '600 x 600', image: '/dubbing_gallery_1.jpg' },
      { name: 'MIDI Production Desk', aspect: 'aspect-[4/3]', size: '800 x 600', image: '/dubbing_gallery_3.jpg' }
    ]
  },
  {
    id: 'greenscreen',
    num: '04 / Immersive VFX Spaces',
    title: 'Cinema Green Screen Room',
    description: 'A dedicated chroma-key green screen room for VFX shoots, music videos, and virtual production. Features pre-lit cyclorama walls and premium camera rigs for seamless post-production integration.',
    features: ['Pre-Lit Cyclorama Space', 'VFX Chroma-Key Optimization', 'Camera Rig Integration'],
    imageAlign: 'right',
    model: <CinemaCamera />,
    cameraPos: [0, 0.1, 4.2],
    modelPos: [0, -0.15, 0],
    cardLabel: '04',
    cardSublabel: 'CHROMA SPACE',
    image: '/green_screen.png',
    seoAlt: 'Cinema-grade cyclorama green screen chroma key studio for music video and VFX production at Iydani Entertainment, Bengaluru',
    video: {
      webm: '/green_screen_360.webm',
      mp4: '/green_screen_360.mp4'
    },

    // Details Page Content
    subtitle: 'Virtual Production & Seamless VFX Environments',
    longDescription1: 'Our cyclorama green screen space is built specifically for virtual productions, high-end commercial VFX shoots, and music videos. The room features a seamless U-shaped green screen wall that is pre-lit with high-CRI soft lights to ensure clean, shadowless chroma-key keys.',
    longDescription2: 'Designed to handle complex camera tracking and high-frame-rate filming, the studio has isolated power grids, soundproofing, and full camera rig integration. This allows visual effects artists to easily composite scenes with pixel-perfect accuracy during post-production.',
    technicalSpecs: [
      { category: 'Chroma Cyclorama', items: ['24ft Wide x 20ft Deep x 12ft High U-shaped wall', 'Seamless corner construction for infinite depth', 'Heavy soundproofing for simultaneous audio recording'] },
      { category: 'Lighting & Rigging', items: ['DMX-controlled overhead LED soft panels (high-CRI)', 'Arri Skypanels and Aputure studio spotlights available', 'Isolated 100A 3-phase clean power distribution'] },
      { category: 'Camera & Support', items: ['DJI Ronin 2 and heavy-duty dolly tracking system', 'Teradek wireless video monitoring kits', 'High-speed wireless network for raw file offloads'] }
    ],
    imagePlaceholders: [
      { name: 'Cyclorama Studio View', aspect: 'aspect-video', size: '1200 x 675', icon: 'camera' },
      { name: 'Camera Rig & Dolly', aspect: 'aspect-[4/3]', size: '800 x 600', icon: 'cog' },
      { name: 'Live Keying Monitor', aspect: 'aspect-square', size: '600 x 600', icon: 'video' },
      { name: 'Overhead Lighting Grid', aspect: 'aspect-[4/3]', size: '800 x 600', icon: 'layers' }
    ]
  }
]
