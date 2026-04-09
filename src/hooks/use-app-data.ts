import { useLocalStorage } from "./use-local-storage";
import { clientsData as initialClients, Client } from "@/data/clients";
import { retailSalesData as initialRetail, RetailSale } from "@/data/retail";
import { expensesData as initialExpenses, Expense } from "@/data/expenses";
import { shareHistory as initialShares, PartnerShare, partners } from "@/data/partners";
import { defaultStock, StockItem, purchaseEntries } from "@/data/stock";
import { useCallback } from "react";

export function useAppData() {
  const [clients, setClients] = useLocalStorage<Client[]>("thanvi_clients", [...initialClients]);
  const [sales, setSales] = useLocalStorage<RetailSale[]>("thanvi_retail_sales", [...initialRetail]);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("thanvi_expenses", [...initialExpenses]);
  const [shares, setShares] = useLocalStorage<PartnerShare[]>("thanvi_shares", [...initialShares]);
  const [stock, setStock] = useLocalStorage<StockItem[]>("tc_stock", defaultStock);

  // ─── Auto-sync: update stock when a retail sale is saved ───
  const addRetailSale = useCallback((newSale: RetailSale) => {
    setSales(prev => [...prev, newSale]);
    // Update stock: increment sale count, decrement remaining
    if (newSale.itemCode && newSale.itemCode !== "-" && newSale.qty > 0) {
      setStock(prev => prev.map(item =>
        item.name.toUpperCase() === newSale.itemCode.toUpperCase()
          ? { ...item, sale: item.sale + newSale.qty, remaining: Math.max(0, item.remaining - newSale.qty) }
          : item
      ));
    }
  }, [setSales, setStock]);

  const updateRetailSale = useCallback((index: number, oldSale: RetailSale, newSale: RetailSale) => {
    setSales(prev => {
      const updated = [...prev];
      updated[index] = newSale;
      // Recalculate progressive totals
      let running = 0;
      return updated.map(s => { running += s.totalAmount; return { ...s, progressiveTotal: running }; });
    });
    // Reverse old stock impact, apply new
    setStock(prev => {
      let updated = [...prev];
      // Reverse old sale
      if (oldSale.itemCode && oldSale.itemCode !== "-" && oldSale.qty > 0) {
        updated = updated.map(item =>
          item.name.toUpperCase() === oldSale.itemCode.toUpperCase()
            ? { ...item, sale: item.sale - oldSale.qty, remaining: item.remaining + oldSale.qty }
            : item
        );
      }
      // Apply new sale
      if (newSale.itemCode && newSale.itemCode !== "-" && newSale.qty > 0) {
        updated = updated.map(item =>
          item.name.toUpperCase() === newSale.itemCode.toUpperCase()
            ? { ...item, sale: item.sale + newSale.qty, remaining: Math.max(0, item.remaining - newSale.qty) }
            : item
        );
      }
      return updated;
    });
  }, [setSales, setStock]);

  // Stock stats
  const stockTotal = stock.length;
  const stockSoldOut = stock.filter(s => s.remaining === 0 && s.purchased > 0).length;
  const stockRemaining = stock.reduce((s, i) => s + i.remaining, 0);

  // Computed client totals
  const totalSale = clients.reduce((s, c) => s + c.totalSale, 0);
  const totalCollection = clients.reduce((s, c) => s + c.totalCollection, 0);
  const totalBalance = clients.reduce((s, c) => s + c.balance, 0);
  const overallBalancePercent = totalSale > 0 ? (totalBalance / totalSale) * 100 : 0;

  // Computed retail total
  const retailTotal = sales.reduce((s, r) => s + r.totalAmount, 0);

  // Computed expenses total
  const expensesTotal = expenses.length > 0 ? expenses[expenses.length - 1].runningTotal : 0;

  // Derive partner shares from "Collection Sharing" expenses + standalone shares
  const expenseShares: PartnerShare[] = expenses
    .filter(e => e.description.toLowerCase().includes("collection sharing") && e.amount < 0)
    .map(e => ({
      date: e.date,
      partner: e.paidBy === "VISH" ? "VISHNU" : e.paidBy === "SPV" ? "SARATH" : e.paidBy,
      amount: Math.abs(e.amount),
    }));

  // Use expense-derived shares if they exist, otherwise fall back to standalone shares
  const effectiveShares = expenseShares.length > 0 ? expenseShares : shares;

  // Computed partner data
  const totalSharesTaken = effectiveShares.reduce((s, sh) => s + sh.amount, 0);
  const currentBalance = totalCollection + retailTotal - totalSharesTaken;

  const totalClients = clients.length;
  const pendingClients = clients.filter(c => c.balance > 0).length;

  // Total investment from purchase ledger
  const totalInvestment = purchaseEntries.reduce((s, p) => s + p.amount, 0);

  return {
    clients, setClients,
    sales, setSales, addRetailSale, updateRetailSale,
    expenses, setExpenses,
    shares: effectiveShares, setShares,
    stock, setStock,
    partners,
    purchaseEntries,
    // Computed
    totalSale,
    totalCollection,
    totalBalance,
    overallBalancePercent,
    retailTotal,
    expensesTotal,
    totalSharesTaken,
    currentBalance,
    totalClients,
    pendingClients,
    stockTotal,
    stockSoldOut,
    stockRemaining,
    totalInvestment,
  };
}
