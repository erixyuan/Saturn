<?php

class ManageStatistic extends \BaseController {

    private $group_by;
    private $range_from;
    private $range_to;

    //缓存时间
    const CACHE_MINUTES = 10;

    /**
     *  检查输入的时间范围
     *
     *
     *  @access public
     *  @return void
     */
    public function checkRangeInput() {
        $this->group_by = Input::get('group_by', 'day');

        $this->range_from = Input::get('from', strtotime('-6 day')); //? strtotime($range_from) : strtotime(date('Y-m-d', ));
        $this->range_to   = Input::get('to', strtotime('+1 day')); //$range_to ? strtotime($range_to) : strtotime(date('Y-m-d', strtotime('+1 day')));
        //检查时间输入
        $timeleap         = $this->range_to - $this->range_from;
        if ($timeleap < 0) {
            return [
                'errCode' => 1,
                'msg'     => '选择的时间范围有误'
            ];
        }
        $monthleap = $this->_getMonthLeap($this->range_from, $this->range_to);
        if ($monthleap > 2) {
            return [
                'errCode' => 2,
                'msg'     => '选择的时间范围大于两个月'
            ];
        }
        return '';
    }

    /**
     *  获取pv/ip统计
     *
     *
     *  @access public
     *  @return void
     */
    public function getPv() {
        if ($fail = $this->checkRangeInput()) {
            return $fail;
        }

        $ranges = $this->_fetchRanges();
        $key    = 'stat_pv_' . md5(serialize([$this->range_from, $this->range_to, $this->group_by]));
        $data   = Cache::get($key);
        if (!$data) {
            foreach ($ranges as $pos => $range) {
                $data[$pos]['pv'] = LogRequest::where('parent', 0)
                        ->where('created', '>', $range['begin'])
                        ->where('created', '<', $range['end'])
                        ->count();
                $data[$pos]['ip'] = LogRequest::where('parent', 0)
                        ->where('created', '>', $range['begin'])
                        ->where('created', '<', $range['end'])
                        ->distinct()
                        ->count('ip');
            }
            //指定缓存tag以便清除
            Cache::put($key, $data, self::CACHE_MINUTES);
        }
        //3225
        //2958
        return [
            'ranges'  => array_values($ranges),
            'data'    => array_values($data),
            'errCode' => 0
        ];
    }

    /**
     *  获取api访问统计
     *
     *
     *  @access public
     *  @return void
     */
    function getApi() {
        if ($fail = $this->checkRangeInput()) {
            return $fail;
        }
        $ranges    = $this->_fetchRanges();
        $apps_name = array(
            0 => '默认',
        );

        $key = 'stat_api_' . md5(serialize([$this->range_from, $this->range_to, $this->group_by]));

        if ($data = Cache::get($key)) {
            
        } else {
            foreach ($ranges as $pos => $range) {
                $data[$pos]['request_times'] = [
                    $apps_name[0] => '0',
                ];
                $data[$pos]['downloads']     = [
                    $apps_name[0] => '0',
                ];

                $request_times = LogRequest::select('from_id', DB::raw('count(*) as total'))
                                ->where('parent', 0)
                                ->where('from', 'api')
                                ->where('created', '>', $range['begin'])
                                ->where('created', '<', $range['end'])
                                ->groupBy('from_id')
                                ->get()->toArray();

                $downloads = LogRequest::select('from_id', DB::raw('count(*) as total'))
                                ->where('parent', 0)
                                ->where('from', 'app')
                                ->where('created', '>', $range['begin'])
                                ->where('created', '<', $range['end'])
                                ->groupBy('from_id')
                                ->get()->toArray();

                foreach ($request_times as $row) {
                    $row['from_id']                                           = $row['from_id'] ? $row['from_id'] : 0;
                    $data[$pos]['request_times'][$apps_name[$row['from_id']]] = $row['total'];
                }
                foreach ($downloads as $download) {
                    $download['from_id']                                       = $download['from_id'] ? $download['from_id'] : 0;
                    $data[$pos]['downloads'][$apps_name[$download['from_id']]] = $download['total'];
                }
            }
            Cache::put($key, $data, self::CACHE_MINUTES);
        }
        //17s
        return [
            'ranges'  => array_values($ranges),
            'data'    => array_values($data),
            'errCode' => 0
        ];
    }

