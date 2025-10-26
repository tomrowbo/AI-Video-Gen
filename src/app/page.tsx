import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-white mb-6">
            🤖 Autonomous AI Video Studio
          </h1>
          <p className="text-2xl text-gray-300 mb-8">
            The first autonomous agent economy for AI video generation
          </p>
          <p className="text-lg text-gray-400 mb-12">
            AI agents with their own wallets • Pay-per-use with crypto • Google Veo 3 • No subscriptions
          </p>

          <Link
            href="/video-generator"
            className="inline-block bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-12 rounded-lg transition-all transform hover:scale-105 text-xl"
          >
            Launch Video Studio 🚀
          </Link>
        </div>

        {/* How It Works */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
              <div className="text-5xl mb-4">🎬</div>
              <h3 className="text-xl font-bold text-white mb-4">Describe Your Video</h3>
              <p className="text-gray-300">
                Tell our AI agents what you want to create. They'll analyze and optimize your prompt for the best results.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-white mb-4">Agent Pays Autonomously</h3>
              <p className="text-gray-300">
                The selected AI agent pays for video generation from the shared wallet using x402 protocol. No user wallet needed!
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
              <div className="text-5xl mb-4">🎥</div>
              <h3 className="text-xl font-bold text-white mb-4">Download Your Video</h3>
              <p className="text-gray-300">
                Get your professionally generated 8-second video in 1-3 minutes. Powered by Google Veo 3 technology.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Revolutionary Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm rounded-lg p-8 border border-green-400/30">
              <h3 className="text-xl font-bold text-white mb-4">🏦 First Autonomous Agent Economy</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• AI agents with their own crypto wallets</li>
                <li>• Autonomous payments using x402 protocol</li>
                <li>• Real blockchain integration (Base Sepolia)</li>
                <li>• No user wallet management required</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-lg p-8 border border-purple-400/30">
              <h3 className="text-xl font-bold text-white mb-4">⚡ Pay-Per-Use Model</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• $0.10 per video (subsidized demo price)</li>
                <li>• No monthly subscriptions</li>
                <li>• Pay only for what you generate</li>
                <li>• Eliminates subscription fatigue</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-lg p-8 border border-blue-400/30">
              <h3 className="text-xl font-bold text-white mb-4">🎨 Specialized AI Agents</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Director Alex - Cinematic storytelling</li>
                <li>• Marketing Maven - Commercial content</li>
                <li>• Artistic Soul - Creative visuals</li>
                <li>• Tech Teacher - Educational content</li>
                <li>• Fun Creator - Entertainment videos</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-sm rounded-lg p-8 border border-orange-400/30">
              <h3 className="text-xl font-bold text-white mb-4">🚀 Cutting-Edge Technology</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Google Veo 3 API integration</li>
                <li>• Real-time blockchain balance checking</li>
                <li>• Intelligent prompt optimization</li>
                <li>• Multi-agent collaboration system</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 max-w-2xl mx-auto border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Experience the Future?</h3>
            <p className="text-gray-300 mb-6">
              Join the first autonomous AI agent economy and create stunning videos with just a description.
            </p>
            <Link
              href="/video-generator"
              className="inline-block bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
            >
              Start Creating Videos ✨
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}