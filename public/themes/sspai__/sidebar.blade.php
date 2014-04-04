
<div class="m-sidebar">
    
    <div class="m-widget author-info">
        <h4><span class="title-icon-user"></span>作者信息</h4>
        <div class="w-author">
            <div class="avatar">
                <img src="<?php echo $author->getAvatarURL('m'); ?>" alt="<?php echo $author->nickname; ?>"  />
            </div>
            <div class="info">
                <h5><a title="查看 <?php echo $author->nickname; ?> 的所有文章" target="_blank" href="<?php echo url('subject/author', "username/{$author->username}"); ?>"><?php echo $author->nickname; ?></a></h5>
                <i>
                    <!-- 职业 -->
                    <?php if ($author->roles): ?>
                        <?php $remark = Role::select()->where('role=?', $author->roles)->getOne()->remark; ?>
                        <?php $extra = $author->extra; ?>
                        <?php if ($remark): ?>
                            <!-- <span class="lv"> -->
                                <?php //echo $remark; ?>
                            <!-- </span> -->
                        <?php endif; ?>

                    <!-- 职业 -->
                    <!--
                        <?php if (is_array($extra)): ?>
                            <?php if (isset($extra['profession'])&&!empty($extra['profession'])): ?>
                                <span class="job"><?php echo $extra['profession']; ?></span>
                            <?php endif; ?>
                        <?php endif; ?>
                    <?php endif; ?>
                -->

                    <div class="social-link">
                        <a target="_blank" href="<?php echo $author->site; ?>" class="icon-sina-weibo">微博</a>
                    </div>
                </i>
            </div>

            <?php if(strlen(trim($author->summary)) > 0): ?>
            <p class="bio">
                <?php $author->summary('HTMLENC'); ?>
            </p>
            <?php endif; ?>

        </div>
    </div>
    <!-- 作者信息 END -->






    <!-- 应用信息 START -->
    <?php
            if(
                $_themeData["file"] == "view" &&
                 isset($_themeData["applications"]) &&
                 count( $_themeData["applications"]  ) > 0
             ):

            $appinfo = $_themeData["applications"][0];
    ?>
    <div class="m-widget siderbar-appinfo" id="js-widget-appinfo">
        <h4>
            <span class="title-icon-info"></span>
            应用信息
        </h4>
        <img src="<?php echo $appinfo->iconURL( array('w' => 96, 'h' => 96) ); ?>" alt="<?php if( $appinfo->name_cn ) $appinfo->name_cn();else if( $appinfo->name ) $appinfo->name();?>" class="app-icon" />
        <h5><?php if( $appinfo->name_cn ) $appinfo->name_cn();else if( $appinfo->name ) $appinfo->name();?></h5>
        <!-- <a name="js-widget-appinfo"></a> -->

        <?php
            // 应用分类
            if(count($appinfo->categories) > 0):
        ?>
        <div class="cats">
               <?php foreach( $appinfo->categories as $category ):?>
                    <a rel="category" title="查看所有关于 <?php echo $category->name;?> 的文章" href="/appwall/<?php echo $category->slug;?>"><?php $category->name(); ?></a>
                <?php endforeach;?>
        </div>
        <?php endif; ?>

        <ul class="list-dowload">
            <?php
                foreach( $appinfo->downloads as $download ):
                $platformClassName = getAppPlatformClassName($download->platform, $download->url);
            ?>
            <li class="<?php echo $platformClassName; ?>">
                <a href="<?php echo $download->redirectURL();?>" <?php if($platformClassName != 'ios'): ?> target="_blank" <?php endif; ?> ><span class="os"></span><?php echo $download->price ? sprintf("￥%0.2f", $download->price) : '免费';?></a>
            </li>
        <?php endforeach; ?>
        </ul>

        <div class="qrcode">
            <?php
                $qrcodeurl = "http://sspai.com".$_themeData["article"]->url()."#js-widget-appinfo";
                $qrcodeurl = urlencode($qrcodeurl);
            ?>
            <img src="http://sspai.com/qrimage?size=79&url=<?php echo $qrcodeurl; ?>" alt="" />
            <p>扫描二维码，通过手机下载该应用。</p>
        </div>
    </div>
    <?php endif;?>
    <!-- 应用信息 END -->






    <!-- 最新资讯 START -->
    <div class="m-widget list-textlink">
        <h4>
            <span class="title-icon-rss"></span>
            资讯
            <a href="<?php echo url("category/news"); ?>" class="more">更多</a>
        </h4>
        <?php
            $category = $this->pccaller->get('categories',array('slug'=>'news'));
            if(count($category) > 0):
                $subjects = $this->pccaller->get('subjects', array('meta_id' => $category[0]->id, 'order' => 'created DESC','limit'=>5));
        ?>
        <ul>
            <?php foreach ($subjects as $subject): ?>
            <li><a href="<?php echo $subject->url(); ?>"><?php echo $subject->title; ?></a></li>
            <?php endforeach;?>
        </ul>
        <?php endif; ?>
    </div>
    <!-- 最新资讯 END -->






    <!-- 最新评测 START-->
    <?php
        if(count($com_sspai_cms_app_rank) > 0):
            // 获取全部应用的APP
            $appIDS = array();
            $apps = null;
            $appInfo = array();

            foreach($com_sspai_cms_app_rank as $cAPP){
                $id = trim($cAPP['title']);
                $rank = trim($cAPP['content']);
                if(is_numeric($id)){
                    $appIDS[] = $id;
                    $appInfo [$id] = array(
                        "link" => trim($cAPP['link']),
                        "rank" => strlen($rank)  == 0 || !is_numeric($rank) ? 0 : $rank
                        );
                }
            }

        // 拉取APP信息
        $apps = getAPPsOfIDs($appIDS);
    ?>
    <div class="m-widget list-applink">
        <h4>
            <span class="title-icon-labs"></span>
            近期评测
            <a href="<?php echo url("category/review"); ?>" class="more">更多</a>
        </h4>
        <ul>
            <?php foreach($appInfo as $key => $ai): ?>
            <li>
                <a href="<?php echo PApp::instance()->request->baseURL() . '/'.$ai['link'];?>">
                    <img src="<?php echo $apps[$key]->iconURL( array('w' => 55, 'h' => 55)); ?>" alt="<?php echo $apps[$key]->name;?>" class="app-icon" />
                    <h5><?php echo $apps[$key]->name;?></h5>
                    <div class="meta">
                        <!-- 排序 -->
                        <div class="rating">
                            <div class="count c-<?php echo $ai['rank']; ?>"></div>
                        </div>

                        <!-- 下载链接 -->
                        <div class="list-dowload">
                            <?php foreach( getFirstAppPlatform(array($apps[$key])) as $dl):  ?>
                               <?php if(isset($dl->className)): ?>
                                <span class="<?php echo $dl->className; ?>"><?php echo $dl->platform; ?></span>
                                <?php endif; ?>
                            <?php endforeach;?>
                        </div>
                    </div>



                </a>
            </li>
        <?php endforeach; ?>
        </ul>
    </div>
    <?php endif; ?>
    <!-- 最新评测 END -->





    <!-- 热门推荐 START -->
    <?php if(count($com_sspai_cms_recom) > 0): ?>
    <div class="m-widget list-thumblink">
        <h4><span class="title-icon-heart"></span>热门</h4>
        <ul>
            <?php
                $ids = array();
                $subjects = null;
                $combThumbsInfo = array();
                foreach($com_sspai_cms_recom as $subj) {
                    $id = trim($subj['link']);
                    if(is_numeric($id)){
                        $ids[] = $id;
                        $combThumbsInfo[$id] =  trim($subj['image']);
                    }
                }
                // 拉取文章信息
                $subjects = getSubjectsOfIDs($ids);
                foreach($ids as $id):
                    $subject = $subjects[$id];
                    // 优先已经上传的图片,否则就使用文章的缩略图
                    $thumbURL = isset($combThumbsInfo[$subject->id]) && strlen($combThumbsInfo[$subject->id]) > 0?
                        $combThumbsInfo[$subject->id]: $subject->thumb(array('w' => 250, 'h' => 122));
             ?>
            <li>
                <a href="<?php echo $subject->url() ?>">
                    <img src="<?php echo $thumbURL ?>" width="250"  alt="<?php echo $subject->title('HTMLENC'); ?>" />
                    <strong>
                        <?php
                            // 最多给显示2行
                            $title = $subject->title;
                            if (mb_strlen($title,"utf-8") > 50) {
                                $title = mb_substr($title, 0,50);
                            }
                            echo htmlspecialchars($title);
                        ?>
                    </strong>
                </a>
            </li>
            <?php endforeach; ?>
        </ul>
    </div>
    <?php endif; ?>
    <!-- 热门推荐 END -->

    <div class="sidebar-color">
        <a href="http://sspai.com/submit" target="_blank">
            <img src="<?php echo $this->themeURL('_res/img/pic_join-me.png') ?>" alt="">
        </a>
    </div>







</div>