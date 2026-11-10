// Aotearoa Volt — Streamlined Tesla-Grade Interactive Engine & Bilingual Dictionary (v10)

let currentLang = 'zh';
let selectedPkgIdx = 1; // Default: $16,900 6.6kW + 16kWh Flagship Turnkey
let selectedLoanIdx = 0; // Default: Westpac 5-Year 0% Green Loan
let currentFlowIdx = 0;
let currentWeatherIdx = 0;
let flowAutoplayTimer = null;
let isFlowPaused = false;

const flowSlides = [
  'assets/tesla/04_store_use_save_01_av.jpg?v=20261110_real_sunexus',
  'assets/tesla/04_store_use_save_02_av.jpg?v=20261110_real_sunexus',
  'assets/tesla/04_store_use_save_03_av.jpg?v=20261110_real_sunexus'
];

const weatherScenes = [
  {
    img: 'assets/tesla/05_storms_happen_av.jpg?v=20261110_real_sunexus',
    zhTitle: '飓风断网常有——但全屋停电不必再有',
    enTitle: 'Storms Happen—Outages Don’t Have To',
    zhDesc: '气象预警时自动蓄满 100% 电量。外网断电瞬间 <strong>&lt; 10 毫秒</strong>无感切换离网供电，Wi-Fi 不断连、电脑不重启，并支持柴油发电机自动点火联动。',
    enDesc: 'Storm Watch automatically charges PowerVault to 100% before severe weather hits, switching your home to backup power in <strong>&lt; 10ms</strong> with diesel generator auto-start.'
  },
  {
    img: 'assets/tesla/10_energy_there_av.jpg?v=20261110_real_sunexus',
    zhTitle: '风雪严寒，全天候可靠守护',
    enTitle: 'Built for Alpine Snow & Coastal Salt Mist',
    zhDesc: '采用 IP65 级全天候防尘防水防腐机身与智能 BMS 温控系统，在 <strong>-20°C 至 55°C</strong> 宽温域稳定运行，电芯循环寿命 ≥8,000 次，无惧皇后镇风雪与海岸盐雾。',
    enDesc: 'Engineered with an IP65 weatherproof enclosure and active thermal BMS, operating reliably from <strong>-20°C to 55°C</strong> with ≥8,000 LFP cycles.'
  }
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
  { nameZh: '0%绿贷', nameEn: '0% Green Loan', months: 60, rate: 0.0, rebate: 0 },
  { nameZh: '1%绿贷', nameEn: '1% Green Loan', months: 36, rate: 0.01, rebate: 0 },
  { nameZh: '立减$2k', nameEn: '$2k Co-Fund', months: 60, rate: 0.0, rebate: 2000 },
  { nameZh: '全款无月供', nameEn: 'Cash Upfront', months: 0, rate: 0.0, rebate: 0 }
];

function scrollStageIntoViewOnMobile(el) {
  if (!el || window.innerWidth > 768) return;
  const r = el.getBoundingClientRect();
  if (r.top < 56) {
    window.scrollBy({ top: r.top - 68, behavior: 'smooth' });
  }
}

function toggleMobileMenu() {
  const drawer = document.getElementById('tds-mobile-drawer');
  const btn = document.getElementById('tds-mobile-menu-btn');
  const header = document.querySelector('.tds-header');
  if (!drawer || !btn) return;
  if (header) {
    drawer.style.paddingTop = Math.max(68, Math.round(header.getBoundingClientRect().bottom + 12)) + 'px';
  }
  const isOpen = drawer.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  btn.textContent = isOpen
    ? (currentLang === 'zh' ? '关闭 ✕' : 'Close ✕')
    : (currentLang === 'zh' ? '菜单' : 'Menu');
}

function closeMobileMenu() {
  const drawer = document.getElementById('tds-mobile-drawer');
  const btn = document.getElementById('tds-mobile-menu-btn');
  if (!drawer || !btn) return;
  drawer.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
  btn.textContent = currentLang === 'zh' ? '菜单' : 'Menu';
}

