/**
 * Sockets crud
 * @type {Object}
 */
class RestfullWS {
  constructor(socket, options) {
    this._options = options;
    this._models = require('require-all')({
      dirname: `${__dirname}${this._options.path}`
    });
    this._socket = socket;
  }

  /**
   * [get description]
   * @param  {Function} cb    [description]
   * @param  {Function} errCb [description]
   * @return {Promise}        [description]
   */
  read(cb = false, errCb = false) {
    return new Promise((resolve, reject) => {
      Object.keys(this._models).forEach(name => {
        this._socket.on(`read:${name}s`, () => {
          this._models[name].find({}, (err, results) => {
            if (err) {
              errCb ? errCb(err) : reject({error: err});
            } else {
              cb ? cb(results) : resolve(results);
            }
          })
        })
      })
    })
  };

  create(cb = false, errCb = false) {
    return new Promise((resolve, reject) => {
      Object.keys(this._models).forEach(name => {
        this._socket.on(`create:${name}s`, (data) => {
          const newModel = new this._models[name];
          Object.assign(newModel, data);
          newModel.save(err => {
            if (err) {
              errCb ? errCb(err) : reject({error: err});
            } else {
              cb ? cb(newModel) : resolve(newModel);
            }
          })
        })
      })
    })
  };

  update(cb, errCb) {
    return new Promise((resolve, reject) => {
      Object.keys(this._models).forEach(name => {
        this._socket.on(`update:${name}s`, (data) => {
          if (!Array.isArray(data)) {
            data = [data];
          }
          Object.keys(data).forEach(mid => {
            this._models[name].findById(mid, (err, result) => {
              if (err) {
                reject(err);
              } else {
                Object.assign(result, data[mid]);
                result.save(err => {
                  if (err) {
                    errCb ? errCb(err) : reject({error: err});
                  } else {
                    cb ? cb(result) : resolve(result);
                  }
                })
              }
            })
          })

        })
      })
    })
  };

  delete(cb, errCb) {
    return new Promise((resolve, reject) => {
      Object.keys(this._models).forEach(name => {
        this._socket.on(`delete:${name}s`, (data) => {
          if (!Array.isArray(data)) {
            data = [data];
          }
          data.forEach(mid => {
            this._models[name].remove({_id: mid}, err => {
              if (err) {
                errCb ? errCb(err) : reject({error: err});
              } else {
                cb ? cb(mid) : resolve(mid);
              }
            })
          })
        })
      })
    })
  };
}

module.exports = RestfullWS;
