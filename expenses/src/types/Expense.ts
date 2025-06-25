export interface Expense {
  amount: number | string;
  id?: number;
  description: string;
  //category: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date | null;
  user: User;
  category: Category,
  categoryId? : number
}

interface User {
  id: number | null;
  firstName?: string;
  lastName?: string;
}

export interface Category {
  id?: number;
  name?: string;
}
