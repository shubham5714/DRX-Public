const fs = require("fs")
const html = fs.readFileSync("references/template.html", "utf8")

// Find all occurrences of the brand logo base64 prefix / size 95x24
const markers = [
  'alt="Brand logo"',
  "alt=Brand logo",
  "alt='Brand logo'",
  'width=95 height=24',
  'width="95" height="24"',
  'data-framer-name="Logo Wrapper"',
  "data-framer-name=Logo Wrapper",
]

for (const marker of markers) {
  let count = 0
  let idx = 0
  while ((idx = html.indexOf(marker, idx)) !== -1) {
    count++
    idx += marker.length
  }
  console.log(marker, count)
}

// Find footer brand area near "Logo Wrapper"
let idx = 0
let n = 0
while ((idx = html.indexOf('data-framer-name="Logo Wrapper"', idx)) !== -1 && n < 10) {
  console.log("\n=== Logo Wrapper", n, "at", idx)
  console.log(html.slice(idx, idx + 1200).replace(/\s+/g, " ").slice(0, 900))
  idx += 1
  n++
}

// Also search for unquoted Logo Wrapper
idx = 0
n = 0
while ((idx = html.indexOf("data-framer-name=Logo Wrapper", idx)) !== -1 && n < 10) {
  console.log("\n=== Logo Wrapper unquoted", n, "at", idx)
  console.log(html.slice(idx, idx + 1200).replace(/\s+/g, " ").slice(0, 900))
  idx += 1
  n++
}
