import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

import { Station } from '../../src/app/stations/station';
import { default as stationen } from '../../src/app/stations/stations.json';

import fetch from 'node-fetch';
import { Handler } from '@netlify/functions';

const endpoints = [
  {
    title: 'Mietwohnungen in L_nz',
    url: 'https://www.willhaben.at/iad/immobilien/mietwohnungen/oberoesterreich/linz',
  },
  {
    title: 'Eigentumswohnungen in L_nz',
    url: 'https://www.willhaben.at/iad/immobilien/eigentumswohnung/oberoesterreich/linz',
  },
  {
    title: 'Neue Heimat',
    url: 'https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=6563419&verticalId=2',
  },
  {
    title: 'GWG Linz',
    url: 'https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=28446133&verticalId=2',
  },
  /* {
    title: "WSG",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=29720423&verticalId=2",
  },
  {
    title: "OÖ Wohnbau",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=37441909&verticalId=2",
  },
  {
    title: "Lawog",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=17103067&verticalId=2",
  },
  {
    title: "GIWOG",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=6912138&verticalId=2",
  },
  {
    title: "Wohnbau 200",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=6912076&verticalId=2",
  },
  {
    title: "Familie",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=37609411&verticalId=2",
  },
  {
    title: "Lebensräume",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=6563410&verticalId=2",
  },
  {
    title: "BRW",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=6556903&verticalId=2",
  },
  {
    title: "WAG",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=6556872&verticalId=2",
  }, */
];

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.NG_APP_FIREBASE_API_KEY,
  authDomain: process.env.NG_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NG_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NG_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NG_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();

function getStationsAir() {
  let stations: any = [];
  stationen.stationen.map((station: Station) => {
    if (station.komponentenCodes.includes('NO2' || 'PM10kont' || 'PM25kont'))
      stations.push(station);
    return true;
  });
  return stations;
}

async function writeResults(result: any) {
  const date = new Date(Date.now());
  set(
    ref(db, `${date.getMonth() + 1}/${date.getDate()}//${date.getHours()}`),
    result
  )
    .then(() => {
      console.log(result);
      console.log('Data saved successfully!');
    })
    .catch((error) => {
      console.log('The write failed', error);
    });
}

async function getData(): Promise<any> {
  let url = `http://www2.land-oberoesterreich.gv.at/imm/jaxrs/messwerte/json?stationcode=`;
  const stations = getStationsAir();
  let requests: any = [];

  stations.map((station: any) => {
    let pm10Url = url + station.code + '&komponentencode=PM10kont';
    let pm25Url = url + station.code + '&komponentencode=PM25kont';
    let no2Url = url + station.code + '&komponentencode=NO2';

    requests.push(
      fetch(no2Url)
        .then((response) => response.json())
        .catch((err) => console.log(err))
    );

    requests.push(
      fetch(pm25Url)
        .then((response) => response.json())
        .catch((err) => console.log(err))
    );

    requests.push(
      fetch(pm10Url)
        .then((response) => response.json())
        .catch((err) => console.log(err))
    );
  });

  try {
    return await Promise.all(requests);
  } catch (error) {
    console.log(error);
  }
}

const handler: Handler = async (req, res) => {
  // const results = JSON.parse(req.body);

  try {
    // await writeResults(results);
    const data = await getData();
    let stations: any = [];

    data.map((station: any) => {
      const tmw = station.messwerte.filter((messwert: any, index: number) => {
        return messwert.mittelwert === 'TMW';
      });

      stations.push(tmw);
    });

    return {
      statusCode: 200,
      body: JSON.stringify(stations),
    };
  } catch (err: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        err,
      }),
    };
  }
};

export { handler };
