/**
 * Category color palette
 * Used consistently across the application for category visualization
 */
export const CATEGORY_COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
] as const;

/**
 * Get a color for a category based on its ID
 * @param id - Category ID
 * @returns Hex color string
 */
export const getCategoryColor = (id: number): string => {
  return CATEGORY_COLORS[id % CATEGORY_COLORS.length];
};
