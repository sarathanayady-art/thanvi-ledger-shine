export interface Transaction {
  date: string;
  type: 'sale' | 'collection' | 'return';
  amount: number;
  balance: number;
  description?: string;
}

export interface Client {
  name: string;
  totalSale: number;
  totalCollection: number;
  balance: number;
  balancePercent: number;
  transactions: Transaction[];
}

export const clientsData: Client[] = [
  {
    name: "ANJALI",
    totalSale: 116675, totalCollection: 70000, balance: 46675, balancePercent: 40.0,
    transactions: [
      { date: "17 Nov 25", type: "sale", amount: 30612, balance: 30612 },
      { date: "17 Nov 25", type: "collection", amount: 10000, balance: 20612 },
      { date: "03 Dec 25", type: "collection", amount: 7000, balance: 13612 },
      { date: "09 Dec 25", type: "collection", amount: 5000, balance: 8612 },
      { date: "09 Dec 25", type: "sale", amount: 40900, balance: 49512 },
      { date: "16 Dec 25", type: "collection", amount: 5000, balance: 44512 },
      { date: "23 Dec 25", type: "collection", amount: 5000, balance: 39512 },
      { date: "30 Dec 25", type: "collection", amount: 5000, balance: 34512 },
      { date: "06 Jan 26", type: "collection", amount: 3000, balance: 31512 },
      { date: "13 Jan 26", type: "collection", amount: 3000, balance: 28512 },
      { date: "21 Jan 26", type: "collection", amount: 3000, balance: 25512 },
      { date: "27 Jan 26", type: "collection", amount: 3000, balance: 22512 },
      { date: "03 Feb 26", type: "collection", amount: 4000, balance: 18512 },
      { date: "10 Feb 26", type: "sale", amount: 45163, balance: 63675 },
      { date: "10 Feb 26", type: "collection", amount: 7000, balance: 56675 },
      { date: "17 Feb 26", type: "collection", amount: 5000, balance: 51675 },
      { date: "24 Feb 26", type: "collection", amount: 5000, balance: 46675 },
    ]
  },
  {
    name: "PENIEL",
    totalSale: 32713, totalCollection: 26300, balance: 6413, balancePercent: 19.60,
    transactions: [
      { date: "17 Nov 25", type: "sale", amount: 24323, balance: 24323 },
      { date: "17 Nov 25", type: "collection", amount: 5000, balance: 19323 },
      { date: "27 Dec 25", type: "collection", amount: 5000, balance: 14323 },
      { date: "13 Jan 26", type: "collection", amount: 5000, balance: 9323 },
      { date: "27 Jan 26", type: "collection", amount: 4300, balance: 5023 },
      { date: "10 Feb 26", type: "sale", amount: 8390, balance: 13413 },
      { date: "10 Feb 26", type: "collection", amount: 4000, balance: 9413 },
      { date: "24 Feb 26", type: "collection", amount: 3000, balance: 6413 },
    ]
  },
  {
    name: "SN",
    totalSale: 11087, totalCollection: 11087, balance: 0, balancePercent: 0,
    transactions: [
      { date: "17 Nov 25", type: "sale", amount: 11087, balance: 11087 },
      { date: "17 Nov 25", type: "collection", amount: 6000, balance: 5087 },
      { date: "29 Nov 25", type: "collection", amount: 5087, balance: 0 },
    ]
  },
  {
    name: "PEACOCK",
    totalSale: 117039, totalCollection: 63000, balance: 54039, balancePercent: 46.17,
    transactions: [
      { date: "22 Nov 25", type: "sale", amount: 38432, balance: 38432 },
      { date: "24 Nov 25", type: "collection", amount: 18000, balance: 20432 },
      { date: "09 Dec 25", type: "collection", amount: 10000, balance: 10432 },
      { date: "09 Dec 25", type: "sale", amount: 41236, balance: 51668 },
      { date: "09 Dec 25", type: "return", amount: 393, balance: 51275 },
      { date: "27 Dec 25", type: "collection", amount: 10000, balance: 41275 },
      { date: "08 Jan 26", type: "sale", amount: 37764, balance: 79039 },
      { date: "21 Jan 26", type: "collection", amount: 15000, balance: 64039 },
      { date: "02 Feb 26", type: "collection", amount: 5000, balance: 59039 },
      { date: "07 Feb 26", type: "collection", amount: 5000, balance: 54039 },
    ]
  },
  {
    name: "A TO Z",
    totalSale: 7761, totalCollection: 7761, balance: 0, balancePercent: 0,
    transactions: [
      { date: "22 Nov 25", type: "sale", amount: 7761, balance: 7761 },
      { date: "22 Nov 25", type: "collection", amount: 7761, balance: 0 },
    ]
  },
  {
    name: "DEVANANDANAM",
    totalSale: 77727, totalCollection: 39000, balance: 38727, balancePercent: 49.82,
    transactions: [
      { date: "13 Dec 25", type: "sale", amount: 24237, balance: 24237 },
      { date: "13 Dec 25", type: "collection", amount: 10000, balance: 14237 },
      { date: "27 Dec 25", type: "collection", amount: 3000, balance: 11237 },
      { date: "27 Dec 25", type: "return", amount: 250, balance: 10987 },
      { date: "03 Jan 26", type: "collection", amount: 3000, balance: 7987 },
      { date: "08 Jan 26", type: "sale", amount: 3596, balance: 11583 },
      { date: "10 Jan 26", type: "collection", amount: 3000, balance: 8583 },
      { date: "17 Jan 26", type: "collection", amount: 2000, balance: 6583 },
      { date: "06 Feb 26", type: "sale", amount: 31269, balance: 37852 },
      { date: "07 Feb 26", type: "collection", amount: 5000, balance: 32852 },
      { date: "09 Feb 26", type: "sale", amount: 16869, balance: 49721 },
      { date: "14 Feb 26", type: "collection", amount: 10000, balance: 39721 },
      { date: "17 Feb 26", type: "sale", amount: 2648, balance: 42369 },
      { date: "21 Feb 26", type: "collection", amount: 3000, balance: 39369 },
      { date: "21 Feb 26", type: "return", amount: 642, balance: 38727 },
    ]
  },
  {
    name: "DREAMS",
    totalSale: 6221, totalCollection: 6221, balance: 0, balancePercent: 0,
    transactions: [
      { date: "12 Dec 25", type: "sale", amount: 6221, balance: 6221 },
      { date: "12 Dec 25", type: "collection", amount: 3000, balance: 3221 },
      { date: "28 Dec 25", type: "collection", amount: 1500, balance: 1721 },
      { date: "03 Jan 26", type: "collection", amount: 1721, balance: 0 },
    ]
  },
  {
    name: "GOKULAM",
    totalSale: 6458, totalCollection: 6458, balance: 0, balancePercent: 0,
    transactions: [
      { date: "12 Dec 25", type: "sale", amount: 6458, balance: 6458 },
      { date: "12 Dec 25", type: "collection", amount: 3000, balance: 3458 },
      { date: "27 Dec 25", type: "collection", amount: 3458, balance: 0 },
    ]
  },
  {
    name: "AJMAL",
    totalSale: 20194, totalCollection: 14000, balance: 6194, balancePercent: 30.67,
    transactions: [
      { date: "16 Dec 25", type: "sale", amount: 15653, balance: 15653 },
      { date: "22 Dec 25", type: "collection", amount: 5000, balance: 10653 },
      { date: "30 Dec 25", type: "collection", amount: 5000, balance: 5653 },
      { date: "12 Jan 26", type: "collection", amount: 4000, balance: 1653 },
      { date: "13 Feb 26", type: "sale", amount: 4541, balance: 6194 },
    ]
  },
  {
    name: "GALAXY",
    totalSale: 70109, totalCollection: 14000, balance: 56109, balancePercent: 80.03,
    transactions: [
      { date: "08 Jan 26", type: "sale", amount: 14134, balance: 14134 },
      { date: "23 Jan 26", type: "collection", amount: 8000, balance: 6134 },
      { date: "15 Feb 26", type: "collection", amount: 6000, balance: 134 },
      { date: "18 Feb 26", type: "sale", amount: 55975, balance: 56109 },
    ]
  },
  {
    name: "UTSAV",
    totalSale: 25795, totalCollection: 9008, balance: 16787, balancePercent: 65.08,
    transactions: [
      { date: "08 Jan 26", type: "sale", amount: 9008, balance: 9008 },
      { date: "11 Feb 26", type: "sale", amount: 16787, balance: 25795 },
      { date: "18 Feb 26", type: "collection", amount: 9008, balance: 16787 },
    ]
  },
  {
    name: "ROCK AND STYLE",
    totalSale: 132880, totalCollection: 39000, balance: 93880, balancePercent: 70.65,
    transactions: [
      { date: "12 Jan 26", type: "sale", amount: 65584, balance: 65584 },
      { date: "12 Jan 26", type: "collection", amount: 25000, balance: 40584 },
      { date: "30 Jan 26", type: "collection", amount: 2000, balance: 38584 },
      { date: "05 Feb 26", type: "collection", amount: 2000, balance: 36584 },
      { date: "11 Feb 26", type: "sale", amount: 68279, balance: 104863 },
      { date: "11 Feb 26", type: "return", amount: 983, balance: 103880 },
      { date: "14 Feb 26", type: "collection", amount: 5000, balance: 98880 },
      { date: "20 Feb 26", type: "collection", amount: 5000, balance: 93880 },
    ]
  },
  {
    name: "BEAUTY",
    totalSale: 3285, totalCollection: 3285, balance: 0, balancePercent: 0,
    transactions: []
  },
  {
    name: "BOND TAILORING",
    totalSale: 2540, totalCollection: 2540, balance: 0, balancePercent: 0,
    transactions: [
      { date: "12 Jan 26", type: "sale", amount: 2540, balance: 2540 },
      { date: "04 Feb 26", type: "collection", amount: 2540, balance: 0 },
    ]
  },
  {
    name: "SG FABRICS",
    totalSale: 50032, totalCollection: 11000, balance: 39032, balancePercent: 78.01,
    transactions: [
      { date: "15 Jan 26", type: "sale", amount: 50032, balance: 50032 },
      { date: "15 Jan 26", type: "collection", amount: 1000, balance: 49032 },
      { date: "26 Feb 26", type: "collection", amount: 10000, balance: 39032 },
    ]
  },
  {
    name: "LALJI, ODN",
    totalSale: 15748, totalCollection: 5500, balance: 10248, balancePercent: 65.07,
    transactions: [
      { date: "17 Jan 26", type: "sale", amount: 15748, balance: 15748 },
      { date: "28 Jan 26", type: "collection", amount: 2500, balance: 13248 },
      { date: "07 Feb 26", type: "collection", amount: 1000, balance: 12248 },
      { date: "14 Feb 26", type: "collection", amount: 1000, balance: 11248 },
      { date: "23 Feb 26", type: "collection", amount: 1000, balance: 10248 },
    ]
  },
  {
    name: "MPS, PTZY",
    totalSale: 15326, totalCollection: 15000, balance: 326, balancePercent: 2.13,
    transactions: [
      { date: "05 Feb 26", type: "sale", amount: 15326, balance: 15326 },
      { date: "05 Feb 26", type: "collection", amount: 8000, balance: 7326 },
      { date: "06 Feb 26", type: "collection", amount: 7000, balance: 326 },
    ]
  },
  {
    name: "FUERA BTQ, MNNR",
    totalSale: 22277, totalCollection: 0, balance: 22277, balancePercent: 100.0,
    transactions: [
      { date: "11 Feb 26", type: "sale", amount: 22277, balance: 22277 },
    ]
  },
  {
    name: "COLOURS BHKV",
    totalSale: 25159, totalCollection: 0, balance: 25159, balancePercent: 100.0,
    transactions: [
      { date: "19 Feb 26", type: "sale", amount: 25159, balance: 25159 },
    ]
  },
  {
    name: "ORCHID FASHION HUB, MNPLY",
    totalSale: 19069, totalCollection: 0, balance: 19069, balancePercent: 100.0,
    transactions: [
      { date: "19 Feb 26", type: "sale", amount: 19069, balance: 19069 },
    ]
  },
  {
    name: "KIDS ZONE, NRD",
    totalSale: 8779, totalCollection: 0, balance: 8779, balancePercent: 100.0,
    transactions: [
      { date: "25 Feb 26", type: "sale", amount: 8779, balance: 8779 },
    ]
  },
];

export const getTotalSale = () => clientsData.reduce((s, c) => s + c.totalSale, 0);
export const getTotalCollection = () => clientsData.reduce((s, c) => s + c.totalCollection, 0);
export const getTotalBalance = () => clientsData.reduce((s, c) => s + c.balance, 0);
export const getOverallBalancePercent = () => {
  const sale = getTotalSale();
  return sale > 0 ? ((getTotalBalance() / sale) * 100) : 0;
};
