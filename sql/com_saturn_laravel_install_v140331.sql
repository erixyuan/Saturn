-- phpMyAdmin SQL Dump
-- version 3.3.9
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2014 年 03 月 31 日 07:32
-- 服务器版本: 5.5.34
-- PHP 版本: 5.4.26

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `com_solidzoro_laravel`
--

-- --------------------------------------------------------

--
-- 表的结构 `ads`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:01
--

DROP TABLE IF EXISTS `ads`;
CREATE TABLE IF NOT EXISTS `ads` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(100) NOT NULL,
  `name` varchar(200) NOT NULL,
  `type` varchar(50) DEFAULT 'default',
  `items` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `ads`
--


-- --------------------------------------------------------

--
-- 表的结构 `appkeys`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:01
--

DROP TABLE IF EXISTS `appkeys`;
CREATE TABLE IF NOT EXISTS `appkeys` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(100) NOT NULL,
  `name` varchar(200) NOT NULL,
  `items` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `appkeys`
--


-- --------------------------------------------------------

--
-- 表的结构 `applications`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:01
--

DROP TABLE IF EXISTS `applications`;
CREATE TABLE IF NOT EXISTS `applications` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `status` tinyint(2) NOT NULL,
  `ontop` tinyint(1) NOT NULL,
  `to_appwall` tinyint(1) NOT NULL DEFAULT '0',
  `user_id` int(10) unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  `name_en` varchar(100) DEFAULT NULL,
  `name_cn` varchar(100) DEFAULT NULL,
  `name_package` varchar(100) DEFAULT NULL,
  `version` varchar(100) NOT NULL,
  `language` varchar(100) NOT NULL,
  `size` int(10) NOT NULL,
  `views` int(10) unsigned NOT NULL,
  `comments` int(10) unsigned NOT NULL,
  `icon_id` int(10) unsigned NOT NULL,
  `description` text NOT NULL,
  `published` int(10) NOT NULL DEFAULT '0',
  `order` tinyint(1) DEFAULT '0',
  `created` int(10) unsigned NOT NULL,
  `modified` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `applications`
--


-- --------------------------------------------------------

--
-- 表的结构 `application_downs`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:01
--

DROP TABLE IF EXISTS `application_downs`;
CREATE TABLE IF NOT EXISTS `application_downs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `application_id` int(10) unsigned NOT NULL,
  `platform` varchar(50) NOT NULL,
  `price` varchar(50) DEFAULT NULL,
  `desc` varchar(200) NOT NULL,
  `url` varchar(200) NOT NULL,
  `hits` int(10) unsigned DEFAULT '0',
  `virtual_hits` int(10) unsigned DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `application_downs`
--


-- --------------------------------------------------------

--
-- 表的结构 `assigned_roles`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:26
--

DROP TABLE IF EXISTS `assigned_roles`;
CREATE TABLE IF NOT EXISTS `assigned_roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `role_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- 转存表中的数据 `assigned_roles`
--

INSERT INTO `assigned_roles` (`id`, `user_id`, `role_id`) VALUES
(7, 1, 1),
(6, 4, 1);

-- --------------------------------------------------------

--
-- 表的结构 `attachments`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:29
--

DROP TABLE IF EXISTS `attachments`;
CREATE TABLE IF NOT EXISTS `attachments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `object_id` int(10) unsigned NOT NULL,
  `object_type` varchar(16) NOT NULL,
  `object_relation` varchar(16) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `path` varchar(200) NOT NULL,
  `filename` varchar(100) NOT NULL,
  `basename` varchar(100) NOT NULL,
  `extension` varchar(10) NOT NULL,
  `filesize` int(10) unsigned NOT NULL,
  `created` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=199 ;

--
-- 转存表中的数据 `attachments`
--


-- --------------------------------------------------------

--
-- 表的结构 `categories`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:25
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `parent_id` int(10) unsigned NOT NULL DEFAULT '0',
  `name` varchar(50) NOT NULL,
  `description` varchar(200) NOT NULL,
  `keywords` varchar(200) NOT NULL,
  `slug` varchar(200) DEFAULT NULL,
  `order` int(11) NOT NULL,
  `template` varchar(50) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- 转存表中的数据 `categories`
--

INSERT INTO `categories` (`id`, `type`, `parent_id`, `name`, `description`, `keywords`, `slug`, `order`, `template`, `status`) VALUES
(0, 'subject', 0, '默认分类', '默认分类', '默认分类', 'note', 1, NULL, 1);

