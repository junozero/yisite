/**
 * Created by JuNoZero on 2015-01-29.
 */
var model = require('../services/base');

function check(req, res, callback) {
    if(!req.session.islogin) {
        console.log('调试日志：新用户');
        req.session.islogin = true;
    } else {
        console.log('调试日志：不是新用户');
    }
    callback();
}

module.exports = function(app, ws) {
    //base add Model Service
    app.get('/base/add', function(req, res) {
        check(req, res, function() {
            var json = model.getJSON(req.query);
            model.save(json, function(err, json) {
                if(err) {
                    res.json({error: err});
                    return;
                }
                res.json({success: 1, data: json});
            });
        });
    });

    //base update Model Service
    app.get('/base/update', function(req, res) {
        check(req, res, function() {
            var json = model.getJSON(req.query);
            model.update(json, function(err, json) {
                if(err) {
                    res.json({error: err});
                    return;
                }
                res.json({success: 1, data: json});
            });
        });
    });

    //base get model Service
    app.get('/base/get', function(req, res) {
        check(req, res, function() {
            var json = model.getJSON(req.query);
            model.get(json, function(err, json) {
                if(err) {
                    res.json({error: err});
                    return;
                }
                res.json({success: 1, data: json});
            });
        });
    });

    //base remove model Service
    app.get('/base/remove', function(req, res) {
        check(req, res, function() {
            var json = model.getJSON(req.query);
            model.remove(json, function(err, json) {
                if(err) {
                    res.json({error: err});
                    return;
                }
                res.json({success: 1, data: json});
            });
        });
    });

    //base get list Service
    app.get('/base/list', function(req, res) {
        var json = model.getJSON(req.query);
        model.list(json, function(err, json) {
            if(err) {
                res.json({error: err});
                return;
            }
            res.json({success: 1, data: json});
        });
    });

    //base get page Service
    app.get('/base/page', function(req, res) {
        var json = model.getJSON(req.query);
        model.page(json, function(err, json) {
            if(err) {
                res.json({error: err});
                return;
            }
            res.json({success: 1, data: json});
        });
    });

    //websocket broadcast to all client
    app.get('/base/wsbroadcast', function(req, res) {
        var json = model.getJSON(req.query);
        ws.broadall(json.event, json.data);
        res.json({success: 1});
    });
};
