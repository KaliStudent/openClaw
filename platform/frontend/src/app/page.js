import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Header */}
      <header className="container">
        <div className="header">
          <div className="header-logo">MAINSTREET_AI</div>
          <nav className="header-nav">
            <Link href="/login">Login</Link>
            <Link href="/register" className="btn btn-primary">Get Started</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
        <div style={{ maxWidth: '800px' }}>
          <p className="mono text-orange" style={{ fontSize: '0.875rem', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            AI-powered business automation
          </p>
          <h1 style={{ marginBottom: '24px' }}>
            Your business.<br />
            <span className="text-green">Never closed.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '48px', maxWidth: '600px' }}>
            Deploy an AI agent that answers calls, chats with customers, 
            schedules appointments, and handles operations — in English and Spanish. 
            24/7. No breaks. No sick days.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn btn-primary">Deploy Your Agent →</Link>
            <Link href="#capabilities" className="btn btn-ghost">See Capabilities</Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ borderTop: '2px solid var(--border-default)', borderBottom: '2px solid var(--border-default)' }}>
        <div className="container">
          <div className="grid grid-4" style={{ padding: '32px 0' }}>
            <div className="stat">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Availability</div>
            </div>
            <div className="stat">
              <div className="stat-value" style={{ color: 'var(--neon-orange)' }}>2</div>
              <div className="stat-label">Languages (EN/ES)</div>
            </div>
            <div className="stat">
              <div className="stat-value">&lt;2s</div>
              <div className="stat-label">Response Time</div>
            </div>
            <div className="stat">
              <div className="stat-value" style={{ color: 'var(--neon-magenta)' }}>∞</div>
              <div className="stat-label">Concurrent Calls</div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="container" style={{ padding: '100px 0' }}>
        <h2 style={{ marginBottom: '12px' }}>Capabilities</h2>
        <p className="text-muted" style={{ marginBottom: '48px', fontSize: '1.1rem' }}>
          One agent. Every channel. Every task.
        </p>
        <div className="grid grid-3">
          <FeatureCard
            icon="◉"
            title="Website Chatbot"
            description="Embed on your site. Answers questions, qualifies leads, books appointments. Never sleeps."
            color="green"
          />
          <FeatureCard
            icon="◎"
            title="Phone Receptionist"
            description="Answers calls in your brand voice. Takes messages. Routes urgent calls. Handles the rest."
            color="orange"
          />
          <FeatureCard
            icon="◈"
            title="Bilingual"
            description="Fluent English and Spanish. Switches naturally. Serves all your customers equally."
            color="green"
          />
          <FeatureCard
            icon="▣"
            title="Appointments"
            description="Books, reschedules, cancels. Sends confirmations. Syncs with your calendar."
            color="orange"
          />
          <FeatureCard
            icon="◐"
            title="Knowledge Base"
            description="Feed it your docs, website, policies. It learns your business and answers accurately."
            color="magenta"
          />
          <FeatureCard
            icon="⬡"
            title="Lead Generation"
            description="Qualifies prospects. Scores leads. Builds contact lists. Automates follow-up."
            color="green"
          />
        </div>
      </section>

      {/* How it works */}
      <section style={{ borderTop: '2px solid var(--border-default)', padding: '100px 0' }}>
        <div className="container">
          <h2 style={{ marginBottom: '48px' }}>How it works</h2>
          <div className="grid grid-3">
            <div>
              <div className="mono text-green" style={{ fontSize: '2rem', marginBottom: '12px' }}>01</div>
              <h4 style={{ marginBottom: '8px' }}>Configure</h4>
              <p className="text-muted">Tell us your business. Hours, services, personality. We build your agent.</p>
            </div>
            <div>
              <div className="mono text-orange" style={{ fontSize: '2rem', marginBottom: '12px' }}>02</div>
              <h4 style={{ marginBottom: '8px' }}>Deploy</h4>
              <p className="text-muted">One line of code on your site. One phone number. You're live.</p>
            </div>
            <div>
              <div className="mono text-magenta" style={{ fontSize: '2rem', marginBottom: '12px' }}>03</div>
              <h4 style={{ marginBottom: '8px' }}>Scale</h4>
              <p className="text-muted">Add skills. Add channels. Your agent grows with your business.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: '2px solid var(--border-default)', padding: '100px 0' }}>
        <div className="container text-center">
          <h2 style={{ marginBottom: '16px' }}>Ready to stop missing calls?</h2>
          <p className="text-muted" style={{ marginBottom: '32px' }}>Set up in under 5 minutes. No credit card required.</p>
          <Link href="/register" className="btn btn-primary">Get Started Free →</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '2px solid var(--border-default)', padding: '32px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="mono text-muted" style={{ fontSize: '0.8rem' }}>© 2026 MAINSTREET_AI</span>
          <span className="mono text-muted" style={{ fontSize: '0.8rem' }}>BUILT FOR SMALL BUSINESS</span>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }) {
  const colorVar = `var(--neon-${color})`;
  return (
    <div className="card" style={{ borderColor: 'var(--border-default)' }}>
      <div style={{ fontSize: '1.5rem', color: colorVar, marginBottom: '12px' }}>{icon}</div>
      <h4 style={{ marginBottom: '8px' }}>{title}</h4>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>{description}</p>
    </div>
  );
}
