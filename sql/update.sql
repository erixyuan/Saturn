CREATE TABLE IF NOT EXISTS `tags` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;


INSERT INTO `tags`(`id`,`name`, `description`) select `id`,`name`,`description` from `metas` where `type`='tag';
DELETE FROM `metas` WHERE `type`='tag';
RENAME TABLE  `metas` TO  `categories` ;
ALTER TABLE  `categories` CHANGE  `skin`  `template` VARCHAR( 50 ) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;
ALTER TABLE `categories` DROP `count`;
RENAME TABLE  `subjects_applications` TO  `re_subjects_applications` ;
CREATE TABLE IF NOT EXISTS `re_subjects_categories` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `subject_id` int(10) NOT NULL,
  `category_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `re_applications_categories` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `app_id` int(10) NOT NULL,
  `category_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;


INSERT INTO `re_subjects_categories`(`subject_id`, `category_id`) select `subject_id`,`meta_id` from `subjects_metas` where `meta_id` in (select `id` from `categories` where `type` = 'subject');
INSERT INTO `re_applications_categories`(`app_id`, `category_id`) select `application_id`,`meta_id` from `applications_metas` where `meta_id` in (select `id` from `categories` where `type` = 'application');

RENAME TABLE  `subjects_metas` TO  `re_subjects_tags` ;
DELETE FROM `re_subjects_tags` WHERE `meta_id` in (select `id` from `categories` where `type` = 'subject');
RENAME TABLE  `applications_metas` TO  `re_applications_tags` ;
DELETE FROM `re_applications_tags` WHERE `meta_id` in (select `id` from `categories` where `type` = 'application');
ALTER TABLE  `re_applications_tags` CHANGE  `application_id`  `app_id` INT( 10 ) UNSIGNED NOT NULL;

ALTER TABLE  `re_applications_tags` CHANGE  `meta_id`  `tag_id` INT( 10 ) UNSIGNED NOT NULL;
ALTER TABLE  `re_subjects_tags` CHANGE  `meta_id`  `tag_id` INT( 10 ) UNSIGNED NOT NULL;
ALTER TABLE  `re_subjects_tags` CHANGE  `object_id`  `subject_id` INT( 10 ) UNSIGNED NOT NULL;

ALTER TABLE  `applications` CHANGE  `recommend`  `ontop` TINYINT( 1 ) NOT NULL;
ALTER TABLE  `applications` ADD  `published` INT( 10 ) NOT NULL DEFAULT  '0' AFTER  `description`;
ALTER TABLE  `applications` ADD  `to_appwall` TINYINT( 1 ) NOT NULL DEFAULT  '0' AFTER  `ontop`;
ALTER TABLE  `applications` DROP  `username`;
ALTER TABLE  `applications` CHANGE  `icon`  `icon_id` INT( 10 ) UNSIGNED NOT NULL;

ALTER TABLE  `attachments` CHANGE  `parent_id`  `object_id` INT( 10 ) UNSIGNED NOT NULL;
ALTER TABLE  `attachments` CHANGE  `parent_type`  `object_type` VARCHAR( 16 ) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;
ALTER TABLE  `attachments` CHANGE  `parent_relation`  `object_relation` VARCHAR( 16 ) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;
ALTER TABLE  `comments` CHANGE  `belong_id`  `object_id` INT( 10 ) UNSIGNED NOT NULL;
ALTER TABLE  `comments` CHANGE  `message`  `content` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;
ALTER TABLE  `comments` ADD  `object_type` VARCHAR( 16 ) NOT NULL DEFAULT  'subject' AFTER  `object_id`;
RENAME TABLE  `slides` TO  `ads` ;

ALTER TABLE `subjects` DROP `username`;
ALTER TABLE  `subjects` CHANGE  `skip`  `goto_link` VARCHAR( 200 ) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;
ALTER TABLE  `subjects` CHANGE  `skin`  `template` VARCHAR( 50 ) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;
ALTER TABLE  `subjects` CHANGE  `thumb_id`  `banner_id` INT( 10 ) UNSIGNED NULL DEFAULT  '0';
ALTER TABLE  `subjects` CHANGE  `thumb_wmp`  `banner_wmp` TINYINT( 1 ) NULL DEFAULT  '0' COMMENT  'banner图水印位置';
ALTER TABLE  `subjects` CHANGE  `recommend`  `ontop` TINYINT( 1 ) UNSIGNED NOT NULL DEFAULT  '0';
ALTER TABLE  `subjects` CHANGE  `allowcomment`  `disable_comment` TINYINT( 1 ) NOT NULL DEFAULT  '0';
ALTER TABLE  `subjects` CHANGE  `watermark`  `content_wmp` TINYINT( 1 ) NOT NULL DEFAULT  '0';
ALTER TABLE  `subjects` ADD  `published` INT( 10 ) NOT NULL DEFAULT  '0' AFTER  `content_wmp`;

UPDATE `subjects` SET `disable_comment`=3 where `disable_comment` =0;
UPDATE `subjects` SET `disable_comment`=0 where `disable_comment` =1;
UPDATE `subjects` SET `disable_comment`=1 where `disable_comment` =3;

ALTER TABLE `subjects_quality` DROP `subject_created`;
RENAME TABLE  `subjects_quality` TO  `subject_quality` ;

CREATE TABLE `user_metas` (
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
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


INSERT INTO `user_metas`(`user_id`, `nickname`,`sex`,`telphone`,`qq`,`bio`,`weibo`) select `id`,`nickname`,`sex`,`mobile_phone`,`QQ`,`summary`,`site` from `users`;
ALTER TABLE `users` DROP `nickname`;
ALTER TABLE `users` DROP `sex`;
ALTER TABLE `users` DROP `mobile_phone`;
ALTER TABLE `users` DROP `QQ`;
ALTER TABLE `users` DROP `site`;
ALTER TABLE `users` DROP `summary`;
ALTER TABLE `users` DROP `extra`;

DELETE FROM `re_subjects_tags` WHERE `tag_id` not in (select `id` from `tags`);
DELETE FROM `re_applications_tags` WHERE `tag_id` not in (select `id` from `tags`);

UPDATE `subjects` set `published` = `created`;
UPDATE `applications` set `published` = `created`;

ALTER TABLE  `ads` ADD  `type` VARCHAR( 50 ) NULL DEFAULT  'default' AFTER  `name`;
ALTER TABLE  `users` ADD  `avatar_id` int( 10 ) NOT NULL DEFAULT 0 AFTER  `id`;
ALTER TABLE  `users` ADD  `editor_type` tinyint( 1 ) NOT NULL DEFAULT 0 AFTER  `enabled`;
ALTER TABLE  `users` ADD  `editor_theme` tinyint( 1 ) NOT NULL DEFAULT 0 AFTER  `enabled`;

DROP TABLE roles;
CREATE TABLE `roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `display_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


CREATE TABLE `assigned_roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `role_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


CREATE TABLE `permissions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `display_name` varchar(50) DEFAULT NULL,
  `parent_id` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


CREATE TABLE `permission_role` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `permission_id` int(10) unsigned NOT NULL,
  `role_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


CREATE TABLE `user_oauth` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `token` varchar(100) NOT NULL,
  `uid` int(10) NOT NULL,
  `via` varchar(50) NOT NULL,
  `expire_at` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;





--
-- 表的结构 `products`
--

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
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

-- --------------------------------------------------------

--
-- 表的结构 `product_links`
--

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
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 ROW_FORMAT=COMPRESSED AUTO_INCREMENT=3753 ;

-- --------------------------------------------------------

--
-- 表的结构 `re_products_categories`
--

CREATE TABLE IF NOT EXISTS `re_products_categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

-- --------------------------------------------------------

--
-- 表的结构 `re_products_tags`
--

CREATE TABLE IF NOT EXISTS `re_products_tags` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned NOT NULL,
  `tag_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

-- --------------------------------------------------------

--
-- 表的结构 `re_subjects_products`
--

CREATE TABLE IF NOT EXISTS `re_subjects_products` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `subject_id` int(10) unsigned NOT NULL,
  `product_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;
