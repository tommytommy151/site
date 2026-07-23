import type { Category } from "@/types/product";

export interface CategoryTreeNode {
  category: Category;
  depth: number;
}

export function flattenCategoryTree(categories: Category[]): CategoryTreeNode[] {
  const byParent = new Map<string | null, Category[]>();
  for (const category of categories) {
    const key = category.parentId ?? null;
    byParent.set(key, [...(byParent.get(key) ?? []), category]);
  }
  const result: CategoryTreeNode[] = [];
  function visit(parentId: string | null, depth: number) {
    for (const category of byParent.get(parentId) ?? []) {
      result.push({ category, depth });
      visit(category.id, depth + 1);
    }
  }
  visit(null, 0);
  return result;
}

// The deepest selected node (e.g. the subcategory over its parents) is the
// most specific one, so it's what breadcrumbs/search should treat as primary.
export function pickPrimaryCategory(
  categoryTree: CategoryTreeNode[],
  selectedSlugs: string[],
): Category | undefined {
  return categoryTree
    .filter((node) => selectedSlugs.includes(node.category.slug))
    .sort((a, b) => b.depth - a.depth)[0]?.category;
}
