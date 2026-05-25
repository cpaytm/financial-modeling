# Excel Financial Modeling Guide

- 목적
  - HTML 인터랙티브 트리에서 확정한 구조를 Excel 모델로 구현할 때 따르는 통합 가이드
  - 재무모델의 계산 신뢰도, 검토 가능성, 실무 가독성 확보
  - Python `openpyxl` 기반 Excel 생성 시 적용할 컬러코딩·서식·시트 구성 표준 정의

- 핵심 원칙
  - HTML은 모델의 설계도
  - Excel은 설계도를 계산 가능한 최종 산출물로 옮긴 실행 모델
  - Excel에서 새로운 구조를 즉흥적으로 발명하지 않음
  - HTML에서 합의한 BM 구조, 드라이버, 가정변수, 계산식을 Excel에서 재현

---

## 1. HTML과 Excel의 관계

```text
BM / Model Structure Brief
  ↓
HTML Tree: 구조와 가정 합의
  ↓
Excel Model: 계산과 제출 산출물
```

- HTML 단계에서 확정할 것
  - BM 구조
  - 매출/비용 드라이버
  - 주요 가정변수
  - 시뮬레이션 변수
  - 계산 로직의 큰 흐름

- Excel 단계에서 구현할 것
  - 결정론적 계산
  - 회계적 연결
  - 기간별 수식 전개
  - 검증 체크
  - 최종 제출 가능한 `.xlsx` 산출물

- 대응 원칙
  - HTML의 `TREE` 구조와 Excel의 주요 계산 블록이 대응되어야 함
  - HTML의 `INPUT_KEYS`는 Excel의 주요 가정변수로 분리
  - HTML의 `simCalc()` 계산 로직은 Excel 수식으로 재현
  - HTML 예시와 Excel 결과의 주요 항목 차이는 설명 가능해야 함

---

## 2. Deterministic Modeling 원칙

- 재무모델은 같은 입력이면 같은 출력이 나와야 함
- LLM이 제안한 구조와 숫자는 검토 대상
- 최종 계산은 Excel 수식 또는 검증 가능한 코드로 닫아야 함

- Deterministic하게 처리해야 하는 항목
  - 숫자 계산
  - 회계 항목 연결
  - 기간별 수식 전개
  - 대출 이자 계산
  - 세금, 감가상각, 배당 waterfall
  - 과거 실적 정합성 검증
  - 최종 Excel 산출물 생성

- LLM 산출물 사용 시 주의
  - LLM이 만든 수식/숫자를 그대로 믿지 않음
  - 단위와 기간을 반드시 확인
  - 회계적으로 닫히는지 Checks 시트로 검증
  - 사람이 최종 가정과 구조를 판단

---

## 3. 권장 시트 구조

| 시트 | 역할 |
|---|---|
| Index | 시트 목록, 링크, 모델 구조 안내 |
| Control | 핵심 가정, 시나리오 토글, 주요 결과 요약 |
| Inputs / Assumptions | 상세 가정값 |
| Revenue / Sales | 매출 드라이버와 계산 |
| Costs | 변동비와 고정비 |
| Labor | 인건비 |
| CapEx & D&A | 투자와 감가상각 |
| Working Capital / NWC | 운전자본 |
| Debt & Interest | 차입금과 이자비용 |
| Financial Statements | P&L, B/S, C/F |
| DCF / Valuation | 평가 및 Exit 산정 |
| Scenarios | Base, Upside, Downside |
| Checks | 정합성 검증 |
| Metadata | HTML/IR 출처, 버전, 생성 정보 |
| Raw_ / Dart_ | 원천 데이터 |

- 시트 구분 규약
  - 메인 모델 시트: 일반 이름 사용
  - Raw data 시트: `Raw_` 또는 `Dart_` 접두사
  - 구분자 시트: 필요 시 `Dart>>` 같은 더미 시트 사용

- Index 시트 권장 컬럼
  - 구분
  - Sheet명
  - Link
  - 설명

- Link 예시
  - `=HYPERLINK("#'Control'!A1", "Link")`

---

## 4. 시트 전역 설정

- 모든 시트 생성 직후 적용

```python
ws.sheet_view.showGridLines = False
ws.sheet_view.zoomScale = 100
```

- 원칙
  - 격자선은 반드시 끔
  - 필요한 곳에만 테두리 사용
  - 시트 탭 색상은 일반적으로 미지정

---

## 5. 행·열 레이아웃

### 5.1 A열 spacer

- A열은 항상 비워둠
- 너비: `1.71`
- 모든 콘텐츠는 B열부터 시작
- 목적
  - 좌측 여백 확보
  - 인쇄/캡처 시 좌측 잘림 방지
  - 모델 시각적 호흡 확보

