import React, { useEffect, useRef, useState } from 'react'

// Custom hook for scroll-triggered animations
function useScrollReveal() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return [ref, isVisible]
}

// Animated section wrapper
function RevealSection({ children, className = '', delay = 0 }) {
  const [ref, isVisible] = useScrollReveal()

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// Navigation
function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream-50/95 backdrop-blur-md shadow-sm py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <nav className="section-padding max-container flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group" aria-label="Assured Recruitment home">
          <div className="w-10 h-10 bg-ink-950 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <span className="font-display font-bold text-xl text-assured-400">A</span>
          </div>
          <span className="font-display font-semibold text-xl text-ink-950 hidden sm:block">
            Assured
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="font-body text-sm font-medium text-ink-700 hover:text-ink-950 transition-colors link-underline">
            How it works
          </a>
          <a href="#for-clients" className="font-body text-sm font-medium text-ink-700 hover:text-ink-950 transition-colors link-underline">
            For hiring leaders
          </a>
          <a href="#for-candidates" className="font-body text-sm font-medium text-ink-700 hover:text-ink-950 transition-colors link-underline">
            For professionals
          </a>
          <a href="#insights" className="font-body text-sm font-medium text-ink-700 hover:text-ink-950 transition-colors link-underline">
            Insights
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="btn-primary text-sm py-3 px-6"
          >
            Get started
          </a>
        </div>
      </nav>
    </header>
  )
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center noise-overlay overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-50 to-assured-50/30" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-radial from-assured-100/50 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-radial from-copper-100/30 to-transparent rounded-full blur-2xl" />

      {/* Geometric accent */}
      <div className="absolute top-32 right-12 lg:right-24 w-24 h-24 border-2 border-assured-300/30 rotate-45 hidden lg:block animate-pulse-subtle" />
      <div className="absolute bottom-40 left-16 w-16 h-16 border border-copper-300/40 rotate-12 hidden lg:block" />

      <div className="section-padding max-container relative z-10 pt-32 pb-20">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <p
            className="font-body text-sm font-semibold tracking-[0.2em] uppercase text-assured-700 mb-6 opacity-0 animate-fade-up"
            style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
          >
            Specialist recruitment
          </p>

          {/* Main headline */}
          <h1
            className="font-display text-display-xl font-semibold text-ink-950 mb-8 opacity-0 animate-fade-up"
            style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
          >
            Risk, managed.
            <br />
            <span className="text-gradient">Talent assured.</span>
          </h1>

          {/* Sub-headline */}
          <p
            className="font-body text-body-lg text-ink-600 max-w-2xl mb-6 text-balance opacity-0 animate-fade-up"
            style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
          >
            Rest assured, we will find your ideal match. We solve for longevity and speed.
          </p>

          {/* Supporting microcopy */}
          <p
            className="font-body text-base text-ink-500 max-w-xl mb-10 opacity-0 animate-fade-up"
            style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
          >
            Built by industry experts. Powered by 100+ data points per candidate.
            Matching that actually works.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-4 opacity-0 animate-fade-up"
            style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
          >
            <a href="#contact" className="btn-primary">
              Brief us on a role
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="#contact" className="btn-secondary">
              Share your profile
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in"
          style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}
        >
          <span className="font-body text-xs text-ink-400 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-ink-300 to-transparent" />
        </div>
      </div>
    </section>
  )
}

