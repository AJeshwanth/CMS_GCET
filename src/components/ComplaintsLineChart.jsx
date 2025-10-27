import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ComplaintsLineChart = ({ complaints }) => {

  const data = useMemo(() => {
    const complaintsByDate = complaints.reduce((acc, c) => {
      const date = c.createdAt ? c.createdAt.split('T')[0] : 'Unknown';
      const status = c.status || 'Pending';
      if (!acc[date]) acc[date] = { Pending: 0, 'In Progress': 0, Resolved: 0 };
      acc[date][status] = (acc[date][status] || 0) + 1;
      return acc;
    }, {});

    const sortedDates = Object.keys(complaintsByDate).sort();

    return {
      labels: sortedDates,
      datasets: [
        {
          label: 'Pending',
          data: sortedDates.map(d => complaintsByDate[d].Pending),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'In Progress',
          data: sortedDates.map(d => complaintsByDate[d]['In Progress']),
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: 'Resolved',
          data: sortedDates.map(d => complaintsByDate[d].Resolved),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ],
    };
  }, [complaints]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Complaints Over Time' },
    },
  }), []);

  return <div style={{ height: '100%' }}><Line data={data} options={options} /></div>;
};

export default ComplaintsLineChart;
