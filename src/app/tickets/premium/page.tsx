import Link from "next/link";
import { headers } from "next/headers";

export default async function PremiumTickets() {
  const headersList = await headers();
  const paymentResponse = headersList.get('x-payment-response');
  const originalPayment = headersList.get('x-payment');

  let paymentDetails = null;
  try {
    if (paymentResponse) {
      paymentDetails = JSON.parse(paymentResponse);
    }
  } catch (e) {
    console.error('Failed to parse payment response:', e);
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
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
              <div className="text-6xl mb-4">🎟️</div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Premium Access
              </h1>
              <div className="text-2xl font-bold text-blue-400 mb-4">Paid with crypto!</div>
            </div>

            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6 mb-8">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-3">🚀</div>
                <h3 className="text-xl font-bold text-white">Premium Access Unlocked!</h3>
              </div>
              <p className="text-blue-200">
                Thank you for your payment! You now have access to premium tickets with enhanced features.
              </p>
            </div>

            <div className="space-y-4 text-white">
              <h3 className="text-xl font-bold mb-4">Premium benefits:</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="mr-3">🏆</span>
                  <span>Premium seating with better views</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3">🥂</span>
                  <span>Complimentary welcome drink</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3">⚡</span>
                  <span>Priority entry (15 minutes early access)</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3">🎧</span>
                  <span>Enhanced audio experience</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3">🎁</span>
                  <span>Digital commemorative ticket NFT</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-white/5 rounded-lg">
              <h4 className="font-bold text-white mb-2">Payment Details:</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <div>Amount: $0.10 USDC</div>
                <div>Network: Base Sepolia (Testnet)</div>
                <div>Protocol: x402</div>
                <div>Status: ✅ Verified & Settled</div>
                {paymentDetails && (
                  <>
                    <div className="flex items-center gap-2">
                      <span>Transaction:</span>
                      {paymentDetails.transactionHash ? (
                        <a
                          href={`https://sepolia.basescan.org/tx/${paymentDetails.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          View on BaseScan ↗
                        </a>
                      ) : (
                        <span>Processing...</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>From:</span>
                      {paymentDetails.from ? (
                        <a
                          href={`https://sepolia.basescan.org/address/${paymentDetails.from}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          {paymentDetails.from.slice(0, 6)}...{paymentDetails.from.slice(-4)} ↗
                        </a>
                      ) : (
                        <span>N/A</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Block:</span>
                      {paymentDetails.blockNumber ? (
                        <a
                          href={`https://sepolia.basescan.org/block/${paymentDetails.blockNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          #{paymentDetails.blockNumber} ↗
                        </a>
                      ) : (
                        <span>Pending...</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {(paymentResponse || originalPayment) && (
              <div className="mt-6 p-4 bg-green-600/10 border border-green-400/30 rounded-lg">
                <h4 className="font-bold text-white mb-2">🔐 Cryptographic Proof:</h4>
                <div className="text-xs text-green-200 space-y-2 font-mono break-all">
                  {originalPayment && (
                    <div>
                      <div className="text-green-400 font-bold">Payment Signature:</div>
                      <div className="bg-black/20 p-2 rounded mt-1">{originalPayment}</div>
                    </div>
                  )}
                  {paymentResponse && (
                    <div>
                      <div className="text-green-400 font-bold">Payment Response:</div>
                      <div className="bg-black/20 p-2 rounded mt-1">{paymentResponse}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 text-center">
              <div className="text-sm text-gray-300 mb-4">
                Want the ultimate experience?
              </div>
              <Link
                href="/tickets/vip"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Upgrade to VIP ($0.25)
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}