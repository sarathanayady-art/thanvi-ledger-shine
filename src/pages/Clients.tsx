import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Client, Transaction } from "@/data/clients";
import { useAppData } from "@/hooks/use-app-data";
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
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText size={24} className="text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">{client.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">Detailed Transaction Ledger</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="mt-1">
            <Download size={16} className="mr-2" />
            Print PDF
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">Total Credit</p>
            <p className="text-lg font-bold mt-1">{formatCurrency(client.totalSale)}</p>
          </div>
          <div className="rounded-lg border border-accent/20 bg-accent/10 p-3">
            <p className="text-xs font-semibold text-accent-foreground uppercase tracking-wide">Total Collection</p>
            <p className="text-lg font-bold text-accent-foreground mt-1">{formatCurrency(client.totalCollection)}</p>
          </div>
          <div className="rounded-lg border border-muted p-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pending Balance</p>
            <p className="text-lg font-bold mt-1">{formatCurrency(client.balance)}</p>
          </div>
        </div>

        <table className="data-table mt-4">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th className="text-right">Sale</th>
              <th className="text-right">Collection</th>
              <th className="text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {client.transactions.map((t, i) => (
              <tr key={i}>
                <td className="text-sm text-muted-foreground">{t.date}</td>
                <td>
                  <span className="font-medium">
                    {t.type === "sale" ? "Sale" : t.type === "collection" ? "Collection" : "Return Adjustment"}
                  </span>
                  {t.type === "return" && (
                    <span className="ml-2 bg-destructive/10 text-destructive text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Return</span>
                  )}
                </td>
                <td className="text-right">
                  {t.type === "sale" ? (
                    <span className="amount-neutral">{formatCurrency(t.amount)}</span>
                  ) : t.type === "return" ? (
                    <span className="amount-negative">-{formatCurrency(t.amount)}</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="text-right">
                  {t.type === "collection" ? (
                    <span className="amount-positive">{formatCurrency(t.amount)}</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="text-right font-semibold">{formatCurrency(t.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
};

const Clients = () => {
  const { clients, setClients } = useAppData();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState<Client | null>(null);

  const [newClientName, setNewClientName] = useState("");
  const [txType, setTxType] = useState<"sale" | "collection" | "return">("sale");
  const [txAmount, setTxAmount] = useState("");
  const [txDate, setTxDate] = useState("");
  const [txDescription, setTxDescription] = useState("");

  const handleAddClient = () => {
    if (!newClientName.trim()) return;
    const newClient: Client = {
      name: newClientName.trim().toUpperCase(),
      totalSale: 0, totalCollection: 0, balance: 0, balancePercent: 0, transactions: [],
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
      ? client.transactions[client.transactions.length - 1].balance : 0;

    let newBalance = lastBalance;
    if (txType === "sale") newBalance += amount;
    else if (txType === "collection") newBalance -= amount;
    else if (txType === "return") newBalance -= amount;

    const d = new Date(txDate);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;

    const newTx: Transaction = {
      date: formattedDate, type: txType, amount, balance: Math.max(0, newBalance),
      description: txDescription || undefined,
    };

    setClients(prev =>
      prev.map(c => {
        if (c.name !== client.name) return c;
        const updatedTransactions = [...c.transactions, newTx];
        const totalSale = txType === "sale" ? c.totalSale + amount : (txType === "return" ? c.totalSale - amount : c.totalSale);
        const totalCollection = txType === "collection" ? c.totalCollection + amount : c.totalCollection;
        const balance = Math.max(0, newBalance);
        const balancePercent = totalSale > 0 ? (balance / totalSale) * 100 : 0;
        return { ...c, transactions: updatedTransactions, totalSale, totalCollection, balance, balancePercent };
      })
    );

    setTxAmount(""); setTxDate(""); setTxDescription(""); setTxType("sale");
    setShowAddTransaction(null);
  };

  const exportCSV = () => {
    const headers = "Client,Total Sale,Total Collection,Balance,Balance %\n";
    const rows = clients.map(c => `${c.name},${c.totalSale},${c.totalCollection},${c.balance},${c.balancePercent}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "clients_export.csv"; a.click();
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
                    <button onClick={() => setShowAddTransaction(c)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Add Transaction">
                      <PlusCircle size={16} />
                    </button>
                    {c.transactions.length > 0 && (
                      <button onClick={() => setSelectedClient(c)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="View Ledger">
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

      <Dialog open={showAddClient} onOpenChange={setShowAddClient}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add New Client</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input id="clientName" value={newClientName} onChange={e => setNewClientName(e.target.value)} placeholder="Enter client name" className="mt-1.5" onKeyDown={e => e.key === "Enter" && handleAddClient()} />
            </div>
            <Button onClick={handleAddClient} className="w-full" disabled={!newClientName.trim()}>
              <UserPlus size={16} className="mr-2" />Add Client
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showAddTransaction} onOpenChange={() => setShowAddTransaction(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Record a new entry for <span className="font-bold text-foreground">{showAddTransaction?.name}</span>
            </p>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="font-semibold">Transaction Type</Label>
              <Select value={txType} onValueChange={v => setTxType(v as "sale" | "collection" | "return")}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Sale (Credit)</SelectItem>
                  <SelectItem value="collection">Collection (Payment)</SelectItem>
                  <SelectItem value="return">Return Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="txAmount" className="font-semibold">Amount (₹)</Label>
              <Input id="txAmount" type="number" value={txAmount} onChange={e => setTxAmount(e.target.value)} placeholder="Enter amount" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="txDate" className="font-semibold">Date</Label>
              <Input id="txDate" type="date" value={txDate} onChange={e => setTxDate(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="txDesc" className="font-semibold">Description</Label>
              <Input id="txDesc" value={txDescription} onChange={e => setTxDescription(e.target.value)} placeholder="e.g. Weekly Payment, Bulk Order" className="mt-1.5" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setShowAddTransaction(null)}>Cancel</Button>
              <Button onClick={handleAddTransaction} disabled={!txAmount || !txDate}>Save Transaction</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Clients;
