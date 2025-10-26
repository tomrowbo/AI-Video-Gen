// Test script to simulate a successful payment and see the signature display
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testSuccessPage() {
  console.log('🧪 Testing success page with simulated payment headers...\n');

  // Simulate what a real x402 client would send after successful payment
  const mockPaymentSignature = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.mock-signature-data';
  const mockPaymentResponse = JSON.stringify({
    transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
    from: '0xuser123456789abcdef',
    blockNumber: '12345678',
    status: 'confirmed'
  });

  // Test accessing premium page (will still return 402 since we don't have real payment)
  const response = await fetch('http://localhost:3000/tickets/premium', {
    headers: {
      'X-PAYMENT': mockPaymentSignature,
      'X-PAYMENT-RESPONSE': mockPaymentResponse
    }
  });

  console.log(`Status: ${response.status} ${response.statusText}`);
  console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

  if (response.status === 200) {
    console.log('✅ Success! Payment accepted');
    const html = await response.text();
    console.log('Page includes signature section:', html.includes('Cryptographic Proof'));
  } else if (response.status === 402) {
    console.log('❌ Still shows 402 - mock payment rejected (expected for security)');
  }

  console.log('\n💡 To see real signatures, you need:');
  console.log('1. Real Base Sepolia testnet USDC');
  console.log('2. x402-compatible wallet client');
  console.log('3. Valid EIP-712 signature for TransferWithAuthorization');
}

testSuccessPage().catch(console.error);