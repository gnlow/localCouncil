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

const names = {}
Object.keys(data.member).forEach(x => {
    names[x.split("_")[0]]?.push(x) || (names[x.split("_")[0]] = [x])
})

eHigh.slice(0).forEach(([district, name, party]) => {
    if (names[name]) {
        const target = names[name].filter(x=>data.member[x].district).length == 1 ? names[name].filter(x=>data.member[x].district)[0] :data.member[names[name].find(n => data.member[n].district == district.replace(" ", "").replace(/.*비례대표/, "비례대표"))]
        if (target) {
            target.party = party
        } else {
            console.log(
`
[warn] 동명이인 목록에서 일치하는 선거구가 없음.
    ${district} ${name} / ${names[name].map(x => data.member[x].district).join(" | ")}`
            )
            const hardTarget = index => {
                const newTarget = names[name][index]
                newTarget.party = party
                console.log(`    => resolved_HARDCODING ${data.member[newTarget].district}`)
            }
            // HARDCODING
            switch (name) {
                case "이재현":
                    hardTarget(1)
                    break
            }
        }
    } else {
        console.log(
`
[warn] 없는 이름.
    ${district} ${name}`
        )
        // HARDCODING
        switch (name) {
            case "최미정":
                console.log(`    => resolved_HARDCODING skip`)
                break
        }
    }
})