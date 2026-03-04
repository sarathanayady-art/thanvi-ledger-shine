import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { RetailSale } from "@/data/retail";
import { useAppData } from "@/hooks/use-app-data";
import { PlusCircle, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sortByDateDesc, formatEntryDate } from "@/lib/date-utils";

const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const Retail = () => {
  const { sales, setSales } = useAppData();
  const [showAdd, setShowAdd] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

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

  const sortedSales = [...sales].sort(sortByDateDesc);

  const resetForm = () => {
    setDate(""); setShopName(""); setItemCode(""); setQty(""); setSellingPrice(""); setDiscount(""); setPaymentStatus("DONE");
  };

  const openEdit = (sale: RetailSale, idx: number) => {
    // Find original index in unsorted array
    const origIdx = sales.indexOf(sale);
    setEditIndex(origIdx);
    // Parse date back to input format
    const parts = sale.date.split(" ");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const m = String(months.indexOf(parts[1]) + 1).padStart(2, "0");
    setDate(`20${parts[2]}-${m}-${parts[0]}`);
    setShopName(sale.shopName);
    setItemCode(sale.itemCode === "-" ? "" : sale.itemCode);
    setQty(String(sale.qty));
    setSellingPrice(String(sale.sellingPrice));
    setDiscount(String(sale.discount));
    setPaymentStatus(sale.paymentStatus);
    setShowAdd(true);
  };

  const handleSave = () => {
    if (!date || !shopName || !sellingPrice) return;
    const q = parseInt(qty) || 1;
    const sp = parseFloat(sellingPrice) || 0;
    const disc = parseFloat(discount) || 0;
    const total = (sp * q) - disc;
    const formattedDate = formatEntryDate(new Date(date));

    if (editIndex !== null) {
      setSales(prev => {
        const updated = [...prev];
        updated[editIndex] = {
          ...updated[editIndex],
          date: formattedDate,
          shopName: shopName.trim().toUpperCase(),
          itemCode: itemCode.trim().toUpperCase() || "-",
          qty: q, sellingPrice: sp, discount: disc, totalAmount: total,
          paymentStatus,
          progressiveTotal: 0, // will recalc
        };
        // Recalculate progressive totals
        let running = 0;
        return updated.map(s => { running += s.totalAmount; return { ...s, progressiveTotal: running }; });
      });
    } else {
      const newSale: RetailSale = {
        date: formattedDate,
        shopName: shopName.trim().toUpperCase(),
        itemCode: itemCode.trim().toUpperCase() || "-",
        qty: q, sellingPrice: sp, discount: disc, totalAmount: total,
        paymentStatus,
        progressiveTotal: currentTotal + total,
      };
      setSales(prev => [...prev, newSale]);
    }

    resetForm();
    setEditIndex(null);
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
        <Button size="sm" onClick={() => { resetForm(); setEditIndex(null); setShowAdd(true); }}>
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
              <th className="text-center">Edit</th>
            </tr>
          </thead>
          <tbody>
            {sortedSales.map((r, i) => (
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
                <td className="text-center">
                  <button onClick={() => openEdit(r, i)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                    <Pencil size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={showAdd} onOpenChange={(o) => { if (!o) { resetForm(); setEditIndex(null); } setShowAdd(o); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editIndex !== null ? "Edit Retail Sale" : "Add Retail Sale"}</DialogTitle>
            <p className="text-sm text-muted-foreground">{editIndex !== null ? "Update this transaction" : "Record a new retail transaction"}</p>
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
              <Button variant="ghost" onClick={() => { resetForm(); setEditIndex(null); setShowAdd(false); }}>Cancel</Button>
              <Button onClick={handleSave} disabled={!date || !shopName || !sellingPrice}>{editIndex !== null ? "Update Sale" : "Save Sale"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Retail;
