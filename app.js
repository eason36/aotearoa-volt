// Aotearoa Volt — 1:1 Tesla Powerwall Interactive Engine & Bilingual Dictionary

let currentLang = 'zh';
let selectedPkgIdx = 1; // Default: $16,900 6.6kW + 16kWh Flagship Turnkey
let selectedLoanIdx = 0; // Default: Westpac 5-Year 0% Green Loan

const curveSlides = [
  'assets/tesla/02_slide1.png',
  'assets/tesla/02_slide2.png',
  'assets/tesla/02_slide3.png',
  'assets/tesla/02_slide4.png'
];

const flowSlides = [
  'assets/tesla/04_store_use_save_01_av.jpg?v=20261110_real_sunexus',
  'assets/tesla/04_store_use_save_02_av.jpg?v=20261110_real_sunexus',
  'assets/tesla/04_store_use_save_03_av.jpg?v=20261110_real_sunexus'
];

const verticalSlides = [
  'assets/tesla/06_capture_solar.jpg?v=20261110_real_sunexus',
  'assets/tesla/07_avoid_peak_av.jpg?v=20261110_real_sunexus',
  'assets/tesla/08_earn_selling.jpg?v=20261110_real_sunexus'
];

const hwUnits = [
  {
    img: 'assets/sunp_16kwh_unit.png?v=20261110_real_sunexus',
    code: 'MODEL: SUN(P)-16KWH · 51.2V 314Ah LFP',
    zhTitle: 'PowerVault 16kWh 旗舰落地/壁挂储能箱',
    enTitle: 'PowerVault 16kWh Flagship Floor/Wall Battery',
    zhDesc: '单机可用 16.08 kWh · 裸机直购 $4,190 NZD · 全包套餐 $8,900 起',
    enDesc: '16.08 kWh Usable · $4,190 NZD Unit Only · Turnkey from $8,900'
  },
  {
    img: 'assets/sunt_25kwh_tower.png?v=20261110_real_sunexus',
    code: 'MODEL: SUN(T)-25KWH5P · 256V HIGH-VOLTAGE STACK',
    zhTitle: 'PowerVault 25kWh 高压无线堆叠一体塔',
    enTitle: 'PowerVault 25kWh High-Voltage Stackable Tower',
    zhDesc: '单塔 25.60 kWh · 30分钟快装 · 大别墅与全离网微网首选',
    enDesc: '25.60 kWh Usable · Zero-Cable Stack · Ideal for Lifestyle Blocks'
  },
  {
    img: 'assets/sunt_10kwh_tower.png?v=20261110_real_sunexus',
    code: 'MODEL: SUN(T)-10KWH2P · COMPACT MODULAR',
    zhTitle: 'PowerVault 10kWh 紧凑型模块化储能',
    enTitle: 'PowerVault 10kWh Compact Modular Battery',
    zhDesc: '10.24 kWh 灵活起步 · 随时叠加扩容模块',
    enDesc: '10.24 kWh Modular Start · Expandable Anytime'
  }
];

const pkgConfigs = [
  { price: 8900, billCutRatio: 0.72, maxAnnualSave: 4200 },
  { price: 16900, billCutRatio: 0.916, maxAnnualSave: 6400 },
  { price: 23900, billCutRatio: 0.96, maxAnnualSave: 9600 },
  { price: 10490, billCutRatio: 0.916, maxAnnualSave: 6400 }
];

const loanConfigs = [
  { nameZh: '0%息', nameEn: '0% APR', months: 60, rate: 0.0, rebate: 0 },
  { nameZh: '1%息', nameEn: '1% APR', months: 36, rate: 0.01, rebate: 0 },
  { nameZh: '立减$2k', nameEn: '$2k Co-Fund', months: 60, rate: 0.0, rebate: 2000 },
  { nameZh: '全款无月供', nameEn: 'Cash Upfront', months: 0, rate: 0.0, rebate: 0 }
];

