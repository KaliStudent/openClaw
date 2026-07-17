import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🤖</span>
            <h1 className="text-xl font-bold text-gray-900">MainStreet AI</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Login
            </Link>
            <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Your Business, Always Available
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Deploy an AI assistant that answers calls, chats with customers, and handles appointments — 
              in English and Spanish. Perfect for any small business.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold text-lg">
                Start Free Trial
              </Link>
              <Link href="#features" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-100 font-semibold text-lg">
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-center mb-12">What Your AI Agent Can Do</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                emoji="💬"
                title="Website Chatbot"
                description="Embed an intelligent chatbot on your website. Answer questions, qualify leads, and schedule appointments 24/7."
              />
              <FeatureCard
                emoji="📞"
                title="Phone Receptionist"
                description="Never miss a call. Your AI answers the phone professionally, takes messages, and routes important calls."
              />
              <FeatureCard
                emoji="🌐"
                title="Bilingual Support"
                description="Serve all your customers in English and Spanish. The AI switches languages naturally based on the caller."
              />
              <FeatureCard
                emoji="📅"
                title="Appointment Scheduling"
                description="Customers can book, reschedule, or cancel appointments through chat or phone without waiting."
              />
              <FeatureCard
                emoji="🏪"
                title="Any Business Type"
                description="From mechanic shops to doctor offices, restaurants to law firms. Configured for YOUR business."
              />
              <FeatureCard
                emoji="🔧"
                title="Add-on Services"
                description="Need a landing page? Basic automation? Full app development? Unlock capabilities as you grow."
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-center mb-12">Up and Running in Minutes</h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl mb-4">1️⃣</div>
                <h4 className="text-xl font-semibold mb-2">Sign Up</h4>
                <p className="text-gray-600">Create your account and tell us about your business.</p>
              </div>
              <div>
                <div className="text-4xl mb-4">2️⃣</div>
                <h4 className="text-xl font-semibold mb-2">Configure</h4>
                <p className="text-gray-600">Set your hours, services, personality, and enable features.</p>
              </div>
              <div>
                <div className="text-4xl mb-4">3️⃣</div>
                <h4 className="text-xl font-semibold mb-2">Deploy</h4>
                <p className="text-gray-600">Add the chat widget to your site or connect your phone number.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 MainStreet AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ emoji, title, description }) {
  return (
    <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
      <div className="text-3xl mb-3">{emoji}</div>
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
