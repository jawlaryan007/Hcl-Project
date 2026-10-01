export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  virtualBalance: number;
}

export interface Stock {
  id: number;
  symbol: string;
  companyName: string;
  sector: string;
  currentPrice: number;
  previousPrice: number;
  dayChange?: number;
  dayChangePercent?: number;
}

export interface Holding {
  id: number;
  stock: Stock;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

export interface PortfolioSummary {
  availableBalance: number;
  totalInvested: number;
  currentPortfolioValue: number;
  totalValue: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  totalHoldingsCount: number;
  holdings: Holding[];
}

export interface Transaction {
  id: number;
  user: User;
  stock: Stock;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalAmount: number;
  transactionDate: string;
  status: string;
}

export interface Watchlist {
  id: number;
  user: User;
  stock: Stock;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface TradeResponse {
  success: boolean;
  message: string;
  newVirtualBalance: number;
  transaction: Transaction;
}

export interface AdminStats {
  totalUsers: number;
  totalStocks: number;
  totalTransactions: number;
  totalPlatformVolume: number;
}
