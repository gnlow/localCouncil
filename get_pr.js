const {createWriteStream} = require("fs")

const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    })
    const page = await browser.newPage()

    const getOptions = async selector => await page.evaluate(dropdown => {
        return [...dropdown.options].map(x => [x.text, x.value])
    }, await page.$(selector))

    const isVisible = selector => async () => await page.$eval(selector, data => data.style.display) != "none"

    let logContext = []

    const eachOption = (selector, condition, callback, fail, sA, sB) => async (logDepth) => {
        if (await condition()) {
            const options = await getOptions(selector)
            console.log(sA || 1)
            for await (const [text, value] of options.slice(sA || 1, sB)) {
                logContext[logDepth] = text
                console.log(`[select] ${logContext.slice(0, logDepth + 1).join(" > ")}`)
                await page.select(selector, value)
                await page.waitFor(1000)
                await callback?.(logDepth + 1)
            }
        } else {
            await fail?.()
        }
    }

    await page.goto("http://info.nec.go.kr/main/showDocument.xhtml?electionId=0000000000&topMenuId=EP&secondMenuId=EPEI01")

    await page.click("#electionType4")
    await page.select("#electionName", "20180613")
    await page.waitFor(1000)

    const stream = createWriteStream("data_pr.json")
    stream.write("[")

    const readTable = async () => {
        const navigationPromise = page.waitForNavigation()
        await page.click("#searchBtn")
        await navigationPromise
        const table = await page.$$eval("table tr", rows => {
            const tableToObj = ([district, party, number, name, gender, birth, job, education, history]) => ({
                district, 
                party, 
                number, 
                name: name?.match(/^(.*)\n\((.*)\)$/)[1], 
                hanjaName: name?.match(/^(.*)\n\((.*)\)$/)[2], 
                gender, 
                birth, 
                job, 
                education, 
                history
            })

            return Array.from(rows, row => {
                const columns = row.querySelectorAll("td")
                return tableToObj(Array.from(columns, column => {
                    if(column.children[0] == undefined) {
                        return column.innerText
                    } else if (column.children[0].tagName == "BR") {
                        return column.innerText
                    } else if (column.children[0].tagName == "INPUT") {
                        return column.children[0].src
                    } else if (column.children[0].tagName == "A") {
                        const promises = {};
                        [...column.querySelectorAll("a")]
                        .forEach(x => promises[x.innerText] = x.href.match(/javascript:popupPdfViewer\('(.*)'\);/)[1])
                        return promises
                    }
                }))
            })
        })
        stream.write(JSON.stringify({
            election: logContext[0],
            city: logContext[1],
            town: logContext[2],
            data: table
        }))
        stream.write(",")
    }

    await eachOption("#electionCode", isVisible("#spanElectionCode"),
        eachOption("#cityCode", isVisible("#spanCityCode"),
            eachOption("#townCode", isVisible("#spanTownCode"),
                readTable, readTable
            ), readTable
        ), readTable, 5, 7
    )(0)

    stream.write("]")
    stream.end()
    
    await browser.close()
})()