    /**
     *  获取平台下载统计
     *
     *
     *  @access public
     *  @return void
     */
    function getPlatform() {
        if ($fail = $this->checkRangeInput()) {
            return $fail;
        }
        $ranges = $this->_fetchRanges();

        //应用下载的总次数
//        $app_total_downs = Appinfo::select('hits', DB::raw('sum(`hits`)'))
//                        ->get()->toArray();
        //按平台分,应用下载的总次数
//        $downs_by_platform = Appinfo::select(`platform`, DB::raw('sum(`hits`) as total'))
//                        ->groupBy('platform')
//                        ->get()->toArray();
        //遍历分组
        //时间段分别查询
        $key = 'stat_platform_' . md5(serialize([$this->range_from, $this->range_to, $this->group_by]));

        if ($data = Cache::get($key)) {
            
        } else {
            $appinfo_ids = LogRequest::select('resource_id')
                    ->where('resource_type', 'application_download')
                    ->where('created', '>', $this->range_from)
                    ->where('created', '<', $this->range_to)
                    ->lists('resource_id');
            $platforms   = explode('|', Option::get('application::platform'));

            foreach ($ranges as $pos => $range) {
                $data[$pos] = ['total' => 0];
                foreach ($platforms as $p) {
                    $data[$pos][$p] = 0;
                }
                $temp = LogRequest::select('resource_id', DB::raw('COUNT( * ) as downs'))
                                ->where('resource_type', 'application_download')
                                ->where('created', '>', $range['begin'])
                                ->where('created', '<', $range['end'])
                                ->groupBy('resource_id')
                                ->get()->toArray();
                foreach ($temp as $row) {
                    $p              = isset($platforms[$row['resource_id']]) ? $platforms[$row['resource_id']] : '未知';
                    $data[$pos][$p] = isset($ranges[$pos][$p]) ? $ranges[$pos][$p] : 0;
                    $data[$pos][$p] += (int) $row['downs'];
                    $data[$pos]['total'] += (int) $row['downs'];
                }
            }
            Cache::put($key, $data, self::CACHE_MINUTES);
        }
        return [
            'ranges'  => array_values($ranges),
            'data'    => array_values($data),
            'errCode' => 0
        ];
    }

    /**
     *  获取分类下载统计
     *
     *
     *  @access public
     *  @return void
     */
    function getAppdown() {
        if ($fail = $this->checkRangeInput()) {
            return $fail;
        }
        $ranges = $this->_fetchRanges();

        $key = 'stat_appdown_' . md5(serialize([$this->range_from, $this->range_to, $this->group_by]));

        if ($data = Cache::get($key)) {
            
        } else {
            $categories = Category::where('type', 'application')->get();
            //初始化分类计数数组
            $result     = [];
            $temp       = $categories->modelKeys();
            $temp2      = array_keys($ranges);
            foreach ($temp as $v) {
                foreach ($temp2 as $v2) {
                    $result[$v][$v2] = 0;
                }
            }

            $request_data = LogRequest::where('resource_type', 'category_application')
                            ->where('request_type', 'download')
                            ->where('created', '>', $this->range_from)
                            ->where('created', '<', $this->range_to)
                            ->get()->toArray();
            foreach ($ranges as $pos => $range) {
                foreach ($request_data as $r) {
                    if ($range['begin'] <= $r['created'] && $r['created'] <= $range['end']) {
                        $result [$r['resource_id']][$pos] ++;
                    }
                }
            }

            foreach ($result as $k => $r) {
                if ($a = $categories->find($k)) {
                    $a->data = array_values($r);
                }
            }
            $data = $categories->toArray();
            Cache::put($key, $data, self::CACHE_MINUTES);
        }
        return [
            'ranges'  => array_values($ranges),
            'data'    => array_values($data),
            'errCode' => 0
        ];
    }

