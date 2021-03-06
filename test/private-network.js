/**
 * Created by Ali on 8/13/2016.
 */
var assert = require('assert');
var oneandone = require('../lib/liboneandone');
var helper = require('../test/testHelper');
var privateNetwork = {};
var server = {};
var appliance = {};
var dataCenter = {};


describe('Private Network tests', function () {
    this.timeout(900000);

    before(function (done) {
        helper.authenticate(oneandone);
        var options = {
            query: "centos"
        };
        oneandone.listServerAppliancesWithOptions(options, function (error, response, body) {
            var res = JSON.parse(body);
            appliance = res[0];
            var options = {
                query: "us"
            };
            oneandone.listDatacentersWithOptions(options, function (error, response, body) {
                var res1 = JSON.parse(body);
                dataCenter = res1[0];
            });
            var serverData = {
                "name": "Node privatenetwork server",
                "description": "description",
                "hardware": {
                    "vcore": 2,
                    "cores_per_processor": 1,
                    "ram": 2,
                    "hdds": [
                        {
                            "size": 40,
                            "is_main": true
                        }
                    ]
                },
                "appliance_id": appliance.id,
                "datacenter_id": dataCenter.id
            };
            oneandone.createServer(serverData, function (error, response, body) {
                server = JSON.parse(body);
                var pnData = {
                    "name": "node Private Network",
                    "description": "node Private network description",
                    "network_address": "192.168.1.0",
                    "subnet_mask": "255.255.255.0"
                };
                helper.checkServerReady(server, function () {
                    oneandone.createPrivateNetwork(pnData, function (error, response, body) {
                        helper.assertNoError(202, response, function (result) {
                            assert(result);
                        });
                        assert.notEqual(response, null);
                        privateNetwork = JSON.parse(body);
                        done();
                    });
                });
            });
        });
    });

    removeServer = function (serverToRemove, callback) {
        if (serverToRemove.id) {
            helper.checkServerReady(serverToRemove, function () {
                oneandone.deleteServer(serverToRemove.id,false, function (error, response, body) {
                    callback();
                });
            });
        }
        else {
            callback();
        }
    };

    removePrivateNetwork = function (toRemove, serverData, callback) {
        if (toRemove.id) {
            helper.checkPrivateNetworkReady(serverData, toRemove, function () {
                oneandone.deletePrivateNetwork(toRemove.id, function (error, response, body) {
                    callback();
                });
            });
        }
        else {
            callback();
        }
    };

    after(function (done) {
        removePrivateNetwork(privateNetwork, server, function () {
            setTimeout(function () {
                removeServer(server, function () {
                    done();
                });
            }, 100000);
        });
    });

    it('List Private Networks', function (done) {
        setTimeout(function () {
            oneandone.listPrivateNetworks(function (error, response, body) {
                helper.assertNoError(200, response, function (result) {
                    assert(result);
                });
                assert.notEqual(response, null);
                assert.notEqual(body, null);
                var object = JSON.parse(body);
                assert(object.length > 0);
                done();
            });
        }, 7000);
    });

    it('List Private Networks with options', function (done) {
        var options = {
            query: "node"
        };
        setTimeout(function () {
            oneandone.listPrivateNetworksWithOptions(options, function (error, response, body) {
                helper.assertNoError(200, response, function (result) {
                    assert(result);
                });
                assert.notEqual(response, null);
                assert.notEqual(body, null);
                var object = JSON.parse(body);
                assert(object.length > 0);
                done();
            });
        }, 5000);
    });

    it('Get Private Network', function (done) {
        oneandone.getPrivateNetwork(privateNetwork.id, function (error, response, body) {
            helper.assertNoError(200, response, function (result) {
                assert(result);
            });
            assert.notEqual(response, null);
            assert.notEqual(body, null);
            var object = JSON.parse(body);
            assert.equal(object.id, privateNetwork.id);
            done();
        });
    });

    it('Update Private Network', function (done) {
        updateData = {
            "name": "node update Private Network",
            "description": "Private network description",
            "network_address": "192.168.1.0",
            "subnet_mask": "255.255.255.0"
        };
        oneandone.updatePrivateNetwork(privateNetwork.id, updateData, function (error, response, body) {
            helper.assertNoError(200, response, function (result) {
                assert(result);
            });
            assert.notEqual(response, null);
            assert.notEqual(body, null);
            var object = JSON.parse(body);
            assert.equal(object.name, updateData.name);
            done();
        });
    });

    it('Attach server to Private Network', function (done) {
        setTimeout(function () {
            helper.updateServerData(server, function (updatedServer) {
                server = updatedServer;
                attach = {
                    "servers": [
                        server.id
                    ]
                };
                oneandone.attachServerToPrivateNetwork(privateNetwork.id, attach, function (error, response, body) {
                    helper.assertNoError(202, response, function (result) {
                        assert(result);
                    });
                    assert.notEqual(response, null);
                    assert.notEqual(body, null);
                    done();
                });
            });
        }, 10000);
    });

    it('List Private Network server', function (done) {
        helper.checkPrivateNetworkReady(server, privateNetwork, function () {
            oneandone.listPrivateNetworkServers(privateNetwork.id, function (error, response, body) {
                helper.assertNoError(200, response, function (result) {
                    assert(result);
                });
                assert.notEqual(response, null);
                assert.notEqual(body, null);
                var object = JSON.parse(body);
                assert(object.length > 0);
                done();
            });
        });
    });

    it('Get Private Network server', function (done) {
        oneandone.getPrivateNetworkServer(privateNetwork.id, server.id, function (error, response, body) {
            helper.assertNoError(200, response, function (result) {
                assert(result);
            });
            assert.notEqual(response, null);
            assert.notEqual(body, null);
            var object = JSON.parse(body);
            assert.equal(object.id, server.id);
            done();
        });
    });

    it('Delete Private Network server', function (done) {
        helper.turnOffServer(server, function () {
            helper.checkServerReady(server, function () {
                helper.checkPrivateNetworkReady(server, privateNetwork, function () {
                    oneandone.detachServerFromPrivateNetwork(privateNetwork.id, server.id, function (error, response, body) {
                        helper.assertNoError(202, response, function (result) {
                            assert(result);
                        });
                        assert.notEqual(response, null);
                        assert.notEqual(body, null);
                        var object = JSON.parse(body);
                        assert.equal(object.id, privateNetwork.id);
                        done();
                    });
                });
            });
        });
    });
})
;

