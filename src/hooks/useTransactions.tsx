import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

interface Transaction {
  id: string,
  title: string,
  type: string,
  category: string,
  amount: number,
  createdAt: string,
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>

interface TransactionsProviderProps {
  children: ReactNode
}

interface TransactionsContextData {
  transactions: Transaction[],
  createTransaction: (transaction: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api.get('transactions')
      .then(({ data }) => setTransactions(data.transactions))
  }, []);

  const createTransaction = useCallback(async (transactionInput: TransactionInput): Promise<void> => {
    const response = await api.post('/transactions', transactionInput);
    const { transaction } = response.data;

    setTransactions([...transactions, transaction]);
  }, [transactions]);

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  )
}


export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
};
