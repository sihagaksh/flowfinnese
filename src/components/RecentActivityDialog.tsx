import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type RecentActivityDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  expenses: { id: number; amount: string; description: string; date: string }[];
};

const RecentActivityDialog: React.FC<RecentActivityDialogProps> = ({ isOpen, onClose, expenses }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recent Activity</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex justify-between">
              <span>{expense.description}</span>
              <span>{expense.amount}</span>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecentActivityDialog;