    /**
     *  获取营业厅下载统计
     *
     *
     *  @access public
     *  @return void
     */
    function getHalls() {
        if ($fail = $this->checkRangeInput()) {
            return $fail;
        }
        $ranges = $this->_fetchRanges();


        $city_counts    = array();
        $halls_requests = array();

        //取出这段时间内所有来自营业厅的请求
        $requests = LogRequest::where('from', 'hall')
                        ->where('created', '>', $this->range_from)
                        ->where('created', '<', $this->range_to)
                        ->orderBy('created', 'asc')
                        ->get()->toArray();

        //按照营业厅id分组
        foreach ($requests as $request) {
            if (!isset($halls_requests[$request['from_id']])) {
                $halls_requests[$request['from_id']] = array();
            }
            $halls_requests[$request['from_id']][] = $request;
        }

        //用id数组遍历并计算各自的ip/pv
        foreach ($this->halls as $hall_id => $hall) {
            $hall_requests = isset($halls_requests[$hall_id]) ? $halls_requests[$hall_id] : array();
            $keys          = array_keys($ranges);
            $index         = 0;
            $key           = $keys[$index];
            $ips           = array();
            foreach ($hall_requests as $request) {
                foreach ($ranges as $pos => $range) {
                    if ($range['begin'] <= $request['created'] && $request['created'] <= $range['end']) {
                        if (!isset($ips[$request['ip']])) {
                            $ips[$request['ip']] = true;
                            $ranges[$pos]['ip']  = isset($ranges[$pos]['ip']) ? $ranges[$pos]['ip'] + 1 : 0;
                        }
                        if (!isset($ranges[$pos][$request['request_method']])) {
                            $ranges[$pos][$request['request_method']] = 0;
                        }
                        if ($request['resource_type'] == 'application') {
                            $ranges[$pos][$request['request_method']] = isset($ranges[$pos][$request['request_method']]) ? $ranges[$pos][$request['request_method']] + 1 : 0;
                        }
                        if ($request['request_type'] == 'view' && $request['parent'] == 0) {
                            $ranges[$pos]['pv'] = isset($ranges[$pos]['pv']) ? $ranges[$pos]['pv'] + 1 : 0;
                        }
                    }
                }
            }
            $this->halls[$hall_id]['result'] = $ranges;
            if (!isset($city_counts[$this->halls[$hall_id]['city_id']])) {
                //total : PV, halls => 营业厅输了, QR:通过二维码下载, sms_share :短信分享次数, appwall_window => '应用查看次数'
                $city_counts[$this->halls[$hall_id]['city_id']] = array(
                    'total'          => 0, 'halls'          => 0, 'QR'             => 0, 'sms_share'      => 0, 'appwall_window' => 0
                );
            }
            $city_counts[$this->halls[$hall_id]['city_id']]['halls'] ++;
            foreach ($this->halls[$hall_id]['result'] as $r) {
                if (isset($r['pv'])) {
                    $city_counts[$this->halls[$hall_id]['city_id']]['total'] += $r['pv'];
                } else {
                    $city_counts[$this->halls[$hall_id]['city_id']]['total'] = 0;
                }
                foreach (array('QR', 'sms_share', 'appwall_window') as $key) {
                    if (isset($r[$key])) {
                        $city_counts[$this->halls[$hall_id]['city_id']][$key] += $r[$key];
                    } else {
                        $city_counts[$this->halls[$hall_id]['city_id']][$key] = 0;
                    }
                }
            }
        }
        if (Input::get('excel')) {
            return $this->_AWHallExcel($this->halls, $city_counts);
        }
        return ['halls' => $this->halls, 'data' => $city_counts];
    }

    /**
     *  获取文章绩效统计
     *
     *
     *  @access public
     *  @return void
     */
    function getQuality() {
        if ($fail = $this->checkRangeInput()) {
            return $fail;
        }
        //设定对于文章,统计的有效天数
        //目前sspai是统计3天,zoopda统计5天
        $domain = Option::get('domain');
        if (strpos($domain, 'zoopda') !== false) {
            $days = 5;
        } else {
            $days = 3;
        }

        $subjects = Article::where('created', '>', $this->range_from)
                ->where('created', '<', $this->range_to)
                ->where('status', 1);
        if ($uid      = Input::get('uid')) {
            $subjects->where('user_id', $uid);
        }
        $subjects = $subjects->orderBy('created', 'desc')->get();

        //这里用一下orm的存在关系
        $todo_article = Article::where('created', '>', $this->range_from)
                ->where('created', '<', time() - $days * 24 * 3600)
                ->where('status', 1)
                ->has('quality', '=', 0)
                ->get();

        //做增量更新
        //取最后一次更新的时间
        $l1_v = (int) Option::get('subject_quality::lv1_views');
        $l2_v = (int) Option::get('subject_quality::lv2_views');
        $l1_c = (int) Option::get('subject_quality::lv1_comments');

        foreach ($todo_article as $subject) {
            $last_time           = $subject['created'] + $days * 24 * 3600;
            $quality             = new SubjectQuality;
            $quality->subject_id = $subject['id'];
//            $quality->views = LogRequest::select()
//                    ->where('resource_type = ? AND resource_id = ? AND created < ?', 'subject', $subject['id'], $last_time)
//                    ->count();
            $quality->views      = LogRequest::where('resource_type', 'subject')
                    ->where('resource_id', $subject['id'])
                    ->where('created', '<', $last_time)
                    ->count();

            if ($quality->views == 0) {
                $quality->views = $subject['views'];
            }
            try {
                $quality->comments = DB::table('duoshuo_comments')->select()
                        ->where('belong', $subject['id'])
                        ->where('status', '>', 0)
                        ->where('created', '<', $last_time)
                        ->count();
            } catch (Exception $e) {
                $quality->comments = $subject['comments'];
            }
            if ($quality->views >= $l2_v && $quality->comments >= $l1_c) {
                $quality->quality = 3;
            } elseif ($quality->views >= $l1_v) {
                $quality->quality = 2;
            } else {
                $quality->quality = 1;
            }
            $quality->created = time();
            $quality->save();
        }
        $a_quality = array();
        foreach ($subjects as $subject) {
            if ((time() - $subject->created) >= $days * 24 * 3600) {
                $o_quality = SubjectQuality::where('subject_id', $subject->id)->take(1)->get()->first();
                if ($o_quality) {
                    $a_quality[$subject->id]['views']    = $o_quality->views;
                    $a_quality[$subject->id]['comments'] = $o_quality->comments;
                    $a_quality[$subject->id]['quality']  = $o_quality->quality;
                }

//                $this->provider->cacher->set('stat_subject_info_' . $subject->id, $a_quality[$subject->id], (time() - $subject->created));
            }
        }
        if (Input::has('excel')) {
            return $this->_QualityCsv($subjects, $a_quality);
        }

        return $a_quality;
    }

