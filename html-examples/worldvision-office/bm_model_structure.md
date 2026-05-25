# 월드비전 여의도사옥 재무모델 — 단순화 BM / 모델 구조

- 원본 파일
  - `월드비전_여의도사옥_재무모델 20190619.xlsx`

- 목적
  - 원본 Excel 모델의 구조를 수강자용으로 단순화
  - HTML 인터랙티브 트리로 옮기기 전 BM과 모델 흐름을 정리
  - 세부 세금, 수수료, 월별 스케줄은 단순화하고 핵심 드라이버 중심으로 재구성

- 모델 유형
  - 부동산 개발 + 운영 + 매각 + 투자자 배당 모델
  - 기존 사옥/토지 기반 개발사업을 진행한 뒤, 준공 후 임대 운영하고, Exit 시 매각가치와 배당을 산출하는 구조

---

## 1. 사업 개요

- 사업명
  - 월드비전 여의도 사옥

- 소재지
  - 서울특별시 영등포구 여의나루로 77-1

- 주요 용도
  - 업무시설
  - 근린생활시설

- 개발 규모
  - 지하 6층 / 지상 16층
  - 대지면적: 약 1,547㎡
  - 연면적: 약 21,238㎡
  - 지상층 연면적: 약 14,403㎡
  - 지하층 연면적: 약 6,835㎡

- 주요 일정
  - 인허가 / 펀드 설정: 2019년
  - 착공: 2020년 12월
  - 공사기간: 26개월
  - 준공: 2023년 1월
  - 사용승인: 2023년 3월
  - PF 종료: 2023년 8월
  - 운영개시: 2023년 9월
  - 운영종료 / 매각 가정: 2028년 8월

---

## 2. 원본 Workbook 구조

- 일정 / 입력
  - `일정표`
  - `Control Panel_개발`
  - `Control Panel_운영`
  - `Rent Roll`

- 개발 모델
  - `Index_개발`
  - `사업비 지출내역`
  - `금융비용`
  - `제세공과금 및 부담금_개발`
  - `표준공정률표`
  - `Tax정리_개발`

- 운영 모델
  - `Index_운영`
  - `제세공과금 및 부담금_운영`
  - `월별 수익_운영`
  - `월별 비용_운영`

- 재무제표 / 배당
  - `손익계산서(Y)`
  - `현금흐름표(Y)`
  - `손익계산서(FY)`
  - `현금흐름표(FY)`
  - `투자자배당(FY)`
  - `손익계산서(M)`
  - `현금흐름표(M)`

---

## 3. 단순화한 BM 설명

- 한 문장 BM
  - 토지/사옥 개발에 필요한 자금을 조달하고, 공사 완료 후 오피스와 근린생활시설을 임대 운영하며, 보유기간 종료 시 부동산을 매각해 투자자에게 운영배당과 매각차익을 배분하는 구조

- 수익 구조
  - 임대수익
  - 관리수익
  - 주차수익
  - 회입수익 / 기타수익
  - 매각수익
  - 여유현금 운용수익

- 비용 구조
  - 개발기간 사업비
  - 금융비용
  - 운영기간 건물관리비
  - 펀드운영비용
  - 제세공과금
  - 매각 관련 비용
  - 법인세 / 배당

- 자본 구조
  - 선순위 차입금
  - 중순위 차입금
  - VAT 차입금
  - 임대보증금
  - 제1종 수익증권
  - 제2종 수익증권

---

## 4. 모델의 큰 흐름

```text
사업 일정
  ↓
개발 투입비 산정
  ↓
자금 조달 및 금융비용 계산
  ↓
준공 후 임대 운영
  ↓
운영수익 - 운영비용 = NOI
  ↓
차입금 이자 / 펀드비용 / 세금 반영
  ↓
매각가치 산정
  ↓
현금흐름 및 투자자 배당
```

---

## 5. HTML 트리용 단순 모델 구조

```text
Project Return
├─ Development Phase
│  ├─ Development Cost
│  │  ├─ Land / Ground Right Cost
│  │  ├─ Construction Cost
│  │  ├─ Design / Supervision / PM / CM
│  │  ├─ Taxes & Charges
│  │  └─ Development Financing Cost
│  └─ Funding
│     ├─ Senior Loan
│     ├─ Mezzanine Loan
│     ├─ VAT Loan
│     └─ Equity
├─ Operating Phase
│  ├─ Revenue
│  │  ├─ Rental Income
│  │  ├─ Management Income
│  │  ├─ Parking Income
│  │  └─ Other Income
│  ├─ Operating Expense
│  │  ├─ PM Fee
│  │  ├─ FM Fee
│  │  ├─ Repairs & Maintenance
│  │  ├─ Utilities
│  │  ├─ Insurance
│  │  ├─ Property Taxes & Charges
│  │  └─ Fund Operating Costs
│  └─ NOI
├─ Exit Phase
│  ├─ Exit NOI
│  ├─ Terminal Cap Rate
│  ├─ Sale Price
│  └─ Sale Costs
└─ Investor Return
   ├─ Operating Distributions
   ├─ Sale Proceeds Distribution
   ├─ Debt Repayment
   └─ Investor IRR / Yield
```

