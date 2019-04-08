'use strict';

module.exports = function (Uva) {

  let getFormatDate = function (date, sustractMonth, day) {
    return new Date(date.getFullYear(), ((date.getMonth()) - sustractMonth), day);
  };

  let variation = (act, ant) => {
    return ((act[0].$valor - ant[0].$valor) / ant[0].$valor) * 100;
  }

  Uva.variationInterYear = (cb) => {
    let d = new Date();

    Uva.find(
      {
        where: {
          fecha: getFormatDate(d, 12, d.getDate())
        },
        order: 'fecha ASC'
      },
      (err, ant) => {
        if (!err) {
          Uva.find(
            {
              where: {
                fecha: getFormatDate(d, 0, d.getDate())
              }
            },
            (err, act) => {
              cb(err, variation(act, ant))
            })
        } else {
          cb(err, null)
        }
      }

    );

  }

  Uva.acumulateLastYear = (cb) => {
    let d = new Date();

    Uva.find({
        where: {
          fecha: getFormatDate(d, d.getMonth(), 1)
        },
        order: 'fecha ASC'
      },
      (err, ant) => {
        if (!err) {
          Uva.find({
              where: {
                fecha: getFormatDate(d, 0, d.getDate())
              }
            },
            (err, act) => {
              cb(err, variation(act, ant))
            })
        } else {
          cb(err, null)
        }
      });
  }

  Uva.acumulateLastMonth = (cb) => {
    let d = new Date();

    Uva.find({
        where: {
          fecha: getFormatDate(d, 0, 1)
        },
        order: 'fecha ASC'
      },
      (err, ant) => {
        if (!err) {
          Uva.find({
              where: {
                fecha: getFormatDate(d, 0, d.getDate())
              }
            },
            (err, act) => {
              cb(err, variation(act, ant))
            })
        } else {
          cb(err, null)
        }
      });
  }

  Uva.lastYear = function (cb) {
    var d = new Date();

    var cond = []

    for (let i = 0; i <= d.getMonth(); i++) {
      cond.push(
        {
          fecha: {
            between: [getFormatDate(d, i, 0), getFormatDate(d, i, 1)]
          }
        })
    }

    // Agrego la fecha actual
    cond.push({
      fecha: {
        between: [getFormatDate(d, 0, d.getDate()), getFormatDate(d, 0, d.getDate())]
      }
    })

    Uva.find(
      {
        where: {
          or: cond,
        },
        order: 'fecha ASC'
      },
      (err, uvas) => {
        // Elimino el primer elemento del array
        if (!err) {
          uvas.shift()
          cb(null, uvas)
        } else {
          cb(err, null)
        }
      });
  };

  Uva.remoteMethod('lastYear', {
    returns: { arg: 'response', type: 'object', root: true },
    http: { path: '/lastYear', verb: 'get' },
  });

  Uva.remoteMethod('variationInterYear', {
    returns: { arg: 'response', type: 'object', root: true },
    http: { path: '/variationInterYear', verb: 'get' },
  });

  Uva.remoteMethod('acumulateLastYear', {
    returns: { arg: 'response', type: 'object', root: true },
    http: { path: '/acumulateLastYear', verb: 'get' },
  });

  Uva.remoteMethod('acumulateLastMonth', {
    returns: { arg: 'response', type: 'object', root: true },
    http: { path: '/acumulateLastMonth', verb: 'get' },
  });
};

