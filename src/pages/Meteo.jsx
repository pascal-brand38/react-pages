/// Copyright (c) Pascal Brand
/// MIT License
///
/// 


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
  color: 'White',
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Temperature',
      color: 'White'
    },
  },
  elements: {
    point: {
      pointStyle: false,
    }
  },
  scales: {   // checks https://www.chartjs.org/docs/latest/axes/labelling.html#creating-custom-tick-formats
    x: {
      ticks: {
          callback: function(value, index, ticks) {
            if ((index + 12) % 24 == 0) {
              const reYearMonth = /[0-9]{4}-[0-9]{2}-/g
              const reT = /T/g
              return this.getLabelForValue(value).replace(reYearMonth, '').replace(reT, ' ')
            } else {
              return '';
            }
          }
      }
  },
  y: {
    ticks: {
        callback: function(value, index, ticks) {
          return value + '°';
        }
    }
}
}

};


function Meteo() {
  var [ graphData, setGraphData ] = useState(null)

  useEffect(() => {
    const configs = [ 
      {
        api: 'meteofrance',
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        api: 'dwd-icon',    // german
        borderColor: 'rgb(99, 255, 132)',
        backgroundColor: 'rgb(99, 255, 132, 0.5)',
      },
      {
        api: 'gem',         // north america
        borderColor: 'rgb(132, 99, 255)',
        backgroundColor: 'rgba(132, 99, 255, 0.5)',
      },
    ]

    // check https://open-meteo.com/en/docs/meteofrance-api
    const coord = {
      bordeaux: {
        lat: 44.841409,
        long: -0.569515,
      }
    }
    var cmds = []
    const baseurl = 'https://api.open-meteo.com/v1/'
    const where = '&latitude=' + coord.bordeaux.lat + '&longitude=' + coord.bordeaux.long;
    const what = '&hourly=temperature_2m&current_weather=true&timezone=Europe%2FBerlin'
    configs.forEach((configs) => { cmds.push(fetch(baseurl + configs.api + '?' + where + what)); });

    // https://gomakethings.com/waiting-for-multiple-all-api-responses-to-complete-with-the-vanilla-js-promise.all-method/
    Promise.all(
      cmds
      ).then(function (responses) {
      // Get a JSON object from each of the responses
      return Promise.all(responses.map(function (response) {
        return response.json();
      }))}).
      then(function(datas) {
        var labels = null;
        var datasets = [];
        datas.forEach( (data, index) => {
          console.log(configs[index].api, data)
          if ((!labels) || (labels.length < data.hourly.time.length)) {
            labels = data.hourly.time;
          }
          datasets.push({
              label: configs[index].api,
              data: data.hourly.temperature_2m,
              borderColor: configs[index].borderColor,
              backgroundColor: configs[index].backgroundColor,
              borderWidth: 1,
          });
        })
        setGraphData({
            labels: labels,
            datasets: datasets,
        })
      })
  }, []);


  if (graphData) {
    return <Line options={options} data={graphData} />;
  } else {
    return (<p> Loading...</p>)
  }

}

export default Meteo;

// TODO: lat/long from town list