```python
ws.column_dimensions["A"].width = 1.71
```

### 5.2 레벨별 열 분리

- 들여쓰기 대신 열 분리로 계층 표현

| 레벨 | 위치 | 예시 |
|---|---|---|
| Level 1 | B열 | 매출, 비용, EBITDA, FCFF |
| Level 2 | C열 | 임대수익, 인건비, 감가상각비 |
| Level 3 | D열 | % YoY, % of Sales, 1대당 원가 |
| Level 4 | E열 | 가격, 판매대수, 단가 |
| Level 5+ | F열 이후 | 시장규모, 점유율 등 |

- 핵심 원칙
  - 마지막 레벨 라벨 열만 넓게 설정
  - 이전 라벨 레벨 열은 좁게 두어 텍스트 overflow 허용
  - 데이터 시작 직전 열을 가장 넓게 잡아 라벨과 숫자 간격 확보

```python
ws.column_dimensions["A"].width = 1.71
ws.column_dimensions["H"].width = 17.43
ws.column_dimensions["I"].width = 12.43
```

### 5.3 데이터 컬럼 너비

- 일반 숫자 컬럼: 9~12
- 통화/큰 숫자: 11~13
- 연도 헤더: 9~10
- 단위 표기 행: 우측 정렬, 통화 단위 명시

### 5.4 행 높이

- 기본 행 높이: 15
- 시트 제목 행: 16.5

---

## 6. 컬러코딩 원칙

### 6.1 글자색

| 구분 | HEX | 용도 |
|---|---|---|
| 파란색 | `0000FF` | 하드코딩 입력값, 가정값, 과거 실적 |
| 검은색 | `000000` | 동일 시트 내 수식/계산값 |
| 초록색 | `008000` | 다른 시트 참조 수식 |
| 빨간색 | `FF0000` | 외부 파일 참조. 가급적 회피 |
| 자주색 | `800080` | 외부 데이터 소스 |
| 회색 | `808080` | 보조지표, 참고용 비율/단가 |

- 회색 처리 대상
  - `% of Sales`
  - `% YoY`
  - `% of Labor`
  - 1대당 원가
  - 메인 라인이 아닌 참고용 수치

### 6.2 배경색

| 구분 | HEX | 용도 |
|---|---|---|
| 파란 헤더 | `1F4E79` | 연도 헤더, Historical/Forecast 구분 |
| 연파랑 | `DDEBF7` | Output 요약 셀, 핵심 결과값 |
| 연노랑 | `FFFF99` | 시나리오 토글, 민감도 변수 |
| 연회색 | `D9D9D9` | 미사용 셀, 의도적 공란 |
| 빨강+흰글씨 | `FF0000` | 밸런스 체크 불일치, 에러 |

- 헤더 행 표준
  - 짙은 파랑 배경
  - 흰 글씨
  - Bold

---

## 7. 폰트

- 한글 라벨
  - 맑은 고딕 9pt

- 숫자/영문
  - Arial 9pt

- 시트 제목
  - Arial 11pt
  - Bold
  - 파랑 `1F4E79`

```python
FONT_LABEL_KOR = Font(name="맑은 고딕", size=9)
FONT_LABEL_KOR_BOLD = Font(name="맑은 고딕", size=9, bold=True)
FONT_NUMBER = Font(name="Arial", size=9)
FONT_NUMBER_BOLD = Font(name="Arial", size=9, bold=True)
FONT_TITLE = Font(name="Arial", size=11, bold=True, color="1F4E79")
```

---

## 8. 숫자 서식

| 데이터 유형 | format_code |
|---|---|
| Accounting 숫자 | `_-* #,##0_-;-* #,##0_-;_-* "-"_-;_-@_-` |
| Accounting 소수 1자리 | `_-* #,##0.0_-;-* #,##0.0_-;_-* "-"_-;_-@_-` |
| 일반 숫자 | `#,##0;(#,##0);"-"` |
| 백분율 | `0.0%;(0.0%);"-"` |
| 배수 | `0.0"x"` |
| 원화 | `"₩"#,##0;("₩"#,##0)` |
| 달러 | `"$"#,##0;($#,##0)` |
| 날짜 | `yyyy-mm-dd` 또는 `yyyy"-"mm` |
| 연도 | `General` |

- 기본 포맷
  - Accounting 포맷
  - 0은 하이픈
  - 음수는 마이너스 또는 괄호 표기 중 모델 표준에 맞춰 통일

