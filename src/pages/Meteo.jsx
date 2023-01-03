/// Copyright (c) Pascal Brand
/// MIT License
///
/// TODO: archive: update 1st and last date
/// TODO: graph of comparison between years
/// TODO: add sum of rainfall on the year
/// TODO: add loading icons when fetching data

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
  forecast: {
    baseurl: "https://api.open-meteo.com/v1/",
    apis: ["meteofrance", "dwd-icon", "gem"],
    apisDesc: ["Météo France", "Météo Allemagne", "Météo Amérique du nord"],
  },

  archive: {
    baseurl: "https://archive-api.open-meteo.com/v1/",
    apis: ["archive"],
    apisDesc: ["Historique"],
  },
  measures: [
    {
      label: 'Température',     // label is required for dropdown react plugin
      forecast: {
        extract: (dataMeteo) => dataMeteo.hourly.temperature_2m,
        extractLabels: (dataMeteo) => dataMeteo.hourly.time,
        apiField: '&hourly=temperature_2m',
      },
      archive: {
        extract: (dataMeteo) => dataMeteo.hourly.temperature_2m,
        extractLabels: (dataMeteo) => dataMeteo.hourly.time,
        apiField: '&start_date=2010-11-30&end_date=2022-12-31&hourly=temperature_2m',
      },
      ycallback: (value, index, ticks) => {
        return value + '°' + 'yo';
      },
    },
    {
      label: 'Précipitations',
      forecast: {
        extract: (dataMeteo) => dataMeteo.hourly.precipitation,
        extractLabels: (dataMeteo) => dataMeteo.hourly.time,
        apiField: '&hourly=precipitation',
      },
      archive: {
        extract: (dataMeteo) => dataMeteo.daily.precipitation_sum,
        extractLabels: (dataMeteo) => dataMeteo.daily.time,
        apiField: '&start_date=2010-11-30&end_date=2022-12-29&daily=precipitation_sum',
      },
      ycallback: (value, index, ticks) => {
        return value + 'mm';
      },
    },
    {
      label: 'Couverture nuageuse',
      forecast: {
        extract: (dataMeteo) => dataMeteo.hourly.cloudcover,
        extractLabels: (dataMeteo) => dataMeteo.hourly.time,
        apiField: '&hourly=cloudcover',
      },
      archive: {
        extract: (dataMeteo) => dataMeteo.hourly.cloudcover,
        extractLabels: (dataMeteo) => dataMeteo.hourly.time,
        apiField: '&start_date=2010-11-30&end_date=2022-12-29&hourly=cloudcover',
      },
      ycallback: (value, index, ticks) => {
        return value + '%';
      },
    },
    {
      label: 'Vent',
      forecast: {
        extract: (dataMeteo) => dataMeteo.hourly.windspeed_10m,
        extractLabels: (dataMeteo) => dataMeteo.hourly.time,
        apiField: '&hourly=windspeed_10m',
      },
      archive: {
        extract: (dataMeteo) => dataMeteo.hourly.windspeed_10m,
        extractLabels: (dataMeteo) => dataMeteo.hourly.time,
        apiField: '&start_date=2010-11-30&end_date=2022-12-29&hourly=windspeed_10m',
      },
      ycallback: (value, index, ticks) => {
        return value + 'km/h';
      },
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
async function getMeteoData(latitude, longitude, api, measureIndex, typeOfMeteo) {
  const baseurl = meteoConfig[typeOfMeteo].baseurl;
  const where = "&latitude=" + latitude + "&longitude=" + longitude;
  const what = meteoConfig.measures[measureIndex][typeOfMeteo].apiField;
  const timezone = "&timezone=Europe%2FBerlin";
  return fetch(baseurl + api + "?" + where + what + timezone).then(
    (response) => {
      return response.json();
    }
  );
}

async function getMultipleApisMeteoDatas(latitude, longitude, apis, measureIndex, typeOfMeteo) {
  var cmds = [];
  apis.forEach((api) => {
    cmds.push(getMeteoData(latitude, longitude, api, measureIndex, typeOfMeteo));
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
  var [typeOfMeteo, setTypeOfMeteo] = useState('forecast')

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
        meteoConfig[typeOfMeteo].apis,
        measureIndex,
        typeOfMeteo
      ).then(function (datas) {
        console.log(datas)
        var labels = null;
        var datasets = [];
        datas.forEach((data, index) => {
          const currentLabels = meteoConfig.measures[measureIndex][typeOfMeteo].extractLabels(data)
          if (!labels || labels.length < currentLabels.length) {
            labels = currentLabels;
          }
          datasets.push({
            label: meteoConfig[typeOfMeteo].apisDesc[index],
            data: meteoConfig.measures[measureIndex][typeOfMeteo].extract(data),
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
  }, [townInfo, measureIndex, typeOfMeteo]);

  if (graphData) {
    return (
      <>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--margin-s)" }}>
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

          <PbrDropdown
            type='dropdown'
            initialValue={'Prévisions'}
            list={['Prévisions', 'Historique']}
            onSelect={ ({index}) => setTypeOfMeteo((index==0) ? 'forecast' : 'archive') }
            valueFromItem={(item) => (item)}
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


