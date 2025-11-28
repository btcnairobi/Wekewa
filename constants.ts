import { Listing, MarketStat, MerchantProfile } from './types';

// Trading Options acting as "Listings" for the unified merchant flow
export const TRADING_OPTIONS: Listing[] = [
  {
    id: 'opt_btc',
    user: { name: 'Wekewa Official', verified: true, trades: 50000, completionRate: 100 },
    type: 'buy',
    crypto: 'WLD',
    currency: 'KES',
    price: 660, 
    minLimit: 10,
    maxLimit: 100000,
    paymentMethods: ['BTC Lightning']
  },
  {
    id: 'opt_mpesa',
    user: { name: 'Wekewa Official', verified: true, trades: 50000, completionRate: 100 },
    type: 'buy',
    crypto: 'WLD',
    currency: 'KES',
    price: 660, 
    minLimit: 10,
    maxLimit: 100000,
    paymentMethods: ['M-Pesa']
  },
  {
    id: 'opt_bank',
    user: { name: 'Wekewa Official', verified: true, trades: 50000, completionRate: 100 },
    type: 'buy',
    crypto: 'WLD',
    currency: 'KES',
    price: 660, 
    minLimit: 10,
    maxLimit: 100000,
    paymentMethods: ['Bank Transfer']
  }
];

export const SUPPORTED_BANKS = [
  "Family Bank Ltd",
  "Bank of Africa (BOA)",
  "Faulu DTM",
  "Kingdom Bank",
  "Imperial Bank Ltd",
  "Musoni",
  "KWFT DTM",
  "Rafiki DTM",
  "Branch Microfinance Bank",
  "Uwezo DTM",
  "Credit Bank",
  "Citibank N.A Kenya",
  "Vision Fund Kenya",
  "NCBA",
  "Diamond Trust Bank (DTB)",
  "GTBank Kenya Ltd",
  "SBM Bank",
  "Equity Bank",
  "ABC Bank",
  "Stanbic Bank",
  "Housing Finance Company Ltd",
  "Consolidated Bank Ltd",
  "Caritas MFB",
  "Premier Bank",
  "Ecobank",
  "Sidian Bank",
  "Co-operative Bank",
  "Standard Chartered Bank",
  "ABSA",
  "Spire Bank",
  "SMEP DTM",
  "KCB",
  "Century Microfinance",
  "I&M Bank Limited",
  "Access Bank Kenya",
  "Gulf African Bank",
  "National Bank",
  "Prime Bank",
  "UBA Bank",
  "Post Office Savings Bank"
];

export const MOCK_MERCHANTS: MerchantProfile[] = [
  {
    id: 'm0',
    name: 'Wekewa Official',
    verified: true,
    phone: 'Official Support',
    stats: { trades: 50000, completionRate: 100 },
    worldIdProfile: {
      username: '@wekewa',
      publicLink: 'world.id/wekewa',
      ens: 'wekewa.world.id',
      verificationDate: '18/03/2022'
    },
    depositAddress: '0x5e7ef40b29147e856a3615bbef78140f5d19844e',
    networks: [
      {
        name: 'OPTIMISM (Optimism Network)',
        arrivalTime: '~1 minute',
        confirmations: '1 bundle',
        minDeposit: '>0.0003 WLD',
        notes: 'Fastest and low-cost. Recommended for most deposits.',
        color: 'bg-blue-50 text-blue-900 border-blue-200'
      },
      {
        name: 'ETH (Ethereum ERC-20)',
        arrivalTime: '~2 minutes',
        confirmations: '6 Ethereum block confirmations',
        minDeposit: '>0.0003 WLD',
        notes: 'Very secure but higher gas fees.',
        color: 'bg-purple-50 text-purple-900 border-purple-200'
      },
      {
        name: 'WLD (World Chain)',
        arrivalTime: '~7 minutes',
        confirmations: '1 bundle',
        minDeposit: '>0.00000001 WLD',
        notes: 'Lowest minimum deposit, cheapest fees, but slower.',
        color: 'bg-gray-50 text-gray-900 border-gray-200'
      }
    ]
  }
];

export const MOCK_CHART_DATA: MarketStat[] = [
  { time: '00:00', price: 4.65 },
  { time: '04:00', price: 4.72 },
  { time: '08:00', price: 4.68 },
  { time: '12:00', price: 4.85 },
  { time: '16:00', price: 4.91 },
  { time: '20:00', price: 4.78 },
  { time: '24:00', price: 4.82 },
];

export const MOCK_LISTINGS: Listing[] = []; // Empty as we removed marketplace