import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../Firebase/FirebaseConfig';
import './Expenses.css';

import { motion } from 'framer-motion';

const Expenses = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const querySnapshot = await getDocs(collection(db, 'expenses'));
    const userExpenses = querySnapshot.docs
      .filter(doc => doc.data().userId === user.uid)
      .map(doc => ({ id: doc.id, ...doc.data() }));

    setExpenses(userExpenses);
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
        alert('You must be logged in to add expenses');
        return;
      }

      await addDoc(collection(db, 'expenses'), {
        userId: user.uid,
        name,
        amount: parseFloat(amount),
        frequency
      });

      alert('Expense added successfully!');
      setName('');
      setAmount('');
      setFrequency('weekly');
      fetchExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'expenses', id));
    alert('Expense deleted successfully!');
    fetchExpenses();
  };

  return (
    <>
    <div className="expense-wrapper">
        <div className="add-expense">
          <h2>Add Expense</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Expense Name (e.g. Rent, Bills)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            <button type="submit">Add Expense</button>
          </form>
        </div>
        <div className="expense-list">
          <h3>Your Expenses</h3>
          <ul>
            {expenses.map(expense => (
              <li key={expense.id}>
                {expense.name} - ₹{expense.amount} ({expense.frequency})
                <button onClick={() => handleDelete(expense.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
    </div>
    <motion.div
      className="color-sweep"
      initial={{ y: "0%" }} // Start covering the screen
      animate={{ y: "-100%" }} // Move away when loaded
      exit={{ y: "0%" }} // Cover the screen on exit
      transition={{ duration: 0.5, ease: "easeInOut" }}
    />
    </>
  );
};

export default Expenses;
