import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ComplaintsBarChart = ({ complaints }) => {

  const data = useMemo(() => {
    const complaintsByCategory = complaints.reduce((acc, c) => {
      const category = c.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(complaintsByCategory),
      datasets: [
        {
          label: 'Number of Complaints',
          data: Object.values(complaintsByCategory),
          backgroundColor: 'rgba(25, 135, 84, 0.8)',
          borderColor: 'rgba(25, 135, 84, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [complaints]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Complaints by Category' },
    },
  }), []);

  return <div style={{ height: '100%' }}><Bar data={data} options={options} /></div>;
};

export default ComplaintsBarChart;
