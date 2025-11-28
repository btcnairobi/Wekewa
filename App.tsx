import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, ArrowUpRight, TrendingUp, Users, Wallet, Menu, X, ArrowLeft, Copy, AlertTriangle, Globe, Fingerprint } from 'lucide-react';
import Logo from './components/Logo';
import PriceChart from './components/PriceChart';
import AIAssistant from './components/AIAssistant';
import { MOCK_LISTINGS, MOCK_CHART_DATA, MOCK_MERCHANTS } from './constants';
import { Listing } from './types';

// Simple Router States
enum View {
  HOME = 'HOME',
  MARKET = 'MARKET',
  TRADE = 'TRADE',
  MERCHANTS = 'MERCHANTS'
}

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation Helper
  const navigateTo = (view: View) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo(0,0);
  };

  const handleTradeClick = (listing: Listing) => {
    setSelectedListing(listing);
    navigateTo(View.TRADE);
  };

  return (
    <div className="min-h-screen bg-white text-wekewa-black font-sans selection:bg-black selection:text-white">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo(View.HOME)}>
              <Logo width={40} height={40} className="text-black" />
              <span className="font-bold text-xl tracking-tight">Wekewa</span>
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
                onClick={() => navigateTo(View.MARKET)} 
                className={`text-sm font-medium transition-colors ${currentView === View.MARKET ? 'text-black' : 'text-gray-500 hover:text-black'}`}
              >
                Marketplace
              </button>
              <button 
                onClick={() => navigateTo(View.MERCHANTS)} 
                className={`text-sm font-medium transition-colors ${currentView === View.MERCHANTS ? 'text-black' : 'text-gray-500 hover:text-black'}`}
              >
                Merchants
              </button>
              <a href="#" className="text-sm font-medium text-gray-500 hover:text-black">Learn</a>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-4">
               <button className="text-sm font-medium text-gray-600 hover:text-black">Log in</button>
               <button className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:scale-105">
                 Connect Wallet
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 p-4 shadow-xl flex flex-col space-y-4">
             <button onClick={() => navigateTo(View.HOME)} className="text-left font-medium p-2 hover:bg-gray-50 rounded">Overview</button>
             <button onClick={() => navigateTo(View.MARKET)} className="text-left font-medium p-2 hover:bg-gray-50 rounded">Marketplace</button>
             <button onClick={() => navigateTo(View.MERCHANTS)} className="text-left font-medium p-2 hover:bg-gray-50 rounded">Merchants</button>
             <div className="h-px bg-gray-100 my-2"></div>
             <button className="w-full bg-black text-white py-3 rounded-lg font-medium">Connect Wallet</button>
          </div>
        )}
      </nav>

      {/* View Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* --- HOME VIEW --- */}
        {currentView === View.HOME && (
          <div className="space-y-12">
            {/* Hero */}
            <section className="relative py-12 lg:py-20 text-center md:text-left grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Live P2P Trading
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.1]">
                  Sell your <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">Worldcoin</span> instant.
                </h1>
                <p className="text-lg text-gray-600 max-w-md mx-auto md:mx-0">
                  Wekewa is the secure peer-to-peer exchange for Worldcoin. Trade directly with verified merchants using your preferred local payment method.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <button 
                    onClick={() => navigateTo(View.MARKET)}
                    className="px-8 py-4 bg-black text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-transform hover:translate-y-[-2px] shadow-lg shadow-gray-200"
                  >
                    Start Trading
                  </button>
                  <button className="px-8 py-4 bg-white border border-gray-200 text-black rounded-full font-semibold text-lg hover:bg-gray-50 transition-colors">
                    How it Works
                  </button>
                </div>
              </div>
              <div className="relative">
                 {/* Decorative Abstract W */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-gray-100 to-transparent rounded-full blur-3xl -z-10"></div>
                 <div className="relative bg-white/50 backdrop-blur-sm p-2 rounded-3xl border border-white shadow-2xl">
                    <PriceChart data={MOCK_CHART_DATA} />
                    <div className="mt-4 grid grid-cols-2 gap-4">
                       <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                          <div className="p-2 bg-green-50 rounded-lg text-green-600"><ShieldCheck size={24}/></div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">Security</p>
                            <p className="font-bold">Escrow Protected</p>
                          </div>
                       </div>
                       <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users size={24}/></div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">Community</p>
                            <p className="font-bold">20k+ Traders</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </section>

            {/* Features / Steps */}
            <section className="border-t border-gray-100 pt-16">
               <div className="text-center mb-16">
                 <h2 className="text-3xl font-bold mb-4">Simple. Fast. Safe.</h2>
                 <p className="text-gray-500">Trading WLD has never been easier.</p>
               </div>
               <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { icon: <Wallet className="w-8 h-8"/>, title: "Connect Wallet", desc: "Link your World App or compatible wallet securely." },
                    { icon: <Search className="w-8 h-8"/>, title: "Find an Offer", desc: "Browse competitive rates from verified buyers in your currency." },
                    { icon: <ArrowUpRight className="w-8 h-8"/>, title: "Trade & Receive", desc: "Assets are held in escrow until you confirm payment receipt." }
                  ].map((feature, i) => (
                    <div key={i} className="bg-gray-50 p-8 rounded-3xl hover:bg-gray-100 transition-colors cursor-default group">
                       <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-black group-hover:scale-110 transition-transform duration-300">
                         {feature.icon}
                       </div>
                       <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                       <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
               </div>
            </section>
          </div>
        )}

        {/* --- MARKETPLACE VIEW --- */}
        {currentView === View.MARKET && (
          <div className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
               <div>
                 <h1 className="text-3xl font-bold mb-2">P2P Marketplace</h1>
                 <p className="text-gray-500">Buy and sell Worldcoin with zero hidden fees.</p>
               </div>
               <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                 <button className="px-6 py-2 bg-white shadow-sm rounded-md font-medium text-sm text-black">Buy</button>
                 <button className="px-6 py-2 text-gray-500 font-medium text-sm hover:text-black">Sell</button>
               </div>
             </div>

             {/* Filters */}
             <div className="flex flex-wrap gap-3 items-center pb-4 border-b border-gray-100">
                <div className="relative">
                  <input type="text" placeholder="Amount" className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm w-32 focus:outline-none focus:border-black"/>
                  <span className="absolute right-3 top-2.5 text-xs text-gray-400">WLD</span>
                </div>
                <div className="relative">
                   <select className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-black appearance-none cursor-pointer">
                     <option>All Currencies</option>
                     <option>USD</option>
                     <option>KES</option>
                     <option>EUR</option>
                   </select>
                   <Filter size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none"/>
                </div>
                <div className="relative">
                   <select className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-black appearance-none cursor-pointer">
                     <option>All Payments</option>
                     <option>Bank Transfer</option>
                     <option>M-Pesa</option>
                     <option>PayPal</option>
                   </select>
                   <Filter size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none"/>
                </div>
             </div>

             {/* Listings Table */}
             <div className="overflow-x-auto rounded-xl border border-gray-200">
               <table className="w-full text-left border-collapse">
                 <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium">
                   <tr>
                     <th className="p-4">Advertiser</th>
                     <th className="p-4">Price</th>
                     <th className="p-4">Limit / Available</th>
                     <th className="p-4">Payment</th>
                     <th className="p-4 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {MOCK_LISTINGS.map(listing => (
                     <tr key={listing.id} className="hover:bg-gray-50 transition-colors group">
                       <td className="p-4">
                         <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center font-bold text-xs text-white">
                             {listing.user.name.charAt(0)}
                           </div>
                           <div>
                             <div className="flex items-center gap-1">
                               <span className="font-semibold text-sm">{listing.user.name}</span>
                               {listing.user.verified && <ShieldCheck size={14} className="text-blue-500 fill-blue-500/10"/>}
                             </div>
                             <div className="text-xs text-gray-400">
                               {listing.user.trades} trades • {listing.user.completionRate}% completion
                             </div>
                           </div>
                         </div>
                       </td>
                       <td className="p-4">
                         <div className="font-bold text-lg">
                           {listing.price.toFixed(2)} <span className="text-xs font-normal text-gray-500">{listing.currency}</span>
                         </div>
                       </td>
                       <td className="p-4">
                         <div className="text-sm">
                           <span className="text-gray-500">Available:</span> <span className="font-medium">{(listing.maxLimit / listing.price).toFixed(2)} WLD</span>
                         </div>
                         <div className="text-xs text-gray-400 mt-1">
                           Limit: {listing.minLimit} - {listing.maxLimit} {listing.currency}
                         </div>
                       </td>
                       <td className="p-4">
                         <div className="flex flex-wrap gap-1">
                           {listing.paymentMethods.map(m => (
                             <span key={m} className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs text-gray-600">
                               {m}
                             </span>
                           ))}
                         </div>
                       </td>
                       <td className="p-4 text-right">
                         <button 
                           onClick={() => handleTradeClick(listing)}
                           className={`px-4 py-2 rounded-lg text-sm font-semibold transition-transform active:scale-95 ${
                             listing.type === 'sell' 
                               ? 'bg-green-500 text-white hover:bg-green-600' 
                               : 'bg-red-500 text-white hover:bg-red-600'
                           }`}
                         >
                           {listing.type === 'sell' ? 'Buy WLD' : 'Sell WLD'}
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {/* --- MERCHANTS VIEW --- */}
        {currentView === View.MERCHANTS && (
           <div className="space-y-8">
            <div className="text-center md:text-left border-b border-gray-100 pb-8">
                <h1 className="text-3xl font-bold mb-2">Verified Merchants</h1>
                <p className="text-gray-500">Trusted partners for high-volume and secure transactions.</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
               {MOCK_MERCHANTS.map(merchant => (
                 <div key={merchant.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl">
                              {merchant.name.charAt(0)}
                           </div>
                           <div>
                              <h3 className="font-bold text-lg flex items-center gap-2">
                                {merchant.name}
                                {merchant.verified && <ShieldCheck size={20} className="text-blue-500 fill-blue-500/10"/>}
                              </h3>
                              <p className="text-sm text-gray-500">{merchant.stats.trades} trades • {merchant.stats.completionRate}% completion</p>
                           </div>
                        </div>
                        <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">Verified</div>
                    </div>
                    
                    <div className="p-6 space-y-6 flex-1">
                        <div>
                           <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Contact Information</label>
                           <p className="font-mono text-lg font-medium text-gray-900">{merchant.phone}</p>
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
                                    <span className="font-medium text-blue-600 hover:underline cursor-pointer">{merchant.worldIdProfile.publicLink}</span>
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
                              <code className="flex-1 bg-white p-3 rounded-lg font-mono text-sm break-all border border-yellow-200 text-gray-800 shadow-sm">
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
            </div>
          </div>
        )}

        {/* --- TRADE VIEW (Modal/Page) --- */}
        {currentView === View.TRADE && selectedListing && (
          <div className="max-w-3xl mx-auto">
             <button onClick={() => navigateTo(View.MARKET)} className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-black">
               <ArrowLeft size={16}/> Back to Marketplace
             </button>

             <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
               {/* Trade Header */}
               <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                 <div>
                   <h2 className="text-xl font-bold flex items-center gap-2">
                     {selectedListing.type === 'sell' ? 'Buy WLD' : 'Sell WLD'} from {selectedListing.user.name}
                     {selectedListing.user.verified && <ShieldCheck size={18} className="text-blue-500"/>}
                   </h2>
                   <p className="text-sm text-gray-500 mt-1">
                     The price is locked for 15:00 minutes once you start.
                   </p>
                 </div>
                 <div className="text-right">
                   <p className="text-2xl font-bold">{selectedListing.price} {selectedListing.currency}</p>
                   <p className="text-xs text-gray-400">per WLD</p>
                 </div>
               </div>

               {/* Trade Form */}
               <div className="p-8 grid md:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">I want to pay</label>
                      <div className="relative">
                        <input type="number" defaultValue={selectedListing.minLimit} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-black font-mono font-medium"/>
                        <span className="absolute right-4 top-4 text-gray-400 font-medium">{selectedListing.currency}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">I will receive</label>
                      <div className="relative">
                        <input type="number" readOnly value={(selectedListing.minLimit / selectedListing.price).toFixed(4)} className="w-full p-4 bg-white rounded-xl border border-gray-200 text-gray-500 font-mono font-medium"/>
                        <span className="absolute right-4 top-4 text-gray-400 font-medium">WLD</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                        {selectedListing.type === 'sell' ? 'Confirm Purchase' : 'Confirm Sale'}
                      </button>
                    </div>
                 </div>

                 {/* Trade Terms / Info */}
                 <div className="space-y-6 text-sm text-gray-600">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <TrendingUp size={16}/> Market Insight
                      </h4>
                      <p className="leading-relaxed">
                        This price is <span className="font-bold">1.2% better</span> than the current global average. 
                        User {selectedListing.user.name} typically releases crypto in &lt;5 mins.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-black mb-2">Terms of Trade</h4>
                      <ul className="list-disc pl-5 space-y-1">
                         <li>Do not mention crypto, BTC, or WLD in bank remarks.</li>
                         <li>Only pay from an account matching your verified name.</li>
                         <li>Trades exceeding limits will be rejected.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-black mb-2">Payment Method</h4>
                      <div className="flex gap-2">
                        {selectedListing.paymentMethods.map(m => (
                          <span key={m} className="px-3 py-1 bg-gray-100 rounded text-xs font-medium">{m}</span>
                        ))}
                      </div>
                    </div>
                 </div>
               </div>
             </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2 opacity-50">
              <Logo width={30} height={30} className="text-black" />
              <span className="font-semibold">Wekewa</span>
           </div>
           <div className="text-sm text-gray-400">
             &copy; {new Date().getFullYear()} Wekewa Inc. All rights reserved.
           </div>
           <div className="flex gap-6 text-sm text-gray-500">
             <a href="#" className="hover:text-black">Terms</a>
             <a href="#" className="hover:text-black">Privacy</a>
             <a href="#" className="hover:text-black">Support</a>
           </div>
        </div>
      </footer>

      {/* AI Assistant - Always Present */}
      <AIAssistant />
    </div>
  );
};