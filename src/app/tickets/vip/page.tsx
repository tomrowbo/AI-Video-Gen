import Link from "next/link";
import { headers } from "next/headers";

export default async function VIPTickets() {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900">
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
              <div className="text-6xl mb-4">👑</div>
              <h1 className="text-4xl font-bold text-white mb-2">
                VIP Experience
              </h1>
              <div className="text-2xl font-bold text-purple-400 mb-4">Ultra Premium!</div>
            </div>

            <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-6 mb-8">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-3">💎</div>
                <h3 className="text-xl font-bold text-white">VIP Access Activated!</h3>
              </div>
              <p className="text-purple-200">
                Welcome to the ultimate experience! Your crypto payment has unlocked exclusive VIP privileges.
              </p>
            </div>

            <div className="space-y-4 text-white">
              <h3 className="text-xl font-bold mb-4">VIP exclusive benefits:</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="mr-3">🏛️</span>
                  <span>Exclusive VIP lounge access</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3">🤝</span>
                  <span>Meet & greet with performers</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3">🎽</span>
                  <span>Exclusive VIP merchandise package</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3">🍾</span>
                  <span>Premium bar with top-shelf drinks</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3">📸</span>
                  <span>Professional photo opportunities</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3">🚁</span>
                  <span>VIP entrance with red carpet</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3">🎯</span>
                  <span>Best seats in the house (front row)</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3">🏆</span>
                  <span>Limited edition VIP NFT collectible</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-white/5 rounded-lg">
              <h4 className="font-bold text-white mb-2">Payment Details:</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <div>Amount: $0.25 USDC</div>
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
                          className="text-purple-400 hover:text-purple-300 underline"
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
                          className="text-purple-400 hover:text-purple-300 underline"
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
                          className="text-purple-400 hover:text-purple-300 underline"
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

            <div className="mt-8 text-center bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-4">
              <h4 className="font-bold text-white mb-2">🎉 Congratulations!</h4>
              <p className="text-sm text-gray-300">
                You've unlocked the highest tier of access. Enjoy your VIP experience!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}