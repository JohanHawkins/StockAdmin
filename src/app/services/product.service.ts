import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products = [
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

  getProducts(){
    return this.products;
  }

  addProduct(product: any){

    this.products.push(product);
  }

  updateProduct(index: number, product: any){

    this.products[index] = product;
  }

  deleteProduct(index: number){

    this.products.splice(index, 1);
  }

}