-- --------------------------------------------------------

--
-- 表的结构 `comments`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:01
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `object_id` int(10) unsigned NOT NULL,
  `object_type` varchar(16) NOT NULL DEFAULT 'subject',
  `parent_id` int(10) unsigned DEFAULT NULL,
  `quote_id` int(10) unsigned DEFAULT NULL,
  `status` tinyint(2) unsigned NOT NULL,
  `author` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `content` text,
  `created` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `comments`
--


-- --------------------------------------------------------

--
-- 表的结构 `logs`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:01
--

DROP TABLE IF EXISTS `logs`;
CREATE TABLE IF NOT EXISTS `logs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `object_type` varbinary(20) NOT NULL,
  `object_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `message` text NOT NULL,
  `created` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `object_type` (`object_type`),
  KEY `object_id` (`object_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `logs`
--


-- --------------------------------------------------------

--
-- 表的结构 `options`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:29
--

DROP TABLE IF EXISTS `options`;
CREATE TABLE IF NOT EXISTS `options` (
  `key` varchar(50) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `options`
--

INSERT INTO `options` (`key`, `value`) VALUES
('version', 'd:1.016;'),
('sitename', 's:12:"站点名称";'),
('domain', 's:9:"localhost";'),
('site::description', 's:12:"站点描述";'),
('site::keywords', 's:16:"站点关键字 ";'),
('subject_default_slug', 's:1:"0";'),
('theme', 's:13:"com_solidzoro";'),
('attachment::allow_extensions', 's:36:"jpg,gif,png,jpeg,apk,zip,rar,exe,rar";'),
('attachment::watermark_default_pos', 's:1:"3";'),
('attachment::watermark_min_width', 's:1:"0";'),
('attachment::watermark_min_height', 's:1:"0";'),
('attachment::watermarks', 's:49:"resource/img/watermark/sspai_logo_mark_201402.png";'),
('attachment::max_size', 's:3:"10M";'),
('application::platform', 's:33:"Android|iPhone|iPad|Windows Phone";'),
('plugin::installed', 'a:12:{i:0;s:3:"API";i:1;s:12:"SlideManager";i:2;s:7:"Appwall";i:3;s:11:"NFCActivity";i:4;s:7:"Duoshuo";i:5;s:6:"QRCode";i:6;s:7:"CMSSync";i:7;s:7:"UCenter";i:8;s:3:"APK";i:9;s:10:"Statistics";i:10;s:11:"Application";i:11;s:6:"Appkey";}'),
('plugin::activated', 'a:10:{i:0;s:3:"API";i:1;s:12:"SlideManager";i:2;s:7:"Appwall";i:3;s:11:"Application";i:4;s:6:"Appkey";i:5;s:7:"Duoshuo";i:6;s:6:"QRCode";i:7;s:10:"Statistics";i:8;s:7:"CMSSync";i:9;s:3:"APK";}'),
('manage::notice', 's:0:"";'),
('domain_map_subject::domains', 's:135:"e.sspai.me/a001/checkin=>/a/fjxq/checkin\r\ne.sspai.me/a001/ranking=>/a/fjxq/ranking\r\ne.sspai.me/=>/23774\r\n/example/settings/wifi=>/23732";'),
('duoshuo::last_sync_time', 'i:1394436861;'),
('duoshuo::sync_since_id', 's:19:"1198115830555489267";'),
('duoshuo::secret', 's:32:"7bb2ac2af6b5bbb4c55fa53ce4014c24";'),
('duoshuo::short_name', 's:5:"sspai";'),
('application_module::enable', 's:1:"1";'),
('phone_module::enable', 's:1:"0";'),
('comment_default::enable', 's:1:"1";'),
('attachment::path_rule', 's:1:"1";'),
('manage::warn_avatar', 's:1:"0";'),
('subject_quality::lv1_views', 's:1:"1";'),
('subject_quality::lv2_views', 's:1:"1";'),
('subject_quality::lv1_comments', 's:1:"0";'),
('cmssync::sites', 's:28:"少数派=>http://sspai.com\n";'),
('Subject::thumb_empty_url', 's:0:"";'),
('Postsync::thumb_enable', 's:1:"0";'),
('comment_default::captcha', 's:1:"0";'),
('comment_default::username', 's:1:"1";'),
('product::platform', 's:12:"tmall|taobao";'),
('subject_auto_save_time', 's:2:"60";');

-- --------------------------------------------------------

--
-- 表的结构 `permissions`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:29
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `display_name` varchar(50) DEFAULT NULL,
  `parent_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=19 ;

--
-- 转存表中的数据 `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `display_name`, `parent_id`) VALUES
(1, 'manage_article', '管理文章', 1),
(2, 'publish_article', '发布文章到首页', 1),
(3, 'submit_article', '提交文章到待审', 1),
(4, 'delete_article', '删除文章', 0),
(5, 'submit_others_article', '编辑他人的文章', 0),
(6, 'manage_app', '管理应用', 0),
(7, 'publish_app', '发布应用到首页', 0),
(8, 'submit_app', '提交应用到待审', 0),
(9, 'delete_app', '删除应用', 0),
(10, 'submit_others_app', '编辑他人的应用', 0),
(11, 'manage_category', '管理分类', 0),
(12, 'submit_category', '新建分类', 0),
(13, 'delete_category', '删除分类', 0),
(14, 'manage_user', '管理用户', 0),
(15, 'manage_role', '管理角色', 0),
(16, 'manage_option', '系统设置', 0),
(17, 'manage_attachment', '附件管理', 0),
(18, 'upload_attachment', '上传附件', 0);

-- --------------------------------------------------------

--
-- 表的结构 `permission_role`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:01
--

DROP TABLE IF EXISTS `permission_role`;
CREATE TABLE IF NOT EXISTS `permission_role` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `permission_id` int(10) unsigned NOT NULL,
  `role_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=29 ;

--
-- 转存表中的数据 `permission_role`
--

INSERT INTO `permission_role` (`id`, `permission_id`, `role_id`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1),
(5, 5, 1),
(6, 6, 1),
(7, 7, 1),
(8, 8, 1),
(9, 9, 1),
(10, 10, 1),
(11, 11, 1),
(12, 12, 1),
(13, 13, 1),
(14, 14, 1),
(15, 15, 1),
(16, 16, 1),
(17, 17, 1),
(18, 18, 1),
(19, 4, 8),
(20, 5, 8),
(21, 6, 8),
(22, 7, 8),
(23, 8, 8),
(24, 9, 8),
(25, 10, 8),
(26, 11, 8),
(27, 17, 8),
(28, 18, 8);

-- --------------------------------------------------------

--
-- 表的结构 `products`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:01
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `status` tinyint(2) NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` int(10) NOT NULL,
  `views` int(10) NOT NULL,
  `comments` int(10) unsigned NOT NULL,
  `description` text NOT NULL,
  `order` tinyint(1) NOT NULL,
  `created` int(10) NOT NULL,
  `modified` int(10) NOT NULL,
  `rating` tinyint(2) DEFAULT NULL,
  `content` text,
  `good` text,
  `bad` text,
  `cover_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `products`
--


-- --------------------------------------------------------

--
-- 表的结构 `product_links`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:01
--

DROP TABLE IF EXISTS `product_links`;
CREATE TABLE IF NOT EXISTS `product_links` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned NOT NULL,
  `platform` varchar(50) NOT NULL,
  `price` varchar(50) DEFAULT NULL,
  `desc` varchar(200) NOT NULL,
  `url` varchar(200) NOT NULL,
  `hits` int(10) unsigned DEFAULT '0',
  `virtual_hits` int(10) unsigned DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=COMPRESSED AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `product_links`
--


-- --------------------------------------------------------

--
-- 表的结构 `re_applications_categories`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:01
--

DROP TABLE IF EXISTS `re_applications_categories`;
CREATE TABLE IF NOT EXISTS `re_applications_categories` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `app_id` int(10) NOT NULL,
  `category_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `re_applications_categories`
--


-- --------------------------------------------------------

--
-- 表的结构 `re_applications_tags`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:01
--

DROP TABLE IF EXISTS `re_applications_tags`;
CREATE TABLE IF NOT EXISTS `re_applications_tags` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `app_id` int(10) unsigned NOT NULL,
  `tag_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `application_id` (`app_id`),
  KEY `meta_id` (`tag_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `re_applications_tags`
--


-- --------------------------------------------------------

--
-- 表的结构 `re_products_categories`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:01
--

DROP TABLE IF EXISTS `re_products_categories`;
CREATE TABLE IF NOT EXISTS `re_products_categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `re_products_categories`
--


-- --------------------------------------------------------

--
-- 表的结构 `re_products_tags`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:01
--

DROP TABLE IF EXISTS `re_products_tags`;
CREATE TABLE IF NOT EXISTS `re_products_tags` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned NOT NULL,
  `tag_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `re_products_tags`
--


-- --------------------------------------------------------

--
-- 表的结构 `re_subjects_applications`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:01
--

DROP TABLE IF EXISTS `re_subjects_applications`;
CREATE TABLE IF NOT EXISTS `re_subjects_applications` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `subject_id` int(10) unsigned NOT NULL,
  `application_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `subject_id` (`subject_id`),
  KEY `application_id` (`application_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `re_subjects_applications`
--


-- --------------------------------------------------------

--
-- 表的结构 `re_subjects_categories`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:27
--

DROP TABLE IF EXISTS `re_subjects_categories`;
CREATE TABLE IF NOT EXISTS `re_subjects_categories` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `subject_id` int(10) NOT NULL,
  `category_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=41 ;

--
-- 转存表中的数据 `re_subjects_categories`
--

INSERT INTO `re_subjects_categories` (`id`, `subject_id`, `category_id`) VALUES
(1, 1, 2),
(2, 3, 2),
(3, 4, 2),
(4, 5, 3),
(5, 6, 5),
(6, 7, 2),
(7, 8, 2),
(8, 9, 2),
(9, 10, 2),
(10, 11, 8),
(11, 12, 8),
(12, 12, 2),
(13, 13, 2),
(14, 14, 2),
(15, 15, 2),
(16, 16, 2),
(17, 17, 2),
(18, 18, 2),
(19, 19, 2),
(20, 20, 2),
(21, 21, 2),
(22, 21, 9),
(23, 22, 8),
(24, 22, 9),
(25, 22, 2),
(26, 23, 2),
(27, 24, 8),
(28, 24, 2),
(29, 23, 9),
(30, 25, 2),
(31, 26, 2),
(32, 27, 4),
(33, 28, 2),
(34, 29, 4),
(35, 30, 6),
(36, 31, 8),
(37, 32, 8),
(38, 33, 2),
(39, 34, 2),
(40, 35, 0);

-- --------------------------------------------------------

--
-- 表的结构 `re_subjects_products`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:01
--

DROP TABLE IF EXISTS `re_subjects_products`;
CREATE TABLE IF NOT EXISTS `re_subjects_products` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `subject_id` int(10) unsigned NOT NULL,
  `product_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `re_subjects_products`
--


-- --------------------------------------------------------

--
-- 表的结构 `re_subjects_tags`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:29
--

DROP TABLE IF EXISTS `re_subjects_tags`;
CREATE TABLE IF NOT EXISTS `re_subjects_tags` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `subject_id` int(10) unsigned NOT NULL,
  `tag_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `subject_id` (`subject_id`),
  KEY `meta_id` (`tag_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=85 ;

--
-- 转存表中的数据 `re_subjects_tags`
--

INSERT INTO `re_subjects_tags` (`id`, `subject_id`, `tag_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 3, 3),
(4, 4, 4),
(5, 4, 5),
(6, 5, 6),
(7, 5, 7),
(8, 6, 8),
(9, 6, 9),
(10, 6, 10),
(11, 7, 11),
(12, 7, 12),
(13, 8, 13),
(14, 9, 14),
(15, 10, 15),
(16, 11, 16),
(17, 11, 17),
(18, 12, 18),
(19, 12, 19),
(20, 13, 20),
(21, 13, 21),
(22, 14, 22),
(23, 15, 23),
(24, 16, 24),
(25, 17, 25),
(26, 18, 26),
(27, 19, 27),
(28, 20, 28),
(29, 20, 29),
(30, 20, 30),
(31, 21, 31),
(32, 22, 32),
(33, 22, 33),
(44, 23, 44),
(43, 23, 43),
(42, 23, 42),
(38, 24, 38),
(39, 24, 39),
(40, 24, 40),
(41, 24, 41),
(45, 23, 45),
(46, 23, 46),
(47, 25, 47),
(48, 25, 48),
(49, 25, 49),
(50, 8, 50),
(51, 26, 51),
(52, 26, 52),
(53, 26, 53),
(54, 26, 54),
(55, 26, 55),
(56, 27, 17),
(57, 27, 56),
(58, 27, 57),
(59, 28, 58),
(60, 28, 59),
(61, 28, 60),
(62, 28, 61),
(63, 29, 62),
(64, 29, 63),
(65, 29, 64),
(66, 29, 65),
(67, 30, 66),
(68, 30, 67),
(69, 30, 68),
(70, 31, 69),
(71, 31, 70),
(72, 31, 71),
(73, 31, 72),
(74, 32, 71),
(75, 32, 73),
(76, 32, 74),
(77, 32, 75),
(78, 33, 16),
(79, 33, 76),
(80, 33, 77),
(81, 33, 78),
(82, 34, 79),
(83, 34, 80),
(84, 35, 81);

-- --------------------------------------------------------

--
-- 表的结构 `roles`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:01
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `display_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=9 ;

--
-- 转存表中的数据 `roles`
--

INSERT INTO `roles` (`id`, `name`, `display_name`) VALUES
(1, 'Admin', '管理员'),
(8, 'Editor', '撰稿人');

-- --------------------------------------------------------

--
-- 表的结构 `subjects`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:29
--

DROP TABLE IF EXISTS `subjects`;
CREATE TABLE IF NOT EXISTS `subjects` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(200) DEFAULT NULL,
  `status` tinyint(2) NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `goto_link` varchar(200) DEFAULT NULL,
  `template` varchar(50) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `author` varchar(50) NOT NULL,
  `keywords` varchar(200) NOT NULL,
  `description` text,
  `content` mediumtext NOT NULL,
  `views` int(10) unsigned NOT NULL,
  `banner_id` int(10) unsigned DEFAULT '0',
  `banner_wmp` tinyint(1) DEFAULT '0' COMMENT 'banner图水印位置',
  `source_name` varchar(200) NOT NULL,
  `source_url` varchar(200) NOT NULL,
  `ontop` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `disable_comment` tinyint(1) NOT NULL DEFAULT '0',
  `content_wmp` tinyint(1) NOT NULL DEFAULT '0',
  `published` int(10) NOT NULL DEFAULT '0',
  `created` int(10) unsigned NOT NULL,
  `modified` int(10) unsigned NOT NULL,
  `comments` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `slug` (`slug`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=36 ;

--
-- 转存表中的数据 `subjects`
--

INSERT INTO `subjects` (`id`, `slug`, `status`, `user_id`, `goto_link`, `template`, `title`, `author`, `keywords`, `description`, `content`, `views`, `banner_id`, `banner_wmp`, `source_name`, `source_url`, `ontop`, `disable_comment`, `content_wmp`, `published`, `created`, `modified`, `comments`) VALUES
(35, '', 1, 1, '', '不使用文章自定义模板', 'Hello', 'admin', 'hello', '', 'Hello', 0, 0, 0, '', '', 0, 0, 0, 1396250875, 1396250861, 1396250875, 0);

-- --------------------------------------------------------

--
-- 表的结构 `subject_quality`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:01
--

DROP TABLE IF EXISTS `subject_quality`;
CREATE TABLE IF NOT EXISTS `subject_quality` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `subject_id` int(10) NOT NULL,
  `views` int(5) NOT NULL,
  `comments` int(5) NOT NULL,
  `quality` varchar(5) NOT NULL,
  `created` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `subject_quality`
--


-- --------------------------------------------------------

--
-- 表的结构 `subject_remarks`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:01
--

DROP TABLE IF EXISTS `subject_remarks`;
CREATE TABLE IF NOT EXISTS `subject_remarks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `subject_id` int(10) unsigned NOT NULL,
  `user_id` int(10) NOT NULL,
  `to_user_id` int(10) unsigned NOT NULL DEFAULT '0',
  `nickname` varchar(50) NOT NULL,
  `content` text NOT NULL,
  `read` tinyint(1) NOT NULL DEFAULT '0',
  `created` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `subject_remarks`
--


-- --------------------------------------------------------

--
-- 表的结构 `tags`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:29
--

DROP TABLE IF EXISTS `tags`;
CREATE TABLE IF NOT EXISTS `tags` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=82 ;

--
-- 转存表中的数据 `tags`
--

INSERT INTO `tags` (`id`, `name`, `description`) VALUES
(1, '12', NULL),
(2, '11111', NULL),
(3, '部落格', NULL),
(4, '摩卡', NULL),
(5, '咖啡', NULL),
(6, 'git', NULL),
(7, 'windows', NULL),
(8, '地心引力', NULL),
(9, '電影', NULL),
(10, '好片', NULL),
(11, '幼稚園', NULL),
(12, 'yuki', NULL),
(13, 'about', NULL),
(14, 'resume', NULL),
(15, '專案', NULL),
(16, '手機', NULL),
(17, '日本', NULL),
(18, 'tamagochi', NULL),
(19, '拓麻歌子', NULL),
(20, '遊戲', NULL),
(21, '夢', NULL),
(22, 'Powerful Digi', NULL),
(23, '大学', NULL),
(24, 'Colorful', NULL),
(25, '精神欺騙', NULL),
(26, 'bus', NULL),
(27, 'id', NULL),
(28, 'gba', NULL),
(29, '掌机', NULL),
(30, 'gbc', NULL),
(31, 'Dreamcast', NULL),
(32, 'Cell', NULL),
(33, 'Game', NULL),
(34, '大學', NULL),
(35, '畢業', NULL),
(36, '愛', NULL),
(37, 'ss', NULL),
(38, 'palm', NULL),
(39, 'treo', NULL),
(40, 'bb', NULL),
(41, 'palmos4', NULL),
(42, 'fc', NULL),
(43, '红白机', NULL),
(44, '紅白機', NULL),
(45, '生日快樂', NULL),
(46, '任天堂', NULL),
(47, 'cd', NULL),
(48, '大冢爱', NULL),
(49, '音乐', NULL),
(50, 'solidzoro', NULL),
(51, '工作', NULL),
(52, '第一天', NULL),
(53, '廣州', NULL),
(54, '番禺', NULL),
(55, 'yogo', NULL),
(56, '負建筑', NULL),
(57, '建築', NULL),
(58, 'logo', NULL),
(59, '第一卷', NULL),
(60, 's8', NULL),
(61, '8m', NULL),
(62, 'Objectified', NULL),
(63, '设计', NULL),
(64, '电影', NULL),
(65, '設計', NULL),
(66, '播客', NULL),
(67, 'Podcast', NULL),
(68, '中文Podcast', NULL),
(69, 'ipad', NULL),
(70, 'mini', NULL),
(71, '鍵盤', NULL),
(72, 'ik700', NULL),
(73, 'thinkpad', NULL),
(74, 'table2', NULL),
(75, '藍牙', NULL),
(76, '拍照', NULL),
(77, '日本手機', NULL),
(78, 'w21ca', NULL),
(79, 'grd', NULL),
(80, '理光', NULL),
(81, 'hello', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `users`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:26
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `avatar_id` int(10) NOT NULL DEFAULT '0',
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `editor_type` tinyint(1) NOT NULL DEFAULT '0',
  `editor_theme` tinyint(2) NOT NULL,
  `registered` int(10) unsigned NOT NULL,
  `logined` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- 转存表中的数据 `users`
--

INSERT INTO `users` (`id`, `avatar_id`, `username`, `password`, `email`, `enabled`, `editor_type`, `editor_theme`, `registered`, `logined`) VALUES
(1, 1, 'admin', 'f6fdffe48c908deb0f4c3bd36c032e72', 'admin@admin.com', 1, 0, 0, 1364260736, 1396250499);

-- --------------------------------------------------------

--
-- 表的结构 `user_metas`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:01
--

DROP TABLE IF EXISTS `user_metas`;
CREATE TABLE IF NOT EXISTS `user_metas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `nickname` varchar(32) DEFAULT NULL,
  `realname` varchar(16) DEFAULT NULL,
  `sex` enum('male','female','unknown') NOT NULL DEFAULT 'unknown',
  `telphone` varchar(16) DEFAULT NULL,
  `site` varchar(50) DEFAULT NULL,
  `qq` varchar(16) DEFAULT NULL,
  `weibo` varchar(50) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `zipcode` varchar(16) DEFAULT NULL,
  `alipay` varchar(16) DEFAULT NULL,
  `job` varchar(16) DEFAULT NULL,
  `bio` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `user_metas`
--

INSERT INTO `user_metas` (`id`, `user_id`, `nickname`, `realname`, `sex`, `telphone`, `site`, `qq`, `weibo`, `address`, `zipcode`, `alipay`, `job`, `bio`) VALUES
(1, 1, '', '', 'unknown', NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, ''),
(2, 4, '', '', '', NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, '');

-- --------------------------------------------------------

--
-- 表的结构 `user_oauth`
--
-- 创建时间: 2014 年 03 月 31 日 15:01
-- 最后更新: 2014 年 03 月 31 日 15:01
--

DROP TABLE IF EXISTS `user_oauth`;
CREATE TABLE IF NOT EXISTS `user_oauth` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `token` varchar(100) NOT NULL,
  `uid` int(10) NOT NULL,
  `via` varchar(50) NOT NULL,
  `expire_at` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `user_oauth`
--