- 단위 표기
  - 시트 상단에 단위 명시
  - 예: `KRW in millions`, `USD in thousands`
  - 단위 혼용 금지
  - 다른 단위는 별도 섹션 사용

---

## 9. 정렬과 테두리

- 정렬
  - 숫자: 우측 정렬
  - 라벨: 좌측 정렬
  - 헤더: 가운데 정렬
  - 시트 제목: 좌측 정렬

- 테두리
  - 일반 셀: 테두리 없음
  - 헤더 행: 하단 단선 또는 배경색 구분
  - 소계 행: 상단 단선
  - 최종 합계 행: 상단 단선 + 하단 이중선
  - 섹션 구분: 빈 행 1줄

---

## 10. 가정값 집중 원칙

- 모든 하드코딩 입력은 `Control` 또는 `Assumptions` 시트에 모음
- 다른 시트는 `Control` / `Assumptions`를 참조
- 시트 곳곳에 파란 글씨 입력값이 흩어지면 검토 난이도 증가

- Historical / Forecast 구분
  - 헤더 행에 Historical / Forecast 구분 라벨
  - 연도 헤더 위 별도 행으로 표기
  - 셀 병합 가능

- 보조지표 패턴
  - 본 라인 바로 아래 회색 글씨로 비율 표기
  - 예: `% YoY`, `% of Sales`

```text
Sales              100,000   120,000
  % YoY                       20.0%
Cost                60,000    70,000
  % of Sales         60.0%     58.3%
```

---

## 11. Checks와 검증

- 필수 검증 질문
  - 과거 실적과 모델 출력이 맞는가?
  - 모든 주요 매출원이 HTML 트리와 동일하게 존재하는가?
  - 비용이 적절한 드라이버와 연결되어 있는가?
  - B/S와 C/F가 닫히는가?
  - 차입금과 이자비용이 순환참조 없이 계산되는가?
  - 시나리오 변경 시 결과가 의도한 방향으로 움직이는가?
  - HTML 예시와 Excel 결과의 주요 항목 차이가 설명 가능한가?

- 밸런스 체크
  - 불일치 시 빨강 배경 + 흰 글씨
  - Checks 시트 또는 각 재무제표 하단에 배치

```python
from openpyxl.formatting.rule import CellIsRule

ws.conditional_formatting.add(
    "Z100",
    CellIsRule(
        operator="notEqual",
        formula=["0"],
        fill=FILL_ERROR,
        font=Font(name="Arial", size=9, color="FFFFFF", bold=True),
    ),
)
```

- `#DIV/0` 방어
  - 모든 나눗셈은 `IFERROR(num/denom, 0)` 또는 `IF(denom=0, 0, num/denom)` 사용
  - 분모가 0이 될 가능성이 있는 모든 셀에 적용

---

## 12. 투자자 배포본 처리

- 모델링용 / 내부검토용
  - 컬러코딩 유지
  - 수식 유지
  - Checks 유지

- 투자자 배포본 / 재무제표 패키지
  - 컬러코딩 제거
  - 흑백 정적 자료
  - 수식을 값으로 변환
  - 민감 입력값 보호
  - 필요 시 시트 보호

---

## 13. openpyxl 구현 표준

### 13.1 스타일 상수

```python
from openpyxl.styles import Font, PatternFill, Border, Side, Alignment

FONT_TITLE = Font(name="Arial", size=11, bold=True, color="1F4E79")
FONT_LABEL = Font(name="맑은 고딕", size=9, color="000000")
FONT_LABEL_BOLD = Font(name="맑은 고딕", size=9, bold=True, color="000000")
FONT_LABEL_SUB = Font(name="맑은 고딕", size=9, color="808080")
FONT_INPUT = Font(name="Arial", size=9, color="0000FF")
FONT_FORMULA = Font(name="Arial", size=9, color="000000")
FONT_FORMULA_BOLD = Font(name="Arial", size=9, bold=True, color="000000")
FONT_LINK_SHEET = Font(name="Arial", size=9, color="008000")
FONT_SUB = Font(name="Arial", size=9, color="808080")
FONT_HEADER = Font(name="Arial", size=9, bold=True, color="FFFFFF")

FILL_HEADER = PatternFill("solid", fgColor="1F4E79")
FILL_OUTPUT = PatternFill("solid", fgColor="DDEBF7")
FILL_TOGGLE = PatternFill("solid", fgColor="FFFF99")
FILL_UNUSED = PatternFill("solid", fgColor="D9D9D9")
FILL_ERROR = PatternFill("solid", fgColor="FF0000")

BORDER_SUBTOTAL = Border(top=Side(style="thin"))
BORDER_TOTAL = Border(top=Side(style="thin"), bottom=Side(style="double"))
BORDER_HEADER_BOTTOM = Border(bottom=Side(style="thin"))

ALIGN_RIGHT = Alignment(horizontal="right", vertical="center")
ALIGN_LEFT = Alignment(horizontal="left", vertical="center")
ALIGN_CENTER = Alignment(horizontal="center", vertical="center")

FMT_ACCT = '_-* #,##0_-;-* #,##0_-;_-* "-"_-;_-@_-'
FMT_ACCT_1 = '_-* #,##0.0_-;-* #,##0.0_-;_-* "-"_-;_-@_-'
FMT_NUM = '#,##0;(#,##0);"-"'
FMT_PCT = '0.0%;(0.0%);"-"'
FMT_MULT = '0.0"x"'
FMT_KRW = '"₩"#,##0;("₩"#,##0)'
FMT_YEAR = "General"
```

