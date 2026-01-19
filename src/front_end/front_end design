    import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Check, Briefcase, MapPin, Sparkles, ChevronRight, Hash, User, DollarSign } from 'lucide-react';

// --- STYLES & ANIMATIONS ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Space+Grotesk:wght@300;400;500;700&display=swap');

  :root {
    --color-pine: #0f241d;
    --color-pine-light: #1a382e;
    --color-silk: #f2f0e9;
    --color-clay: #e0ddd5;
    --color-sienna: #c25e00;
    --color-text-main: #1a1a1a;
  }

  body {
    background-color: var(--color-pine);
    color: var(--color-text-main);
    font-family: 'Space Grotesk', sans-serif;
    overflow-x: hidden;
  }

  .font-editorial { font-family: 'Cormorant Garamond', serif; }
  .font-technical { font-family: 'Space Grotesk', sans-serif; }

  /* Grain Texture */
  .texture-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    opacity: 0.05;
    pointer-events: none;
    z-index: 50;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }

  /* Custom Transitions */
  .slide-enter {
    animation: slideIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  
  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .stagger-1 { animation-delay: 0.1s; }
  .stagger-2 { animation-delay: 0.2s; }
  .stagger-3 { animation-delay: 0.3s; }
  .stagger-4 { animation-delay: 0.4s; }

  /* Input Styling */
  .brutal-input {
    background: transparent;
    border: none;
    border-bottom: 1px solid #ccc;
    border-radius: 0;
    padding: 1rem 0;
    font-size: 1.25rem;
    width: 100%;
    transition: all 0.3s ease;
    font-family: 'Cormorant Garamond', serif;
    color: var(--color-pine);
  }
  
  .brutal-input:focus {
    outline: none;
    border-bottom: 2px solid var(--color-sienna);
    padding-left: 10px;
  }

  .brutal-input::placeholder {
    color: #9ca3af;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    opacity: 0.5;
  }

  /* Checkbox/Radio Styling */
  .tag-radio:checked + label {
    background-color: var(--color-pine);
    color: var(--color-silk);
    border-color: var(--color-pine);
  }

  .progress-line {
    transition: height 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }
`;

// --- COMPONENT LOGIC ---

export default function CandidateProfile() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    headline: '',
    experience: 'mid',
    skills: [],
    salary: '',
    location: '',
  });
  const [direction, setDirection] = useState('forward');

  // Steps Configuration
  const steps = [
    {
      id: 'identity',
      label: '01. Identity',
      title: 'Who are you in the market?',
      description: "Assured candidates aren't just names on a sheet. They are defined by their craft and their intent. Let's start with the basics.",
      fields: ['name', 'headline']
    },
    {
      id: 'craft',
      label: '02. The Craft',
      title: 'Define your expertise.',
      description: "Precision matters. Are you a strategist, a builder, or a leader? This helps us align you with roles that respect your seniority.",
      fields: ['experience', 'skills']
    },
    {
      id: 'terms',
      label: '03. The Terms',
      title: 'Set your boundaries.',
      description: "Transparency saves time. We only present opportunities that match your financial and geographical reality.",
      fields: ['salary', 'location']
    },
    {
      id: 'review',
      label: '04. Assurance',
      title: 'Confirm your profile.',
      description: "Review your dossier. Once submitted, our agents will curate opportunities that match your specific signature.",
      fields: ['review']
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setDirection('forward');
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setDirection('backward');
      setStep(step - 1);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill) => {
    setFormData(prev => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden">
      <style>{styles}</style>
      <div className="texture-overlay"></div>

      {/* --- LEFT PANEL: CONTEXT --- */}
      <div className="w-full md:w-[42%] bg-[#0f241d] text-[#f2f0e9] p-8 md:p-16 flex flex-col justify-between relative z-10 transition-all duration-700 ease-in-out">
        {/* Header */}
        <div className="slide-enter">
          <div className="flex items-center gap-2 mb-12 opacity-80">
            <div className="w-3 h-3 bg-[#c25e00]"></div>
            <span className="font-technical uppercase tracking-widest text-xs">Assured Recruitment</span>
          </div>
          
          {/* Dynamic Title */}
          <h1 className="font-editorial text-5xl md:text-6xl leading-[1.1] mb-6 stagger-1">
            {steps[step].title}
          </h1>
          <p className="font-technical text-[#8fa89e] text-lg leading-relaxed max-w-sm stagger-2">
            {steps[step].description}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="hidden md:flex flex-col gap-4 mt-auto stagger-3">
            {steps.map((s, i) => (
                <div key={s.id} className={`flex items-center gap-4 transition-all duration-500 ${i === step ? 'opacity-100 translate-x-2' : 'opacity-30'}`}>
                    <span className="font-technical text-xs">0{i + 1}</span>
                    <div className={`h-[1px] bg-[#f2f0e9] transition-all duration-500 ${i === step ? 'w-12' : 'w-4'}`}></div>
                    <span className="font-editorial italic text-lg">{s.id.charAt(0).toUpperCase() + s.id.slice(1)}</span>
                </div>
            ))}
        </div>
      </div>

      {/* --- RIGHT PANEL: ACTION --- */}
      <div className="w-full md:w-[58%] bg-[#f2f0e9] text-[#1a1a1a] p-8 md:p-16 lg:p-24 flex flex-col relative z-10">
        
        {/* Navigation Top */}
        <div className="flex justify-between items-center mb-16">
            <button 
                onClick={handleBack}
                className={`font-technical text-xs uppercase tracking-widest hover:text-[#c25e00] transition-colors flex items-center gap-2 ${step === 0 ? 'invisible' : ''}`}
            >
                <span className="rotate-180 inline-block">→</span> Back
            </button>
            <div className="font-technical text-xs text-[#0f241d]/40">
                STEP {step + 1} / {steps.length}
            </div>
        </div>

        {/* Form Container */}
        <div className="flex-grow flex flex-col justify-center max-w-xl mx-auto w-full">
            <div key={step} className="slide-enter">
                
                {/* STEP 1: IDENTITY */}
                {step === 0 && (
                    <div className="space-y-12">
                        <div className="stagger-1">
                            <label className="block font-technical text-xs uppercase tracking-widest mb-2 text-[#0f241d]/60">Full Name</label>
                            <div className="flex gap-4">
                                <input 
                                    type="text" 
                                    placeholder="First Name" 
                                    className="brutal-input"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                />
                                <input 
                                    type="text" 
                                    placeholder="Last Name" 
                                    className="brutal-input"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="stagger-2">
                            <label className="block font-technical text-xs uppercase tracking-widest mb-2 text-[#0f241d]/60">Professional Headline</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Senior Product Designer" 
                                className="brutal-input"
                                value={formData.headline}
                                onChange={(e) => handleInputChange('headline', e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* STEP 2: CRAFT */}
                {step === 1 && (
                    <div className="space-y-12">
                         <div className="stagger-1">
                            <label className="block font-technical text-xs uppercase tracking-widest mb-6 text-[#0f241d]/60">Seniority Level</label>
                            <div className="grid grid-cols-3 gap-4">
                                {['Junior', 'Mid-Level', 'Senior', 'Lead', 'Principal', 'C-Suite'].map((level) => (
                                    <div key={level}>
                                        <input 
                                            type="radio" 
                                            name="experience" 
                                            id={level} 
                                            value={level}
                                            className="hidden tag-radio"
                                            checked={formData.experience === level}
                                            onChange={() => handleInputChange('experience', level)}
                                        />
                                        <label 
                                            htmlFor={level}
                                            className="block text-center py-4 border border-[#0f241d]/20 cursor-pointer hover:border-[#0f241d] transition-all font-technical text-sm"
                                        >
                                            {level}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="stagger-2">
                            <label className="block font-technical text-xs uppercase tracking-widest mb-6 text-[#0f241d]/60">Core Competencies (Select up to 5)</label>
                            <div className="flex flex-wrap gap-3">
                                {['React', 'Vue', 'System Design', 'Team Leadership', 'Product Strategy', 'Figma', 'Node.js', 'AWS', 'Python', 'Marketing', 'Sales'].map((skill) => (
                                    <button
                                        key={skill}
                                        onClick={() => toggleSkill(skill)}
                                        className={`px-4 py-2 rounded-full border border-[#0f241d]/20 font-technical text-sm transition-all ${
                                            formData.skills.includes(skill) 
                                            ? 'bg-[#0f241d] text-[#f2f0e9]' 
                                            : 'hover:border-[#0f241d] bg-transparent'
                                        }`}
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: TERMS */}
                {step === 2 && (
                    <div className="space-y-12">
                        <div className="stagger-1">
                            <label className="block font-technical text-xs uppercase tracking-widest mb-2 text-[#0f241d]/60">Minimum Base Salary (USD)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-0 top-4 w-5 h-5 text-[#0f241d]/40" />
                                <input 
                                    type="number" 
                                    placeholder="120,000" 
                                    className="brutal-input pl-8"
                                    value={formData.salary}
                                    onChange={(e) => handleInputChange('salary', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="stagger-2">
                            <label className="block font-technical text-xs uppercase tracking-widest mb-2 text-[#0f241d]/60">Preferred Location / Timezone</label>
                            <div className="relative">
                                <MapPin className="absolute left-0 top-4 w-5 h-5 text-[#0f241d]/40" />
                                <input 
                                    type="text" 
                                    placeholder="e.g. London, Remote (GMT +/- 2)" 
                                    className="brutal-input pl-8"
                                    value={formData.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: REVIEW */}
                {step === 3 && (
                    <div className="space-y-8 stagger-1">
                        <div className="bg-[#e0ddd5]/30 p-8 border border-[#0f241d]/10">
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <h2 className="font-editorial text-3xl text-[#0f241d] mb-1">
                                        {formData.firstName || 'Candidate'} {formData.lastName}
                                    </h2>
                                    <p className="font-technical text-[#c25e00]">{formData.headline || 'Role Undefined'}</p>
                                </div>
                                <div className="w-12 h-12 bg-[#0f241d] rounded-full flex items-center justify-center text-[#f2f0e9]">
                                    <User size={20} />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-8 font-technical text-sm">
                                <div>
                                    <span className="block text-[#0f241d]/40 uppercase tracking-widest text-xs mb-1">Level</span>
                                    <span className="text-[#0f241d]">{formData.experience}</span>
                                </div>
                                <div>
                                    <span className="block text-[#0f241d]/40 uppercase tracking-widest text-xs mb-1">Salary Base</span>
                                    <span className="text-[#0f241d]">${formData.salary || '—'}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="block text-[#0f241d]/40 uppercase tracking-widest text-xs mb-2">Skills Matrix</span>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.skills.length > 0 ? formData.skills.map(s => (
                                            <span key={s} className="px-2 py-1 bg-[#0f241d]/5 text-[#0f241d] text-xs">{s}</span>
                                        )) : <span className="text-[#0f241d]/30 italic">No skills selected</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center font-editorial italic text-[#0f241d]/60">
                            "Excellence is not an act, but a habit."
                        </div>
                    </div>
                )}

            </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto flex justify-end">
            <button 
                onClick={handleNext}
                className="group relative overflow-hidden bg-[#0f241d] text-[#f2f0e9] px-12 py-5 font-technical uppercase tracking-widest text-sm transition-all hover:bg-[#c25e00]"
            >
                <div className="relative z-10 flex items-center gap-4">
                    {step === steps.length - 1 ? 'Submit Dossier' : 'Continue'} 
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
            </button>
        </div>

      </div>
    </div>
  );
}