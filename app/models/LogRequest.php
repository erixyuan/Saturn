<?php

class LogRequest extends Eloquent {

    //在初始化这个类的时候创建sqlite链接
    function __construct() {
        //创建实例
        $date = date('Ym', time());

        Config::set('database.connections.sqlite', [
                'driver'   => 'sqlite',
                'database' => 'database/logrequest_' . $date . '.db',
                'prefix'   => '',
            ]);
        $this->checkLogfile($date);
    }

    function checkLogfile() {
        //如果没有这个文件,说明月份更新了,需要新建数据库
        $path = Config::get('database.connections.sqlite.database');
        if (!file_exists($path) && is_dir(dirname($path))) {
            helper::mkdirs('database');
            touch($path);
            Schema::connection('sqlite')->create('requests', function($table) {
                $table->increments('id');
                $table->string('ip', 50);
                $table->string('ua', 200);
                $table->string('url', 100);
                $table->string('referer', 100);
                $table->string('from', 32);
                $table->integer('from_id');
                $table->string('request_type', 32);
                $table->string('request_method', 32);
                $table->string('resource_type', 32);
                $table->integer('resource_id');
                $table->integer('parent');
                $table->integer('created');
            });
        }
    }

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table   = 'requests';
    public $connection = 'sqlite';
    //关闭时间戳维护
    public $timestamps = false;
    protected static $unguarded = true;

}
