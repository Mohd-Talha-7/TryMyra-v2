import React, { createContext, useContext, useState, useEffect } from 'react';
import PaymentSuccessModal from '../components/PaymentSuccessModal';
import { useUser } from '@clerk/clerk-react';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  amountINR?: number;
  status: 'Completed' | 'Pending' | 'Failed';
  type?: 'credit' | 'debit'; // For UI filtering
  category?: string;
  paymentMethod?: string;
  invoiceUrl?: string;
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  deductCredits: (amount: number, description: string, category?: string) => Promise<boolean>;
  addCredits: (amount: number, description: string, amountINR?: number, status?: 'Completed' | 'Pending') => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  triggerSuccess: (credits: number, amountINR: number) => void;
  isLoading: boolean;
}

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState<{ isOpen: boolean; credits: number; amount: number }>({
    isOpen: false,
    credits: 0,
    amount: 0,
  });

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!user?.id) {
        setBalance(0); // Default balance for new users (no free credits)
        setIsLoading(false);
        return;
      }

      try {
        // Fetch both transactions (credits) and usages (debits)
        const [txResponse, usageResponse] = await Promise.all([
          fetch(`${API_URL}/transactions/${user.id}`),
          fetch(`${API_URL}/usages/${user.id}`)
        ]);

        const transactions = await txResponse.json();
        const usages = await usageResponse.json();

        // Calculate balance: start + credits - debits
        const creditsTotal = transactions.reduce((acc: number, tx: Transaction) => {
          return tx.status === 'Completed' ? acc + tx.amount : acc;
        }, 0);

        const debitsTotal = usages.reduce((acc: number, usage: any) => {
          return acc + Math.abs(usage.amount);
        }, 0);

        // Add type field for UI filtering
        const paymentsWithType = transactions.map((tx: any) => ({ ...tx, type: 'credit' }));
        const usagesWithType = usages.map((usage: any) => ({ ...usage, type: 'debit' }));

        setBalance(creditsTotal - debitsTotal);
        setTransactions([...paymentsWithType, ...usagesWithType]); // Combine for display
      } catch (err) {
        console.error('Failed to fetch wallet data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, [user?.id]);

  const addTransaction = async (t: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction = {
      ...t,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      userId: user?.id
    };

    console.log(`Attempting to save transaction to: ${API_URL}/transactions`);
    console.log('Transaction data:', newTransaction);
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      });

      console.log(`Response status: ${response.status}`);
      if (response.ok) {
        console.log('Transaction saved successfully to backend');
        console.log('Current transactions count before update:', transactions.length);
        setTransactions(prev => {
          const updated = [{ ...newTransaction, type: 'credit' } as Transaction, ...prev];
          console.log('Updated transactions count:', updated.length);
          return updated;
        });
        if (newTransaction.status === 'Completed') {
          setBalance(prev => {
            const newBalance = prev + newTransaction.amount;
            console.log('Updated balance from', prev, 'to', newBalance);
            return newBalance;
          });
        }
      } else {
        const errorData = await response.json();
        console.error('Backend transaction save failed:', errorData);
      }
    } catch (err) {
      console.error('Failed to save transaction:', err);
    }
  };

  const deductCredits = async (amount: number, description: string, category: string = 'AI Generation'): Promise<boolean> => {
    if (balance >= amount) {
      const newUsage = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        description,
        amount: -amount,
        status: 'Completed',
        category,
        userId: user?.id
      };

      console.log(`Attempting to save usage to: ${API_URL}/usages`);
      try {
        const response = await fetch(`${API_URL}/usages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUsage)
        });

        console.log(`Response status: ${response.status}`);
        if (response.ok) {
          console.log('Usage saved successfully to backend');
          setBalance(prev => prev - amount);
          setTransactions(prev => [{ ...newUsage, type: 'debit' } as any, ...prev]);
          return true;
        } else {
          const errorData = await response.json();
          console.error('Backend usage save failed:', errorData);
        }
      } catch (err) {
        console.error('Failed to save usage:', err);
      }
    }
    return false;
  };

  const addCredits = (amount: number, description: string, amountINR: number = 0, status: 'Completed' | 'Pending' = 'Completed') => {
    addTransaction({
      description,
      amount,
      amountINR,
      status,
      paymentMethod: 'Razorpay',
      category: 'Top-up'
    });
  };

  const triggerSuccess = (credits: number, amountINR: number) => {
    setModalState({ isOpen: true, credits, amount: amountINR });
  };

  return (
    <WalletContext.Provider value={{ balance, transactions, deductCredits, addCredits, addTransaction, triggerSuccess, isLoading }}>
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
