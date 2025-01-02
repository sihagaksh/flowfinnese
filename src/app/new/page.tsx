"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Check, Plus, Settings2, Trash, Edit, FileText, Filter, History, Download, Upload } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// Types
type Group = {
    id: number;
    name: string;
    users: User[];
    expenses: Expense[];
    categories: string[];
    recurringExpenses: RecurringExpense[];
    baseCurrency: Currency;
    notifications: Notification[];
};

type User = {
    id: number;
    name: string;
    balance: string;
    expenses: Expense[];
};

type Expense = {
    id: number;
    description: string;
    amount: number;
    date: string;
    paidBy: User;
    splitWith: User[];
    category: string;
    notes: string[];
    splitOption: SplitOption;
    splitDetails: { [userId: number]: number };
};

type RecurringExpense = Expense & {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    endDate: string | null;
};

type Notification = {
    id: number;
    userId: number;
    message: string;
    read: boolean;
    createdAt: string;
};

type Currency = {
    code: string;
    name: string;
    symbol: string;
    rate: number;
};

type SplitOption = 'equal' | 'exact' | 'percentage' | 'shares';

// Initial data
const initialGroups: Group[] = [
    {
        id: 1,
        name: "Trip to Paris",
        users: [
            { id: 1, name: "John Doe", balance: "$0", expenses: [] },
            { id: 2, name: "Jane Smith", balance: "$25", expenses: [] },
            { id: 3, name: "Alice Johnson", balance: "$-25", expenses: [] },
        ],
        expenses: [],
        categories: ["Food", "Transportation", "Accommodation", "Activities"],
        recurringExpenses: [],
        baseCurrency: { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
        notifications: [],
    },
    {
        id: 2,
        name: "Weekend Hangout",
        users: [
            { id: 1, name: "John Doe", balance: "$0", expenses: [] },
            { id: 2, name: "Jane Smith", balance: "$25", expenses: [] },
        ],
        expenses: [],
        categories: ["Food", "Entertainment"],
        recurringExpenses: [],
        baseCurrency: { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
        notifications: [],
    },
];

// Components
const RecurringExpenseForm = ({ onSubmit }: { onSubmit: (expense: RecurringExpense) => void }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState(0);
    const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
    const [endDate, setEndDate] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const startDate = new Date();
        let recurringExpense: RecurringExpense = {
            id: Date.now(),
            description,
            amount,
            date: startDate.toISOString(),
            paidBy: { id: 1, name: 'Current User', balance: '0', expenses: [] },
            splitWith: [],
            category: 'Recurring',
            notes: [],
            frequency,
            endDate,
            splitOption: 'equal',
            splitDetails: {},
        };
        onSubmit(recurringExpense);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
            />
            <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                placeholder="Amount"
                required
            />
            <Select onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'yearly') => setFrequency(value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
            </Select>
            <Input
                type="date"
                value={endDate || ''}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date (optional)"
            />
            <Button type="submit">Add Recurring Expense</Button>
        </form>
    );
};

const CategoryManagement = ({ categories, onAddCategory, onRemoveCategory }: {
    categories: string[];
    onAddCategory: (category: string) => void;
    onRemoveCategory: (category: string) => void;
}) => {
    const [newCategory, setNewCategory] = useState('');

    const handleAddCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            onAddCategory(newCategory);
            setNewCategory('');
        }
    };

    return (
        <div>
            <h3>Manage Categories</h3>
            <div>
                <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category"
                />
                <Button onClick={handleAddCategory}>Add Category</Button>
            </div>
            <ul>
                {categories.map((category) => (
                    <li key={category}>
                        {category}
                        <Button onClick={() => onRemoveCategory(category)}>Remove</Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const CurrencyConversion = ({ amount, baseCurrency, onCurrencyChange }: {
    amount: number;
    baseCurrency: Currency;
    onCurrencyChange: (newCurrency: Currency) => void;
}) => {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>(baseCurrency);

    useEffect(() => {
        // Simulated API call for currency rates
        const simulatedRates = {
            USD: 1,
            EUR: 0.85,
            GBP: 0.73,
            JPY: 110.14,
        };
        const currencyList: Currency[] = Object.entries(simulatedRates).map(([code, rate]) => ({
            code,
            name: code,
            symbol: code,
            rate: rate as number,
        }));
        setCurrencies(currencyList);
    }, []);

    const handleCurrencyChange = (currencyCode: string) => {
        const newCurrency = currencies.find((c) => c.code === currencyCode);
        if (newCurrency) {
            setSelectedCurrency(newCurrency);
            onCurrencyChange(newCurrency);
        }
    };

    return (
        <div>
            <Select onValueChange={handleCurrencyChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                    {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <p>
                {amount} {baseCurrency.code} = {(amount * selectedCurrency.rate).toFixed(2)} {selectedCurrency.code}
            </p>
        </div>
    );
};

const ExpenseSplitting = ({ amount, users, onSplitChange }: {
    amount: number;
    users: User[];
    onSplitChange: (splitOption: SplitOption, splitDetails: { [userId: number]: number }) => void;
}) => {
    const [splitOption, setSplitOption] = useState<SplitOption>('equal');
    const [splitDetails, setSplitDetails] = useState<{ [userId: number]: number }>({});

    const handleSplitOptionChange = (option: SplitOption) => {
        setSplitOption(option);
        let newSplitDetails: { [userId: number]: number } = {};

        switch (option) {
            case 'equal':
                const equalShare = amount / users.length;
                users.forEach((user) => {
                    newSplitDetails[user.id] = equalShare;
                });
                break;
            case 'exact':
            case 'percentage':
            case 'shares':
                users.forEach((user) => {
                    newSplitDetails[user.id] = 0;
                });
                break;
        }

        setSplitDetails(newSplitDetails);
        onSplitChange(option, newSplitDetails);
    };

    const handleSplitDetailChange = (userId: number, value: number) => {
        const newSplitDetails = { ...splitDetails, [userId]: value };
        setSplitDetails(newSplitDetails);
        onSplitChange(splitOption, newSplitDetails);
    };

    return (
        <div>
            <Select onValueChange={(value: SplitOption) => handleSplitOptionChange(value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Split option" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="equal">Split Equally</SelectItem>
                    <SelectItem value="exact">Split by Exact Amounts</SelectItem>
                    <SelectItem value="percentage">Split by Percentages</SelectItem>
                    <SelectItem value="shares">Split by Shares</SelectItem>
                </SelectContent>
            </Select>
            {splitOption !== 'equal' && (
                <div>
                    {users.map((user) => (
                        <div key={user.id}>
                            <Label>{user.name}</Label>
                            <Input
                                type="number"
                                value={splitDetails[user.id] || 0}
                                onChange={(e) => handleSplitDetailChange(user.id, parseFloat(e.target.value))}
                                placeholder={splitOption === 'percentage' ? 'Percentage' : splitOption === 'shares' ? 'Shares' : 'Amount'}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Notifications = ({ notifications, onMarkAsRead }: {
    notifications: Notification[];
    onMarkAsRead: (notificationId: number) => void;
}) => {
    return (
        <div>
            <h3>Notifications</h3>
            {notifications.length === 0 ? (
                <p>No new notifications</p>
            ) : (
                <ul>
                    {notifications.map((notification) => (
                        <li key={notification.id}>
                            <p>{notification.message}</p>
                            <p>Created at: {new Date(notification.createdAt).toLocaleString()}</p>
                            {!notification.read && (
                                <Button onClick={() => onMarkAsRead(notification.id)}>Mark as Read</Button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const DataVisualization = ({ expenses }: { expenses: Expense[] }) => {
    const categoryData = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {} as { [category: string]: number });

    const barChartData = {
        labels: Object.keys(categoryData),
        datasets: [
            {
                label: 'Expenses by Category',
                data: Object.values(categoryData),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    const pieChartData = {
        labels: Object.keys(categoryData),
        datasets: [
            {
                data: Object.values(categoryData),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
            },
        ],
    };

    return (
        <div>
            <h3>Expense Analysis</h3>
            <div style={{ width: '50%', display: 'inline-block' }}>
                <Bar data={barChartData} options={{ responsive: true }} />
            </div>
            <div style={{ width: '50%', display: 'inline-block' }}>
                <Pie data={pieChartData} options={{ responsive: true }} />
            </div>
        </div>
    );
};

// Main component
export default function Page() {
    const [groups, setGroups] = useState<Group[]>(initialGroups);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddingGroup, setIsAddingGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
    const [expenseDescription, setExpenseDescription] = useState("");
    const [expenseAmount, setExpenseAmount] = useState(0);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [newUserName, setNewUserName] = useState("");
    const [expenseCategory, setExpenseCategory] = useState("");
    const [expenseNotes, setExpenseNotes] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [baseCurrency, setBaseCurrency] = useState<Currency>({ code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 });

    useEffect(() => {
        const storedGroups = localStorage.getItem("groups");
        if (storedGroups) {
            const parsedGroups = JSON.parse(storedGroups);
            setGroups(parsedGroups);
            setSelectedGroup(parsedGroups[0]);
        } else {
            setSelectedGroup(groups[0]);
        }
    }, []);

    useEffect(() => {
        if (groups.length > 0) {
            localStorage.setItem("groups", JSON.stringify(groups));
        }
    }, [groups]);

    const handleGroupSelect = (group: Group) => {
        setSelectedGroup(group);
    };

    const handleAddGroup = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        if (newGroupName.trim() === "") {
            alert("Group name cannot be empty.");
            return;
        }
        const newGroup: Group = {
            id: groups.length + 1,
            name: newGroupName,
            users: [],
            expenses: [],
            categories: ["Food", "Transportation", "Accommodation", "Activities"],
            recurringExpenses: [],
            baseCurrency: { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
            notifications: [],
        };
        setGroups([...groups, newGroup]);
        setNewGroupName("");
        setIsAddingGroup(false);
    };

    const handleAddUser = () => {
        if (newUserName.trim() === "") {
            alert("User name cannot be empty.");
            return;
        }
        const newUser: User = {
            id: selectedGroup!.users.length + 1,
            name: newUserName,
            balance: "$0",
            expenses: [],
        };
        const updatedGroup = {
            ...selectedGroup!,
            users: [...selectedGroup!.users, newUser],
        };
        setGroups(groups.map(group => group.id === selectedGroup!.id ? updatedGroup : group));
        setSelectedGroup(updatedGroup);
        setNewUserName("");
        alert(`${newUserName} has been added to the group "${selectedGroup!.name}".`);
    };

    const calculateCashFlow = () => {
        const balances = selectedGroup!.users.map((user) => ({
            id: user.id,
            name: user.name,
            balance: parseFloat(user.balance.replace('$', '')),
        }));

        const transactions: { from: string; to: string; amount: number }[] = [];

        while (true) {
            balances.sort((a, b) => a.balance - b.balance);

            const minBalance = balances[0];
            const maxBalance = balances[balances.length - 1];

            if (Math.abs(minBalance.balance) < 0.01 && Math.abs(maxBalance.balance) < 0.01) {
                break;
            }

            const settleAmount = Math.min(Math.abs(minBalance.balance), maxBalance.balance);

            transactions.push({
                from: minBalance.name,
                to: maxBalance.name,
                amount: parseFloat(settleAmount.toFixed(2)),
            });

            minBalance.balance += settleAmount;
            maxBalance.balance -= settleAmount;
        }

        return transactions;
    };

    const handleAddExpenseSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (expenseDescription.trim() === "" || expenseAmount <= 0 || selectedUsers.length === 0) {
            alert("Please fill out all fields correctly.");
            return;
        }

        const paidByUser = selectedGroup!.users.find((user) => selectedUsers[0] === user.name);
        if (!paidByUser) {
            alert("Please select a valid user who paid the expense.");
            return;
        }

        const splitWithUsers = selectedGroup!.users.filter((user) => selectedUsers.slice(1).includes(user.name));

        const newExpense: Expense = {
            id: selectedGroup!.expenses.length + 1,
            description: expenseDescription,
            amount: expenseAmount,
            date: new Date().toISOString(),
            paidBy: paidByUser,
            splitWith: splitWithUsers,
            category: expenseCategory,
            notes: expenseNotes ? [expenseNotes] : [],
            splitOption: 'equal',
            splitDetails: {},
        };

        const updatedUsers = selectedGroup!.users.map(user => {
            if (user.id === paidByUser.id) {
                return {
                    ...user,
                    balance: `$${(parseFloat(user.balance.replace('$', '')) + expenseAmount).toFixed(2)}`,
                    expenses: [...user.expenses, newExpense],
                };
            }
            if (splitWithUsers.some(splitUser => splitUser.id === user.id)) {
                const splitAmount = expenseAmount / (splitWithUsers.length + 1);
                return {
                    ...user,
                    balance: `$${(parseFloat(user.balance.replace('$', '')) - splitAmount).toFixed(2)}`,
                    expenses: [...user.expenses, newExpense],
                };
            }
            return user;
        });

        const updatedGroup = {
            ...selectedGroup!,
            expenses: [...selectedGroup!.expenses, newExpense],
            users: updatedUsers,
        };

        setGroups(groups.map(group => group.id === selectedGroup!.id ? updatedGroup : group));
        setSelectedGroup(updatedGroup);

        setExpenseDescription("");
        setExpenseAmount(0);
        setSelectedUsers([]);
        setExpenseCategory("");
        setExpenseNotes("");
        setIsExpenseDialogOpen(false);
    };

    const handleAddExpense = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setIsExpenseDialogOpen(true);
    };

    const handleSettleUp = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        const transactions = calculateCashFlow();
        const transactionDetails = transactions
            .map((t) => `${t.from} owes ${t.to} $${t.amount}`)
            .join("\n");
        alert(transactionDetails || "All cash flows are minimized!");
    };

    const handleDeleteGroup = (groupId: number) => {
        const updatedGroups = groups.filter(group => group.id !== groupId);
        setGroups(updatedGroups);
        if (selectedGroup!.id === groupId) {
            setSelectedGroup(updatedGroups[0] || null);
        }
    };

    const handleEditGroupName = (groupId: number) => {
        const group = groups.find(g => g.id === groupId);
        if (!group) return;

        const newName = prompt("Enter new group name:", group.name);
        if (newName && newName.trim() !== "") {
            const updatedGroups = groups.map(g =>
                g.id === groupId ? { ...g, name: newName } : g
            );
            setGroups(updatedGroups);
            if (selectedGroup!.id === groupId) {
                setSelectedGroup({ ...selectedGroup!, name: newName });
            }
        }
    };

    const handleAddNoteToExpense = (expenseId: number) => {
        const expense = selectedGroup!.expenses.find(e => e.id === expenseId);
        if (!expense) return;

        const note = prompt("Add a note to this expense:");
        if (note && note.trim() !== "") {
            const updatedExpenses = selectedGroup!.expenses.map(e =>
                e.id === expenseId ? { ...e, notes: [...e.notes, note] } : e
            );
            const updatedGroup = { ...selectedGroup!, expenses: updatedExpenses };
            setGroups(groups.map(g => g.id === selectedGroup!.id ? updatedGroup : g));
            setSelectedGroup(updatedGroup);
        }
    };

    const handleViewExpenseDetails = (expenseId: number) => {
        const expense = selectedGroup!.expenses.find(e => e.id === expenseId);
        if (!expense) return;

        alert(`
            Expense Details:
            Description: ${expense.description}
            Amount: $${expense.amount}
            Date: ${new Date(expense.date).toLocaleDateString()}
            Paid By: ${expense.paidBy.name}
            Split With: ${expense.splitWith.map(u => u.name).join(", ")}
            Category: ${expense.category}
            Notes: ${expense.notes.join("\n")}
        `);
    };

    const handleFilterGroupByUser = (userId: number) => {
        const user = selectedGroup!.users.find(u => u.id === userId);
        if (!user) return;

        const filteredExpenses = selectedGroup!.expenses.filter(
            expense => expense.paidBy.id === userId || expense.splitWith.some(u => u.id === userId)
        );

        alert(`
            Expenses involving ${user.name}:
            ${filteredExpenses.map(e => `${e.description}: $${e.amount}`).join("\n")}
        `);
    };

    const handleViewTransactionHistory = (userId: number) => {
        const user = selectedGroup!.users.find(u => u.id === userId);
        if (!user) return;

        alert(`
            Transaction History for ${user.name}:
            ${user.expenses.map(e => `${e.description}: $${e.amount}`).join("\n")}
        `);
    };

    const handleExportGroupData = () => {
        const dataStr = JSON.stringify(selectedGroup, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
        const exportFileDefaultName = `${selectedGroup!.name}_export.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleImportGroupData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedGroup: Group = JSON.parse(e.target?.result as string);
                    setGroups([...groups, importedGroup]);
                    alert(`Group "${importedGroup.name}" has been imported successfully.`);
                } catch (error) {
                    alert("Error importing group data. Please check the file format.");
                }
            };
            reader.readAsText(file);
        }
    };

    const handleAddRecurringExpense = (expense: RecurringExpense) => {
        const updatedGroup = {
            ...selectedGroup!,
            recurringExpenses: [...selectedGroup!.recurringExpenses, expense],
        };
        setGroups(groups.map(group => group.id === selectedGroup!.id ? updatedGroup : group));
        setSelectedGroup(updatedGroup);
    };

    const handleAddCategory = (category: string) => {
        const updatedGroup = {
            ...selectedGroup!,
            categories: [...selectedGroup!.categories, category],
        };
        setGroups(groups.map(group => group.id === selectedGroup!.id ? updatedGroup : group));
        setSelectedGroup(updatedGroup);
    };

    const handleRemoveCategory = (category: string) => {
        const updatedGroup = {
            ...selectedGroup!,
            categories: selectedGroup!.categories.filter(c => c !== category),
        };
        setGroups(groups.map(group => group.id === selectedGroup!.id ? updatedGroup : group));
        setSelectedGroup(updatedGroup);
    };

    const handleCurrencyChange = (newCurrency: Currency) => {
        const updatedGroup = {
            ...selectedGroup!,
            baseCurrency: newCurrency,
        };
        setGroups(groups.map(group => group.id === selectedGroup!.id ? updatedGroup : group));
        setSelectedGroup(updatedGroup);
    };

    const handleSplitChange = (splitOption: SplitOption, splitDetails: { [userId: number]: number }) => {
        // This function would be called when changing the split option for an expense
        // You might want to update the current expense or apply this to a new expense being created
    };

    const handleMarkNotificationAsRead = (notificationId: number) => {
        const updatedNotifications = selectedGroup!.notifications.map(notification =>
            notification.id === notificationId ? { ...notification, read: true } : notification
        );
        const updatedGroup = {
            ...selectedGroup!,
            notifications: updatedNotifications,
        };
        setGroups(groups.map(group => group.id === selectedGroup!.id ? updatedGroup : group));
        setSelectedGroup(updatedGroup);
    };

    const filteredExpenses = selectedGroup
        ? selectedGroup.expenses
            .filter(expense => !filterCategory || expense.category === filterCategory)
            .sort((a, b) => {
                if (sortBy === "date") {
                    return sortOrder === "asc"
                        ? new Date(a.date).getTime() - new Date(b.date).getTime()
                        : new Date(b.date).getTime() - new Date(a.date).getTime();
                } else if (sortBy === "amount") {
                    return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
                }
                return 0;
            })
        : [];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Splitwise Clone</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedGroup ? (
                            <Tabs defaultValue="overview">
                                <TabsList className="grid w-full grid-cols-5">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                                    <TabsTrigger value="balances">Balances</TabsTrigger>
                                    <TabsTrigger value="recurring">Recurring</TabsTrigger>
                                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                                </TabsList>
                                <TabsContent value="overview">
                                    <h2 className="text-2xl font-bold mb-4">{selectedGroup.name}</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2">Group Members</h3>
                                            <ul>
                                                {selectedGroup.users.map(user => (
                                    <li key={user.id} className="flex justify-between items-center">
                                        <span>{user.name}</span>
                                        <span>{user.balance}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Recent Expenses</h3>
                            <ul>
                                {selectedGroup.expenses.slice(0, 5).map(expense => (
                                    <li key={expense.id} className="flex justify-between items-center">
                                        <span>{expense.description}</span>
                                        <span>${expense.amount.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Button onClick={handleAddExpense}>Add Expense</Button>
                        <Button onClick={handleSettleUp} className="ml-2">Settle Up</Button>
                    </div>
                </TabsContent>
                <TabsContent value="expenses">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Select onValueChange={(value: string) => setFilterCategory(value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Categories</SelectItem>
                                    {selectedGroup.categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="sortBy">Sort by:</Label>
                                <Select onValueChange={(value: string) => setSortBy(value)}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="date">Date</SelectItem>
                                        <SelectItem value="amount">Amount</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                                >
                                    {sortOrder === "asc" ? "↑" : "↓"}
                                </Button>
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Paid By</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredExpenses.map((expense) => (
                                    <TableRow key={expense.id}>
                                        <TableCell>{expense.description}</TableCell>
                                        <TableCell>${expense.amount.toFixed(2)}</TableCell>
                                        <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{expense.paidBy.name}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleViewExpenseDetails(expense.id)}
                                            >
                                                <FileText className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleAddNoteToExpense(expense.id)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
                <TabsContent value="balances">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Balance</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {selectedGroup.users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.balance}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleFilterGroupByUser(user.id)}
                                        >
                                            <Filter className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleViewTransactionHistory(user.id)}
                                        >
                                            <History className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
                <TabsContent value="recurring">
                    <RecurringExpenseForm onSubmit={handleAddRecurringExpense} />
                    <h3 className="text-xl font-semibold mt-4 mb-2">Recurring Expenses</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Frequency</TableHead>
                                <TableHead>Next Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {selectedGroup.recurringExpenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell>{expense.description}</TableCell>
                                    <TableCell>${expense.amount.toFixed(2)}</TableCell>
                                    <TableCell>{expense.frequency}</TableCell>
                                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
                <TabsContent value="analysis">
                    <DataVisualization expenses={selectedGroup.expenses} />
                </TabsContent>
            </Tabs>
        ) : (
            <div className="text-center">
                <p>No group selected. Please select a group or create a new one.</p>
                <Button onClick={() => setIsAddingGroup(true)} className="mt-4">Create New Group</Button>
            </div>
        )}
    </CardContent>
</Card>

{/* Dialogs */}
<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Group Balances</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
            {selectedGroup?.users.map((user) => (
                <div
                    key={user.id}
                    className="flex items-center justify-between gap-4"
                >
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                        {user.balance}
                    </p>
                </div>
            ))}
        </div>
        <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
        </DialogFooter>
    </DialogContent>
</Dialog>

<Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Add an Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddExpenseSubmit}>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="expenseDescription">Description</Label>
                    <Input
                        id="expenseDescription"
                        value={expenseDescription}
                        onChange={(e) => setExpenseDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="expenseAmount">Amount</Label>
                    <Input
                        id="expenseAmount"
                        type="number"
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(parseFloat(e.target.value))}
                        required
                    />
                    <CurrencyConversion
                        amount={expenseAmount}
                        baseCurrency={selectedGroup?.baseCurrency || baseCurrency}
                        onCurrencyChange={handleCurrencyChange}
                    />
                </div>
                <div>
                    <Label htmlFor="expenseCategory">Category</Label>
                    <Select onValueChange={(value: string) => setExpenseCategory(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {selectedGroup?.categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Paid By</Label>
                    <div className="space-y-2">
                        {selectedGroup?.users.map((user) => (
                            <div key={user.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`user-paid-${user.id}`}
                                    checked={selectedUsers[0] === user.name}
                                    onCheckedChange={(checked) => {
                                        setSelectedUsers(
                                            checked
                                                ? [user.name, ...selectedUsers.slice(1)]
                                                : selectedUsers.filter((name) => name !== user.name)
                                        );
                                    }}
                                />
                                <Label htmlFor={`user-paid-${user.id}`}>{user.name}</Label>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <Label>Split with</Label>
                    <div className="space-y-2">
                        {selectedGroup?.users.map((user) => (
                            <div key={user.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`user-split-${user.id}`}
                                    checked={selectedUsers.slice(1).includes(user.name)}
                                    onCheckedChange={(checked) => {
                                        setSelectedUsers(
                                            checked
                                                ? [...selectedUsers, user.name]
                                                : selectedUsers.filter((name) => name !== user.name)
                                        );
                                    }}
                                />
                                <Label htmlFor={`user-split-${user.id}`}>{user.name}</Label>
                            </div>
                        ))}
                    </div>
                </div>
                <ExpenseSplitting
                    amount={expenseAmount}
                    users={selectedGroup?.users || []}
                    onSplitChange={handleSplitChange}
                />
                <div>
                    <Label htmlFor="expenseNotes">Notes</Label>
                    <Textarea
                        id="expenseNotes"
                        value={expenseNotes}
                        onChange={(e) => setExpenseNotes(e.target.value)}
                        placeholder="Add any additional notes here..."
                    />
                </div>
            </div>
            <DialogFooter className="mt-4">
                <Button type="submit">Add Expense</Button>
            </DialogFooter>
        </form>
    </DialogContent>
</Dialog>
</div>
</div>
);
}

