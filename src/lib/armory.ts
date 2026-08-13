// Armory Wall — Active Cores. Groups tracked revision chapters into the four
// core columns rendered on the Overview tab and PDF Page 1.
import { getAllItems, type RevisionItem } from "@/lib/revision-engine";

export type ArmoryGroupKey = "t1" | "t2" | "t3" | "t4" | "t5";

export type ArmoryGroup = {
  key: ArmoryGroupKey;
  label: string;
  tiers: RevisionItem["tier"][];
  color: string;
  glow: string;
  entries: { name: string; count: number }[];
};

export const ARMORY_GROUPS: Omit<ArmoryGroup, "entries">[] = [
  { key: "t1", label: "Tier I · Bronze", tiers: [1], color: "#CD7F32", glow: "rgba(205,127,50,0.55)" },
  { key: "t2", label: "Tier II · Iron", tiers: [2], color: "#B0B4BC", glow: "rgba(176,180,188,0.55)" },
  { key: "t3", label: "Tier III · Steel", tiers: [3], color: "#38BDF8", glow: "rgba(56,189,248,0.6)" },
  { key: "t4", label: "Tier IV · Titanium", tiers: [4], color: "#E2E8F0", glow: "rgba(226,232,240,0.6)" },
  { key: "t5", label: "Tier V · Platinum", tiers: [5], color: "#F5F3FF", glow: "rgba(245,243,255,0.65)" },
];


/**
 * Build the 5 tier columns with de-duplicated topic subtext (name x loops).
 *
 * Zero-tier rule: a chapter only appears on the wall once it has actually
 * CLAIMED a badge in the Library (`displayTier` is set). Unrevised chapters
 * are never bucketed into Bronze (or any other tier) by default.
 *
 * Multiplier: mirrors the Library shield — `displayLoopCount + 1` is the
 * number of completed recall loops for the displayed badge.
 */
export function buildArmoryGroups(): ArmoryGroup[] {
  const chapters = getAllItems().filter(
    (c) => !c.paused && c.displayTier != null,
  );
  const libraryTier = (c: RevisionItem): RevisionItem["tier"] =>
    c.displayTier as RevisionItem["tier"];
  return ARMORY_GROUPS.map((g) => {
    const items = chapters.filter((c) => g.tiers.includes(libraryTier(c)));
    const counts = new Map<string, number>();
    items.forEach((c) => {
      const loops = Math.max(1, (c.displayLoopCount ?? 0) + 1);
      counts.set(c.name, Math.max(counts.get(c.name) ?? 0, loops));
    });
    return {
      ...g,
      entries: Array.from(counts.entries()).map(([name, count]) => ({ name, count })),
    };
  });
}
