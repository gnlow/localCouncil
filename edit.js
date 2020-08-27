const data = require("./data.json")
const {groupBy} = require("lodash")

const highSimple = name => name?.replace(/(.*?)(도|광역시|특별시|특별자치시|특별자치도)/, "$1").replace(/(.).(.)/, "$1$2")

const result = {}
const grouped = groupBy(data, "election")
const sameName = {}
const names = {}

const addName = (data) => {
    const nameCode = `${data.name}_${data.birth.substring(2, 4)}${data.birth.substring(5, 7)}`
    if (!sameName[data.name]) {
        sameName[data.name] = []
    }
    sameName[data.name].push(nameCode)
    if (sameName[data.name].length > 1) {
        console.log(sameName[data.name])
    }
    names[nameCode] = data
    if (names[data.name]) {
        console.log(sameName[data.name])
    }
}

grouped["시·도지사선거"][0].data.slice(1).forEach(x => {
    const localName = highSimple(x.district)
    result[localName] = {
        member: []
    }
    delete x.district
    x.local = localName
    x.type = "광역자치단체장"
    result[localName].head = x

    addName(x)
})
grouped["구·시·군의 장선거"].forEach(({data, city}) => data.slice(1).forEach(x => {
    const localName = `${highSimple(city)}_${x.district?.replace(/(.*)(시|군|구)/, "$1")}`
    result[localName] = {
        member: [],
        highMember: [],
    }
    delete x.district
    x.local = localName
    x.type = "기초자치단체장"
    result[localName].head = x

    addName(x)
}))
grouped["시·도의회의원선거"].forEach(({data, city, town}) => data.slice(1).forEach(x => {
    const highLocal = highSimple(city)
    const localName = `${highLocal}_${town?.replace(/(.{1,3})(시|군|구)((.*)구)?/, "$1")}`
    x.local = localName
    x.type = "광역의원"
    result[highLocal].member.push(x)
    result[localName]?.highMember?.push(x)

    addName(x)
}))
//console.log(grouped["시·도의회의원선거"][0])
//console.log(result["경기_수원"])