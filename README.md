# localCouncil
한국 지방의원/지자체장 데이터. 추후 jijache 데이터와 통합 예정.
## 정보 출처
### 인물 기본 정보
- 선거구, 이름, 성별, 생년월일, 직업, 학력/경력
- [중앙선거관리위원회 선거통계시스템](http://info.nec.go.kr/) 역대선거정보 당선인 명부, 임기중 당선인 명부에서 추출
- 이용지침에 따라 자유롭게 사용 가능
### 최신 당적 정보 / 재보궐 선거 이후의 변동 사항
- 위키백과의 [광역의원 당선인 명부](https://ko.wikipedia.org/wiki/제7회_전국동시지방선거_광역의원), [기초의원 당선인 명부](https://ko.wikipedia.org/wiki/제7회_전국동시지방선거_기초의원)
- [CC-BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)
### 재보궐 선거 이후 승계된 의원의 기본 정보
- 각 의원이 소속된 지방의회 홈페이지에서 가져옴
## 파일 설명
### get.js
web -> `data.json`  
Puppeteer로 선관위 선거통계시스템 크롤링
### get_pr.js
web-> `data_pr.json`  
Puppeteer로 크롤링, 비례대표 자료만
### edit.js
`data.json`, `data_pr.json` -> `edited.json`  
뒤죽박죽인 데이터 후처리
### tableFromWiki_high.js
web(F12) -> `wikidata_high.js`  
위키백과 광역의원 명부에서 최신 당적 자료 추출
### tableFromWiki_low.js
web(F12) -> `wikidata_low.js`  
위키백과 광역의원 명부에서 최신 당적 자료 추출
### wikiEdit.js
`wikidata_high.js`, `wikidata_low.js` -> `fixed.json`