function switchCurveSlide(idx, btn) {
  const img = document.getElementById('fleet-curve-img');
  if (img && curveSlides[idx]) {
    img.src = curveSlides[idx];
  }
  const parent = btn.parentElement;
  parent.querySelectorAll('.tcl-overbar-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function switchFlowSlide(idx, btn) {
  const img = document.getElementById('flow-stage-img');
  if (img && flowSlides[idx]) {
    img.src = flowSlides[idx];
  }
  const parent = btn.parentElement;
  parent.querySelectorAll('.tcl-overbar-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function switchVerticalSlide(idx, btn) {
  const img = document.getElementById('v-showcase-img');
  if (img && verticalSlides[idx]) {
    img.src = verticalSlides[idx];
  }
  const parent = btn.parentElement;
  parent.querySelectorAll('.tcl-v-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function previewHardware(idx, btn) {
  const unit = hwUnits[idx];
  if (!unit) return;
  document.getElementById('studio-hw-img').src = unit.img;
  document.getElementById('studio-hw-code').textContent = unit.code;
  document.getElementById('studio-hw-title').textContent = currentLang === 'zh' ? unit.zhTitle : unit.enTitle;
  document.getElementById('studio-hw-desc').textContent = currentLang === 'zh' ? unit.zhDesc : unit.enDesc;
  btn.parentElement.querySelectorAll('.tcl-hw-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function selectPkg(idx, card) {
  selectedPkgIdx = idx;
  card.parentElement.querySelectorAll('.tcl-option-card').forEach(c => c.classList.remove('active'));
  card.classList.add('active');
  updateStudioCalc();
}

function selectLoan(idx, btn) {
  selectedLoanIdx = idx;
  btn.parentElement.querySelectorAll('.tcl-loan-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updateStudioCalc();
}

function updateStudioCalc() {
  const slider = document.getElementById('bill-slider');
  if (!slider) return;
  const moBill = parseInt(slider.value, 10) || 500;
  const yrBill = moBill * 12;

  const pkg = pkgConfigs[selectedPkgIdx];
  const loan = loanConfigs[selectedLoanIdx];

  const netPrice = Math.max(0, pkg.price - loan.rebate);
  const annualSave = Math.min(pkg.maxAnnualSave, Math.round(yrBill * pkg.billCutRatio));
  const moSave = Math.round(annualSave / 12);
  const residualBillMo = Math.max(0, moBill - moSave);

  let loanMo = 0;
  if (loan.months > 0) {
    if (loan.rate === 0) {
      loanMo = Math.round(netPrice / loan.months);
    } else {
      const r = loan.rate / 12;
      loanMo = Math.round((netPrice * r) / (1 - Math.pow(1 + r, -loan.months)));
    }
  }

  const netMonthlyCashflow = moSave - loanMo;
  const newTotalOutflow = loanMo + residualBillMo;
  const paybackYrs = (netPrice / Math.max(1, annualSave)).toFixed(1);
  const tenYrNet = Math.round(annualSave * 11.2 - netPrice);

  // Update DOM
  const billDisp = document.getElementById('bill-display');
  if (billDisp) {
    billDisp.textContent = currentLang === 'zh'
      ? `$${yrBill.toLocaleString()} NZD / 年 ($${moBill}/月)`
      : `$${yrBill.toLocaleString()} NZD / yr ($${moBill}/mo)`;
  }

  const netEl = document.getElementById('res-monthly-net');
  if (netEl) {
    const sign = netMonthlyCashflow >= 0 ? '+' : '';
    netEl.textContent = currentLang === 'zh'
      ? `${sign}$${netMonthlyCashflow} NZD / 月`
      : `${sign}$${netMonthlyCashflow} NZD / mo`;
  }

  const subEl = document.getElementById('res-sub-summary');
  if (subEl) {
    subEl.textContent = currentLang === 'zh'
      ? `安装首月起：每月省下电费 ($${moSave}/月) vs 银行绿贷月供 ($${loanMo}/月)`
      : `From Month 1: Power bill saved ($${moSave}/mo) vs Green Loan payment ($${loanMo}/mo)`;
  }

  document.getElementById('bar-old-val').textContent = currentLang === 'zh'
    ? `$${moBill} / 月`
    : `$${moBill} / mo`;

  document.getElementById('bar-new-val').textContent = currentLang === 'zh'
    ? `$${newTotalOutflow} / 月 ($${loanMo}月供 + $${residualBillMo}余电)`
    : `$${newTotalOutflow} / mo ($${loanMo} loan + $${residualBillMo} grid)`;

  const fillPct = Math.min(100, Math.max(15, Math.round((newTotalOutflow / moBill) * 100)));
  document.getElementById('bar-new-fill').style.width = `${fillPct}%`;

  document.getElementById('res-annual-save').textContent = `$${annualSave.toLocaleString()} NZD`;
  document.getElementById('res-loan-mo').textContent = currentLang === 'zh'
    ? `$${loanMo} / 月 (${loan.nameZh})`
    : `$${loanMo} / mo (${loan.nameEn})`;
  document.getElementById('res-payback').textContent = currentLang === 'zh'
    ? `${paybackYrs} 年 (寿命15年+)`
    : `${paybackYrs} yrs (15+ yr life)`;
  document.getElementById('res-10yr').textContent = `+$${tenYrNet.toLocaleString()} NZD`;
}

function switchSpecTab(idx, btn) {
  for (let i = 0; i < 3; i++) {
    const p = document.getElementById(`spec-panel-${i}`);
    if (p) p.style.display = i === idx ? 'block' : 'none';
  }
  btn.parentElement.querySelectorAll('.tcl-spec-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function submitOrderForm(e) {
  e.preventDefault();
  const toast = document.getElementById('toast-banner');
  if (toast) {
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 4000);
  }
}

const i18nDict = {
  zh: {
    banner_text: '支持 Westpac 5年0息 ($50k) 与 ANZ/ASB/BNZ 1% 绿色贷款 · 首付 $0 首月净赚 +$176 NZD',
    banner_cta: '立即测算您的电费账单',
    nav_1: 'PowerVault 16',
    nav_2: '分时储电与并网',
    nav_3: 'Storm Watch 备电',
    nav_4: '在线定制 ($6,000电费测算)',
    nav_5: '技术参数 (Specs)',
    nav_poster: '终端获客海报',
    hero_h1: 'PowerVault',
    hero_sub: '16.08 kWh 磷酸铁锂全屋储能 · 源头直供新西兰家庭',
    hero_sub2: '单机容量比 Powerwall 3 大 19% · 裸机 $4,190 NZD / 光储全包 $16,900 NZD',
    hero_btn1: '订购 PowerVault',
    hero_btn2: '连同光伏一起订购',
    badge_1_label: '单机可用容量 (比 Powerwall 3 多 19%)',
    badge_2_unit: '/月',
    badge_2_label: '0% 银行绿贷首月净赚正现金流 ($6k/年账单)',
    badge_3_label: '模块化并机扩容 (从城市别墅到牧场微网)',
    c1_t1: '源头工厂直通 – 砍掉 $7,100+ 溢价',
    c1_d1: '江苏光链 314Ah LFP 储能箱与安徽华晟 HJT 异质结双面组件源头直供，彻底绕开新西兰本地多层批发商加价。',
    c1_t2: '奥克兰 & 基督城双仓现货',
    c1_d2: '告别 60 天海运盲盒。南北岛本地仓常备 SUN(P)-16KWH 与 SUN(T)-25KWH 现货，支持屋主全包或电工单台批发提货。',
    c1_t3: '2026 分时电价 5.2 倍价差套利',
    c1_d3: '针对新西兰 8c 光伏贱卖与 42c 晚高峰刺客，16.08kWh 超大肚量把白天绿电 100% 留到晚高峰自用。',
    c1_t4: '四大银行 0%–1% 绿贷直批',
    c1_d4: '24 小时内出具符合 Westpac (5年0息)、ANZ、ASB、BNZ (3年1%) 审核规范的 Turnkey 报价单，零首付装机。',
    b3_h2: '点亮全屋，每年省下 $5,496 电费',
    b3_copy: 'PowerVault 是一款高能量密度的家庭磷酸铁锂储能系统，可高效储存华晟 HJT 太阳能组件发出的绿电或夜间低谷电网电力。无论是白天、42c/kWh 的昂贵晚高峰、还是飓风断网期间，它都能全天候为您家中的热泵空调、地暖、厨房电器与电动汽车供电。',
    b4_t1: '储存多余绿电 (Store Extra Energy)',
    b4_d1: '当屋顶 6.6kW–10.5kW 华晟双面光伏发电量超过白天的即时消耗时，PowerVault 会自动将多余电力存入 16.08kWh 电池，拒绝以 8c/kWh 贱卖给电网；阴雨天也可在夜间 15c 低谷时段自动从电网补能。',
    b4_t2: '全天候随心用电 (Use Energy)',
    b4_d2: '每晚 17:00–21:00 当新西兰零售电价飙升至 42c/kWh 时，PowerVault 自动释放日间存满的免费绿电，独立支撑全屋热泵、电磁炉、热水器与 EV 充电，实现晚高峰电网零买电。',
    b4_t3: '削峰套利与零逆流秒批 (Save and Earn)',
    b4_d3: '智能 EMS 根据分时电价自动执行削峰填谷或余电高价卖回电网（最高 23c/kWh）；针对变压器受限街区，更支持一键开启 CT 零逆流模式，免排队 5 天内直接并网发电。',
    b5_h2: '飓风与断网常有——但全屋停电不必再有',
    b5_copy: '在电网瘫痪时守住全屋光明。当气象预警气旋或极端风暴来临时，Storm Watch 备电模式会自动将 PowerVault 充至 100% 满电状态。一旦外网断电，系统将在 <strong>&lt; 10 毫秒</strong>内无感切换至离网微网供电，电脑不重启、Wi-Fi 不断连、冰箱与全屋照明照常运行，并支持柴油发电机 Dry-Contact 自动点火联动。',
    b6_t1: '捕获更多双面太阳能 (Capture More Solar)',
    b6_d1: '标配安徽华晟 HJT 异质结双面双玻全黑组件（23%+ 转换效率），在奥克兰阴雨天与南岛冬季晨昏弱光环境下比普通 PERC 组件多发电 10%–15%，白天发的每一度电都悉数收入囊中。',
    b6_t2: '彻底告别晚高峰电价刺客 (Avoid Peak Pricing)',
    b6_d2: '针对新西兰已装太阳能却无电池的 60,000+ 存量家庭，仅需半天即可加装 16.08kWh PowerVault 升级包（硬件 $6,490 / 包安装 $8,900），把白天白送电网的绿电变成夜晚 42c 的真金白银。',
    b6_t3: 'App 实时账本与余电变现 (Earn by Selling)',
    b6_d3: '手机端 24 小时查看屋顶发电、电池 SOC、家庭负载与每日省钱净额。支持 2026 新西兰电力局 ≤10kW 快速通道并网，余电自动高价回售抵扣账单。',
    b7_h2: '更大容量，立省 $7,600+ 落地总价',
    b7_copy: '单台 PowerVault 即可提供 16.08 kWh 真实可用容量（比 13.5 kWh 的 Powerwall 3 多出 19%），含 6.6kW 华晟 HJT 光伏与持牌电工全包安装仅需 <strong>$16,900 NZD</strong>——相比新西兰传统连锁品牌动辄 $24,500–$28,500 NZD 的报价，直接为您省下一辆家用代步车。同时支持 100% 产权买断，拒绝锁死 20 年的租约陷阱。',
    b8_h2: '风雪严寒，全天候可靠守护',
    b8_copy: '备电系统只有在极端环境下依然稳如泰山才叫可靠。PowerVault 采用 IP65 级全天候防尘防水铸铝与防腐机身，可在 -20°C 至 55°C 宽温域及高盐雾海岸气候下稳定运行。内置智能 BMS 温控与主动均衡系统，电芯循环寿命高达 ≥8,000 次，无惧皇后镇风雪与奥克兰冬季寒潮。',
    b8_link: '查看 AS/NZS 5139 & IEC 62619 安全认证规格 →',
    b9_h2: '纯净绿电充车，最高扩容至 208 kWh',
    b9_copy: 'PowerVault 的清洁电力不仅限于室内。您可以将系统设置为仅使用多余太阳能为电动汽车（EV）免费充电；随着家庭用电增长，低压版支持最多 16 台并机，高压版 SUN(T)-25KWH 支持模块化堆叠，牧场与工商业更可直上 208 kWh 液冷/风冷高压一体柜。',
    st_eyebrow: 'POWERVAULT DESIGN STUDIO · 新西兰家庭现金流精算',
    bar_old_lbl: '安装前：每月交给电力公司的纯支出',
    bar_new_lbl: '安装后：银行绿贷月供 + 剩余极少电费',
    kpi_1: '每年直接砍掉电费',
    kpi_2: '银行绿贷每月还款',
    kpi_3: '静态回本周期 (Payback)',
    kpi_4: '10年累计免税净收益',
    st_right_h2: '定制您的 PowerVault 系统',
    st_step1: '1. 您家庭目前的年电费账单',
    st_step2: '2. 选择系统套餐（含全包交钥匙与硬件直购）',
    pkg0_t: '存量光伏加装 PowerVault 16kWh',
    pkg0_d: '16.08kWh LFP + 6kW 混合逆变器 + 持牌安装 (单买电池仅 $4,190)',
    pkg1_t: '家庭旗舰 6.6kW HJT 光伏 + PowerVault 16kWh 全包',
    pkg1_d: '15块华晟双面全黑组件 + 16.08kWh 储能 + 6kW 逆变器 + 全包安装并网',
    pkg2_t: '庄园满配 10.5kW 光伏 + 32kWh 双联 PowerVault',
    pkg2_d: '24块 HJT 组件 + 32.16kWh 储能 + 10kW 柴发自动联动逆变器全包',
    pkg3_t: '6.6kW HJT + 16kWh 全套硬件裸机直发包',
    pkg3_d: '奥克兰/基督城仓自提或 30% 定金锁舱直发 (单买 16kWh 电池+逆变器 $6,490)',
    st_step3: '3. 选择新西兰银行绿色贷款 / 付款方式',
    st_order_cta: '锁定该方案 · 获取 24h 银行绿贷正式报价单 →',
    spec_h2: 'PowerVault 技术规格 (Specs)',
    b11_h2: 'Power Everything',
    b11_copy: '立即在线锁定您的 PowerVault 配置，或预约 Aotearoa Volt 本地工程顾问获取 24 小时银行 0% 免息绿贷正式报价单。',
    b11_btn1: '立即订购 PowerVault',
    b11_btn2: '查看同款终端获客海报'
  },
  en: {
    banner_text: '0% Green Loan via Westpac ($50k) & 1% via ANZ/ASB/BNZ · $0 Down, +$176/mo Net Positive Cashflow',
    banner_cta: 'Calculate Your Bill Savings',
    nav_1: 'PowerVault 16',
    nav_2: 'Time-Based Control',
    nav_3: 'Storm Watch',
    nav_4: 'Design & Pricing',
    nav_5: 'Specs',
    nav_poster: 'Promotional Poster',
    hero_h1: 'PowerVault',
    hero_sub: '16.08 kWh Home Battery Storage · Engineered for New Zealand',
    hero_sub2: '19% Larger Than Powerwall 3 · $4,190 NZD Unit Only / $16,900 Solar+Battery Turnkey',
    hero_btn1: 'Order PowerVault',
    hero_btn2: 'Order With Solar',
    badge_1_label: 'Usable Capacity (+19% vs Powerwall 3)',
    badge_2_unit: '/mo',
    badge_2_label: 'Net Positive Cashflow on $6k/yr Bill (0% Green Loan)',
    badge_3_label: 'Scalable Capacity (From Kiwi Homes to Dairy Farms)',
    c1_t1: 'Factory-Direct – Save $7,100+ Markup',
    c1_d1: 'Jiangsu SolarLink 314Ah LFP batteries and Huasun HJT bifacial solar panels shipped direct, cutting out NZ middleman markups.',
    c1_t2: 'Auckland & Christchurch Stock',
    c1_d2: 'No 60-day ocean freight wait. Local bonded stock of SUN(P)-16KWH and SUN(T)-25KWH ready for turnkey install or tradie pickup.',
    c1_t3: '5.2x Time-of-Use Peak Arbitrage',
    c1_d3: 'Stop exporting solar for 8c/kWh and buying back at 42c/kWh. Store 16.08kWh of free daytime solar to power your entire evening peak.',
    c1_t4: '0%–1% NZ Bank Green Loans',
    c1_d4: '24-hour compliant Turnkey quotes ready for Westpac 5-Year 0%, ANZ, ASB & BNZ 1% Green Home Loans with $0 upfront deposit.',
    b3_h2: 'Power Your Home, Save $5,496/Year',
    b3_copy: 'PowerVault is a compact, high-capacity 16.08kWh LFP home battery that stores energy generated by Huasun HJT solar panels or off-peak grid power. Use your stored energy to run heat pumps, appliances, and EVs day and night, during 42c/kWh peak hours, or when outages strike.',
    b4_t1: 'Store Extra Energy',
    b4_d1: 'When your 6.6kW–10.5kW HJT solar system generates more energy than you need, store the extra 16.08kWh with PowerVault instead of selling for 8c. Recharge from the grid on 15c off-peak night rates.',
    b4_t2: 'Use Energy',
    b4_d2: 'Your stored energy is available whenever you need it—during the 42c/kWh evening peak or when an outage occurs. Power your entire home including heat pumps, induction cooktops, and EV chargers.',
    b4_t3: 'Save and Earn',
    b4_d3: 'Using your usage history and NZ utility Time-of-Use rates, PowerVault optimizes your stored energy day and night, or runs in CT Zero-Export mode for 5-day fast-track grid connection.',
    b5_h2: 'Storms Happen—Outages Don’t Have To',
    b5_copy: 'Keep your home and appliances powered during cyclone or grid outages. Storm Watch automatically charges PowerVault to 100% before severe weather hits, transitioning your home to backup power in <strong>&lt; 10ms</strong> with automatic diesel generator dry-contact support.',
    b6_t1: 'Capture More Solar',
    b6_d1: 'Paired with Huasun HJT Bifacial N-Type all-black solar panels (23%+ efficiency), capturing 10%–15% more electricity on cloudy Auckland mornings and South Island winter days.',
    b6_t2: 'Avoid Peak Pricing',
    b6_d2: 'Already have solar on your roof? Our 16.08kWh Retrofit Battery Package ($6,490 Kit / $8,900 Installed) installs in half a day and eliminates 42c/kWh peak charges.',
    b6_t3: 'Earn by Selling',
    b6_d3: 'Monitor real-time solar generation, battery SOC, and daily NZD savings from your phone, while exporting surplus energy under the 2026 ≤10kW fast-track rules.',
    b7_h2: 'Maximum Efficiency, $7,600+ Lower Cost',
    b7_copy: 'A single PowerVault delivers 16.08 kWh usable capacity (+19% larger than Powerwall 3) and costs just <strong>$16,900 NZD</strong> fully installed with 6.6kW HJT solar—saving you $7,600 to $11,600 compared to legacy NZ quotes, with 100% asset ownership.',
    b8_h2: 'Energy That’s There When You Need It',
    b8_copy: 'Backup protection only works when your system is reliable. Built with an IP65 weatherproof enclosure and intelligent thermal BMS, PowerVault operates seamlessly from -20°C to 55°C with ≥8,000 LFP cycles.',
    b8_link: 'View AS/NZS 5139 & IEC 62619 Specifications →',
    b9_h2: 'Charge on Solar, Scale Up to 208 kWh',
    b9_copy: 'Charge your EV exclusively with excess solar energy, or scale from 16.08kWh residential units up to 48.24kWh lifestyle villas and 208kWh high-voltage commercial/dairy farm microgrids.',
    st_eyebrow: 'POWERVAULT DESIGN STUDIO · LIVE NZ CASHFLOW CALCULATOR',
    bar_old_lbl: 'Before PowerVault: Monthly Power Bill to Retailer',
    bar_new_lbl: 'With PowerVault: Bank Green Loan + Residual Grid Bill',
    kpi_1: 'Annual Power Bill Saved',
    kpi_2: 'Monthly Green Loan Payment',
    kpi_3: 'Payback Period',
    kpi_4: '10-Year Tax-Free Net Return',
    st_right_h2: 'Design Your PowerVault System',
    st_step1: '1. Current Annual Household Power Bill',
    st_step2: '2. Select System Package (Turnkey Installed or Kit-Only)',
    pkg0_t: 'Solar Retrofit: PowerVault 16kWh Package',
    pkg0_d: '16.08kWh LFP + 6kW Hybrid Inverter + Cert. Install (Battery Only $4,190)',
    pkg1_t: 'Kiwi Home Flagship: 6.6kW HJT Solar + 16kWh Turnkey',
    pkg1_d: '15x Huasun HJT Panels + 16.08kWh Battery + 6kW Inverter + Full Install',
    pkg2_t: 'Lifestyle Pro: 10.5kW Solar + 32kWh Dual PowerVault',
    pkg2_d: '24x HJT Panels + 32.16kWh Storage + 10kW Gen-Auto Inverter Turnkey',
    pkg3_t: 'Kit-Only Direct: 6.6kW HJT + 16kWh Full Hardware Kit',
    pkg3_d: 'Auckland/Christchurch Pickup or Direct Dispatch (16kWh + Inverter Kit $6,490)',
    st_step3: '3. Select NZ Bank Green Loan / Payment Method',
    st_order_cta: 'Lock Configuration · Request 24h Bank Green Loan Quote →',
    spec_h2: 'PowerVault Specs',
    b11_h2: 'Power Everything',
    b11_copy: 'Order now or schedule a call with an Aotearoa Volt Advisor to receive your 24-hour NZ Bank 0% Green Loan quote.',
    b11_btn1: 'Order PowerVault 16',
    b11_btn2: 'View Promotional Poster'
  }
};

function setLanguage(lang) {
  currentLang = lang;
  document.getElementById('btn-lang-zh').classList.toggle('active', lang === 'zh');
  document.getElementById('btn-lang-en').classList.toggle('active', lang === 'en');

  const dict = i18nDict[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  updateStudioCalc();
}

/* =========================================================
   REAL-TIME 3D ROTATING BLUE PLANET (WebGL Spherical Shader)
   ========================================================= */
function initHeroBluePlanet() {
  const canvas = document.getElementById('hero-planet-canvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl', { alpha: true, antialias: true }) ||
             canvas.getContext('experimental-webgl', { alpha: true, antialias: true });
  if (!gl) return;

  const vsSource = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main() {
      v_uv = a_pos * 0.5 + 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  const fsSource = `
    precision highp float;
    varying vec2 v_uv;
    uniform vec2 u_res;
    uniform float u_time;
    uniform sampler2D u_tex;

    void main() {
      // Screen pixel coordinates with y=0 at top, y=H at bottom (matching our verified reference projection)
      vec2 frag = vec2(v_uv.x * u_res.x, (1.0 - v_uv.y) * u_res.y);

      float cx = u_res.x * 0.5;
      float R  = max(u_res.x * 0.66, u_res.y * 0.86);
      // Anchor the top horizon of the Night Earth right at 29.5% of hero height (just behind the CTA buttons, below the title/subtitle!)
      float cy = R + u_res.y * 0.295;

      float nx = (frag.x - cx) / R;
      float ny = (frag.y - cy) / R;
      float r2 = nx * nx + ny * ny;
      float r  = sqrt(r2);

      // Deep pitch-black orbital space background
      vec3 col = vec3(0.004, 0.008, 0.020);

      // Crisp procedural starfield in upper space
      if (r > 1.02) {
        vec2 cell = floor(frag / 2.5);
        float h = fract(sin(dot(cell, vec2(127.1, 311.7))) * 43758.5453123);
        if (h > 0.9962) {
          float twinkle = 0.60 + 0.40 * sin(u_time * 2.1 + h * 120.0);
          col += vec3(0.68, 0.78, 0.95) * twinkle * smoothstep(1.02, 1.07, r);
        }
      }

      if (r <= 1.0) {
        float nz = sqrt(max(0.0, 1.0 - r2));

        // Pole-free equatorial basis on the visible cap
        float e1 = nx;
        float e2 = 0.669 * ny - 0.743 * nz;
        float p_coord = clamp(0.743 * ny + 0.669 * nz, -1.0, 1.0);

        float lon = atan(e1, -e2);
        float lat = asin(p_coord);

        // Exact 2.0x integer longitude wrap across the 8192x2048 1:1 Native 14K City Belt (~3,500x1,900 native pixels on screen!)
        float u = fract((lon / 6.283185307) * 2.0 + 0.08 - u_time * 0.0085);
        // Utilize 96% of the 2048px vertical belt height (zero wasted polar space!)
        float v = clamp(0.46 + (lat + 0.36) * 0.78, 0.02, 0.98);

        // GPU 5-tap sub-pixel unsharp mask for razor-sharp 1-pixel city pinpoints
        vec3 c0 = texture2D(u_tex, vec2(u, v)).rgb;
        vec3 cx1 = texture2D(u_tex, vec2(fract(u + 0.00012), v)).rgb;
        vec3 cx2 = texture2D(u_tex, vec2(fract(u - 0.00012), v)).rgb;
        vec3 cy1 = texture2D(u_tex, vec2(u, clamp(v + 0.00048, 0.01, 0.99))).rgb;
        vec3 cy2 = texture2D(u_tex, vec2(u, clamp(v - 0.00048, 0.01, 0.99))).rgb;
        vec3 avg4 = 0.25 * (cx1 + cx2 + cy1 + cy2);
        vec3 sampled = clamp(c0 + (c0 - avg4) * 0.65, 0.0, 1.0);

        // Separate dark night continent relief from self-luminous city lights ("电力照亮夜晚")
        float lum = dot(sampled, vec3(0.299, 0.587, 0.114));
        float city_weight = clamp((lum - 0.05) / 0.25, 0.0, 1.0);

        // Dynamic electrical power-grid shimmer & live energy wave across illuminated cities
        float wave1 = sin(u * 94.2477 - u_time * 2.4 + v * 45.0);
        float wave2 = cos(u * 251.327 + u_time * 3.8 - v * 110.0);
        float sparkle = 1.0 + city_weight * (0.15 * wave1 + 0.12 * wave2);

        float limb = 1.0 - nz;
        // Subtle midnight-indigo night atmosphere near the limb
        vec3 night_atmo = pow(limb, 3.6) * vec3(0.047, 0.165, 0.384) * 0.78;
        // Thin golden-amber orbital airglow right at the night horizon rim
        float amber_w = exp(-pow((r - 0.9945) / 0.0045, 2.0));
        vec3 amber_edge = amber_w * vec3(0.765, 0.502, 0.216) * 0.72;

        float terrain_shade = clamp(0.28 + 0.80 * pow(nz, 0.50), 0.0, 1.05);
        float city_shade    = clamp(0.84 + 0.48 * pow(nz, 0.20), 0.0, 1.32) * sparkle;
        float effective_shade = mix(terrain_shade, city_shade, city_weight);

        float edge_aa = clamp((1.0 - r) / 0.004, 0.0, 1.0);

        vec3 planet_rgb = clamp(sampled * effective_shade + night_atmo, 0.0, 1.0) * edge_aa + amber_edge;
        col = planet_rgb;
      }

      // Outer night atmospheric glow & golden-amber orbital airglow band
      if (r > 0.985 && r < 1.055) {
        float dr = r - 1.0;
        vec3 outer_blue  = exp(-pow((dr - 0.001) / 0.012, 2.0)) * vec3(0.063, 0.204, 0.471) * 0.55;
        vec3 outer_amber = exp(-pow((dr - 0.011) / 0.0055, 2.0)) * vec3(0.804, 0.529, 0.235) * 0.75;
        col = clamp(col + outer_blue + outer_amber, 0.0, 1.0);
      }

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compileShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('Planet shader compile error:', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  const vs = compileShader(gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,  1, -1, -1,  1,
    -1,  1,  1, -1,  1,  1
  ]), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes  = gl.getUniformLocation(prog, 'u_res');
  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uTex  = gl.getUniformLocation(prog, 'u_tex');

  const tex = gl.createTexture();
  const img = new Image();
  img.crossOrigin = 'anonymous';
  let ready = false;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 3.0);
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  const startTime = performance.now();
  function render(now) {
    if (ready) {
      resize();
      const t = (now - startTime) * 0.001;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1i(uTex, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    requestAnimationFrame(render);
  }

  img.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    const ext = gl.getExtension('EXT_texture_filter_anisotropic') ||
                gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
                gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
    if (ext) {
      const maxAniso = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, maxAniso));
    }
    ready = true;
    resize();
    requestAnimationFrame(render);
  };
  img.src = 'assets/tesla/blue_planet_texture.jpg?v=20261110_14k_native';
  window.addEventListener('resize', resize);
}

document.addEventListener('DOMContentLoaded', () => {
  updateStudioCalc();
  initHeroBluePlanet();
});
