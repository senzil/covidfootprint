// Require the module and instantiate instance
const TJO = require('translate-json-object');
//requiring path and fs modules
const path = require('path');
const fs = require('fs');
const util = require('util');
const rf = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);
const wf = util.promisify(fs.writeFile);


const directoryPath = path.join(__dirname, '../src/assets/i18n');

rf(path.join(directoryPath, 'es.json'), 'utf-8')
  .then(async data => {
    const from = JSON.parse(data);
    console.log(from)

    const files = await readdir(directoryPath);

    const promises = files.map(async f => new Promise(async (resolve) => {
      const _file = f;
      console.log(_file);
      const lang = _file.replace('.json', '');
      // Choose the service to use google/yandex,
      // if you provide both yandex will be used as the default
      const tjo = TJO()
        tjo.init({
        googleApiKey: process.env.GOOGLE_TRASLATE_API_KEY
        });
      
      const fixed = {
        "PAGES": {
          "SOURCES": {
            "WHO": from.PAGES.SOURCES.WHO,
            "ADVICE": from.PAGES.SOURCES.ADVICE,
            "MYTH-BUSTERS": from.PAGES.SOURCES['MYTH-BUSTERS'],
            "MASCARILLA": from.PAGES.SOURCES.MASCARILLA,
            "Q&A": from.PAGES.SOURCES['Q&A'],
            "Q&A2": from.PAGES.SOURCES['Q&A2'],
            "MAYO": from.PAGES.SOURCES.MAYO,
            "MAYO2": from.PAGES.SOURCES.MAYO2
          }
        }
      };

      from.PAGES.SOURCES.WHO = "";
      from.PAGES.SOURCES.ADVICE = "";
      from.PAGES.SOURCES['MYTH-BUSTERS'] = "";
      from.PAGES.SOURCES.MASCARILLA = "";
      from.PAGES.SOURCES['Q&A'] = "";
      from.PAGES.SOURCES['Q&A2'] = "";
      from.PAGES.SOURCES.MAYO = "";
      from.PAGES.SOURCES.MAYO2 = "";
      
      const result = await tjo.translate(from, lang !== 'zh' ? lang : 'zh-CN');
      result.PAGES.SOURCES.WHO = fixed.PAGES.SOURCES.WHO;
      result.PAGES.SOURCES.ADVICE = fixed.PAGES.SOURCES.ADVICE;
      result.PAGES.SOURCES['MYTH-BUSTERS'] = fixed.PAGES.SOURCES['MYTH-BUSTERS'];
      result.PAGES.SOURCES.MASCARILLA = fixed.PAGES.SOURCES.MASCARILLA;
      result.PAGES.SOURCES['Q&A'] = fixed.PAGES.SOURCES['Q&A'];
      result.PAGES.SOURCES['Q&A2'] = fixed.PAGES.SOURCES['Q&A2'];
      result.PAGES.SOURCES.MAYO = fixed.PAGES.SOURCES.MAYO;
      result.PAGES.SOURCES.MAYO2 = fixed.PAGES.SOURCES.MAYO2;
      console.log('saving', _file)
      console.log(result);
      return resolve(await wf(path.join(__dirname, _file), JSON.stringify(result, null, 2), 'utf-8')
      .then(() => console.log('saved', _file)))
    }));

    return promises.reduce((cur, next) => {
      return cur.then(next);
    }, Promise.resolve())
      .then(() => {
        console.log('all done');
      });

  })
  .catch(err => {
    console.error(err);
  });  
