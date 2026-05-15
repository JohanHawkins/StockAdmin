import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../shared/toast/toast';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastComponent
  ],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class ProductsComponent {

  toastVisible = false;

  toastMessage = '';

  toastType: 'success' | 'error' = 'success';

  showModal = false;

  showDeleteModal = false;

  isEditing = false;

  currentIndex = -1;

  products: Product[] = [];

  newProduct: Product = {
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

    const wasEditing = this.isEditing;

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

    this.showToast(
      wasEditing
        ? 'Producto actualizado correctamente'
        : 'Producto creado correctamente',
      'success'
    );

    this.closeModal();
  }

  editProduct(product: Product, index: number){

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

    this.showToast(
      'Producto eliminado correctamente',
      'success'
    );

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

  showToast(
    message: string,
    type: 'success' | 'error' = 'success'
  ){

    this.toastMessage = message;

    this.toastType = type;

    this.toastVisible = true;

    setTimeout(() => {

      this.toastVisible = false;

    }, 3000);
  }

}