/**
 * Created by JuNoZero on 2015-01-29.
 */
var path = require('path'),
    _ = require('underscore'),
    express = require('express'),
    session = require('express-session'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    ajax = require('./routes/ajax'),
    websocket = require('./routes/websocket'),
    db = require('./db/db');

//main setting
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

//web services setting
websocket.init(io);

//globa Error Excpetion
process.on('uncaughtException', function(err) {
    console.log('系统进程发生致命性的错误，原因：' + err);
});

/**
 * 创建app，并公布app和ws参数用于扩展service和websocket，start方法用于启动web服务线程。
 *
 * @param
 * {
 *      appname: string,    // 项目名称，用于定义内置数据库名称，默认值为yisite。
 *      port: number,       // 用于描述服务使用的端口，默认80。
 *      nosafe: true,       // 开放不安全接口，建议正式项目中，禁用该属性。
 *                          // 当开放该接口时，默认提供/base/add、/base/list等方法，不限制session进行访问，可方便快速开发和调试。
 *                          // 建议正式项目中禁用该选项，并且自己按需编写servie，具体利用app变量，参考express进行编写。
 *
 *      webpath: string,    // 用于描述前端静态资源的目录，通常是前端网页的相关资源，默认是项目跟目录的public目录，建议不要修改。
 *      dbpath: string      // 用于描述数据库连接，默认为空，既使用内置的mongodb数据库（目前仅支持window下）。
 *                          // 当配置该属性后，使用外部数据库，参考：dbusername:dbpassword@dburl:dbport/dbname。
 *                          // 目前仅支持monbodb。
 * }
 *
 * @returns
 * {
 *      app: express对象，可用于扩展service接口,
 *      ws: socket.io对象，可用于扩展ws接口,
 *      start: Function，启动服务，并调用callback方法。
 * }
 */
function createApplication(configs) {
    var defaults = {
        appname: 'yisite',
        port: 80,
        nosafe: true,
        webpath: path.join(__dirname + path.sep + '..' + path.sep + '..' + path.sep + '..' + path.sep, 'public'),
        dbpath: null
    };

    _.extend(defaults, configs);

    //start mongodb
    db.startDB(defaults.appname, defaults.dbpath);

    //set web path
    app.use(express.static(defaults.webpath));

    //start nosafe service
    if(defaults.nosafe) {
        ajax(app, websocket);
    }

    return {
        app: app,
        ws: websocket,

        //main
        start: function(callback) {
            server.listen(defaults.port, callback);
        }
    }
}

//exports
module.exports = createApplication;