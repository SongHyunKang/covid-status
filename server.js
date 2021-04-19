var express = require('express')
var request = require('request')
var app = express()

// http://localhost:3000/api/getList 에 컨트롤러 매핑
app.get('/api/getList', function(req, res) {
  const query = Object.entries(req.query).map(e => e.join('=')).join('&')
  const url = `http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson?${query}`
  request({
    url, // url + params
    method: 'get', // method
  }, (error, response, body) => {
    res.send(response)
  })
})
app.listen(3000) // port