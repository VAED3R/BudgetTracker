import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../Firebase/FirebaseConfig';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { motion } from 'framer-motion';
import './Dashboard.css';

const Dashboard = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [incomeCategories, setIncomeCategories] = useState({});
  const [expenseCategories, setExpenseCategories] = useState({});
  const [timePeriod, setTimePeriod] = useState('monthly');

  useEffect(() => {
    fetchData();
  }, [timePeriod]);

  const scaleAmount = (amount, frequency) => {
    const scales = {
      daily: { daily: 1, weekly: 1 / 7, monthly: 1 / 30, yearly: 1 / 365 },
      weekly: { daily: 7, weekly: 1, monthly: 1 / 4.33, yearly: 1 / 52 },
      monthly: { daily: 30, weekly: 4.33, monthly: 1, yearly: 1 / 12 },
      yearly: { daily: 365, weekly: 52, monthly: 12, yearly: 1 },
    };
    return amount * (scales[timePeriod][frequency] || 1);
  };

  const fetchData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const incomeSnapshot = await getDocs(collection(db, 'incomes'));
    const expenseSnapshot = await getDocs(collection(db, 'expenses'));
    const transactionsSnapshot = await getDocs(collection(db, 'oneTimeTransactions'));

    let incomeTotal = 0;
    let expenseTotal = 0;
    let incomeCat = {};
    let expenseCat = {};

    const processTransaction = (data, isIncome) => {
      if (data.userId !== user.uid) return;
      let amount = parseFloat(data.amount);
      let adjustedAmount = scaleAmount(amount, 'monthly'); // Convert to monthly first
      adjustedAmount = scaleAmount(adjustedAmount, timePeriod); // Scale to selected period
      
      if (isIncome) {
        incomeTotal += adjustedAmount;
        incomeCat[data.name] = (incomeCat[data.name] || 0) + adjustedAmount;
      } else {
        expenseTotal += adjustedAmount;
        expenseCat[data.name] = (expenseCat[data.name] || 0) + adjustedAmount;
      }
    };

    incomeSnapshot.docs.forEach(doc => processTransaction(doc.data(), true));
    expenseSnapshot.docs.forEach(doc => processTransaction(doc.data(), false));
    transactionsSnapshot.docs.forEach(doc => processTransaction(doc.data(), doc.data().type === 'income'));

    setTotalIncome(incomeTotal);
    setTotalExpense(expenseTotal);
    setIncomeCategories(incomeCat);
    setExpenseCategories(expenseCat);
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard">
        <div className="summary">
          <div>
            <p>Total Income: ₹{totalIncome.toFixed(2)}</p>
            <p>Total Expenses: ₹{totalExpense.toFixed(2)}</p>
            <p>Remaining Balance: ₹{(totalIncome - totalExpense).toFixed(2)}</p>
          </div>
          {totalIncome - totalExpense < 0 && (
            <div className="money-warning">
              <p><span style={{ color: '#dc3545', fontWeight: 'bold' }}><u>Warning!</u></span><br />You are using up more money than you make</p>
            </div>
          )}
          <div className="controls">
            <label>Select Time Period: </label>
            <select value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
        <div className="pie-charts">
          <div className="chart-container">
            <h3>Overall Money Flow</h3>
            <Pie data={{ labels: ['Income', 'Expenses'], datasets: [{ data: [totalIncome, totalExpense], backgroundColor: ['#4caf50', '#f44336'] }] }} />
          </div>
          <div className="chart-container">
            <h3>Income Breakdown</h3>
            <Pie data={{ labels: Object.keys(incomeCategories), datasets: [{ data: Object.values(incomeCategories), backgroundColor: ['#4caf50', '#8bc34a', '#cddc39', '#ffeb3b'] }] }} />
          </div>
          <div className="chart-container">
            <h3>Expense Breakdown</h3>
            <Pie data={{ labels: Object.keys(expenseCategories), datasets: [{ data: Object.values(expenseCategories), backgroundColor: ['#f44336', '#e57373', '#ffcdd2', '#ff7043'] }] }} />
          </div>
        </div>
      </div>
      <motion.div className="color-sweep" initial={{ y: "0%" }} animate={{ y: "-100%" }} exit={{ y: "0%" }} transition={{ duration: 0.5, ease: "easeInOut" }} />
    </div>
  );
};

export default Dashboard;