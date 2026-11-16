const fs = require("fs")
const html = fs.readFileSync("references/template.html", "utf8")

const texts = [...html.matchAll(/>([^<]{3,120})</g)]
  .map((m) => m[1].trim())
  .filter(
    (t) =>
      t &&
      !t.includes("framer") &&
      !t.includes("rgb(") &&
      !t.includes("var(--") &&
      !/^[{}\[\];,#.]/.test(t) &&
      t.length < 100
  )

console.log([...new Set(texts)].slice(0, 200).join("\n"))
console.log("---")
console.log("bytes", html.length)
console.log("images", (html.match(/framerusercontent\.com\/images/g) || []).length)
console.log("style tags", (html.match(/<style/g) || []).length)
console.log("script tags", (html.match(/<script/g) || []).length)

// color tokens
const tokens = [...html.matchAll(/--token-[a-f0-9-]+:([^;}{]+)/g)].slice(0, 40)
console.log("--- tokens ---")
tokens.forEach((t) => console.log(t[0].slice(0, 120)))
