const wikiHigh = require("./wikidata_high.js")
const wikiLow = require("./wikidata_low.js")
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
const allData = high.filter(x => x[0]).concat(wikiLow.map(([district, name, party]) => [district, name.replace(/(.*)\(.*\).*/, "$1"), party, name.replace(/(.*)\((.*)\).*/, "$2")]))

const names = {}
Object.keys(data.member).forEach(x => {
    names[x.split("_")[0]]?.push(x) || (names[x.split("_")[0]] = [x])
})
let checkCount = 0

let target
allData.slice(0).forEach(([district, name, party, hanjaName], ii, ll) => {
    if (names[name]) {
        if (names[name].filter(n => data.member[n].district == district.replace(" ", "").replace(/.*비례대표/, "비례대표")).length > 1) {
            const possibles = names[name].filter(n => data.member[n].district == district.replace(" ", "").replace(/.*비례대표/, "비례대표"))
            const hanjaPos = possibles.filter(q => data.member[q].hanjaName == hanjaName)
            if (hanjaPos.length == 1) {
                target = data.member[names[name].filter(n => data.member[n].district == district.replace(" ", "").replace(/.*비례대표/, "비례대표")).find(q => data.member[q].hanjaName == hanjaName)]
                
                //console.log("한자이름으로 구별함", district, name, hanjaName, target,  "\n")
            } else if (possibles.find(x => data.member[x].local == target.local)) {
                target = data.member[possibles.find(x => data.member[x].local == target.local)]
            } else {
                console.log(
`
[warn] 동명이인 목록에서 일치하는 선거구가 여러개임.
${district} ${name} 
이전 항목: ${ll[ii-1][0]} ${ll[ii-1][1]} -> ${target?.local} ${target?.name}
동명이인 목록: ${possibles.map(x => data.member[x].local).join(" | ")}`
                )
                const hardTarget = index => {
                    target = data.member[possibles[index]]
                    console.log(`    => resolved_HARDCODING ${target.local}`)
                }
                switch (name) {
                    case "김화숙":
                        hardTarget(0)
                        break
                    case "강민숙":
                        hardTarget(0)
                        break
                }
            }
            
        } else {
            target = data.member[names[name].filter(x=>data.member[x].district).length == 1 ? names[name].filter(x=>data.member[x].district)[0] : names[name].find(n => data.member[n].district == district.replace(" ", "").replace(/.*비례대표/, "비례대표"))]
        }
        if (target) {
            if (district == "비례대표" && name == "윤환") { //HARDCODING
                data.member["윤환_0"] = {
                    district: "비례대표",
                    party: "미래통합당",
                    image: "http://www.iyongin.or.kr/attach/member/CT_8/7f17589f9a834fcf9457f2342f9af827.jpg",
                    gender: "남",
                    birth: null, // 생년월일 데이터 없음
                    history: 
`<학력사항>
명지대학교 대학원 재학
<경력사항>
(전)용인시 인재육성재단 처인구 회장
(전)처인구 체육회 회장
(현)용인시세금지키기운동본부 사무총장
(현) 제18기 민주평화통일자문회의 용인시협의회`,
                    local: "경기_용인",
                    type: "기초의원",
                    checked: true
                }
            } else {
                target.party = party
                target.checked = true
                checkCount++
            }
        } else {
            console.log(
`
[warn] 동명이인 목록에서 일치하는 선거구가 없음.
    ${district} ${name} / ${names[name].map(x => data.member[x].district).join(" | ")}`
            )
            const hardTarget = index => {
                const newTarget = data.member[names[name][index]]
                newTarget.party = party
                newTarget.checked = true
                console.log(`    => resolved_HARDCODING ${newTarget.district}`)
            }
            // HARDCODING
            switch (name) {
                case "이재현":
                    hardTarget(1)
                    break
                case "김순옥":
                    hardTarget(0)
                    break
                case "김영근":
                    hardTarget(0)
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
            case "오희숙":
                data.member["오희숙_650110"] = {
                    district: "비례대표",
                    party: "무소속",
                    image: "http://www.gongju.go.kr/thumbnail/lawmakerMng//lawm_202004010513001860.jpg",
                    gender: "여",
                    birth: "1965.01.10",
                    history: 
`배재대 대학원 관광축제경영학 석사 재학중
무령왕 국제네트워크협의회 사무국장(현)
공주문화원 운영위원(현)
공주시 고도보존육성지역심의위원회 위원(전)
공주시 주민참여예산위원회 위원(전)
하나센터(북한이탈주민) 자문위원
파워뉴스 대표`,
                    local: "충남_공주",
                    type: "기초의원",
                    checked: true
                }
                console.log(`    => resolved_HARDCODING added`)
                break
            case "김민규":
                data.member["김민규_0"] = {
                    district: "비례대표",
                    party: "더불어민주당",
                    image: "https://council.jinan.go.kr/MGMT/Files/MemberPhoto/8/8050.jpg",
                    gender: "남",
                    birth: null, // 생년월일 데이터 없음, https://www.jjan.kr/news/articleView.html?idxno=2080139 에서 48세로 쓰인 것 확인
                    history: 
`진안중앙초 졸업
진안중 졸업
전주공업고등학교 졸업
전주비전대학교 공업전문학사
(2004.03.~2006.02.)
(전) 진안청년회의소 회장(JCI)
(전) 새마을운동 진안군지회 문고회장
(전) 진안읍체육회 이사
(전) 민주평화통일자문위원회 자문위원
(전) 경찰발전협의회 위원
(현) 더불어민주당 진안군연락사무소
사무국장, 청년위원장
(현) 진안청년회의소 특우회 감사
(현) 제8대 진안군의회 의원`,
                    local: "전북_진안",
                    type: "기초의원",
                    checked: true
                }
                console.log(`    => resolved_HARDCODING added`)
                break
        }
    }
})

console.log(Object.keys(data.member).filter(x => data.member[x].type == "광역의원").length)
console.log(Object.keys(data.member).filter(x => data.member[x].type == "기초의원").length)

const newData = Object.keys(data.member).filter(x => !(!data.member[x].checked && (data.member[x].type == "기초의원" || data.member[x].type == "광역의원"))).map(x => data.member[x])

console.log(Object.keys(newData).filter(x => newData[x].type == "광역의원").length)
console.log(Object.keys(newData).filter(x => newData[x].type == "기초의원").length)