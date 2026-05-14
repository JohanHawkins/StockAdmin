import { Injectable } from '@angular/core';

import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products: Product[] = [
    {
      code: 'P001',
      name: 'Mouse Gamer',
      price: 80,
      stock: 10,
      status: 'Activo'
    },
    {
      code: 'P002',
      name: 'Teclado Mecánico',
      price: 150,
      stock: 5,
      status: 'Activo'
    }
  ];

  getProducts(): Product[]{

    return this.products;
  }

  addProduct(product: Product): void{

    this.products.push(product);
  }

  updateProduct(index: number, product: Product): void{

    this.products[index] = product;
  }

  deleteProduct(index: number): void{

    this.products.splice(index, 1);
  }

}