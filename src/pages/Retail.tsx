import AppLayout from "@/components/AppLayout";
import { retailSalesData, RETAIL_TOTAL } from "@/data/retail";

const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const Retail = () => {
  const pendingItems = retailSalesData.filter(r => r.paymentStatus === "PENDING");
  const pendingAmount = pendingItems.reduce((s, r) => s + r.totalAmount, 0);

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="page-header">Retail Sales</h1>
        <p className="page-subtitle">
          Total: {formatCurrency(RETAIL_TOTAL)} · Pending: {formatCurrency(pendingAmount)} ({pendingItems.length} items)
        </p>
      </div>

      <div className="stat-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Item</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Price</th>
              <th className="text-right">Discount</th>
              <th className="text-right">Total</th>
              <th>Status</th>
              <th className="text-right">Running</th>
            </tr>
          </thead>
          <tbody>
            {retailSalesData.map((r, i) => (
              <tr key={i}>
                <td className="text-sm whitespace-nowrap">{r.date}</td>
                <td className="font-medium">{r.shopName}</td>
                <td className="font-mono text-xs">{r.itemCode}</td>
                <td className="text-right">{r.qty}</td>
                <td className="text-right amount-neutral">{formatCurrency(r.sellingPrice)}</td>
                <td className="text-right">{r.discount > 0 ? formatCurrency(r.discount) : "—"}</td>
                <td className="text-right amount-neutral">{formatCurrency(r.totalAmount)}</td>
                <td>
                  <span className={r.paymentStatus === "DONE" ? "badge-paid" : "badge-pending"}>
                    {r.paymentStatus}
                  </span>
                </td>
                <td className="text-right amount-neutral">{formatCurrency(r.progressiveTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
};

export default Retail;
