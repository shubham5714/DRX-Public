import { readFile } from "fs/promises"
import path from "path"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

/** Hide leftover Framer marketplace chrome if any still exists in the HTML. */
const PRODUCTION_HIDE_STYLE = `<style id="drx-production-hide">
#__framer-badge-container,
.framer-x1unk3-container,
.framer-16pq425-container,
[data-framer-name="Footer Bottom"],
[data-framer-name="Bottom CTA Card"],
[data-framer-name="Bottom Lines"],
[data-framer-name="Big Logo"],
[data-framer-name="Dropdown Wrap"],
[data-framer-name="Right Icon Wrap"]{display:none!important;visibility:hidden!important;pointer-events:none!important}
</style>`

export async function GET() {
  const raw = await readFile(
    path.join(process.cwd(), "references", "template.html"),
    "utf8"
  )
  const html = raw.includes("</head>")
    ? raw.replace("</head>", `${PRODUCTION_HIDE_STYLE}</head>`)
    : `${PRODUCTION_HIDE_STYLE}${raw}`

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  })
}
