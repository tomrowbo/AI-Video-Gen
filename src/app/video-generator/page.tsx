'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  cost?: string;
}

interface VideoResult {
  prompt: string;
  model: string;
  videoUrl?: string;
  status: 'pending_payment' | 'generating' | 'completed' | 'failed';
  cost: string;
  agent?: string;
}

interface Agent {
  id: string;
  name: string;
  emoji: string;
  specialty: string;
  personality: string;
  keywords: string[];
  balance: number; // Logical balance in shared wallet
}

// Clean up unused interfaces

// Note: Wallet configuration now loaded dynamically from blockchain

// AI Agent Definitions with Logical Balances
const agents: Agent[] = [
  {
    id: 'director',
    name: 'Director Alex',
    emoji: '🎬',
    specialty: 'Cinematic vision and storytelling',
    personality: 'Creative, visionary, focused on composition and narrative flow',
    keywords: ['cinematic', 'movie', 'film', 'story', 'dramatic', 'scene', 'action', 'adventure', 'thriller', 'romance'],
    balance: 2.50
  },
  {
    id: 'marketer',
    name: 'Marketing Maven',
    emoji: '📈',
    specialty: 'Commercial and advertising content',
    personality: 'Results-driven, persuasive, focused on brand impact and conversion',
    keywords: ['advertisement', 'commercial', 'product', 'brand', 'marketing', 'promotion', 'business', 'corporate', 'sales'],
    balance: 1.80
  },
  {
    id: 'artist',
    name: 'Artistic Soul',
    emoji: '🎨',
    specialty: 'Abstract and creative visuals',
    personality: 'Imaginative, experimental, focused on aesthetic beauty and artistic expression',
    keywords: ['abstract', 'art', 'creative', 'artistic', 'colors', 'visual', 'aesthetic', 'beauty', 'surreal', 'experimental'],
    balance: 3.20
  },
  {
    id: 'educator',
    name: 'Tech Teacher',
    emoji: '🔬',
    specialty: 'Educational and technical content',
    personality: 'Clear, methodical, focused on accuracy and learning outcomes',
    keywords: ['tutorial', 'education', 'technical', 'demo', 'how-to', 'explanation', 'learning', 'training', 'guide'],
    balance: 0.90
  },
  {
    id: 'entertainer',
    name: 'Fun Creator',
    emoji: '🎪',
    specialty: 'Entertainment and viral content',
    personality: 'Energetic, playful, focused on engagement and shareability',
    keywords: ['funny', 'entertainment', 'viral', 'meme', 'comedy', 'fun', 'party', 'celebration', 'dance', 'music'],
    balance: 4.10
  }
];

