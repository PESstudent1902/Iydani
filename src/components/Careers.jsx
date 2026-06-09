import React, { useState, useEffect } from 'react';

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', jobTitle: '', resumeUrl: '', coverLetter: '' });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setJobs(data);
          // Set initial dropdown value
          setForm(prev => ({ ...prev, jobTitle: data[0].title }));
        } else {
          const defaultJobs = [
            { id: '1', title: 'Senior Audio Engineer', department: 'Studios', type: 'Full-time', location: 'Bengaluru', description: 'Seeking a veteran recording & mixing engineer experienced with high-end analog paths.' },
            { id: '2', title: 'VFX Compositor', department: 'Visual Production', type: 'Full-time', location: 'Bengaluru', description: 'Experienced in green screen keying, camera tracking, and Blender/Nuke.' }
          ];
          setJobs(defaultJobs);
          setForm(prev => ({ ...prev, jobTitle: defaultJobs[0].title }));
        }
      })
      .catch(() => {
        const defaultJobs = [
          { id: '1', title: 'Senior Audio Engineer', department: 'Studios', type: 'Full-time', location: 'Bengaluru', description: 'Seeking a veteran recording & mixing engineer experienced with high-end analog paths.' },
          { id: '2', title: 'VFX Compositor', department: 'Visual Production', type: 'Full-time', location: 'Bengaluru', description: 'Experienced in green screen keying, camera tracking, and Blender/Nuke.' }
        ];
        setJobs(defaultJobs);
        setForm(prev => ({ ...prev, jobTitle: defaultJobs[0].title }));
      });
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setUploading(false);
        if (data.url) {
          setForm(prev => ({ ...prev, resumeUrl: data.url }));
        } else {
          setError('Failed to upload file.');
        }
      })
      .catch(() => {
        setUploading(false);
        setError('Upload failed. Please paste a URL instead.');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.jobTitle || !form.resumeUrl) {
      setError('Please fill in all required fields and upload your resume.');
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    fetch('/api/submissions/career', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        setSubmitting(false);
        if (data.success) {
          setSuccess('Your application has been submitted successfully!');
          setForm({ name: '', email: '', jobTitle: jobs[0]?.title || '', resumeUrl: '', coverLetter: '' });
        } else {
          setError(data.error || 'Failed to submit application.');
        }
      })
      .catch(() => {
        setSubmitting(false);
        setError('Network error. Failed to submit.');
      });
  };

  return (
    <div className="relative z-10 w-full min-h-screen bg-parchment pt-24 pb-16 px-6 md:px-16 select-text">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="space-y-3 text-center md:text-left">
          <span className="font-body text-xs tracking-[0.25em] text-sage font-bold uppercase block">
            Join Our Team
          </span>
          <h1 className="font-heading text-4xl md:text-6xl text-charcoal font-bold tracking-wide">
            Careers
          </h1>
          <p className="font-body text-charcoal-light text-sm md:text-base leading-relaxed font-light max-w-xl">
            Innovate at the intersection of acoustic craftsmanship and state-of-the-art cinematic visual systems.
          </p>
        </div>

        {/* Current Job Openings */}
        <div className="space-y-6">
          <h2 className="font-heading text-2xl md:text-3xl text-charcoal font-semibold tracking-wide">
            Open Positions
          </h2>

          <div className="space-y-4">
            {jobs.length === 0 ? (
              <p className="font-body text-charcoal-light text-xs italic">No open positions at the moment. Keep checking back!</p>
            ) : (
              jobs.map((job) => (
                <div 
                  key={job.id} 
                  className="bg-parchment-light border border-charcoal/5 p-6 rounded-2xl space-y-3 shadow-xs hover:border-wood/25 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h3 className="font-heading text-xl text-charcoal font-bold">{job.title}</h3>
                      <span className="font-body text-[10px] text-sage-dark font-bold uppercase tracking-wider">
                        {job.department} &bull; {job.type} &bull; {job.location}
                      </span>
                    </div>
                    <a 
                      href="#career-form-anchor"
                      onClick={() => setForm(prev => ({ ...prev, jobTitle: job.title }))}
                      className="px-4 py-1.5 border border-wood text-wood hover:bg-wood hover:text-white font-body text-[10px] tracking-wider uppercase font-bold rounded-full transition-colors duration-300"
                    >
                      Apply Now
                    </a>
                  </div>
                  <p className="font-body text-charcoal-light text-xs leading-relaxed font-light">
                    {job.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Application Form */}
        <div id="career-form-anchor" className="bg-parchment-light border border-charcoal/5 p-8 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h2 className="font-heading text-2xl md:text-3xl text-charcoal font-semibold tracking-wide">
              Submit Your Application
            </h2>
            <p className="font-body text-charcoal-light text-xs leading-relaxed font-light">
              Are you passionate about pristine acoustics or virtual cycloramas? Fill in the form and upload your resume to apply for any listed position or send a general application.
            </p>
            <div className="p-4 bg-parchment-warm border border-wood/10 rounded-xl space-y-2">
              <h4 className="font-heading text-sm text-charcoal font-bold">Local File Upload</h4>
              <p className="font-body text-[10px] text-charcoal-light leading-relaxed">
                You can select a PDF/DOCX resume file from your device, and it will be uploaded and stored directly on the studio server.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 text-red-700 text-xs rounded-lg font-body">{error}</div>
            )}
            {success && (
              <div className="p-3 bg-green-100 text-green-700 text-xs rounded-lg font-body">{success}</div>
            )}

            <div className="space-y-1">
              <label htmlFor="job-title-select" className="font-body text-[10px] tracking-wider uppercase font-bold text-charcoal-light">Position Applying For *</label>
              <select 
                id="job-title-select"
                value={form.jobTitle}
                onChange={e => setForm({...form, jobTitle: e.target.value})}
                className="w-full px-4 py-2.5 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none"
                required
              >
                {jobs.map(j => (
                  <option key={j.id} value={j.title}>{j.title}</option>
                ))}
                <option value="General Application">General Application</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="applicant-name" className="font-body text-[10px] tracking-wider uppercase font-bold text-charcoal-light">Full Name *</label>
              <input 
                id="applicant-name"
                type="text" 
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                placeholder="First and last name"
                className="w-full px-4 py-2.5 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="applicant-email" className="font-body text-[10px] tracking-wider uppercase font-bold text-charcoal-light">Email Address *</label>
              <input 
                id="applicant-email"
                type="email" 
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                placeholder="yourname@domain.com"
                className="w-full px-4 py-2.5 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="applicant-resume-file" className="font-body text-[10px] tracking-wider uppercase font-bold text-charcoal-light">Resume File (PDF/DOCX) *</label>
              <div className="flex flex-col gap-2">
                <input 
                  id="applicant-resume-file"
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="font-body text-xs text-charcoal-light file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-wood/10 file:text-wood hover:file:bg-wood/20 cursor-pointer"
                />
                
                <div className="flex items-center gap-2">
                  <span className="font-body text-[9px] uppercase tracking-wider text-sage font-bold">Or Paste URL:</span>
                  <input 
                    type="url" 
                    value={form.resumeUrl}
                    onChange={e => setForm({...form, resumeUrl: e.target.value})}
                    placeholder="Link to hosted resume"
                    className="flex-grow px-3 py-1 bg-white border border-charcoal/10 rounded-md font-body text-[11px] text-charcoal focus:border-wood focus:outline-none"
                  />
                </div>
                {uploading && <span className="font-body text-[10px] text-wood animate-pulse">Uploading file...</span>}
                {form.resumeUrl && (
                  <span className="font-body text-[10px] text-sage-dark font-semibold">
                    ✓ Resume Linked: <a href={form.resumeUrl} target="_blank" rel="noopener noreferrer" className="underline">{form.resumeUrl}</a>
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="applicant-coverletter" className="font-body text-[10px] tracking-wider uppercase font-bold text-charcoal-light">Cover Letter / Note</label>
              <textarea 
                id="applicant-coverletter"
                rows="4"
                value={form.coverLetter}
                onChange={e => setForm({...form, coverLetter: e.target.value})}
                placeholder="Briefly describe why you are a fit for this role..."
                className="w-full px-4 py-2.5 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={submitting || uploading}
              className="w-full py-3 bg-charcoal text-parchment hover:bg-wood hover:text-charcoal-dark font-body text-xs tracking-widest uppercase font-bold rounded-lg cursor-pointer transition-colors duration-300 disabled:opacity-50"
            >
              {submitting ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
