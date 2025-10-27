import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ComplaintsPieChart = ({ complaints }) => {

  const data = useMemo(() => {
    const statusCounts = complaints.reduce((acc, c) => {
      const status = c.status || 'Pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statuses = Object.keys(statusCounts);
    const counts = Object.values(statusCounts);

    const backgroundColors = {
      'Pending': 'rgba(255, 206, 86, 0.8)',
      'In Progress': 'rgba(54, 162, 235, 0.8)',
      'Resolved': 'rgba(75, 192, 192, 0.8)',
    };

    const borderColors = {
      'Pending': 'rgba(255, 206, 86, 1)',
      'In Progress': 'rgba(54, 162, 235, 1)',
      'Resolved': 'rgba(75, 192, 192, 1)',
    };

    return {
      labels: statuses,
      datasets: [
        {
          data: counts,
          backgroundColor: statuses.map(s => backgroundColors[s] || 'rgba(128,128,128,0.8)'),
          borderColor: statuses.map(s => borderColors[s] || 'rgba(128,128,128,1)'),
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
      title: { display: true, text: 'Complaints by Status' },
    },
  }), []);

  return <div style={{ height: '100%' }}><Pie data={data} options={options} /></div>;
};

export default ComplaintsPieChart;
