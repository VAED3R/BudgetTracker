import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../Firebase/FirebaseConfig';
import './OneTimeTransactions.css';

const OneTimeTransactions = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income'); // ✅ "income" or "expense"
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const querySnapshot = await getDocs(collection(db, 'oneTimeTransactions'));
    const userTransactions = querySnapshot.docs
      .filter(doc => doc.data().userId === user.uid)
      .map(doc => ({ id: doc.id, ...doc.data() }));

    setTransactions(userTransactions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !amount) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert('You must be logged in to add a transaction');
        return;
      }

      await addDoc(collection(db, 'oneTimeTransactions'), {
        userId: user.uid,
        name,
        amount: parseFloat(amount),
        type, // ✅ Stores whether it's an income or expense
      });

      alert('Transaction added successfully!');
      setName('');
      setAmount('');
      setType('income'); // Reset to default
      fetchTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'oneTimeTransactions', id));
    alert('Transaction deleted successfully!');
    fetchTransactions();
  };

  return (
    <div className="transaction-wrapper">
      <div className="add-transaction">
        <h2>Add One-Time Transaction</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Transaction Name (e.g. Bonus, Medical Bill)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <button type="submit">Add Transaction</button>
        </form>
      </div>
      
      <div className="transaction-list">
        <h3>Your One-Time Transactions</h3>
        <ul>
          {transactions.map(transaction => (
            <li key={transaction.id} className={transaction.type === 'income' ? 'income' : 'expense'}>
              {transaction.name} - ₹{transaction.amount} ({transaction.type})
              <button onClick={() => handleDelete(transaction.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OneTimeTransactions;
