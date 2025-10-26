import { paymentMiddleware } from 'x402-next';
import { facilitator } from '@coinbase/x402';

// Replace with your wallet address that will receive payments
const RECEIVER_ADDRESS = (process.env.RECEIVER_ADDRESS || "0x742d35Cc6634C0532925a3b8D098Ef82E8d0aEE4") as `0x${string}`;

export const middleware = paymentMiddleware(
  RECEIVER_ADDRESS,
  {
    // Premium tickets require payment
    '/tickets/premium': {
      price: '$0.10',
      network: "base-sepolia", // Use testnet for development
      config: {
        description: 'Access to premium concert tickets'
      }
    },
    // VIP tickets cost more
    '/tickets/vip': {
      price: '$0.25',
      network: "base-sepolia",
      config: {
        description: 'Access to VIP event tickets'
      }
    },
    // Video generation with payment
    '/api/generate-video-paid': {
      price: '$0.10',
      network: "base-sepolia",
      config: {
        description: 'AI Video Generation with Google Veo 3'
      }
    }
  },
  facilitator // Use CDP facilitator instead of URL
);

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/tickets/premium',
    '/tickets/vip',
    '/api/generate-video-paid'
  ]
};