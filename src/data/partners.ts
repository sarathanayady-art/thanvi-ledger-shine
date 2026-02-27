export interface PartnerShare {
  date: string;
  partner: string;
  amount: number;
}

export interface Partner {
  name: string;
  shortName: string;
}

export const partners: Partner[] = [
  { name: "VISHNU", shortName: "VISH" },
  { name: "SARATH", shortName: "SPV" },
];

export const shareHistory: PartnerShare[] = [
  { date: "03 Dec 25", partner: "VISHNU", amount: 32349.5 },
  { date: "03 Dec 25", partner: "SARATH", amount: 32349.5 },
  { date: "30 Dec 25", partner: "VISHNU", amount: 41568.5 },
  { date: "30 Dec 25", partner: "SARATH", amount: 41568.5 },
  { date: "31 Jan 26", partner: "VISHNU", amount: 49473 },
  { date: "31 Jan 26", partner: "SARATH", amount: 49473 },
];

export const RETAIL_TOTAL = 29440;

export const getTotalSharePerPartner = (partnerName: string) =>
  shareHistory.filter(s => s.partner === partnerName).reduce((sum, s) => sum + s.amount, 0);

export const getCurrentBalance = () => {
  // Total Collection 372600 + Retail 29440 - shares taken
  // Based on provided data: Current Balance = 125818
  return 125818;
};
