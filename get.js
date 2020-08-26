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
    const eachOption = (selector, condition, callback) => async (logDepth) => {
        if (await condition()) {
            const options = await getOptions(selector)
            for await (const [text, value] of options.slice(1)) {
                logContext[logDepth] = text
                console.log(`[select] ${logContext.slice(0, logDepth + 1).join(" > ")}`)
                await page.select(selector, value)
                await page.waitFor(1000)
                await callback?.(logDepth + 1)
            }
        }
    }

    await page.goto("http://info.nec.go.kr/main/showDocument.xhtml?electionId=0000000000&topMenuId=EP&secondMenuId=EPEI00")

    await page.click("#electionType4")
    await page.select("#electionName", "20180613")
    await page.waitFor(1000)

    await eachOption("#electionCode", isVisible("#spanElectionCode"),
        eachOption("#cityCode", isVisible("#spanCityCode"),
            eachOption("#townCode", isVisible("#spanTownCode"),
                async () => {

                }
            )
        )
    )(0)
    await browser.close()
})()