/// Copyright (c) Pascal Brand
/// MIT License
///
/// https://open-meteo.com/en/docs/meteofrance-api#latitude=44.50&longitude=0.17&hourly=temperature_2m&current_weather=true



import { useEffect, useState} from "react";

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};


function Meteo() {

  var [ graphData, setGraphData ] = useState(null)

  useEffect(() => {
      const configs = [ 
        {
          api: 'meteofrance',
        },
        // {
        //   api: 'dwd-icon',
        // },
      ]

    // https://gomakethings.com/waiting-for-multiple-all-api-responses-to-complete-with-the-vanilla-js-promise.all-method/
    Promise.all([
      fetch('https://api.open-meteo.com/v1/meteofrance?latitude=44.58&longitude=0.22&hourly=temperature_2m&current_weather=true&timezone=Europe%2FBerlin'),
      fetch('https://api.open-meteo.com/v1/dwd-icon?latitude=44.58&longitude=0.22&hourly=temperature_2m&current_weather=true&timezone=Europe%2FBerlin'),
      ]).then(function (responses) {
      // Get a JSON object from each of the responses
      return Promise.all(responses.map(function (response) {
        return response.json();
      }))}).
      then(function(datas) {
        var labels = null;
        var datasets = [];
        datas.forEach( (data) => {
          labels = data.hourly.time;
          datasets.push({
              label: 'Temp',
              data: data.hourly.temperature_2m,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
          });
        })
        setGraphData({
            labels: labels,
            datasets: datasets,

        })

      })
        
  }, []);


  // useEffect(() => {
  //   async function getData(config) {
  //     var oneData = null;
  //     await fetch('https://api.open-meteo.com/v1/' + config.api + '?latitude=44.58&longitude=0.22&hourly=temperature_2m&current_weather=true&timezone=Europe%2FBerlin')
  //       .then(resp => resp.json())
  //       .then((data) => {
  //         oneData ={
  //           labels,
  //           oneDataSet: {
  //             label: 'Temp',
  //             data: data.hourly.temperature_2m,
  //             borderColor: 'rgb(255, 99, 132)',
  //             backgroundColor: 'rgba(255, 99, 132, 0.5)',
  //           }}
        
  //       });
  //     return oneData;
  //   }
  //   async function getDatas() {
  //     const configs = [ 
  //       {
  //         api: 'meteofrance',
  //       },
  //       // {
  //       //   api: 'dwd-icon',
  //       // },
  //     ];
  
  //     var dataSets = [];
  //     var labels = null;
  
  //     configs.forEach((config) => {
  //       oneData = getData(api);

  //         dataSets.push({
  //           label: 'Temp',
  //           data: data.hourly.temperature_2m,
  //           borderColor: 'rgb(255, 99, 132)',
  //           backgroundColor: 'rgba(255, 99, 132, 0.5)',
  //         })
  //         labels = data.hourly.time;
  //         console.log(data.hourly.time)
  //       });

  //     return { labels, dataSets }
  //   }

  //   const data = getDatas();

  //   // console.log(data.labels);
  //   // console.log(data.dataSets);

  //   setGraphData({
  //     labels: data.labels,
  //     datasets: data.dataSets,
  // });
  // }, []);

  if (graphData) {
    return <Line options={options} data={graphData} />;
  } else {
    return (<p> Loading...</p>)
  }

}

export default Meteo;

// TODO: lat/long from town list
// TODO: Check D3 framework to have better graphs (day/night), color when cold,...
