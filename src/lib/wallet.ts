import { ethers } from 'ethers';

// Base Sepolia RPC and USDC contract
const BASE_SEPOLIA_RPC = 'https://sepolia.base.org';
const USDC_CONTRACT_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'; // Base Sepolia USDC

// USDC ABI (minimal - just balanceOf)
const USDC_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)'
];

// Generate or load wallet
export function generateAgentWallet() {
  // In production, this would be loaded from secure environment variables
  // For demo purposes, we'll generate a deterministic wallet
  const privateKey = process.env.AGENT_WALLET_PRIVATE_KEY ||
    '0x' + ethers.keccak256(ethers.toUtf8Bytes('autonomous-ai-video-agents-base-sepolia')).slice(2);

  const provider = new ethers.JsonRpcProvider(BASE_SEPOLIA_RPC);
  const wallet = new ethers.Wallet(privateKey, provider);

  return {
    wallet,
    address: wallet.address,
    privateKey: privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`
  };
}

// Get USDC balance from blockchain
export async function getUSDCBalance(address: string): Promise<number> {
  try {
    const provider = new ethers.JsonRpcProvider(BASE_SEPOLIA_RPC);
    const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, USDC_ABI, provider);

    const balance = await usdcContract.balanceOf(address);
    const decimals = await usdcContract.decimals();

    // Convert from wei to USDC (6 decimals)
    const balanceInUSDC = Number(ethers.formatUnits(balance, decimals));

    return balanceInUSDC;
  } catch (error) {
    console.error('Error fetching USDC balance:', error);
    return 0;
  }
}

// Get wallet info with real blockchain data
export async function getAgentWalletInfo() {
  const { wallet, address } = generateAgentWallet();
  const usdcBalance = await getUSDCBalance(address);

  return {
    address,
    balance: usdcBalance,
    network: 'Base Sepolia',
    currency: 'USDC',
    explorerUrl: `https://sepolia.basescan.org/address/${address}`,
    lastUpdated: new Date().toISOString()
  };
}

// Real USDC transfer function using x402 protocol
export async function executeRealPayment(amount: number, recipient?: string) {
  try {
    const { wallet } = generateAgentWallet();
    const provider = new ethers.JsonRpcProvider(BASE_SEPOLIA_RPC);
    const connectedWallet = wallet.connect(provider);

    // USDC contract for transfers
    const usdcContract = new ethers.Contract(
      USDC_CONTRACT_ADDRESS,
      [
        'function transfer(address to, uint256 amount) returns (bool)',
        'function balanceOf(address account) view returns (uint256)',
        'function decimals() view returns (uint8)'
      ],
      connectedWallet
    );

    // For autonomous agent payments, we'll transfer to a burn/treasury address
    // This simulates the payment being "used" for the service
    const treasuryAddress = '0x000000000000000000000000000000000000dEaD'; // Burn address
    const paymentRecipient = recipient || treasuryAddress;

    // Convert amount to USDC units (6 decimals)
    const decimals = await usdcContract.decimals();
    const amountInUnits = ethers.parseUnits(amount.toString(), decimals);

    console.log(`Executing REAL USDC payment: ${amount} USDC to ${paymentRecipient}`);

    // Execute the real transfer
    const tx = await usdcContract.transfer(paymentRecipient, amountInUnits);
    console.log('Transaction sent:', tx.hash);

    // Wait for confirmation
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt.hash);

    return {
      success: true,
      txHash: receipt.hash,
      amount,
      recipient: paymentRecipient,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Real payment failed:', error);
    throw new Error(`Payment execution failed: ${error.message}`);
  }
}