// Simple test to verify x402 payment flow
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testPaymentFlow() {
  console.log('🧪 Testing x402 payment flow...\n');

  // Step 1: Try to access premium content without payment
  console.log('Step 1: Accessing /tickets/premium without payment...');
  const response1 = await fetch('http://localhost:3000/tickets/premium');

  console.log(`Status: ${response1.status} ${response1.statusText}`);
  console.log(`Headers:`, Object.fromEntries(response1.headers.entries()));

  if (response1.status === 402) {
    console.log('✅ Correctly returned 402 Payment Required');
    const paymentInfo = await response1.json();
    console.log('💰 Payment details:', JSON.stringify(paymentInfo, null, 2));
  } else if (response1.status === 200) {
    console.log('❌ ERROR: Got 200 OK - payment bypass detected!');
    const content = await response1.text();
    console.log('Content length:', content.length);
  } else {
    console.log('❓ Unexpected status code');
  }

  // Step 2: Test with fake payment header (should still fail without valid signature)
  console.log('\nStep 2: Testing with fake payment header...');
  const response2 = await fetch('http://localhost:3000/tickets/premium', {
    headers: {
      'X-PAYMENT': 'fake-payment-data'
    }
  });

  console.log(`Status: ${response2.status} ${response2.statusText}`);
  if (response2.status === 402) {
    console.log('✅ Correctly rejected fake payment');
  } else {
    console.log('❌ ERROR: Accepted fake payment!');
  }
}

testPaymentFlow().catch(console.error);