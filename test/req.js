/**
 * Created by Ali on 7/28/2016.
 */
var assert = require('assert');
var oneandone = require('../lib/liboneandone');
var helper = require('../test/testHelper');

describe('req tests', function () {
    this.timeout(20000);

    it('Set full header', function (done) {
        oneandone.fullheader();
        assert.equal(oneandone.options.headers['Content-Type'], 'application/json');
        done();
    });

    it('Set put header', function (done) {
        oneandone.putheader();
        assert.equal(oneandone.options.headers['Content-Type'], 'application/json');
        done();
    });

    it('oneandone authentication', function (done) {
        oneandone.oneandoneauth(helper.getToken());
        assert.equal(oneandone.options.headers['X-TOKEN'], helper.getToken());
        done();
    });

    it('Make URL', function (done) {
        var url = oneandone.mk_url(["servers", "{server_id}", "ips", "{ip_id}", "load_balancers", "{load_balancer_id}"], function (data) {
        });
        assert.equal(url, 'https://cloudpanel-api.1and1.com/v1/servers/{server_id}/ips/{ip_id}/load_balancers/{load_balancer_id}');
        done();
    });

    it('Delete request', function (done) {
        oneandone.is_del(["servers", "{server_id}", "ips", "{ip_id}", "load_balancers", "{load_balancer_id}"], function (error, response, body) {
            assert.equal(error, null);
            assert.notEqual(response, null);
            assert.notEqual(body, null);
            assert.equal(oneandone.options.url, 'https://cloudpanel-api.1and1.com/v1/servers/{server_id}/ips/{ip_id}/load_balancers/{load_balancer_id}');
            assert.equal(oneandone.options.headers['Content-Type'], 'application/json');
            assert.equal(response.request.method, "DELETE");
            done();
        });
    });

    it('Get request', function (done) {
        oneandone.is_get(["servers", "{server_id}", "private_networks", "{private_network_id}"], function (error, response, body) {
            assert.equal(error, null);
            assert.notEqual(response, null);
            assert.notEqual(body, null);
            assert.equal(oneandone.options.url, 'https://cloudpanel-api.1and1.com/v1/servers/{server_id}/private_networks/{private_network_id}');
            assert.equal(oneandone.options.headers['Content-Type'], 'application/json');
            assert.equal(response.request.method, "GET");
            done();
        });
    });

    it('Put request', function (done) {
        oneandone.is_put(["servers", "{server_id}", "ips", "{ip_id}", "firewall_policy"], {"test": "true"}, function (error, response, body) {
            assert.equal(error, null);
            assert.notEqual(response, null);
            assert.notEqual(body, null);
            assert.equal(oneandone.options.url, 'https://cloudpanel-api.1and1.com/v1/servers/{server_id}/ips/{ip_id}/firewall_policy');
            assert.equal(oneandone.options.body, '{"test":"true"}');
            assert.equal(oneandone.options.headers['Content-Type'], 'application/json');
            assert.equal(response.request.method, "PUT");
            done();
        });
    });

    it('Post request', function (done) {
        oneandone.is_post(["servers", "{server_id}", "ips", "{ip_id}", "load_balancers"], {"test": "true"}, function (error, response, body) {
            assert.equal(error, null);
            assert.notEqual(response, null);
            assert.notEqual(body, null);
            assert.equal(oneandone.options.url, 'https://cloudpanel-api.1and1.com/v1/servers/{server_id}/ips/{ip_id}/load_balancers');
            assert.equal(oneandone.options.body, '{"test":"true"}');
            assert.equal(oneandone.options.headers['Content-Type'], 'application/json');
            assert.equal(response.request.method, "POST");
            done();
        });
    });


    //This method is dangerous, if used it will case epic failure on all other requests
    //Error: options.uri must be a path when using options.baseUrl
    it('Set endpoint', function (done) {
        oneandone.setendpoint('http://test.endpoint.com');
        assert.equal(oneandone.options.baseUrl, 'http://test.endpoint.com');
        oneandone.setendpoint('https://cloudpanel-api.1and1.com/v1');
        done();
    });

});