---

## 6. 주요 드라이버

| 드라이버 | 설명 | 영향을 주는 항목 |
|---|---|---|
| 연면적 | 전체 임대/운영 가능한 물리적 규모 | 공사비, 운영비, 임대면적 |
| 임대면적 | Rent Roll 기준 임대 가능 면적 | 임대수익, 관리수익 |
| 평당 임대료 | 임차인/층별 월 임대료 단가 | 임대수익 |
| 임대 개시일 | 층별 또는 임차인별 임대 시작 시점 | 월별 임대수익 |
| 임대 만기일 | 계약 종료 시점 | 임대수익 지속 기간 |
| 공사기간 | 개발비 투입 기간 | 공사비 집행, PF 기간, 금융비용 |
| 공정률 | 월별 공사비 집행 패턴 | 개발비 월별 투입 |
| 선순위 차입금 | 개발/매입 자금 조달 | 이자비용, 원금상환 |
| 금리 | 차입금 이자율 | 금융비용, 배당가능현금 |
| 운영비 단가 | 평당 또는 총액 기준 운영비 가정 | NOI |
| Exit Cap Rate | 매각가치 산정률 | 매각금액, 투자자 IRR |
| 매각수수료율 | 매각 시 비용률 | 매각 후 배분 가능액 |

---

## 7. 매출 구조 단순화

```text
Operating Revenue
├─ Rental Income
│  └─ 임대면적 × 평당 임대료 × 기간 반영
├─ Management Income
│  └─ 임대면적 × 관리비 단가 × 기간 반영
├─ Parking Income
│  └─ 주차면수 × 월 주차수익 × 기간 반영
├─ Other Income
│  └─ 기타수익 가정
└─ Sale Proceeds
   └─ Exit NOI ÷ Terminal Cap Rate
```

- 원본 `Rent Roll` 기준 주요 임대 구조
  - 전체 임대면적: 약 6,424평
  - 주요 임차인/층: 월드비전, 16층, 7층, 6층, 5층, 4층, 3층, 2층, 1층, 지하1층
  - 평당 임대료 예시
    - 일반 오피스층: 약 65,000원/평/월
    - 2층: 약 100,000원/평/월
    - 1층: 약 150,000원/평/월
    - 지하1층: 약 80,000원/평/월

---

## 8. 비용 구조 단순화

```text
Operating Expense
├─ Building Operating Costs
│  ├─ PM Fee
│  ├─ FM Fee
│  ├─ Repairs & Maintenance
│  ├─ Utilities
│  ├─ Insurance
│  └─ Taxes & Charges
├─ Leasing Costs
│  └─ Leasing Commission
├─ Fund Operating Costs
│  ├─ Asset Management Fee
│  ├─ Trustee Fee
│  ├─ Administration Fee
│  ├─ Sales Fee
│  ├─ Accounting / Legal Advisory
│  └─ Other Fund Costs
└─ Financing Costs
   ├─ Senior Loan Interest
   ├─ Mezzanine Loan Interest
   └─ VAT Loan Interest
```

- 원본 운영비 주요 항목
  - PM FEE
  - FM FEE
  - 토지사용료
  - 수선유지비
  - 수도광열비
  - 보험료
  - 제세공과금
  - 임대대행수수료
  - 수선성공사비(OPEX)
  - 자산운용보수
  - 신탁보수
  - 일반사무관리보수
  - 위탁판매보수
  - 회계자문보수
  - 법률자문보수

---

## 9. 개발비 구조 단순화

```text
Development Cost
├─ Land / Ground Right
│  ├─ 지료 선납금
│  ├─ 지상권 설정비
│  └─ 관련 세금/등기비용
├─ Construction
│  ├─ 도급공사비
│  ├─ 인입공사비
│  ├─ 철거공사비
│  └─ 기타 공사 관련 비용
├─ Professional Fees
│  ├─ 설계비
│  ├─ 감리비
│  ├─ PM / CM Fee
│  ├─ 법률/회계/감정평가 수수료
│  └─ 기타 자문비
├─ Taxes & Charges
│  ├─ 취득세
│  ├─ 등록면허세
│  ├─ 국민주택채권
│  └─ 각종 부담금
└─ Financing Costs
   ├─ PF Loan Interest
   ├─ Loan Arrangement Fee
   └─ Fund Formation / Offering Fee
```

- 원본 개발비 주요 규모
  - 총 재원조달 기준: 약 650억원
  - 선순위 PF 대출: 약 480억원
  - Equity: 약 170억원
  - 주요 사업비
    - 토지/지상권 관련 비용
    - 도급공사비
    - 설계/감리/PM/CM
    - 제세공과금
    - 금융비용

