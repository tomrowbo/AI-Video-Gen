import Link from "next/link";

export default function GeneralTickets() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Link
              href="/"
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              ← Back to tickets
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎫</div>
              <h1 className="text-4xl font-bold text-white mb-2">
                General Admission
              </h1>
              <div className="text-2xl font-bold text-green-400 mb-4">FREE</div>
            </div>

            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6 mb-8">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-3">✅</div>
                <h3 className="text-xl font-bold text-white">Access Granted!</h3>
              </div>
              <p className="text-green-200">
                You now have access to general admission tickets. No payment required!
              </p>
            </div>

            <div className="space-y-4 text-white">
              <h3 className="text-xl font-bold mb-4">What's included:</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="mr-3">🪑</span>
                  <span>Standard seating in general admission area</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3">🚪</span>
                  <span>Standard entry (doors open 30 min before event)</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3">🍿</span>
                  <span>Access to basic concessions</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3">🎵</span>
                  <span>Full show access</span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="text-sm text-gray-300 mb-4">
                Want more? Check out our premium options:
              </div>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/tickets/premium"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Premium ($0.10)
                </Link>
                <Link
                  href="/tickets/vip"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  VIP ($0.25)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}