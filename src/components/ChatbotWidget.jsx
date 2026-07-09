import React, { useState, useEffect, useRef } from 'react'

export default function ChatbotWidget({ onNavigateToStudio }) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! Welcome to Iydani Entertainment. How can we help you today?'
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const botResponses = {
    contact: {
      text: 'You can reach us at:\n\n📧 Email: contact@iydani.com\n📞 Phone: +91 074115 44427\n💬 WhatsApp: +91 074115 44427\n\nVisitor hours by appointment only.',
      buttons: [
        { text: '💬 Chat on WhatsApp', value: 'whatsapp', external: 'https://wa.me/9107411544427' },
        { text: '⬅️ Main Menu', value: 'main' }
      ]
    },
    services: {
      text: 'We offer professional creative services:\n\n1️⃣ Visual Grading & Illustration\n2️⃣ Pristine Sound Capture\n3️⃣ Audio Dubbing & Post (ADR)\n4️⃣ Cinema Green Screen Room\n\nWould you like to explore these on our Studio page?',
      buttons: [
        { text: '📂 Explore Studio Services', value: 'go_to_studio' },
        { text: '⬅️ Main Menu', value: 'main' }
      ]
    },
    book: {
      text: 'To schedule studio time for audio tracking, ADR dubbing, or VFX shoots, connect with our booking desk via WhatsApp:',
      buttons: [
        { text: '📅 Book Studio Session', value: 'whatsapp', external: 'https://wa.me/9107411544427' },
        { text: '⬅️ Main Menu', value: 'main' }
      ]
    },
    location: {
      text: 'Our Production Head Office is located at:\n\n📍 Iydani Entertainment\n2nd Floor, 1092/93, 10th C Cross,\n11th Main Rd, Stage 2, Mahalakshmipuram,\nBengaluru, Karnataka 560086',
      buttons: [
        { text: '🗺️ Google Maps Directions', value: 'maps', external: 'https://maps.google.com/?q=Iydani+Entertainment+2nd+Floor+1092/93+10th+C+Cross+11th+Main+Rd+Stage+2+Mahalakshmipuram+Bengaluru+Karnataka+560086' },
        { text: '⬅️ Main Menu', value: 'main' }
      ]
    }
  }

  const [activeOptions, setActiveOptions] = useState([
    { text: '📞 Contact Details', value: 'contact' },
    { text: '🎙️ Studio Services', value: 'services' },
    { text: '📅 Book a Session', value: 'book' },
    { text: '📍 Office Location', value: 'location' }
  ])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleOptionClick = (option) => {
    if (option.external) {
      window.open(option.external, '_blank', 'noopener,noreferrer')
      return
    }

    if (option.value === 'go_to_studio') {
      onNavigateToStudio()
      setIsOpen(false)
      return
    }

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: option.text
    }
    setMessages(prev => [...prev, userMsg])
    setActiveOptions([]) // clear options during reply lag

    // Trigger typing lag
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      
      if (option.value === 'main') {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: 'How else can we assist you today?'
          }
        ])
        setActiveOptions([
          { text: '📞 Contact Details', value: 'contact' },
          { text: '🎙️ Studio Services', value: 'services' },
          { text: '📅 Book a Session', value: 'book' },
          { text: '📍 Office Location', value: 'location' }
        ])
      } else {
        const response = botResponses[option.value]
        if (response) {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: response.text
            }
          ])
          setActiveOptions(response.buttons)
        }
      }
    }, 550)
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) setHasUnread(false)
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-[99999] w-14 h-14 rounded-full bg-wood hover:bg-wood-dark text-[#FAF9F4] flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 hover:translate-y-[-2px] transition-all duration-300 pointer-events-auto cursor-pointer border border-white/10"
        aria-label="Toggle assistant chatbot"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            {hasUnread && (
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-wood animate-pulse"></span>
            )}
          </div>
        )}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[99999] w-[360px] max-w-[calc(100vw-2rem)] h-[480px] rounded-2xl bg-[#FAF9F4] border border-charcoal/10 shadow-2xl backdrop-blur-md flex flex-col overflow-hidden animate-fade-in pointer-events-auto select-text">
          
          {/* Header */}
          <div className="bg-charcoal px-5 py-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-wood/25 flex items-center justify-center text-wood font-heading font-black text-sm">
                I
              </div>
              <div>
                <h3 className="font-heading text-sm text-[#FAF9F4] font-bold tracking-wide">Iydani Assistant</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] text-parchment-light/60 font-body">Online &bull; Ready</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="text-parchment-light/40 hover:text-[#FAF9F4] transition-colors cursor-pointer"
              aria-label="Minimize chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-parchment/10">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-xl px-4 py-3 text-xs leading-relaxed font-body whitespace-pre-line shadow-sm border ${
                    msg.sender === 'user'
                      ? 'bg-charcoal text-[#FAF9F4] border-charcoal rounded-br-none'
                      : 'bg-white text-charcoal border-charcoal/5 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex w-full justify-start">
                <div className="bg-white text-charcoal-light border border-charcoal/5 rounded-xl rounded-bl-none px-4 py-2.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-sage animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-sage animate-bounce"></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Option Buttons Footer */}
          {activeOptions.length > 0 && (
            <div className="p-4 border-t border-charcoal/5 bg-white flex flex-col gap-2 max-h-[160px] overflow-y-auto">
              <span className="text-[9px] tracking-widest text-sage uppercase font-bold font-body px-1 mb-1 block">
                Choose an Option
              </span>
              <div className="flex flex-col gap-1.5">
                {activeOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionClick(opt)}
                    className="w-full text-left px-3.5 py-2.5 bg-parchment-warm/20 hover:bg-wood hover:text-white border border-charcoal/5 rounded-lg text-xs font-body font-medium transition-all duration-300 pointer-events-auto cursor-pointer text-charcoal"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
