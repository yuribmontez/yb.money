import { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { api } from "../services/api";

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}

interface TransactionProviderProps {
  children: ReactNode;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>

interface TransactionsContextData {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>;
  clearTransactions: () => void
}


const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData)

export function TransactionProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const storagedTransactions = localStorage.getItem('@dtmoney:transactions')

    if (storagedTransactions) {
      const currentTransactions = JSON.parse(storagedTransactions)
      setTransactions(currentTransactions)
    } else {
      api.get('transactions').then(response => setTransactions(response.data.transactions))
    }

  }, [])

  useEffect(() => {
    localStorage.setItem('@dtmoney:transactions', JSON.stringify(transactions))
  }, [transactions])

  async function createTransaction(transactionInput: TransactionInput) {
    const response = await api.post('/transactions', {...transactionInput, createdAt: new Date()})

    const { transaction } = response.data

    setTransactions([ ...transactions, transaction ])
  }

  function clearTransactions() {
    setTransactions([])
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction, clearTransactions }}>
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionsContext)

  return context
}

