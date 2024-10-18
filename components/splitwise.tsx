import React, { useState } from 'react';

// Define types for User and Expense
type User = {
  id: number;
  name: string;
  balance: number;
};

type Expense = {
  id: number;
  description: string;
  amount: number;
  paidBy: number;  // User who paid the amount
  splitBetween: number[];  // Users involved in the expense
};

const Splitwise: React.FC = () => {
  // Sample users
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Aksh', balance: 0 },
    { id: 2, name: 'John', balance: 0 },
    { id: 3, name: 'Jane', balance: 0 },
  ]);

  // Expenses state
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [paidBy, setPaidBy] = useState<number | ''>('');
  const [splitBetween, setSplitBetween] = useState<number[]>([]);

  // Handle adding a new expense
  const handleAddExpense = () => {
    if (description && amount && paidBy && splitBetween.length > 0) {
      const newExpense: Expense = {
        id: expenses.length + 1,
        description,
        amount: +amount,
        paidBy: +paidBy,
        splitBetween,
      };

      // Update users' balances
      const splitAmount = +amount / splitBetween.length;

      const updatedUsers = users.map((user) => {
        if (user.id === paidBy) {
          return { ...user, balance: user.balance + (+amount - splitAmount) };
        }
        if (splitBetween.includes(user.id)) {
          return { ...user, balance: user.balance - splitAmount };
        }
        return user;
      });

      // Add the expense and update users' balances
      setExpenses([...expenses, newExpense]);
      setUsers(updatedUsers);

      // Reset form
      setDescription('');
      setAmount('');
      setPaidBy('');
      setSplitBetween([]);
    }
  };

  // Toggle the user in the splitBetween array
  const handleToggleSplitUser = (userId: number) => {
    if (splitBetween.includes(userId)) {
      setSplitBetween(splitBetween.filter((id) => id !== userId));
    } else {
      setSplitBetween([...splitBetween, userId]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Splitwise Clone</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Expense</h2>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Expense Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
        </div>

        <div className="mb-4">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value ? +e.target.value : '')}
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
        </div>

        <div className="mb-4">
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(+e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          >
            <option value="">Paid By</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <h3 className="text-lg font-medium mb-2">Split Between</h3>
        <div className="flex flex-wrap">
          {users.map((user) => (
            <label key={user.id} className="mr-4 mb-2 flex items-center">
              <input
                type="checkbox"
                checked={splitBetween.includes(user.id)}
                onChange={() => handleToggleSplitUser(user.id)}
                className="mr-2"
              />
              {user.name}
            </label>
          ))}
        </div>

        <button
          onClick={handleAddExpense}
          className="bg-blue-500 text-white rounded-md px-4 py-2 mt-4 hover:bg-blue-600"
        >
          Add Expense
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Users</h2>
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
              <span>{user.name}</span>
              <span className={`${user.balance < 0 ? 'text-red-500' : 'text-green-500'}`}>
                {user.balance.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Expenses</h2>
        <ul className="space-y-2">
          {expenses.map((expense) => (
            <li key={expense.id} className="bg-gray-100 p-4 rounded-md">
              <span className="block font-medium">{expense.description}</span>
              <span className="block text-gray-600">${expense.amount} (Paid by {users.find(u => u.id === expense.paidBy)?.name})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Splitwise;
