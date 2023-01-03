/// Copyright (c) Pascal Brand
/// MIT License
///
///

import { useEffect, useState } from "react";
import PbrDropdown from '../components/PbrDropdown'

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

// from https://open-meteo.com/en/docs/meteofrance-api
const meteoConfig = {
  apis: ["meteofrance", "dwd-icon", "gem"],
  apisDesc: ["Météo France", "Météo Allemagne", "Météo Amérique du nord"],

  measures: [
    {
      label: 'Température',     // label is required for dropdown react plugin
      extract: (dataMeteo) => dataMeteo.hourly.temperature_2m,
      apiField: 'temperature_2m',
      ycallback: (value, index, ticks) => {
        return value + '°' + 'yo';
      }
    },
    {
      label: 'Précipitations',
      extract: (dataMeteo) => dataMeteo.hourly.precipitation,
      apiField: 'precipitation',
      ycallback: (value, index, ticks) => {
        return value + 'mm';
      }
    },
    {
      label: 'Couverture nuageuse',
      extract: (dataMeteo) => dataMeteo.hourly.cloudcover,
      apiField: 'cloudcover',
      ycallback: (value, index, ticks) => {
        return value + '%';
      }
    },
    {
      label: 'Vent',
      extract: (dataMeteo) => dataMeteo.hourly.windspeed_10m,
      apiField: 'windspeed_10m',
      ycallback: (value, index, ticks) => {
        return value + 'km/h';
      }
    },

  ],
};

// https://open-meteo.com/en/docs/geocoding-api
// get latitude and longitude from town name
async function getDataTown(town, filter) {
  return fetch(
    "https://geocoding-api.open-meteo.com/v1/search?language=fr&count=100&name=" + town
  ).then((response) => {
    return response.json();
  }).then((responses) => {
    if ((responses) && (responses.results)) {
      if (filter) {
        return responses.results.filter((e) => filter.includes(e.country_code));
      } else {
        return responses.results;
      }
    } else {
      return null;
    }
  });
}

// https://open-meteo.com/en/docs/meteofrance-api
// get meteo (forecast) at latitude / longitude, from the given api (meteofrance / dwd-icon / gem)
async function getMeteoData(latitude, longitude, api, measureIndex) {
  const baseurl = "https://api.open-meteo.com/v1/";
  const where = "&latitude=" + latitude + "&longitude=" + longitude;
  const what = "&hourly=" + meteoConfig.measures[measureIndex].apiField;
  const timezone = "&timezone=Europe%2FBerlin";
  return fetch(baseurl + api + "?" + where + what + timezone).then(
    (response) => {
      return response.json();
    }
  );
}

async function getMultipleApisMeteoDatas(latitude, longitude, apis, measureIndex) {
  var cmds = [];
  apis.forEach((api) => {
    cmds.push(getMeteoData(latitude, longitude, api, measureIndex));
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
        autoskip: false,
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
  var [measureIndex, setMeasureIndex] = useState(0);
  var [townCandidates, setTownCandidates] = useState(null);
  var [townInfo, setTownInfo] = useState(null);

  function getTownCandidates(townStartsWith) {
    console.log(townStartsWith);
    getDataTown(townStartsWith, ['FR']).then((candidates) => {
      console.log(candidates)
      setTownCandidates(candidates)
    });
  }

  useEffect(() => {
    if (!townInfo) {
      getDataTown('Bordeaux', ['FR']).then((dataTown) => setTownInfo(dataTown[0]));
    }

    if (townInfo) {
      getMultipleApisMeteoDatas(
        townInfo.latitude,
        townInfo.longitude,
        meteoConfig.apis,
        measureIndex
      ).then(function (datas) {
        var labels = null;
        var datasets = [];
        datas.forEach((data, index) => {
          if (!labels || labels.length < data.hourly.time.length) {
            labels = data.hourly.time;
          }
          datasets.push({
            label: meteoConfig.apisDesc[index],
            data: meteoConfig.measures[measureIndex].extract(data),
            borderColor: configs[index].borderColor,
            backgroundColor: configs[index].backgroundColor,
            borderWidth: 1,
          });
        });
        chartjsOptions.plugins.title.text = meteoConfig.measures[measureIndex].label
        chartjsOptions.scales.y.ticks.callback = meteoConfig.measures[measureIndex].ycallback;

        setGraphData({
          labels: labels,
          datasets: datasets,
        });
      });
    }
  }, [townInfo, measureIndex]);

  if (graphData) {
    return (
      <>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--margin-s)" }}>
        <PbrDropdown
          type='searchbar'
          initialValue={ 'Bordeaux - Gironde '}
          list={townCandidates}
          onChange={ getTownCandidates}
          onSelect={ ({item}) => setTownInfo(item) }
          valueFromItem={(item) => item.name + ' - ' + item.admin2}
          />

        <PbrDropdown
          type='dropdown'
          initialValue={meteoConfig.measures[measureIndex].label}
          list={meteoConfig.measures}
          onSelect={ ({index}) => setMeasureIndex(index) }
          valueFromItem={(item) => item.label}
          />
          </div>

        <Line options={chartjsOptions} data={graphData} />
      </>
    );
  } else {
    return <p> Loading...</p>
  }
}

export default Meteo;


