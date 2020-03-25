import 'isomorphic-unfetch'
import App from 'next/app'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import { SWRConfig } from 'swr'
import { fetcher } from '../lib/api'
import { BREAKPOINTS, DEFAULT_SEO } from '../consts'

interface MyAppProps extends App {}

class MyApp extends App<MyAppProps> {
  render() {
    const { Component, pageProps } = this.props
    return (
      <div className="container">
        <Head>
          <title>COVID-19</title>
          <link rel="icon" href="/favicon.ico" />
          {/* <link href="https://fonts.googleapis.com/css2?family=Quantico:wght@400;700&display=swap" rel="stylesheet"/> */}
          {/* <link href="https://fonts.googleapis.com/css2?family=Aldrich&display=swap" rel="stylesheet"/> */}
          <link
            href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap"
            rel="stylesheet"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="Banned.Video" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-touch-fullscreen" content="yes" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#2b5797" />
          <meta name="theme-color" content="#1e2022" />

          <link rel="apple-touch-icon" sizes="57x57" href="/images/favicon/apple-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/images/favicon/apple-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/images/favicon/apple-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/images/favicon/apple-icon-76x76.png" />
          <link
            rel="apple-touch-icon"
            sizes="114x114"
            href="/images/favicon/apple-icon-114x114.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="120x120"
            href="/images/favicon/apple-icon-120x120.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="144x144"
            href="/images/favicon/apple-icon-144x144.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/images/favicon/apple-icon-152x152.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/images/favicon/apple-icon-180x180.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/images/favicon/android-icon-192x192.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/images/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="96x96"
            href="/images/favicon/favicon-96x96.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/images/favicon/favicon-16x16.png"
          />
          <meta name="msapplication-TileImage" content="/images/favicon/ms-icon-144x144.png" />

          <link
            rel="apple-touch-startup-image"
            href="/images/splashscreen/apple-splash-2048-2732.png"
            media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/splashscreen/apple-splash-2732-2048.png"
            media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/splashscreen/apple-splash-1668-2388.png"
            media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/splashscreen/apple-splash-2388-1668.png"
            media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/splashscreen/apple-splash-1668-2224.png"
            media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/splashscreen/apple-splash-2224-1668.png"
            media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/splashscreen/apple-splash-1536-2048.png"
            media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/splashscreen/apple-splash-2048-1536.png"
            media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/splashscreen/apple-splash-1242-2688.png"
            media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/splashscreen/apple-splash-2688-1242.png"
            media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/splashscreen/apple-splash-1125-2436.png"
            media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/splashscreen/apple-splash-2436-1125.png"
            media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/splashscreen/apple-splash-828-1792.png"
            media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/splashscreen/apple-splash-1792-828.png"
            media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/splashscreen/apple-splash-1242-2208.png"
            media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/splashscreen/apple-splash-2208-1242.png"
            media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/splashscreen/apple-splash-750-1334.png"
            media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/splashscreen/apple-splash-1334-750.png"
            media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/splashscreen/apple-splash-640-1136.png"
            media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/splashscreen/apple-splash-1136-640.png"
            media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          />

          <link rel="manifest" href="/manifest.json" />
        </Head>

        <DefaultSeo {...DEFAULT_SEO} />
        <SWRConfig value={{ fetcher }}>
          <Component {...pageProps} />
        </SWRConfig>

        <style jsx global>{`
          html,
          body {
            padding: 0;
            margin: 0;
            font-family: Open Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
              Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
            background-color: #030303;
            overflow-x: hidden;

            scrollbar-width: thin;
            scrollbar-color: var(--accent) transparent;
          }

          body::-webkit-scrollbar-track {
            background-color: transparent;
            width: 12px;
          }

          body::-webkit-scrollbar {
            width: 6px;
          }

          body::-webkit-scrollbar-thumb {
            background-color: var(--accent);
            border-radius: 30px;
          }

          * {
            box-sizing: border-box;
          }

          h1,
          h2,
          h3 {
            font-family: Orbitron;
            margin: 0;
          }

          .map-path {
            transition: stroke-width 0.2s ease-in-out, opacity 0.2s ease-in-out;
            opacity: 1;
          }

          .map-path.animation-done {
            cursor: pointer;
          }

          .map-path.animation-done:hover {
            stroke-width: 2px;
            stroke: var(--accent);
          }

          .map-path.active {
            stroke-width: 2px;
            stroke: var(--accent);
          }

          @media (max-width: ${BREAKPOINTS[0]}px) {
            #page-wrapper {
              position: fixed;
              width: 100%;
            }
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          :root {
            --background: #060606;
            --danger: #af0404;
            --success: #2eb354;
            --clear: #060606;
            --accent: #b3b3b3;
            --fade-in: fadeIn 0.5s;
          }
        `}</style>
      </div>
    )
  }
}

export default MyApp
