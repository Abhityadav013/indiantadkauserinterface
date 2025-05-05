export type MenuItem = {
  id: string;
  itemName: string;
  imageURL: string;
  price: number;
  description: string;
  category: string;
  isDelivery: boolean;
  tags: string[]; // Optional property
};

export type FilteredMenuItem = {
  menu_name: string;
  menu_image: string;
};

export type GroupedMenu = {
  menu_name: string;
  menu_image: string;
  items: MenuItem[];
};
