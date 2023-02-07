import install from "@twind/with-next/document";
import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  /* ... */
}

export default install(MyDocument);
