# Excel Framework

HTML 프레임워크에서 내보낸 IR JSON을 Excel 모델로 변환하기 위한 도구와 가이드입니다.

Excel 구현 원칙은 [excel_modeling_framework.md](excel_modeling_framework.md)를 먼저 확인합니다.

---

## build_excel.py

IR JSON을 입력으로 받아 **수식이 그대로 박힌 .xlsx**를 생성합니다. 브라우저의 SheetJS 다운로드 대비:

- `openpyxl` 기반이라 셀 색, 서식, 테두리, 동결창, 숫자 포맷 등을 풍부하게 지원
- FAST Standard 색상 코드(파랑=입력) 적용
- CLI 파이프라인에 통합 가능

---

## 설치

```bash
pip install -r excel-framework/requirements.txt
```

---

## 사용

```bash
# 1. 브라우저에서 html-framework/template.html 열고 모델 편집
# 2. 상단 "JSON" 버튼 클릭 후 financial_model_YYYY-MM-DD.json 다운로드
# 3. Python 스크립트 실행
python excel-framework/build_excel.py financial_model_2026-05-25.json

# 출력 경로 지정
python excel-framework/build_excel.py input.json -o output.xlsx
```

---

## 결과 파일 구조

| 시트 | 역할 |
|---|---|
| Model | 수식이 들어간 주요 모델 시트 |
| Structure | ID, Label, Parent, Type, Formula, Unit, Description |
| Metadata | 버전과 생성 정보 |

---

## SheetJS vs build_excel.py

| 항목 | SheetJS | build_excel.py |
|---|---|---|
| 실행 | 브라우저 클릭 | CLI |
| 의존성 | CDN | `openpyxl` |
| 셀 서식 | 제한적 | 풍부 |
| 자동화 | 낮음 | 높음 |
| 용도 | 빠른 확인 | 정식 산출물과 반복 빌드 |
