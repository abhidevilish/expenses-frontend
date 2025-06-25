import { useEffect, useState } from 'react';
import {
  AppBar,
  TextField,
  Toolbar,
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  CircularProgress,
} from '@mui/material';
import { BASE_URL } from '../../constants/constants';
//import flatObjects from '../../utils/flatObjects';
import { Expense } from '../../types/Expense';
import { logoutUser } from '../../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import ExpenseChart from '../../components/Charts/ExpenseChart';


const AdminDashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const approvedBy = useSelector((state: RootState) => state.user.userId);
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  const fetchExpenses = async () => {
    const res = await fetch(`${BASE_URL}/api/expense`, { headers});
    const json = await res.json();
    setExpenses(json)
    setAllExpenses(json)
    //setExpenses(flatObjects(json));
    setLoading(false);
  }

  const fetchAnalytics = async () => {
    const res = await fetch(`${BASE_URL}/api/expense/analytics`,{headers});
    const json = await res.json();
    const data = json.map((e: any) => ({
      category: e.category,
      total: Number(e.total)
    }))
    setChartData(data)
  }

  useEffect(() => {
    //const timer = setTimeout(() => {
    console.log(search.length)
    if (search.length) {
      const filtered = allExpenses.filter(e => e.category.name?.toLowerCase()?.includes(search.toLowerCase()) || String(e.createdAt).includes(search))
      setExpenses(filtered)
    } else {
      setExpenses(allExpenses)
    }
    //}, 500);
    //return ()=> clearTimeout(timer)
  }, [search])

  useEffect(() => {
    fetchExpenses();
    fetchAnalytics();
    return () => console.log("Cleanup on component unmount")
  }, []);

  const handleAction = async (id: number, status: string) => {
    const updateStatusObj = {
      status,
      approvedBy
    };

    const response = await fetch(`${BASE_URL}/api/expense/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updateStatusObj)
    });
    if (response.ok) {
      setExpenses((prev: Expense[]) =>
        prev.map((e: Expense) => (e.id === id ? { ...e, status } : e))
      );
    } else {
      console.log("Updating status failed", response.json());
    }

  };

  const handleLogout = () => {
    localStorage.clear();
    logoutUser();
    navigate('/', { replace: true })
  }

  if (loading) return <CircularProgress />;

  return (
    <>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          {/* <Typography> */}
          <TextField
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
          />
          {/* </Typography> */}
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container>
        <Paper>
          <Typography variant="h6" gutterBottom>
            Expense Breakdown by Category
          </Typography>
          <ExpenseChart data={chartData} />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr.No</TableCell>
                <TableCell>Employee</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Creation Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {expenses.map((expense: Expense, i) => (
                <TableRow key={expense.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{expense.user.firstName} {expense.user.lastName}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.category.name}</TableCell>
                  <TableCell>₹{expense.amount}</TableCell>
                  <TableCell>{expense.status}</TableCell>
                  <TableCell>{String(expense.createdAt).substring(0, 10)}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleAction(Number(expense.id), 'approved')}
                      disabled={expense.status === 'approved'}
                    >
                      Approve
                    </Button>{' '}
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleAction(Number(expense.id), 'rejected')}
                      disabled={expense.status === 'rejected'}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </>
  );
};

export default AdminDashboard;
