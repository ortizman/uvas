const Horseman = require('node-horseman');
const cheerio = require('cheerio');
const _ = require('lodash');
const q = require('q');

module.exports = function (app) {
  var horseman = new Horseman();
  var today = new Date();
  let currentDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + (today.getDate() + 1)).slice(-2);
  horseman
    .userAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36')
    .open('http://www.bcra.gob.ar/PublicacionesEstadisticas/Principales_variables_datos.asp?serie=7913&detalle=Unidad%20de%20Valor%20Adquisitivo%20(UVA)%A0(en%20pesos%20-con%20dos%20decimales-,%20base%2031.3.2016=14.05)')
    .wait(6000)
    .type('input[name="fecha_desde"]', '2016-03-31') // fecha de inicio de computo
    .type('input[name="fecha_hasta"]', currentDate.toString())
    .click('.btn-primary')
    .waitForSelector('.table')
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
    var rows = $('.table tbody tr').text().trim();
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