### 13.2 시트 초기 세팅

```python
def setup_sheet(ws, title=None):
    ws.sheet_view.showGridLines = False
    ws.sheet_view.zoomScale = 100
    ws.column_dimensions["A"].width = 1.71

    if title:
        ws["B1"] = title
        ws["B1"].font = FONT_TITLE
        ws.row_dimensions[1].height = 16.5
```

### 13.3 레벨별 라벨 작성

```python
def write_label(ws, row, level, text, bold=False, sub=False):
    from openpyxl.utils import get_column_letter

    col = get_column_letter(1 + level)  # B=Level 1
    cell = ws.cell(row=row, column=1 + level)
    cell.value = text
    cell.font = FONT_LABEL_SUB if sub else FONT_LABEL_BOLD if bold else FONT_LABEL
    cell.alignment = ALIGN_LEFT
    return cell
```

### 13.4 입력값과 수식 셀

```python
def put_input(ws, cell_addr, value, fmt=FMT_ACCT):
    c = ws[cell_addr]
    c.value = value
    c.font = FONT_INPUT
    c.number_format = fmt
    c.alignment = ALIGN_RIGHT
    return c

def put_formula(ws, cell_addr, formula, fmt=FMT_ACCT, bold=False, sub=False):
    c = ws[cell_addr]
    c.value = formula
    c.font = FONT_SUB if sub else FONT_FORMULA_BOLD if bold else FONT_FORMULA
    c.number_format = fmt
    c.alignment = ALIGN_RIGHT
    return c

def put_link(ws, cell_addr, formula, fmt=FMT_ACCT):
    c = ws[cell_addr]
    c.value = formula
    c.font = FONT_LINK_SHEET
    c.number_format = fmt
    c.alignment = ALIGN_RIGHT
    return c
```

---

## 14. 작업 체크리스트

- 전역 설정
  - [ ] 모든 시트에서 격자선이 꺼져 있는가
  - [ ] A열이 비어 있고 너비가 1.71인가
  - [ ] 시트 제목과 단위가 명시되어 있는가

- 레이아웃
  - [ ] 레벨이 다른 라벨이 서로 다른 열에 배치되었는가
  - [ ] 마지막 레벨 라벨 열만 넓고 이전 열들은 좁은가
  - [ ] Historical / Forecast 구분이 명확한가

- 컬러코딩
  - [ ] 모든 입력값이 파란색인가
  - [ ] 동일 시트 수식이 검정인가
  - [ ] 다른 시트 참조 수식이 초록인가
  - [ ] 보조지표가 회색인가

- 계산
  - [ ] HTML 구조와 Excel 계산 블록이 대응되는가
  - [ ] 주요 수식이 deterministic하게 닫히는가
  - [ ] `#DIV/0`, `#REF!`, `#VALUE!` 오류가 없는가
  - [ ] B/S와 C/F가 닫히는가
  - [ ] 차입금과 이자비용 계산이 검증되는가

- 검증
  - [ ] Checks 시트가 있는가
  - [ ] 밸런스 체크가 작동하는가
  - [ ] 시나리오 변경 시 결과가 의도한 방향으로 움직이는가
  - [ ] HTML 예시와 주요 출력이 설명 가능하게 일치하는가

---

## 15. 빠른 시작 템플릿

```python
from openpyxl import Workbook

def create_model():
    wb = Workbook()
    wb.remove(wb.active)

    for sheet_name in ["Index", "Control", "Revenue", "Costs", "Financial Statements", "Checks"]:
        ws = wb.create_sheet(sheet_name)
        setup_sheet(ws, title=sheet_name)

    return wb

wb = create_model()
wb.save("model.xlsx")
```
