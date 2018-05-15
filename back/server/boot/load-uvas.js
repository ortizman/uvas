const Horseman = require('node-horseman');
const cheerio = require('cheerio');
const _ = require('lodash');
const q = require('q');

module.exports = function (app) {
  var horseman = new Horseman();
  var today = new Date();
  let currentDate = (today.getDate() + 1) + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
  horseman
    .userAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36')
    .open('http://www.bcra.gob.ar/PublicacionesEstadisticas/Principales_variables_datos.asp?descri=22&fecha=Fecha_Cvs&campo=Cvs')
    .wait(3000)
    .type('select[name="desde"]', '31/03/2016') // fecha de inicio de computo
    .type('select[name="hasta"]', currentDate.toString())
    .wait(1000)
    .click('.btn-primary')
    .keyboardEvent('keypress', 16777221)
    .waitForSelector('#tabla')
    .wait(2000)
    .html()
    .then(html => processInfo(html))
    .then(uvas => {
      app.models.Uva.create(uvas, function (err, resp) {
        if (err) console.log(err);
        else console.log('Se insertaron las uvas!!');
      });
    })// prints out the number of results
    .close();

  horseman.on('resourceError', function (err) {
    console.log(err);
  });
};

var processInfo = (html) => {
  var def = q.defer();

  try {
    var $ = cheerio.load(html);
    var rows = $('#tabla tbody tr').text().trim();
    var values = rows.split('\n').map(function (e) { return e.trim(); });
    values = _.compact(values);
    var uvas = [];
    for (var index = 0; index < values.length; index = index + 2) {
      const [d, m, y] = values[index].split('/')
      uvas.push({ fecha: new Date(y, m - 1, d), valor: +values[index + 1].replace(/\./g, '').replace(',', '.') });
    }
    console.log(_.head(uvas));
    def.resolve(uvas);
  } catch (error) {
    def.reject(error);
  }

  return def.promise;
};
