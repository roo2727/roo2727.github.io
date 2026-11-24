# LIFE — 개인 포트폴리오 웹사이트

RPG 게임의 타이틀 화면을 콘셉트로 만든 자기소개 포트폴리오입니다.
HTML5 · CSS3 · Vanilla JavaScript 만 사용하는 다중 페이지 정적 웹사이트이며, GitHub Pages 로 배포됩니다.

## 폴더 구조

```
index.html                 첫 번째 페이지 (타이틀 화면)
pages/
  lobby.html               메인 로비 (임시)
  about.html               자기소개 (임시)
css/
  base.css                 공통: 낮/밤 테마 변수, 리셋, 화면 전환, 모션 감소
  title.css                타이틀 화면 전용
  placeholder.css          임시 페이지 전용
js/
  core/                    모든 페이지 공통
    storage.js             localStorage 래퍼 (사용자별 scope 확장 가능)
    boot.js                첫 렌더 전에 저장된 테마·언어 적용 (<head> 에서 로드)
    theme.js               낮/밤 테마 전환
    i18n.js                KR / EN 전환
    transition.js          페이지 페이드 인/아웃 이동
    session.js             로그인·회원가입 확장용 자리 (현재는 항상 게스트)
  i18n/ko.js, en.js        문구 사전
  config/illustration.js   우측 일러스트 리소스 설정
  title/                   타이틀 화면 전용 (파티클, 일러스트, 동작 연결)
  pages/placeholder.js     임시 페이지 초기화
assets/
  illustration/            우측 일러스트 (현재 임시 SVG)
```

## 자주 하는 작업

- **우측 일러스트 교체**: 파일을 `assets/illustration/` 에 넣고 `js/config/illustration.js` 의 `src` 만 바꿉니다. 이미지(png/webp/gif/svg)와 영상(mp4/webm) 모두 지원합니다.
- **문구 추가**: `js/i18n/ko.js`, `en.js` 에 같은 키로 추가하고 HTML 에 `data-i18n="키"` 를 붙입니다.
- **테마 색 조정**: `css/base.css` 의 `:root[data-theme='day']` / `'night'` 블록을 수정합니다.

## 키보드 조작 (타이틀 화면)

| 키 | 동작 |
| --- | --- |
| Tab / Shift+Tab | 메뉴 이동 |
| ↑ / ↓ | START ↔ 설정 줄 이동 |
| ← / → | 설정 줄 안에서 이동 (KR, EN, 테마) |
| Enter / Space | 선택 |
| T | 낮/밤 테마 전환 |

운영체제의 "동작 줄이기(모션 감소)" 설정이 켜져 있으면 로고 형성·파티클·물결 효과가 정지된 화면으로 표시됩니다.

## 로컬에서 보기

빌드 과정이 없으므로 `index.html` 을 브라우저로 바로 열면 됩니다.
