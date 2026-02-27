import AppLayout from "@/components/AppLayout";
import { expensesData, getTotalExpenses } from "@/data/expenses";

const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const Expenses = () => {
  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="page-header">Expenses</h1>
        <p className="page-subtitle">Grand Total: {formatCurrency(getTotalExpenses())}</p>
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
            {expensesData.map((e, i) => (
              <tr key={i}>
                <td className="text-sm whitespace-nowrap">{e.date}</td>
                <td className="font-medium">{e.description}</td>
                <td className={`text-right ${e.amount < 0 ? "amount-negative" : "amount-neutral"}`}>
                  {e.amount < 0 ? `-${formatCurrency(Math.abs(e.amount))}` : formatCurrency(e.amount)}
                </td>
                <td>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    e.paidBy === "VISH" ? "bg-primary/10 text-primary" :
                    e.paidBy === "SPV" ? "bg-accent/10 text-accent" :
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
    </AppLayout>
  );
};

export default Expenses;
