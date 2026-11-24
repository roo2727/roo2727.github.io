# 지역 상세 페이지 배경

지역마다 폴더 하나, 낮·밤 이미지 한 장씩 둡니다.

```
assets/regions/<지역 id>/bg-day.png
assets/regions/<지역 id>/bg-night.png
```

- 지역 id: intro(자기소개), school(학교 및 전공), interests(관심 분야), activities(활동 및 경험), hobbies(취미 생활), future(미래 목표)
- 권장 크기: 16:9 (현재 자기소개는 1672 × 941). 글자가 들어가지 않은 원본을 씁니다. 제목·키워드·프레임 같은 UI 는 모두 HTML/CSS 로 그립니다.
- 각 페이지 HTML 의 `.detail-bg` 안 두 `<img>` 경로만 바꾸면 됩니다.
- 화면 비율이 달라 잘릴 때 남길 위치와, 글이 올라가는 쪽 그라데이션 위치는 `css/regions/<지역 id>.css` 의 `--bg-focus`, `--shade-from`, `--shade-to` 로 조절합니다.
