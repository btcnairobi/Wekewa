import { Listing, MarketStat, MerchantProfile } from './types';

export const MOCK_LISTINGS: Listing[] = [
  {
    id: '0',
    user: { name: 'Wekewa Official', verified: true, trades: 50000, completionRate: 100 },
    type: 'buy',
    crypto: 'WLD',
    currency: 'USD',
    price: 4.90, // Premium price for official trading
    minLimit: 10,
    maxLimit: 1000000,
    paymentMethods: ['World App', 'Bank Transfer', 'Wise', 'M-Pesa']
  },
  {
    id: '1',
    user: { name: 'CryptoBaron', verified: true, trades: 1240, completionRate: 99 },
    type: 'sell',
    crypto: 'WLD',
    currency: 'USD',
    price: 4.85,
    minLimit: 50,
    maxLimit: 2000,
    paymentMethods: ['Bank Transfer', 'Wise']
  },
  {
    id: '2',
    user: { name: 'FastTrader_247', verified: true, trades: 450, completionRate: 95 },
    type: 'sell',
    crypto: 'WLD',
    currency: 'USD',
    price: 4.82,
    minLimit: 10,
    maxLimit: 500,
    paymentMethods: ['PayPal', 'Revolut']
  },
  {
    id: '3',
    user: { name: 'WLD_Whale', verified: false, trades: 45, completionRate: 88 },
    type: 'buy',
    crypto: 'WLD',
    currency: 'USD',
    price: 4.75,
    minLimit: 100,
    maxLimit: 5000,
    paymentMethods: ['Bank Transfer']
  },
  {
    id: '4',
    user: { name: 'KenyaConnect', verified: true, trades: 3300, completionRate: 99.5 },
    type: 'sell',
    crypto: 'WLD',
    currency: 'KES',
    price: 650, // Approx KES price
    minLimit: 1000,
    maxLimit: 50000,
    paymentMethods: ['M-Pesa']
  },
  {
    id: '5',
    user: { name: 'EuroStash', verified: true, trades: 89, completionRate: 100 },
    type: 'buy',
    crypto: 'WLD',
    currency: 'EUR',
    price: 4.40,
    minLimit: 20,
    maxLimit: 1000,
    paymentMethods: ['SEPA']
  },
  {
    id: '6',
    user: { name: 'MutongaB2B', verified: true, trades: 850, completionRate: 98 },
    type: 'buy',
    crypto: 'WLD',
    currency: 'KES',
    price: 660, 
    minLimit: 500,
    maxLimit: 100000,
    paymentMethods: ['M-Pesa', 'Bank Transfer']
  }
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
    }
  },
  {
    id: 'm1',
    name: 'MutongaB2B',
    verified: true,
    phone: '+254799830656',
    stats: { trades: 850, completionRate: 98 },
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