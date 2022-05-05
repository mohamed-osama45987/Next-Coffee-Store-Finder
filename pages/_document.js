import Document, { Html, Main, Head, NextScript } from "next/document";


class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* for the first font  */}
          <link
            rel="preload"
            href="/fonts/IBMPlexSans-Bold.ttf"
            as="font"
            crossOrigin="anonymous"></link>

          {/* for the second font  */}
          <link
            rel="preload"
            href="/fonts/IBMPlexSans-Regular.ttf"
            as="font"
            crossOrigin="anonymous"
          ></link>

          {/* for the thirdfont  */}
          <link
            rel="preload"
            href="/fonts/IBMPlexSans-SemiBold.ttf"
            as="font"
            crossOrigin="anonymous"
          ></link>

        </Head>
        <body>
          <Main></Main>
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument