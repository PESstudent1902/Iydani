import React, { useState, useEffect } from 'react';

export default function PrivacyRules() {
  const [policy, setPolicy] = useState('');

  useEffect(() => {
    fetch('/api/privacy-policy')
      .then(res => res.json())
      .then(data => {
        if (data && data.policy) {
          setPolicy(data.policy);
        } else {
          setPolicy('# Privacy Policy\n\nLast updated: June 09, 2026\n\nWe value your privacy. Your contact and career application submissions are securely stored and processed in compliance with modern data security practices. We do not sell or share your personal data with third parties.');
        }
      })
      .catch(() => {
        setPolicy('# Privacy Policy\n\nLast updated: June 09, 2026\n\nWe value your privacy. Your contact and career application submissions are securely stored and processed in compliance with modern data security practices. We do not sell or share your personal data with third parties.');
      });
  }, []);

  return (
    <div className="relative z-10 w-full min-h-screen bg-parchment pt-24 pb-16 px-6 md:px-16 select-text">
      <div className="max-w-3xl mx-auto bg-parchment-light border border-charcoal/5 p-8 md:p-12 rounded-3xl shadow-xs space-y-6">
        
        {/* Simple markdown-like renderer */}
        <div className="prose prose-stone max-w-none">
          {policy.split('\n\n').map((block, index) => {
            if (block.startsWith('# ')) {
              return (
                <h1 key={index} className="font-heading text-3xl md:text-5xl text-charcoal font-bold tracking-wide mb-6 border-b border-charcoal/10 pb-4">
                  {block.substring(2)}
                </h1>
              );
            }
            if (block.startsWith('## ')) {
              return (
                <h2 key={index} className="font-heading text-2xl text-charcoal font-semibold tracking-wide mt-6 mb-3">
                  {block.substring(3)}
                </h2>
              );
            }
            return (
              <p key={index} className="font-body text-charcoal-light text-sm md:text-base leading-relaxed font-light whitespace-pre-line">
                {block}
              </p>
            );
          })}
        </div>

        <div className="pt-6 border-t border-charcoal/10 flex justify-between items-center text-[10px] tracking-widest text-sage font-bold uppercase font-body">
          <span>Iydani Legal Compliance</span>
          <span>Nominal &bull;</span>
        </div>

      </div>
    </div>
  );
}
