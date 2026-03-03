import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { expensesData as initialExpenses, Expense } from "@/data/expenses";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const Expenses = () => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("thanvi_expenses", [...initialExpenses]);
  const [showAdd, setShowAdd] = useState(false);

  // Form state
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("SPV");

  const grandTotal = expenses.length > 0 ? expenses[expenses.length - 1].runningTotal : 0;

  const handleAdd = () => {
    if (!date || !description || !amount) return;
    const amt = parseFloat(amount);
    if (isNaN(amt)) return;

    const d = new Date(date);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;

    const newExpense: Expense = {
      date: formattedDate,
      description: description.trim(),
      amount: amt,
      paidBy,
      runningTotal: grandTotal + amt,
    };

    setExpenses(prev => [...prev, newExpense]);
    setDate(""); setDescription(""); setAmount(""); setPaidBy("SPV");
    setShowAdd(false);
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-header">Expenses</h1>
          <p className="page-subtitle">Grand Total: {formatCurrency(grandTotal)}</p>
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <PlusCircle size={16} className="mr-2" />
          Add Expense
        </Button>
      </div>

      <div className="stat-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th className="text-right">Amount</th>
              <th>Paid By</th>
              <th className="text-right">Running Total</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e, i) => (
              <tr key={i}>
                <td className="text-sm whitespace-nowrap">{e.date}</td>
                <td className="font-medium">{e.description}</td>
                <td className={`text-right ${e.amount < 0 ? "amount-negative" : "amount-neutral"}`}>
                  {e.amount < 0 ? `-${formatCurrency(Math.abs(e.amount))}` : formatCurrency(e.amount)}
                </td>
                <td>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    e.paidBy === "VISH" ? "bg-primary/10 text-primary" :
                    e.paidBy === "SPV" ? "bg-accent/10 text-accent-foreground" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {e.paidBy === "VISH" ? "Vishnu" : e.paidBy === "SPV" ? "Sarath" : e.paidBy}
                  </span>
                </td>
                <td className="text-right amount-neutral">{formatCurrency(e.runningTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Expense Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <p className="text-sm text-muted-foreground">Record a new business expense</p>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="font-semibold">Description</Label>
              <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Petrol, Purchase, Rent" className="mt-1.5" />
            </div>
            <div>
              <Label className="font-semibold">Amount (₹)</Label>
              <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" className="mt-1.5" />
            </div>
            <div>
              <Label className="font-semibold">Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label className="font-semibold">Paid By</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SPV">Sarath (SPV)</SelectItem>
                  <SelectItem value="VISH">Vishnu</SelectItem>
                  <SelectItem value="Credit">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={!date || !description || !amount}>
                Save Expense
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Expenses;
