const fs = require("fs")
const html = fs.readFileSync("references/template.html", "utf8")

// Nav logo SVG prefix from Brand logo
const brandSrcStart = 'width=95 height=24 src="data:image/svg+xml;base64,'
console.log("exact brand src count", html.split(brandSrcStart).length - 1)

// Footer company logo
const footerSrcStart = "width=130 height=39 src=data:image/svg+xml;base64,"
console.log("footer company logo count", html.split(footerSrcStart).length - 1)

// Find all nav containers that look like logo links near Brand logo
const positions = []
let idx = 0
while ((idx = html.indexOf("Brand logo", idx)) !== -1) {
  positions.push(idx)
  idx += 1
}
console.log("Brand logo text positions", positions)

idx = 0
const companyLogoName = []
while ((idx = html.indexOf('data-framer-name="Company Logo"', idx)) !== -1) {
  companyLogoName.push(idx)
  idx += 1
}
console.log("Company Logo named wrappers", companyLogoName)

// Extract full img tags for brand + footer
function extractImgAround(pos) {
  const start = html.lastIndexOf("<img", pos)
  const end = html.indexOf(">", start)
  return html.slice(start, end + 1)
}

positions.forEach((p, i) => {
  const tag = extractImgAround(p)
  console.log("\nBRAND IMG", i, "len", tag.length)
  console.log(tag.slice(0, 200), "...", tag.slice(-120))
})

companyLogoName.forEach((p, i) => {
  const imgPos = html.indexOf("<img", p)
  const end = html.indexOf(">", imgPos)
  const tag = html.slice(imgPos, end + 1)
  console.log("\nCOMPANY IMG", i, "len", tag.length)
  console.log(tag.slice(0, 200), "...", tag.slice(-120))
})
