/**
 * Where a new SKU belongs in the hand-ordered master list. Plain module (not "use server")
 * so the Pull-from-Amazon preview and the server write share one placement rule.
 *
 * A SKU's group is its leading run of capital letters: "PHW90x2-0123" → "PHW",
 * "GFMJx25-0126U" → "GFMJ" (the lowercase x is a size separator), "WPCSet3A" → "WPCS".
 */
export function skuPrefix(sku: string): string {
  const upper = sku.match(/^[A-Z]+/)?.[0];
  if (upper) return upper;
  return (sku.match(/^[A-Za-z]+/)?.[0] ?? "").toUpperCase();
}

function sharedLength(a: string, b: string): number {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

const naturalCompare = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

/** Shortest shared prefix that still counts as "the same family" when no group matches exactly. */
const MIN_SHARED_PREFIX = 2;

export interface InsertionPlan {
  /** Every SKU, existing and new, in its final top-to-bottom order. */
  order: string[];
  /** New SKU → the existing SKU it lands directly below (its group's last row), or null = appended at the end. */
  anchors: Map<string, string | null>;
}

/**
 * Slot `incoming` SKUs into `existing` (already in position order) without moving existing rows
 * relative to each other. Each new SKU goes after the LAST existing row of its prefix group; with
 * no exact group, after the group sharing the longest prefix (≥ 2 letters, e.g. a new "PHWH" joins
 * "PHW"); otherwise at the end, grouped alphabetically. Several new SKUs at one spot are sorted
 * naturally among themselves. SKUs already in `existing` are ignored.
 */
export function planInsertions(existing: string[], incoming: string[]): InsertionPlan {
  const existingSet = new Set(existing);
  const fresh = [...new Set(incoming.map((s) => s.trim()).filter(Boolean))].filter(
    (s) => !existingSet.has(s)
  );

  const lastIndexByPrefix = new Map<string, number>();
  existing.forEach((sku, i) => {
    const p = skuPrefix(sku);
    if (p) lastIndexByPrefix.set(p, i);
  });

  function anchorIndex(prefix: string): number | null {
    if (!prefix) return null;
    const exact = lastIndexByPrefix.get(prefix);
    if (exact !== undefined) return exact;

    let best: { shared: number; length: number; index: number } | null = null;
    for (const [p, index] of lastIndexByPrefix) {
      const shared = sharedLength(prefix, p);
      if (shared < MIN_SHARED_PREFIX) continue;
      // Longest shared run wins; on a tie prefer the group fully contained in the new prefix
      // (shorter), then the one further down the list.
      if (
        !best ||
        shared > best.shared ||
        (shared === best.shared && p.length < best.length) ||
        (shared === best.shared && p.length === best.length && index > best.index)
      ) {
        best = { shared, length: p.length, index };
      }
    }
    return best?.index ?? null;
  }

  const buckets = new Map<number, string[]>();
  const tail: string[] = [];
  const anchors = new Map<string, string | null>();
  for (const sku of fresh) {
    const index = anchorIndex(skuPrefix(sku));
    if (index === null) {
      tail.push(sku);
      anchors.set(sku, null);
    } else {
      const bucket = buckets.get(index) ?? [];
      bucket.push(sku);
      buckets.set(index, bucket);
      anchors.set(sku, existing[index]);
    }
  }

  const order: string[] = [];
  existing.forEach((sku, i) => {
    order.push(sku);
    const bucket = buckets.get(i);
    if (bucket) order.push(...bucket.sort(naturalCompare));
  });
  tail.sort((a, b) => naturalCompare(skuPrefix(a), skuPrefix(b)) || naturalCompare(a, b));
  order.push(...tail);

  return { order, anchors };
}
