var colorMap = {};
[...document.querySelector("table").querySelectorAll("tr")].slice(1, -1).forEach(x => {
    colorMap[x.querySelector("td").style["background-color"]] = x.querySelectorAll("td")[1].innerText
})

var data = [];
var invalid = [];
var delNote = [];
[].concat(...[...document.querySelectorAll("table")].slice(1, -1).map(x => [...x.querySelectorAll("tr")])).forEach(y => {
    if (y.querySelectorAll("td")[0]) {
        var district = "";
        [...y.querySelectorAll("td")].forEach((z, i) => {
            if (z.innerText.includes("선거구") || z.innerText.includes("비례대표")) {
                district = z.innerText
            } else if (z.innerText) {
                if (colorMap[z.style["background-color"]]) {
                    if (district) {
                        data.push([district, z.innerText, colorMap[z.style["background-color"]]])
                    } else {
                        if (delNote.includes(data.filter(x=>x[2]=="공석").reverse()[0])) {
                            delNote.push(data.filter(x=>x[2]=="공석").reverse()[1])
                        } else {
                            delNote.push(data.filter(x=>x[2]=="공석").reverse()[0])
                        }
                        
                        data.push([data[data.length-1][0], z.innerText, colorMap[z.style["background-color"]]])
                    }
                } else {
                    invalid.push([district, z.innerText])
                    data.push([district, z.innerText, "공석"])
                }
            }
        })
    }
})

delNote.forEach(x => {
    data.splice(data.findIndex(y => y.join() == x.join()), 1)
})
console.log(data, delNote, data.filter(x => x[2]=="공석"), invalid)
