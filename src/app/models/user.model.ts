export interface User {
  id: number;
  nombre: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}
