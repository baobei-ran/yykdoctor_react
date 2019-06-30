import axios from 'axios';
var baseURL = 'http://test99.yunyikang.cn';  // 测试
// var baseURL = 'https://www.yunyikang.cn'; // 正式

var http = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  },
  transformRequest: [function (data) {
    if (typeof data === 'object') {
        var newData = '';
    for (var k in data) {
        if (data.hasOwnProperty(k) === true) {
            newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
        }
    }
        return newData;
    }
        return data;
  }]
});

function apiAxios(method, url, params, response) {
  http({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
  }).then(function (res) {
    response(res);
  }).catch(function (err) {
    console.log(err);
  })
}


var $http = {
  get: function (url, params, response) {
    return apiAxios('GET', url, params, response)
  },
  post: function (url, params, response) {
    return apiAxios('POST', url, params, response)
  },
  put: function (url, params, response) {
    return apiAxios('PUT', url, params, response)
  },
  delete: function (url, params, response) {
    return apiAxios('DELETE', url, params, response)
  },
  baseURL: baseURL,
  $postJson (url, data, headers, response, error) {
      axios({
          method: 'post',
          url: baseURL+url,
          data: data,
          headers: headers? headers : {"Content-Type":"application/json;charset=UTF-8"}
      }).then(res => { response(res)}).catch(err => { error(err) })
  }
}

export default $http