import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../Firebase/FirebaseConfig';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { motion } from 'framer-motion';
import Notification from '../Notification/Notification';
import './Dashboard.css';

const Dashboard = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [incomeCategories, setIncomeCategories] = useState({});
  const [expenseCategories, setExpenseCategories] = useState({});
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [budget, setBudget] = useState({
    amount: '',
    period: 'monthly'
  });
  const [savedBudget, setSavedBudget] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    fetchData();
    fetchBudget();
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
      let adjustedAmount = scaleAmount(amount, 'monthly');
      adjustedAmount = scaleAmount(adjustedAmount, timePeriod);
      
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

    // Check if expenses exceed budget (only if same period)
    if (savedBudget && savedBudget.period === timePeriod) {
      const budgetAmount = parseFloat(savedBudget.amount);
      const currentExpenses = parseFloat(expenseTotal);
      
      if (currentExpenses > budgetAmount) {
        setNotificationMessage(`Warning! You've exceeded your ${timePeriod} budget by ₹${(currentExpenses - budgetAmount).toFixed(2)}`);
        setShowNotification(true);
      }
    }
  };

  const fetchBudget = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const budgetDoc = await getDoc(doc(db, 'userBudgets', user.uid));
    if (budgetDoc.exists()) {
      setSavedBudget(budgetDoc.data());
    }
  };

  const saveBudget = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const amount = parseFloat(budget.amount);
    if (isNaN(amount)) {
      setNotificationMessage('Please enter a valid budget amount');
      setShowNotification(true);
      return;
    }

    try {
      const budgetData = {
        amount: amount,
        period: budget.period
      };
      await setDoc(doc(db, 'userBudgets', user.uid), budgetData);
      setSavedBudget(budgetData);
      setBudget({ amount: '', period: 'monthly' });
      setNotificationMessage('Budget saved successfully!');
      setShowNotification(true);
      fetchData();
    } catch (error) {
      setNotificationMessage('Error saving budget: ' + error.message);
      setShowNotification(true);
    }
  };

  const checkBudgetStatus = () => {
    if (!savedBudget) {
      setNotificationMessage('No budget has been set yet');
      setShowNotification(true);
      return;
    }

    if (savedBudget.period !== timePeriod) {
      setNotificationMessage(`Your budget is set for ${savedBudget.period}, but you're viewing ${timePeriod} data`);
      setShowNotification(true);
      return;
    }

    const remaining = savedBudget.amount - totalExpense;
    if (remaining < 0) {
      setNotificationMessage(`You've exceeded your ${timePeriod} budget by ₹${Math.abs(remaining).toFixed(2)}`);
    } else {
      setNotificationMessage(`You're within budget! Remaining: ₹${remaining.toFixed(2)}`);
    }
    setShowNotification(true);
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  return (
    <div className="dashboard-content">
      {showNotification && (
        <div className="notification-container">
          <Notification message={notificationMessage} onClose={closeNotification} />
        </div>
      )}
      <div className="dashboard">
        <div className="summary">
          <div>
            <p>Total Income: ₹{totalIncome.toFixed(2)}</p>
            <p>Total Expenses: ₹{totalExpense.toFixed(2)}</p>
            <p>Remaining Balance: ₹{(totalIncome - totalExpense).toFixed(2)}</p>
            {savedBudget && savedBudget.period === timePeriod && (
              <p>Budget: ₹{savedBudget.amount.toFixed(2)} ({savedBudget.period})</p>
            )}
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
          <div className="budget-controls">
            <h3>Set Budget</h3>
            <div className="budget-input-group">
              <input
                type="number"
                value={budget.amount}
                onChange={(e) => setBudget({...budget, amount: e.target.value})}
                placeholder="Amount"
                className="budget-input"
              />
              <select
                value={budget.period}
                onChange={(e) => setBudget({...budget, period: e.target.value})}
                className="budget-select"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <button onClick={saveBudget} className="save-budget-btn">Save</button>
            </div>
            <button 
              onClick={checkBudgetStatus}
              className="check-budget-btn"
            >
              Check Budget Status
            </button>
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