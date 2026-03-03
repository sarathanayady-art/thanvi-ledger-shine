import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { RetailSale } from "@/data/retail";
import { useAppData } from "@/hooks/use-app-data";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const Retail = () => {
  const { sales, setSales } = useAppData();
  const [showAdd, setShowAdd] = useState(false);

  // Form state
  const [date, setDate] = useState("");
  const [shopName, setShopName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [qty, setQty] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"DONE" | "PENDING">("DONE");

  const currentTotal = sales.reduce((s, r) => s + r.totalAmount, 0);
  const pendingItems = sales.filter(r => r.paymentStatus === "PENDING");
  const pendingAmount = pendingItems.reduce((s, r) => s + r.totalAmount, 0);

  const handleAdd = () => {
    if (!date || !shopName || !sellingPrice) return;
    const q = parseInt(qty) || 1;
    const sp = parseFloat(sellingPrice) || 0;
    const disc = parseFloat(discount) || 0;
    const total = (sp * q) - disc;

    const d = new Date(date);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;

    const newSale: RetailSale = {
      date: formattedDate,
      shopName: shopName.trim().toUpperCase(),
      itemCode: itemCode.trim().toUpperCase() || "-",
      qty: q, sellingPrice: sp, discount: disc, totalAmount: total,
      paymentStatus,
      progressiveTotal: currentTotal + total,
    };

    setSales(prev => [...prev, newSale]);
    setDate(""); setShopName(""); setItemCode(""); setQty(""); setSellingPrice(""); setDiscount(""); setPaymentStatus("DONE");
    setShowAdd(false);
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-header">Retail Sales</h1>
          <p className="page-subtitle">
            Total: {formatCurrency(currentTotal)} · Pending: {formatCurrency(pendingAmount)} ({pendingItems.length} items)
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <PlusCircle size={16} className="mr-2" />
          Add Sale
        </Button>
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
            {sales.map((r, i) => (
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

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Retail Sale</DialogTitle>
            <p className="text-sm text-muted-foreground">Record a new retail transaction</p>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="font-semibold">Customer Name</Label>
              <Input value={shopName} onChange={e => setShopName(e.target.value)} placeholder="Enter customer name" className="mt-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="font-semibold">Item Code</Label>
                <Input value={itemCode} onChange={e => setItemCode(e.target.value)} placeholder="e.g. L15" className="mt-1.5" />
              </div>
              <div>
                <Label className="font-semibold">Quantity</Label>
                <Input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="1" className="mt-1.5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="font-semibold">Selling Price (₹)</Label>
                <Input type="number" value={sellingPrice} onChange={e => setSellingPrice(e.target.value)} placeholder="0" className="mt-1.5" />
              </div>
              <div>
                <Label className="font-semibold">Discount (₹)</Label>
                <Input type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="0" className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label className="font-semibold">Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label className="font-semibold">Payment Status</Label>
              <Select value={paymentStatus} onValueChange={v => setPaymentStatus(v as "DONE" | "PENDING")}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DONE">Done</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={!date || !shopName || !sellingPrice}>Save Sale</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Retail;
