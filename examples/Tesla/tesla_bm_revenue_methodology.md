# 테슬라(TSLA) BM 구조 & 매출 추정 로직

**Case B — 리서치 기반 신규 설계 / 매출(Revenue) 파트**
작성 기준일: 2026-05-25 · 단위: USD millions (별도 표기 제외)
방법론 준거: [`../../framework/html_modeling_framework.md`](../../framework/html_modeling_framework.md) Part I (§4 Q×P 재귀분해, §4.3 객관/주관 구분, §5.2 매출-비용 교차참조)

> 본 문서는 테슬라 영업이익 추정(매출 − 비용 = 영업이익)의 **매출 레이어 설계도**다.
> 이후 HTML 인터랙티브 트리(`D` / `INPUT_KEYS` / `TREE`) → IR JSON → Excel 모델로 단방향 변환된다.
> 비용 레이어는 별도 문서에서 다루며, 본 문서 §7의 공유 드라이버로 연결된다.

---

## 1. 방법론 적용 개요

| 항목 | 내용 |
|---|---|
| 입력 경로 | **Case B** (기존 엑셀 모델 없음 → 공시·리서치에서 로직 신규 설계) |
| 1차 데이터 소스 | Tesla 10-K (FY2020~FY2025), 분기 8-K 실적·인도량 자료, IR Deck |
| 분해 원칙 | 매출을 Q(물량)×P(단가)로 재귀 분해, 트렌드가 식별될 때까지만 분해 |
| 추정 단위 구분 | ① 수요제약(top-down) ② 공급제약(bottom-up) ③ 외생 시나리오 |
| 검증 | Case B 백테스트 — 설계 로직을 FY2020~25 실적에 적용해 오차 측정(목표 ±0.5%p 수준) |

**데이터 신뢰도 (본 문서)**
- 세그먼트 매출 전 라인아이템(차량판매/리스/규제크레딧/에너지/서비스)은 **10-K·분기 8-K 손익계산서 원문으로 확정**(2026-05-25 기준). 각 연도 합계가 정확히 reconcile됨.
- 내재단가(implied ASP, $/kWh)만 계산값 — 라인아이템 원천은 확정.

---

## 2. BM 전체 구조 (매출 트리 최상위)

```
Tesla 총매출 (total_revenue)
├─ ① Automotive (automotive_total)              FY25 ≈ 69.5B / 비중 ~73%
│   ├─ 1a. 차량판매     automotive_sales         Q×P (핵심)
│   ├─ 1b. 리스         automotive_leasing       리스대수 × 인식단가
│   └─ 1c. 규제크레딧    regulatory_credits       외생(정책 시나리오)
├─ ② Energy gen & storage (energy_total)         FY25 ≈ 12.8B / 비중 ~13%
│   ├─ 2a. 저장장치(Megapack+Powerwall) storage   GWh × $/kWh (성장축)
│   └─ 2b. 솔라         solar                     MW × $/W
└─ ③ Services & Other (services_total)           FY25 ≈ 12.5B / 비중 ~13%
    └─ 중고차·부품정비·슈퍼차저·보험 등           누적보유대수 × 대당단가
```

매출 전체는 FY23 정점 후 완만히 둔화하지만, 구성요소는 방향이 엇갈린다(자동차 둔화 ↔ 에너지 급성장). 따라서 합계가 아닌 **구성요소 단위 추정**이 필수다.

---

## 3. 과거 시계열 (앵커 데이터)

### 3.1 세그먼트 매출 ($M)

| 연도 | Automotive 합계 | ─ 차량판매 | ─ 리스 | ─ 규제크레딧 | Energy | Services&Other | 총매출 |
|---|---|---|---|---|---|---|---|
| 2020 | 27,236 | 24,604 | 1,052 | 1,580 | 1,994 | 2,306 | 31,536 |
| 2021 | 47,232 | 44,125 | 1,642 | 1,465 | 2,789 | 3,802 | 53,823 |
| 2022 | 71,462 | 67,210 | 2,476 | 1,776 | 3,909 | 6,091 | 81,462 |
| 2023 | 82,419 | 78,509 | 2,120 | 1,790 | 6,035 | 8,319 | 96,773 |
| 2024 | 77,070 | 72,480 | 1,827 | 2,763 | 10,086 | 10,534 | 97,690 |
| 2025 | 69,526 | 65,821 | 1,712 | 1,993 | 12,771 | 12,530 | 94,827 |

