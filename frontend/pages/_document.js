import Document, { Head, Main, NextScript } from 'next/document'
import {
  styledNormalize,
  injectGlobal,
  ServerStyleSheet,
} from 'styled-components'

injectGlobal`
  ${styledNormalize}
  body {
    line-height: 1.5;
  }
  html {
    box-sizing: border-box;
    overflow-wrap: break-word;
    margin: 0;
  }
  *,
  *::before,
  *::after {
    box-sizing: inherit;
    overflow-wrap: break-word;
    margin: 0;
    font-family: 'Roboto Mono', monospace;
  }
`

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />)
    )
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags }
  }
  render() {
    return (
      <html>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="description"
            content="AddrETH - Claim your address and personalize your own page!"
          />
          <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto+Mono:100,400,700"
            rel="stylesheet"
          />
          {this.props.styleTags}
        </Head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
