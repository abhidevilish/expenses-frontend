
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent
} from '@mui/material';
import { Category, Expense } from '../../types/Expense';



interface ExpenseFormDialogProps {
  open: boolean;
  onClose: () => void;
  formData: Expense;
  setFormData: React.Dispatch<React.SetStateAction<Expense>>;
  onSubmit: () => void;
  categories: Category[];
}

const ExpenseFormDialog: React.FC<ExpenseFormDialogProps> = ({
  open,
  onClose,
  formData,
  setFormData,
  onSubmit,
  categories
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = () => {
    if (!formData.amount || !formData.description || !formData.category) {
      alert('All fields are required');
      return;
    }
    onSubmit();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Submit New Expense</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Amount"
          name="amount"
          type="number"
          fullWidth
          value={formData.amount}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Description"
          name="description"
          fullWidth
          value={formData.description}
          onChange={handleInputChange}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            name="categoryId"
            //value={formData.category.id?.toString() ?? ''}
            onChange={handleSelectChange}
            label="Category"
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpenseFormDialog;
