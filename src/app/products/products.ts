import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class ProductsComponent {

  showModal = false;

  showDeleteModal = false;

  isEditing = false;

  currentIndex = -1;

  products: any[] = [];

  newProduct = {
    code: '',
    name: '',
    price: 0,
    stock: 0,
    status: 'Activo'
  };

  constructor(private productService: ProductService){

    this.products = this.productService.getProducts();
  }

  openModal(){

    this.showModal = true;

    this.isEditing = false;
  }

  closeModal(){

    this.showModal = false;
  }

  saveProduct(){

    if(this.isEditing){

      this.productService.updateProduct(
        this.currentIndex,
        { ...this.newProduct }
      );

    }else{

      this.productService.addProduct(
        { ...this.newProduct }
      );

    }

    this.resetForm();

    this.closeModal();
  }

  editProduct(product: any, index: number){

    this.newProduct = {
      ...product
    };

    this.currentIndex = index;

    this.isEditing = true;

    this.showModal = true;
  }

  openDeleteModal(index: number){

    this.currentIndex = index;

    this.showDeleteModal = true;
  }

  closeDeleteModal(){

    this.showDeleteModal = false;
  }

  confirmDelete(){

    this.productService.deleteProduct(
      this.currentIndex
    );

    this.closeDeleteModal();
  }

  resetForm(){

    this.newProduct = {
      code: '',
      name: '',
      price: 0,
      stock: 0,
      status: 'Activo'
    };

    this.currentIndex = -1;

    this.isEditing = false;
  }

}