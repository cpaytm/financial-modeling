# Excel Framework

BM md와 HTML 프레임워크에서 확정한 모델 구조를 Excel 모델로 구현하기 위한 도구와 가이드입니다. 보조 JSON은 자동화가 필요할 때 쓰는 입력입니다.

Excel 구현 원칙과 Monoframe 계약은 [excel_modeling_framework.md](excel_modeling_framework.md)를 기준으로 합니다.

---

## build_excel.py

BM md/HTML에서 확정한 구조를 기준으로 **수식이 그대로 박힌 .xlsx 재무모델**을 생성합니다. CLI 자동화에서는 보조 JSON을 입력으로 받을 수 있습니다.

`build_excel.py`의 역할은 단순 변환기가 아니라 Excel Monoframe 실행체입니다. 공통 엔진은 유지하고, 회사별/산업별 구조는 sheet mapper와 custom layer로 얹습니다.

- `openpyxl` 기반이라 셀 색, 서식, 테두리, 동결창, 숫자 포맷 등을 풍부하게 지원
- Excel 모델링 가이드라인 시트 구조 적용: `Index`, `Control`, `Assumptions`, `Model`, `Formula Audit`, `Structure`, `Checks`, `Metadata`
- 모델별 custom sheet 적용 가능: 예시 KCar는 `DCF`, `Sales`, `Sales Bridge`, `Cost`, `CapEx,D&A`, `Labor`, `NWC`, `BS`
- 모든 하드코딩 입력값은 `Assumptions`에 집중
- `Model` 시트는 입력 링크와 계산 수식으로 구성
- FAST Standard 색상 코드(파랑=입력, 초록=타 시트 참조, 검정=동일 시트 수식) 적용
- 보조 JSON의 `HIST_N`을 읽어 Historical / Forecast 헤더를 정확히 분리
- `GWh`, `백만대`, `천$/대`, `백만$/GWh` 등 소수 단위 숫자 포맷 지원
- CLI 파이프라인에 통합 가능

---

## 설치

```bash
python3 -m venv .venv
.venv/bin/pip install -r framework/requirements.txt
```

---

## 사용

```bash
# 1. 브라우저에서 framework/template.html 열고 모델 편집
# 2. 상단 "JSON" 버튼 클릭 후 financial_model_YYYY-MM-DD.json 다운로드
# 3. Python 스크립트 실행
.venv/bin/python framework/build_excel.py financial_model_2026-05-25.json

# 출력 경로 지정
.venv/bin/python framework/build_excel.py input.json -o output.xlsx
```

---

## 결과 파일 구조

| 시트 | 역할 |
|---|---|
| Index | 시트 목록과 링크 |
| Control | 핵심 결과 요약 |
| Assumptions | 모든 하드코딩 입력값 |
| Model | HTML `D.formula`를 기간별 Excel 수식으로 전개한 계산 엔진 |
| Formula Audit | 생성된 모든 수식 셀 목록 |
| Structure | ID, Label, Parent, Type, Formula, Unit, Description |
| Checks | 수식 개수, 입력 링크, 구조 정합성 검증 |
| Metadata | 버전과 생성 정보 |

---

## Browser Export vs build_excel.py

HTML에서도 `📥 엑셀` 버튼으로 수식/서식이 들어간 workbook을 받을 수 있습니다. 다만 `build_excel.py`는 Claude/Codex가 직접 코딩하고 반복 빌드할 수 있는 monoframe 기준 구현입니다.

| 항목 | Browser export | build_excel.py |
|---|---|---|
| 실행 | 브라우저 클릭 | CLI |
| 의존성 | CDN (`xlsx-js-style`, `JSZip`) | `openpyxl` |
| 셀 서식 | 적용 가능 | 풍부하게 적용 가능 |
| 자동화 | 낮음 | 높음 |
| 용도 | 사용자가 즉시 다운로드 | Claude/Codex 직접 코딩, 반복 빌드, custom layer 확장 |
