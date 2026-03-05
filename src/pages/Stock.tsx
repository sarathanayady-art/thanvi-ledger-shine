import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import { Package, PackageCheck, PackageMinus, RotateCcw, AlertTriangle, Plus, Pencil, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { defaultStock, StockItem } from "@/data/stock";
import { toast } from "@/components/ui/use-toast";

const Stock = () => {
  const [stock, setStock] = useLocalStorage<StockItem[]>("tc_stock", defaultStock);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "in-stock" | "sold-out">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState<StockItem>({ name: "", purchased: 0, sale: 0, return: 0, damage: 0, remaining: 0 });

  const totals = useMemo(() => {
    const t = { purchased: 0, sale: 0, returnCount: 0, damage: 0, remaining: 0, items: stock.length, soldOut: 0 };
    stock.forEach(s => {
      t.purchased += s.purchased;
      t.sale += s.sale;
      t.returnCount += s.return;
      t.damage += s.damage;
      t.remaining += s.remaining;
      if (s.remaining === 0 && s.purchased > 0) t.soldOut++;
    });
    return t;
  }, [stock]);

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Items" value={totals.items.toString()} subtitle={`${totals.soldOut} sold out`} icon={<Package size={20} />} variant="default" />
        <StatCard title="Purchased" value={totals.purchased.toString()} subtitle={`${soldPercent}% sold`} icon={<PackageCheck size={20} />} variant="success" />
        <StatCard title="Remaining" value={totals.remaining.toString()} icon={<PackageMinus size={20} />} variant="warning" />
        <StatCard title="Returns / Damage" value={`${totals.returnCount} / ${totals.damage}`} icon={<RotateCcw size={20} />} variant="danger" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search item..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2">
          {(["all", "in-stock", "sold-out"] as const).map(f => (
            <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)} className="capitalize text-xs">
              {f === "all" ? "All" : f === "in-stock" ? "In Stock" : "Sold Out"}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="stat-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item Name</th>
              <th className="text-right">Purchased</th>
              <th className="text-right">Sale</th>
              <th className="text-right">Return</th>
              <th className="text-right">Damage</th>
              <th className="text-right">Remaining</th>
              <th className="text-center">Status</th>
              <th className="text-center">Edit</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr key={item.name}>
                <td className="text-muted-foreground text-xs">{i + 1}</td>
                <td className="font-semibold">{item.name}</td>
                <td className="text-right font-mono">{item.purchased}</td>
                <td className="text-right font-mono">{item.sale}</td>
                <td className="text-right font-mono">{item.return > 0 ? <span className="text-info">{item.return}</span> : "0"}</td>
                <td className="text-right font-mono">{item.damage > 0 ? <span className="text-destructive">{item.damage}</span> : "0"}</td>
                <td className="text-right font-mono font-bold">{item.remaining}</td>
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
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center text-muted-foreground py-8">No items found</td>
              </tr>
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
                <td></td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

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
