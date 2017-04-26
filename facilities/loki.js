'use strict'

const _ = require('lodash')
const async = require('async')
const LokiDb = require('lokijs')
const Facility = require('./base')

class Loki extends Facility {

  constructor(caller, opts, ctx) {
    super(caller, opts, ctx)
    
    this.name = 'loki'

    this.init()
  }

  init() {
    super.init()
    this.db = new LokiDb(
      `${__dirname}/../db/${this.name}_${this.opts.name}_${this.opts.label}.db.json`
    )
  }

  _start(cb) {
    async.series([
      next => { super._start(next) },
      next => {
        if (this.opts.persist) {
          this.db.loadDatabase({}, next)
        } else next()
      }
    ], cb)
  }

  _stop(cb) {
    async.series([
      next => { super._stop(next) },
      next => {
        if (this.opts.persist) {
          this.db.saveDatabase(next)
        } else next()
      }
    ], cb)
  }
}

module.exports = Loki
