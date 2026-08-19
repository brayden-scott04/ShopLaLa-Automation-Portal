import ExcelJS from "exceljs";
import { CANONICAL_SLOTS, computeRunningTotals } from "@/lib/ppc-daily-cap-constants";

export interface DailyCapExportRow {
  slot_time: string;
  amount: number;
}

// Light yellow — marks a slot where the budget cap changes from the one before it.
const CHANGE_FILL = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFFFF59D" },
} as const;

function to12Hour(slot: string): string {
  const [hStr, minute] = slot.split(":");
  const hour = Number(hStr);
  const period = hour < 12 ? "am" : "pm";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute}${period}`;
}

/**
 * Builds the Daily Budget Cap export for one country/marketplace. Running
 * totals are computed via computeRunningTotals (reset-time-relative
 * accumulation), then displayed in plain midnight order — matching exactly
 * how the on-page table itself computes and re-sorts its rows, so the
 * exported numbers never disagree with what staff see on screen.
 */
export async function buildDailyCapExport(
  countryCode: string,
  resetTime: string,
  rows: DailyCapExportRow[]
): Promise<Buffer> {
  const amounts: Record<string, number> = {};
  for (const row of rows) amounts[row.slot_time] = row.amount;

  const runningTotalsBySlot = new Map(
    computeRunningTotals(amounts, resetTime).map((r) => [r.slot, r.runningTotal])
  );

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(`${countryCode} Daily Budget Cap`);
  sheet.columns = [
    { header: "Slot", key: "slot", width: 12 },
    { header: "Amount ($)", key: "amount", width: 14 },
    { header: "Running total", key: "runningTotal", width: 16 },
  ];
  sheet.getRow(1).font = { bold: true };

  let total = 0;
  let previousAmount: number | null = null;
  for (const slot of CANONICAL_SLOTS) {
    const amount = amounts[slot] ?? 0;
    const runningTotal = runningTotalsBySlot.get(slot) ?? 0;
    total += amount;

    const row = sheet.addRow({ slot: to12Hour(slot), amount, runningTotal });
    if (previousAmount !== null && amount !== previousAmount) {
      row.eachCell((cell) => {
        cell.fill = CHANGE_FILL;
      });
    }
    previousAmount = amount;
  }

  const totalRow = sheet.addRow({ slot: "Total", amount: total, runningTotal: null });
  totalRow.font = { bold: true };
  totalRow.eachCell((cell) => {
    cell.border = { top: { style: "thin" } };
  });

  sheet.getColumn("amount").numFmt = '"$"#,##0.00';
  sheet.getColumn("runningTotal").numFmt = '"$"#,##0.00';

  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}
