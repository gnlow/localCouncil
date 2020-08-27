const data = require("./edited.json")
const {
    groupBy,
    mapValues,
} = require("lodash")
const Table = require("cli-table3")

const citySort = ({서울 = 0, 부산 = 0, 대구 = 0, 인천 = 0, 광주 = 0, 대전 = 0, 울산 = 0, 세종 = 0, 경기 = 0, 강원 = 0, 충북 = 0, 충남 = 0, 전북 = 0, 전남 = 0, 경북 = 0, 경남 = 0, 제주 = 0}) => [서울, 부산, 대구, 인천, 광주, 대전, 울산, 세종, 경기, 강원, 충북, 충남, 전북, 전남, 경북, 경남, 제주]

const cityList = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"]

const highMember = Object.keys(data.member).map(name => data.member[name]).filter(({type}) => type == "광역의원")

const x = mapValues(groupBy(highMember, "party"), members => citySort(mapValues(groupBy(members, member => member.local.substring(0, 2)), "length")))

const table = new Table({
    head: ["지역", ...Object.keys(x)],
})
table.push(...Array(17).fill().map((n, i) => ({[cityList[i]]: Array(7).fill().map((m,j) => x[Object.keys(x)[j]][i])})))
console.log(table.toString())