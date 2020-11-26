# Cloud Functions - Firebase

There are the functions to support the app. API, Cron, events, geojson.

## Initial Config

```bash
$ npm install -g firebase-tools
$ firebase login
$ npm install
```

## Deploy Functions

```bash
$ firebase deploy
# OR
$ firebase deploy --only functions:cronReminderByTimezone
```

## Environment

Re-generate `firebase.json` decoding `FIREBASE_JSON_FUNTIONS` base64 env var
```bash
echo $FIREBASE_JSON_FUNTIONS | base64 -d > cloud-functions/firebase.json
```

**Note:** Same for env var `C19FOOTPRINT_ADMIN_SDK_ACCOUNT` with the file `cloud-functions/functions/c19footprint-admin-sdk-account.json`