export default function VideoGenerator() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '🤖 **Welcome!** Describe any video you want and our AI agents will create it for you.\n\nWhat would you like to generate?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<VideoResult | null>(null);
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [explorerUrl, setExplorerUrl] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Agent Selection Logic
  const selectBestAgent = (prompt: string): Agent => {
    const lowerPrompt = prompt.toLowerCase();

    // Calculate scores for each agent based on keyword matches
    const agentScores = agents.map(agent => {
      const score = agent.keywords.reduce((total, keyword) => {
        return total + (lowerPrompt.includes(keyword) ? 1 : 0);
      }, 0);
      return { agent, score };
    });

    // Sort by score and get the best match
    agentScores.sort((a, b) => b.score - a.score);

    // If no keywords match, default to Director for general creative content
    return agentScores[0].score > 0 ? agentScores[0].agent : agents[0];
  };

  // Refresh wallet balance from blockchain
  const refreshWalletBalance = async () => {
    try {
      const response = await fetch('/api/agent-payment');
      if (response.ok) {
        const data = await response.json();
        setWalletBalance(data.walletBalance);
        setWalletAddress(data.walletInfo.address);
        setExplorerUrl(data.walletInfo.explorerUrl);
        console.log('Loaded real wallet data:', data.walletInfo);
      }
    } catch (error) {
      console.error('Failed to refresh wallet balance:', error);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Refresh balance on component mount
  useEffect(() => {
    refreshWalletBalance();
  }, []);

  // Update welcome message with real wallet data
  useEffect(() => {
    if (walletAddress && walletBalance !== undefined) {
      const updatedWelcomeMessage = {
        id: '1',
        role: 'assistant' as const,
        content: `🤖 **Welcome!** Describe any video you want and our AI agents will create it for you.\n\nWhat would you like to generate?`,
        timestamp: new Date()
      };

      setMessages(prev => [updatedWelcomeMessage, ...prev.slice(1)]);
    }
  }, [walletAddress, walletBalance]);

  // Handle payment success/failure from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment_success');
    const paymentError = urlParams.get('payment_error');
    const operationName = urlParams.get('operation_name');
    const promptParam = urlParams.get('prompt');
    const modelParam = urlParams.get('model');
    const txHash = urlParams.get('tx_hash');

    console.log('URL params:', { paymentSuccess, paymentError, operationName, promptParam, modelParam, txHash });

    if (paymentSuccess === 'true' && operationName && promptParam) {
      // Payment was successful, start video generation
      setCurrentVideo({
        prompt: promptParam,
        model: modelParam || 'veo-3.1-fast-generate-preview',
        status: 'generating',
        cost: '$0.10'
      });

      // Find the agent for this video
      const videoAgent = agents.find(a => a.id === (currentVideo?.agent || 'director'));

      const successMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: `✅ **Payment successful!**\n\n💰 Paid: $0.10 USDC\n${videoAgent?.emoji} **${videoAgent?.name}** is now creating your video...\n⏱️ Estimated time: 2-3 minutes...${txHash ? `\n🔗 [View transaction](https://sepolia.basescan.org/tx/${txHash})` : ''}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, successMessage]);

      // Start polling for completion
      const pollOperation = async () => {
        setIsGenerating(true);
        let isComplete = false;
        let attempts = 0;
        const maxAttempts = 60; // 5 minutes max

        while (!isComplete && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
          attempts++;

          try {
            const pollResponse = await fetch('/api/poll-operation', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ operationName })
            });

            const pollResult = await pollResponse.json();

            if (pollResult.done) {
              isComplete = true;

              if (pollResult.error) {
                throw new Error('Video generation failed on server');
              }

              setCurrentVideo(prev => prev ? {
                ...prev,
                status: 'completed',
                videoUrl: pollResult.videoUrl || 'generated-video-url'
              } : null);

              const completedAgent = agents.find(a => a.id === (currentVideo?.agent || 'director'));
              const completedMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: `✅ **${completedAgent?.emoji} ${completedAgent?.name} has completed your video!**\n\n🎥 Your stunning 8-second ${completedAgent?.specialty.toLowerCase()} video is ready!\n📱 Download your creation below\n\n**Thank you for using our demo! 🚀**`,
                timestamp: new Date()
              };

              setMessages(prev => [...prev, completedMessage]);
            } else {
              // Update progress message
              const progressMessage: Message = {
                id: Date.now().toString(),
                role: 'system',
                content: `⏳ Still generating... (${Math.round(attempts * 5 / 60 * 100)}% estimated)`,
                timestamp: new Date()
              };

              setMessages(prev => {
                const filtered = prev.filter(msg => !msg.content.includes('Still generating'));
                return [...filtered, progressMessage];
              });
            }
          } catch (error: unknown) {
            console.error('Polling error:', error);
            isComplete = true;

            const errorMessage: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: `❌ **Generation failed**\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease try again.`,
              timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMessage]);
            setCurrentVideo(prev => prev ? { ...prev, status: 'failed' } : null);
          }
        }

        if (!isComplete) {
          const timeoutMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: '❌ **Generation timed out**\n\nThe video generation took too long. Please try again with a simpler prompt.',
            timestamp: new Date()
          };

          setMessages(prev => [...prev, timeoutMessage]);
          setCurrentVideo(prev => prev ? { ...prev, status: 'failed' } : null);
        }

        setIsGenerating(false);
      };

      pollOperation();

      // Clean up URL params
      window.history.replaceState({}, '', '/video-generator');
    } else if (paymentError) {
      // Payment failed
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `❌ **Payment failed**\n\nError: ${decodeURIComponent(paymentError)}\n\nPlease try again.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);

      // Clean up URL params
      window.history.replaceState({}, '', '/video-generator');
    }
  }, [currentVideo?.agent]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userPrompt = inputValue;
    setInputValue('');

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Select the best agent for this prompt
    const selectedAgent = selectBestAgent(userPrompt);
    setCurrentAgent(selectedAgent);

    // Generate agent-specific response
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: generateAgentResponse(userPrompt, selectedAgent),
      timestamp: new Date(),
      cost: '$0.10'
    };

    setMessages(prev => [...prev, assistantMessage]);

    // Set up video generation - pending payment with agent info
    setCurrentVideo({
      prompt: userPrompt,
      model: 'veo-3.1-fast-generate-preview',
      status: 'pending_payment',
      cost: '$0.10',
      agent: selectedAgent.id
    });
  };

  const generateAgentResponse = (prompt: string, agent: Agent): string => {
    const lowerPrompt = prompt.toLowerCase();

    let response = `${agent.emoji} **${agent.name} here!** I'll create \"${prompt}\"\n\n`;

    // Check if another agent might be better suited (collaboration logic)
    const agentScores = agents.map(a => ({
      agent: a,
      score: a.keywords.reduce((total, keyword) => total + (lowerPrompt.includes(keyword) ? 1 : 0), 0)
    })).sort((a, b) => b.score - a.score);

    // If another agent has a significantly higher score, suggest collaboration
    if (agentScores[0].agent.id !== agent.id && agentScores[0].score > agentScores.find(a => a.agent.id === agent.id)!.score + 1) {
      const betterAgent = agentScores[0].agent;
      response += `*Actually, let me bring in ${betterAgent.emoji} **${betterAgent.name}** who specializes in ${betterAgent.specialty.toLowerCase()}!*\n\n`;
      return generateAgentResponse(prompt, betterAgent);
    }

    // Agent-specific analysis and recommendations
    switch (agent.id) {
      case 'director':
        response += `🎬 **Cinematic Analysis:**\n`;
        if (lowerPrompt.includes('action') || lowerPrompt.includes('fast') || lowerPrompt.includes('dramatic')) {
          response += `• I'll use dynamic camera movements and quick cuts\n`;
          response += `• Adding dramatic lighting for intensity\n`;
        } else if (lowerPrompt.includes('romantic') || lowerPrompt.includes('love') || lowerPrompt.includes('gentle')) {
          response += `• Soft lighting and gentle camera movements\n`;
          response += `• Golden hour aesthetic for warmth\n`;
        } else {
          response += `• Professional composition with rule of thirds\n`;
          response += `• Cinematic depth of field for storytelling\n`;
        }
        break;

      case 'marketer':
        response += `📈 **Marketing Strategy:**\n`;
        response += `• Optimizing for brand recall and engagement\n`;
        response += `• Clear value proposition in opening seconds\n`;
        response += `• Professional corporate aesthetic\n`;
        if (lowerPrompt.includes('product')) {
          response += `• Hero shot positioning for maximum impact\n`;
        }
        break;

      case 'artist':
        response += `🎨 **Artistic Vision:**\n`;
        response += `• Exploring creative color palettes and compositions\n`;
        response += `• Experimental camera angles for unique perspective\n`;
        response += `• Abstract elements for visual interest\n`;
        if (lowerPrompt.includes('colors') || lowerPrompt.includes('abstract')) {
          response += `• Emphasizing artistic flow and movement\n`;
        }
        break;

      case 'educator':
        response += `🔬 **Educational Approach:**\n`;
        response += `• Clear, step-by-step visual demonstration\n`;
        response += `• Optimal lighting for detail visibility\n`;
        response += `• Clean, professional presentation style\n`;
        if (lowerPrompt.includes('demo') || lowerPrompt.includes('tutorial')) {
          response += `• Focus on instructional clarity\n`;
        }
        break;

      case 'entertainer':
        response += `🎪 **Entertainment Factor:**\n`;
        response += `• High energy and engaging visuals\n`;
        response += `• Vibrant colors and dynamic movement\n`;
        response += `• Shareable, viral-worthy content style\n`;
        if (lowerPrompt.includes('funny') || lowerPrompt.includes('party')) {
          response += `• Amplifying fun and excitement levels\n`;
        }
        break;
    }

    response += `\n📋 **Video Specifications:**\n`;
    response += `• Model: Google Veo 3 Fast (high quality)\n`;
    response += `• Duration: 8 seconds (perfect for ${agent.specialty.toLowerCase()})\n`;
    response += `• Resolution: 1080p with native audio\n`;
    response += `• Optimized by: ${agent.name}\n\n`;

    response += `💰 **Special Demo Pricing: $0.10 USDC**\n`;
    response += `(Regular price: $3.20 - you save $3.10!)\n\n`;

    // Agent-specific prompt optimization suggestions
    response += `\n🚀 **${agent.name}'s Optimization Suggestions:**\n`;
    switch (agent.id) {
      case 'director':
        response += `*Enhanced Prompt: "${prompt}, cinematic lighting, professional camera work, dramatic composition"*\n`;
        break;
      case 'marketer':
        response += `*Enhanced Prompt: "${prompt}, professional corporate style, brand-focused, clean aesthetic"*\n`;
        break;
      case 'artist':
        response += `*Enhanced Prompt: "${prompt}, artistic vision, creative composition, vibrant colors"*\n`;
        break;
      case 'educator':
        response += `*Enhanced Prompt: "${prompt}, clear demonstration, educational lighting, step-by-step visual"*\n`;
        break;
      case 'entertainer':
        response += `*Enhanced Prompt: "${prompt}, high energy, engaging visuals, fun and vibrant"*\n`;
        break;
    }

    response += `Ready to create your ${agent.specialty.toLowerCase()} masterpiece?`;

    return response;
  };

  const handlePayAndGenerate = async () => {
    if (!currentVideo) return;

    const agent = agents.find(a => a.id === currentVideo.agent) || agents[0];

    // Add autonomous payment processing message
    const paymentMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: `🤖 **${agent.emoji} ${agent.name} is making autonomous payment...**\n\n💳 Using shared agent wallet for $0.10 USDC\n⚡ No user wallet required - agent handles everything!\n🎬 Video generation starting...`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, paymentMessage]);
    setIsGenerating(true);

    try {
      // Enhance the prompt based on the selected agent
      let enhancedPrompt = currentVideo.prompt;

      switch (agent.id) {
        case 'director':
          enhancedPrompt += ', cinematic lighting, professional camera work, dramatic composition';
          break;
        case 'marketer':
          enhancedPrompt += ', professional corporate style, brand-focused, clean aesthetic';
          break;
        case 'artist':
          enhancedPrompt += ', artistic vision, creative composition, vibrant colors';
          break;
        case 'educator':
          enhancedPrompt += ', clear demonstration, educational lighting, step-by-step visual';
          break;
        case 'entertainer':
          enhancedPrompt += ', high energy, engaging visuals, fun and vibrant';
          break;
      }

      // Make autonomous agent payment
      const paymentResponse = await fetch('/api/agent-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: agent.id,
          prompt: enhancedPrompt,
          model: currentVideo.model,
          cost: currentVideo.cost
        })
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentResult.details || paymentResult.error || 'Payment failed');
      }

      // Payment successful, start video generation
      setCurrentVideo(prev => prev ? {
        ...prev,
        status: 'generating'
      } : null);

      // Update wallet balance in state immediately
      setWalletBalance(paymentResult.walletBalanceAfter);

      const successMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: `✅ **REAL autonomous payment executed!**\n\n💰 ${agent.emoji} **${agent.name}** paid $0.10 USDC from shared wallet\n💳 New balance: $${paymentResult.walletBalanceAfter.toFixed(2)} USDC\n🔗 **TX:** [${paymentResult.realPayment.txHash.slice(0, 10)}...](${paymentResult.realPayment.txExplorerUrl})\n🎬 Video generation in progress...\n⏱️ Estimated time: 2-3 minutes...`,
        timestamp: new Date()
      };

      // Also refresh the wallet balance from blockchain to ensure accuracy
      setTimeout(() => {
        refreshWalletBalance();
      }, 2000);

      setMessages(prev => [...prev, successMessage]);

      // Start polling for completion
      const pollOperation = async () => {
        let isComplete = false;
        let attempts = 0;
        const maxAttempts = 60; // 5 minutes max

        while (!isComplete && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
          attempts++;

          try {
            const pollResponse = await fetch('/api/poll-operation', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ operationName: paymentResult.operationName })
            });

            const pollResult = await pollResponse.json();

            if (pollResult.done) {
              isComplete = true;

              if (pollResult.error) {
                throw new Error('Video generation failed on server');
              }

              setCurrentVideo(prev => prev ? {
                ...prev,
                status: 'completed',
                videoUrl: pollResult.videoUrl || 'generated-video-url'
              } : null);

              const completedMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: `✅ **${agent.emoji} ${agent.name} has completed your video!**\n\n🎥 Your stunning 8-second ${agent.specialty.toLowerCase()} video is ready!\n📱 Download your creation below\n💰 Agent paid autonomously from shared wallet\n\n**Thank you for using our autonomous agent economy! 🚀**`,
                timestamp: new Date()
              };

              setMessages(prev => [...prev, completedMessage]);
            } else {
              // Update progress message
              const progressMessage: Message = {
                id: Date.now().toString(),
                role: 'system',
                content: `⏳ ${agent.emoji} ${agent.name} is still generating... (${Math.round(attempts * 5 / 60 * 100)}% estimated)`,
                timestamp: new Date()
              };

              setMessages(prev => {
                const filtered = prev.filter(msg => !msg.content.includes('is still generating'));
                return [...filtered, progressMessage];
              });
            }
          } catch (error: unknown) {
            console.error('Polling error:', error);
            isComplete = true;

            const errorMessage: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: `❌ **Generation failed**\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease try again.`,
              timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMessage]);
            setCurrentVideo(prev => prev ? { ...prev, status: 'failed' } : null);
          }
        }

        if (!isComplete) {
          const timeoutMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: '❌ **Generation timed out**\n\nThe video generation took too long. Please try again with a simpler prompt.',
            timestamp: new Date()
          };

          setMessages(prev => [...prev, timeoutMessage]);
          setCurrentVideo(prev => prev ? { ...prev, status: 'failed' } : null);
        }

        setIsGenerating(false);
      };

      pollOperation();

    } catch (error: unknown) {
      console.error('Autonomous payment error:', error);
      setIsGenerating(false);

      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `❌ **Autonomous payment failed**\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}\n\n${error instanceof Error ? error.message : 'Unknown error'.includes('Insufficient') ? `💡 **Solution:** Top up the shared agent wallet with USDC!\n📧 Send USDC to: \`${walletAddress}\`` : 'Please try again.'}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      setCurrentVideo(prev => prev ? { ...prev, status: 'failed' } : null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Profile-style Wallet Info */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                href="/"
                className="text-white/70 hover:text-white transition-colors text-sm mb-4 inline-block"
              >
                ← Back to Home
              </Link>
              <h1 className="text-4xl font-bold text-white mb-2">
                🎬 AI Video Studio
              </h1>
            </div>

            {/* Compact Wallet Widget */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-3 flex items-center gap-3">
              <div className={`text-lg font-bold ${
                walletBalance >= 0.10 ? 'text-green-400' : 'text-red-400'
              }`}>
                ${walletBalance.toFixed(2)}
              </div>
              <div className="text-gray-300">•</div>
              <button
                onClick={() => explorerUrl && window.open(explorerUrl, '_blank')}
                className="text-sm font-mono text-blue-400 hover:text-blue-300 transition-colors"
                disabled={!walletAddress}
                title="View on Base Sepolia Explorer"
              >
                {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : 'Loading...'}
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Chat Interface */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="p-4 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">💬 Chat with AI Agents</h2>
                    <p className="text-sm text-gray-300">Describe your video idea</p>
                  </div>
                  {currentAgent && (
                    <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                      <span className="text-lg mr-2">{currentAgent.emoji}</span>
                      <div>
                        <div className="text-sm font-bold text-white">{currentAgent.name}</div>
                        <div className="text-xs text-gray-300">{currentAgent.specialty}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : message.role === 'system'
                          ? 'bg-purple-600/20 text-purple-200 border border-purple-400/30'
                          : 'bg-gray-700 text-gray-200'
                      }`}
                    >
                      <div className="text-sm prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                      {message.cost && message.role === 'assistant' && currentVideo && (
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <button
                            onClick={handlePayAndGenerate}
                            disabled={isGenerating}
                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm w-full"
                          >
                            {isGenerating ? '⏳ Generating...' : `💳 Pay ${message.cost} & Generate Video`}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/20">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Describe your video idea..."
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    disabled={isGenerating}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isGenerating || !inputValue.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Video Preview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="p-4 border-b border-white/20">
                <h2 className="text-xl font-bold text-white">🎥 Video Preview</h2>
                <p className="text-sm text-gray-300">Generated videos appear here</p>
              </div>

              <div className="p-4">
                {currentVideo ? (
                  <div className="space-y-4">
                    {currentVideo.status === 'pending_payment' && (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">💳</div>
                        <p className="text-gray-300 text-lg">Ready to generate</p>
                        <p className="text-sm text-gray-400">Click the payment button in chat to continue</p>
                      </div>
                    )}

                    {currentVideo.status === 'generating' && (
                      <div className="text-center py-12">
                        <div className="animate-spin w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-300 text-lg">Generating video...</p>
                        <p className="text-sm text-gray-400">This may take 1-3 minutes</p>
                      </div>
                    )}

                    {currentVideo.status === 'completed' && (
                      <div className="text-center py-8">
                        <div className="bg-gray-800 rounded-lg aspect-video mb-6 overflow-hidden">
                          {currentVideo.videoUrl ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-300 p-4">
                              <div className="text-6xl mb-4">🎬</div>
                              <h3 className="text-lg font-bold mb-2">Video Generated Successfully!</h3>
                              <p className="text-sm text-gray-400 text-center mb-4">
                                Your 8-second video is ready for download.<br />
                                Due to Google&apos;s API restrictions, preview is not available,<br />
                                but you can download the video directly.
                              </p>
                              <div className="text-xs text-gray-500">
                                Video ID: {currentVideo.videoUrl.split('/')[5]?.split(':')[0] || 'Generated'}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              🎬 Video Preview<br />
                              <span className="text-sm">(8-second video ready)</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 justify-center">
                          {currentVideo.videoUrl && (
                            <a
                              href={`/api/download-video?url=${encodeURIComponent(currentVideo.videoUrl)}`}
                              download="generated-video.mp4"
                              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-bold"
                            >
                              📥 Download MP4
                            </a>
                          )}
                          <button
                            onClick={() => currentVideo.videoUrl && window.open(`/api/download-video?url=${encodeURIComponent(currentVideo.videoUrl)}`, '_blank')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-bold"
                          >
                            🔗 View Video
                          </button>
                        </div>
                      </div>
                    )}

                    {currentVideo.status === 'failed' && (
                      <div className="text-center py-12 text-red-400">
                        <div className="text-6xl mb-4">❌</div>
                        <p>Generation failed</p>
                        <p className="text-sm text-gray-400 mt-2">Try again with a different prompt</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-400">
                    <div className="text-6xl mb-4">🎬</div>
                    <p className="text-lg">Start a conversation to generate your first video</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}