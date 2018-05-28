<?php
  require_once 'server/Mobile_Detect.php';
  $detect = new Mobile_Detect;
?>

<!DOCTYPE html>

<html lang="en">

  <head>
    <title>Mathis Biabiany - Creative Technologist & Artist</title>

    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

    <meta name="description" content="Creative technologist at Resn & Worldwide freelance artist">
    <meta name="keywords" content="developer,creative,technologist,artist,javascript,webgl,freelance">

    <base href="/" >

    <!-- Facebook meta -->
    <meta property="og:title" content="Mathis Biabiany - Creative Technologist & Artist"/>
    <meta property="og:image" content="http://www.mathis-biabiany.fr/images/share/facebook.jpg"/>
    <meta property="og:url" content="http://www.mathis-biabiany.fr"/>
    <meta property="og:site_name" content="Mathis Biabiany"/>
    <meta property="og:description" content="Creative technologist at Resn & Worldwide freelance artist"/>

    <!-- Twitter meta -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@MathisBiabiany">
    <meta name="twitter:creator" content="@MathisBiabiany">
    <meta name="twitter:title" content="Mathis Biabiany - Creative Technologist & Artist">
    <meta name="twitter:description" content="Creative technologist at Resn & Worldwide freelance artist">
    <meta name="twitter:image" content="http://www.mathis-biabiany.fr/images/share/twitter.jpg">
    <meta name="twitter:image:src" content="http://www.mathis-biabiany.fr/images/share/twitter.jpg">

    <!-- GOOGLE + Share -->
    <meta itemprop="name" content="Mathis Biabiany - Creative Technologist & Artist">
    <meta itemprop="description" content="Creative technologist at Resn & Worldwide freelance artist">
    <meta itemprop="image" content="http://www.mathis-biabiany.fr/images/share/facebook.jpg">

    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="180x180" href="/images/share/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/share/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/images/share/favicon-16x16.png">
    <link rel="manifest" href="/images/share/site.webmanifest">
    <link rel="mask-icon" href="/images/share/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">

    <?php if ($detect->isMobile() && !$detect->isTablet()) { ?>
    <link href="<%= htmlWebpackPlugin.files.chunks.mobile.css %>" rel="stylesheet"></head>
    <?php } else { ?>
    <link href="<%= htmlWebpackPlugin.files.chunks.desktop.css %>" rel="stylesheet"></head>
    <?php } ?>

    <style>
      #fallback {
        position: fixed;
        height: 100%;
        width: 100%;
        text-align: center;
        background: black;
        color: white;
        font-size: 2rem;
        display: none;
      }

      #fallback .fallback__text {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        font-family: 'roboto';
      }

      @media screen and (min-width:0\0) and (min-resolution: +72dpi) {
        #fallback {
          display: block;
        }
      }
    </style>

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-119960130-1"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-119960130-1');
    </script>


  </head>

  <body>

    <div id="fallback"><div class="fallback__text">Your browser is outdated. Please, use the last version of Google Chrome.</div></div>
    <div id="application">

    </div>

    <?php if ($detect->isMobile() && !$detect->isTablet()) { ?>
    <script type="text/javascript" src="<%= htmlWebpackPlugin.files.chunks.mobile.entry %>"></script>
    <?php } else { ?>
    <script type="text/javascript" src="<%= htmlWebpackPlugin.files.chunks.desktop.entry %>"></script>
    <?php } ?>

  </body>

</html>
