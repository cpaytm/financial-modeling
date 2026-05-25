# Financial Modeling — Interactive Tree → Excel

비상장 기업 추정 모델링 방법론과 구현 프레임워크.

HTML 인터랙티브 트리로 매출·비용·이익을 구조화하고, 그 구조를 결정론적으로 엑셀 모델로 변환하는 분석 체계.

뮤렉스파트너스 · 2026.03

---

## 디렉토리 구조

```
.
├── README.md                              # 본 파일
├── CLAUDE.md                              # Claude·개발자 작업 지침 (DS 준수 강제)
├── docs/
│   ├── modeling_framework.md              # 방법론 + 구현 프레임워크 통합 문서
│   └── design_system.md                   # 디자인 시스템 가이드
├── ds/
│   └── tokens.js                          # DS 토큰 (단일 진실 소스)
├── framework/
│   ├── template.html                      # HTML 인터랙티브 트리 스켈레톤 (DS 적용)
│   └── README.md                          # 템플릿 사용법
├── examples/
│   └── getcha-fy26/
│       ├── index.html                     # 겟차 FY26 적용 사례 (참조 구현, DS 미적용)
│       └── README.md                      # 사례 설명
├── samples/                               # 독점/민감 자료 (gitignored)
└── .gitignore
```

---

## 빠른 시작

### 방법론·프레임워크 읽기

[docs/modeling_framework.md](docs/modeling_framework.md) — 4부 구성.

- Part I — 방법론 (Q×P 분해, 객관/주관, Case A/B, 매출·비용·B/S·밸류에이션)
- Part II — HTML 구현 프레임워크 (데이터·트리·렌더링·UI·시뮬레이터·엔진)
- Part III — 엑셀 모델 (IR JSON, 메타데이터, 표준 준수)
- Part IV — 시나리오·검증·거버넌스 (LLM 자리, 라이브러리, 한계)

### 디자인 시스템

[docs/design_system.md](docs/design_system.md) — 시각 일관성을 위한 토큰·컴포넌트 규약. 토큰의 실제 값은 [ds/tokens.js](ds/tokens.js).

### 새 회사에 적용하기

1. `framework/template.html`를 복사
2. 9개 블록을 회사 데이터로 채움 ([framework/README.md](framework/README.md) 참고)
3. 브라우저에서 열어 검증
4. (선택) 엑셀 모델로 변환 — Part III IR JSON 규약

### 참조 구현 보기

[examples/getcha-fy26/index.html](examples/getcha-fy26/index.html)를 브라우저에서 열기. 1,500줄·92KB의 완전한 적용 사례.

---

## 핵심 흐름

```
[입력: 사업계획 엑셀  or  리서치 자료]
   ↓ 분석 (LLM + 사람)
[HTML 인터랙티브 트리 — 구조화·검토 레이어]
   ↓ 사람 검토·디렉션
[확정된 추정 구조: 드라이버·수식·가정변수]
   ↓ 결정론적 변환
[엑셀 모델 — 최종 산출물]
```

HTML이 단순 시각화가 아니라 **중간 표현(IR) 겸 검토 인터페이스**. 트리에서 확정된 구조가 엑셀의 청사진이 된다.

---

## 라이선스 / 사용

내부 분석용. 외부 공유 시 협의 필요.
