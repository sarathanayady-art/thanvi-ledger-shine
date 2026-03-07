import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Expense } from "@/data/expenses";
import { useAppData } from "@/hooks/use-app-data";
import { PlusCircle, Pencil, Fuel, Home, ShoppingBag, IndianRupee } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sortByDateDesc, formatEntryDate } from "@/lib/date-utils";

const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const Expenses = () => {
  const { expenses, setExpenses } = useAppData();
  const [showAdd, setShowAdd] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("SPV");

  const grandTotal = expenses.length > 0 ? expenses[expenses.length - 1].runningTotal : 0;

  const petrolTotal = expenses.filter(e => e.description.toLowerCase().includes("petrol") && e.amount > 0).reduce((s, e) => s + e.amount, 0);
  const rentTotal = expenses.filter(e => (e.description.toLowerCase().includes("rent") || e.description.toLowerCase().includes("shop rent")) && e.amount > 0).reduce((s, e) => s + e.amount, 0);
  const purchaseTotal = expenses.filter(e => e.description.toLowerCase().includes("purchase") && !e.description.toLowerCase().includes("stationary") && e.amount > 0).reduce((s, e) => s + e.amount, 0);

  const sortedExpenses = [...expenses].sort(sortByDateDesc);

  const resetForm = () => {
    setDate(""); setDescription(""); setAmount(""); setPaidBy("SPV");
  };

  const openEdit = (exp: Expense) => {
    const origIdx = expenses.indexOf(exp);
    setEditIndex(origIdx);
    const parts = exp.date.split(" ");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const m = String(months.indexOf(parts[1]) + 1).padStart(2, "0");
    setDate(`20${parts[2]}-${m}-${parts[0]}`);
    setDescription(exp.description);
    setAmount(String(exp.amount));
    setPaidBy(exp.paidBy);
    setShowAdd(true);
  };

  const recalcRunningTotals = (list: Expense[]): Expense[] => {
    let running = 0;
    return list.map(e => { running += e.amount; return { ...e, runningTotal: running }; });
  };

  const handleSave = () => {
    if (!date || !description || !amount) return;
    const amt = parseFloat(amount);
    if (isNaN(amt)) return;
    const formattedDate = formatEntryDate(new Date(date));

    if (editIndex !== null) {
      setExpenses(prev => {
        const updated = [...prev];
        updated[editIndex] = { ...updated[editIndex], date: formattedDate, description: description.trim(), amount: amt, paidBy };
        return recalcRunningTotals(updated);
      });
    } else {
      const newExpense: Expense = {
        date: formattedDate, description: description.trim(), amount: amt, paidBy,
        runningTotal: grandTotal + amt,
      };
      setExpenses(prev => [...prev, newExpense]);
    }

    resetForm();
    setEditIndex(null);
    setShowAdd(false);
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-header">Expenses</h1>
          <p className="page-subtitle">Grand Total: {formatCurrency(grandTotal)}</p>
        </div>
        <Button size="sm" onClick={() => { resetForm(); setEditIndex(null); setShowAdd(true); }}>
          <PlusCircle size={16} className="mr-2" />
          Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card border-l-4 border-l-primary">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Grand Total</p>
              <p className="text-2xl font-bold mt-1 font-mono tracking-tight">{formatCurrency(grandTotal)}</p>
            </div>
            <div className="p-2 rounded-lg bg-muted text-muted-foreground"><IndianRupee size={18} /></div>
          </div>
        </div>
        <div className="stat-card border-l-4 border-l-warning">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Petrol</p>
              <p className="text-2xl font-bold mt-1 font-mono tracking-tight">{formatCurrency(petrolTotal)}</p>
            </div>
            <div className="p-2 rounded-lg bg-muted text-muted-foreground"><Fuel size={18} /></div>
          </div>
        </div>
        <div className="stat-card border-l-4 border-l-success">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Rent</p>
              <p className="text-2xl font-bold mt-1 font-mono tracking-tight">{formatCurrency(rentTotal)}</p>
            </div>
            <div className="p-2 rounded-lg bg-muted text-muted-foreground"><Home size={18} /></div>
          </div>
        </div>
        <div className="stat-card border-l-4 border-l-destructive">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Total Purchase</p>
              <p className="text-2xl font-bold mt-1 font-mono tracking-tight">{formatCurrency(purchaseTotal)}</p>
            </div>
            <div className="p-2 rounded-lg bg-muted text-muted-foreground"><ShoppingBag size={18} /></div>
          </div>
        </div>
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
              <th className="text-center">Edit</th>
            </tr>
          </thead>
          <tbody>
            {sortedExpenses.map((e, i) => (
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
                <td className="text-center">
                  <button onClick={() => openEdit(e)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                    <Pencil size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={showAdd} onOpenChange={(o) => { if (!o) { resetForm(); setEditIndex(null); } setShowAdd(o); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editIndex !== null ? "Edit Expense" : "Add Expense"}</DialogTitle>
            <p className="text-sm text-muted-foreground">{editIndex !== null ? "Update this expense entry" : "Record a new business expense"}</p>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="font-semibold">Description</Label>
              <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Petrol, Purchase, Rent" className="mt-1.5" />
            </div>
            <div>
              <Label className="font-semibold">Amount (₹)</Label>
              <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount (negative for deductions)" className="mt-1.5" />
            </div>
            <div>
              <Label className="font-semibold">Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label className="font-semibold">Paid By</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SPV">Sarath (SPV)</SelectItem>
                  <SelectItem value="VISH">Vishnu</SelectItem>
                  <SelectItem value="Credit">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => { resetForm(); setEditIndex(null); setShowAdd(false); }}>Cancel</Button>
              <Button onClick={handleSave} disabled={!date || !description || !amount}>{editIndex !== null ? "Update Expense" : "Save Expense"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Expenses;
