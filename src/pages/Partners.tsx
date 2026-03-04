import AppLayout from "@/components/AppLayout";
import { useAppData } from "@/hooks/use-app-data";
import { sortByDateDesc } from "@/lib/date-utils";

const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const Partners = () => {
  const { partners, shares, totalCollection, retailTotal, expensesTotal, totalSharesTaken, currentBalance } = useAppData();

  // Group share history by date, sorted latest first
  const dateGroups: Record<string, typeof shares> = {};
  shares.forEach(s => {
    if (!dateGroups[s.date]) dateGroups[s.date] = [];
    dateGroups[s.date].push(s);
  });

  const sortedDates = Object.keys(dateGroups).sort((a, b) => {
    const dummyA = { date: a };
    const dummyB = { date: b };
    return sortByDateDesc(dummyA, dummyB);
  });

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="page-header">Partner Distributions</h1>
        <p className="page-subtitle">Vishnu & Sarath — Equal split of collections (derived from Expense "Collection Sharing" entries)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="stat-card border-l-4 border-l-primary">
          <p className="text-xs font-medium text-muted-foreground uppercase">Total Collection</p>
          <p className="text-2xl font-bold mt-1 font-mono">{formatCurrency(totalCollection)}</p>
          <p className="text-xs text-muted-foreground mt-1">+ {formatCurrency(retailTotal)} retail</p>
        </div>
        <div className="stat-card border-l-4 border-l-accent">
          <p className="text-xs font-medium text-muted-foreground uppercase">Total Shares Taken</p>
          <p className="text-2xl font-bold mt-1 font-mono">{formatCurrency(totalSharesTaken)}</p>
          <p className="text-xs text-muted-foreground mt-1">Across {sortedDates.length} distributions</p>
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
            {sortedDates.map(date => {
              const dateShares = dateGroups[date];
              return (
                <tr key={date}>
                  <td className="font-medium">{date}</td>
                  {partners.map(p => {
                    const s = dateShares.find(sh => sh.partner === p.name);
                    return (
                      <td key={p.name} className="text-right amount-neutral">
                        {s ? formatCurrency(s.amount) : "—"}
                      </td>
                    );
                  })}
                  <td className="text-right amount-neutral font-bold">
                    {formatCurrency(dateShares.reduce((sum, s) => sum + s.amount, 0))}
                  </td>
                </tr>
              );
            })}
            <tr className="font-bold bg-muted/30">
              <td>TOTAL</td>
              {partners.map(p => (
                <td key={p.name} className="text-right amount-neutral">
                  {formatCurrency(shares.filter(s => s.partner === p.name).reduce((sum, s) => sum + s.amount, 0))}
                </td>
              ))}
              <td className="text-right amount-neutral">{formatCurrency(totalSharesTaken)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="stat-card">
        <h3 className="font-semibold mb-4">Cash Flow Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
            <span className="text-sm">Total Collection (Clients)</span>
            <span className="font-bold font-mono">{formatCurrency(totalCollection)}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
            <span className="text-sm">Total Retail Sales</span>
            <span className="font-bold font-mono">{formatCurrency(retailTotal)}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
            <span className="text-sm">Total Shares Taken</span>
            <span className="font-bold font-mono text-destructive">-{formatCurrency(totalSharesTaken)}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5 border border-primary/20">
            <span className="text-sm font-semibold">Current Balance</span>
            <span className="font-bold font-mono text-primary">{formatCurrency(currentBalance)}</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Partners;
