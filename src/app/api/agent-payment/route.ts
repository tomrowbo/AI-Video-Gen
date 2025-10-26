import { NextRequest, NextResponse } from 'next/server';
import { getAgentWalletInfo, executeRealPayment } from '@/lib/wallet';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

// Using real blockchain transactions - no demo tracking needed

export async function POST(request: NextRequest) {
  try {
    const { agentId, prompt, model, cost } = await request.json();

    if (!agentId || !prompt || !cost) {
      return NextResponse.json(
        { error: 'Agent ID, prompt, and cost are required' },
        { status: 400 }
      );
    }

    const costAmount = parseFloat(cost.replace('$', ''));

    // Get real wallet info from blockchain
    const walletInfo = await getAgentWalletInfo();
    console.log('Real wallet info:', walletInfo);

    // Check if shared wallet has sufficient balance
    if (walletInfo.balance < costAmount) {
      return NextResponse.json(
        {
          error: 'Insufficient wallet balance',
          details: `Shared wallet has $${walletInfo.balance.toFixed(2)} USDC but needs $${costAmount}`,
          walletBalance: walletInfo.balance,
          requiredAmount: costAmount,
          walletAddress: walletInfo.address,
          explorerUrl: walletInfo.explorerUrl
        },
        { status: 402 }
      );
    }

    console.log(`Agent ${agentId} initiating REAL autonomous payment of ${cost} from shared wallet (${walletInfo.address})`);

    // Execute REAL USDC payment on blockchain
    const paymentResult = await executeRealPayment(costAmount);
    console.log('REAL payment executed:', paymentResult);

    // Get updated wallet balance after REAL payment (wait a moment for blockchain to update)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second for balance to update
    const updatedWalletInfo = await getAgentWalletInfo();
    console.log('Updated wallet balance after payment:', updatedWalletInfo.balance);

    // Start video generation with Google Veo 3.1 API
    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predictLongRunning`;

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        instances: [{
          prompt: prompt
        }],
        parameters: {
          aspectRatio: '16:9'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Video generation API failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Autonomous agent video generation operation started:', result);

    return NextResponse.json({
      success: true,
      operationName: result.name,
      agentId,
      prompt,
      model: model || 'veo-3.1-fast-generate-preview',
      cost,
      paymentMethod: 'autonomous_agent_real_blockchain',
      walletBalanceAfter: updatedWalletInfo.balance,
      walletAddress: walletInfo.address,
      explorerUrl: walletInfo.explorerUrl,
      realPayment: {
        txHash: paymentResult.txHash,
        blockNumber: paymentResult.blockNumber,
        gasUsed: paymentResult.gasUsed,
        recipient: paymentResult.recipient,
        txExplorerUrl: `https://sepolia.basescan.org/tx/${paymentResult.txHash}`
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    console.error('Autonomous agent payment error:', error);

    return NextResponse.json(
      {
        error: 'Autonomous payment failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check wallet balance
export async function GET() {
  try {
    const walletInfo = await getAgentWalletInfo();

    return NextResponse.json({
      success: true,
      walletInfo,
      walletBalance: walletInfo.balance,
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    console.error('Wallet balance check error:', error);

    return NextResponse.json(
      {
        error: 'Failed to check wallet balance',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}