    /**
     *  输出营业厅数据到excel
     *
     *
     *  @access public
     *  @return void
     */
    function _AWHallExcel($_HALLS, $_CITY_COUNTS) {
        $objExcel = new PHPExcel();

        $objWriter = new PHPExcel_Writer_Excel2007($objExcel);
        $objProps  = $objExcel->getProperties();
        $objExcel->setActiveSheetIndex(0);


        $objActSheet = $objExcel->getActiveSheet();

        //设置当前活动sheet的名称
        $objActSheet->setTitle('统计');

        //设置单元格内容
        $titles = array('序号', '地区', '县分', '营业点名称', '营业厅级别', '应用墙对应地址', '占比', '城市总量', '统计');
        $widths = array(5, 10, 10, 25, 12, 30, 12, 17, 10, 12, 12, 12, 12, 12);

        $A_Z = array(
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AM', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU',
            'AV', 'AW', 'AX', 'AY', 'AZ',
            'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BM', 'BO', 'BP', 'BQ', 'BR', 'BS', 'BT', 'BU',
            'BV', 'BW', 'BX', 'BY', 'BZ',
        );
        foreach ($titles as $pos => $title) {
            $objActSheet->setCellValue("{$A_Z[$pos]}2", $title);
            if (isset($widths[$pos])) {
                $objActSheet->getColumnDimension("{$A_Z[$pos]}")->setWidth($widths[$pos]);
            }
        }

        $hall = current($_HALLS);

        $pos++;
        foreach ($hall['result'] as $range) {
            $objActSheet->setCellValue("{$A_Z[$pos]}2", date('m月d日', $range['begin']) . '~' . date('m月d日', $range['end']));
            $to = $pos + 3;
            $objActSheet->mergeCells("{$A_Z[$pos]}2:{$A_Z[$to]}2");
            //$objActSheet->getColumnDimension("{$A_Z[$pos]}")->setWidth(18);
            $pos+=4;
        }

        $request_types = array(
            'pv'             => 'PV',
            'appwall_window' => '应用详情(点击)',
            'sms_share'      => '短信分享(点击)',
            'QR'             => '(二维码扫描)下载',
        );

        $pos = 0;   //pos是序号,row才是第几行
        foreach ($_HALLS as $id => $hall) {
            $row = $pos + 3;
            $objActSheet->setCellValue("A{$row}", ++$pos);
            $objActSheet->setCellValue("B{$row}", $hall['city']);
            $objActSheet->setCellValue("C{$row}", $hall['area']);
            $objActSheet->setCellValue("D{$row}", $hall['hall']);
            $objActSheet->setCellValue("E{$row}", $hall['level']);
            $objActSheet->setCellValue("F{$row}", "http://sspai.me/appwall/?from=" . sprintf("%03d", $id));

            if (isset($_CITY_COUNTS[$hall['city_id']])) {
                $objActSheet->setCellValue("G{$row}", $hall['city'] . $_CITY_COUNTS[$hall['city_id']]['halls']);
                $to = $_CITY_COUNTS[$hall['city_id']]['halls'] + $row - 1;
                $objActSheet->setCellValue("H{$row}", $_CITY_COUNTS[$hall['city_id']]['total']);
                $objActSheet->mergeCells("G{$row}:G{$to}");
                $objActSheet->mergeCells("H{$row}:H{$to}");
                unset($_CITY_COUNTS[$hall['city_id']]);
            }

            $K          = 9;
            $hall_total = 0;
            foreach ($hall['result'] as $range) {
                foreach (array('pv', 'appwall_window', 'sms_share', 'QR',) as $_k => $_n) {
                    $_k += $K;
                    $cell = "{$A_Z[$_k]}" . "{$row}";
                    $objActSheet->setCellValue("{$A_Z[$_k]}1", $request_types[$_n]);
                    $objActSheet->setCellValue($cell, $range[$_n]);
                    if ($range[$_n] < 1) {
                        $objActSheet->getStyle($cell)->getFill()
                                ->setFillType(PHPExcel_Style_Fill::FILL_SOLID)
                                ->getStartColor()->setARGB('FFFFFFCC');
                    }
                }

                $hall_total += $range['pv'];
                $K += 4;
            }
            $objActSheet->setCellValue("I{$row}", $hall_total);
        }

        //输出内容
        $outputFileName = "output.xlsx";
        //到浏览器
        header("Content-type: application/octet-stream");
        header('Content-Disposition:inline;filename="' . $outputFileName . '"');
        header("Content-Transfer-Encoding: binary");
        header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Pragma: no-cache");
        $objWriter->save('php://output');
        return '';
    }

