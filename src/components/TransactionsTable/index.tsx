import { useTransactions } from "../../hooks/useTransactions";
import { Container } from "./styles";
import deleteImg from '../../assets/delete.svg'

export function TransactionsTable() {
  const { transactions, clearTransactions } = useTransactions()

  return (
    <Container>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Value</th>
            <th>Category</th>
            <th>Date</th>
            <th>
              <button type="button" onClick={clearTransactions}>Clear transactions</button>
            </th>
          </tr>
        </thead>

        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.title}</td>
              <td className={transaction.type}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(transaction.amount)}
              </td>
              <td>{transaction.category}</td>
              <td>
                {new Intl.DateTimeFormat('pt-BR').format(new Date(transaction.createdAt))}
              </td>
              <td>
              <button type="button" className='transaction-button'>
                <img src={deleteImg} alt="Delete transaction" />
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  )
}
