# localCouncil
한국 지방의원/지자체장 데이터. 추후 jijache 데이터와 통합 예정.
## get.js
web -> `data.json`  
Puppeteer로 선관위 선거통계시스템 크롤링
## get_pr.js
web-> `data_pr.json`  
Puppeteer로 크롤링, 비례대표 자료만
## edit.js
`data.json`, `data_pr.json` -> `edited.json`  
뒤죽박죽인 데이터 후처리
## tableFromWiki_high.js
web(F12) -> `wikidata_high.js`  
위키백과 광역의원 명부에서 최신 당적 자료 추출
## wikiEdit.js
`wikidata_high.js` -> 