> 전 라인아이템 10-K/8-K 손익계산서 확정값. 각 연도 차량판매+리스+크레딧 = Automotive 합계, Automotive+Energy+Services = 총매출로 정확히 일치 검증 완료.
> 출처: FY2022 10-K(2020·2021·2022), FY2023~FY2025 분기 8-K 손익계산서 합산(2023·2024·2025).

### 3.2 물량·드라이버 시계열

| 연도 | 인도량(대) | YoY | 에너지 저장 배포(GWh) | 내재 ASP($/대)* | 내재 에너지단가($/kWh)** |
|---|---|---|---|---|---|
| 2020 | 499,647 | — | 3.0 | 49,240 | 665 |
| 2021 | 936,222 | +87% | 4.0 | 47,130 | 697 |
| 2022 | 1,313,851 | +40% | 6.5 | 51,160 | 601 |
| 2023 | 1,808,581 | +38% | 14.7 | 43,410 | 411 |
| 2024 | 1,789,226 | −1% | 31.4 | 40,510 | 321 |
| 2025 | 1,636,129 | −9% | 46.7 | 40,230 | 273 |

\* 내재 ASP = 차량판매매출 ÷ 인도량 (라인아이템 확정값 기반 계산. Tesla 정의 ASP는 리스조정 인도량 기준이라 소폭 상이)
\*\* 내재 에너지단가 = Energy 세그먼트매출 ÷ GWh (솔라·에너지서비스 혼입 → 순수 저장단가 상회. 정밀화 시 분리 필요)

**핵심 읽기**: 인도량 FY23 정점 후 2년 연속 감소(수요제약 진입), ASP는 FY22 $51K → FY25 $40K로 ~21% 하락, 에너지 저장은 매년 약 2배 성장, 규제크레딧은 FY24 정점($2.76B) 후 정책변화로 감소 전환.

---

## 4. 매출 Q×P 재귀 분해 트리 (말단 드라이버까지)

각 리프 노드에 `[객관]`/`[주관]` 태그와 데이터 소스를 명시. `[주관]`은 상한/하한을 먼저 잡고 시나리오로 분리(§4.3 원칙).

### ① Automotive

```
automotive_total = automotive_sales + automotive_leasing + regulatory_credits
│
├─ 1a. automotive_sales = Σ_model ( deliveries_model × asp_model )
│   ├─ deliveries_model3y   [주관] 수요제약, top-down (시장×점유율)
│   │   ├─ ev_market_region   [객관] 지역별 EV 시장규모  (산업리서치)
│   │   └─ tesla_share_region [주관] 테슬라 점유율(경쟁심화·노후화로 하락) 상/하한
│   ├─ deliveries_sxc       [주관] S/X+Cybertruck, 추세연장 (틈새)
│   ├─ deliveries_newmodel  [주관] 신규 저가모델, bottom-up 램프업곡선
│   ├─ asp_model3y          [주관] 기준가 − 인센티브 ± 믹스 ± FX  상/하한
│   ├─ asp_sxc              [주관] 고가 모델 ASP
│   └─ asp_newmodel         [주관] 저가 신차 ASP (블렌디드 ASP 하락 요인)
│   └─[상한체크] production_capacity [객관] 공장별 연 생산능력 (수요<CAPA면 수요 바인딩)
│
├─ 1b. automotive_leasing = deliveries_total × lease_penetration × lease_rev_per_unit
│   ├─ lease_penetration    [주관] 리스 침투율(인도량의 %)  과거평균·금리
│   └─ lease_rev_per_unit   [객관] 대당 인식 리스매출
│
└─ 1c. regulatory_credits   [주관/외생] 정책 시나리오 step-down (Q×P 분해 안 함)
```

### ② Energy generation & storage

```
energy_total = storage_rev + solar_rev
│
├─ 2a. storage_rev = storage_gwh × storage_rev_per_kwh
│   ├─ storage_gwh           [주관] 공급제약, bottom-up
│   │   ├─ factory_capacity_gwh [객관] Megafactory별 capacity (Lathrop·Shanghai·신규)
│   │   └─ utilization_rate     [주관] 가동률 램프  (backlog/RPO로 수요 확인)
│   └─ storage_rev_per_kwh   [주관] $/kWh, 완만 하락 (원가·믹스: Megapack 신형)
│
└─ 2b. solar_rev = solar_mw × solar_rev_per_w
    ├─ solar_mw              [주관] 설치 MW, 추세연장(flat~감소)
    └─ solar_rev_per_w       [객관] $/W
```

