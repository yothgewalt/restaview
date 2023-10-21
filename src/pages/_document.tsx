import { Html, Head, Main, NextScript } from "next/document";
import { ColorSchemeScript } from "@mantine/core";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <ColorSchemeScript defaultColorScheme="auto" />
            </Head>
            <body className="bg-[#edf0f2]">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