function switchFlowSlide(idx, btn, isUserClick = false) {
  currentFlowIdx = idx;
  const img = document.getElementById('flow-stage-img');
  if (img && flowSlides[idx]) {
    img.style.opacity = '0.4';
    setTimeout(() => {
      img.src = flowSlides[idx];
      img.style.opacity = '1';
    }, 110);
    if (isUserClick) {
      scrollStageIntoViewOnMobile(img);
    }
  }
  const container = document.getElementById('flow-tabs-container');
  if (container) {
    const tabs = container.querySelectorAll('.tcl-overbar-tab');
    tabs.forEach((b, i) => {
      b.classList.remove('active');
      if (i === idx) {
        // Force reflow so the 6s top progress bar restarts cleanly
        void b.offsetWidth;
        b.classList.add('active');
      }
    });
  }
  if (isUserClick && !isFlowPaused) {
    restartFlowAutoplay();
  }
}

function restartFlowAutoplay() {
  if (flowAutoplayTimer) clearInterval(flowAutoplayTimer);
  if (isFlowPaused) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  flowAutoplayTimer = setInterval(() => {
    const nextIdx = (currentFlowIdx + 1) % flowSlides.length;
    const container = document.getElementById('flow-tabs-container');
    const tabs = container ? container.querySelectorAll('.tcl-overbar-tab') : [];
    switchFlowSlide(nextIdx, tabs[nextIdx], false);
  }, 6000);
}

function toggleFlowAutoplay() {
  isFlowPaused = !isFlowPaused;
  const container = document.getElementById('flow-tabs-container');
  const label = document.getElementById('flow-autoplay-label');
  if (container) {
    container.classList.toggle('paused', isFlowPaused);
  }
  if (label) {
    label.textContent = isFlowPaused
      ? (currentLang === 'zh' ? '继续轮播' : 'Play Carousel')
      : (currentLang === 'zh' ? '暂停轮播' : 'Pause Carousel');
  }
  if (isFlowPaused) {
    if (flowAutoplayTimer) clearInterval(flowAutoplayTimer);
  } else {
    restartFlowAutoplay();
  }
}

