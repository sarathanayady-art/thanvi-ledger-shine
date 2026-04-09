import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Upload, FileSpreadsheet, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { PurchaseEntry } from "@/data/stock";

interface ExcelUploadProps {
  mode: "purchase" | "consumption";
  onUploadPurchases?: (entries: PurchaseEntry[]) => void;
  onUploadConsumption?: (items: { itemCode: string; qty: number }[]) => void;
}

const ExcelUpload = ({ mode, onUploadPurchases, onUploadConsumption }: ExcelUploadProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [preview, setPreview] = useState<Record<string, unknown>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);
      if (json.length === 0) {
        toast({ title: "Empty file", description: "No data found in the uploaded file", variant: "destructive" });
        return;
      }
      setHeaders(Object.keys(json[0]));
      setPreview(json);
      setDialogOpen(true);
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const findCol = (keys: string[], ...patterns: string[]) =>
    keys.find(k => patterns.some(p => k.toLowerCase().replace(/[^a-z]/g, "").includes(p)));

  const handleConfirm = () => {
    if (mode === "purchase" && onUploadPurchases) {
      const dateCol = findCol(headers, "date");
      const supplierCol = findCol(headers, "supplier", "suppliername");
      const itemCol = findCol(headers, "itemcode", "item");
      const qtyCol = findCol(headers, "qty", "quantity", "quantitypurchased");
      const priceCol = findCol(headers, "unitprice", "price");
      const amountCol = findCol(headers, "amount", "totalamount");

      if (!itemCol || !qtyCol) {
        toast({ title: "Missing columns", description: "Need at least Item Code and Quantity columns", variant: "destructive" });
        return;
      }

      const entries: PurchaseEntry[] = preview.map((row, i) => {
        const qty = Number(row[qtyCol!]) || 0;
        const unitPrice = priceCol ? Number(row[priceCol]) || 0 : 0;
        const amount = amountCol ? Number(row[amountCol]) || 0 : qty * unitPrice;
        return {
          sl: i + 1,
          date: dateCol ? String(row[dateCol] || "") : "",
          supplier: supplierCol ? String(row[supplierCol] || "").toUpperCase() : "UPLOADED",
          itemCode: String(row[itemCol!] || "").toUpperCase(),
          quantity: qty,
          unitPrice,
          amount,
          progressiveTotal: 0,
        };
      }).filter(e => e.quantity > 0 || e.amount > 0);

      onUploadPurchases(entries);
      toast({ title: `${entries.length} purchase entries imported`, description: "Stock inventory updated automatically" });
    }

    if (mode === "consumption" && onUploadConsumption) {
      const itemCol = findCol(headers, "itemcode", "item");
      const qtyCol = findCol(headers, "qty", "quantity", "sold", "sale", "consumption");

      if (!itemCol || !qtyCol) {
        toast({ title: "Missing columns", description: "Need at least Item Code and Quantity/Sale columns", variant: "destructive" });
        return;
      }

      const items = preview.map(row => ({
        itemCode: String(row[itemCol!] || "").toUpperCase(),
        qty: Number(row[qtyCol!]) || 0,
      })).filter(i => i.qty > 0);

      onUploadConsumption(items);
      toast({ title: `${items.length} items updated`, description: "Stock consumption applied" });
    }

    setDialogOpen(false);
    setPreview([]);
    setHeaders([]);
  };

  return (
    <>
      <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} className="hidden" />
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => fileRef.current?.click()}
      >
        <Upload size={14} />
        {mode === "purchase" ? "Upload Purchase" : "Upload Consumption"}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet size={20} className="text-primary" />
              {mode === "purchase" ? "Import Purchase Entries" : "Import Stock Consumption"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">{fileName} — {preview.length} rows found</p>
          </DialogHeader>

          {/* Column mapping preview */}
          <div className="text-xs space-y-2 mb-2">
            <p className="font-semibold text-muted-foreground">Detected columns:</p>
            <div className="flex flex-wrap gap-1.5">
              {headers.map(h => {
                const matched = mode === "purchase"
                  ? !!findCol([h], "date", "supplier", "suppliername", "itemcode", "item", "qty", "quantity", "quantitypurchased", "unitprice", "price", "amount", "totalamount")
                  : !!findCol([h], "itemcode", "item", "qty", "quantity", "sold", "sale", "consumption");
                return (
                  <span key={h} className={`px-2 py-0.5 rounded-full border text-xs ${matched ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted border-border text-muted-foreground"}`}>
                    {matched ? <Check size={10} className="inline mr-1" /> : <AlertCircle size={10} className="inline mr-1" />}
                    {h}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Data preview table */}
          <div className="flex-1 overflow-auto border rounded-lg">
            <table className="data-table text-xs">
              <thead>
                <tr>
                  <th className="text-muted-foreground">#</th>
                  {headers.map(h => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 20).map((row, i) => (
                  <tr key={i}>
                    <td className="text-muted-foreground">{i + 1}</td>
                    {headers.map(h => <td key={h}>{String(row[h] ?? "")}</td>)}
                  </tr>
                ))}
                {preview.length > 20 && (
                  <tr><td colSpan={headers.length + 1} className="text-center text-muted-foreground py-2">... and {preview.length - 20} more rows</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirm} className="gap-2">
              <Check size={14} />
              Import {preview.length} Rows
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExcelUpload;
