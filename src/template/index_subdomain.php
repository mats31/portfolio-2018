<?php
  require_once 'server/Mobile_Detect.php';
  $detect = new Mobile_Detect;
?>

<!DOCTYPE html>

<html lang="en">

  <head>
    <title>Mathis Biabiany - Artist & Creative Technologist</title>

    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

    <meta name="description" content="Worldwide freelance artist & creative technologist">
    <meta name="keywords" content="developer,creative,technologist,artist,javascript,webgl">

    <base href="/portfolio2018/" >

    <!-- Facebook meta -->
    <meta property="og:title" content="Mathis Biabiany - Artist & Creative Technologist"/>
    <meta property="og:image" content="http://www.mathis-biabiany.fr/images/share/facebook.jpg"/>
    <meta property="og:url" content="http://www.mathis-biabiany.fr"/>
    <meta property="og:site_name" content="Mathis Biabiany"/>
    <meta property="og:description" content="Worldwide freelance artist & creative technologist"/>

    <!-- Twitter meta -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@MathisBiabiany">
    <meta name="twitter:creator" content="@MathisBiabiany">
    <meta name="twitter:title" content="Mathis Biabiany - Artist & Creative Technologist">
    <meta name="twitter:description" content="Worldwide freelance artist & creative technologist">
    <meta name="twitter:image" content="http://www.mathis-biabiany.fr/images/share/twitter.jpg">
    <meta name="twitter:image:src" content="http://www.mathis-biabiany.fr/images/share/twitter.jpg">

    <!-- GOOGLE + Share -->
    <meta itemprop="name" content="Mathis Biabiany - Artist & Creative Technologist">
    <meta itemprop="description" content="Worldwide freelance artist & creative technologist">
    <meta itemprop="image" content="http://www.mathis-biabiany.fr/images/share/facebook.jpg">

    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="180x180" href="/images/share/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/share/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/images/share/favicon-16x16.png">
    <link rel="manifest" href="/images/share/site.webmanifest">
    <link rel="mask-icon" href="/images/share/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">

    <?php if ($detect->isMobile() || $detect->isTablet()) { ?>
    <link href="<%= htmlWebpackPlugin.files.chunks.mobile.css %>" rel="stylesheet"></head>
    <?php } else { ?>
    <link href="<%= htmlWebpackPlugin.files.chunks.desktop.css %>" rel="stylesheet"></head>
    <?php } ?>

  </head>

  <body>

    <div id="application">

    </div>

    <?php if ($detect->isMobile() && !$detect->isTablet()) { ?>
    <script type="text/javascript" src="<%= htmlWebpackPlugin.files.chunks.mobile.entry %>"></script>
    <?php } else { ?>
    <script type="text/javascript" src="<%= htmlWebpackPlugin.files.chunks.desktop.entry %>"></script>
    <?php } ?>

  </body>

</html>
