export type MenuItem = {
  id: string;
  name: string;
  imageURL: string;
  price: number;
  description: string;
  category:{
    id:string,
    order:number
  };
  isDelivery: boolean;
};

export type MenuCategoryItem = {
  categoryId:string
  categoryName: string;
  categoryImage: string;
};

export type GroupedMenu = {
  menu_name: string;
  menu_image: string;
  items: MenuItem[];
};
