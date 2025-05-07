export interface Cart {
    itemId:string,
    itemName:string,
    quantity:number
}

export interface CartDescription{
    itemId:string;
    description:string
}

export interface CartItem{
    cart:CartItem[]
}
