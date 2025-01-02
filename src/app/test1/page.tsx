"use client";

import React, { useState, useEffect, useMemo } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Check, Plus, Settings2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type User = {
  id: number;
  name: string;
  balance: number;
};

type Expense = {
  id: number;
  amount: number;
  description: string;
  date: string;
  paidBy: User;
  splitBetween: User[];
  splitDetails: { [userId: number]: number };
};

type Group = {
  id: number;
  name: string;
  users: User[];
  expenses: Expense[];
};

const initialGroups: Group[] = [
  {
    id: 1,
    name: "Trip to Paris",
    users: [
      { id: 1, name: "John Doe", balance: 0 },
      { id: 2, name: "Jane Smith", balance: 0 },
    ],
    expenses: [],
  },
  {
    id: 2,
    name: "Weekend Hangout",
    users: [
      { id: 1, name: "John Doe", balance: 0 },
      { id: 2, name: "Jane Smith", balance: 0 },
      { id: 3, name: "Alice Johnson", balance: 0 },
      { id: 4, name: "Bob Brown", balance: 0 },
    ],
    expenses: [],
  },
];

export default function Page() {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(initialGroups[0].id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [isDashboardDialogOpen, setIsDashboardDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({});
  const [newUserName, setNewUserName] = useState("");
  const [isSettleUpDialogOpen, setIsSettleUpDialogOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; type: string; id: number } | null>(null);
  const [settlements, setSettlements] = useState<{ from: User; to: User; amount: number }[]>([]);

  const selectedGroup = useMemo(() => groups.find(g => g.id === selectedGroupId) || groups[0], [groups, selectedGroupId]);

  useEffect(() => {
    setSelectedGroupId(groups[0].id);
  }, []);

  useEffect(() => {
    if (groups.length > 0 && !groups.some(g => g.id === selectedGroupId)) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedGroupId]);

  useEffect(() => {
    const calculateSettlements = () => {
      const users = selectedGroup.users;
      const newSettlements: { from: User; to: User; amount: number }[] = [];

      const creditors = users.filter(u => u.balance > 0).sort((a, b) => b.balance - a.balance);
      const debtors = users.filter(u => u.balance < 0).sort((a, b) => a.balance - b.balance);

      let i = 0, j = 0;
      while (i < creditors.length && j < debtors.length) {
        const creditor = creditors[i];
        const debtor = debtors[j];
        const amount = Math.min(creditor.balance, -debtor.balance);

        if (amount > 0) {
          newSettlements.push({ from: debtor, to: creditor, amount });
          creditor.balance -= amount;
          debtor.balance += amount;
        }

        if (Math.abs(creditor.balance) < 0.01) i++;
        if (Math.abs(debtor.balance) < 0.01) j++;
      }

      setSettlements(newSettlements);
    };

    calculateSettlements();
  }, [selectedGroup]);

  const handleGroupSelect = (group: Group) => {
    setSelectedGroupId(group.id);
  };

  const handleAddGroup = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    if (newGroupName.trim() === "") {
      alert("Group name cannot be empty.");
      return;
    }
    const newGroup: Group = {
      id: Math.max(...groups.map(g => g.id), 0) + 1,
      name: newGroupName,
      users: [],
      expenses: [],
    };
    setGroups(prevGroups => [...prevGroups, newGroup]);
    setNewGroupName("");
    setIsAddingGroup(false);
  };

  const handleAddUser = (event: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    if (
      (event.type === 'keydown' && (event as React.KeyboardEvent).key !== 'Enter') ||
      newUserName.trim() === ""
    ) {
      return;
    }
    event.preventDefault();
    const newUser: User = {
      id: Math.max(...selectedGroup.users.map(u => u.id), 0) + 1,
      name: newUserName,
      balance: 0,
    };
    setGroups(prevGroups => prevGroups.map(group => 
      group.id === selectedGroup.id 
        ? { ...group, users: [...group.users, newUser] }
        : group
    ));
    setNewUserName("");
  };

  const handleAddExpense = () => {
    setIsExpenseDialogOpen(true);
  };

  const handleDeleteExpense = (expenseId: number) => {
    setGroups(prevGroups => prevGroups.map(group => {
      if (group.id !== selectedGroup.id) return group;

      const expenseToDelete = group.expenses.find(e => e.id === expenseId);
      if (!expenseToDelete) return group;

      const updatedUsers = group.users.map(user => {
        if (user.id === expenseToDelete.paidBy.id) {
          return { ...user, balance: user.balance - expenseToDelete.amount };
        }
        const userSplit = expenseToDelete.splitDetails[user.id] || 0;
        return { ...user, balance: user.balance + userSplit };
      });

      return {
        ...group,
        users: updatedUsers,
        expenses: group.expenses.filter(expense => expense.id !== expenseId),
      };
    }));
  };

  const handleDeleteUser = (userId: number) => {
    setGroups(prevGroups => prevGroups.map(group => {
      if (group.id !== selectedGroup.id) return group;

      return {
        ...group,
        users: group.users.filter(user => user.id !== userId),
        expenses: group.expenses.filter(expense =>
          expense.paidBy.id !== userId && !expense.splitBetween.some(u => u.id === userId)
        ),
      };
    }));
  };

  const handleDeleteGroup = (groupId: number) => {
    setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
  };

  const handleExpenseSubmit = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.paidBy || !newExpense.splitBetween || newExpense.splitBetween.length === 0) {
      alert("Please fill in all required fields and select at least one user to split the expense.");
      return;
    }

    const splitDetails: { [userId: number]: number } = {};
    const equalShare = newExpense.amount / newExpense.splitBetween.length;

    newExpense.splitBetween.forEach(user => {
      splitDetails[user.id] = equalShare;
    });

    const expense: Expense = {
      id: Math.max(...selectedGroup.expenses.map(e => e.id), 0) + 1,
      amount: newExpense.amount,
      description: newExpense.description,
      date: new Date().toISOString(),
      paidBy: newExpense.paidBy,
      splitBetween: newExpense.splitBetween,
      splitDetails: splitDetails,
    };

    setGroups(prevGroups => prevGroups.map(group => {
      if (group.id !== selectedGroup.id) return group;

      const updatedUsers = group.users.map(user => {
        if (user.id === expense.paidBy.id) {
          return { ...user, balance: user.balance + (expense.amount - splitDetails[user.id]) };
        } else if (expense.splitBetween.find(u => u.id === user.id)) {
          return { ...user, balance: user.balance - splitDetails[user.id] };
        }
        return user;
      });

      return {
        ...group,
        expenses: [...group.expenses, expense],
        users: updatedUsers,
      };
    }));

    setNewExpense({});
    setIsExpenseDialogOpen(false);
  };

  const handleSettleUp = () => {
    setIsSettleUpDialogOpen(true);
  };

  const totalGroupSpending = useMemo(() => selectedGroup.expenses.reduce((sum, expense) => sum + expense.amount, 0), [selectedGroup.expenses]);

  const userTotalSpending = (userId: number) => {
    return selectedGroup.expenses
      .filter(expense => expense.paidBy.id === userId)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const sortedExpenses = useMemo(() => [...selectedGroup.expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [selectedGroup.expenses]);

  const handleContextMenu = (event: React.MouseEvent, type: string, id: number) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      type,
      id,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-inherit">
      <MaxWidthWrapper className="min-w-[60vw]">
        <div className="h-[calc(100vh-64px)] grid place-content-center">
          <Card className="max-w-5xl w-full h-[70vh] border-2 border-green-600 dark:border-rose-800 rounded-xl shadow-lg overflow-scroll">
            <div className="grid h-full md:grid-cols-[250px_1fr_250px]">
              {/* Left Sidebar */}
              <div className="border-r dark:border-gray-800 p-4 space-y-4">
                <nav className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setIsDashboardDialogOpen(true)}>
                    Dashboard
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Recent Activity
                  </Button>
                </nav>
                <div className="pt-4 border-t dark:border-gray-800">
                  <h3 className="text-sm font-medium mb-2">GROUPS</h3>
                  {groups.map((group) => (
                    <div key={group.id} className="flex items-center justify-between" onContextMenu={(e) => handleContextMenu(e, 'group', group.id)}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${
                          group.id === selectedGroup.id
                            ? "text-green-600 dark:text-rose-600 font-bold"
                            : "text-gray-700 dark:text-gray-400"
                        }`}
                        onClick={() => handleGroupSelect(group)}
                      >
                        {group.name}
                      </Button>
                    </div>
                  ))}
                  {isAddingGroup ? (
                    <div className="mt-2 flex flex-col items-start justify-normal space-y-2">
                      <input
                        type="text"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="Group name"
                        className="flex-1 p-1 max-w-56 border focus:ring-green-800 dark:focus:border-rose-800 border-green-600 rounded dark:bg-gray-800 dark:ring-rose-700"
                      />
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleAddGroup}
                          className="bg-green-600 hover:bg-green-700 dark:bg-rose-600 dark:hover:bg-rose-700"
                        >
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setIsAddingGroup(false);
                            setNewGroupName("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-green-600 dark:text-rose-600 mt-2"
                      onClick={() => setIsAddingGroup(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Group
                    </Button>
                  )}
                </div>
                <div className="pt-4 border-t dark:border-gray-800">
                  <h3 className="text-sm font-medium mb-2">ADD USER TO GROUP</h3>
                  <div className="mt-2 flex flex-col items-start justify-normal space-y-2">
                    <input
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      onKeyDown={handleAddUser}
                      placeholder="User name"
                      className="ml-1 flex-1 p-1 max-w-52 border focus:ring-green-800 dark:focus:border-rose-800 border-green-600 rounded dark:bg-gray-800 dark:ring-rose-700"
                    />
                    <Button
                      onClick={handleAddUser}
                      className="bg-green-600 hover:bg-green-700 dark:bg-rose-600 dark:hover:bg-rose-700"
                    >
                      Add User
                    </Button>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-6 flex flex-col items-center justify-center text-center">
                <h1 className="text-xl font-bold mb-4">{selectedGroup.name}</h1>
                {selectedGroup.expenses.length === 0 ? (
                  <>
                    <div className="rounded-full bg-green-50 dark:bg-rose-900/20 p-6 mb-4">
                      <Check className="w-12 h-12 text-green-600 dark:text-rose-400" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">No Expenses Yet!</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Add an expense to get started.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-semibold mb-2">Recent Expenses</h2>
                    {sortedExpenses.slice(0, 5).map((expense, index) => (
                      <div key={index} className="flex justify-between w-full mb-2">
                        <span>{expense.description}</span>
                        <span>${expense.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </>
                )}
                <div className="mt-6 space-x-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700 dark:bg-rose-600 dark:hover:bg-rose-700"
                    onClick={handleAddExpense}
                  >
                    Add an expense
                  </Button>
                  <Button variant="outline" onClick={handleSettleUp}>
                    Settle up
                  </Button>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="border-l dark:border-gray-800 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">GROUP BALANCES</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Settings2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-4 hidden md:block">
                  {selectedGroup.users.map((user) => (
                    <div key={user.id} className="flex items-center gap-3" onContextMenu={(e) => handleContextMenu(e, 'user', user.id)}>
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className={`text-xs ${user.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {user.balance >= 0 ? '+' : '-'}${Math.abs(user.balance).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </MaxWidthWrapper>

      {/* Dialog for Group Balances */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Group Balances</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedGroup.users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-4"
              >
                <p className="text-sm font-medium">{user.name}</p>
                <p className={`text-sm ${user.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {user.balance >= 0 ? '+' : '-'}${Math.abs(user.balance).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Dashboard */}
      <Dialog open={isDashboardDialogOpen} onOpenChange={setIsDashboardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dashboard</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Total Group Spending: ${totalGroupSpending.toFixed(2)}</p>
            {selectedGroup.expenses.map((expense) => (
              <div key={expense.id} className="flex justify-between" onContextMenu={(e) => handleContextMenu(e, 'expense', expense.id)}>
                <span>{expense.description}</span>
                <span>${expense.amount.toFixed(2)}</span>
              </div>
            ))}
            {selectedGroup.users.map((user) => (
              <div key={user.id} className="flex justify-between">
                <span>{user.name}'s Spending:</span>
                <span>${userTotalSpending(user.id).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDashboardDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Adding Expense */}
      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add an Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="expenseDescription">Description</Label>
              <Input
                id="expenseDescription"
                value={newExpense.description || ""}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="expenseAmount">Amount</Label>
              <Input
                id="expenseAmount"
                type="number"
                value={newExpense.amount || ""}
                onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="expensePaidBy">Paid By</Label>
              <Select onValueChange={(value) => setNewExpense({ ...newExpense, paidBy: selectedGroup.users.find(u => u.id === parseInt(value)) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {selectedGroup.users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Split Equally Between</Label>
              {selectedGroup.users.map((user) => (
                <div key={user.id} className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={`user-${user.id}`}
                    checked={newExpense.splitBetween?.some(u => u.id === user.id)}
                    onCheckedChange={(checked) => {
                      const updatedSplitBetween = checked
                        ? [...(newExpense.splitBetween || []), user]
                        : (newExpense.splitBetween || []).filter(u => u.id !== user.id);
                      setNewExpense({ ...newExpense, splitBetween: updatedSplitBetween });
                    }}
                  />
                  <Label htmlFor={`user-${user.id}`}>{user.name}</Label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleExpenseSubmit}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Settle Up */}
      <Dialog open={isSettleUpDialogOpen} onOpenChange={setIsSettleUpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settle Up</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {settlements.map((settlement, index) => (
              <div key={index} className="flex items-center justify-between">
                <span>{settlement.from.name} pays {settlement.to.name}</span>
                <span>${settlement.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSettleUpDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {contextMenu && (
        <div
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000,
          }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg"
        >
          <Button
            variant="ghost"
            className="w-full text-left text-red-600 dark:text-red-400"
            onClick={() => {
              if (contextMenu.type === 'group') handleDeleteGroup(contextMenu.id);
              if (contextMenu.type === 'user') handleDeleteUser(contextMenu.id);
              if (contextMenu.type === 'expense') handleDeleteExpense(contextMenu.id);
              closeContextMenu();
            }}
          >
            Delete {contextMenu.type}
          </Button>
        </div>
      )}
    </div>
  );
}

