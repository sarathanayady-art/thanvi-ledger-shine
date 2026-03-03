import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import { useAppData } from "@/hooks/use-app-data";
import { IndianRupee, TrendingUp, TrendingDown, Wallet, Users, ShoppingBag } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const Dashboard = () => {
  const {
    clients, totalSale, totalCollection, totalBalance,
    overallBalancePercent, retailTotal, expensesTotal,
    currentBalance, totalClients, pendingClients,
  } = useAppData();

  // Monthly data from live clients
  const getMonthlyData = () => {
    const months: Record<string, { sale: number; collection: number }> = {};
    clients.forEach(c => {
      c.transactions.forEach(t => {
        const parts = t.date.split(" ");
        const key = `${parts[1]} '${parts[2]}`;
        if (!months[key]) months[key] = { sale: 0, collection: 0 };
        if (t.type === "sale") months[key].sale += t.amount;
        else if (t.type === "collection") months[key].collection += t.amount;
      });
    });
    const order = ["Nov '25", "Dec '25", "Jan '26", "Feb '26"];
    return order.map(m => ({ month: m, sale: months[m]?.sale || 0, collection: months[m]?.collection || 0 }));
  };

  const monthlyData = getMonthlyData();
  const balPercent = overallBalancePercent;

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="page-header">Dashboard</h1>
        <p className="page-subtitle">Financial overview — Thanvi Collections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Sales"
          value={formatCurrency(totalSale)}
          subtitle={`+ ${formatCurrency(retailTotal)} retail`}
          icon={<TrendingUp size={20} />}
          variant="default"
        />
        <StatCard
          title="Total Collection"
          value={formatCurrency(totalCollection)}
          subtitle={`${(100 - balPercent).toFixed(1)}% collected`}
          icon={<IndianRupee size={20} />}
          variant="success"
        />
        <StatCard
          title="Outstanding Balance"
          value={formatCurrency(totalBalance)}
          subtitle={`${balPercent.toFixed(1)}% pending`}
          icon={<TrendingDown size={20} />}
          variant="danger"
        />
        <StatCard
          title="Current Cash Balance"
          value={formatCurrency(currentBalance)}
          subtitle="After partner shares"
          icon={<Wallet size={20} />}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        <div className="lg:col-span-2 stat-card">
          <h3 className="font-semibold mb-4">Monthly Sales vs Collection</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="sale" name="Sales" fill="hsl(var(--chart-sale))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="collection" name="Collection" fill="hsl(var(--chart-collection))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card space-y-4">
          <h3 className="font-semibold">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-primary" />
                <span className="text-sm">Total Clients</span>
              </div>
              <span className="font-bold font-mono">{totalClients}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <TrendingDown size={16} className="text-destructive" />
                <span className="text-sm">Pending Clients</span>
              </div>
              <span className="font-bold font-mono">{pendingClients}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} className="text-accent" />
                <span className="text-sm">Retail Sales</span>
              </div>
              <span className="font-bold font-mono">{formatCurrency(retailTotal)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <IndianRupee size={16} className="text-warning" />
                <span className="text-sm">Total Expenses</span>
              </div>
              <span className="font-bold font-mono">{formatCurrency(expensesTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top outstanding clients */}
      <div className="stat-card">
        <h3 className="font-semibold mb-4">Top Outstanding Accounts</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Client</th>
              <th className="text-right">Sale</th>
              <th className="text-right">Collected</th>
              <th className="text-right">Balance</th>
              <th className="text-right">Bal %</th>
            </tr>
          </thead>
          <tbody>
            {clients
              .filter(c => c.balance > 0)
              .sort((a, b) => b.balance - a.balance)
              .slice(0, 8)
              .map(c => (
                <tr key={c.name}>
                  <td className="font-medium">{c.name}</td>
                  <td className="text-right amount-neutral">{formatCurrency(c.totalSale)}</td>
                  <td className="text-right amount-positive">{formatCurrency(c.totalCollection)}</td>
                  <td className="text-right amount-negative">{formatCurrency(c.balance)}</td>
                  <td className="text-right">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      c.balancePercent > 70 ? "bg-destructive/10 text-destructive" :
                      c.balancePercent > 40 ? "bg-warning/10 text-warning" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {c.balancePercent.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
