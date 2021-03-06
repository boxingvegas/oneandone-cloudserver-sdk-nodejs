/**
 * Created by Ali on 7/28/2016.
 */

var token = process.env.ONEANDONE_TOKEN;
var url = 'https://cloudpanel-api.1and1.com/v1';
var oneandone = require('../lib/liboneandone');
var helper = {};
var assert = require('assert');

helper.assertNoError = function (expectedStatus, response, callback) {
    callback(expectedStatus == response.statusCode);
};

helper.checkServerReady = function (currentServer, callback) {
    var checkServer = {};
    oneandone.getServer(currentServer.id, function (error, response, body) {
        checkServer = JSON.parse(body);
        if ((checkServer.status.state != oneandone.ServerState.POWERED_OFF
          && checkServer.status.state != oneandone.ServerState.POWERED_ON)
          || (checkServer.status.percent != null && checkServer.status.percent != 0)) {
            setTimeout(function () {
                helper.checkServerReady(checkServer, callback);
            }, 20000);
        } else {
            callback();
        }
    });
};

helper.checkServerRemoved = function (currentServer, callback) {
    var checkServer = {};
    if (!currentServer || !currentServer.id) {
        callback();
    }
    oneandone.getServer(currentServer.id, function (error, response, body) {
        checkServer = JSON.parse(body);
        if (!error && response.statusCode == 200) {
            setTimeout(function () {
                helper.checkServerRemoved(checkServer, callback);
            }, 20000);
        } else {
            callback();
        }
    });
};

helper.checkImageReady = function (currentImage, callback) {
    var checkImage = {};
    oneandone.getImage(currentImage.id, function (error, response, body) {
        checkImage = JSON.parse(body);
        if (checkImage.state != "ENABLED"
          || checkImage.state != "ACTIVE") {
            setTimeout(function () {
                helper.checkImageReady(checkImage, callback);
            }, 40000);
        } else {
            callback();
        }
    });
};

helper.checkPrivateNetworkReady = function (currentServer, privateNetwork, callback) {
    var checkPn = {};
    oneandone.getServerPrivateNetwork(currentServer.id, privateNetwork.id,
      function (error, response, body) {
          checkPn = JSON.parse(body);
          if (checkPn.state != oneandone.GenericState.ACTIVE) {
              setTimeout(function () {
                  helper.checkPrivateNetworkReady(currentServer, privateNetwork, callback);
              }, 5000);
          } else {
              callback();
          }
      }
    )
    ;
};

helper.turnOffServer = function (serverToTurnOff, callback) {
    updateData = {
        "action": oneandone.ServerUpdateAction.POWER_OFF,
        "method": oneandone.ServerUpdateMethod.SOFTWARE
    };
    helper.checkServerReady(serverToTurnOff, function () {
        oneandone.updateServerStatus(serverToTurnOff.id, updateData, function (error, response, body) {
            callback();
        });
    });
};

helper.getRandomServerWithMonitoringPolicy = function (callback) {
    var servers = [];
    var currentServer = {};
    oneandone.listServers(function (error, response, body) {
        servers = JSON.parse(body);
        var i = 0;

        function myLoop(i) {
            if (i < servers.length) {
                oneandone.getServer(servers[i].id, function (error1, response1, body1) {
                    currentServer = JSON.parse(body1);
                    if (currentServer.monitoring_policy) {
                        callback(currentServer);
                    } else {
                        myLoop(i + 1);
                    }
                });
            }
        };
        myLoop(0);
    });
};

helper.updateServerData = function (getServer, callback) {
    oneandone.getServer(getServer.id, function (error, response, body) {
        var object = JSON.parse(body);
        callback(object);
    });
};
helper.authenticate = function (oneandone) {
    oneandone.setendpoint(url);
    oneandone.oneandoneauth(token);
};

helper.getToken = function () {
    return token;
};

module.exports = (function () {
    return helper
})()
