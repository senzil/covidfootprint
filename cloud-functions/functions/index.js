const functions = require('firebase-functions');
const fs = require('fs'); 
const circleToPolygon = require('circle-to-polygon');
const path = require('path');
const os = require('os');
const GeoJSON = require('geojson');
const admin = require('firebase-admin');
const request2 = require('request');

admin.initializeApp(functions.config().firebase);
const db = admin.database();

const {BigQuery} = require('@google-cloud/bigquery');
const bigquery = new BigQuery({ projectId: 'c19footprint' });

// Google Api Key Auth

const googleApiKeyAuth = functions.config().cloud_functions.google_apis_auth_key;

/*BEGIN API DEFINITION*/

const express = require('express');
const app = express();

const cors = require('cors')({ origin: true });
app.use(cors)

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const authenticate = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      res.status(401).send('Unauthenticated');
      return;
    }
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
      const decodedIdToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedIdToken;
      next();
      return;
    } catch(e) {
      res.status(403).send('Unauthorized');
      return;
    }
  };
  
app.use(authenticate);

// POST /api/ranking
// Get ranking.
app.post('/ranking', async (req, res) => {
    const message = req.body.message;
    
    try {
        const best = (await bigquery.query({
            query: 'SELECT MAX(locationName) locationName, AVG(footprint) avgFootprint FROM `c19footprint.data.responses` group by lat, lng order by avg(footprint) ASC LIMIT 25'
        }))[0];

        const worst = (await bigquery.query({
            query: 'SELECT MAX(locationName) locationName, AVG(footprint) avgFootprint FROM `c19footprint.data.responses` group by lat, lng order by avg(footprint) DESC LIMIT 25'
        }))[0];
  
        res.status(200).json({
            best,
            worst
        });
    } catch(error) {
      console.log('Error getting ranking', error.message);
      res.sendStatus(500);
    }
  });

// Expose the API as a function
exports.api = functions.https.onRequest(app);

/*END API DEFINITION*/

exports.nuevaRespuesta = functions.firestore.document('/responses/{id}').onCreate((handler, context) => {
	let datasetId = 'data', 
		tableId = 'responses';
	
	const rows = [Object.assign({id: handler.id}, handler.data())];
    
    rows[0].responses="";
	// Insertar datos
	async function insertarBigQuery() {
		await bigquery
			.dataset(datasetId)
			.table(tableId)
			.insert(rows);
	}

	insertarBigQuery();

	return null;
})

exports.crearGeojson = functions.pubsub.schedule('every 5 minutes').onRun((context) => {
    console.log('This will be run every 5 minutes!');

    let fileBucket = "<fileBucket>"
	const bucket = admin.storage().bucket(fileBucket);
	let fileName = "results.json";
	let folder = "results/"
    
    var bigQuery = new BigQuery({ projectId: 'c19footprint' });
    bigQuery.query({
        query: 'SELECT MAX(locationName) locationName, lat, lng, AVG(footprint) avgFootprint FROM `c19footprint.data.responses` group by lat, lng order by avg(footprint) DESC'
    }).then(function (results) {
                
        var ref = {
            "type": "FeatureCollection",
            "features": []
        };
  
        var rows = results[0]; //get all fetched table rows
        console.log(rows);
        rows.forEach(function (row) { //iterate through each row
            try {
                const coordinates = [row['lng'], row['lat']]; //[lon, lat]
                // const radius = 100;                           // in meters
                const numberOfEdges = 32;                     //optional that defaults to 32
                let polygon = circleToPolygon(coordinates, Math.exp(1/Math.E * (row['avgFootprint'] - 1)) * 1000 /*a kilometer of base*/, numberOfEdges);
                console.log(polygon['coordinates']);
                ref.features.push(GeoJSON.parse({'locationName': row['locationName'], 'avgFootprint': row['avgFootprint'], 'polygon': polygon['coordinates']}, {Polygon: 'polygon' }))
            }
            catch (e) {
                console.error(e);
            }
        });
        
        const tempFilePath = path.join(os.tmpdir(), fileName);
        fs.writeFileSync(tempFilePath, JSON.stringify(ref, null, 4), 'utf8');

        let uuid = "<uuid>";
        return bucket.upload(tempFilePath, {
            destination: folder + fileName, 
            metadata: {
                metadata: {
                    firebaseStorageDownloadTokens: uuid
                }
            }
        }).then((data) => {

            let file = data[0];
            let urltodownload = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuid;
                     
            return Promise.resolve(urltodownload);
        });
    
    });

    return null;
  });

exports.subscribeToTopic = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(402).json({ "message": "Not Allowed" });
        }

        var token = req.body.token
        var topic = req.body.topic

        request2.post(
            'https://iid.googleapis.com/iid/v1/' + token + '/rel/topics/' + topic,
            {
                json: true,
                headers: {
                    "Authorization": "key=" + googleApiKeyAuth
                }
            },
            (err, res2, body) => {
                if (err) {
                    res.status(404).json(err);
                    return console.log(err);
                }
                console.log(body.url);
                console.log(body.explanation);
                res.status(200).json({
                    "message": "EXITO: agregado " + token + " al topico " + topic,
                    "response": body
                });
        });
    })
})

exports.cronReminder = functions.pubsub.schedule('30 21 * * *').timeZone('America/Argentina/Buenos_Aires').onRun((context) => {

    return request2.post(
        'https://fcm.googleapis.com/fcm/send',
        {
            json: true,
            body:{
                data: {
                    title: "Recordatorio Covid-19 Footprint",
                    body: "¿Ya calculaste tu huella viral de hoy?\nHave you already calculated your viral footprint today?"
                },
                to: "/topics/all"
            },
            headers: {
                "Authorization": "key=" + googleApiKeyAuth
            }
        },
        (err, res, body) => {
            if (err) {
                return console.log(err);
            }
            console.log(res);
            console.log(body);
        });
})

exports.cronReminderByTimezone = functions.pubsub.schedule('30 * * * *').onRun((context) => {

    const sendAt = 21 * 60 + 30; //21:30 aprox
    const d = new Date();
    const currentMinutesUTC = d.getUTCHours() * 60 + d.getUTCMinutes() ;
    const currentMinutes = currentMinutesUTC - sendAt;
    const currentOffset = currentMinutes % 30 * 30; //each 30 minutes

    return request2.post(
        'https://fcm.googleapis.com/fcm/send',
        {
            json: true,
            body:{
                data: {
                    title: "Recordatorio Covid-19 Footprint",
                    body: "Have you already calculated your viral footprint today?"
                },
                to: "/topics/" + currentOffset.toString().replace('-', 'e')
            },
            headers: {
                "Authorization": "key=" + googleApiKeyAuth
            }
        },
        (err, res, body) => {
            if (err) {
                return console.log(err);
            }
            console.log(res);
            console.log(body);
        });
})