"use client";
import React, { useState } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Check, Plus, Settings2 } from "lucide-react";

export default function Page() {
  const [groups, setGroups] = useState([
    { id: 1, name: "Trip to Paris" },
    { id: 2, name: "Weekend Hangout" },
  ]);
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [groupBalances, setGroupBalances] = useState([
    { id: 1, name: "John Doe", balance: "$0" },
    { id: 2, name: "Jane Smith", balance: "$25" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddGroup = () => {
    const newGroupName = prompt("Enter the group name:");
    if (newGroupName) {
      const newGroup = { id: groups.length + 1, name: newGroupName };
      setGroups([...groups, newGroup]);
      setSelectedGroup(newGroup);
    }
  };

  const handleGroupBalances = () => {
    setGroupBalances([
        { id: 1, name: "John Doe", balance: "$0" },
        { id: 2, name: "Jane Smith", balance: "$25" },
        { id: 3, name: "Alice Johnson", balance: "$-25" },
        ]);
    };

  const handleGroupSelect = (group: { id: number; name: string }) => {
    setSelectedGroup(group);
  };

  const handleAddExpense = () => {
    alert("Feature not implemented yet. This button can trigger a modal for adding expenses.");
  };

  const handleSettleUp = () => {
    alert("Feature not implemented yet. This button can trigger a modal for settling expenses.");
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
                  <Button variant="ghost" className="w-full justify-start">
                    Dashboard
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Recent Activity
                  </Button>
                </nav>
                <div className="pt-4 border-t dark:border-gray-800">
                  <h3 className="text-sm font-medium mb-2">GROUPS</h3>
                  {groups.map((group) => (
                    <Button
                      key={group.id}
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
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-green-600 dark:text-rose-600 mt-2"
                    onClick={handleAddGroup}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Group
                  </Button>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-6 flex flex-col items-center justify-center text-center">
                <h1 className="text-xl font-bold mb-4">{selectedGroup.name}</h1>
                <div className="rounded-full bg-green-50 dark:bg-rose-900/20 p-6 mb-4">
                  <Check className="w-12 h-12 text-green-600 dark:text-rose-400" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">All Settled Up!</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  You have no pending expenses in this group.
                </p>
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
                  {groupBalances.map((balance) => (
                    <div key={balance.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{balance.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {balance.balance}
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
            {groupBalances.map((balance) => (
              <div
                key={balance.id}
                className="flex items-center justify-between gap-4"
              >
                <p className="text-sm font-medium">{balance.name}</p>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  {balance.balance}
                </p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button onClick={handleGroupBalances} className="hidden">Update Group Balances</Button>
    </div>
  );
}
