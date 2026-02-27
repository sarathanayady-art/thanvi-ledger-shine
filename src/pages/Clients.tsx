import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { clientsData as initialClientsData, Client, Transaction } from "@/data/clients";
import { FileText, Download, PlusCircle, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const ClientLedger = ({ client, open, onClose }: { client: Client | null; open: boolean; onClose: () => void }) => {
  if (!client) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client.name} — Ledger</DialogTitle>
        </DialogHeader>
        <table className="data-table mt-4">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th className="text-right">Amount</th>
              <th className="text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {client.transactions.map((t, i) => (
              <tr key={i}>
                <td className="text-sm">{t.date}</td>
                <td>
                  <span className={
                    t.type === "sale" ? "badge-pending" :
                    t.type === "collection" ? "badge-paid" :
                    "bg-destructive/10 text-destructive text-xs font-medium px-2.5 py-0.5 rounded-full"
                  }>
                    {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                  </span>
                </td>
                <td className={`text-right ${
                  t.type === "collection" ? "amount-positive" :
                  t.type === "return" ? "amount-negative" : "amount-neutral"
                }`}>
                  {t.type === "return" ? `-${formatCurrency(t.amount)}` : formatCurrency(t.amount)}
                </td>
                <td className="text-right amount-neutral">{formatCurrency(t.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
};

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([...initialClientsData]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState<Client | null>(null);

  // Add client form
  const [newClientName, setNewClientName] = useState("");

  // Add transaction form
  const [txType, setTxType] = useState<"sale" | "collection" | "return">("sale");
  const [txAmount, setTxAmount] = useState("");
  const [txDate, setTxDate] = useState("");
  const [txDescription, setTxDescription] = useState("");

  const handleAddClient = () => {
    if (!newClientName.trim()) return;
    const newClient: Client = {
      name: newClientName.trim().toUpperCase(),
      totalSale: 0,
      totalCollection: 0,
      balance: 0,
      balancePercent: 0,
      transactions: [],
    };
    setClients(prev => [...prev, newClient]);
    setNewClientName("");
    setShowAddClient(false);
  };

  const handleAddTransaction = () => {
    if (!showAddTransaction || !txAmount || !txDate) return;
    const amount = parseFloat(txAmount);
    if (isNaN(amount) || amount <= 0) return;

    const client = showAddTransaction;
    const lastBalance = client.transactions.length > 0
      ? client.transactions[client.transactions.length - 1].balance
      : 0;

    let newBalance = lastBalance;
    if (txType === "sale") newBalance += amount;
    else if (txType === "collection") newBalance -= amount;
    else if (txType === "return") newBalance -= amount;

    // Format date to match existing format (e.g., "27 Feb 26")
    const d = new Date(txDate);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;

    const newTx: Transaction = {
      date: formattedDate,
      type: txType,
      amount,
      balance: Math.max(0, newBalance),
      description: txDescription || undefined,
    };

    setClients(prev =>
      prev.map(c => {
        if (c.name !== client.name) return c;
        const updatedTransactions = [...c.transactions, newTx];
        const totalSale = txType === "sale" ? c.totalSale + amount : c.totalSale;
        const totalCollection = txType === "collection" ? c.totalCollection + amount : c.totalCollection;
        const balance = Math.max(0, newBalance);
        const balancePercent = totalSale > 0 ? (balance / totalSale) * 100 : 0;
        return { ...c, transactions: updatedTransactions, totalSale, totalCollection, balance, balancePercent };
      })
    );

    setTxAmount("");
    setTxDate("");
    setTxDescription("");
    setTxType("sale");
    setShowAddTransaction(null);
  };

  const exportCSV = () => {
    const headers = "Client,Total Sale,Total Collection,Balance,Balance %\n";
    const rows = clients.map(c => `${c.name},${c.totalSale},${c.totalCollection},${c.balance},${c.balancePercent}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "clients_export.csv"; a.click();
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-header">Client Management</h1>
          <p className="page-subtitle">{clients.length} clients · {formatCurrency(clients.reduce((s, c) => s + c.balance, 0))} outstanding</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setShowAddClient(true)}>
            <UserPlus size={16} className="mr-2" />
            Add Client
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="stat-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Client</th>
              <th className="text-right">Credit Sale</th>
              <th className="text-right">Collection</th>
              <th className="text-right">Balance</th>
              <th className="text-right">Bal %</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.name}>
                <td className="font-medium">{c.name}</td>
                <td className="text-right amount-neutral">{formatCurrency(c.totalSale)}</td>
                <td className="text-right amount-positive">{formatCurrency(c.totalCollection)}</td>
                <td className={`text-right ${c.balance > 0 ? "amount-negative" : "amount-positive"}`}>
                  {formatCurrency(c.balance)}
                </td>
                <td className="text-right">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    c.balancePercent > 70 ? "bg-destructive/10 text-destructive" :
                    c.balancePercent > 40 ? "bg-warning/10 text-warning" :
                    c.balancePercent === 0 ? "badge-paid" : "bg-muted text-muted-foreground"
                  }`}>
                    {c.balancePercent.toFixed(1)}%
                  </span>
                </td>
                <td className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => setShowAddTransaction(c)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Add Transaction"
                    >
                      <PlusCircle size={16} />
                    </button>
                    {c.transactions.length > 0 && (
                      <button
                        onClick={() => setSelectedClient(c)}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="View Ledger"
                      >
                        <FileText size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            <tr className="font-bold bg-muted/30">
              <td>TOTAL</td>
              <td className="text-right amount-neutral">{formatCurrency(clients.reduce((s, c) => s + c.totalSale, 0))}</td>
              <td className="text-right amount-positive">{formatCurrency(clients.reduce((s, c) => s + c.totalCollection, 0))}</td>
              <td className="text-right amount-negative">{formatCurrency(clients.reduce((s, c) => s + c.balance, 0))}</td>
              <td className="text-right">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                  {((clients.reduce((s, c) => s + c.balance, 0) / clients.reduce((s, c) => s + c.totalSale, 0)) * 100).toFixed(1)}%
                </span>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <ClientLedger client={selectedClient} open={!!selectedClient} onClose={() => setSelectedClient(null)} />

      {/* Add Client Dialog */}
      <Dialog open={showAddClient} onOpenChange={setShowAddClient}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={newClientName}
                onChange={e => setNewClientName(e.target.value)}
                placeholder="Enter client name"
                className="mt-1.5"
                onKeyDown={e => e.key === "Enter" && handleAddClient()}
              />
            </div>
            <Button onClick={handleAddClient} className="w-full" disabled={!newClientName.trim()}>
              <UserPlus size={16} className="mr-2" />
              Add Client
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Transaction Dialog */}
      <Dialog open={!!showAddTransaction} onOpenChange={() => setShowAddTransaction(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Transaction — {showAddTransaction?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Type</Label>
              <Select value={txType} onValueChange={v => setTxType(v as "sale" | "collection" | "return")}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="collection">Collection</SelectItem>
                  <SelectItem value="return">Return</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="txDate">Date</Label>
              <Input id="txDate" type="date" value={txDate} onChange={e => setTxDate(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="txAmount">Amount (₹)</Label>
              <Input id="txAmount" type="number" value={txAmount} onChange={e => setTxAmount(e.target.value)} placeholder="0" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="txDesc">Description (optional)</Label>
              <Input id="txDesc" value={txDescription} onChange={e => setTxDescription(e.target.value)} placeholder="e.g. Monthly collection" className="mt-1.5" />
            </div>
            <Button onClick={handleAddTransaction} className="w-full" disabled={!txAmount || !txDate}>
              <PlusCircle size={16} className="mr-2" />
              Add Transaction
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Clients;
