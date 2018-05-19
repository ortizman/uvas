'use strict';

module.exports = function (Uva) {

  let getFormatDate = function (date, sustractMonth, day) {
    return date.getFullYear() + '-' + '0' + ((date.getMonth() + 1) - sustractMonth) + '-' + day;
  };

  Uva.lastYear = function (cb) {
    var d = new Date();

    var cond = []

    for (let i = 0; i <= d.getMonth(); i++) {
      cond.push(
        {
          fecha:{
            between:[getFormatDate(d, i, '01'), getFormatDate(d, i, '02')]
          }
        })
      
    }

    Uva.find(
      {
        where: {
          or: cond,
        },
      },
      cb
    );

  };

  Uva.remoteMethod('lastYear', {
    returns: { arg: 'response', type: 'object', root: true },
    http: { path: '/lastYear', verb: 'get' },
  });
};
