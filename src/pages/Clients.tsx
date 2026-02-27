import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { clientsData, Client } from "@/data/clients";
import { FileText, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const exportCSV = () => {
    const headers = "Client,Total Sale,Total Collection,Balance,Balance %\n";
    const rows = clientsData.map(c => `${c.name},${c.totalSale},${c.totalCollection},${c.balance},${c.balancePercent}`).join("\n");
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
          <p className="page-subtitle">{clientsData.length} clients · {formatCurrency(clientsData.reduce((s, c) => s + c.balance, 0))} outstanding</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download size={16} className="mr-2" />
          Export CSV
        </Button>
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
              <th className="text-center">Ledger</th>
            </tr>
          </thead>
          <tbody>
            {clientsData.map(c => (
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
                  {c.transactions.length > 0 && (
                    <button
                      onClick={() => setSelectedClient(c)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <FileText size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            <tr className="font-bold bg-muted/30">
              <td>TOTAL</td>
              <td className="text-right amount-neutral">{formatCurrency(clientsData.reduce((s, c) => s + c.totalSale, 0))}</td>
              <td className="text-right amount-positive">{formatCurrency(clientsData.reduce((s, c) => s + c.totalCollection, 0))}</td>
              <td className="text-right amount-negative">{formatCurrency(clientsData.reduce((s, c) => s + c.balance, 0))}</td>
              <td className="text-right">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                  {((clientsData.reduce((s, c) => s + c.balance, 0) / clientsData.reduce((s, c) => s + c.totalSale, 0)) * 100).toFixed(1)}%
                </span>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <ClientLedger client={selectedClient} open={!!selectedClient} onClose={() => setSelectedClient(null)} />
    </AppLayout>
  );
};

export default Clients;
