import { MenuItem } from '../types/menu_type';

export interface IMenuTransformed {
  items: MenuItem[]; // The item ID associated with the category
  order: number;
  categoryName:string,
  isExpandable: boolean; // Whether this item is in the first category (order === 1)
}
