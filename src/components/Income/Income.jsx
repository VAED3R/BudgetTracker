import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../Firebase/FirebaseConfig';
import './Income.css';

const Income = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [incomes, setIncomes] = useState([]);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const querySnapshot = await getDocs(collection(db, 'incomes'));
    const userIncomes = querySnapshot.docs
      .filter(doc => doc.data().userId === user.uid)
      .map(doc => ({ id: doc.id, ...doc.data() }));

    setIncomes(userIncomes);
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
        alert('You must be logged in to add income');
        return;
      }

      await addDoc(collection(db, 'incomes'), {
        userId: user.uid,
        name,
        amount: parseFloat(amount),
        frequency
      });

      alert('Income added successfully!');
      setName('');
      setAmount('');
      setFrequency('weekly');
      fetchIncomes();
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'incomes', id));
    alert('Income deleted successfully!');
    fetchIncomes();
  };

  return (
    <div className="income-wrapper">
        <div className="add-income">
          <h2>Add Income</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Income Name (e.g. Salary, Freelance)"
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

            <button type="submit">Add Income</button>
          </form>
        </div>
        <div className="income-list">
          <h3>Your Incomes</h3>
          <ul>
            {incomes.map(income => (
              <li key={income.id}>
                {income.name} - ₹{income.amount} ({income.frequency})
                <button onClick={() => handleDelete(income.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
    </div>
  );
};

export default Income;