// Split audience section
function AudienceSection() {
  return (
    <section className="py-24 lg:py-32 bg-cream-50 relative" id="for-clients">
      <div className="section-padding max-container">
        <RevealSection>
          <div className="text-center mb-16 lg:mb-24">
            <p className="font-body text-sm font-semibold tracking-[0.2em] uppercase text-assured-700 mb-4">
              Two paths, one promise
            </p>
            <h2 className="font-display text-display-md font-semibold text-ink-950 text-balance">
              Whether you are hiring or looking, we have got you covered
            </h2>
          </div>
        </RevealSection>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4">
          {/* For hiring leaders */}
          <RevealSection delay={100}>
            <div className="bg-ink-950 text-cream-50 rounded-3xl p-8 lg:p-12 relative overflow-hidden group h-full">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-assured-600/20 to-transparent" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-assured-600/20 text-assured-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  For hiring leaders
                </div>

                <h3 className="font-display text-display-md font-semibold mb-6">
                  Find the right person, faster
                </h3>

                <ul className="space-y-4 mb-8">
                  {[
                    'Advisors who have actually done these roles and hired for them',
                    'Deep data capture means fewer mismatches and wasted interviews',
                    'Proprietary matching + AI reduces time-to-shortlist by weeks',
                    'We measure success by retention, not just placement',
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-assured-500 flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="font-body text-cream-200">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-ink-700">
                  <p className="font-body text-sm text-ink-400 mb-4">How it works:</p>
                  <ol className="space-y-2">
                    {['Brief us on the role and context', 'We match against 100+ data points', 'Receive a curated shortlist in days, not weeks'].map((step, i) => (
                      <li key={i} className="flex items-center gap-3 font-body text-sm text-cream-300">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full border border-assured-500 flex items-center justify-center text-xs text-assured-400">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 mt-8 font-semibold text-assured-400 hover:text-assured-300 transition-colors group/link"
                >
                  Brief us on a role
                  <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </RevealSection>

          {/* For professionals */}
          <RevealSection delay={200} className="lg:mt-12" id="for-candidates">
            <div className="bg-cream-100 border border-cream-300 rounded-3xl p-8 lg:p-12 relative overflow-hidden group h-full">
              {/* Decorative gradient */}
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-copper-200/30 to-transparent" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-copper-100 text-copper-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  For risk &amp; compliance professionals
                </div>

                <h3 className="font-display text-display-md font-semibold text-ink-950 mb-6">
                  Land a role you will actually love
                </h3>

                <ul className="space-y-4 mb-8">
                  {[
                    'We capture what really matters to you: culture, growth, working style',
                    'Get insider intel on roles and companies before you commit',
                    'AI-enhanced profile that showcases your real strengths',
                    'Matched to roles where you will thrive, not just survive',
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-copper-500 flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="font-body text-ink-700">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-cream-300">
                  <p className="font-body text-sm text-ink-500 mb-4">How it works:</p>
                  <ol className="space-y-2">
                    {['Share your profile and preferences', 'We build your data-rich profile', 'Get matched to roles that genuinely fit'].map((step, i) => (
                      <li key={i} className="flex items-center gap-3 font-body text-sm text-ink-600">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full border border-copper-400 flex items-center justify-center text-xs text-copper-600">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 mt-8 font-semibold text-copper-600 hover:text-copper-700 transition-colors group/link"
                >
                  Share your profile
                  <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  )
}

// How it works section with visual process
function ProcessSection() {
  const steps = [
    {
      number: '01',
      title: 'Discover & define',
      description: 'We dig deep into the role, the team, the culture, and what success really looks like. No generic job specs.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Deep data capture',
      description: '100+ data points per candidate. Technical skills, experience, preferences, working style, career drivers. The full picture.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Match & shortlist',
      description: 'Our algorithm surfaces the best fits. Our experts review every match. You get a shortlist you can trust.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      number: '04',
      title: 'Present & interview',
      description: 'Structured shortlist presentation. Interview design support. We keep both sides informed throughout.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      number: '05',
      title: 'Offer & beyond',
      description: 'Onboarding support. Retention check-ins. Because our success is measured in years, not placements.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
  ]

  return (
    <section className="py-24 lg:py-32 bg-ink-950 text-cream-50 relative overflow-hidden" id="how-it-works">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%221%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
      </div>

      {/* Gradient accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-radial from-assured-600/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-copper-500/10 to-transparent rounded-full blur-3xl" />

      <div className="section-padding max-container relative z-10">
        <RevealSection>
          <div className="text-center mb-16 lg:mb-20">
            <p className="font-body text-sm font-semibold tracking-[0.2em] uppercase text-assured-400 mb-4">
              The assured process
            </p>
            <h2 className="font-display text-display-lg font-semibold mb-6 text-balance">
              How we replace guesswork with assurance
            </h2>
            <p className="font-body text-body-md text-ink-300 max-w-2xl mx-auto">
              Every step is designed for one outcome: mutual satisfaction.
              Leaders who find "their person". Professionals who genuinely love their work.
            </p>
          </div>
        </RevealSection>

        {/* Process timeline */}
        <div className="relative">
          {/* Connecting line - desktop only */}
          <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-ink-700 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <RevealSection key={step.number} delay={index * 100}>
                <div className="relative group">
                  {/* Step indicator */}
                  <div className="flex items-center gap-4 lg:flex-col lg:items-center mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-ink-900 border border-ink-700 flex items-center justify-center text-assured-400 transition-all duration-300 group-hover:border-assured-500 group-hover:bg-ink-800">
                        {step.icon}
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-assured-600 text-xs font-bold flex items-center justify-center text-white">
                        {step.number.replace('0', '')}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:text-center">
                    <h3 className="font-display text-xl font-semibold mb-3 text-cream-100 group-hover:text-assured-300 transition-colors">
                      {step.title}
                    </h3>
                    <p className="font-body text-sm text-ink-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <RevealSection delay={600}>
          <div className="mt-20 pt-12 border-t border-ink-800">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 text-center">
              {[
                { value: '100+', label: 'data points per candidate' },
                { value: '2-way', label: 'matching (role + company data too)' },
                { value: 'Weeks', label: 'faster than traditional agencies' },
                { value: 'Years', label: 'how we measure success' },
              ].map((stat, i) => (
                <div key={i} className="group">
                  <p className="font-display text-3xl lg:text-4xl font-semibold text-assured-400 mb-2 group-hover:text-assured-300 transition-colors">
                    {stat.value}
                  </p>
                  <p className="font-body text-sm text-ink-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  )
}

// Trust / proof section
function TrustSection() {
  const testimonials = [
    {
      quote: "They understood what we needed before we'd finished explaining it. The shortlist was spot-on.",
      author: "Head of Risk",
      company: "FTSE 250 Financial Services",
    },
    {
      quote: "For the first time, I felt like a recruitment partner actually understood my career, not just my CV.",
      author: "Senior Compliance Manager",
      company: "Global Bank",
    },
  ]

  return (
    <section className="py-24 lg:py-32 bg-cream-100 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-12 left-12 w-32 h-32 border border-assured-200/50 rounded-full hidden lg:block" />
      <div className="absolute bottom-24 right-16 w-20 h-20 border border-copper-200/50 rotate-45 hidden lg:block" />

      <div className="section-padding max-container relative z-10">
        <RevealSection>
          <div className="text-center mb-16">
            <p className="font-body text-sm font-semibold tracking-[0.2em] uppercase text-assured-700 mb-4">
              Trusted by leaders
            </p>
            <h2 className="font-display text-display-md font-semibold text-ink-950 text-balance">
              The people who know risk, trust us with theirs
            </h2>
          </div>
        </RevealSection>

        {/* Logo placeholders */}
        <RevealSection delay={100}>
          <div className="mb-16">
            <p className="font-body text-sm text-ink-500 text-center mb-8">Clients across financial services, professional services, and regulated industries</p>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-40">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-24 h-12 bg-ink-200 rounded flex items-center justify-center"
                  aria-label={`Client logo placeholder ${i}`}
                >
                  <span className="font-body text-xs text-ink-400">Logo</span>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, i) => (
            <RevealSection key={i} delay={200 + i * 100}>
              <blockquote className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm border border-cream-200 h-full flex flex-col">
                {/* Quote mark */}
                <div className="text-assured-300 mb-4">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                <p className="font-display text-xl lg:text-2xl font-medium text-ink-900 mb-6 flex-grow italic">
                  "{testimonial.quote}"
                </p>

                <footer className="pt-4 border-t border-cream-200">
                  <p className="font-body font-semibold text-ink-950">{testimonial.author}</p>
                  <p className="font-body text-sm text-ink-500">{testimonial.company}</p>
                </footer>
              </blockquote>
            </RevealSection>
          ))}
        </div>

        {/* Metrics */}
        <RevealSection delay={400}>
          <div className="mt-16 grid grid-cols-3 gap-4 lg:gap-8">
            {[
              { metric: '93%', label: 'candidate satisfaction' },
              { metric: '87%', label: 'placements still in role after 2 years' },
              { metric: '< 3 weeks', label: 'average time to shortlist' },
            ].map((item, i) => (
              <div key={i} className="text-center py-6 lg:py-8 bg-white rounded-xl border border-cream-200">
                <p className="font-display text-2xl lg:text-4xl font-semibold text-ink-950 mb-1">{item.metric}</p>
                <p className="font-body text-xs lg:text-sm text-ink-500">{item.label}</p>
              </div>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  )
}

// Insights / roles teaser section
function InsightsSection() {
  const insights = [
    {
      type: 'Featured role',
      title: 'Head of Operational Risk',
      meta: 'FTSE 100 · London · £180-220k',
      description: 'Lead the operational risk function for a major financial institution. Board exposure, team of 12.',
      tag: 'Risk',
    },
    {
      type: 'Featured role',
      title: 'Director of Compliance',
      meta: 'PE-backed · Manchester · £150-180k',
      description: 'Build the compliance function for a rapidly scaling fintech. Greenfield opportunity.',
      tag: 'Compliance',
    },
    {
      type: 'Market insight',
      title: 'The hidden cost of slow hiring in risk functions',
      meta: '5 min read',
      description: 'Why traditional recruitment timelines are costing firms more than they realise.',
      tag: 'Insight',
    },
  ]

  return (
    <section className="py-24 lg:py-32 bg-cream-50" id="insights">
      <div className="section-padding max-container">
        <RevealSection>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <p className="font-body text-sm font-semibold tracking-[0.2em] uppercase text-assured-700 mb-4">
                Current opportunities
              </p>
              <h2 className="font-display text-display-md font-semibold text-ink-950">
                Roles &amp; market intelligence
              </h2>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-2 font-body font-semibold text-ink-950 hover:text-assured-700 transition-colors group"
            >
              View all opportunities
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </RevealSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((item, i) => (
            <RevealSection key={i} delay={i * 100}>
              <article className="group bg-white rounded-2xl border border-cream-200 overflow-hidden hover:shadow-lg hover:border-assured-200 transition-all duration-300 h-full flex flex-col">
                {/* Image placeholder */}
                <div className="h-40 bg-gradient-to-br from-ink-100 to-cream-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-assured-600/5 to-copper-500/5" />
                  <div className="absolute top-4 left-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      item.type === 'Market insight'
                        ? 'bg-copper-100 text-copper-700'
                        : 'bg-assured-100 text-assured-700'
                    }`}>
                      {item.tag}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <p className="font-body text-xs text-ink-500 mb-2">{item.type}</p>
                  <h3 className="font-display text-xl font-semibold text-ink-950 mb-2 group-hover:text-assured-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-ink-400 mb-3">{item.meta}</p>
                  <p className="font-body text-sm text-ink-600 flex-grow">{item.description}</p>

                  <div className="mt-4 pt-4 border-t border-cream-200">
                    <span className="inline-flex items-center gap-2 font-body text-sm font-semibold text-ink-950 group-hover:text-assured-700 transition-colors">
                      {item.type === 'Market insight' ? 'Read more' : 'View role'}
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </article>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// Final CTA section
function CtaSection() {
  return (
    <section className="py-24 lg:py-32 bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950 text-cream-50 relative overflow-hidden" id="contact">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-assured-600/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Geometric accents */}
      <div className="absolute top-20 left-20 w-40 h-40 border border-ink-700 rounded-full opacity-30 hidden lg:block" />
      <div className="absolute bottom-20 right-20 w-24 h-24 border border-assured-600/30 rotate-45 hidden lg:block" />

      <div className="section-padding max-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <RevealSection>
            <p className="font-body text-sm font-semibold tracking-[0.2em] uppercase text-assured-400 mb-6">
              Ready to start?
            </p>
          </RevealSection>

          <RevealSection delay={100}>
            <h2 className="font-display text-display-lg font-semibold mb-6">
              Risk, managed.
              <br />
              <span className="text-assured-400">Talent assured.</span>
            </h2>
          </RevealSection>

          <RevealSection delay={200}>
            <p className="font-body text-body-md text-ink-300 mb-10 max-w-xl mx-auto">
              Whether you are looking to hire exceptional risk and compliance professionals, or you are ready for your next career move, we are here to help.
            </p>
          </RevealSection>

          <RevealSection delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@assuredrecruitment.com"
                className="inline-flex items-center justify-center px-8 py-4 font-body font-semibold text-base bg-assured-600 text-white rounded-full transition-all duration-300 hover:bg-assured-500 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-assured-400 focus:ring-offset-2 focus:ring-offset-ink-950"
              >
                Brief us on a role
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="mailto:candidates@assuredrecruitment.com"
                className="inline-flex items-center justify-center px-8 py-4 font-body font-semibold text-base bg-transparent text-cream-100 border-2 border-cream-100/30 rounded-full transition-all duration-300 hover:border-cream-100 hover:bg-cream-100/10 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cream-100 focus:ring-offset-2 focus:ring-offset-ink-950"
              >
                Share your profile
              </a>
            </div>
          </RevealSection>

          <RevealSection delay={400}>
            <p className="font-body text-sm text-ink-500 mt-8">
              Or email us directly: <a href="mailto:hello@assuredrecruitment.com" className="text-assured-400 hover:text-assured-300 transition-colors">hello@assuredrecruitment.com</a>
            </p>
          </RevealSection>
        </div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="py-12 bg-ink-950 text-ink-400 border-t border-ink-800">
      <div className="section-padding max-container">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-ink-800 rounded-lg flex items-center justify-center">
              <span className="font-display font-bold text-lg text-assured-400">A</span>
            </div>
            <span className="font-display font-semibold text-lg text-cream-100">Assured Recruitment</span>
          </div>

          <nav className="flex flex-wrap gap-6 lg:gap-8">
            <a href="#how-it-works" className="font-body text-sm hover:text-cream-100 transition-colors">How it works</a>
            <a href="#for-clients" className="font-body text-sm hover:text-cream-100 transition-colors">For clients</a>
            <a href="#for-candidates" className="font-body text-sm hover:text-cream-100 transition-colors">For candidates</a>
            <a href="#insights" className="font-body text-sm hover:text-cream-100 transition-colors">Insights</a>
            <a href="#" className="font-body text-sm hover:text-cream-100 transition-colors">Privacy</a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="https://linkedin.com" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-ink-800 flex items-center justify-center hover:bg-ink-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-ink-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} Assured Recruitment. All rights reserved.</p>
          <p className="text-ink-600">
            Specialist recruitment for enterprise risk, compliance, internal audit, controls, resilience and sustainability.
          </p>
        </div>
      </div>
    </footer>
  )
}

// Main App
export default function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <AudienceSection />
        <ProcessSection />
        <TrustSection />
        <InsightsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
