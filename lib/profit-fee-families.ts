/**
 * Fee families for the Profit Analytics "Amazon fees" drill-down. Mirrors FEE_FAMILIES in
 * LaLaGreen-Daily-Report's reportlib/feetypes.py -- keep the two in sync. Plain module (not
 * "use server") so client components can import it.
 */
export interface FeeFamilyDef {
  family: string;
  types: string[];
}

export const FEE_FAMILIES: FeeFamilyDef[] = [
  {
    family: "Selling & Referral",
    types: [
      "Referral Fee",
      "Refund Administration Fee",
      "Shipping & Gift-Wrap Chargeback",
      "Variable Closing Fee",
      "Per-Item Selling Fee",
      "Subscription Fee",
      "High-Volume Listing Fee",
    ],
  },
  {
    family: "Fulfillment",
    types: [
      "FBA Fulfillment Fee",
      "FBA Inbound Placement Service Fee",
      "Inbound Defect Fee",
      "Multi-Channel Distribution Fee",
      "Special Handling Fee",
      "Unplanned Service Fee",
    ],
  },
  {
    family: "Storage & Inventory",
    types: [
      "Monthly Inventory Storage Fee",
      "Aged Inventory Surcharge",
      "Low Inventory Fee",
      "AWD Processing Fee",
      "AWD Storage Fee",
      "AWD Transportation Fee",
    ],
  },
  {
    family: "Returns & Recovery",
    types: [
      "Returns Processing Fee",
      "FBA Removal Order Fee",
      "FBA Disposal Fee",
      "Grade & Resell Fee",
      "Restocking Fee",
      "Liquidations Brokerage Fee",
      "Reimbursement",
      "Reversed Reimbursement",
      "Donation Write-Off",
    ],
  },
  {
    family: "Promotions & Services",
    types: [
      "Promo Rebate",
      "Coupon Redemption Fee",
      "Deal & Coupon Fees",
      "Vine Enrollment Fee",
      "Premium & Paid Services Fee",
      "Sourcing Cost",
    ],
  },
  {
    family: "Tax & Uncategorized",
    types: ["Tax Withholding", "Other Fee"],
  },
];

/** Family for a fee type; anything unrecognized lands under Tax & Uncategorized. */
export function familyOfFeeType(feeType: string): string {
  return (
    FEE_FAMILIES.find((f) => f.types.includes(feeType))?.family ??
    "Tax & Uncategorized"
  );
}
