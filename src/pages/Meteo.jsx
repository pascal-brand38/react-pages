/// Copyright (c) Pascal Brand
/// MIT License
///
///

import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const meteoConfig = {
  apis: ["meteofrance", "dwd-icon", "gem"],
  apisDesc: ["Météo France", "Météo Allemagne", "Météo Amérique du nord"],

  dataField: [
    {
      title: 'Température',
      extract: (dataMeteo) => dataMeteo.hourly.temperature_2m,
      apiField: 'temperature_2m',
      axisSuffix: '°'
    }
  ],
};

// https://open-meteo.com/en/docs/geocoding-api
// get latitude and longitude from town name
async function getDataTown(town) {
  return fetch(
    "https://geocoding-api.open-meteo.com/v1/search?name=" + town
  ).then((response) => {
    return response.json();
  });
}

// https://open-meteo.com/en/docs/meteofrance-api
// get meteo (forecast) at latitude / longitude, from the given api (meteofrance / dwd-icon / gem)
async function getMeteoData(latitude, longitude, api, indexWhat) {
  const baseurl = "https://api.open-meteo.com/v1/";
  const where = "&latitude=" + latitude + "&longitude=" + longitude;
  const what = "&hourly=" + meteoConfig.dataField[indexWhat].apiField;
  const timezone = "&timezone=Europe%2FBerlin";
  return fetch(baseurl + api + "?" + where + what + timezone).then(
    (response) => {
      return response.json();
    }
  );
}

async function getMultipleApisMeteoDatas(latitude, longitude, apis, indexWhat) {
  var cmds = [];
  apis.forEach((api) => {
    cmds.push(getMeteoData(latitude, longitude, api, indexWhat));
  });
  return Promise.all(cmds);
}

var chartjsOptions = {
  responsive: true,
  color: "White",
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      color: "White",
    },
  },
  elements: {
    point: {
      pointStyle: false,
    },
  },
  scales: {
    // checks https://www.chartjs.org/docs/latest/axes/labelling.html#creating-custom-tick-formats
    x: {
      ticks: {
        callback: function (value, index, ticks) {
          if ((index + 12) % 24 == 0) {
            const reYearMonth = /[0-9]{4}-[0-9]{2}-/g;
            const reT = /T/g;
            return this.getLabelForValue(value)
              .replace(reYearMonth, "")
              .replace(reT, " ");
          } else {
            return "";
          }
        },
      },
    },
    y: {
      ticks: {
        callback: function (value, index, ticks) {
          return value + "°";   // TODO: use suffix there
        },
      },
    },
  },
};

const configs = [
  {
    borderColor: "rgba(255, 99, 132)",
    backgroundColor: "rgba(255, 99, 132, 0.5)",
  },
  {
    borderColor: "rgb(99, 255, 132)",
    backgroundColor: "rgb(99, 255, 132, 0.5)",
  },
  {
    borderColor: "rgb(132, 99, 255)",
    backgroundColor: "rgba(132, 99, 255, 0.5)",
  },
];

function Meteo() {
  var [graphData, setGraphData] = useState(null);
  var [town, setTown] = useState("bordeaux");
  var [indexWhat, setIndexWhat] = useState(0);

  useEffect(() => {
    getDataTown(town).then((dataTown) => {
      // https://gomakethings.com/waiting-for-multiple-all-api-responses-to-complete-with-the-vanilla-js-promise.all-method/
      getMultipleApisMeteoDatas(
        dataTown.results[0].latitude,
        dataTown.results[0].longitude,
        meteoConfig.apis,
        indexWhat
      ).then(function (datas) {
        var labels = null;
        var datasets = [];
        datas.forEach((data, index) => {
          if (!labels || labels.length < data.hourly.time.length) {
            labels = data.hourly.time;
          }
          datasets.push({
            label: meteoConfig.apisDesc[index],
            data: meteoConfig.dataField[indexWhat].extract(data),
            borderColor: configs[index].borderColor,
            backgroundColor: configs[index].backgroundColor,
            borderWidth: 1,
          });
        });
        chartjsOptions.plugins.title.text = meteoConfig.dataField[indexWhat].title

        setGraphData({
          labels: labels,
          datasets: datasets,
        });
      });
    });
  }, [town]);

  if (graphData) {
    return <Line options={chartjsOptions} data={graphData} />;
  } else {
    return <p> Loading...</p>;
  }
}

export default Meteo;

// TODO: lat/long from town list
//    https://open-meteo.com/en/docs/geocoding-api
//    https://codesandbox.io/s/clever-violet-vxupkq?file=/src/App.js