### ③ Services & Other

```
services_total = installed_base × service_rev_per_unit
├─ installed_base        [계산] = PREV(installed_base) + deliveries_total   ← ①과 연결(교차참조)
└─ service_rev_per_unit  [주관] 대당 연 서비스매출, 추세연장
    └─ (상방옵션) supercharger_open_effect, fsd_subscription_uptake  [주관]
```

**분해 정지 기준**: 위 리프는 더 이상 쪼개면 트렌드가 흐려지거나 데이터가 없는 지점. Model 3/Y는 지역×점유율까지, 신차/에너지는 capacity×가동률까지, 서비스는 보유대수×대당단가까지만 전개.

---

## 5. 추정단위별 추정 로직

| 추정단위 | 노드키 | 추정방식 | 객/주 | 데이터소스 | 상·하한 / 가정 메모 |
|---|---|---|---|---|---|
| EV 지역시장규모 | `ev_market_region` | 추세외삽 | 객관 | 산업리서치(BNEF 등) | 지역별 EV 성장률 |
| 테슬라 점유율 | `tesla_share_region` | 상/하한 시나리오 | 주관 | 과거실적+경쟁구도 | 상: 모델 리프레시 효과 / 하: 경쟁심화·노후화 |
| Model 3/Y 인도량 | `deliveries_model3y` | top-down(수요제약) | 주관 | 시장×점유율 또는 런레이트×계절성 | FY23 정점 후 둔화 반영 |
| S/X·Cybertruck 인도량 | `deliveries_sxc` | 추세연장 | 주관 | 과거 인도량 | 연 ~5만대 내외 |
| 신차 인도량 | `deliveries_newmodel` | bottom-up(공급제약) | 주관 | 양산일정·램프 | 출시 전 0, 출시 후 분기 램프 |
| 생산능력 상한 | `production_capacity` | 캡 적용 | 객관 | 공장 capacity 공시 | 수요추정 합계 ≤ CAPA |
| 모델별 ASP | `asp_model3y/sxc/newmodel` | 단가식 분해 | 주관 | 가격표·인센티브·FX | 가격인하·저가믹스로 블렌디드 ASP 하락 |
| 리스 침투율 | `lease_penetration` | 추세연장 | 주관 | 과거 평균 | 금리환경 연동 |
| 리스 대당매출 | `lease_rev_per_unit` | 직접적용 | 객관 | 과거 인식액 | — |
| 규제크레딧 | `regulatory_credits` | 외생 step-down | 주관 | 정책(OBBBA 등) | FY24 정점 후 감소경로, 마진≈100% |
| 저장 배포량 | `storage_gwh` | bottom-up(공급제약) | 주관 | Megafactory capacity×가동률 | backlog/RPO로 수요 확인 |
| 저장 $/kWh | `storage_rev_per_kwh` | 추세연장(하락) | 주관 | 내재단가 추이 | 스케일·제품믹스 |
| 솔라 MW / $/W | `solar_mw`/`solar_rev_per_w` | 추세연장 | 주/객 | 과거 설치량 | 비중 작음, flat~감소 |
| 누적 보유대수 | `installed_base` | 연결식 누적 | 계산 | ①의 인도량 합산 | 폐차·이탈 미미 처리 |
| 대당 서비스매출 | `service_rev_per_unit` | 추세연장 | 주관 | 과거 $1,400~1,700/대 | 슈퍼차저개방·FSD구독은 상방옵션 |

**추정 방식 3분류 요약**
- 기존차(Model 3/Y) = **수요 바인딩**(top-down) — 생산능력이 아니라 수요가 상한.
- 신차·에너지저장 = **공급 바인딩**(bottom-up) — capacity 증설×가동률이 상한.
- 규제크레딧 = **외생 정책 시나리오** — Q×P 분해 불가, 별도 라인.

---

## 6. 매출 추정 시 핵심 연결고리

분해를 멈춘 뒤에도 **드라이버를 한 번만 추정해 여러 곳에 연결**해야 모델 정합성이 유지된다.

1. **인도량(deliveries) → 3곳 동시 영향**
   - 1a 차량판매 매출 (deliveries × ASP)
   - ③ 서비스 매출 (installed_base 누적의 증분)
   - ASP 믹스 (신차 인도량↑ → 블렌디드 ASP↓)
   인도량은 ①에서 한 번 추정하고 ③·ASP는 이를 참조. 따로 가정 금지.