---

## 10. 자금조달 구조 단순화

```text
Funding
├─ Debt
│  ├─ Senior Loan
│  │  ├─ Drawdown
│  │  ├─ Interest
│  │  └─ Repayment
│  ├─ Mezzanine Loan
│  └─ VAT Loan
├─ Deposit
│  └─ Tenant Deposit
└─ Equity
   ├─ Class 1 Beneficiary Certificate
   └─ Class 2 Beneficiary Certificate
```

- 원본 가정
  - 선순위차입금: 약 480억원
  - 선순위 금리: 약 6.75%
  - 중순위차입금: 0
  - Equity: 약 170억원
  - 제1종 수익증권 배당률: 약 7%
  - VAT Loan: 원본상 0으로 설정

---

## 11. 재무제표 흐름 단순화

```text
P&L
├─ Operating Revenue
├─ Operating Expense
├─ NOI
├─ Operating Profit
├─ Non-operating Income
├─ Non-operating Expense
│  ├─ Interest Expense
│  ├─ Sale Fee
│  └─ Sale-related Costs
├─ Pre-tax Income
├─ Tax
└─ Net Income
```

```text
Cash Flow
├─ Beginning Cash
├─ Operating Cash Flow
│  ├─ Rental / Management / Parking Income
│  └─ Operating & Fund Costs
├─ Investing Cash Flow
│  ├─ Development Cost / Acquisition / CAPEX
│  └─ Sale Proceeds
├─ Financing Cash Flow
│  ├─ Debt In / Out
│  ├─ Equity In / Out
│  ├─ Interest
│  └─ Distributions
└─ Ending Cash
```

---

## 12. 투자자 배당 구조 단순화

```text
Investor Return
├─ Equity Contribution
├─ Operating Distributions
│  └─ 배당가능운영이익 기반
├─ Sale Proceeds Distribution
│  └─ 매각차익 배분
├─ Investor Cash Flow
├─ Dividend Yield
└─ IRR
```

- 원본 `투자자배당(FY)` 구조
  - 전체 Equity 기준 배당
  - 제1종 수익증권
  - 제2종 수익증권
  - 운영배당액
  - 자산매각처분이익분배금
  - 투자자 현금흐름
  - 배당수익률
  - 매각차익 포함/제외 수익률

---

## 13. HTML 시뮬레이터에 올릴 만한 핵심 변수

- 개발 단계
  - 공사기간
  - 총 공사비
  - 공정률 패턴
  - PF 금리
  - Equity 투입액

- 운영 단계
  - 임대면적
  - 평당 임대료
  - 공실률 / 임대 개시 지연
  - 운영비 단가
  - 펀드운영비율

- Exit 단계
  - Exit Cap Rate
  - 매각수수료율
  - 매각 시점

- 투자자 수익률
  - 배당률
  - 차입금 상환 조건
  - 매각차익 배분 방식

---

## 14. 수강자용 단순화 포인트

- 원본에서 접어도 되는 항목
  - 세목별 취득세/등록면허세 상세 계산
  - 국민주택채권 상세 할인율
  - 월별 부가세 신고/환급 세부 스케줄
  - 법무사/등기수수료 세목
  - 수수료별 지급일 세부 로직

- HTML 트리에서 반드시 남길 항목
  - 개발비 총액과 주요 구성
  - 자금조달 구조
  - 임대수익 산식
  - 운영비 산식
  - NOI
  - 매각가치
  - 차입금 이자/상환
  - 투자자 배당/IRR

---

## 15. HTML Framework 변환 시 권장 TREE 초안

```text
root: Project Return
├─ dev_cost: 개발비
│  ├─ land_cost: 토지/지상권 비용
│  ├─ construction_cost: 공사비
│  ├─ professional_fee: 용역/자문비
│  ├─ taxes_dev: 개발 제세공과금
│  └─ financing_cost_dev: 개발 금융비용
├─ funding: 재원조달
│  ├─ senior_loan
│  ├─ mezz_loan
│  ├─ vat_loan
│  └─ equity
├─ operating_income: 운영수익
│  ├─ rental_income
│  ├─ management_income
│  ├─ parking_income
│  └─ other_income
├─ operating_expense: 운영비용
│  ├─ building_opex
│  ├─ fund_opex
│  └─ taxes_ops
├─ noi: NOI
├─ exit_value: 매각가치
│  ├─ exit_noi
│  ├─ terminal_cap_rate
│  └─ sale_price
└─ investor_return: 투자자수익
   ├─ operating_distribution
   ├─ sale_distribution
   └─ irr
```

---

## 16. 비고

- 이 문서는 원본 Excel의 전체 수식을 재현한 것이 아님
- 목적은 HTML 트리 모델링을 위한 구조 파악과 단순화
- 실제 투자 판단 또는 감사 목적 사용 시 원본 Excel 수식과 별도 검증 필요
