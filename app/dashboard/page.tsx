"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreditCard, Users, PiggyBank, Receipt, Trash2 } from "lucide-react";
import { BackgroundBeamsWithCollision } from "@/components/ui/bgbeam";
import { BackgroundLines } from "@/components/ui/bglines";

type User = {
  id: number;
  name: string;
  balance: number;
};

type Expense = {
  id: number;
  description: string;
  amount: number;
  paidBy: number;
  splitBetween: number[];
};

type Payment = {
  id: number;
  amount: number;
  paidBy: number;
  splitBetween: number[];
};

export default function Component() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Aksh", balance: 0 },
    { id: 2, name: "John", balance: 0 },
    { id: 3, name: "Jane", balance: 0 },
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<string>(""); // Changed to string
  const [paidBy, setPaidBy] = useState<number | "">("");
  const [splitBetween, setSplitBetween] = useState<number[]>([]);
  const [newUserName, setNewUserName] = useState("");
  const [activeTab, setActiveTab] = useState("addExpense");
  const [cnt, setCnt] = useState<number>(0);
  const handleAddUser = () => {
    if (newUserName.trim() !== "") {
      const newUser: User = {
        id: users.length + 1,
        name: newUserName,
        balance: 0,
      };
      setUsers([...users, newUser]);
      setNewUserName("");
    }
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId));
    setPayments(
      payments.filter(
        (payment) =>
          payment.paidBy !== userId && !payment.splitBetween.includes(userId)
      )
    );
    setExpenses(
      expenses.filter(
        (expense) =>
          expense.paidBy !== userId && !expense.splitBetween.includes(userId)
      )
    );
  };

  const handleAddExpense = () => {
    if (description && amount && paidBy && splitBetween.length > 0) {
      const newExpense: Expense = {
        id: expenses.length + 1,
        description,
        amount: parseFloat(amount), // Parse string to number
        paidBy: +paidBy,
        splitBetween,
      };

      const splitAmount = parseFloat(amount) / splitBetween.length;

      const updatedUsers = users.map((user) => {
        if (user.id === paidBy) {
          return {
            ...user,
            balance: user.balance + (parseFloat(amount) - splitAmount),
          };
        }
        if (splitBetween.includes(user.id)) {
          return { ...user, balance: user.balance - splitAmount };
        }
        return user;
      });

      setExpenses([...expenses, newExpense]);
      setUsers(updatedUsers);

      const newPayment: Payment = {
        id: payments.length + 1,
        amount: parseFloat(amount), // Parse string to number
        paidBy: +paidBy,
        splitBetween,
      };
      setPayments([...payments, newPayment]);

      setDescription("");
      setAmount("");
      setPaidBy("");
      setSplitBetween([]);
    }
  };

  const handleToggleSplitUser = (userId: number) => {
    if (splitBetween.includes(userId)) {
      setSplitBetween(splitBetween.filter((id) => id !== userId));
    } else {
      setSplitBetween([...splitBetween, userId]);
    }
  };

  const handleSplitEqually = () => {
    if (cnt % 2 == 0) setSplitBetween(users.map((user) => user.id));
    else setSplitBetween([]);
    setCnt((cnt) => cnt + 1);
  };

  const handleDeletePayment = (paymentId: number) => {
    setPayments(payments.filter((payment) => payment.id !== paymentId));
  };

  const calculateSettlement = () => {
    const payMap: { [key: number]: number } = {};
    const receiveMap: { [key: number]: number } = {};

    users.forEach((user) => {
      if (user.balance < 0) {
        payMap[user.id] = Math.abs(user.balance);
      } else if (user.balance > 0) {
        receiveMap[user.id] = user.balance;
      }
    });

    const settlements: { payer: User; receiver: User; amount: number }[] = [];
    Object.keys(payMap).forEach((payerId) => {
      let payerAmount = payMap[+payerId];

      Object.keys(receiveMap).forEach((receiverId) => {
        if (payerAmount > 0 && receiveMap[+receiverId] > 0) {
          const receiverAmount = receiveMap[+receiverId];
          const amountToSettle = Math.min(payerAmount, receiverAmount);

          settlements.push({
            payer: users.find((u) => u.id === +payerId)!,
            receiver: users.find((u) => u.id === +receiverId)!,
            amount: amountToSettle,
          });

          payMap[+payerId] -= amountToSettle;
          receiveMap[+receiverId] -= amountToSettle;
        }
      });
    });

    return settlements;
  };

  const settlements = calculateSettlement();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const tabItems = [
    { value: "addExpense", icon: CreditCard, label: "Add Expense" },
    { value: "addUser", icon: Users, label: "Add User" },
    { value: "settlements", icon: PiggyBank, label: "Settlements" },
    { value: "payments", icon: Receipt, label: "Payments" },
  ];

  return (
    <>
      <BackgroundLines className="relative">
        {/* <BackgroundBeamsWithCollision> */}
        <motion.div
          className="min-h-screen bg-transparent text-gray-100 p-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="max-w-4xl mx-auto">
            <motion.h1
              className="text-5xl font-sans font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-600"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Flow Finnese
            </motion.h1>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-8"
            >
              <div className="relative">
                <TabsList className="grid w-full grid-cols-4 gap-4 bg-transparent relative z-10">
                  {tabItems.map((tab, index) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex items-center space-x-2 bg-opacity-20 backdrop-blur-lg w-full relative"
                      onClick={() => setActiveTab(tab.value)}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                <motion.div
                  className="absolute top-0 left-0 w-1/4 h-full bg-transparent bg-opacity-10 rounded-md"
                  initial={false}
                  animate={{
                    x: `${
                      tabItems.findIndex((tab) => tab.value === activeTab) * 100
                    }%`,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>

              <AnimatePresence mode="wait">
                <TabsContent value="addUser">
                  <motion.div
                    key="addUser"
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Card className="bg-opacity-20 backdrop-blur-lg">
                      <CardHeader>
                        <CardTitle>Add New User</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex space-x-4">
                          <Input
                            type="text"
                            placeholder="User Name"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleAddUser();
                              }
                            }}
                            className="flex-grow bg-opacity-20 backdrop-blur-lg"
                          />
                          <Button
                            onClick={handleAddUser}
                            className="bg-opacity-20 backdrop-blur-lg"
                          >
                            Add User
                          </Button>
                        </div>
                        <motion.div
                          className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {users.map((user) => (
                            <motion.div
                              key={user.id}
                              className="flex items-center justify-between space-x-3 bg-opacity-20 backdrop-blur-lg p-3 rounded-lg"
                              variants={itemVariants}
                            >
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarFallback>
                                    {user.name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-gray-400">
                                    Balance: {user.balance.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="addExpense" className="">
                  <motion.div
                    key="addExpense"
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className=""
                  >
                    <Card className="bg-opacity-20 backdrop-blur-lg">
                      <CardHeader>
                        <CardTitle>Add New Expense</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Input
                            type="text"
                            placeholder="Expense Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-opacity-20 backdrop-blur-lg"
                          />
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)} // Changed to e.target.value
                            className="bg-opacity-20 backdrop-blur-lg"
                          />
                          <Select
                            onValueChange={(value) => setPaidBy(Number(value))}
                          >
                            <SelectTrigger className="bg-opacity-20 backdrop-blur-lg">
                              <SelectValue placeholder="Paid By" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user) => (
                                <SelectItem
                                  key={user.id}
                                  value={user.id.toString()}
                                >
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div>
                            <h3 className="font-semibold mb-2">
                              Split Between:
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {users.map((user) => (
                                <div
                                  key={user.id}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`user-${user.id}`}
                                    checked={splitBetween.includes(user.id)}
                                    onCheckedChange={() =>
                                      handleToggleSplitUser(user.id)
                                    }
                                  />
                                  <label htmlFor={`user-${user.id}`}>
                                    {user.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                            {/* <Button
                              onClick={handleSplitEqually}
                              className="mt-2 w-full bg-transparent text-black hover:bg-white bg-opacity-20 backdrop-blur-sm"
                            >
                              Split Equally
                            </Button> */}
                            <button
                              className="relative inline-flex h-10 overflow-hidden rounded-sm p-[1px]  w-full bg-opacity-20 backdrop-blur-lg mt-6"
                              onClick={handleSplitEqually}
                            >
                              <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-sm bg-white px-3 py-1 text-sm font-medium text-black backdrop-blur-3xl">
                              Split Equally
                              </span>
                            </button>
                          </div>
                          <Button
                            onClick={handleAddExpense}
                            className="w-full bg-opacity-20 backdrop-blur-lg"
                          >
                            Add Expense
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="settlements">
                  <motion.div
                    key="settlements"
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Card className="bg-opacity-20 backdrop-blur-lg">
                      <CardHeader>
                        <CardTitle>Settlements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <AnimatePresence>
                          {settlements.length === 0 ? (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              No settlements needed at the moment.
                            </motion.p>
                          ) : (
                            <motion.ul
                              className="space-y-2"
                              variants={containerVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              {settlements.map((settlement, index) => (
                                <motion.li
                                  key={index}
                                  className="bg-opacity-20 backdrop-blur-lg p-4 rounded-md flex items-center justify-between"
                                  variants={itemVariants}
                                >
                                  <div className="flex items-center space-x-3">
                                    <Avatar>
                                      <AvatarFallback>
                                        {settlement.payer.name[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{settlement.payer.name}</span>
                                  </div>
                                  <motion.div
                                    className="flex items-center"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 500,
                                      damping: 30,
                                    }}
                                  >
                                    <span className="text-green-400 font-semibold">
                                      {settlement.amount.toFixed(2)}
                                    </span>
                                    <span className="mx-2">→</span>
                                  </motion.div>
                                  <div className="flex items-center space-x-3">
                                    <Avatar>
                                      <AvatarFallback>
                                        {settlement.receiver.name[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{settlement.receiver.name}</span>
                                  </div>
                                </motion.li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="payments">
                  <motion.div
                    key="payments"
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Card className="bg-opacity-20 backdrop-blur-lg">
                      <CardHeader>
                        <CardTitle>Payment History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <AnimatePresence>
                          {payments.length === 0 ? (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              No payments recorded yet.
                            </motion.p>
                          ) : (
                            <motion.ul
                              className="space-y-4"
                              variants={containerVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              {payments.map((payment) => (
                                <motion.li
                                  key={payment.id}
                                  className="bg-opacity-20 backdrop-blur-lg p-4 rounded-md"
                                  variants={itemVariants}
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center space-x-3">
                                      <Avatar>
                                        <AvatarFallback>
                                          {
                                            users.find(
                                              (u) => u.id === payment.paidBy
                                            )?.name[0]
                                          }
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="font-semibold">
                                        {
                                          users.find(
                                            (u) => u.id === payment.paidBy
                                          )?.name
                                        }
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <motion.span
                                        className="text-green-400 font-bold"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                          type: "spring",
                                          stiffness: 500,
                                          damping: 30,
                                        }}
                                      >
                                        {payment.amount.toFixed(2)}
                                      </motion.span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleDeletePayment(payment.id)
                                        }
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-400">
                                    Split between:{" "}
                                    {payment.splitBetween
                                      .map(
                                        (userId) =>
                                          users.find((u) => u.id === userId)
                                            ?.name
                                      )
                                      .join(", ")}
                                  </p>
                                </motion.li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </div>
        </motion.div>
        {/* </BackgroundBeamsWithCollision> */}
      </BackgroundLines>
    </>
  );
}
