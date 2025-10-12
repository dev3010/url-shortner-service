import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jan', clicks: 400 },
  { month: 'Feb', clicks: 600 },
  { month: 'Mar', clicks: 800 },
  { month: 'Apr', clicks: 500 },
  { month: 'May', clicks: 900 },
];

const AdminDashboard = () => {
  const theme = useTheme();

  return (
    <Container sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Users', value: 120 },
          { label: 'Total URLs', value: 540 },
          { label: 'Total Clicks', value: 1250 },
        ].map((card, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Card
              sx={{
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                '&:hover': { boxShadow: 6 },
              }}
            >
              <CardContent>
                <Typography variant="h6">{card.label}</Typography>
                <Typography variant="h4">{card.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card
        sx={{
          p: 2,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Clicks Over Months
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.palette.divider}
            />
            <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
            <YAxis stroke={theme.palette.text.secondary} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary,
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="clicks"
              stroke={theme.palette.primary.main}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