    /**
     *  输出文章绩效到csv
     *
     *
     *  @access public
     *  @return void
     */
    function _QualityCsv($subjects, $a_quality) {
        $str = "ID, 标题, 发布日期, 分类, 作者, 三天阅读数, 三天评论数, 评分";
        $str .= "\n";
        foreach ($subjects as $subject) {
            $id       = $subject->id;
            $title    = str_replace(',', '，', $subject->title);
            $date     = date('Y-m-d H:i:s', $subject->created);
            $categy   = implode('，', $subject->categories->values('name'));
            $author   = $subject->username;
            $view     = $a_quality[$subject->id]['views'];
            $comments = $a_quality[$subject->id]['comments'];
            $quality  = $a_quality[$subject->id]['quality'];

            $str .= join(',', array($id, $title, $date, $categy, $author, $view, $comments, $quality)) . "\n"; //用引文逗号分开
        }
        $filename = 'export.csv'; //设置文件名

        header("Content-type:text/csv");
        header("Content-Disposition:attachment;filename=" . $filename);
        header('Cache-Control:must-revalidate,post-check=0,pre-check=0');
        header('Expires:0');
        header('Pragma:public');
        echo $str;
        die;
    }

    /**
     *  获取月份差
     *
     *
     *  @access public
     *  @return void
     */
    function _getMonthLeap($st, $et) {
        $s_m   = date('n', $st);
        $e_m   = date('n', $et);
        $s_y   = date('Y', $st);
        $e_y   = date('Y', $et);
        $total = 13 - $s_m + ($e_y - $s_y - 1) * 12 + $e_m; //计算月份差
        return $total;
    }

    /**
     *  根据每日,每周或每月分割时间范围
     *
     *
     *  @access public
     *  @return void
     */
    function _fetchRanges() {
        $result = array();
        $end    = 0;
        $ymdhis = date('Y-m-d', $this->range_from);
        list( $y, $m, $d) = explode('-', $ymdhis);

        while ($end < $this->range_to) {

            switch ($this->group_by) {
                case 'day' :
                    $current = mktime(0, 0, 0, $m, $d++, $y);
                    $end     = mktime(0, 0, 0, $m, $d, $y);

                    break;
                case 'weekly' :
                    $end     = !$end ? mktime(0, 0, 0, $m, $d, $y) : $end;
                    $current = $end;
                    $end     = strtotime('next monday', $current);
                    break;
                case 'month' :
                    $current = mktime(0, 0, 0, $m++, 1, $y);
                    $end     = mktime(0, 0, 0, $m, 1, $y);

                    break;
            }
            $end              = $end > $this->range_to ? $this->range_to : $end;
            $result[$current] = array(
                'begin' => $current, 'end'   => $end
            );
        }
        return $result;
    }

