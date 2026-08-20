# 작업 지침

이 레포에서 HTML 산출물·문서를 작성할 때 반드시 따라야 할 규칙.

---

## 디자인 시스템 (필수)

이 레포의 모든 HTML 산출물은 [design-guide/design_system.md](design-guide/design_system.md)와 [design-guide/tokens.js](design-guide/tokens.js)를 따른다.

### 절대 규칙

- **색상**: [design-guide/tokens.js](design-guide/tokens.js)의 토큰만 사용. 임의 hex 금지.
  - 매출 = `primary.900` (#1E2185)
  - 비용 = `neutral.700` (#374151)  *— 빨강 금지*
  - 영업이익 = `semantic.profit` (#22C55E)
  - 입력 변수 마크 = `primary.500` (#5D68F7)
  - 음수 델타 = `semantic.negative` (#DC2626) — 이 한 곳에서만 빨강 허용
- **폰트**: Outfit (heading) + Pretendard (body). 다른 폰트 금지.
- **표면**: light.bg `#FFFFFF` / light.surface `#F8F8FA` / light.border `#E5E5E8`.
- **아이콘**: Feather Icons만. 크기 16/20/24/28 4단계.

### 새 HTML 산출물 만들 때

1. [framework/template.html](framework/template.html)을 복사해 출발점으로 사용
2. `YRS`, `HIST_N`, `MODEL`만 회사 데이터로 채움 ([framework/html_framework.md](framework/html_framework.md) 참조)
3. 엔진·UI 코드는 손대지 않음
4. 색은 토큰값을 hex로 인라인하되 주석으로 토큰 이름 표기:
   ```js
   c:'#1E2185'  // semantic.revenue / primary.900
   ```

### DS에 없는 컴포넌트가 필요할 때

임의로 만들지 말 것. 사용자에게 추가 요청 안내. 추가 시 절차는 [design-guide/design_system.md](design-guide/design_system.md) "DS에 없는 컴포넌트가 필요할 때" 참조.

---

## 방법론

추정 모델링 분석 작업 시 [framework/html_modeling_framework.md](framework/html_modeling_framework.md) Part I~II 준수.

- **Q × P 재귀 분해** (§4)
- **객관/주관 구분** (§4.3) — 주관적 요소는 상한/하한 먼저 설정
- **매출-비용 교차 참조** (§5.2) — 공유 드라이버 식별
- **HTML 트리 → 엑셀 모델** 순서. 반대 안 됨.

---

## 확률성 격리 (LLM 사용 시)

[framework/html_modeling_framework.md](framework/html_modeling_framework.md) §22.

- LLM은 **비정형 → 정형 변환만**
- 숫자 계산·합계·할인·회계 규칙 적용은 **결정론적 코드**
- 출력은 JSON 스키마 강제, `temperature=0`

---

## 디렉토리 규칙

- `samples/` — 독점/민감 자료. **절대 git에 커밋 금지** (.gitignore에 등록됨). 새 민감 자료는 여기로 이동.
- `examples/` — 회사별 BM / 모델 구조와 HTML 예시를 축적. 민감 자료는 커밋 금지.
- `framework/template.html` — DS 적용된 스켈레톤. 새 산출물의 출발점.

---

## 작성·수정 시 체크리스트

- [ ] DS 토큰만 사용했는가? (임의 hex 0건)
- [ ] Feather Icons만 썼는가? (다른 아이콘 라이브러리 0건)
- [ ] Pretendard / Outfit만 썼는가? (다른 폰트 0건)
- [ ] 비용을 빨강으로 칠하지 않았는가? (neutral grey)
- [ ] 새 컴포넌트가 필요하면 임의 제작 대신 요청했는가?
- [ ] 엑셀 산출물이면 메타데이터 임베드했는가? ([html_modeling_framework.md](framework/html_modeling_framework.md) §18)