function switchWeatherScene(idx, btn) {
  currentWeatherIdx = idx;
  const scene = weatherScenes[idx];
  if (!scene) return;
  const img = document.getElementById('weather-stage-img');
  const h2 = document.getElementById('weather-h2');
  const copy = document.getElementById('weather-copy');
  if (img) {
    img.style.opacity = '0.4';
    setTimeout(() => {
      img.src = scene.img;
      img.style.opacity = '1';
    }, 120);
  }
  if (h2) h2.textContent = currentLang === 'zh' ? scene.zhTitle : scene.enTitle;
  if (copy) copy.innerHTML = currentLang === 'zh' ? scene.zhDesc : scene.enDesc;
  if (btn && btn.parentElement) {
    btn.parentElement.querySelectorAll('.tcl-weather-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
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
  const sign = netMonthlyCashflow >= 0 ? '+' : '';

  const billDisp = document.getElementById('bill-display');
  if (billDisp) {
    billDisp.textContent = currentLang === 'zh'
      ? `$${yrBill.toLocaleString()} NZD / 年 ($${moBill}/月)`
      : `$${yrBill.toLocaleString()} NZD / yr ($${moBill}/mo)`;
  }

  const netEl = document.getElementById('res-monthly-net');
  if (netEl) {
    netEl.textContent = currentLang === 'zh'
      ? `${sign}$${netMonthlyCashflow} NZD / 月`
      : `${sign}$${netMonthlyCashflow} NZD / mo`;
  }

  const subEl = document.getElementById('res-sub-summary');
  if (subEl) {
    subEl.innerHTML = currentLang === 'zh'
      ? `<span>省电 <strong>$${moSave}/月</strong></span><span>−</span><span>${loan.nameZh}月供 <strong>$${loanMo}/月</strong></span><span>=</span><span class="emerald">首月净赚 ${sign}$${netMonthlyCashflow}/月</span>`
      : `<span>Saved <strong>$${moSave}/mo</strong></span><span>−</span><span>${loan.nameEn} <strong>$${loanMo}/mo</strong></span><span>=</span><span class="emerald">Net ${sign}$${netMonthlyCashflow}/mo</span>`;
  }

  const dockText = document.getElementById('dock-cashflow-text');
  if (dockText) {
    dockText.textContent = currentLang === 'zh'
      ? `$0 首付 · 首月净赚 ${sign}$${netMonthlyCashflow}/月`
      : `$0 Down · Net ${sign}$${netMonthlyCashflow}/mo`;
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
    ? `$${loanMo}/月 (${loan.nameZh})`
    : `$${loanMo}/mo (${loan.nameEn})`;
  document.getElementById('res-payback').textContent = currentLang === 'zh'
    ? `${paybackYrs} 年 (15年+寿命)`
    : `${paybackYrs} yrs (15yr+ life)`;
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
    banner_text: 'Westpac 5年0息 ($50k) · ANZ/ASB/BNZ 1% 绿贷直批 · $0 首付首月净赚 +$176/月',
    banner_cta: '立即测算账单 →',
    nav_1: 'PowerVault 16',
    nav_2: '分时储电',
    nav_why: '核心优势',
    nav_3: 'Storm Watch 备电',
    nav_4: '在线定制与测算',
    nav_5: '技术参数',
    nav_poster: '获客海报',
    menu_btn: '菜单',
    hero_eyebrow: 'NEW ZEALAND DIRECT · 四大银行 0% 绿贷直批',
    hero_h1: 'PowerVault',
    hero_sub: '16.08 kWh 全屋智能储能 · 比 Powerwall 3 容量大 19%',
    hero_sub2: '裸机直购 $4,190 NZD · 6.6kW 光储全包安装 $16,900 NZD',
    hero_btn1: '立即定制 PowerVault',
    hero_btn2: '获取 24h 绿贷报价单',
    badge_1_label: '单机可用容量 (+19% vs Powerwall 3)',
    badge_2_unit: '/月',
    badge_2_label: '$0 首付 0% 绿贷首月净赚正现金流',
    badge_3_label: 'Storm Watch 飓风断网无感闪切',
    chip_1: '42c/kWh 晚高峰零买电',
    chip_2: '比传统品牌立省 $7,600+',
    chip_3: '奥克兰 & 基督城双仓现货',
    b3_h2: '点亮全屋，每年直接砍掉 $5,496 电费',
    b3_copy: '白天存入华晟 HJT 免费绿电，夜晚 42c/kWh 峰值时段独立驱动热泵空调、厨房与 EV 快充——告别 8c 贱卖绿电，首月即享正现金流。',
    flow_eyebrow: '24-HOUR AUTONOMOUS DISPATCH · 智能分时调度',
    flow_h2: '储电 · 用电 · 5.2 倍价差套利',
    pause_btn: '暂停轮播',
    b4_t1: '1. 白天储满免费绿电',
    b4_d1: '屋顶双面光伏余电自动存入 16.08kWh 电池，拒绝 8c/kWh 贱卖；阴雨夜自动按 15c 谷电补能。',
    b4_t2: '2. 晚高峰 42c 电网零买电',
    b4_d2: '17:00–21:00 电价暴涨时自动释放绿电，独立支撑全屋供暖、烹饪与电动汽车充电。',
    b4_t3: '3. 零逆流秒批与余电变现',
    b4_d3: '支持 ≤10kW 快速并网高价售电；变压器受限街区可一键开启 CT 零逆流，5 天免排队并网。',
    bento_eyebrow: 'FACTORY DIRECT ADVANTAGE · 为什么首选 POWERVAULT',
    bento_h2: '源头直供，每一分钱都花在硬核配置上',
    bc1_k: 'SAVE $7,600+ VS LEGACY BRANDS',
    bc1_t: '砍掉 $7,600+ 中间商溢价 · 100% 产权买断',
    bc1_d: '6.6kW 华晟 HJT + 16.08kWh 储能持牌电工全包仅 $16,900 NZD（传统品牌 $24,500+）。开放单台电池 $4,190 NZD 裸机直购，手机 App 实时追踪每日省钱净额。',
    bc2_k: 'HUASUN HJT BIFACIAL SOLAR',
    bc2_t: '华晟 HJT 双面全黑组件 · 弱光多发电 15%',
    bc2_d: '23%+ 转换效率，专为奥克兰多云阴雨天与南岛冬季晨昏弱光打造，30 年功率质保。',
    bc3_k: 'SOLAR EV CHARGING · MODULAR SCALE',
    bc3_t: '纯阳光免费充 EV · 最高扩容至 208 kWh',
    bc3_d: '支持多余绿电专属充车；从 16kWh 城市住宅、32kWh 双联别墅，直通 208kWh 牧场高压微网。',
    bc4_k: 'LOCAL NZ STOCK · 0%–1% GREEN LOANS',
    bc4_t: '奥克兰 & 基督城双仓现货 · 四大银行 0% 绿贷',
    bc4_d: '告别 60 天海运等待。存量老光伏半天即可加装 16kWh 电池包（$8,900 全包），24h 出具 Westpac 0% / ANZ / ASB / BNZ 绿贷合规报价。',
    wchip_1: '< 10ms UPS 自动闪切',
    wchip_2: 'IP65 防水防腐 · -20°C~55°C',
    wchip_3: '≥ 8,000 次长寿命循环',
    w_btn1: '🌪️ 气旋风暴备电 (Storm Watch)',
    w_btn2: '❄️ 皇后镇极寒风雪 (-20°C IP65)',
    b5_h2: '飓风断网常有——但全屋停电不必再有',
    b5_copy: '气象预警时自动蓄满 100% 电量。外网断电瞬间 <strong>&lt; 10 毫秒</strong>无感切换离网供电，Wi-Fi 不断连、电脑不重启，并支持柴油发电机自动点火联动。',
    st_eyebrow: 'POWERVAULT DESIGN STUDIO · 新西兰家庭现金流精算',
    bar_old_lbl: '安装前：每月交给电力公司纯支出',
    bar_new_lbl: '安装后：银行绿贷月供 + 剩余微少电费',
    kpi_1: '每年直接砍掉电费',
    kpi_2: '银行绿贷每月还款',
    kpi_3: '静态回本周期',
    kpi_4: '10年累计免税净收益',
    st_right_h2: '定制您的 PowerVault 系统',
    st_step1: '1. 当前家庭年电费账单',
    st_step2: '2. 选择系统套餐（全包安装或硬件直购）',
    pkg0_t: '存量光伏加装 PowerVault 16kWh',
    pkg0_d: '16.08kWh LFP + 6kW 逆变器 + 持牌安装 (单买电池 $4,190)',
    pkg1_t: '家庭旗舰 6.6kW HJT 光伏 + PowerVault 16kWh 全包',
    pkg1_d: '15块华晟双面全黑组件 + 16.08kWh 储能 + 6kW 逆变器 + 全包并网',
    pkg2_t: '庄园满配 10.5kW 光伏 + 32kWh 双联 PowerVault',
    pkg2_d: '24块 HJT 组件 + 32.16kWh 储能 + 10kW 柴发联动逆变器全包',
    pkg3_t: '6.6kW HJT + 16kWh 全套硬件裸机直发包',
    pkg3_d: '双仓自提或锁舱直发 (单买 16kWh 电池+逆变器 $6,490)',
    st_step3: '3. 选择新西兰银行绿色贷款 / 付款方式',
    st_order_cta: '锁定该方案 · 获取 24h 银行绿贷正式报价单 →',
    spec_h2: 'PowerVault 技术参数 (Specs)',
    b11_h2: 'Power Everything',
    b11_copy: '立即在线锁定您的 PowerVault 配置，24 小时内获取符合四大银行 0%–1% 绿色贷款规范的正式报价单。',
    b11_btn1: '立即预定 PowerVault',
    b11_btn2: '查看同款获客海报',
    dock_sub: '$0 首付 · 首月净赚 +$176/月',
    dock_cta: '立即测算 →'
  },
  en: {
    banner_text: 'Westpac 5-Yr 0% ($50k) & ANZ/ASB/BNZ 1% Green Loans · $0 Down, +$176/mo Net Positive Cashflow',
    banner_cta: 'Calculate Savings →',
    nav_1: 'PowerVault 16',
    nav_2: 'Time-Based Control',
    nav_why: 'Advantages',
    nav_3: 'Storm Watch',
    nav_4: 'Design & Pricing',
    nav_5: 'Specs',
    nav_poster: 'Poster',
    menu_btn: 'Menu',
    hero_eyebrow: 'NEW ZEALAND DIRECT · 0% BANK GREEN LOAN',
    hero_h1: 'PowerVault',
    hero_sub: '16.08 kWh Smart Home Battery · 19% Larger Than Powerwall 3',
    hero_sub2: '$4,190 NZD Unit Only · $16,900 NZD 6.6kW Solar + Battery Turnkey',
    hero_btn1: 'Design Your PowerVault',
    hero_btn2: 'Get 24h Green Loan Quote',
    badge_1_label: 'Usable Capacity (+19% vs Powerwall 3)',
    badge_2_unit: '/mo',
    badge_2_label: 'Month-1 Net Positive Cashflow ($0 Down)',
    badge_3_label: 'Storm Watch Automatic Outage Switchover',
    chip_1: 'Zero Grid Buy at 42c/kWh Peak',
    chip_2: 'Save $7,600+ vs Legacy Brands',
    chip_3: 'Auckland & Christchurch Stock',
    b3_h2: 'Power Your Home, Slash $5,496/Yr Off Your Bill',
    b3_copy: 'Capture free daytime HJT solar and run heat pumps, induction cooking, and EV charging through the 42c/kWh evening peak—cashflow positive from Month 1.',
    flow_eyebrow: '24-HOUR AUTONOMOUS DISPATCH · SMART ENERGY FLOW',
    flow_h2: 'Store · Use · 5.2x Peak Arbitrage',
    pause_btn: 'Pause Carousel',
    b4_t1: '1. Store Extra Daytime Solar',
    b4_d1: 'Store 16.08kWh of surplus rooftop solar instead of selling for 8c/kWh; top up on 15c off-peak night power in winter.',
    b4_t2: '2. Zero Peak Grid Buying (42c/kWh)',
    b4_d2: 'Automatically discharge stored green energy between 5pm–9pm to run your entire home without buying expensive peak power.',
    b4_t3: '3. Fast-Track Grid Export & Zero-Export',
    b4_d3: 'Export surplus under 2026 ≤10kW fast-track rules, or enable CT Zero-Export for 5-day approval on congested lines.',
    bento_eyebrow: 'FACTORY DIRECT ADVANTAGE · WHY KIWI HOMES CHOOSE US',
    bento_h2: 'Factory-Direct Engineering, Zero Middleman Markup',
    bc1_k: 'SAVE $7,600+ VS LEGACY BRANDS',
    bc1_t: 'Save $7,600+ Upfront · 100% Ownership',
    bc1_d: '6.6kW Huasun HJT solar + 16.08kWh battery fully installed for $16,900 NZD (vs $24,500+ legacy quotes), or $4,190 unit-only.',
    bc2_k: 'HUASUN HJT BIFACIAL SOLAR',
    bc2_t: 'Huasun HJT Bifacial All-Black Panels (+15% Yield)',
    bc2_d: '23%+ module efficiency engineered for cloudy Auckland mornings and South Island winter light, backed by a 30-year warranty.',
    bc3_k: 'SOLAR EV CHARGING · MODULAR SCALE',
    bc3_t: 'Charge EV on Pure Sunshine · Scale to 208 kWh',
    bc3_d: 'Charge your EV from surplus solar, and scale seamlessly from 16kWh suburban homes to 208kWh commercial dairy microgrids.',
    bc4_k: 'LOCAL NZ STOCK · 0%–1% GREEN LOANS',
    bc4_t: 'Auckland & Christchurch Stock · 0% Bank Green Loans',
    bc4_d: 'No 60-day shipping wait. Half-day solar retrofit ($8,900 turnkey) with 24h compliant quotes for Westpac 0%, ANZ, ASB & BNZ.',
    wchip_1: '< 10ms UPS Auto-Switch',
    wchip_2: 'IP65 Weatherproof · -20°C~55°C',
    wchip_3: '≥ 8,000 LFP Cycles',
    w_btn1: '🌪️ Cyclone Storm Watch (<10ms)',
    w_btn2: '❄️ Queenstown Alpine Snow (-20°C)',
    b5_h2: 'Storms Happen—Outages Don’t Have To',
    b5_copy: 'Storm Watch automatically charges PowerVault to 100% before severe weather hits, switching your home to backup power in <strong>&lt; 10ms</strong> with diesel generator auto-start.',
    st_eyebrow: 'POWERVAULT DESIGN STUDIO · LIVE NZ CASHFLOW CALCULATOR',
    bar_old_lbl: 'Before: Monthly Power Bill to Retailer',
    bar_new_lbl: 'After: Bank Green Loan + Residual Grid Bill',
    kpi_1: 'Annual Power Bill Saved',
    kpi_2: 'Monthly Green Loan Payment',
    kpi_3: 'Static Payback Period',
    kpi_4: '10-Year Tax-Free Net Return',
    st_right_h2: 'Design Your PowerVault System',
    st_step1: '1. Current Annual Household Power Bill',
    st_step2: '2. Select System Package (Turnkey or Kit-Only)',
    pkg0_t: 'Solar Retrofit: PowerVault 16kWh Package',
    pkg0_d: '16.08kWh LFP + 6kW Hybrid Inverter + Install (Battery Only $4,190)',
    pkg1_t: 'Kiwi Home Flagship: 6.6kW HJT Solar + 16kWh Turnkey',
    pkg1_d: '15x Huasun HJT Panels + 16.08kWh Battery + 6kW Inverter + Full Install',
    pkg2_t: 'Lifestyle Pro: 10.5kW Solar + 32kWh Dual PowerVault',
    pkg2_d: '24x HJT Panels + 32.16kWh Storage + 10kW Gen-Auto Inverter Turnkey',
    pkg3_t: 'Kit-Only Direct: 6.6kW HJT + 16kWh Full Hardware Kit',
    pkg3_d: 'Auckland/Christchurch Pickup or Dispatch (16kWh + Inverter Kit $6,490)',
    st_step3: '3. Select NZ Bank Green Loan / Payment Method',
    st_order_cta: 'Lock Configuration · Request 24h Bank Green Loan Quote →',
    spec_h2: 'PowerVault Specs',
    b11_h2: 'Power Everything',
    b11_copy: 'Lock in your PowerVault configuration online and receive your 24-hour NZ Bank 0%–1% Green Loan quote.',
    b11_btn1: 'Order PowerVault 16',
    b11_btn2: 'View Promotional Poster',
    dock_sub: '$0 Down · Net +$176/mo',
    dock_cta: 'Calculate Now →'
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

  // Keep active weather scene in sync with selected language
  const activeWeatherBtns = document.querySelectorAll('.tcl-weather-btn');
  if (activeWeatherBtns[currentWeatherIdx]) {
    switchWeatherScene(currentWeatherIdx, activeWeatherBtns[currentWeatherIdx]);
  }

  updateStudioCalc();
}

function initFloatingDockObserver() {
  const dock = document.getElementById('floating-dock');
  const hero = document.getElementById('hero-section');
  const studio = document.getElementById('design-studio');
  const order = document.getElementById('order-now');
  if (!dock || !hero) return;

  let heroVisible = true;
  let studioVisible = false;
  let orderVisible = false;

  function syncDockVisibility() {
    const shouldShow = !heroVisible && !studioVisible && !orderVisible;
    dock.classList.toggle('visible', shouldShow);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target === hero) heroVisible = entry.isIntersecting;
      if (entry.target === studio) studioVisible = entry.isIntersecting;
      if (entry.target === order) orderVisible = entry.isIntersecting;
    });
    syncDockVisibility();
  }, { threshold: 0.12 });

  obs.observe(hero);
  if (studio) obs.observe(studio);
  if (order) obs.observe(order);
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
      vec2 frag = vec2(v_uv.x * u_res.x, (1.0 - v_uv.y) * u_res.y);

      float cx = u_res.x * 0.5;
      float R  = max(u_res.x * 0.66, u_res.y * 0.86);
      float horizonOffset = (u_res.x < u_res.y) ? 0.355 : 0.295;
      float cy = R + u_res.y * horizonOffset;

      float nx = (frag.x - cx) / R;
      float ny = (frag.y - cy) / R;
      float r2 = nx * nx + ny * ny;
      float r  = sqrt(r2);

      vec3 col = vec3(0.004, 0.008, 0.020);

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

        float e1 = nx;
        float e2 = 0.669 * ny - 0.743 * nz;
        float p_coord = clamp(0.743 * ny + 0.669 * nz, -1.0, 1.0);

        float lon = atan(e1, -e2);
        float lat = asin(p_coord);

        float u = fract((lon / 6.283185307) * 2.0 + 0.08 - u_time * 0.0085);
        float v = clamp(0.46 + (lat + 0.36) * 0.78, 0.02, 0.98);

        vec3 c0 = texture2D(u_tex, vec2(u, v)).rgb;
        vec3 cx1 = texture2D(u_tex, vec2(fract(u + 0.00012), v)).rgb;
        vec3 cx2 = texture2D(u_tex, vec2(fract(u - 0.00012), v)).rgb;
        vec3 cy1 = texture2D(u_tex, vec2(u, clamp(v + 0.00048, 0.01, 0.99))).rgb;
        vec3 cy2 = texture2D(u_tex, vec2(u, clamp(v - 0.00048, 0.01, 0.99))).rgb;
        vec3 avg4 = 0.25 * (cx1 + cx2 + cy1 + cy2);
        vec3 sampled = clamp(c0 + (c0 - avg4) * 0.65, 0.0, 1.0);

        float lum = dot(sampled, vec3(0.299, 0.587, 0.114));
        float city_weight = clamp((lum - 0.05) / 0.25, 0.0, 1.0);

        float wave1 = sin(u * 94.2477 - u_time * 2.4 + v * 45.0);
        float wave2 = cos(u * 251.327 + u_time * 3.8 - v * 110.0);
        float sparkle = 1.0 + city_weight * (0.15 * wave1 + 0.12 * wave2);

        float limb = 1.0 - nz;
        vec3 night_atmo = pow(limb, 3.6) * vec3(0.047, 0.165, 0.384) * 0.78;
        float amber_w = exp(-pow((r - 0.9945) / 0.0045, 2.0));
        vec3 amber_edge = amber_w * vec3(0.765, 0.502, 0.216) * 0.72;

        float terrain_shade = clamp(0.28 + 0.80 * pow(nz, 0.50), 0.0, 1.05);
        float city_shade    = clamp(0.84 + 0.48 * pow(nz, 0.20), 0.0, 1.32) * sparkle;
        float effective_shade = mix(terrain_shade, city_shade, city_weight);

        float edge_aa = clamp((1.0 - r) / 0.004, 0.0, 1.0);

        vec3 planet_rgb = clamp(sampled * effective_shade + night_atmo, 0.0, 1.0) * edge_aa + amber_edge;
        col = planet_rgb;
      }

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
  restartFlowAutoplay();
  initFloatingDockObserver();
});