2. **단방향 흐름 설계**: 인도량 가정 → ASP 믹스 → 서비스 누적 순서로 한 방향.

3. **§7로 이어지는 비용 공유 드라이버**: 아래 변수는 비용 레이어와 공유되므로 시뮬레이터에서 한 번 변경 시 매출·비용이 동시 변동해야 한다.

---

## 7. 매출-비용 교차참조 (공유 드라이버 사전 식별)

> 비용 추정은 별도 문서지만, 매출 설계 시점에 공유 드라이버를 미리 못박아 둔다(§5.2 원칙).

| 공유 드라이버 | 매출 측 영향 | 비용 측 영향(예고) |
|---|---|---|
| `deliveries_*` (인도량) | 차량판매·서비스 매출 | 차량 변동원가(배터리·부품), 보증충당, 물류 |
| `asp_*` (ASP/가격) | 차량판매 매출 | 단위 마진(가격인하 시 GPM 직접 압박) |
| `storage_gwh` | 에너지 매출 | 셀·소재 원가, Megafactory 감가상각 |
| `installed_base` | 서비스 매출 | 서비스망·슈퍼차저 운영비 |
| `regulatory_credits` | 매출(+영업이익) | 대응원가 거의 없음(≈100% 영업이익 기여) |

---

## 8. 가정변수 일람 (INPUT_KEYS 후보)

HTML 트리에서 슬라이더로 조정될 입력값. `[주관]`은 시나리오(공격/기본/보수) 분리 대상.

```
# Automotive
ev_market_region[지역]   [객관]
tesla_share_region[지역] [주관·시나리오]
deliveries_sxc           [주관]
deliveries_newmodel      [주관·시나리오]
production_capacity      [객관]
asp_model3y / asp_sxc / asp_newmodel   [주관·시나리오]
lease_penetration        [주관]
lease_rev_per_unit       [객관]
regulatory_credits       [주관·외생·시나리오]

# Energy
factory_capacity_gwh     [객관]
utilization_rate         [주관·시나리오]
storage_rev_per_kwh      [주관]
solar_mw / solar_rev_per_w   [주/객]

# Services
service_rev_per_unit     [주관]
(옵션) supercharger_open_effect, fsd_subscription_uptake  [주관]
```

---

## 9. 다음 단계 (산출물 파이프라인)

```
[본 md: 매출 설계도]  ← 현재 단계
   ↓ 구조·드라이버·가정 확정
[HTML 인터랙티브 트리]  D / INPUT_KEYS / TREE / simCalc / SIM_SECS
   ↓ IR JSON 추출
[Excel 매출 모델]  Sales 시트 (모델별 Q×P), Assumptions 집중, Checks 백테스트
```

- HTML 단계: 본 §2 트리와 §8 가정변수, §3 시계열을 전부 `MODEL` 한 객체에 적재. `TREE`·`INPUT_KEYS`는 `MODEL`에서 자동 파생되므로 직접 쓰지 않는다. 디자인은 [`../../design-guide`](../../design-guide) 토큰 준수(매출=primary.900, 입력변수=primary.500).
- Excel 단계: [`../../framework/excel_modeling_framework.md`](../../framework/excel_modeling_framework.md) 표준(컬러코딩·시트구조·Checks) 준수. §3 라인아이템은 10-K 확정값이므로 그대로 historical 입력값(파란색)으로 적재.
- 검증: §3 실적에 §4~5 로직을 역적용한 Case B 백테스트로 오차 확인.

---

## 부록. 데이터 출처 (라인아이템 확정 근거)

- **2020·2021·2022 손익계산서**: Tesla FY2022 10-K (`tsla-20221231`, 000095017023001409) — Consolidated Statement of Operations
- **2023 손익계산서**: Q4·FY2023 Update 8-K (000095017024007073) 분기 합산
- **2024 손익계산서**: Q4·FY2024 Update 8-K (000162828025002993) 분기 합산
- **2025 손익계산서**: Q4·FY2025 Update 8-K (000162828026003837, 2026-01-28) 분기 합산
- **인도량·에너지 GWh**: 각 Q4 Update 8-K Operational Summary
- 모든 라인아이템은 합계 reconcile 검증 통과 (차량판매+리스+크레딧=Auto, Auto+Energy+Services=총매출)
