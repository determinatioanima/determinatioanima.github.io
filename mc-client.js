"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * CC client for 3rd party extension
 * 
 */

var cc_client = function () {
    function cc_client(port) {
        _classCallCheck(this, cc_client);

        this.port = port;
        this.baseUrl = "http://localhost:";
        this.asyncCallback = undefined;
    }

    /**
     * Check the connection between Code Connection
     * 
     * @param {callback} asyncCallback - callback to handle return value (true / false)
     * @param {number} timeout - timeout for async ajax
     * 
     */


    _createClass(cc_client, [{
        key: "connectionStatusUpdate",
        value: function connectionStatusUpdate(asyncCallback, timeout) {
            this.asyncCallback = asyncCallback;
            var that = this;
            $.ajax({
                type: "GET",
                url: "" + this.baseUrl + this.port + "/connected",
                timeout: timeout,
                success: function success(data) {
                    // cc responded
                    that.asyncCallback(data);
                    that.asyncCallback = undefined;
                },
                error: function error(jqxhr, textStatus, _error) {
                    // TODO: handle net::ERR_CONNECTION_REFUSED error gracefully
                    that.asyncCallback(false);
                    that.asyncCallback = undefined;
                }
            });
        }
        /**
         * Asynchronous command that calls callback with return value later
         * 
         * @param {string} command - command name
         * @param {function} callback - callback to handle return value
         * @param {string} key - key of the return value in returned json
         * 
         */

    }, {
        key: "async_command",
        value: function async_command(command, callback, key) {
            $.ajax({
                type: "GET",
                url: "" + this.baseUrl + this.port + "/" + command,
                success: function success(data) {
                    console.log("Command : " + command + " success result : " + data.toString());
                    callback(JSON.parse(data)[key]);
                },
                error: function error(jqxhr, textStatus, _error2) {
                    console.log("Command : " + command + " fail", _error2);
                    callback(false);
                }
            });
        }
        /**
         * Synchronous command that waits until getting a result from server
         * 
         * @param {string} command - command name
         * @param {string} key - key of the return value in returned json
         * @returns - result
         * 
         */

    }, {
        key: "sync_command",
        value: function sync_command(command, key) {
            var result;
            $.ajax({
                type: "GET",
                url: "" + this.baseUrl + this.port + "/" + command,
                async: false,
                success: function success(data) {
                    console.log("Command : " + command + " success result : " + data.toString());
                    result = JSON.parse(data)[key];
                },
                error: function error(jqxhr, textStatus, _error3) {
                    console.log("Command : " + command + " fail", _error3);
                    result = false;
                }
            });
            return result;
        }
    }]);

    return cc_client;
}();
