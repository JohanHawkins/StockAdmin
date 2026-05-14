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
  }

  closeModal(){
    this.showModal = false;
  }

  saveProduct(){

    this.products.push({
      ...this.newProduct
    });

    this.newProduct = {
      code: '',
      name: '',
      price: 0,
      stock: 0,
      status: 'Activo'
    };

    this.closeModal();
  }

}