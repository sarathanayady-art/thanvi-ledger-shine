import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import { Package, PackageCheck, PackageMinus, RotateCcw, Plus, Pencil, Search, IndianRupee } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppData } from "@/hooks/use-app-data";
import { pricingData, StockItem } from "@/data/stock";
import { toast } from "@/components/ui/use-toast";

const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const Stock = () => {
  const { stock, setStock, purchases, addPurchaseEntries, bulkUpdateConsumption, totalInvestment } = useAppData();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "in-stock" | "sold-out">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState<StockItem>({ name: "", purchased: 0, sale: 0, return: 0, damage: 0, remaining: 0 });
  const [supplierFilter, setSupplierFilter] = useState("all");

  const totals = useMemo(() => {
    const t = { purchased: 0, sale: 0, returnCount: 0, damage: 0, remaining: 0, items: stock.length, soldOut: 0, totalCost: totalInvestment };
    stock.forEach(s => {
      t.purchased += s.purchased;
      t.sale += s.sale;
      t.returnCount += s.return;
      t.damage += s.damage;
      t.remaining += s.remaining;
      if (s.remaining === 0 && s.purchased > 0) t.soldOut++;
    });
    return t;
  }, [stock, totalInvestment]);

  const filtered = useMemo(() => {
    let list = stock;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q));
    }
    if (filter === "in-stock") list = list.filter(s => s.remaining > 0);
    if (filter === "sold-out") list = list.filter(s => s.remaining === 0 && s.purchased > 0);
    return list;
  }, [stock, search, filter]);

  const filteredPurchases = useMemo(() => {
    let list = purchaseEntries;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.itemCode.toLowerCase().includes(q) || p.supplier.toLowerCase().includes(q));
    }
    if (supplierFilter !== "all") {
      list = list.filter(p => p.supplier === supplierFilter);
    }
    return list;
  }, [search, supplierFilter]);

  const filteredPricing = useMemo(() => {
    const entries = Object.entries(pricingData).map(([code, p]) => {
      const purchase = purchaseEntries.find(pe => pe.itemCode === code);
      const costPrice = purchase?.unitPrice || 0;
      return { code, costPrice, ...p };
    });
    if (search) {
      const q = search.toLowerCase();
      return entries.filter(e => e.code.toLowerCase().includes(q));
    }
    return entries;
  }, [search]);

  const suppliers = useMemo(() => {
    const set = new Set(purchaseEntries.map(p => p.supplier));
    return Array.from(set).sort();
  }, []);

  const openAdd = () => {
    setEditIdx(null);
    setForm({ name: "", purchased: 0, sale: 0, return: 0, damage: 0, remaining: 0 });
    setDialogOpen(true);
  };

  const openEdit = (idx: number) => {
    const realIdx = stock.findIndex(s => s.name === filtered[idx].name);
    setEditIdx(realIdx);
    setForm({ ...stock[realIdx] });
    setDialogOpen(true);
  };

  const save = () => {
    if (!form.name.trim()) {
      toast({ title: "Item name is required", variant: "destructive" });
      return;
    }
    const updated = [...stock];
    const item = { ...form, remaining: form.purchased - form.sale - form.return - form.damage };
    if (item.remaining < 0) item.remaining = 0;

    if (editIdx !== null) {
      updated[editIdx] = item;
      toast({ title: `${item.name} updated` });
    } else {
      if (stock.some(s => s.name.toLowerCase() === item.name.toLowerCase())) {
        toast({ title: "Item already exists", variant: "destructive" });
        return;
      }
      updated.push(item);
      toast({ title: `${item.name} added` });
    }
    setStock(updated);
    setDialogOpen(false);
  };

  const soldPercent = totals.purchased > 0 ? ((totals.sale / totals.purchased) * 100).toFixed(1) : "0";

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="page-header font-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Stock Inventory</h1>
          <p className="page-subtitle">Track items — purchased, sold, returned, damaged & remaining</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus size={16} /> Add Stock
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard title="Total Items" value={totals.items.toString()} subtitle={`${totals.soldOut} sold out`} icon={<Package size={20} />} variant="default" />
        <StatCard title="Purchased" value={totals.purchased.toString()} subtitle={`${soldPercent}% sold`} icon={<PackageCheck size={20} />} variant="success" />
        <StatCard title="Remaining" value={totals.remaining.toString()} icon={<PackageMinus size={20} />} variant="warning" />
        <StatCard title="Returns / Damage" value={`${totals.returnCount} / ${totals.damage}`} icon={<RotateCcw size={20} />} variant="danger" />
        <StatCard title="Total Investment" value={formatCurrency(totals.totalCost)} subtitle="Purchase cost" icon={<IndianRupee size={20} />} variant="default" />
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search item..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="purchases">Purchase Ledger</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        {/* ─── Inventory Tab ─── */}
        <TabsContent value="inventory">
          <div className="flex gap-2 mb-4">
            {(["all", "in-stock", "sold-out"] as const).map(f => (
              <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)} className="capitalize text-xs">
                {f === "all" ? "All" : f === "in-stock" ? "In Stock" : "Sold Out"}
              </Button>
            ))}
          </div>
          <div className="stat-card overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th className="text-right">Purchased</th>
                  <th className="text-right">Sale</th>
                  <th className="text-right">Return</th>
                  <th className="text-right">Damage</th>
                  <th className="text-right">Remaining</th>
                  <th className="text-right">Wholesale</th>
                  <th className="text-right">Online</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Edit</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => {
                  const pricing = pricingData[item.name];
                  return (
                    <tr key={item.name}>
                      <td className="text-muted-foreground text-xs">{i + 1}</td>
                      <td className="font-semibold">{item.name}</td>
                      <td className="text-right font-mono">{item.purchased}</td>
                      <td className="text-right font-mono">{item.sale}</td>
                      <td className="text-right font-mono">{item.return > 0 ? <span className="text-info">{item.return}</span> : "0"}</td>
                      <td className="text-right font-mono">{item.damage > 0 ? <span className="text-destructive">{item.damage}</span> : "0"}</td>
                      <td className="text-right font-mono font-bold">{item.remaining}</td>
                      <td className="text-right font-mono text-xs">{pricing ? formatCurrency(pricing.wholesalePrice) : "—"}</td>
                      <td className="text-right font-mono text-xs">{pricing ? formatCurrency(pricing.onlinePrice) : "—"}</td>
                      <td className="text-center">
                        {item.remaining === 0 && item.purchased > 0 ? (
                          <span className="badge-paid">Sold Out</span>
                        ) : item.remaining > 0 ? (
                          <span className="badge-pending">In Stock</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="text-center">
                        <button onClick={() => openEdit(i)} className="p-1 rounded hover:bg-muted transition-colors">
                          <Pencil size={14} className="text-muted-foreground hover:text-primary" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={11} className="text-center text-muted-foreground py-8">No items found</td></tr>
                )}
              </tbody>
              {filtered.length > 0 && (
                <tfoot>
                  <tr className="font-bold bg-muted/50">
                    <td></td>
                    <td>TOTAL</td>
                    <td className="text-right font-mono">{filtered.reduce((s, i) => s + i.purchased, 0)}</td>
                    <td className="text-right font-mono">{filtered.reduce((s, i) => s + i.sale, 0)}</td>
                    <td className="text-right font-mono">{filtered.reduce((s, i) => s + i.return, 0)}</td>
                    <td className="text-right font-mono">{filtered.reduce((s, i) => s + i.damage, 0)}</td>
                    <td className="text-right font-mono">{filtered.reduce((s, i) => s + i.remaining, 0)}</td>
                    <td colSpan={4}></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </TabsContent>

        {/* ─── Purchase Ledger Tab ─── */}
        <TabsContent value="purchases">
          <div className="flex gap-2 mb-4 flex-wrap">
            <Button size="sm" variant={supplierFilter === "all" ? "default" : "outline"} onClick={() => setSupplierFilter("all")} className="text-xs">All Suppliers</Button>
            {suppliers.map(s => (
              <Button key={s} size="sm" variant={supplierFilter === s ? "default" : "outline"} onClick={() => setSupplierFilter(s)} className="text-xs">{s}</Button>
            ))}
          </div>
          <div className="stat-card overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Date</th>
                  <th>Supplier</th>
                  <th>Item Code</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Unit Price</th>
                  <th className="text-right">Amount</th>
                  <th className="text-right">Progressive Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map(p => (
                  <tr key={p.sl}>
                    <td className="text-muted-foreground text-xs">{p.sl}</td>
                    <td className="text-xs whitespace-nowrap">{p.date}</td>
                    <td className="text-xs">{p.supplier}</td>
                    <td className="font-semibold">{p.itemCode}</td>
                    <td className="text-right font-mono">{p.quantity}</td>
                    <td className="text-right font-mono">{formatCurrency(p.unitPrice)}</td>
                    <td className="text-right font-mono font-bold">{formatCurrency(p.amount)}</td>
                    <td className="text-right font-mono text-muted-foreground">{formatCurrency(p.progressiveTotal)}</td>
                  </tr>
                ))}
                {filteredPurchases.length === 0 && (
                  <tr><td colSpan={8} className="text-center text-muted-foreground py-8">No entries found</td></tr>
                )}
              </tbody>
              {filteredPurchases.length > 0 && (
                <tfoot>
                  <tr className="font-bold bg-muted/50">
                    <td colSpan={4}>TOTAL ({filteredPurchases.length} entries)</td>
                    <td className="text-right font-mono">{filteredPurchases.reduce((s, p) => s + p.quantity, 0)}</td>
                    <td></td>
                    <td className="text-right font-mono">{formatCurrency(filteredPurchases.reduce((s, p) => s + p.amount, 0))}</td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </TabsContent>

        {/* ─── Pricing Tab ─── */}
        <TabsContent value="pricing">
          <div className="stat-card overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item Code</th>
                  <th className="text-right">Cost Price</th>
                  <th className="text-right">Wholesale</th>
                  <th className="text-right">Online</th>
                  <th className="text-right">W/S Margin</th>
                  <th className="text-right">Online Margin</th>
                </tr>
              </thead>
              <tbody>
                {filteredPricing.map((item, i) => {
                  const wsMargin = item.costPrice > 0 ? item.wholesalePrice - item.costPrice : 0;
                  const onMargin = item.costPrice > 0 ? item.onlinePrice - item.costPrice : 0;
                  return (
                    <tr key={item.code}>
                      <td className="text-muted-foreground text-xs">{i + 1}</td>
                      <td className="font-semibold">{item.code}</td>
                      <td className="text-right font-mono">{item.costPrice > 0 ? formatCurrency(item.costPrice) : "—"}</td>
                      <td className="text-right font-mono">{formatCurrency(item.wholesalePrice)}</td>
                      <td className="text-right font-mono">{formatCurrency(item.onlinePrice)}</td>
                      <td className="text-right font-mono">
                        {item.costPrice > 0 ? (
                          <span className={wsMargin > 0 ? "text-success" : "text-destructive"}>
                            {formatCurrency(wsMargin)}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="text-right font-mono">
                        {item.costPrice > 0 ? (
                          <span className={onMargin > 0 ? "text-success" : "text-destructive"}>
                            {formatCurrency(onMargin)}
                          </span>
                        ) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">{editIdx !== null ? "Edit Stock Item" : "Add New Stock Item"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Item Name</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value.toUpperCase() })} placeholder="e.g. K147" disabled={editIdx !== null} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Purchased</Label>
                <Input type="number" min={0} value={form.purchased} onChange={e => setForm({ ...form, purchased: +e.target.value })} />
              </div>
              <div>
                <Label>Sale</Label>
                <Input type="number" min={0} value={form.sale} onChange={e => setForm({ ...form, sale: +e.target.value })} />
              </div>
              <div>
                <Label>Return</Label>
                <Input type="number" min={0} value={form.return} onChange={e => setForm({ ...form, return: +e.target.value })} />
              </div>
              <div>
                <Label>Damage</Label>
                <Input type="number" min={0} value={form.damage} onChange={e => setForm({ ...form, damage: +e.target.value })} />
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-sm">
              <span className="text-muted-foreground">Auto-calculated remaining: </span>
              <span className="font-bold font-mono">{Math.max(0, form.purchased - form.sale - form.return - form.damage)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editIdx !== null ? "Update" : "Add Item"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Stock;
