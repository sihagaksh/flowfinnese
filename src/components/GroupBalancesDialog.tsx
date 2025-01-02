import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type GroupBalancesDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  groupBalances: { id: number; name: string; balance: string }[];
};

const GroupBalancesDialog: React.FC<GroupBalancesDialogProps> = ({ isOpen, onClose, groupBalances }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Group Balances</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {groupBalances.map((balance) => (
            <div key={balance.id} className="flex justify-between">
              <span>{balance.name}</span>
              <span>{balance.balance}</span>
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

export default GroupBalancesDialog;

