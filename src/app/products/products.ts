import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  newProduct = {
    code: '',
    name: '',
    price: 0,
    stock: 0,
    status: 'Activo'
  };

  openModal(){
    this.showModal = true;

    this.isEditing = false;
  }

  closeModal(){
    this.showModal = false;
  }

  saveProduct(){

    if(this.isEditing){

      this.products[this.currentIndex] = {
        ...this.newProduct
      };

    }else{

      this.products.push({
        ...this.newProduct
      });

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

    this.products.splice(this.currentIndex, 1);

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