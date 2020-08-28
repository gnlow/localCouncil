const wikiHigh = require("./wikidata_high.js")
const data = require("./edited.json")

const high = wikiHigh.split("\n").map(x => x.split("\t"))

let prev
let isFirstEmpty = true

high.filter(x => x[1]).forEach(([district, name, party], i, l) => {
    if (district == "") {
        if (isFirstEmpty) {
            isFirstEmpty = false
            if (!prev.includes("비례대표")) {
                l[i-1][0] = undefined
            }
        }
        l[i][0] = prev
    } else {
        prev = district
        isFirstEmpty = true
    }
})
const eHigh = high.filter(x => x[0])