const data = require("./data.json")
const dataPr = require("./data_pr.json")
const {groupBy} = require("lodash")

const highSimple = name => name?.replace(/(.*?)(도|광역시|특별시|특별자치시|특별자치도)/, "$1").replace(/(.).(.)/, "$1$2")

const result = {}
const grouped = groupBy(data, "election")
const sameName = {}
const names = {}

const addName = (data) => {
    const nameCode = `${data.name}_${data.birth.substring(2, 4)}${data.birth.substring(5, 7)}${data.birth.substring(8, 10)}`
    if (!sameName[data.name]) {
        sameName[data.name] = []
    }
    if (sameName[data.name].includes(nameCode)) {
        console.log(nameCode)
        const simpl = ({birth, local, type}) => `${birth} ${local} ${type}`
        console.log(simpl(names[nameCode]))
        console.log(simpl(data))
    }
    sameName[data.name].push(nameCode)
    if (sameName[data.name].length > 1) {
        // console.log(sameName[data.name])
    }
    names[nameCode] = data
    if (names[data.name]) {
        // console.log(sameName[data.name])
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
grouped["구·시·군의회의원선거"].forEach(({data, city, town}) => data.slice(1).forEach(x => {
    const highLocal = highSimple(city)
    const localName = `${highLocal}_${town?.replace(/(.{1,3})(시|군|구)((.*)구)?/, "$1")}`
    x.local = localName
    x.type = "기초의원"
    result[localName].member.push(x)

    addName(x)
}))
dataPr[0].data.slice(1).forEach(data => {
    data.local = highSimple(data.district)
    data.district = "비례대표"
    data.type = "광역의원"
    data.birth = data.birth.substring(0, 10)
    result[data.local].member.push(data)

    addName(data)
})
dataPr.slice(1).forEach(({data, city}) => data.slice(1).forEach(x => {
    x.local = `${highSimple(city)}_${x.district.replace(/(.*)(시|군|구)/, "$1")}`
    x.district = "비례대표"
    x.type = "기초의원"
    x.birth = x.birth.substring(0, 10)
    result[x.local].member.push(x)

    addName(x)
}))
//console.log(grouped["시·도의회의원선거"][0])
console.log(Object.keys(names).length)