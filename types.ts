export interface Listing {
  id: string;
  user: {
    name: string;
    verified: boolean;
    trades: number;
    completionRate: number;
  };
  type: 'buy' | 'sell';
  crypto: 'WLD';
  currency: 'USD' | 'EUR' | 'KES' | 'BRL';
  price: number;
  minLimit: number;
  maxLimit: number;
  paymentMethods: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface MarketStat {
  time: string;
  price: number;
}

export interface NetworkDetail {
  name: string;
  arrivalTime: string;
  confirmations: string;
  minDeposit: string;
  notes: string;
  color: string;
}

export interface WorldIdProfile {
  username: string;
  publicLink: string;
  ens: string;
  verificationDate: string;
}

export interface MerchantProfile {
  id: string;
  name: string;
  verified: boolean;
  phone: string;
  stats: {
    trades: number;
    completionRate: number;
  };
  depositAddress?: string;
  networks?: NetworkDetail[];
  worldIdProfile?: WorldIdProfile;
}