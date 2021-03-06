/**
 * Created by Ali on 8/11/2016.
 */

module.exports = {
    ipEndPointPath: "public_ips",

    listPublicIps: function (callback) {
        req.is_get([this.ipEndPointPath], callback)
    },

    listPublicIpsWithOptions: function (options, callback) {
        var path = this.ipEndPointPath;
        if (options) {
            path += "?";
            if (options.page) {
                path += "&page=" + options.page;
            }
            if (options.perPage) {
                path += "&per_page=" + options.perPage;
            }
            if (options.sort) {
                path += "&sort=" + options.sort;
            }
            if (options.query) {
                path += "&q=" + options.query;
            }
            if (options.fields) {
                path += "&fields=" + options.fields;
            }
        }

        req.is_get([path], callback)
    },

    createPublicIp: function (json, callback) {
        req.is_post([this.ipEndPointPath], json, callback)
    },

    getPublicIp: function (ip_id, callback) {
        req.is_get([this.ipEndPointPath, ip_id], callback)
    },

    updatePublicIp: function (ip_id, json, callback) {
        req.is_put([this.ipEndPointPath, ip_id], json, callback)
    },

    deletePublicIp: function (ip_id, callback) {
        req.is_del([this.ipEndPointPath, ip_id], callback)
    },
}