#YISITE
YISITE，译为yi和site，yi代表拼音中的“一”，site代表website，整体译为**“一站式”的网站开发框架**。

这是一个快速的，整体的WEB框架，但它主要面向的是**前端攻城师**，我们关注的是**public目录**下的快速开发。**但它是不安全的（没有安全验证、拦截、传输加密等），它寻求的是提供快速和高效搭建web app所需的服务端框架。**

**yisite集成monbodb，但目前仅支持windows平台，其它平台如需使用请自行替换对应操作系统版本的mongodb或配置外部的数据库连接**


---
##一、历史版本


###0.0.2

1、get方法增加_id的查询支持，只有get支持，参考{ tablename: 'syuser', field: '_id', value: 'id' }
2、增加“[:now]”特殊处理，当传输的json当中含有“[:now]”，既会替换成服务器的时间，new Date().getTime()

###0.0.1

1、初次发布。


---
##二、安装
```
npm install yisite --save
```


---
##三、Hello Word
###目录
![](http://images.54646a963df08.d01.nanoyun.com/QQ20141202165254.png)


###index.html
public/index.html
```
<!DOCTYPE html>
<html>
<head lang="zh-CN">
    <meta charset="UTF-8">
    <title>Hello Yi Site</title>
</head>
<body>
	Hello Yi Site
</body>
</html>
```


###app.js
```
var yisite = require('yisite')({
		appname: 'helloyisite',
		port: 80
	});

yisite.start(function() {
    console.log('Server listening on port ' + port);
});
```


###启动
```
node app.js
```


---
##四、YISITE API
```
require('yisite')(config);

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
```


---
##五、快速的一站式解决方案
public/index.html，作为前端工程师，我们只需要关注public目录。


###完整的demo
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Hello Yi Site</title>

	<!-- include jQuery lib -->
    <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>

    <script type="text/javascript">
        function add() {
            var json = {
                tablename: 'syuser',
                check: ['name'],
                checkmsg: '用户已存在，不能重复添加！',
                data: {
                    name: 'test',
                    rename: '测试',
                    age: 27
                }
            };
            service('/base/add', json, function(json) {
                if(json.success) {
                    alert('添加成功！');
                } else {
                    alert('添加失败！错误原因：' + json.error);
                }
            });
        }

        function get() {
            var json = {
                tablename: 'syuser',
                field: 'name',
                value: 'test'
            };
            service('/base/get', json, function(json) {
                if(json.success) {
                    alert(JSON.stringify(json.data));
                } else {
                    alert('获取失败！错误原因：' + json.error);
                }
            });
        }

        function mod() {
            var json = {
                tablename: 'syuser',
                query: {
                    name: 'test'
                },
                data: {
                    rename: '测试用户名称修改',
                    age: 20
                }
            };
            service('/base/update', json, function(json) {
                if(json.success) {
                    alert(JSON.stringify(json.data));
                } else {
                    alert('修改失败！错误原因：' + json.error);
                }
            });
        }

        function del() {
            var json = {
                tablename: 'syuser',
                query: {
                    name: 'test'
                }
            };
            service('/base/remove', json, function(json) {
                if(json.success) {
                    alert(JSON.stringify(json.data));
                } else {
                    alert('删除失败！错误原因：' + json.error);
                }
            });
        }

        function list() {
            var json = {
                tablename: 'syuser'
            };
            service('/base/list', json, function(json) {
                if(json.success) {
                    alert(JSON.stringify(json.data));
                } else {
                    alert('查询失败！错误原因：' + json.error);
                }
            });
        }

        function page() {
            var json = {
                tablename: 'syuser',
                pagenum: 1,
                pagesize: 20,
                query: {
                    name: 'test'
                },
                sort: {
	                name: 1
	            }
            };
            service('/base/page', json, function(json) {
                if(json.success) {
                    alert(JSON.stringify(json.data));
                } else {
                    alert('查询失败！错误原因：' + json.error);
                }
            });
        }

        function service(url, data, callback) {
            $.ajax({
                dataType: 'json',
                url: url,
                data: {
	                // 交互数据核心部分，需把json转成字符串并且url编码后，
	                // 通过yijson字段传输到后台，如使用nodejs原生的
	                // querystring会导致数字也变为字符串导致
	                // mongobd保存数据异常和排序报错，如：
	                // sort: { name : 1 }，使用原生的，后台会解析成'sort': { 'name' : '1' }
	                // 导致mongodb查询错误。
	                // 
	                // * 使用以下方式可以正常。
	                yijson: encodeURIComponent(JSON.stringify(data))
                },
                cache: false,
                success: function(json) {
                    callback(json);
                }
            });
        }
    </script>
</head>
<body>
    <button onclick="add()">添加</button>
    <button onclick="get()">获取</button>
    <button onclick="mod()">修改</button>
    <button onclick="del()">删除</button>
    <button onclick="list()">列表</button>
    <button onclick="page()">分页排序</button>
</body>
</html>
```


###添加
URL：/base/add
可直接提交json数据到/base/add进行保存，tablename为需要保存的数据表名，添加时可通过check数组对字段内容是否有重复进行检查。
```
function add() {
    var json = {
        tablename: 'syuser',
        check: ['name'],
        checkmsg: '用户已存在，不能重复添加！',
        data: {
            name: 'test',
            rename: '测试',
            age: 27
        }
    };
    service('/base/add', json, function(json) {
        if(json.success) {
            alert('添加成功！');
        } else {
            alert('添加失败！错误原因：' + json.error);
        }
    });
}
```


###获取Item
URL：/base/get
通过tablename、field和值从数据库获取对应的记录，如需复合条件进行查询，请使用list接口。
```
function get() {
    var json = {
        tablename: 'syuser',
        field: 'name',
        value: 'test'
    };
    service('/base/get', json, function(json) {
        if(json.success) {
            alert(JSON.stringify(json.data));
        } else {
            alert('获取失败！错误原因：' + json.error);
        }
    });
}
```


###修改
URL：/base/update
query值为查询记录的条件，data为需要修改的值。
```
function mod() {
    var json = {
        tablename: 'syuser',
        query: {
            name: 'test'
        },
        data: {
            rename: '测试用户名称修改',
            age: 20
        }
    };
    service('/base/update', json, function(json) {
        if(json.success) {
            alert(JSON.stringify(json.data));
        } else {
            alert('修改失败！错误原因：' + json.error);
        }
    });
}
```


###删除
URL：/base/remove
```
function del() {
    var json = {
        tablename: 'syuser',
        query: {
            name: 'test'
        }
    };
    service('/base/remove', json, function(json) {
        if(json.success) {
            alert(JSON.stringify(json.data));
        } else {
            alert('删除失败！错误原因：' + json.error);
        }
    });
}
```


###获取list
URL：/base/list
query为查询条件，sort为排序，query和sort均支持mongodb语法，也可以不带对应参数。
```
function list() {
    var json = {
        tablename: 'syuser'
    };
    service('/base/list', json, function(json) {
        if(json.success) {
            alert(JSON.stringify(json.data));
        } else {
            alert('查询失败！错误原因：' + json.error);
        }
    });
}
```


###获取page
URL：/base/page
query为查询条件，sort为排序，query和sort均支持mongodb语法。
```
function page() {
    var json = {
        tablename: 'syuser',
        pagenum: 1,
        pagesize: 20,
        query: { name: 'test' },
        sort: { name: 1 }
    };
    service('/base/page', json, function(json) {
        if(json.success) {
            alert(JSON.stringify(json.data));
        } else {
            alert('查询失败！错误原因：' + json.error);
        }
    });
}
```


---
##六、集成SOCKET.IO，支持websocket
yisite集成socket.io，支持websocket

```
<!DOCTYPE html>
<html>
<head lang="zh-CN">
    <meta charset="UTF-8">
    <title>Hello Word</title>

    <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
    <script src="http://cdn.bootcss.com/socket.io/1.3.2/socket.io.min.js"></script>

    <script type="text/javascript">
        var socket;
        
        $(function() {
            socket = io('/');
            
            socket.on('broadcast', function(data) {
               $('#newmsg').text(data.msg); 
            });
        });
        
        function send() {
            var msg = $('#sendmsg').val();
            service('/base/wsbroadcast', { event: 'broadcast', data: {msg: msg} });
        }
    </script>
</head>
<body>
<input type="text" id="sendmsg" style="width:300px;"/>
<button onclick="send()">广播消息</button>
<br><br>
最新消息：<span id="newmsg"></span>
</body>
</html>
```


---
##七、使用外部的数据库
yisite支持外部数据库的连接，但目前仅支持mongodb。

```
var dburl = 'dbuser:dbpassword@dburl:dbport/dbname';
var yisite = require('yisite')({
		appname: 'helloyisite',
		port: 80,
		dbpath: dburl
	});

yisite.start(function() {
    console.log('Server listening on port ' + port);
});
```