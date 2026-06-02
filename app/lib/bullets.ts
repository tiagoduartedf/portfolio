/**
 * A bullet that ends in ":" is an intro line, not a real list item: it
 * announces the items that follow. Themes render `intro` as a muted
 * standalone line and `items` as a real bulleted list underneath.
 */
export type BulletGroup = { intro?: string; items: string[] };

export function isBulletIntro(b: string): boolean {
  return b.trimEnd().endsWith(":");
}

export function groupBullets(bullets: string[]): BulletGroup[] {
  const groups: BulletGroup[] = [];
  let current: BulletGroup = { items: [] };
  for (const b of bullets) {
    if (isBulletIntro(b)) {
      if (current.intro || current.items.length > 0) groups.push(current);
      current = { intro: b, items: [] };
    } else {
      current.items.push(b);
    }
  }
  if (current.intro || current.items.length > 0) groups.push(current);
  return groups;
}
