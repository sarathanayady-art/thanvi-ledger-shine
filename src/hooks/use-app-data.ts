import { useLocalStorage } from "./use-local-storage";
import { clientsData as initialClients, Client } from "@/data/clients";
import { retailSalesData as initialRetail, RetailSale } from "@/data/retail";
import { expensesData as initialExpenses, Expense } from "@/data/expenses";
import { shareHistory as initialShares, PartnerShare, partners } from "@/data/partners";

export function useAppData() {
  const [clients, setClients] = useLocalStorage<Client[]>("thanvi_clients", [...initialClients]);
  const [sales, setSales] = useLocalStorage<RetailSale[]>("thanvi_retail_sales", [...initialRetail]);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("thanvi_expenses", [...initialExpenses]);
  const [shares, setShares] = useLocalStorage<PartnerShare[]>("thanvi_shares", [...initialShares]);

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

  return {
    clients, setClients,
    sales, setSales,
    expenses, setExpenses,
    shares: effectiveShares, setShares,
    partners,
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
  };
}
