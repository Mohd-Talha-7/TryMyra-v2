import React, { createContext, useContext, useState, useEffect } from 'react';
import PaymentSuccessModal from '../components/PaymentSuccessModal';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  amountINR?: number;
  status: 'Completed' | 'Pending' | 'Failed';
  type: 'credit' | 'debit';
  category?: string; // e.g., 'VFX', 'UGC', 'Image', 'Top-up'
  invoiceUrl?: string;
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  deductCredits: (amount: number, description: string, category?: string) => boolean;
  addCredits: (amount: number, description: string, amountINR?: number, status?: 'Completed' | 'Pending') => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  triggerSuccess: (credits: number, amountINR: number) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('trymyra_wallet_balance');
    return saved ? parseInt(saved, 10) : 90100;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('trymyra_transactions');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', date: 'Oct 24, 2023', description: 'AI Ad Generation (Campaign #402)', amount: -50, status: 'Completed', type: 'debit', category: 'VFX' },
      { id: '2', date: 'Oct 22, 2023', description: 'Wallet Top-up', amount: 2000, amountINR: 2000, status: 'Completed', type: 'credit', category: 'Top-up' },
      { id: '3', date: 'Oct 20, 2023', description: 'Video Render (Project Alpha)', amount: -120, status: 'Pending', type: 'debit', category: 'RENDER' },
      { id: '4', date: 'Oct 18, 2023', description: 'Image Upscaling Batch', amount: -35, status: 'Completed', type: 'debit', category: 'IMAGE' },
    ];
  });

  const [modalState, setModalState] = useState<{ isOpen: boolean; credits: number; amount: number }>({
    isOpen: false,
    credits: 0,
    amount: 0,
  });

  useEffect(() => {
    localStorage.setItem('trymyra_wallet_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('trymyra_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (t: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...t,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deductCredits = (amount: number, description: string, category: string = 'AI Generation'): boolean => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      addTransaction({
        description,
        amount: -amount,
        status: 'Completed',
        type: 'debit',
        category
      });
      return true;
    }
    return false;
  };

  const addCredits = (amount: number, description: string, amountINR: number = 0, status: 'Completed' | 'Pending' = 'Completed') => {
    if (status === 'Completed') {
      setBalance(prev => prev + amount);
    }
    addTransaction({
      description,
      amount,
      amountINR,
      status,
      type: 'credit',
      category: 'Top-up'
    });
  };

  const triggerSuccess = (credits: number, amountINR: number) => {
    setModalState({ isOpen: true, credits, amount: amountINR });
  };

  return (
    <WalletContext.Provider value={{ balance, transactions, deductCredits, addCredits, addTransaction, triggerSuccess }}>
      {children}
      <PaymentSuccessModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        amount={modalState.amount}
        credits={modalState.credits}
      />
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
