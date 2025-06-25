import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper
} from '@mui/material';
import ExpenseFormDialog from '../../components/DialogForm/ExpenseFormDialog';
import { BASE_URL } from '../../constants/constants';
import { Category, Expense } from '../../types/Expense';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';



const EmployeeDashboard: React.FC = () => {
  const categories: Category[] = [
    {
      id: 1,
      name: "Food"
    },
    {
      id: 2,
      name: "Travel"
    },
    {
      id: 3,
      name: "Accomodation"
    },
    {
      id: 4,
      name: "Miscellaneous"
    }
  ]
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const userId = useSelector((state: RootState) => state.user.userId)

  const [formData, setFormData] = useState<Expense>({
    amount: '',
    description: '',
    category: { id: 0 },
    user: { id: userId }
  });

  const fetchExpenses = async () => {
    let url = new URL(`${BASE_URL}/api/expense`);
    url.searchParams.set('userId', userId as unknown as string)

    const res = await fetch(url.toString(), { headers });
    const json = await res.json();
    setExpenses(json);
  };

  const submitExpense = async () => {
    try {
      const data = {
        amount: Number(formData.amount),
        description: formData.description,
        user: formData.user.id,
        category: formData.categoryId
      }
      await fetch(`${BASE_URL}/api/expense`, {
        method: "POST", headers,
        body: JSON.stringify(data)
      });
      fetchExpenses();
      handleClose();
    } catch (error) {
      console.error('Error submitting expense:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ user: { id: userId }, amount: 0, description: '', category: { id: 0 } });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Employee Expense Dashboard
      </Typography>

      <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
        Add New Expense
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr. No</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Creation Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((exp: Expense, i) => (
              <TableRow key={exp.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{exp.category.name}</TableCell>
                <TableCell>₹{exp.amount}</TableCell>
                <TableCell>{exp.description}</TableCell>
                <TableCell>{exp.status || 'pending'}</TableCell>
                <TableCell>{String(exp.createdAt).substring(0, 10)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ExpenseFormDialog
        open={open}
        onClose={handleClose}
        formData={formData}
        setFormData={setFormData}
        onSubmit={submitExpense}
        categories={categories}
      />
    </Container>
  );
};

export default EmployeeDashboard;
