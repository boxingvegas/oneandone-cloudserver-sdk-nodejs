/**
 * Created by Ali on 8/13/2016.
 */
module.exports = {
    pnEndPointPath: "private_networks",

    listPrivateNetworks: function (callback) {
        req.is_get([this.pnEndPointPath], callback)
    },

    listPrivateNetworksWithOptions: function (options, callback) {
        var path = this.pnEndPointPath;
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

    createPrivateNetwork: function (json, callback) {
        req.is_post([this.pnEndPointPath], json, callback)
    },

    getPrivateNetwork: function (pn_id, callback) {
        req.is_get([this.pnEndPointPath, pn_id], callback)
    },

    updatePrivateNetwork: function (pn_id, json, callback) {
        req.is_put([this.pnEndPointPath, pn_id], json, callback)
    },

    deletePrivateNetwork: function (pn_id, callback) {
        req.is_del([this.pnEndPointPath, pn_id], callback)
    },

    listPrivateNetworkServers: function (pn_id, callback) {
        req.is_get([this.pnEndPointPath, pn_id, "servers"], callback)
    },

    attachServerToPrivateNetwork: function (pn_id, json, callback) {
        req.is_post([this.pnEndPointPath, pn_id, "servers"], json, callback)
    },

    getPrivateNetworkServer: function (pn_id, srv_id, callback) {
        req.is_get([this.pnEndPointPath, pn_id, "servers", srv_id], callback)
    },

    detachServerFromPrivateNetwork: function (pn_id, srv_id, json, callback) {
        req.is_del([this.pnEndPointPath, pn_id, "servers", srv_id], json, callback)
    },
}