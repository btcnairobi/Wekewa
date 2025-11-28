import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, TrendingUp, Users, Menu, X, ArrowLeft, Copy, AlertTriangle, Globe, Fingerprint, Receipt, Zap, Landmark, Smartphone, MessageCircle, ChevronRight, Info, ChevronDown, Gift, Share2, Mail, Twitter, Facebook, Linkedin, Send, MessageSquare, Instagram, Youtube, Github, ExternalLink, BookOpen } from 'lucide-react';
import Logo from './components/Logo';
import PriceChart from './components/PriceChart';
import { MOCK_MERCHANTS, TRADING_OPTIONS, SUPPORTED_BANKS } from './constants';
import { Listing, MarketStat } from './types';

// Simple Router States
enum View {
  HOME = 'HOME',
  MERCHANTS = 'MERCHANTS',
  BECOME_MERCHANT = 'BECOME_MERCHANT',
  TRADE = 'TRADE',
  REFERRALS = 'REFERRALS'
}

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Bank Modal State
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [bankSearch, setBankSearch] = useState('');

  // Trade State
  const [wldAmount, setWldAmount] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>(''); // Used for Bank Account, Phone/Till, or LNURL
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');

  // Market Data State
  const [chartData, setChartData] = useState<MarketStat[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0); // USD for Chart
  const [wldPriceKES, setWldPriceKES] = useState<number>(0); // KES for Trading
  const [priceChange, setPriceChange] = useState<number>(0);
  const [chartRange, setChartRange] = useState<string>('1D');
  const [isChartLoading, setIsChartLoading] = useState(false);

  // Referral System State
  const [activeReferrer, setActiveReferrer] = useState<string | null>(null);
  const [referralId, setReferralId] = useState<string>(''); // User's custom handle for sharing

  // Initialize Referral Tracking from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setActiveReferrer(ref);
      sessionStorage.setItem('wekewa_referrer', ref);
    } else {
      const saved = sessionStorage.getItem('wekewa_referrer');
      if (saved) setActiveReferrer(saved);
    }
  }, []);

  // Scroll detection to close mobile menu
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      // Use passive listener for better performance
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobileMenuOpen]);

  // Navigation Helper
  const navigateTo = (view: View) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo(0,0);
  };

  // Helper to generate mock data when API fails
  const generateMockData = (range: string) => {
    const points = 50;
    const data: MarketStat[] = [];
    let price = 4.80; // Start price USD
    const now = new Date();
    
    for (let i = 0; i < points; i++) {
        const time = new Date(now.getTime());
        const offset = points - 1 - i;
        
        // Adjust time based on range
        if (range === '1H') time.setMinutes(now.getMinutes() - offset);
        else if (range === '1D') time.setMinutes(now.getMinutes() - (offset * 30));
        else if (range === '1W') time.setHours(now.getHours() - (offset * 4));
        else if (range === '1M') time.setDate(now.getDate() - offset);
        else if (range === '1Y') time.setDate(now.getDate() - (offset * 7));

        // Random walk
        const change = (Math.random() - 0.5) * 0.15;
        price = price + change;
        
        let timeStr = '';
        if (range === '1H' || range === '1D') {
            timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            timeStr = time.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }

        data.push({ time: timeStr, price: Math.max(0.1, price) });
    }
    return data;
  };

  // Fetch Market Data Logic
  const fetchMarketData = async (range: string) => {
    setIsChartLoading(true);
    try {
        // Fetch current price (USD & KES)
        const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=worldcoin-wld&vs_currencies=usd,kes&include_24hr_change=true', {
            headers: { 'Accept': 'application/json' }
        });
        
        if (!priceRes.ok) throw new Error('Price API Error');
        const priceJson = await priceRes.json();
        
        if (priceJson['worldcoin-wld']) {
           setCurrentPrice(priceJson['worldcoin-wld'].usd);
           setWldPriceKES(priceJson['worldcoin-wld'].kes);
           // Default to 24h change initially
           setPriceChange(priceJson['worldcoin-wld'].usd_24h_change); 
        }

        // Map range to CoinGecko 'days' parameter
        let days = '1';
        switch(range) {
            case '1H': days = '1'; break; // CoinGecko doesn't support < 1 day well on free tier for history sometimes, defaulting to 1 day for 1H view but charting last hour
            case '1D': days = '1'; break;
            case '1W': days = '7'; break;
            case '1M': days = '30'; break;
            case '1Y': days = '365'; break;
        }

        const chartRes = await fetch(`https://api.coingecko.com/api/v3/coins/worldcoin-wld/market_chart?vs_currency=usd&days=${days}`, {
            headers: { 'Accept': 'application/json' }
        });

        if (!chartRes.ok) throw new Error('Chart API Error');
        const chartJson = await chartRes.json();
        
        if (chartJson.prices && chartJson.prices.length > 0) {
            let prices = chartJson.prices;
            
            // For 1H, we slice the last portion of 1 Day data if needed, or use full data if 1H endpoint not available
            if (range === '1H') {
                const oneHourAgo = Date.now() - 3600000;
                prices = prices.filter((p: number[]) => p[0] > oneHourAgo);
            }

            const formattedData = prices.map((item: [number, number]) => {
                const date = new Date(item[0]);
                let timeStr = '';
                if (range === '1H' || range === '1D') {
                    timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                } else if (range === '1W' || range === '1M') {
                     timeStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                } else {
                     timeStr = date.toLocaleDateString([], { month: 'short', year: '2-digit' });
                }
                return {
                    time: timeStr,
                    price: item[1]
                };
            });
            
            setChartData(formattedData);
            
            // Calculate change based on the selected range timeframe
            if (formattedData.length > 0) {
                const startPrice = formattedData[0].price;
                const endPrice = formattedData[formattedData.length - 1].price;
                const change = ((endPrice - startPrice) / startPrice) * 100;
                setPriceChange(change);
            }
        }
    } catch (error) {
        console.warn("Using fallback data due to API error:", error);
        
        // Fallback Logic
        const fallbackData = generateMockData(range);
        setChartData(fallbackData);
        if (fallbackData.length > 0) {
            const lastPrice = fallbackData[fallbackData.length - 1].price;
            setCurrentPrice(lastPrice);
            // Fallback KES approximate
            setWldPriceKES(lastPrice * 129); 
            const startPrice = fallbackData[0].price;
            setPriceChange(((lastPrice - startPrice) / startPrice) * 100);
        }
    } finally {
        setIsChartLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData(chartRange);
    
    // Poll every 60s
    const interval = setInterval(() => fetchMarketData(chartRange), 60000);
    return () => clearInterval(interval);
  }, [chartRange]);

  // Dynamic Price Calculation
  // Platform Fee is 3%, so we offer 97% of the market price
  const getOfferPrice = () => {
     if (wldPriceKES > 0) return wldPriceKES * 0.97;
     return 0;
  };

  const handleTradeClick = (listing: Listing) => {
    // Intercept Bank Transfer to show modal
    if (listing.id === 'opt_bank') {
      setIsBankModalOpen(true);
      return;
    }
    
    const offerPrice = getOfferPrice();
    // Create a copy with the live calculated price
    const dynamicListing = { 
        ...listing, 
        price: offerPrice > 0 ? parseFloat(offerPrice.toFixed(2)) : listing.price 
    };

    setSelectedListing(dynamicListing);
    setWldAmount(''); // Reset amount
    setAccountNumber('');
    setSelectedNetwork('');
    navigateTo(View.TRADE);
  };

  const handleBankSelect = (bankName: string) => {
    // Find the base bank listing
    const baseListing = TRADING_OPTIONS.find(o => o.id === 'opt_bank');
    if (baseListing) {
      const offerPrice = getOfferPrice();
      // Create a copy with the specific bank name and live price
      const bankListing = { 
        ...baseListing, 
        paymentMethods: [bankName],
        price: offerPrice > 0 ? parseFloat(offerPrice.toFixed(2)) : baseListing.price 
      };
      setSelectedListing(bankListing);
      setWldAmount('');
      setAccountNumber('');
      setSelectedNetwork('');
      setIsBankModalOpen(false);
      navigateTo(View.TRADE);
    }
  };

  // Auto-select first network when listing loads
  useEffect(() => {
    if (selectedListing) {
      const merchant = MOCK_MERCHANTS.find(m => m.name === selectedListing.user.name);
      if (merchant && merchant.networks && merchant.networks.length > 0) {
        setSelectedNetwork(merchant.networks[0].name);
      }
    }
  }, [selectedListing]);

  const filteredBanks = SUPPORTED_BANKS.filter(bank => 
    bank.toLowerCase().includes(bankSearch.toLowerCase())
  );

  // Standard Transaction Fee Calculation (Used for both Bank and M-Pesa)
  const getTransactionFee = (amount: number) => {
    if (amount >= 0 && amount <= 99) return 0;
    if (amount >= 100 && amount <= 999) return 13;
    if (amount >= 1000 && amount <= 9999) return 90;
    if (amount >= 10000 && amount <= 99999) return 108;
    if (amount >= 100000) return 108; // Cap at max bracket provided
    return 0;
  };

  // Calculate Totals Logic
  const calculateTotals = () => {
    if (!selectedListing || !wldAmount) return { gross: 0, fee: 0, net: 0 };
    
    const amount = parseFloat(wldAmount);
    if (isNaN(amount)) return { gross: 0, fee: 0, net: 0 };

    // 'selectedListing.price' is already (Market Price - 3%)
    const gross = amount * selectedListing.price;
    let paymentMethodFee = 0;

    // Apply specific fees if it's a bank transfer OR M-Pesa
    const isBank = selectedListing.id === 'opt_bank' || (selectedListing.paymentMethods.length > 0 && SUPPORTED_BANKS.includes(selectedListing.paymentMethods[0]));
    const isMpesa = selectedListing.id === 'opt_mpesa';

    if (isBank || isMpesa) {
      paymentMethodFee = getTransactionFee(gross);
    }
    
    // Note: 3% platform fee is already deducted from the unit price (Gross amount is Net of platform fee)
    // We only subtract the payment method transaction fee here to get final Net
    const net = gross - paymentMethodFee;

    return {
      gross,
      fee: paymentMethodFee,
      net: Math.max(0, net)
    };
  };

  const { gross, fee, net } = calculateTotals();

  const handleConfirmTrade = () => {
    if (!selectedListing) return;

    const merchant = MOCK_MERCHANTS.find(m => m.name === selectedListing.user.name);
    const merchantAddress = merchant?.depositAddress || 'Ask support';

    const orderNumber = Math.floor(100000 + Math.random() * 900000); // 6 digit random
    const now = new Date();
    const dayTime = now.toLocaleString('en-KE', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    const paymentMethod = selectedListing.paymentMethods[0];

    // Format the message
    let message = `Hi, Wekewa please process my order...
Order: #${orderNumber}
Selling: ${wldAmount} WLD
Network: ${selectedNetwork}
Merchant Address: ${merchantAddress}
Time: ${dayTime}
Payment method: ${paymentMethod}
Amount to be paid: ${net.toFixed(2)} KES
Account number/Details: ${accountNumber || 'N/A'}`;

    // Append Referrer if exists
    if (activeReferrer) {
      message += `\nReferred By: ${activeReferrer}`;
    }

    message += `\n\nShould we proceed?`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/254799830656?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  // Mock Email Service
  const mockSendEmail = async (subject: string, body: string) => {
    // In a production app, this would use fetch() to a backend API
    console.group("📧 EMAIL SIMULATION (To: wekewa.com@gmail.com)");
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log("Timestamp:", new Date().toISOString());
    console.groupEnd();
    return true;
  };

  const handleSocialShare = async (platform: string) => {
    const handle = referralId.trim() || 'anonymous';
    const link = `https://wekewa.vercel.app/?ref=${handle}`;
    const text = `Trade Worldcoin securely on Wekewa! ${link} #wekewa`;
    const encodedText = encodeURIComponent(text);
    const encodedLink = encodeURIComponent(link);
    const encodedTag = encodeURIComponent("#wekewa");

    // Notify Admin of Share
    const emailBody = `
User Activity Alert:
User ID: ${handle}
Action: Shared on ${platform}
Link: ${link}
Time: ${new Date().toLocaleString()}
    `;
    mockSendEmail(`User ${handle} shared on ${platform}`, emailBody);

    let url = '';

    switch(platform) {
        case 'whatsapp':
            url = `https://wa.me/?text=${encodedText}`;
            break;
        case 'twitter':
            url = `https://twitter.com/intent/tweet?text=${encodeURIComponent("Trade Worldcoin securely on Wekewa! #wekewa")}&url=${encodedLink}`;
            break;
        case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}&hashtag=${encodedTag}`;
            break;
        case 'telegram':
            url = `https://t.me/share/url?url=${encodedLink}&text=${encodeURIComponent("Trade Worldcoin securely on Wekewa! #wekewa")}`;
            break;
        case 'linkedin':
            url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`;
            break;
        case 'reddit':
            url = `https://www.reddit.com/submit?url=${encodedLink}&title=${encodeURIComponent("Wekewa - Worldcoin P2P Exchange #wekewa")}`;
            break;
        case 'email':
            url = `mailto:?subject=Check out Wekewa&body=${encodedText}`;
            break;
        case 'sms':
            url = `sms:?body=${encodedText}`;
            break;
        case 'copy':
            try {
                await navigator.clipboard.writeText(link);
                alert('Link copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy', err);
            }
            return; // Don't open window for copy
    }

    if (url) {
        window.open(url, '_blank');
    }
  };

  const isSellMode = selectedListing?.type === 'buy'; // If merchant buys, user sells
  const isBank = selectedListing?.id === 'opt_bank' || (selectedListing?.paymentMethods[0] && SUPPORTED_BANKS.includes(selectedListing.paymentMethods[0]));
  const isMpesa = selectedListing?.id === 'opt_mpesa';
  const isBTC = selectedListing?.id === 'opt_btc';
  
  // Get current merchant profile logic
  const currentMerchant = selectedListing ? MOCK_MERCHANTS.find(m => m.name === selectedListing.user.name) : null;
  const currentOfferPrice = getOfferPrice();

  return (
    <div className="min-h-screen bg-white text-wekewa-black font-sans selection:bg-black selection:text-white">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo(View.HOME)}>
              <Logo width={32} height={32} className="text-black sm:w-10 sm:h-10" />
              <span className="font-bold text-lg sm:text-xl tracking-tight">Wekewa</span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => navigateTo(View.HOME)} 
                className={`text-sm font-medium transition-colors ${currentView === View.HOME ? 'text-black' : 'text-gray-500 hover:text-black'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => navigateTo(View.MERCHANTS)} 
                className={`text-sm font-medium transition-colors ${currentView === View.MERCHANTS ? 'text-black' : 'text-gray-500 hover:text-black'}`}
              >
                Merchants
              </button>
              <button 
                onClick={() => navigateTo(View.BECOME_MERCHANT)} 
                className={`text-sm font-medium transition-colors ${currentView === View.BECOME_MERCHANT ? 'text-black' : 'text-gray-500 hover:text-black'}`}
              >
                Become a Merchant
              </button>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-4">
               <button className="text-sm font-medium text-gray-600 hover:text-black">Log in</button>
               <button 
                 onClick={() => navigateTo(View.REFERRALS)}
                 className={`px-5 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 flex items-center gap-2 ${currentView === View.REFERRALS ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-black text-white hover:bg-gray-800'}`}
               >
                 <Gift size={16} />
                 Share & Earn
               </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-700">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Pushes content down */}
        {isMobileMenuOpen && (
          <div className="md:hidden w-full bg-white border-t border-gray-100 p-4 flex flex-col space-y-4">
             <button onClick={() => navigateTo(View.HOME)} className="text-left font-medium p-2 hover:bg-gray-50 rounded">Overview</button>
             <button onClick={() => navigateTo(View.MERCHANTS)} className="text-left font-medium p-2 hover:bg-gray-50 rounded">Merchants</button>
             <button onClick={() => navigateTo(View.BECOME_MERCHANT)} className="text-left font-medium p-2 hover:bg-gray-50 rounded">Become a Merchant</button>
             <div className="h-px bg-gray-100 my-2"></div>
             <button 
               onClick={() => navigateTo(View.REFERRALS)}
               className="w-full bg-black text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
             >
               <Gift size={18} />
               Share & Earn
             </button>
          </div>
        )}
      </nav>

      {/* View Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* --- HOME VIEW --- */}
        {currentView === View.HOME && (
          <div className="space-y-8 sm:space-y-12">
            {/* Hero */}
            <section className="relative py-8 sm:py-12 lg:py-20 text-center md:text-left grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-4 sm:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Live P2P Trading
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.1]">
                  Sell your <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">Worldcoin</span> instant.
                </h1>
                <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto md:mx-0">
                  Wekewa is the secure peer-to-peer exchange for Worldcoin. Trade directly with verified merchants using your preferred local payment method.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <button 
                    onClick={() => navigateTo(View.MERCHANTS)}
                    className="px-8 py-3 sm:py-4 bg-black text-white rounded-full font-semibold text-base sm:text-lg hover:bg-gray-800 transition-transform hover:translate-y-[-2px] shadow-lg shadow-gray-200"
                  >
                    Start Trading
                  </button>
                </div>
              </div>
              <div className="relative">
                 {/* Decorative Abstract W */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-gray-100 to-transparent rounded-full blur-3xl -z-10"></div>
                 <div className="relative bg-white/50 backdrop-blur-sm p-2 rounded-3xl border border-white shadow-2xl">
                    <PriceChart 
                      data={chartData} 
                      currentPrice={currentPrice}
                      priceChange={priceChange}
                      selectedRange={chartRange}
                      onRangeChange={setChartRange}
                      isLoading={isChartLoading}
                    />
                 </div>
              </div>
            </section>
          </div>
        )}

        {/* --- MERCHANTS VIEW --- */}
        {currentView === View.MERCHANTS && (
           <div className="space-y-8 sm:space-y-12">
            <div className="text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Verified Merchants</h1>
                <p className="text-sm sm:text-base text-gray-500">Trusted partners for high-volume and secure transactions.</p>
            </div>
            
            {/* Wekewa Official Profile */}
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
               {MOCK_MERCHANTS.map(merchant => (
                 <div key={merchant.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="p-5 sm:p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg sm:text-xl">
                              {merchant.name.charAt(0)}
                           </div>
                           <div>
                              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                                {merchant.name}
                                {merchant.verified && <ShieldCheck size={20} className="text-blue-500 fill-blue-500/10"/>}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-500">{merchant.stats.trades} trades • {merchant.stats.completionRate}% completion</p>
                           </div>
                        </div>
                        <div className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 text-[10px] sm:text-xs font-bold rounded-full uppercase">Verified</div>
                    </div>
                    
                    <div className="p-5 sm:p-6 space-y-6 flex-1">
                        <div>
                           <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Contact Information</label>
                           <p className="font-mono text-base sm:text-lg font-medium text-gray-900">{merchant.phone}</p>
                        </div>
                        
                        {/* Render World ID Profile if available */}
                        {merchant.worldIdProfile && (
                           <div className="bg-black/5 p-4 rounded-xl border border-black/10">
                              <div className="flex items-center gap-2 mb-3">
                                <Globe size={16} className="text-black"/>
                                <label className="text-xs font-semibold text-gray-900 uppercase tracking-wider">World ID Profile</label>
                              </div>
                              
                              <div className="space-y-3">
                                 <div className="flex justify-between items-center border-b border-black/5 pb-2">
                                    <span className="text-sm text-gray-600">Username</span>
                                    <span className="font-mono font-medium">{merchant.worldIdProfile.username}</span>
                                 </div>
                                 <div className="flex justify-between items-center border-b border-black/5 pb-2">
                                    <span className="text-sm text-gray-600">ENS</span>
                                    <span className="font-mono font-medium">{merchant.worldIdProfile.ens}</span>
                                 </div>
                                 <div className="flex justify-between items-center border-b border-black/5 pb-2">
                                    <span className="text-sm text-gray-600">Public Link</span>
                                    <span className="font-medium text-blue-600 hover:underline cursor-pointer break-all text-right pl-4">{merchant.worldIdProfile.publicLink}</span>
                                 </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 flex items-center gap-1">
                                       <Fingerprint size={14}/> Verified
                                    </span>
                                    <span className="font-medium text-green-600 text-sm">{merchant.worldIdProfile.verificationDate}</span>
                                 </div>
                              </div>
                           </div>
                        )}

                        {merchant.depositAddress && (
                          <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100">
                             <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                   Binance WLD Deposit Address
                                </label>
                                <span className="text-[10px] bg-white border border-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full font-medium">WLD Only</span>
                             </div>
                            
                            <div className="flex items-center gap-2">
                              <code className="flex-1 bg-white p-3 rounded-lg font-mono text-xs sm:text-sm break-all border border-yellow-200 text-gray-800 shadow-sm">
                                 {merchant.depositAddress}
                              </code>
                              <button className="p-3 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-black hover:border-black transition-colors" title="Copy Address">
                                <Copy size={16} />
                              </button>
                            </div>
                            <div className="mt-2 flex items-start gap-2 text-xs text-yellow-700">
                               <AlertTriangle size={14} className="mt-0.5 shrink-0"/>
                               <p>Only send WLD using the same network you select below. Incorrect networks may result in loss of funds.</p>
                            </div>
                          </div>
                        )}

                        {merchant.networks && (
                           <div className="space-y-4">
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Supported Networks</label>
                              <div className="grid gap-3">
                                {merchant.networks.map((net, i) => (
                                  <div key={i} className={`p-4 rounded-xl border ${net.color} transition-all hover:scale-[1.01]`}>
                                     <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                          <span className="w-2 h-2 rounded-full bg-current opacity-50"></span>
                                          <span className="font-bold text-sm">{net.name}</span>
                                        </div>
                                        <span className="text-xs font-medium opacity-80 bg-white/50 px-2 py-1 rounded">{net.arrivalTime}</span>
                                     </div>
                                     <p className="text-xs opacity-90 mb-3 leading-relaxed">{net.notes}</p>
                                     <div className="flex flex-wrap gap-y-1 gap-x-3 text-[10px] font-medium opacity-75 border-t border-black/5 pt-2 mt-2">
                                        <span>Min: {net.minDeposit}</span>
                                        <span className="text-black/20">|</span>
                                        <span>Conf: {net.confirmations}</span>
                                     </div>
                                  </div>
                                ))}
                              </div>
                           </div>
                        )}
                    </div>
                 </div>
               ))}

               {/* Payment Methods / Trading Options */}
               <div className="flex flex-col h-full">
                  <div className="bg-gray-900 text-white p-6 sm:p-8 rounded-2xl mb-8 flex-1">
                      <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold">Start Trading</h3>
                            <p className="text-gray-400 text-sm sm:text-base mt-1">Live market prices minus fees.</p>
                          </div>
                          <div className="text-right">
                             <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Live Price (KES)</div>
                             {currentOfferPrice > 0 ? (
                                <div className="text-green-400 font-bold font-mono text-lg animate-pulse">{currentOfferPrice.toFixed(2)}</div>
                             ) : (
                                <div className="text-gray-600 text-sm">Loading...</div>
                             )}
                          </div>
                      </div>
                      <p className="text-gray-400 mb-8 text-sm sm:text-base">Select your preferred payment method to initiate a trade.</p>
                      
                      <div className="space-y-4">
                         {/* BTC */}
                         <div className="bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer group" onClick={() => handleTradeClick(TRADING_OPTIONS[0])}>
                            <div className="flex justify-between items-center mb-3">
                               <div className="flex items-center gap-3">
                                  <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><Zap size={24}/></div>
                                  <div>
                                     <h4 className="font-bold text-base sm:text-lg">BTC Lightning</h4>
                                     <p className="text-xs text-gray-400">Instant & Free</p>
                                  </div>
                               </div>
                               <button className="px-3 sm:px-4 py-2 bg-white text-black text-xs sm:text-sm font-bold rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                  {currentOfferPrice > 0 ? `${currentOfferPrice.toFixed(2)} KES` : 'Loading...'}
                               </button>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm border-t border-gray-700 pt-3">
                               <span className="text-gray-400">Fees: <span className="text-green-400 font-bold">Free</span></span>
                               <span className="text-gray-400">Limit: 10 - 100k KES</span>
                            </div>
                         </div>

                         {/* M-Pesa */}
                         <div className="bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-700 hover:border-green-500 transition-colors cursor-pointer group" onClick={() => handleTradeClick(TRADING_OPTIONS[1])}>
                            <div className="flex justify-between items-center mb-3">
                               <div className="flex items-center gap-3">
                                  <div className="p-2 bg-green-500/10 rounded-lg text-green-500"><Smartphone size={24}/></div>
                                  <div>
                                     <h4 className="font-bold text-base sm:text-lg">M-Pesa</h4>
                                     <p className="text-xs text-gray-400">Mobile Money</p>
                                  </div>
                               </div>
                               <button className="px-3 sm:px-4 py-2 bg-white text-black text-xs sm:text-sm font-bold rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                 {currentOfferPrice > 0 ? `${currentOfferPrice.toFixed(2)} KES` : 'Loading...'}
                               </button>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm border-t border-gray-700 pt-3">
                               <span className="text-gray-400">Fees: <span className="text-white font-bold">Standard</span></span>
                               <span className="text-gray-400">Limit: 10 - 100k KES</span>
                            </div>
                         </div>

                         {/* Bank */}
                         <div className="bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors cursor-pointer group" onClick={() => handleTradeClick(TRADING_OPTIONS[2])}>
                            <div className="flex justify-between items-center mb-3">
                               <div className="flex items-center gap-3">
                                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><Landmark size={24}/></div>
                                  <div>
                                     <h4 className="font-bold text-base sm:text-lg">Bank Transfer</h4>
                                     <p className="text-xs text-gray-400">Secure Transfer</p>
                                  </div>
                               </div>
                               <button className="px-3 sm:px-4 py-2 bg-white text-black text-xs sm:text-sm font-bold rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                 {currentOfferPrice > 0 ? `${currentOfferPrice.toFixed(2)} KES` : 'Loading...'}
                               </button>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm border-t border-gray-700 pt-3">
                               <span className="text-gray-400">Fees: <span className="text-white font-bold">Variable</span></span>
                               <span className="text-gray-400">Limit: 10 - 100k KES</span>
                            </div>
                         </div>
                      </div>
                  </div>
               </div>
            </div>

             {/* --- Fees Section --- */}
             <div className="mt-8 sm:mt-12 bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="p-2 bg-black text-white rounded-lg">
                  <Receipt size={24} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">Wekewa Fees (Plain & Simple)</h2>
              </div>
              
              <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">
                At <span className="font-bold text-black">Wekewa</span>, we charge a <span className="font-bold text-black">3% platform fee</span> on all crypto transactions.
              </p>

              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Government Tax
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wider">Kenya VASP Excise Duty</p>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">
                        Kenya charges a <span className="font-bold text-black">10% excise duty</span> on all VASP service fees.
                    </p>
                    <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Wekewa Fee</span>
                            <span className="font-bold">3%</span>
                        </div>
                         <div className="flex justify-between text-gray-500">
                            <span>Govt Tax (10% of fee)</span>
                            <span>0.3%</span>
                        </div>
                         <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-green-600">
                            <span>Net Revenue</span>
                            <span>2.7%</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-lg mb-4">What This Means for You</h3>
                    <p className="text-gray-600 leading-relaxed mb-4 text-sm sm:text-base">
                        You are charged <span className="font-bold text-black">3%</span>, and Wekewa remits <span className="font-bold text-black">0.3%</span> to the government as required by law.
                    </p>
                    <div className="flex items-center gap-3 text-green-700 bg-green-50 p-4 rounded-xl border border-green-100">
                        <ShieldCheck size={20} className="shrink-0"/>
                        <span className="font-medium text-sm sm:text-base">Your trading experience is unaffected — we handle all compliance on our side.</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- BECOME A MERCHANT VIEW --- */}
        {currentView === View.BECOME_MERCHANT && (
          <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-12 py-8 sm:py-12">
             <div className="space-y-4 sm:space-y-6">
               <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Become a Verified Merchant</h1>
               <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
                 Join our exclusive network of trusted traders. Enjoy lower fees, priority support, and high-volume limits.
               </p>
             </div>
             
             <div className="bg-black text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                   <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to upgrade?</h2>
                   <p className="text-gray-400 mb-8 max-w-xl mx-auto text-sm sm:text-base">
                     Contact our merchant onboarding team directly on WhatsApp to start your verification process.
                   </p>
                   <a 
                     href="https://wa.me/254799830656?text=I%20want%20to%20become%20a%20%23WekewaMerchant" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-green-500 text-white rounded-full font-bold text-base sm:text-lg hover:bg-green-600 transition-transform hover:scale-105 shadow-lg shadow-green-900/20"
                   >
                     <MessageCircle size={24} />
                     Contact on WhatsApp
                   </a>
                </div>
             </div>
          </div>
        )}

        {/* --- REFERRALS VIEW --- */}
        {currentView === View.REFERRALS && (
          <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 py-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-50 text-yellow-700 font-semibold text-xs uppercase tracking-wider mb-2">
                <Gift size={14} className="animate-bounce" />
                Invite & Earn Crypto
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Give 21%, Get <span className="text-green-600">21%</span></h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Invite friends to trade on Wekewa. You both share 42% of the platform revenue from their <strong>first 3 trades</strong>.
              </p>
            </div>

            {/* Link Generation Section */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl max-w-2xl mx-auto">
               <label className="block text-sm font-bold text-gray-800 mb-2">Your Name or Handle (Optional)</label>
               <div className="relative mb-6">
                 <input 
                   type="text" 
                   placeholder="e.g. Satoshi"
                   value={referralId}
                   onChange={(e) => setReferralId(e.target.value)}
                   className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black text-lg"
                 />
                 <span className="absolute right-4 top-4 text-gray-400">?ref={referralId || '...'}</span>
               </div>

               <p className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Share to Socials</p>
               <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-3 sm:gap-4">
                  <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                     <MessageCircle size={24}/>
                     <span className="text-xs font-bold">WhatsApp</span>
                  </button>
                  <button onClick={() => handleSocialShare('twitter')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-50 text-black hover:bg-gray-100 transition-colors">
                     <Twitter size={24}/>
                     <span className="text-xs font-bold">X (Twitter)</span>
                  </button>
                   <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                     <Facebook size={24}/>
                     <span className="text-xs font-bold">Facebook</span>
                  </button>
                   <button onClick={() => handleSocialShare('telegram')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-sky-50 text-sky-500 hover:bg-sky-100 transition-colors">
                     <Send size={24}/>
                     <span className="text-xs font-bold">Telegram</span>
                  </button>
                   <button onClick={() => handleSocialShare('linkedin')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                     <Linkedin size={24}/>
                     <span className="text-xs font-bold">LinkedIn</span>
                  </button>
                   <button onClick={() => handleSocialShare('reddit')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors">
                     <MessageSquare size={24}/>
                     <span className="text-xs font-bold">Reddit</span>
                  </button>
                   <button onClick={() => handleSocialShare('email')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors">
                     <Mail size={24}/>
                     <span className="text-xs font-bold">Email</span>
                  </button>
                   <button onClick={() => handleSocialShare('sms')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors">
                     <Smartphone size={24}/>
                     <span className="text-xs font-bold">SMS</span>
                  </button>
                   <button onClick={() => handleSocialShare('copy')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                     <Copy size={24}/>
                     <span className="text-xs font-bold">Copy Link</span>
                  </button>
               </div>
            </div>
            
            {/* Qualification Rules */}
            <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-amber-900">
                     <AlertTriangle size={20}/>
                     Qualification Rules
                  </h3>
                  <ul className="space-y-2 text-sm text-amber-900/80">
                     <li className="flex items-start gap-2">
                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                       <span>Referee must complete <strong>3 trades minimum</strong> to unlock rewards.</span>
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                       <span>Rewards are valid for the <strong>first 3 trades only</strong>.</span>
                     </li>
                  </ul>
               </div>
               
               <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                   <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-blue-900">
                     <Zap size={20}/>
                     Payout Structure
                  </h3>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-blue-900/70">Eligibility</span>
                        <span className="font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs">First 3 Trades</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-blue-900/70">Payout Method</span>
                        <span className="font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs">BTC Lightning</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Explanation of 21% Split */}
            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden mt-8">
               <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="text-xl font-bold mb-2">How the 21% / 21% Split Works</h3>
                  <p className="text-gray-600">
                     Fairness first. The 42% revenue share is split equally between you and your friend.
                  </p>
               </div>
               <div className="p-8 grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <span className="text-gray-600 text-sm">Example Trade Volume</span>
                        <span className="font-bold">10,000 KES</span>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl relative">
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-gray-200 w-6 h-[1px]"></div>
                        <span className="text-gray-600 text-sm">Wekewa Fee (3%)</span>
                        <span className="font-mono text-red-500 font-medium">300 KES</span>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl pl-8 relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300"></div>
                         <span className="text-gray-500 text-xs uppercase tracking-wide">Less: Govt Tax (0.3%)</span>
                         <span className="font-mono text-gray-400 text-sm">-30 KES</span>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <span className="text-blue-900 font-bold text-sm">Net Revenue (2.7%)</span>
                        <span className="font-bold text-blue-900">270 KES</span>
                     </div>
                  </div>

                  <div className="space-y-4">
                      <div className="bg-black text-white p-6 rounded-2xl relative overflow-hidden flex justify-between items-center">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                        <div>
                            <h4 className="text-gray-400 font-medium mb-1 uppercase text-[10px] tracking-widest">You Earn (21%)</h4>
                            <div className="text-3xl font-bold text-green-400">56.7 KES</div>
                        </div>
                        <div className="text-right text-xs opacity-60">
                            Paid to Referrer
                        </div>
                     </div>
                     
                     <div className="bg-gray-100 text-black p-6 rounded-2xl relative overflow-hidden flex justify-between items-center border border-gray-200">
                        <div>
                            <h4 className="text-gray-500 font-medium mb-1 uppercase text-[10px] tracking-widest">Friend Earns (21%)</h4>
                            <div className="text-3xl font-bold">56.7 KES</div>
                        </div>
                         <div className="text-right text-xs opacity-60">
                            Paid to Referee
                        </div>
                     </div>
                     
                     <p className="text-center text-xs text-gray-400 pt-2">
                        * Total Payout: 113.4 KES (42% of 270 KES Net Revenue). Paid in <strong>BTC Lightning</strong>.
                     </p>
                  </div>
               </div>
            </div>

          </div>
        )}

        {/* --- TRADE VIEW (Modal/Page) --- */}
        {currentView === View.TRADE && selectedListing && (
          <div className="max-w-3xl mx-auto">
             <button onClick={() => navigateTo(View.MERCHANTS)} className="mb-4 sm:mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-black">
               <ArrowLeft size={16}/> Back to Merchants
             </button>

             <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
               {/* Trade Header */}
               <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                 <div>
                   <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                     {isSellMode ? 'Sell WLD' : 'Buy WLD'} via {selectedListing.paymentMethods[0]}
                     {selectedListing.user.verified && <ShieldCheck size={18} className="text-blue-500"/>}
                   </h2>
                   <p className="text-xs sm:text-sm text-gray-500 mt-1">
                     The price is locked for 15:00 minutes once you start.
                   </p>
                 </div>
                 <div className="text-left sm:text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end">
                   <p className="text-xl sm:text-2xl font-bold">{selectedListing.price.toFixed(2)} {selectedListing.currency}</p>
                   <p className="text-xs text-gray-400">per WLD</p>
                 </div>
               </div>

               {/* Trade Form */}
               <div className="p-4 sm:p-6 md:p-8 grid md:grid-cols-2 gap-8 md:gap-12">
                 <div className="space-y-6">
                    {/* User Selling WLD (Merchant is Buying) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">I want to sell</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={wldAmount}
                          onChange={(e) => setWldAmount(e.target.value)}
                          placeholder={`${selectedListing.minLimit / selectedListing.price}`}
                          className="w-full p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-black font-mono font-medium text-base sm:text-lg"
                        />
                        <span className="absolute right-4 top-3.5 sm:top-4 text-gray-400 font-medium">WLD</span>
                      </div>
                    </div>

                    {/* Network Selection & Merchant Address */}
                    {currentMerchant?.networks && (
                      <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Network</label>
                            <div className="relative">
                            <select
                                value={selectedNetwork}
                                onChange={(e) => setSelectedNetwork(e.target.value)}
                                className="w-full p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-black appearance-none font-medium cursor-pointer text-base"
                            >
                                {currentMerchant.networks.map((net) => (
                                <option key={net.name} value={net.name}>{net.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-3.5 sm:top-4 text-gray-500 pointer-events-none" size={20} />
                            </div>
                            {selectedNetwork && (
                                <p className="text-xs text-blue-600 mt-2 px-1">
                                    {currentMerchant.networks.find(n => n.name === selectedNetwork)?.notes}
                                </p>
                            )}
                        </div>

                        {currentMerchant?.depositAddress && (
                            <div className="bg-yellow-50 p-3 sm:p-4 rounded-xl border border-yellow-100">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-semibold text-yellow-800 uppercase tracking-wider flex items-center gap-2">
                                    Merchant Deposit Address
                                    </label>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                <code className="flex-1 bg-white p-2 sm:p-3 rounded-lg font-mono text-[10px] sm:text-xs break-all border border-yellow-200 text-gray-800">
                                    {currentMerchant.depositAddress}
                                </code>
                                <button 
                                    onClick={() => navigator.clipboard.writeText(currentMerchant.depositAddress || '')}
                                    className="p-2 sm:p-3 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-black hover:border-black transition-colors"
                                    title="Copy to clipboard"
                                >
                                    <Copy size={16} />
                                </button>
                                </div>
                                <div className="mt-2 flex items-start gap-2 text-[10px] text-yellow-800">
                                    <AlertTriangle size={12} className="mt-0.5 shrink-0"/>
                                    <p>Send WLD only via the <strong>{selectedNetwork ? selectedNetwork.split(' ')[0] : 'selected'}</strong> network.</p>
                                </div>
                            </div>
                        )}
                      </div>
                    )}
                 </div>

                 <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">I will receive (Net)</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          readOnly 
                          value={net > 0 ? net.toFixed(2) : '0.00'} 
                          className="w-full p-3 sm:p-4 bg-white rounded-xl border border-gray-200 text-gray-900 font-mono font-bold text-base sm:text-lg"
                        />
                        <span className="absolute right-4 top-3.5 sm:top-4 text-gray-400 font-medium">{selectedListing.currency}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2 text-right">After platform & transfer fees</p>

                      {/* Dynamic Inputs based on Method */}
                      {isBank && (
                         <div className="mt-4 animate-in slide-in-from-top-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account Number</label>
                            <input 
                               type="text"
                               value={accountNumber}
                               onChange={(e) => setAccountNumber(e.target.value)}
                               placeholder="Enter your account number"
                               className="w-full p-3 sm:p-4 bg-white rounded-xl border border-purple-200 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-mono text-base"
                            />
                         </div>
                      )}
                      
                      {isMpesa && (
                         <div className="mt-4 animate-in slide-in-from-top-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">M-Pesa Phone or Till Number</label>
                            <input 
                               type="text"
                               value={accountNumber}
                               onChange={(e) => setAccountNumber(e.target.value)}
                               placeholder="e.g. 0712345678 or 123456"
                               className="w-full p-3 sm:p-4 bg-white rounded-xl border border-green-200 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-mono text-base"
                            />
                         </div>
                      )}

                      {isBTC && (
                         <div className="mt-4 animate-in slide-in-from-top-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Lightning Address (LNURL)</label>
                            <input 
                               type="text"
                               value={accountNumber}
                               onChange={(e) => setAccountNumber(e.target.value)}
                               placeholder="e.g. user@blink.sv"
                               className="w-full p-3 sm:p-4 bg-white rounded-xl border border-orange-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-mono text-base"
                            />
                         </div>
                      )}
                    </div>
                    
                    {/* Fee Tile - Only for Bank & M-Pesa */}
                    {(isBank || isMpesa) && (
                       <div className={`p-3 sm:p-4 rounded-xl border animate-in fade-in ${isMpesa ? 'bg-green-50 border-green-100' : 'bg-purple-50 border-purple-100'}`}>
                          <h4 className={`font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base ${isMpesa ? 'text-green-900' : 'text-purple-900'}`}>
                            <Info size={16}/> Transaction Fees
                          </h4>
                          <div className="space-y-2 text-xs opacity-80">
                             <div className="flex justify-between"><span>0 - 99 KES</span> <span>0 KES</span></div>
                             <div className="flex justify-between"><span>100 - 999 KES</span> <span>13 KES</span></div>
                             <div className="flex justify-between"><span>1,000 - 9,999 KES</span> <span>90 KES</span></div>
                             <div className="flex justify-between"><span>10,000 - 99,999 KES</span> <span>108 KES</span></div>
                             <div className="flex justify-between"><span>100,000+ KES</span> <span>108 KES</span></div>
                          </div>
                          <div className={`mt-3 pt-3 border-t flex justify-between font-bold text-sm ${isMpesa ? 'border-green-200 text-green-900' : 'border-purple-200 text-purple-900'}`}>
                             <span>Applied Fee</span>
                             <span>-{fee} KES</span>
                          </div>
                       </div>
                    )}

                    {/* BTC Education Section */}
                    {isBTC && (
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 space-y-3">
                            <h4 className="font-bold text-orange-900 text-sm flex items-center gap-2">
                                <Zap size={16} className="text-orange-500 fill-orange-500"/>
                                New to Bitcoin Lightning?
                            </h4>
                            <div className="space-y-3">
                                <p className="text-xs text-orange-800">
                                    Don't have a Lightning address? Create one instantly with these recommended wallets:
                                </p>
                                <div className="flex gap-2">
                                    <a href="https://coinos.io" target="_blank" rel="noopener noreferrer" className="flex-1 bg-white border border-orange-200 rounded-lg p-2 text-xs font-medium text-center hover:bg-orange-50 hover:border-orange-300 transition-colors flex items-center justify-center gap-1">
                                        <ExternalLink size={12}/> Coinos.io (Web)
                                    </a>
                                    <a href="https://blink.sv" target="_blank" rel="noopener noreferrer" className="flex-1 bg-white border border-orange-200 rounded-lg p-2 text-xs font-medium text-center hover:bg-orange-50 hover:border-orange-300 transition-colors flex items-center justify-center gap-1">
                                        <ExternalLink size={12}/> Blink.sv (App)
                                    </a>
                                </div>
                                <div className="border-t border-orange-200 pt-2 mt-2">
                                    <a href="https://myfirstbitcoin.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-orange-700 font-semibold hover:underline">
                                        <BookOpen size={14}/>
                                        Study Bitcoin at MyFirstBitcoin.io
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-4">
                      <button 
                        onClick={handleConfirmTrade}
                        disabled={!wldAmount || parseFloat(wldAmount) <= 0 || !accountNumber}
                        className="w-full py-3 sm:py-4 bg-black text-white rounded-xl font-bold text-base sm:text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                      >
                        <MessageCircle size={20} />
                        Confirm & Chat
                      </button>
                    </div>

                    <div className="text-xs sm:text-sm text-gray-600">
                      <h4 className="font-semibold text-black mb-2">Terms of Trade</h4>
                      <ul className="list-disc pl-5 space-y-1">
                         <li>Do not mention crypto, BTC, or WLD in bank remarks.</li>
                         <li>Only pay from an account matching your verified name.</li>
                      </ul>
                    </div>
                 </div>
               </div>
             </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12 sm:mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6">
           <div className="flex gap-8 text-gray-500">
              <a href="https://x.com/mutonganakamoto" target="_blank" className="hover:text-black hover:scale-110 transition-all" title="X (Twitter)"><Twitter size={24} /></a>
              <a href="https://t.me/mutonganakamoto" target="_blank" className="hover:text-sky-500 hover:scale-110 transition-all" title="Telegram"><Send size={24} /></a>
              <a href="https://instagram.com/mutonganakamoto" target="_blank" className="hover:text-pink-600 hover:scale-110 transition-all" title="Instagram"><Instagram size={24} /></a>
           </div>
           
           <div className="flex items-center gap-2 font-medium text-black">
              Made in Kenya <span className="text-xl">🇰🇪</span>
           </div>
        </div>
      </footer>
      
      {/* Bank Selection Modal */}
      {isBankModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 mx-4">
             <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                <h3 className="font-bold text-lg">Select Your Bank</h3>
                <button onClick={() => setIsBankModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                   <X size={20} className="text-gray-500"/>
                </button>
             </div>
             
             <div className="p-4 border-b border-gray-100">
                <div className="relative">
                   <Search size={18} className="absolute left-3 top-3 text-gray-400"/>
                   <input 
                      type="text" 
                      placeholder="Search banks..." 
                      value={bankSearch}
                      onChange={(e) => setBankSearch(e.target.value)}
                      className="w-full bg-gray-100 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                   />
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
                {filteredBanks.length === 0 ? (
                   <div className="p-8 text-center text-gray-500 text-sm">No banks found matching "{bankSearch}"</div>
                ) : (
                  <div className="grid gap-1">
                    {filteredBanks.map((bank, index) => (
                      <button 
                        key={index} 
                        onClick={() => handleBankSelect(bank)}
                        className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg text-left transition-colors group"
                      >
                        <span className="font-medium text-gray-800">{bank}</span>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-black"/>
                      </button>
                    ))}
                  </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};