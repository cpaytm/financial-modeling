# Scripts

CLI 도구 모음.

## build_excel.py

IR JSON을 입력으로 받아 **수식이 그대로 박힌 .xlsx**를 생성. 브라우저의 SheetJS 다운로드 대비:

- openpyxl 기반이라 셀 색·서식·테두리·동결창·숫자 포맷 등을 풍부하게 지원
- FAST Standard 색상 코드(파랑=입력) 적용
- CLI 파이프라인에 통합 가능 (Make·CI·다른 스크립트와 연결)

### 설치

```bash
pip install -r scripts/requirements.txt
```

### 사용

```bash
# 1. 브라우저에서 framework/template.html 열고 모델 편집
# 2. 상단 "📥 JSON" 버튼 클릭 → financial_model_YYYY-MM-DD.json 다운로드
# 3. Python 스크립트 실행:
python scripts/build_excel.py financial_model_2026-05-25.json
# → financial_model_2026-05-25.xlsx 생성

# 출력 경로 지정:
python scripts/build_excel.py input.json -o output.xlsx
```

### 결과 파일 구조

3개 시트.

**Model** (수식 시트)
| Variable | Label | Unit | 2025 | 2026 | ... |
|----------|-------|------|------|------|-----|
| unit_q | 수량 (Q) | 대 | 100 | 120 | ... (파랑, 입력) |
| rev_block | 매출 (BM) | 원 | =D2*D3 | =E2*E3 | ... (검정, 수식) |

- 파란 폰트 = 입력 셀 (직접 수정)
- 검정 폰트 = 수식 셀 (자동 계산)
- 동결창: 헤더·ID 열 고정
- 숫자 포맷: 단위별 자동 추정 (원→`#,##0`, %→`0.0%` 등)

**Structure** (메타 정보)
| ID | Label | Parent | Type | Formula | Unit | Description |
|----|-------|--------|------|---------|------|-------------|

**Metadata** (버전·생성 정보)

### 수식 변환 규칙

| IR 수식 | Excel formula |
|---------|---------------|
| `a * b` | `=(D2*D3)` |
| `SUM(a,b,c)` | `=SUM(D2,D3,D4)` |
| `MIN/MAX/AVG` | `=MIN/MAX/AVERAGE(...)` |
| `IF(c,t,e)` (`==`,`!=` 포함) | `=IF(...,...,...)` (`=`,`<>`로 변환) |
| `PREV(x)` | 전년 열 참조 (`year=0`이면 `0`) |
| 변수 참조 | 해당 변수의 행·당해 연도 열 |

### SheetJS(브라우저) vs build_excel.py(Python)

| 항목 | SheetJS | build_excel.py |
|------|---------|----------------|
| 실행 | 브라우저 클릭 | CLI |
| 의존성 | CDN 1개 | `openpyxl` |
| 셀 서식 | 제한적 | 풍부 (색·테두리·동결창 등) |
| 자동화 | ❌ | ✅ (Make·CI 통합) |
| 둘 다 동일 | 수식 그대로 적용 (`=D2*D3` 등) | 동일 |

빠른 확인용 → SheetJS, 정식 산출물·반복 빌드 → build_excel.py.

### 디버그

수식 파싱 오류·미정의 변수가 있으면 stderr로 경고 출력하고 해당 셀은 값으로 폴백.
