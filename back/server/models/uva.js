'use strict';

module.exports = function (Uva) {

  let getFormatDate = function (date, sustractMonth, day) {
    return new Date(date.getFullYear(), ((date.getMonth()) - sustractMonth), day);
  };

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
      }
      
    );

  };

  Uva.remoteMethod('lastYear', {
    returns: { arg: 'response', type: 'object', root: true },
    http: { path: '/lastYear', verb: 'get' },
  });
};
