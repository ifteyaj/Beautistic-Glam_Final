export const CATEGORIES = ['Face', 'Body', 'Hair', 'Skincare', 'Makeup', 'Sets'] as const;
export type Category = typeof CATEGORIES[number];