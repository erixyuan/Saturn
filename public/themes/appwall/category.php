<?php $this->layout('_layout/appwall'); ?>
<?php $this->block('title'); ?><?php echo Option::get('sitename'); ?><?php $this->endblock(); ?>

<?php $this->block('head'); ?>
<meta name="description" content="<?php echo Option::get('site::description'); ?>" />
<meta name="keywords" content="<?php echo Option::get('site::keywords'); ?>" />
<?php $this->endblock(); ?>

<?php $this->block('main'); ?>
<div class="main clearfix">
    <div class="wrap">


        <div class="combo clearfix">
            <div id="slides">
                <div class="slides_container">
                    <div class="allinone rock">
                        <div class="box">
                            <a href="<?php echo url('plugin', "HANDLER/Plugin_Appwall_Takeover_Category/id/$_CATEGORY->slug"); ?><?php echo isset($_GET['from']) ? "?from={$_GET['from']}" : ''; ?>"><div class="title_<?php $_CATEGORY->slug(); ?> title"></div></a>
                            <ul class="clearfix">
                                <?php $apps = $this->pccaller->get('applications', array('meta_id' => $_CATEGORY->id, 'with_childs' => 'true', 'recommend' => Application::RC_APPWALL, 'limit' => 16, 'order' => 'modified DESC')); ?>
                                <?php $batch_shares_content = array(array(), array(), array(), array()); ?>
                                <?php foreach ($apps as $pos => $app): ?>
                                    <li id="app_<?php echo $app->id; ?>" class="clearfix app">
                                        <a title="MiniSquadron" href="#w<?php echo $app->id; ?>" data-toggle="modal">
                                            <span class="mask"></span>
                                            <img class="icon" alt="MiniSquadron" src="<?php echo $app->iconURL(); ?>">
                                        </a>
                                        <a class="apptitle" title="MiniSquadron" href="#w<?php echo $app->id; ?>" data-toggle="modal">
                                            <h3><?php $app->name(); ?></h3>
                                        </a>
                                        <a title="MiniSquadron" href="#w<?php echo $app->id; ?>" data-toggle="modal">
                                            <p id="yfx_content_post_<?php echo $app->id; ?>"><?php echo mb_substr(strip_tags(trim($app->description), "\r\n\t "), 0, 60, 'utf-8'); ?></p>
                                        </a>

                                    </li>
                                    <?php
                                    $index = $pos % 4;
                                    $batch_shares_content[$index][] = ("【" . $app->name . "】" . 'http://sspai.me' . $app->subjectURL() . '； ');
                                    ?>
                                <?php endforeach; ?>





                            </ul>
                        </div>
                    </div>
                </div>
                <a class="prev" href="javascript:prevCategory();">Prev</a>
                <a class="next" href="javascript:nextCategory()">Next</a>
            </div>
        </div>

        <div class="combo_hidden">
            <?php foreach ($apps as $app): ?>
                <div id="w<?php echo $app->id; ?>" class="modal hide fade" style="display: none; z-index:1000; position:absolute; top:280px; ">
                    <div class="modal-header">
                        <button class="close" data-dismiss="modal">关闭</button>
                        <img src="<?php echo $app->iconURL(); ?>" alt="<?php $app->name(); ?>" class="icon"/>
                        <h3><?php $app->name(); ?></h3>
                    </div>

                    <div class="modal-body">
                        <div class="description">
                            <div class="screenshot screenshot_<?php echo $app->id; ?> clearfix">
                                <?php
                                $i = 0;
                                foreach ($app->screenshots() as $attachment):
                                    ?>
                                    <?php if ($i++ > 3) break; ?>
                                    <a href="<?php echo $attachment->URL(array('mw' => 1000, 'mh' => 600)); ?>">
                                        <img src="<?php echo $attachment->URL(array('mw' => 150, 'mh' => 250)); ?>" alt="" />
                                    </a>
                                <?php endforeach; ?>
                            </div>

                            <div class="text">
                                <p><?php $app->description(); ?></p>
                            </div>
                        </div>


                        <script type="text/javascript">
                            $(".screenshot_<?php echo $app->id; ?> a:has(img)").slimbox();
                        </script>


                        <div class="share clearfix">
                            <div class="qr">
                                <?php foreach ($app->downloads as $download): ?>
                                    <div class="appqr_lable appqr_<?php echo str_replace(' ', '-', strtolower($download->platform)); ?> last">
                                        <a href="http://sspai.me<?php echo $download->redirectURL(); ?>">
                                            <img src="http://sspai.me/qrimage?size=82&url=http://sspai.me<?php echo $download->redirectURL(); ?><?php echo isset($_GET['from']) ? "?from={$_GET['from']}" : ''; ?>" width="82" height="82">
                                        </a>
                                    </div>
                                <?php endforeach; ?>

                            </div>

                            <div class="sms">


                                <script type="text/javascript">
                                    function setContent(str) {
                                        str = str.replace(/<\/?[^>]*>/g, '');
                                        str = str.replace(/[ | ]*\n/g, '');
                                        str = str.replace(/\n[\s| | ]*\r/g, '');
                                        str = str.replace(/\s/g, '');
                                        return str;
                                    }
                                    //$("#yfx_content_post_value_<?php echo $app->id; ?>")[0].value = "<?php echo "【" . $app->name . "】"; ?> "+setContent( $('#yfx_content_post_<?php echo $app->id; ?>').html() ).substring(0,100)+" http://sspai.me<?php echo $app->subjectURL(''); ?><?php echo isset($_GET['from']) ? "?from={$_GET['from']}" : ''; ?>";
                                </script>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <p class="getqr"><strong>没有二维码扫描软件？</strong> 请编辑短信kp发送到10659468即可免费下载</p>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>


<?php
$this->endblock();
