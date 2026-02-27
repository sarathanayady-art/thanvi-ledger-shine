export interface RetailSale {
  date: string;
  shopName: string;
  itemCode: string;
  qty: number;
  sellingPrice: number;
  discount: number;
  totalAmount: number;
  paymentStatus: 'DONE' | 'PENDING';
  progressiveTotal: number;
}

export const retailSalesData: RetailSale[] = [
  { date: "10 Nov 25", shopName: "BABUKUTTAN", itemCode: "L15", qty: 1, sellingPrice: 700, discount: 0, totalAmount: 700, paymentStatus: "DONE", progressiveTotal: 700 },
  { date: "10 Nov 25", shopName: "BABUKUTTAN", itemCode: "K05", qty: 1, sellingPrice: 350, discount: 0, totalAmount: 350, paymentStatus: "DONE", progressiveTotal: 1050 },
  { date: "10 Nov 25", shopName: "BABUKUTTAN", itemCode: "K04", qty: 1, sellingPrice: 350, discount: 0, totalAmount: 350, paymentStatus: "DONE", progressiveTotal: 1400 },
  { date: "10 Nov 25", shopName: "SALINI", itemCode: "L14", qty: 1, sellingPrice: 599, discount: 0, totalAmount: 599, paymentStatus: "DONE", progressiveTotal: 1999 },
  { date: "10 Nov 25", shopName: "SALINI", itemCode: "L02", qty: 1, sellingPrice: 599, discount: 0, totalAmount: 599, paymentStatus: "DONE", progressiveTotal: 2598 },
  { date: "11 Nov 25", shopName: "AJESH", itemCode: "L05", qty: 6, sellingPrice: 190, discount: 0, totalAmount: 1140, paymentStatus: "DONE", progressiveTotal: 3738 },
  { date: "13 Nov 25", shopName: "VIMAL", itemCode: "L01", qty: 1, sellingPrice: 499, discount: 0, totalAmount: 499, paymentStatus: "DONE", progressiveTotal: 4237 },
  { date: "15 Nov 25", shopName: "SHYNI", itemCode: "L02", qty: 1, sellingPrice: 550, discount: 0, totalAmount: 550, paymentStatus: "DONE", progressiveTotal: 4787 },
  { date: "20 Nov 25", shopName: "MEENU", itemCode: "L09", qty: 1, sellingPrice: 449, discount: 0, totalAmount: 449, paymentStatus: "DONE", progressiveTotal: 5236 },
  { date: "28 Nov 25", shopName: "SHOBHA", itemCode: "L07", qty: 1, sellingPrice: 670, discount: 0, totalAmount: 670, paymentStatus: "DONE", progressiveTotal: 5906 },
  { date: "28 Nov 25", shopName: "VISHNU", itemCode: "K11", qty: 1, sellingPrice: 285, discount: 0, totalAmount: 285, paymentStatus: "DONE", progressiveTotal: 6191 },
  { date: "30 Nov 25", shopName: "SREELEKHA", itemCode: "L02", qty: 1, sellingPrice: 550, discount: 0, totalAmount: 550, paymentStatus: "DONE", progressiveTotal: 6741 },
  { date: "04 Dec 25", shopName: "PINKY", itemCode: "K69", qty: 1, sellingPrice: 599, discount: 50, totalAmount: 549, paymentStatus: "DONE", progressiveTotal: 7290 },
  { date: "04 Dec 25", shopName: "SAUMYA", itemCode: "L39", qty: 1, sellingPrice: 545, discount: 25, totalAmount: 520, paymentStatus: "DONE", progressiveTotal: 7810 },
  { date: "04 Dec 25", shopName: "SAUMYA", itemCode: "L38", qty: 1, sellingPrice: 633, discount: 25, totalAmount: 608, paymentStatus: "DONE", progressiveTotal: 8418 },
  { date: "06 Dec 25", shopName: "SREEREKHA", itemCode: "L26", qty: 1, sellingPrice: 650, discount: 50, totalAmount: 600, paymentStatus: "PENDING", progressiveTotal: 9018 },
  { date: "06 Dec 25", shopName: "SALINI", itemCode: "L33", qty: 1, sellingPrice: 715, discount: 100, totalAmount: 615, paymentStatus: "DONE", progressiveTotal: 9633 },
  { date: "06 Dec 25", shopName: "SALINI", itemCode: "L35", qty: 1, sellingPrice: 875, discount: 100, totalAmount: 775, paymentStatus: "DONE", progressiveTotal: 10408 },
  { date: "06 Dec 25", shopName: "SHOBHA", itemCode: "L45", qty: 1, sellingPrice: 322, discount: 100, totalAmount: 222, paymentStatus: "DONE", progressiveTotal: 10630 },
  { date: "06 Dec 25", shopName: "SHOBHA-FRIEND", itemCode: "L44", qty: 2, sellingPrice: 665, discount: 30, totalAmount: 1300, paymentStatus: "DONE", progressiveTotal: 11930 },
  { date: "06 Dec 25", shopName: "AROMAL", itemCode: "K38", qty: 1, sellingPrice: 349, discount: 49, totalAmount: 300, paymentStatus: "DONE", progressiveTotal: 12230 },
  { date: "14 Dec 25", shopName: "USHA", itemCode: "L42", qty: 1, sellingPrice: 270, discount: 0, totalAmount: 270, paymentStatus: "DONE", progressiveTotal: 12500 },
  { date: "21 Dec 25", shopName: "AKHIL", itemCode: "K40", qty: 2, sellingPrice: 315, discount: 60, totalAmount: 570, paymentStatus: "DONE", progressiveTotal: 13070 },
  { date: "22 Dec 25", shopName: "SREELEKHA", itemCode: "K40", qty: 1, sellingPrice: 315, discount: 35, totalAmount: 280, paymentStatus: "PENDING", progressiveTotal: 13350 },
  { date: "22 Dec 25", shopName: "GEETA", itemCode: "L43", qty: 1, sellingPrice: 549, discount: 19, totalAmount: 530, paymentStatus: "DONE", progressiveTotal: 13880 },
  { date: "23 Dec 25", shopName: "SOUMYA", itemCode: "K99", qty: 2, sellingPrice: 249, discount: 78, totalAmount: 420, paymentStatus: "DONE", progressiveTotal: 14300 },
  { date: "23 Dec 25", shopName: "SOUMYA", itemCode: "K98", qty: 1, sellingPrice: 249, discount: 39, totalAmount: 210, paymentStatus: "DONE", progressiveTotal: 14510 },
  { date: "23 Dec 25", shopName: "SOUMYA", itemCode: "K53", qty: 1, sellingPrice: 249, discount: 39, totalAmount: 210, paymentStatus: "DONE", progressiveTotal: 14720 },
  { date: "23 Dec 25", shopName: "SOUMYA", itemCode: "K105", qty: 1, sellingPrice: 355, discount: 45, totalAmount: 310, paymentStatus: "DONE", progressiveTotal: 15030 },
  { date: "06 Jan 26", shopName: "SREEREKHA", itemCode: "K114", qty: 1, sellingPrice: 650, discount: 50, totalAmount: 600, paymentStatus: "DONE", progressiveTotal: 15630 },
  { date: "06 Jan 26", shopName: "SREEREKHA", itemCode: "L50", qty: 1, sellingPrice: 350, discount: 50, totalAmount: 300, paymentStatus: "DONE", progressiveTotal: 15930 },
  { date: "06 Jan 26", shopName: "SUDHA", itemCode: "K116", qty: 1, sellingPrice: 600, discount: 50, totalAmount: 550, paymentStatus: "DONE", progressiveTotal: 16480 },
  { date: "07 Jan 26", shopName: "SUJA", itemCode: "L07", qty: 1, sellingPrice: 690, discount: 0, totalAmount: 690, paymentStatus: "DONE", progressiveTotal: 17170 },
  { date: "02 Feb 26", shopName: "RAJESH", itemCode: "T10", qty: 1, sellingPrice: 525, discount: 0, totalAmount: 525, paymentStatus: "DONE", progressiveTotal: 17695 },
  { date: "02 Feb 26", shopName: "RAJESH", itemCode: "T09", qty: 1, sellingPrice: 515, discount: 0, totalAmount: 515, paymentStatus: "DONE", progressiveTotal: 18210 },
  { date: "02 Feb 26", shopName: "RAJESH", itemCode: "K33", qty: 1, sellingPrice: 315, discount: 150, totalAmount: 165, paymentStatus: "DONE", progressiveTotal: 18375 },
  { date: "03 Feb 26", shopName: "ANILA GYM", itemCode: "T11", qty: 0, sellingPrice: 0, discount: 0, totalAmount: 0, paymentStatus: "DONE", progressiveTotal: 18375 },
  { date: "03 Feb 26", shopName: "ANILA GYM", itemCode: "K136", qty: 1, sellingPrice: 470, discount: 0, totalAmount: 470, paymentStatus: "DONE", progressiveTotal: 18845 },
  { date: "03 Feb 26", shopName: "ANILA GYM", itemCode: "K129", qty: 1, sellingPrice: 500, discount: 0, totalAmount: 500, paymentStatus: "DONE", progressiveTotal: 19345 },
  { date: "03 Feb 26", shopName: "ANILA GYM", itemCode: "K142", qty: 1, sellingPrice: 285, discount: 50, totalAmount: 235, paymentStatus: "DONE", progressiveTotal: 19580 },
  { date: "11 Feb 26", shopName: "RAJESH", itemCode: "K122", qty: 1, sellingPrice: 575, discount: 0, totalAmount: 575, paymentStatus: "DONE", progressiveTotal: 20155 },
  { date: "11 Feb 26", shopName: "RAJESH", itemCode: "K130", qty: 1, sellingPrice: 400, discount: 0, totalAmount: 400, paymentStatus: "DONE", progressiveTotal: 20555 },
  { date: "15 Feb 26", shopName: "ANILA GYM", itemCode: "T13", qty: 1, sellingPrice: 490, discount: 10, totalAmount: 480, paymentStatus: "DONE", progressiveTotal: 21035 },
  { date: "15 Feb 26", shopName: "ANILA GYM", itemCode: "L65", qty: 1, sellingPrice: 607, discount: 7, totalAmount: 600, paymentStatus: "DONE", progressiveTotal: 21635 },
  { date: "15 Feb 26", shopName: "ANILA GYM", itemCode: "L53", qty: 1, sellingPrice: 952, discount: 2, totalAmount: 950, paymentStatus: "DONE", progressiveTotal: 22585 },
  { date: "15 Feb 26", shopName: "ANILA GYM", itemCode: "L98", qty: 1, sellingPrice: 462, discount: 2, totalAmount: 460, paymentStatus: "DONE", progressiveTotal: 23045 },
  { date: "18 Feb 26", shopName: "SHIBI GYM", itemCode: "L76", qty: 1, sellingPrice: 452, discount: 42, totalAmount: 410, paymentStatus: "DONE", progressiveTotal: 23455 },
  { date: "18 Feb 26", shopName: "SHIBI GYM", itemCode: "L24", qty: 2, sellingPrice: 800, discount: 160, totalAmount: 1440, paymentStatus: "DONE", progressiveTotal: 24895 },
  { date: "18 Feb 26", shopName: "SHIBI GYM", itemCode: "L34", qty: 1, sellingPrice: 550, discount: 20, totalAmount: 530, paymentStatus: "DONE", progressiveTotal: 25425 },
  { date: "21 Feb 26", shopName: "ANILA", itemCode: "L79", qty: 0, sellingPrice: 622, discount: 0, totalAmount: 0, paymentStatus: "DONE", progressiveTotal: 25425 },
  { date: "21 Feb 26", shopName: "BIJU", itemCode: "K93", qty: 2, sellingPrice: 249, discount: 118, totalAmount: 380, paymentStatus: "DONE", progressiveTotal: 25805 },
  { date: "21 Feb 26", shopName: "BIJU", itemCode: "K98", qty: 2, sellingPrice: 249, discount: 98, totalAmount: 400, paymentStatus: "DONE", progressiveTotal: 26205 },
  { date: "22 Feb 26", shopName: "SALINI", itemCode: "L99", qty: 1, sellingPrice: 492, discount: 100, totalAmount: 392, paymentStatus: "PENDING", progressiveTotal: 26597 },
  { date: "22 Feb 26", shopName: "SALINI", itemCode: "L67", qty: 1, sellingPrice: 490, discount: 100, totalAmount: 390, paymentStatus: "PENDING", progressiveTotal: 26987 },
  { date: "22 Feb 26", shopName: "SALINI", itemCode: "L56", qty: 1, sellingPrice: 292, discount: 100, totalAmount: 192, paymentStatus: "PENDING", progressiveTotal: 27179 },
  { date: "22 Feb 26", shopName: "SOUMYA", itemCode: "K125", qty: 1, sellingPrice: 399, discount: 10, totalAmount: 389, paymentStatus: "PENDING", progressiveTotal: 27568 },
  { date: "22 Feb 26", shopName: "SOUMYA", itemCode: "T13", qty: 1, sellingPrice: 475, discount: 10, totalAmount: 465, paymentStatus: "PENDING", progressiveTotal: 28033 },
  { date: "22 Feb 26", shopName: "SOUMYA", itemCode: "L65", qty: 1, sellingPrice: 607, discount: 10, totalAmount: 597, paymentStatus: "PENDING", progressiveTotal: 28630 },
  { date: "23 Feb 26", shopName: "ANILA", itemCode: "T01", qty: 1, sellingPrice: 345, discount: 25, totalAmount: 320, paymentStatus: "DONE", progressiveTotal: 28950 },
  { date: "23 Feb 26", shopName: "ANILA", itemCode: "K129", qty: 1, sellingPrice: 500, discount: 10, totalAmount: 490, paymentStatus: "DONE", progressiveTotal: 29440 },
];

export const RETAIL_TOTAL = 29440;

export const getRetailByMonth = () => {
  const months: Record<string, number> = {};
  retailSalesData.forEach(r => {
    const parts = r.date.split(' ');
    const key = `${parts[1]} ${parts[2]}`;
    months[key] = (months[key] || 0) + r.totalAmount;
  });
  return months;
};
