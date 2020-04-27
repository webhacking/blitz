import { Document, Html, DocumentHead, Main, NextScript } from "@blitzjs/core"

export default class extends Document {
  render() {
    return (
      <Html lang="en">
        <DocumentHead />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
