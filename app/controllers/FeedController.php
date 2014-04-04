<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class FeedController extends BaseController {

    const CACHE_MINUTES = 30;

    function show() {
        date_default_timezone_set('Etc/GMT+8');

        $key    = 'feed';
        $output = Cache::get($key);
        if (!$output) {
            $rss_title       = Option::get('sitename');
            $rss_description = Option::get('site::description');
            // $rss_link        = Option::get('domain') . '/feed';
            $rss_link        = url('feed');
            $now             = date("D, d M Y H:i:s T");
            $output          = <<<rss
<?xml version="1.0"?>
<rss xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/"
xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
xmlns:slash="http://purl.org/rss/1.0/modules/slash/" version="2.0">
<channel>
<title>{$rss_title}</title>
<link>{$rss_link}</link>
<description>{$rss_description}</description>
<language>zh-cn</language>
<pubDate>{$now}</pubDate>
<lastBuildDate>{$now}</lastBuildDate>
rss;

//            $host = route('feed');

            $a_articles = Article::status(Article::S_PUBLISHED)
                    ->orderby('published', 'desc')
                    ->paginate(20);

            $domain = Option::get('domain');
            foreach ($a_articles as $subject) {
                if (strpos($domain, 'zoopda') !== false) {
                    $image = '<p><img title="' . $subject->title . '" src="' . $subject->banner_url(array('wmp' => 3, 'w' => 640)) . '"/></a>';
                } else {
                    $image = '';
                }
                $content = $subject->getContent(array('img_args' => array('mw' => 800, 'wmp' => 3)));

                $output .=
                "<item>"
                    ."<title>" . htmlspecialchars($subject->title) . "</title> <link>"//$subject->url()
                    . "</link>"
                    . "<description>" . strip_tags($subject->description) . "</description>"
                    ."<content:encoded>" . htmlspecialchars($image . $content) . "</content:encoded>"
                    ."<pubDate>" . date("D, d M Y H:i:s +0000", $subject->published) . "</pubDate>"
                    ."<dc:creator>" . $subject->author . "</dc:creator>"
                    ."<source>$rss_link</source>"
                ."</item>";
            }
            $output .= "</channel></rss>";

            //XML 解析，排除控制字符
            $output = preg_replace('/[\x00-\x08\x1b\x0b-\x0c\x0e-\x1f\x7f]/', '', $output);

            Cache::put($key, $output, self::CACHE_MINUTES);
        }

        return Response::make($output)->header('Content-type', 'application/xml');
    }

}