    /**
     *  营业厅数据
     *
     *
     *  @access public
     *  @return void
     */
    private $halls = array(
        '1'  => array('city_id' => '1', 'city' => '福州', 'area' => '鼓楼区', 'hall' => '中国电信福州东街营业厅', 'level' => 'A1',),
        '2'  => array('city_id' => '1', 'city' => '福州', 'area' => '平潭', 'hall' => '中国电信平潭龙凤路营业厅', 'level' => 'A3',),
        '3'  => array('city_id' => '1', 'city' => '福州', 'area' => '鼓楼区', 'hall' => '中国电信福州枢纽营业厅', 'level' => 'A1',),
        '34' => array('city_id' => '1', 'city' => '福州', 'area' => '鼓楼区', 'hall' => '中国电信福州华林营业厅', 'level' => 'A3',),
        '5'  => array('city_id' => '1', 'city' => '福州', 'area' => '台江区', 'hall' => '中国电信福州小桥营业厅', 'level' => 'A3',),
        '35' => array('city_id' => '1', 'city' => '福州', 'area' => '仓山区', 'hall' => '中国电信福州三叉街营业厅', 'level' => 'A3',),
        '36' => array('city_id' => '1', 'city' => '福州', 'area' => '马尾区', 'hall' => '中国电信福州马尾港口路营业厅', 'level' => 'A3',),
        '37' => array('city_id' => '1', 'city' => '福州', 'area' => '晋安区', 'hall' => '中国电信福州六一北营业厅', 'level' => 'A3',),
        '38' => array('city_id' => '1', 'city' => '福州', 'area' => '闽侯', 'hall' => '中国电信闽侯甘蔗街心路营业厅', 'level' => 'A3',),
        '39' => array('city_id' => '1', 'city' => '福州', 'area' => '连江', 'hall' => '中国电信连江丹凤路营业厅', 'level' => 'A3',),
        '40' => array('city_id' => '1', 'city' => '福州', 'area' => '罗源', 'hall' => '中国电信罗源东环营业厅', 'level' => 'A3',),
        '41' => array('city_id' => '1', 'city' => '福州', 'area' => '闽清', 'hall' => '中国电信闽清梅溪营业厅', 'level' => 'A3',),
        '42' => array('city_id' => '1', 'city' => '福州', 'area' => '永泰', 'hall' => '中国电信永泰南湖路营业厅', 'level' => 'A3',),
        '43' => array('city_id' => '1', 'city' => '福州', 'area' => '福清', 'hall' => '中国电信福清一拂路营业厅', 'level' => 'A3',),
        '44' => array('city_id' => '1', 'city' => '福州', 'area' => '长乐', 'hall' => '中国电信长乐会堂路营业厅', 'level' => 'A3',),
        '91' => array('city_id' => '1', 'city' => '福州', 'area' => '鼓区', 'hall' => '中国电信屏西新村营业厅', 'level' => 'A3',),
        '92' => array('city_id' => '1', 'city' => '福州', 'area' => '鼓区', 'hall' => '中国电信大儒世家营业厅', 'level' => 'A3',),
        '93' => array('city_id' => '1', 'city' => '福州', 'area' => '鼓区', 'hall' => '中国电信东街员工创业中心营业厅', 'level' => 'A3',),
        '94' => array('city_id' => '1', 'city' => '福州', 'area' => '仓山', 'hall' => '中国电信中亭街信利源营业厅', 'level' => 'A3',),
        '7'  => array('city_id' => '2', 'city' => '厦门', 'area' => '湖里局', 'hall' => '中国电信厦门江头营业厅', 'level' => 'A1',),
        '6'  => array('city_id' => '2', 'city' => '厦门', 'area' => '思明区', 'hall' => '中国电信厦门滨北营业厅', 'level' => 'A2',),
        '8'  => array('city_id' => '2', 'city' => '厦门', 'area' => '海仓区', 'hall' => '中国电信厦门海沧海发路营业厅', 'level' => 'A3',),
        '83' => array('city_id' => '2', 'city' => '厦门', 'area' => '集美区', 'hall' => '中国电信厦门集美杏西营业厅', 'level' => 'A3',),
        '9'  => array('city_id' => '2', 'city' => '厦门', 'area' => '同安区', 'hall' => '中国电信厦门同安银莲路营业厅', 'level' => 'A3',),
        '59' => array('city_id' => '3', 'city' => '宁德', 'area' => '蕉城区', 'hall' => '中国电信宁德闽东路营业厅', 'level' => 'A2',),
        '10' => array('city_id' => '3', 'city' => '宁德', 'area' => '蕉城区', 'hall' => '中国电信宁德815路营业厅', 'level' => 'A3',),
        '60' => array('city_id' => '3', 'city' => '宁德', 'area' => '霞浦', 'hall' => '中国电信霞浦府前路营业厅', 'level' => 'A3',),
        '61' => array('city_id' => '3', 'city' => '宁德', 'area' => '古田', 'hall' => '中国电信古田六一四路营业厅', 'level' => 'A3',),
        '62' => array('city_id' => '3', 'city' => '宁德', 'area' => '屏南', 'hall' => '中国电信屏南县翠屏路营业厅', 'level' => 'A3',),
        '63' => array('city_id' => '3', 'city' => '宁德', 'area' => '寿宁', 'hall' => '中国电信寿宁胜利街营业厅', 'level' => 'A3',),
        '64' => array('city_id' => '3', 'city' => '宁德', 'area' => '周宁', 'hall' => '中国电信周宁南街营业厅', 'level' => 'A3',),
        '65' => array('city_id' => '3', 'city' => '宁德', 'area' => '柘荣', 'hall' => '中国电信柘荣柳西路营业厅', 'level' => 'A3',),
        '11' => array('city_id' => '3', 'city' => '宁德', 'area' => '福安', 'hall' => '中国电信福安金山营业厅', 'level' => 'A3',),
        '66' => array('city_id' => '3', 'city' => '宁德', 'area' => '福鼎', 'hall' => '中国电信福鼎流美营业厅', 'level' => 'A3',),
        '12' => array('city_id' => '4', 'city' => '莆田', 'area' => '城厢', 'hall' => '中国电信莆田梅园路营业厅', 'level' => 'A2',),
        '14' => array('city_id' => '4', 'city' => '莆田', 'area' => '涵江', 'hall' => '中国电信莆田涵江新涵大街营业厅', 'level' => 'A3',),
        '67' => array('city_id' => '4', 'city' => '莆田', 'area' => '秀屿', 'hall' => '中国电信莆田秀屿笏石营业厅', 'level' => 'A3',),
        '13' => array('city_id' => '4', 'city' => '莆田', 'area' => '仙游', 'hall' => '中国电信仙游田岑底营业厅', 'level' => 'A3',),
        '15' => array('city_id' => '5', 'city' => '泉州', 'area' => '丰泽区', 'hall' => '中国电信泉州东海营业厅', 'level' => 'A1',),
        '68' => array('city_id' => '5', 'city' => '泉州', 'area' => '鲤城区', 'hall' => '中国电信泉州百源营业厅', 'level' => 'A3',),
        '69' => array('city_id' => '5', 'city' => '泉州', 'area' => '泉港区', 'hall' => '中国电信泉州泉港山腰营业厅', 'level' => 'A3',),
        '70' => array('city_id' => '5', 'city' => '泉州', 'area' => '惠安', 'hall' => '中国电信惠安新景华庭营业厅', 'level' => 'A3',),
        '71' => array('city_id' => '5', 'city' => '泉州', 'area' => '安溪', 'hall' => '中国电信安溪凤城营业厅', 'level' => 'A3',),
        '72' => array('city_id' => '5', 'city' => '泉州', 'area' => '永春', 'hall' => '中国电信永春城南街营业厅', 'level' => 'A3',),
        '73' => array('city_id' => '5', 'city' => '泉州', 'area' => '德化', 'hall' => '中国电信德化凤池营业厅', 'level' => 'A3',),
        '16' => array('city_id' => '5', 'city' => '泉州', 'area' => '石狮', 'hall' => '中国电信石狮南环营业厅', 'level' => 'A3',),
        '75' => array('city_id' => '5', 'city' => '泉州', 'area' => '晋江', 'hall' => '中国电信晋江曾井营业厅', 'level' => 'A3',),
        '18' => array('city_id' => '5', 'city' => '泉州', 'area' => '南安', 'hall' => '中国电信南安成功营业厅', 'level' => 'A3',),
        '19' => array('city_id' => '6', 'city' => '漳州', 'area' => '芗城区', 'hall' => '中国电信漳州延安北路营业厅', 'level' => 'A2',),
        '22' => array('city_id' => '6', 'city' => '漳州', 'area' => '云霄', 'hall' => '中国电信云霄云平路营业厅', 'level' => 'A3',),
        '23' => array('city_id' => '6', 'city' => '漳州', 'area' => '漳浦', 'hall' => '中国电信漳浦城东营业厅', 'level' => 'A3',),
        '84' => array('city_id' => '6', 'city' => '漳州', 'area' => '诏安', 'hall' => '中国电信诏安中山路营业厅', 'level' => 'A3',),
        '85' => array('city_id' => '6', 'city' => '漳州', 'area' => '长泰', 'hall' => '中国电信长泰人民路营业厅', 'level' => 'A3',),
        '86' => array('city_id' => '6', 'city' => '漳州', 'area' => '东山', 'hall' => '中国电信东山西埔营业厅', 'level' => 'A3',),
        '87' => array('city_id' => '6', 'city' => '漳州', 'area' => '南靖', 'hall' => '中国电信南靖兰陵路营业厅', 'level' => 'A3',),
        '88' => array('city_id' => '6', 'city' => '漳州', 'area' => '平和', 'hall' => '中国电信平和北环营业厅', 'level' => 'A3',),
        '89' => array('city_id' => '6', 'city' => '漳州', 'area' => '华安', 'hall' => '中国电信华安大同营业厅', 'level' => 'A3',),
        '20' => array('city_id' => '6', 'city' => '漳州', 'area' => '龙海', 'hall' => '中国电信龙海石码营业厅', 'level' => 'A3',),
        '25' => array('city_id' => '7', 'city' => '龙岩', 'area' => '新罗区', 'hall' => '中国电信龙岩九一南路营业厅', 'level' => 'A2',),
        '45' => array('city_id' => '7', 'city' => '龙岩', 'area' => '新罗区', 'hall' => '中国电信龙岩龙川营业厅', 'level' => 'A3',),
        '46' => array('city_id' => '7', 'city' => '龙岩', 'area' => '长汀', 'hall' => '中国电信长汀腾飞营业厅', 'level' => 'A3',),
        '47' => array('city_id' => '7', 'city' => '龙岩', 'area' => '永定', 'hall' => '中国电信永定下坑营业厅', 'level' => 'A3',),
        '48' => array('city_id' => '7', 'city' => '龙岩', 'area' => '上杭', 'hall' => '中国电信上杭北环路营业厅', 'level' => 'A3',),
        '49' => array('city_id' => '7', 'city' => '龙岩', 'area' => '武平', 'hall' => '中国电信武平百斤税营业厅', 'level' => 'A3',),
        '50' => array('city_id' => '7', 'city' => '龙岩', 'area' => '连城', 'hall' => '中国电信连城洪山营业厅', 'level' => 'A3',),
        '26' => array('city_id' => '7', 'city' => '龙岩', 'area' => '漳平', 'hall' => '中国电信漳平桂林路营业厅', 'level' => 'A3',),
        '27' => array('city_id' => '8', 'city' => '三明', 'area' => '梅列区', 'hall' => '中国电信三明列东营业厅', 'level' => 'A2',),
        '28' => array('city_id' => '8', 'city' => '三明', 'area' => '三元区', 'hall' => '中国电信三明三元营业厅', 'level' => 'A3',),
        '74' => array('city_id' => '8', 'city' => '三明', 'area' => '明溪', 'hall' => '中国电信明溪解放路营业厅', 'level' => 'A3',),
        '76' => array('city_id' => '8', 'city' => '三明', 'area' => '清流', 'hall' => '中国电信清流长兴营业厅', 'level' => 'A3',),
        '77' => array('city_id' => '8', 'city' => '三明', 'area' => '宁化', 'hall' => '中国电信宁化南大街营业厅', 'level' => 'A3',),
        '78' => array('city_id' => '8', 'city' => '三明', 'area' => '大田', 'hall' => '中国电信大田凤山中路营业厅', 'level' => 'A3',),
        '31' => array('city_id' => '8', 'city' => '三明', 'area' => '尤溪', 'hall' => '中国电信尤溪七五路营业厅', 'level' => 'A3',),
        '30' => array('city_id' => '8', 'city' => '三明', 'area' => '沙县', 'hall' => '中国电信沙县府东路营业厅', 'level' => 'A3',),
        '79' => array('city_id' => '8', 'city' => '三明', 'area' => '将乐', 'hall' => '中国电信将乐七星街营业厅', 'level' => 'A3',),
        '80' => array('city_id' => '8', 'city' => '三明', 'area' => '泰宁', 'hall' => '中国电信泰宁和平中街营业厅', 'level' => 'A3',),
        '81' => array('city_id' => '8', 'city' => '三明', 'area' => '建宁', 'hall' => '中国电信建宁民主街营业厅', 'level' => 'A3',),
        '82' => array('city_id' => '8', 'city' => '三明', 'area' => '永安', 'hall' => '中国电信永安国民路营业厅', 'level' => 'A3',),
        '32' => array('city_id' => '9', 'city' => '南平', 'area' => '延平区', 'hall' => '中国电信南平解放路营业厅', 'level' => 'A2',),
        '51' => array('city_id' => '9', 'city' => '南平', 'area' => '顺昌', 'hall' => '中国电信顺昌中山东路营业厅', 'level' => 'A3',),
        '52' => array('city_id' => '9', 'city' => '南平', 'area' => '浦城', 'hall' => '中国电信浦城北门营业厅', 'level' => 'A3',),
        '53' => array('city_id' => '9', 'city' => '南平', 'area' => '光泽', 'hall' => '中国电信光泽二一七路营业厅', 'level' => 'A3',),
        '54' => array('city_id' => '9', 'city' => '南平', 'area' => '松溪', 'hall' => '中国电信松溪解放街营业厅', 'level' => 'A3',),
        '55' => array('city_id' => '9', 'city' => '南平', 'area' => '政和', 'hall' => '中国电信政和解放街营业厅', 'level' => 'A3',),
        '56' => array('city_id' => '9', 'city' => '南平', 'area' => '邵武', 'hall' => '中国电信邵武熙春路营业厅', 'level' => 'A3',),
        '57' => array('city_id' => '9', 'city' => '南平', 'area' => '武夷山', 'hall' => '中国电信武夷山迎宾路营业厅', 'level' => 'A3',),
        '33' => array('city_id' => '9', 'city' => '南平', 'area' => '建瓯', 'hall' => '中国电信建瓯中山路营业厅', 'level' => 'A3',),
        '58' => array('city_id' => '9', 'city' => '南平', 'area' => '建阳', 'hall' => '中国电信建阳黄花山路营业厅', 'level' => 'A3',),
    );

}
