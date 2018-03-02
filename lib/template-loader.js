var cons = require('consolidate')
var loaderUtils = require('loader-utils')
var extname = require('path').extname

module.exports = function (content) {
  this.cacheable && this.cacheable()
  var callback = this.async()
  var query = Object.assign(
    {},
    loaderUtils.getOptions(this)
  )
  if (query.vue && query.vue.template) {
    query = Object.assign(query, query.vue.template)
  }

  function exportContent (content) {
    if (query.raw) {
      callback(null, content)
    } else {
      callback(null, 'module.exports = ' + JSON.stringify(content))
    }
  }

  // with no engine given, use the file extension as engine
  if (!query.engine) {
    query.engine = extname(this.request).substr(1).toLowerCase()
  }

  if (!cons[query.engine]) {
    throw new Error(
      'Template engine \'' + query.engine + '\' ' +
      'isn\'t available in Consolidate.js'
    )
  }

  // for relative includes
  query.filename = this.resourcePath

  cons[query.engine].render(content, query, function (err, html) {
    if (err) {
      throw err
    }
    exportContent(html)
  })
}
