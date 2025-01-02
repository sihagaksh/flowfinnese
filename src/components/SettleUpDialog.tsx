import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type SettleUpDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  groupBalances: { id: number; name: string; balance: string }[];
};

const SettleUpDialog: React.FC<SettleUpDialogProps> = ({ isOpen, onClose, groupBalances }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settle Up</DialogTitle>
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

export default SettleUpDialog;

