import AppLayout from "@/components/AppLayout";
import { partners, shareHistory, getCurrentBalance } from "@/data/partners";
import { RETAIL_TOTAL } from "@/data/retail";
import { getTotalCollection } from "@/data/clients";

const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const Partners = () => {
  const totalCollection = getTotalCollection();
  const totalSharesTaken = shareHistory.reduce((s, sh) => s + sh.amount, 0);
  const currentBalance = getCurrentBalance();

  // Group share history by date
  const dateGroups: Record<string, typeof shareHistory> = {};
  shareHistory.forEach(s => {
    if (!dateGroups[s.date]) dateGroups[s.date] = [];
    dateGroups[s.date].push(s);
  });

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="page-header">Partner Distributions</h1>
        <p className="page-subtitle">Vishnu & Sarath — Equal split of collections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="stat-card border-l-4 border-l-primary">
          <p className="text-xs font-medium text-muted-foreground uppercase">Total Collection</p>
          <p className="text-2xl font-bold mt-1 font-mono">{formatCurrency(totalCollection)}</p>
          <p className="text-xs text-muted-foreground mt-1">+ {formatCurrency(RETAIL_TOTAL)} retail</p>
        </div>
        <div className="stat-card border-l-4 border-l-accent">
          <p className="text-xs font-medium text-muted-foreground uppercase">Total Shares Taken</p>
          <p className="text-2xl font-bold mt-1 font-mono">{formatCurrency(totalSharesTaken)}</p>
          <p className="text-xs text-muted-foreground mt-1">Across {Object.keys(dateGroups).length} distributions</p>
        </div>
        <div className="stat-card border-l-4 border-l-warning">
          <p className="text-xs font-medium text-muted-foreground uppercase">Current Balance</p>
          <p className="text-2xl font-bold mt-1 font-mono">{formatCurrency(currentBalance)}</p>
        </div>
      </div>

      <div className="stat-card mb-8">
        <h3 className="font-semibold mb-4">Share Distribution History</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              {partners.map(p => (
                <th key={p.name} className="text-right">{p.name}</th>
              ))}
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(dateGroups).map(([date, shares]) => (
              <tr key={date}>
                <td className="font-medium">{date}</td>
                {partners.map(p => {
                  const s = shares.find(sh => sh.partner === p.name);
                  return (
                    <td key={p.name} className="text-right amount-neutral">
                      {s ? formatCurrency(s.amount) : "—"}
                    </td>
                  );
                })}
                <td className="text-right amount-neutral font-bold">
                  {formatCurrency(shares.reduce((sum, s) => sum + s.amount, 0))}
                </td>
              </tr>
            ))}
            <tr className="font-bold bg-muted/30">
              <td>TOTAL</td>
              {partners.map(p => (
                <td key={p.name} className="text-right amount-neutral">
                  {formatCurrency(shareHistory.filter(s => s.partner === p.name).reduce((sum, s) => sum + s.amount, 0))}
                </td>
              ))}
              <td className="text-right amount-neutral">{formatCurrency(totalSharesTaken)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cash flow summary */}
      <div className="stat-card">
        <h3 className="font-semibold mb-4">Cash Flow Summary</h3>
        <div className="space-y-3">
          {[
            { label: "Share Taking 03 Dec 25", amount: 64699 },
            { label: "Cash in Balance as on 30 Dec 25", amount: 83137 },
            { label: "Share Taking 30 Dec 25", amount: 83137 },
            { label: "Cash in Balance as on 31 Jan 26", amount: 98946 },
            { label: "Share Taking 31 Jan 26", amount: 98946 },
            { label: "Current Balance", amount: currentBalance },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
              <span className="text-sm">{item.label}</span>
              <span className="font-bold font-mono">{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Partners;
