# Covid 19 Footprint

COVID 19 Footprint allows you to calculate your viral footprint. The viral footprint is the \"mark\" you leave behind by performing actions that can spread the virus. The lower the value, the better, your footprint will be smaller.

This is a WPA with many interesting features all together such as multilingual support, continuous deployment, firebase integration and more.

## Install Environment

``` bash
npm i -g @ionic/cli
npm i -g firebase-tools
npm install
```

## Building

```bash
ionic serve
```

## Building for Production PWA

```bash
ionic build --prod
```

## Subscribe to topic and send end messages

```bash

curl --location --request POST 'https://iid.googleapis.com/iid/v1/<REGISTRATION_TOKEN>/rel/topics/all
' \
--header 'Authorization: key=<FIREBASE_API_KEY>'

curl --location --request POST 'https://fcm.googleapis.com/fcm/send' \
--header 'Authorization: key=<FIREBASE_API_KEY>' \
--header 'Content-Type: application/json' \
--data-raw '{
 "notification": {
   "title": "A TITLE",
   "body": "A BODY"
 },
 "to" : "/topics/all"
}'
```

## Languages

```bash
npm run translate
diff -r translations src/assets/i18n
```

| CODE | LANGUAGE | STATUS |
| :---: | :---: | :---: |
| ar | Árabe | OK |
| de | Alemán | OK |
| en | Inglés | OK |
| es | Español | OK |
| fa | Persa | OK |
| fr | Francés | OK |
| hi | Hindi | OK |
| it | Italiano | OK |
| ko | Coreano | OK |
| nl | Neerlandés | OK |
| no | Noruego | OK |
| pt | Portugués | OK |
| ru | Ruso  | OK |
| zh | Chino Simplificado | OK |

## Firebase Environment Variables

Actual schema of variables:

```json
{
  "cloud_functions": {
    "google_apis_auth_key": "<key>"
  }
}
```