import AppLayout from "@/components/AppLayout";
import { useAppData } from "@/hooks/use-app-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const parseMonth = (dateStr: string) => {
  const parts = dateStr.split(" ");
  if (parts.length < 3) return null;
  return `${parts[1]} '${parts[2]}`;
};

const Reports = () => {
  const { clients, sales, expenses } = useAppData();

  const getMonthlyBalanceSheet = () => {
    const months: Record<string, { sales: number; collections: number; expenses: number; retail: number }> = {};
    const order = ["Oct '25", "Nov '25", "Dec '25", "Jan '26", "Feb '26", "Mar '26"];
    order.forEach(m => { months[m] = { sales: 0, collections: 0, expenses: 0, retail: 0 }; });

    clients.forEach(c => {
      c.transactions.forEach(t => {
        const m = parseMonth(t.date);
        if (m && months[m]) {
          if (t.type === "sale") months[m].sales += t.amount;
          else if (t.type === "collection") months[m].collections += t.amount;
        }
      });
    });

    sales.forEach(r => {
      const m = parseMonth(r.date);
      if (m && months[m]) months[m].retail += r.totalAmount;
    });

    expenses.forEach(e => {
      const m = parseMonth(e.date);
      if (m && months[m] && e.amount > 0 && !e.description.includes("Balancing") && !e.description.includes("Collection Sharing")) {
        months[m].expenses += e.amount;
      }
    });

    return order
      .filter(m => months[m].sales > 0 || months[m].collections > 0 || months[m].retail > 0 || months[m].expenses > 0)
      .map(m => ({
        month: m,
        ...months[m],
        net: months[m].collections + months[m].retail - months[m].expenses,
      }));
  };

  const balanceSheet = getMonthlyBalanceSheet();

  const riskData = [
    { name: "Cleared (0%)", value: clients.filter(c => c.balancePercent === 0).length, color: "hsl(var(--success))" },
    { name: "Low (<30%)", value: clients.filter(c => c.balancePercent > 0 && c.balancePercent < 30).length, color: "hsl(var(--chart-balance))" },
    { name: "Medium (30-70%)", value: clients.filter(c => c.balancePercent >= 30 && c.balancePercent < 70).length, color: "hsl(var(--warning))" },
    { name: "High (>70%)", value: clients.filter(c => c.balancePercent >= 70).length, color: "hsl(var(--destructive))" },
  ];

  const totals = balanceSheet.reduce((acc, m) => ({
    sales: acc.sales + m.sales,
    collections: acc.collections + m.collections,
    retail: acc.retail + m.retail,
    expenses: acc.expenses + m.expenses,
    net: acc.net + m.net,
  }), { sales: 0, collections: 0, retail: 0, expenses: 0, net: 0 });

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="page-header">Reports</h1>
        <p className="page-subtitle">Financial analysis and insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <div className="stat-card">
          <h3 className="font-semibold mb-4">Collection Efficiency by Month</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={balanceSheet.filter(m => m.sales > 0 || m.collections > 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="sales" name="Sales" fill="hsl(var(--chart-sale))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="collections" name="Collections" fill="hsl(var(--chart-collection))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="font-semibold mb-4">Client Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={riskData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                {riskData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="stat-card">
        <h3 className="font-semibold mb-4">Monthly Balance Sheet</h3>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th className="text-right">Client Sales</th>
                <th className="text-right">Collections</th>
                <th className="text-right">Retail</th>
                <th className="text-right">Expenses</th>
                <th className="text-right">Net Flow</th>
              </tr>
            </thead>
            <tbody>
              {balanceSheet.map(m => (
                <tr key={m.month}>
                  <td className="font-medium">{m.month}</td>
                  <td className="text-right amount-neutral">{formatCurrency(m.sales)}</td>
                  <td className="text-right amount-positive">{formatCurrency(m.collections)}</td>
                  <td className="text-right amount-neutral">{formatCurrency(m.retail)}</td>
                  <td className="text-right amount-negative">{formatCurrency(m.expenses)}</td>
                  <td className={`text-right font-bold font-mono ${m.net >= 0 ? "text-[hsl(var(--success))]" : "text-destructive"}`}>
                    {m.net >= 0 ? formatCurrency(m.net) : `-${formatCurrency(Math.abs(m.net))}`}
                  </td>
                </tr>
              ))}
              <tr className="font-bold bg-muted/30">
                <td>TOTAL</td>
                <td className="text-right amount-neutral">{formatCurrency(totals.sales)}</td>
                <td className="text-right amount-positive">{formatCurrency(totals.collections)}</td>
                <td className="text-right amount-neutral">{formatCurrency(totals.retail)}</td>
                <td className="text-right amount-negative">{formatCurrency(totals.expenses)}</td>
                <td className={`text-right font-bold font-mono ${totals.net >= 0 ? "text-[hsl(var(--success))]" : "text-destructive"}`}>
                  {totals.net >= 0 ? formatCurrency(totals.net) : `-${formatCurrency(Math.abs(totals.net))}`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default Reports;
