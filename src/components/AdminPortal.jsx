import React, { useState, useEffect } from 'react';

export default function AdminPortal() {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [authorized, setAuthorized] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: 'admin@iyedani.com', password: 'admin123' });
  const [loginError, setLoginError] = useState(null);
  const [activeTab, setActiveTab] = useState('settings');

  const [settings, setSettings] = useState({
    logoText: '', tagline: '', description: '', email: '', phone: '', address: '', youtubeUrl: '', instagramUrl: '', linkedinUrl: '', whatsappUrl: '', bgVideoUrl: '',
    aboutText1: '', aboutText2: '', aboutImage: '', team: [], entertainmentServices: [], studioServices: []
  });
  const [contactSubs, setContactSubs] = useState([]);
  const [careerSubs, setCareerSubs] = useState([]);
  const [news, setNews] = useState([]);
  const [releases, setReleases] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [privacyPolicy, setPrivacyPolicy] = useState('');

  // Form states for creating new items
  const [newNews, setNewNews] = useState({ title: '', category: 'Announcement', summary: '', content: '', image: '' });
  const [newRelease, setNewRelease] = useState({ title: '', artist: '', genre: 'Soundtrack', image: '', releaseDate: '' });
  const [newJob, setNewJob] = useState({ title: '', department: 'Studios', type: 'Full-time', location: 'Bengaluru', description: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

  // Notifications
  const [notice, setNotice] = useState({ type: '', msg: '' });

  const showNotice = (type, msg) => {
    setNotice({ type, msg });
    setTimeout(() => setNotice({ type: '', msg: '' }), 4000);
  };

  const loadData = () => {
    const headers = { 'Authorization': `Bearer ${token}` };

    // Fetch site settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));

    // Fetch contact submissions
    fetch('/api/submissions/contact', { headers })
      .then(res => res.json())
      .then(data => setContactSubs(data))
      .catch(err => console.error(err));

    // Fetch career applications
    fetch('/api/submissions/career', { headers })
      .then(res => res.json())
      .then(data => setCareerSubs(data))
      .catch(err => console.error(err));

    // Fetch news
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(err => console.error(err));

    // Fetch releases
    fetch('/api/releases')
      .then(res => res.json())
      .then(data => setReleases(data))
      .catch(err => console.error(err));

    // Fetch jobs
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err));

    // Fetch privacy policy
    fetch('/api/privacy-policy')
      .then(res => res.json())
      .then(data => setPrivacyPolicy(data.policy))
      .catch(err => console.error(err));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError(null);
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm)
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('admin_token', data.token);
          setToken(data.token);
        } else {
          setLoginError(data.error || 'Invalid credentials.');
        }
      })
      .catch(() => setLoginError('Connection failed.'));
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken('');
    setAuthorized(false);
  };

  // Check auth status on mount/token change
  useEffect(() => {
    if (!token) {
      setAuthorized(false);
      return;
    }
    fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) {
          setAuthorized(true);
          loadData();
        } else {
          handleLogout();
        }
      })
      .catch(() => handleLogout());
  }, [token]);

  // Update Settings
  const saveSettings = (e) => {
    e.preventDefault();
    fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(settings)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showNotice('success', 'Global settings updated!');
        } else {
          showNotice('error', data.error || 'Failed to update settings.');
        }
      })
      .catch(() => showNotice('error', 'Network error.'));
  };

  const handleTeamChange = (index, field, value) => {
    setSettings(prev => {
      const updatedTeam = [...(prev.team || [])];
      while (updatedTeam.length <= index) {
        updatedTeam.push({ name: '', role: '', bio: '', initials: '', image: '' });
      }
      updatedTeam[index] = { ...updatedTeam[index], [field]: value };
      return { ...prev, team: updatedTeam };
    });
  };

  const handleServiceChange = (category, index, field, value) => {
    setSettings(prev => {
      const listKey = category === 'entertainment' ? 'entertainmentServices' : 'studioServices';
      const updatedList = [...(prev[listKey] || [])];
      while (updatedList.length <= index) {
        updatedList.push({ title: '', desc: '', icon: '' });
      }
      updatedList[index] = { ...updatedList[index], [field]: value };
      return { ...prev, [listKey]: updatedList };
    });
  };

  const addService = (category) => {
    setSettings(prev => {
      const listKey = category === 'entertainment' ? 'entertainmentServices' : 'studioServices';
      const updatedList = [...(prev[listKey] || [])];
      updatedList.push({ title: 'New Service', desc: 'Service description...', icon: '⭐' });
      return { ...prev, [listKey]: updatedList };
    });
  };

  const removeService = (category, index) => {
    if (!confirm('Are you sure you want to remove this service?')) return;
    setSettings(prev => {
      const listKey = category === 'entertainment' ? 'entertainmentServices' : 'studioServices';
      const updatedList = (prev[listKey] || []).filter((_, i) => i !== index);
      return { ...prev, [listKey]: updatedList };
    });
  };

  // Change Password
  const changePassword = (e) => {
    e.preventDefault();
    fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(passwordForm)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showNotice('success', 'Admin password updated successfully!');
          setPasswordForm({ currentPassword: '', newPassword: '' });
        } else {
          showNotice('error', data.error || 'Failed to change password.');
        }
      })
      .catch(() => showNotice('error', 'Network error.'));
  };

  // Update Privacy Policy
  const savePrivacyPolicy = () => {
    fetch('/api/privacy-policy', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ policy: privacyPolicy })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showNotice('success', 'Privacy Policy updated!');
        } else {
          showNotice('error', 'Failed to update policy.');
        }
      })
      .catch(() => showNotice('error', 'Network error.'));
  };

  // Generic file uploader tool helper
  const uploadFile = (file, callback) => {
    const formData = new FormData();
    formData.append('file', file);
    fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          callback(data.url);
          showNotice('success', 'Media uploaded successfully!');
        } else {
          showNotice('error', 'Upload failed.');
        }
      })
      .catch(() => showNotice('error', 'Network error during upload.'));
  };

  // Delete handlers
  const deleteNews = (id) => {
    if (!confirm('Are you sure you want to delete this news article?')) return;
    fetch(`/api/news/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNews(prev => prev.filter(item => item.id !== id));
          showNotice('success', 'News deleted.');
        }
      });
  };

  const deleteRelease = (id) => {
    if (!confirm('Are you sure you want to delete this release?')) return;
    fetch(`/api/releases/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReleases(prev => prev.filter(item => item.id !== id));
          showNotice('success', 'Release deleted.');
        }
      });
  };

  const deleteJob = (id) => {
    if (!confirm('Are you sure you want to delete this job position?')) return;
    fetch(`/api/jobs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setJobs(prev => prev.filter(item => item.id !== id));
          showNotice('success', 'Job opening deleted.');
        }
      });
  };

  const deleteCareerSub = (id) => {
    if (!confirm('Are you sure you want to delete this job application?')) return;
    fetch(`/api/submissions/career/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCareerSubs(prev => prev.filter(item => item.id !== id));
          showNotice('success', 'Job application deleted.');
        } else {
          showNotice('error', data.error || 'Failed to delete application.');
        }
      })
      .catch(() => showNotice('error', 'Network error.'));
  };

  const deleteContactSub = (id) => {
    if (!confirm('Are you sure you want to delete this contact enquiry?')) return;
    fetch(`/api/submissions/contact/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setContactSubs(prev => prev.filter(item => item.id !== id));
          showNotice('success', 'Contact enquiry deleted.');
        } else {
          showNotice('error', data.error || 'Failed to delete contact enquiry.');
        }
      })
      .catch(() => showNotice('error', 'Network error.'));
  };

  // Create handlers
  const createNews = (e) => {
    e.preventDefault();
    fetch('/api/news', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newNews)
    })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setNews(prev => [data, ...prev]);
          setNewNews({ title: '', category: 'Announcement', summary: '', content: '', image: '' });
          showNotice('success', 'News article published!');
        }
      });
  };

  const createRelease = (e) => {
    e.preventDefault();
    fetch('/api/releases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newRelease)
    })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setReleases(prev => [data, ...prev]);
          setNewRelease({ title: '', artist: '', genre: 'Soundtrack', image: '', releaseDate: '' });
          showNotice('success', 'Audio release added!');
        }
      });
  };

  const createJob = (e) => {
    e.preventDefault();
    fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newJob)
    })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setJobs(prev => [data, ...prev]);
          setNewJob({ title: '', department: 'Studios', type: 'Full-time', location: 'Bengaluru', description: '' });
          showNotice('success', 'Job vacancy created!');
        }
      });
  };

  // Render Login page if not authorized
  if (!authorized) {
    return (
      <div className="relative z-10 w-full min-h-screen bg-parchment flex items-center justify-center p-6 select-text">
        <div className="w-full max-w-sm bg-parchment-light border border-charcoal/10 p-8 rounded-3xl shadow-md space-y-6">
          <div className="text-center space-y-1">
            <h1 className="font-heading text-3xl text-charcoal font-bold tracking-wider">Studio Control</h1>
            <p className="font-body text-[10px] text-sage font-bold tracking-widest uppercase">Admin Portal Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-red-100 text-red-700 text-xs rounded-lg font-body">{loginError}</div>
            )}
            <div className="space-y-1">
              <label htmlFor="login-email" className="font-body text-[10px] tracking-wider uppercase font-bold text-charcoal-light">Email Address</label>
              <input 
                id="login-email"
                type="email" 
                value={loginForm.email}
                onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                placeholder="admin@domain.com"
                className="w-full px-4 py-2.5 bg-white border border-charcoal/15 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="login-password" className="font-body text-[10px] tracking-wider uppercase font-bold text-charcoal-light">Secret Key</label>
              <input 
                id="login-password"
                type="password" 
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white border border-charcoal/15 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none"
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-3 bg-charcoal text-parchment hover:bg-wood hover:text-charcoal-dark font-body text-xs tracking-widest uppercase font-bold rounded-lg cursor-pointer transition-colors duration-300"
            >
              Sign In
            </button>
          </form>
          
          <div className="text-center">
            <span className="font-body text-[9px] text-charcoal-light opacity-50 block">Default Keys: admin@iyedani.com / admin123</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full min-h-screen bg-parchment pt-24 pb-16 px-6 md:px-12 select-text">
      {/* Toast Notification */}
      {notice.msg && (
        <div className={`fixed top-20 right-6 z-50 p-4 rounded-xl shadow-md font-body text-xs ${
          notice.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {notice.msg}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Dashboard Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-charcoal/10 pb-4">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl text-charcoal font-bold tracking-wide">
              Admin Dashboard
            </h1>
            <p className="font-body text-[10px] text-sage font-bold tracking-widest uppercase mt-0.5">
              Live Production Manager
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 font-body text-[10px] tracking-wider uppercase font-bold rounded-full transition-colors cursor-pointer"
          >
            Log Out
          </button>
        </div>

        {/* Dash Tabs */}
        <div className="flex flex-wrap border-b border-charcoal/10 gap-4 md:gap-8 pb-1.5">
          {['settings', 'submissions', 'news', 'releases', 'jobs', 'privacy'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-body text-xs tracking-widest uppercase font-bold relative py-2 transition-all cursor-pointer duration-300 ${
                activeTab === tab ? 'text-charcoal' : 'text-charcoal-light opacity-40 hover:opacity-100'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-wood rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* ────────── TAB CONTENT: SETTINGS ────────── */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <form onSubmit={saveSettings} className="md:col-span-2 bg-parchment-light border border-charcoal/5 p-8 rounded-3xl space-y-4">
              <h2 className="font-heading text-xl text-charcoal font-bold tracking-wider border-b border-charcoal/5 pb-2">Global Placeholder Assets</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">Brand Logo Text</label>
                  <input type="text" value={settings.logoText} onChange={e => setSettings({...settings, logoText: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">Hero Tagline</label>
                  <input type="text" value={settings.tagline} onChange={e => setSettings({...settings, tagline: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">Hero Background Video Link (YouTube Embed URL)</label>
                <input type="text" value={settings.bgVideoUrl} onChange={e => setSettings({...settings, bgVideoUrl: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none" />
              </div>

              <div className="space-y-1">
                <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">Site Introduction</label>
                <textarea rows="3" value={settings.description} onChange={e => setSettings({...settings, description: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none"></textarea>
              </div>

              <h2 className="font-heading text-xl text-charcoal font-bold tracking-wider border-b border-charcoal/5 pt-4 pb-2">Office & Contact Telemetry</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">Email Address</label>
                  <input type="email" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">Phone Contact</label>
                  <input type="text" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">Office Address</label>
                <input type="text" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">WhatsApp URL</label>
                  <input type="text" value={settings.whatsappUrl} onChange={e => setSettings({...settings, whatsappUrl: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">YouTube Channel URL</label>
                  <input type="text" value={settings.youtubeUrl} onChange={e => setSettings({...settings, youtubeUrl: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none" />
                </div>
              </div>

              <h2 className="font-heading text-xl text-charcoal font-bold tracking-wider border-b border-charcoal/5 pt-4 pb-2">About Page Content</h2>
              
              <div className="space-y-1">
                <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">About Us - Paragraph 1</label>
                <textarea rows="3" value={settings.aboutText1 || ''} onChange={e => setSettings({...settings, aboutText1: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none"></textarea>
              </div>

              <div className="space-y-1">
                <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">About Us - Paragraph 2</label>
                <textarea rows="3" value={settings.aboutText2 || ''} onChange={e => setSettings({...settings, aboutText2: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:border-wood focus:outline-none"></textarea>
              </div>

              <div className="space-y-1">
                <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">About Image Upload / URL</label>
                <div className="flex flex-col gap-2">
                  <input type="file" accept="image/*" onChange={e => uploadFile(e.target.files[0], (url) => setSettings({...settings, aboutImage: url}))} className="font-body text-xs text-charcoal-light file:py-1 file:px-3 file:rounded-full file:bg-wood/10 file:text-wood file:border-0 cursor-pointer" />
                  <input type="text" value={settings.aboutImage || ''} onChange={e => setSettings({...settings, aboutImage: e.target.value})} placeholder="Pasted image URL or relative path" className="w-full px-3 py-1.5 bg-white border border-charcoal/10 rounded-md font-body text-[11px]" />
                </div>
              </div>

              <h2 className="font-heading text-xl text-charcoal font-bold tracking-wider border-b border-charcoal/5 pt-4 pb-2">Leadership Team Configuration</h2>
              
              {[0, 1, 2].map((idx) => {
                const member = (settings.team && settings.team[idx]) || { name: '', role: '', bio: '', initials: '', image: '' };
                const roles = ['Founder & CEO', 'Creative Mentor & Advisory Head', 'Head of Sound & VFX'];
                return (
                  <div key={idx} className="bg-white/40 border border-charcoal/5 p-4 rounded-xl space-y-3">
                    <h4 className="font-heading text-xs text-charcoal font-bold">{roles[idx]}</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="font-body text-[8px] uppercase tracking-wider text-charcoal-light">Name</label>
                        <input type="text" value={member.name || ''} onChange={e => handleTeamChange(idx, 'name', e.target.value)} className="w-full px-2 py-1 bg-white border border-charcoal/10 rounded-md font-body text-[11px]" />
                      </div>
                      <div className="space-y-1">
                        <label className="font-body text-[8px] uppercase tracking-wider text-charcoal-light">Role Title</label>
                        <input type="text" value={member.role || ''} onChange={e => handleTeamChange(idx, 'role', e.target.value)} className="w-full px-2 py-1 bg-white border border-charcoal/10 rounded-md font-body text-[11px]" />
                      </div>
                      <div className="space-y-1">
                        <label className="font-body text-[8px] uppercase tracking-wider text-charcoal-light">Initials</label>
                        <input type="text" value={member.initials || ''} onChange={e => handleTeamChange(idx, 'initials', e.target.value)} className="w-full px-2 py-1 bg-white border border-charcoal/10 rounded-md font-body text-[11px]" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="font-body text-[8px] uppercase tracking-wider text-charcoal-light">Biography</label>
                      <textarea rows="2" value={member.bio || ''} onChange={e => handleTeamChange(idx, 'bio', e.target.value)} className="w-full px-2 py-1.5 bg-white border border-charcoal/10 rounded-md font-body text-[11px]"></textarea>
                    </div>
                    <div className="space-y-1">
                      <label className="font-body text-[8px] uppercase tracking-wider text-charcoal-light">Photo Image (Upload or relative path)</label>
                      <div className="flex flex-col sm:flex-row gap-2 items-center">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={e => {
                            if (e.target.files && e.target.files[0]) {
                              uploadFile(e.target.files[0], (url) => handleTeamChange(idx, 'image', url));
                            }
                          }} 
                          className="font-body text-[10px] text-charcoal-light file:py-0.5 file:px-2 file:rounded-full file:bg-wood/10 file:text-wood file:border-0 cursor-pointer w-full sm:w-auto" 
                        />
                        <input 
                          type="text" 
                          value={member.image || ''} 
                          onChange={e => handleTeamChange(idx, 'image', e.target.value)} 
                          placeholder="Image URL or relative path (e.g. /uploads/file-123.jpg)" 
                          className="flex-1 px-2 py-1 bg-white border border-charcoal/10 rounded-md font-body text-[11px] w-full focus:outline-none" 
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              <h2 className="font-heading text-xl text-charcoal font-bold tracking-wider border-b border-charcoal/5 pt-4 pb-2">Entertainment Services</h2>
              <div className="space-y-4">
                {(settings.entertainmentServices || []).map((service, idx) => (
                  <div key={idx} className="bg-white/40 border border-charcoal/5 p-4 rounded-xl space-y-3 relative">
                    <button 
                      type="button" 
                      onClick={() => removeService('entertainment', idx)} 
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xs uppercase cursor-pointer"
                    >
                      Remove
                    </button>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1 col-span-1">
                        <label className="font-body text-[8px] uppercase tracking-wider text-charcoal-light">Icon (Emoji/Character)</label>
                        <input type="text" value={service.icon || ''} onChange={e => handleServiceChange('entertainment', idx, 'icon', e.target.value)} className="w-full px-2 py-1 bg-white border border-charcoal/10 rounded-md font-body text-[11px]" />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className="font-body text-[8px] uppercase tracking-wider text-charcoal-light">Service Title</label>
                        <input type="text" value={service.title || ''} onChange={e => handleServiceChange('entertainment', idx, 'title', e.target.value)} className="w-full px-2 py-1 bg-white border border-charcoal/10 rounded-md font-body text-[11px]" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="font-body text-[8px] uppercase tracking-wider text-charcoal-light">Description</label>
                      <textarea rows="2" value={service.desc || ''} onChange={e => handleServiceChange('entertainment', idx, 'desc', e.target.value)} className="w-full px-2 py-1 bg-white border border-charcoal/10 rounded-md font-body text-[11px]"></textarea>
                    </div>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addService('entertainment')}
                  className="px-4 py-1.5 bg-sage/10 text-sage hover:bg-sage/20 font-body text-[10px] tracking-wider uppercase font-bold rounded-md transition-colors cursor-pointer"
                >
                  + Add Entertainment Service
                </button>
              </div>

              <h2 className="font-heading text-xl text-charcoal font-bold tracking-wider border-b border-charcoal/5 pt-4 pb-2">Studio & Production Services</h2>
              <div className="space-y-4">
                {(settings.studioServices || []).map((service, idx) => (
                  <div key={idx} className="bg-white/40 border border-charcoal/5 p-4 rounded-xl space-y-3 relative">
                    <button 
                      type="button" 
                      onClick={() => removeService('studio', idx)} 
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xs uppercase cursor-pointer"
                    >
                      Remove
                    </button>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1 col-span-1">
                        <label className="font-body text-[8px] uppercase tracking-wider text-charcoal-light">Icon (Emoji/Character)</label>
                        <input type="text" value={service.icon || ''} onChange={e => handleServiceChange('studio', idx, 'icon', e.target.value)} className="w-full px-2 py-1 bg-white border border-charcoal/10 rounded-md font-body text-[11px]" />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className="font-body text-[8px] uppercase tracking-wider text-charcoal-light">Service Title</label>
                        <input type="text" value={service.title || ''} onChange={e => handleServiceChange('studio', idx, 'title', e.target.value)} className="w-full px-2 py-1 bg-white border border-charcoal/10 rounded-md font-body text-[11px]" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="font-body text-[8px] uppercase tracking-wider text-charcoal-light">Description</label>
                      <textarea rows="2" value={service.desc || ''} onChange={e => handleServiceChange('studio', idx, 'desc', e.target.value)} className="w-full px-2 py-1 bg-white border border-charcoal/10 rounded-md font-body text-[11px]"></textarea>
                    </div>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addService('studio')}
                  className="px-4 py-1.5 bg-sage/10 text-sage hover:bg-sage/20 font-body text-[10px] tracking-wider uppercase font-bold rounded-md transition-colors cursor-pointer"
                >
                  + Add Studio & Production Service
                </button>
              </div>

              <button type="submit" className="px-6 py-2.5 bg-wood text-white hover:bg-wood-dark font-body text-xs tracking-widest uppercase font-bold rounded-lg cursor-pointer transition-colors duration-300">
                Save Global Config
              </button>
            </form>

            {/* Change Password Block */}
            <div className="bg-parchment-light border border-charcoal/5 p-8 rounded-3xl space-y-4">
              <h2 className="font-heading text-xl text-charcoal font-bold tracking-wider border-b border-charcoal/5 pb-2">Change Admin Password</h2>
              <form onSubmit={changePassword} className="space-y-3">
                <div className="space-y-1">
                  <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">Current Secret Key</label>
                  <input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:outline-none focus:border-wood" required />
                </div>
                <div className="space-y-1">
                  <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">New Secret Key</label>
                  <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:outline-none focus:border-wood" required />
                </div>
                <button type="submit" className="w-full py-2.5 bg-charcoal text-parchment hover:bg-wood hover:text-charcoal-dark font-body text-xs tracking-widest uppercase font-bold rounded-lg cursor-pointer transition-colors duration-300">
                  Update Key
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ────────── TAB CONTENT: SUBMISSIONS ────────── */}
        {activeTab === 'submissions' && (
          <div className="space-y-8">
            {/* Contact Submissions */}
            <div className="bg-parchment-light border border-charcoal/5 p-6 rounded-3xl space-y-4">
              <h2 className="font-heading text-2xl text-charcoal font-bold tracking-wide">Contact Enquiries ({contactSubs.length})</h2>
              
              {contactSubs.length === 0 ? (
                <p className="font-body text-charcoal-light text-xs italic">No contact submissions found in KV.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body text-xs text-charcoal-light">
                    <thead>
                      <tr className="border-b border-charcoal/10 uppercase text-[9px] tracking-wider font-bold">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Name</th>
                        <th className="py-2.5 px-3">Email</th>
                        <th className="py-2.5 px-3">Inquiry Details</th>
                        <th className="py-2.5 px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5">
                      {contactSubs.map(sub => (
                        <tr key={sub.id} className="hover:bg-charcoal/[0.02] transition-colors">
                          <td className="py-3 px-3 font-mono text-[10px] text-sage-dark whitespace-nowrap">{new Date(sub.createdAt).toLocaleString()}</td>
                          <td className="py-3 px-3 font-bold text-charcoal">{sub.name}</td>
                          <td className="py-3 px-3">{sub.email}</td>
                          <td className="py-3 px-3 whitespace-pre-wrap">{sub.message}</td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <button 
                              onClick={() => deleteContactSub(sub.id)} 
                              className="px-2.5 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded font-body text-[10px] font-bold uppercase transition-all cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Career Applications */}
            <div className="bg-parchment-light border border-charcoal/5 p-6 rounded-3xl space-y-4">
              <h2 className="font-heading text-2xl text-charcoal font-bold tracking-wide">Job Applications ({careerSubs.length})</h2>
              
              {careerSubs.length === 0 ? (
                <p className="font-body text-charcoal-light text-xs italic">No career applications found in KV.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body text-xs text-charcoal-light">
                    <thead>
                      <tr className="border-b border-charcoal/10 uppercase text-[9px] tracking-wider font-bold">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Position</th>
                        <th className="py-2.5 px-3">Applicant</th>
                        <th className="py-2.5 px-3">Resume</th>
                        <th className="py-2.5 px-3">Cover Letter Note</th>
                        <th className="py-2.5 px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5">
                      {careerSubs.map(sub => (
                        <tr key={sub.id} className="hover:bg-charcoal/[0.02] transition-colors">
                          <td className="py-3 px-3 font-mono text-[10px] text-sage-dark whitespace-nowrap">{new Date(sub.createdAt).toLocaleString()}</td>
                          <td className="py-3 px-3 font-bold text-charcoal whitespace-nowrap">{sub.jobTitle}</td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="font-bold">{sub.name}</div>
                            <div className="text-[10px]">{sub.email}</div>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            {sub.resumeUrl ? (
                              <a href={sub.resumeUrl} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 bg-wood/10 text-wood rounded hover:bg-wood/20 transition-all font-bold tracking-wider uppercase text-[9px]">
                                View File
                              </a>
                            ) : (
                              <span className="text-charcoal/30">No link</span>
                            )}
                          </td>
                          <td className="py-3 px-3 whitespace-pre-wrap">{sub.coverLetter}</td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <button 
                              onClick={() => deleteCareerSub(sub.id)} 
                              className="px-2.5 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded font-body text-[10px] font-bold uppercase transition-all cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ────────── TAB CONTENT: NEWS ────────── */}
        {activeTab === 'news' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Create news form */}
            <form onSubmit={createNews} className="bg-parchment-light border border-charcoal/5 p-6 rounded-3xl space-y-4">
              <h2 className="font-heading text-xl text-charcoal font-bold tracking-wider border-b border-charcoal/5 pb-2">Publish News Article</h2>
              
              <div className="space-y-1">
                <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">Title *</label>
                <input type="text" value={newNews.title} onChange={e => setNewNews({...newNews, title: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:outline-none" required />
              </div>
              <div className="space-y-1">
                <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">Category *</label>
                <select value={newNews.category} onChange={e => setNewNews({...newNews, category: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:outline-none" required>
                  <option value="Announcement">Announcement</option>
                  <option value="Studio Update">Studio Update</option>
                  <option value="Releases">Releases</option>
                  <option value="Mentorship">Mentorship</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">Image Upload / URL</label>
                <div className="flex flex-col gap-2">
                  <input type="file" accept="image/*" onChange={e => uploadFile(e.target.files[0], (url) => setNewNews({...newNews, image: url}))} className="font-body text-xs text-charcoal-light file:py-1 file:px-3 file:rounded-full file:bg-wood/10 file:text-wood file:border-0 hover:file:bg-wood/20 cursor-pointer" />
                  <input type="text" value={newNews.image} onChange={e => setNewNews({...newNews, image: e.target.value})} placeholder="Pasted image URL or relative path" className="w-full px-3 py-1.5 bg-white border border-charcoal/10 rounded-md font-body text-[11px]" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">Short Summary *</label>
                <textarea rows="2" value={newNews.summary} onChange={e => setNewNews({...newNews, summary: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:outline-none" required></textarea>
              </div>
              
              <button type="submit" className="w-full py-2.5 bg-wood text-white hover:bg-wood-dark font-body text-xs tracking-widest uppercase font-bold rounded-lg cursor-pointer transition-colors duration-300">
                Publish Article
              </button>
            </form>

            {/* List news */}
            <div className="md:col-span-2 bg-parchment-light border border-charcoal/5 p-6 rounded-3xl space-y-4">
              <h2 className="font-heading text-xl text-charcoal font-bold tracking-wider border-b border-charcoal/5 pb-2">Active Articles</h2>
              <div className="divide-y divide-charcoal/10">
                {news.map(item => (
                  <div key={item.id} className="py-4 flex justify-between items-center gap-4">
                    <div>
                      <h4 className="font-heading text-lg text-charcoal font-bold">{item.title}</h4>
                      <p className="font-body text-[10px] text-sage-dark font-bold uppercase tracking-wider">{item.category} &bull; {item.date}</p>
                      <p className="font-body text-charcoal-light text-xs leading-relaxed font-light mt-1">{item.summary}</p>
                    </div>
                    <button onClick={() => deleteNews(item.id)} className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 font-body text-[10px] tracking-wider uppercase font-bold rounded-full transition-colors cursor-pointer whitespace-nowrap">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ────────── TAB CONTENT: RELEASES ────────── */}
        {activeTab === 'releases' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <form onSubmit={createRelease} className="bg-parchment-light border border-charcoal/5 p-6 rounded-3xl space-y-4">
              <h2 className="font-heading text-xl text-charcoal font-bold tracking-wider border-b border-charcoal/5 pb-2">Add Audio Release</h2>
              
              <div className="space-y-1">
                <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">Album/Single Title *</label>
                <input type="text" value={newRelease.title} onChange={e => setNewRelease({...newRelease, title: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:outline-none" required />
              </div>
              <div className="space-y-1">
                <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">Artist/Band *</label>
                <input type="text" value={newRelease.artist} onChange={e => setNewRelease({...newRelease, artist: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:outline-none" required />
              </div>
              <div className="space-y-1">
                <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">Genre *</label>
                <input type="text" value={newRelease.genre} onChange={e => setNewRelease({...newRelease, genre: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:outline-none" required />
              </div>
              <div className="space-y-1">
                <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">Cover Image Upload/URL</label>
                <div className="flex flex-col gap-2">
                  <input type="file" accept="image/*" onChange={e => uploadFile(e.target.files[0], (url) => setNewRelease({...newRelease, image: url}))} className="font-body text-xs text-charcoal-light file:py-1 file:px-3 file:rounded-full file:bg-wood/10 file:text-wood file:border-0 cursor-pointer" />
                  <input type="text" value={newRelease.image} onChange={e => setNewRelease({...newRelease, image: e.target.value})} placeholder="Pasted image URL or relative path" className="w-full px-3 py-1.5 bg-white border border-charcoal/10 rounded-md font-body text-[11px]" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">Release Date</label>
                <input type="date" value={newRelease.releaseDate} onChange={e => setNewRelease({...newRelease, releaseDate: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:outline-none" />
              </div>
              
              <button type="submit" className="w-full py-2.5 bg-wood text-white hover:bg-wood-dark font-body text-xs tracking-widest uppercase font-bold rounded-lg cursor-pointer transition-colors duration-300">
                Add Release
              </button>
            </form>

            <div className="md:col-span-2 bg-parchment-light border border-charcoal/5 p-6 rounded-3xl space-y-4">
              <h2 className="font-heading text-xl text-charcoal font-bold tracking-wider border-b border-charcoal/5 pb-2">Active Releases</h2>
              <div className="divide-y divide-charcoal/10">
                {releases.map(release => (
                  <div key={release.id} className="py-3 flex justify-between items-center gap-4">
                    <div>
                      <h4 className="font-heading text-lg text-charcoal font-bold">{release.title}</h4>
                      <p className="font-body text-xs text-charcoal-light leading-normal">{release.artist} &bull; <span className="text-sage-dark font-semibold font-mono text-[10px]">{release.genre}</span></p>
                      <p className="font-body text-[10px] text-charcoal-light/60 font-mono mt-0.5">Date: {release.releaseDate}</p>
                    </div>
                    <button onClick={() => deleteRelease(release.id)} className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 font-body text-[10px] tracking-wider uppercase font-bold rounded-full transition-colors cursor-pointer whitespace-nowrap">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ────────── TAB CONTENT: JOBS ────────── */}
        {activeTab === 'jobs' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <form onSubmit={createJob} className="bg-parchment-light border border-charcoal/5 p-6 rounded-3xl space-y-4">
              <h2 className="font-heading text-xl text-charcoal font-bold tracking-wider border-b border-charcoal/5 pb-2">Create Job opening</h2>
              
              <div className="space-y-1">
                <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">Job Title *</label>
                <input type="text" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:outline-none" required />
              </div>
              <div className="space-y-1">
                <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">Department *</label>
                <select value={newJob.department} onChange={e => setNewJob({...newJob, department: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:outline-none" required>
                  <option value="Studios">Studios & Recording</option>
                  <option value="Visual Production">Visual & VFX</option>
                  <option value="Administration">Administration</option>
                  <option value="Marketing">Marketing & Design</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">Contract Type *</label>
                <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:outline-none" required>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-body text-[9px] tracking-wider uppercase font-bold text-charcoal-light">Description *</label>
                <textarea rows="4" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg font-body text-xs text-charcoal focus:outline-none" required></textarea>
              </div>

              <button type="submit" className="w-full py-2.5 bg-wood text-white hover:bg-wood-dark font-body text-xs tracking-widest uppercase font-bold rounded-lg cursor-pointer transition-colors duration-300">
                Publish Opening
              </button>
            </form>

            <div className="md:col-span-2 bg-parchment-light border border-charcoal/5 p-6 rounded-3xl space-y-4">
              <h2 className="font-heading text-xl text-charcoal font-bold tracking-wider border-b border-charcoal/5 pb-2">Active Positions</h2>
              <div className="divide-y divide-charcoal/10">
                {jobs.map(job => (
                  <div key={job.id} className="py-4 flex justify-between items-center gap-4">
                    <div>
                      <h4 className="font-heading text-lg text-charcoal font-bold">{job.title}</h4>
                      <p className="font-body text-[10px] text-sage-dark font-bold uppercase tracking-wider">{job.department} &bull; {job.type} &bull; {job.location}</p>
                      <p className="font-body text-charcoal-light text-xs leading-relaxed font-light mt-1">{job.description}</p>
                    </div>
                    <button onClick={() => deleteJob(job.id)} className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 font-body text-[10px] tracking-wider uppercase font-bold rounded-full transition-colors cursor-pointer whitespace-nowrap">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ────────── TAB CONTENT: PRIVACY POLICY ────────── */}
        {activeTab === 'privacy' && (
          <div className="bg-parchment-light border border-charcoal/5 p-8 rounded-3xl space-y-4">
            <div className="flex justify-between items-center border-b border-charcoal/5 pb-2">
              <h2 className="font-heading text-2xl text-charcoal font-bold tracking-wide">Edit Privacy Policy</h2>
              <span className="font-body text-[9px] text-sage-dark font-mono uppercase tracking-wider">Markdown format supported</span>
            </div>
            
            <textarea 
              rows="12" 
              value={privacyPolicy} 
              onChange={e => setPrivacyPolicy(e.target.value)} 
              className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-xl font-body text-sm text-charcoal focus:border-wood focus:outline-none"
              placeholder="# Privacy Policy..."
            ></textarea>
            
            <button 
              onClick={savePrivacyPolicy}
              className="px-6 py-2.5 bg-wood text-white hover:bg-wood-dark font-body text-xs tracking-widest uppercase font-bold rounded-lg cursor-pointer transition-colors duration-300"
            >
              Update Policy Copy
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
