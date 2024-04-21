import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Activity() {
  const [soloActivityDetails, setSoloActivityDetails] = useState({});
  const [groupActivityDetails, setGroupActivityDetails] = useState({});
  const [activityTypes, setActivityTypes] = useState({});
  const [joke, setJoke] = useState('Click the button to hear a joke!');

  const fetchActivity = (setActivityFunction, participants) => {
    fetch(`https://www.boredapi.com/api/activity?participants=${participants}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setActivityFunction(data);
        setActivityTypes(prevTypes => ({
          ...prevTypes,
          [data.type]: (prevTypes[data.type] || 0) + 1
        }));
      })
      .catch(err => {
        console.error('Error fetching activity data: ', err);
        setActivityFunction({
          activity: 'Failed to fetch new activity. Please try again!'
        });
      });
  };

  const fetchJoke = () => {
    fetch('https://api.chucknorris.io/jokes/random')
      .then(response => {
        if (!response.ok) {
          throw new Error('HTTP error fetching joke');
        }
        return response.json();
      })
      .then(data => setJoke(data.value))
      .catch(err => {
        console.error('Error fetching joke: ', err);
        setJoke('Failed to fetch a joke. Please try again!');
      });
  };

  const ActivityInfo = ({ details }) => (
    <div>
      <p><strong>Activity:</strong> {details.activity}</p>
      <p><strong>Type:</strong> {details.type}</p>
      <p><strong>Participants:</strong> {details.participants}</p>
     
      {details.link && (
        <p><strong>Learn More:</strong> <a href={details.link} target="_blank" rel="noopener noreferrer" className="underline">Click Here</a></p>
      )}
    </div>
  );

  const activityChartData = {
    labels: Object.keys(activityTypes),
    datasets: [{
      label: 'Number of Activities by Type',
      data: Object.values(activityTypes),
      backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
      borderWidth: 1,
    }]
  };

  return (
    <div className="app bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 min-h-screen flex flex-col items-center pt-10 pb-20 px-4">
      <h1 className="text-6xl font-extrabold text-center text-white mb-10">Cure Your Boredom!</h1>
      
      <div className="space-y-10 w-full max-w-4xl">
        <Bar data={activityChartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
        <div className="bg-white rounded-lg shadow-2xl p-6">
          <h2 className="text-4xl font-bold text-green-700 mb-4">Solo Activity</h2>
          <ActivityInfo details={soloActivityDetails} />
          <button onClick={() => fetchActivity(setSoloActivityDetails, 1)}
            className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out">
            Generate Solo Activity
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-6">
          <h2 className="text-4xl font-bold text-green-700 mb-4">Group Activity</h2>
          <ActivityInfo details={groupActivityDetails} />
          <button onClick={() => fetchActivity(setGroupActivityDetails, 2)}
            className="mt-4 w-full bg-green-400 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out">
            Generate Group Activity
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-6">
          <h2 className="text-4xl font-bold text-blue-700 mb-4">Chuck Norris Joke</h2>
          <p>{joke}</p>
          <button onClick={fetchJoke}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out">
            Tell Me a Joke
          </button>
        </div>
      </div>
    </div>
  );
}

export default Activity;
