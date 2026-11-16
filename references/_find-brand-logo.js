const fs = require("fs")
const html = fs.readFileSync("references/template.html", "utf8")

const brandLogoImgs = [...html.matchAll(/<img\b[^>]*alt=["']?Brand logo["']?[^>]*>/gi)]
console.log("Brand logo imgs", brandLogoImgs.length)
brandLogoImgs.forEach((m, i) => {
  console.log("---", i)
  console.log(m[0].slice(0, 800))
})

const footerLogo = [...html.matchAll(/data-framer-name=["']?Logo["']?[^>]{0,300}/gi)]
console.log("framer-name Logo attrs", footerLogo.length)
footerLogo.slice(0, 30).forEach((m, i) => console.log(i, m[0]))

// Find nav brand logo wrappers near start of main
const pos = html.indexOf('alt="Brand logo"')
console.log("first Brand logo pos", pos)
console.log(html.slice(pos - 400, pos + 600))
