/**
 * RigDoctor - Main Application Controller
 * Handles UI interactions, tab switching, real-time calculations,
 * reactive state updates, and secure event orchestration.
 */

(function () {
  'use strict';

  const SEC = window.RigSecurity;
  const DB = window.RigDatabase;
  const ENGINE = window.RigEngine;
  const STORAGE = window.RigStorage;

  // Application State
  let state = STORAGE.loadProfile();
  let saveTimeout = null;

  /**
   * Debounced save to localStorage
   */
  function triggerAutoSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      await STORAGE.saveProfile(state);
      updateStorageSizeLabel();
    }, 350);
  }

  /**
   * Accessible Toast Notification System
   */
  function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    let borderColor = '#38bdf8';
    if (type === 'success') {
      icon = '✅';
      borderColor = '#34d399';
    } else if (type === 'warning') {
      icon = '⚠️';
      borderColor = '#fbbf24';
    } else if (type === 'error') {
      icon = '❌';
      borderColor = '#fb7185';
    }

    toast.style.borderLeft = `4px solid ${borderColor}`;

    const iconSpan = document.createElement('span');
    iconSpan.textContent = icon;
    iconSpan.style.fontSize = '1.15rem';

    const textSpan = document.createElement('span');
    textSpan.textContent = message;

    toast.appendChild(iconSpan);
    toast.appendChild(textSpan);
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, duration);
  }

  /**
   * Populates CPU dropdown with branded groups
   */
  function populateCpuSelect() {
    const select = document.getElementById('select-cpu');
    if (!select) return;

    select.innerHTML = '';

    const intelGroup = document.createElement('optgroup');
    intelGroup.label = '--- Processadores Intel Core ---';

    const amdGroup = document.createElement('optgroup');
    amdGroup.label = '--- Processadores AMD Ryzen ---';

    DB.cpus.forEach(cpu => {
      const opt = document.createElement('option');
      opt.value = cpu.id;
      opt.textContent = `${cpu.name} (${cpu.cores}C/${cpu.threads}T - Base ${cpu.baseClock}GHz)`;
      if (cpu.brand === 'Intel') {
        intelGroup.appendChild(opt);
      } else {
        amdGroup.appendChild(opt);
      }
    });

    select.appendChild(intelGroup);
    select.appendChild(amdGroup);
    select.value = state.hardware.cpuId;
  }

  /**
   * Populates GPU dropdown with branded groups
   */
  function populateGpuSelect() {
    const select = document.getElementById('select-gpu');
    if (!select) return;

    select.innerHTML = '';

    const nvidiaGroup = document.createElement('optgroup');
    nvidiaGroup.label = '--- NVIDIA GeForce ---';

    const amdGroup = document.createElement('optgroup');
    amdGroup.label = '--- AMD Radeon ---';

    const intelGroup = document.createElement('optgroup');
    intelGroup.label = '--- Intel Arc ---';

    DB.gpus.forEach(gpu => {
      const opt = document.createElement('option');
      opt.value = gpu.id;
      opt.textContent = `${gpu.name} (${gpu.arch} - ${gpu.vramGB}GB)`;
      if (gpu.brand === 'NVIDIA') {
        nvidiaGroup.appendChild(opt);
      } else if (gpu.brand === 'AMD') {
        amdGroup.appendChild(opt);
      } else {
        intelGroup.appendChild(opt);
      }
    });

    select.appendChild(nvidiaGroup);
    select.appendChild(amdGroup);
    select.appendChild(intelGroup);
    select.value = state.hardware.gpuId;
  }

  /**
   * Populates Game, Resolution, and Preset dropdowns
   */
  function populateGameSelects() {
    // Games
    const gameSelect = document.getElementById('select-game');
    if (gameSelect) {
      gameSelect.innerHTML = '';
      DB.games.forEach(game => {
        const opt = document.createElement('option');
        opt.value = game.id;
        opt.textContent = `${game.name} [${game.genre}]`;
        gameSelect.appendChild(opt);
      });
      gameSelect.value = state.preferences.activeGameId;
    }

    // Resolutions
    const resSelect = document.getElementById('select-resolution');
    if (resSelect) {
      resSelect.innerHTML = '';
      Object.keys(DB.resolutions).forEach(key => {
        const res = DB.resolutions[key];
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = res.label;
        resSelect.appendChild(opt);
      });
      resSelect.value = state.preferences.activeResolution;
    }

    // Presets
    const presetSelect = document.getElementById('select-preset');
    if (presetSelect) {
      presetSelect.innerHTML = '';
      Object.keys(DB.presets).forEach(key => {
        const preset = DB.presets[key];
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = preset.label;
        presetSelect.appendChild(opt);
      });
      presetSelect.value = state.preferences.activePreset;
    }
  }

  /**
   * Populates Upgrade Target dropdown based on chosen category
   */
  function populateUpgradeTargets() {
    const typeSelect = document.getElementById('select-upgrade-type');
    const targetSelect = document.getElementById('select-upgrade-target');
    const priceInput = document.getElementById('input-upgrade-price');
    const wrapTarget = document.getElementById('wrap-target-component');
    if (!typeSelect || !targetSelect) return;

    const currentType = typeSelect.value;
    targetSelect.innerHTML = '';

    if (currentType === 'gpu') {
      if (wrapTarget) wrapTarget.style.display = 'block';
      DB.gpus.forEach(gpu => {
        const opt = document.createElement('option');
        opt.value = gpu.id;
        opt.textContent = `${gpu.name} - R$ ${gpu.priceBRL}`;
        targetSelect.appendChild(opt);
      });
      targetSelect.value = state.preferences.targetUpgradeId || 'rx-6600';
      const selectedGpu = ENGINE.getGpu(targetSelect.value);
      if (priceInput) priceInput.value = selectedGpu.priceBRL;
    } else if (currentType === 'cpu') {
      if (wrapTarget) wrapTarget.style.display = 'block';
      DB.cpus.forEach(cpu => {
        const opt = document.createElement('option');
        opt.value = cpu.id;
        opt.textContent = `${cpu.name} - R$ ${cpu.priceBRL}`;
        targetSelect.appendChild(opt);
      });
      targetSelect.value = state.preferences.targetUpgradeId || 'r5-5600';
      const selectedCpu = ENGINE.getCpu(targetSelect.value);
      if (priceInput) priceInput.value = selectedCpu.priceBRL;
    } else if (currentType === 'ram') {
      if (wrapTarget) wrapTarget.style.display = 'none';
      if (priceInput) priceInput.value = 280;
    } else if (currentType === 'ssd') {
      if (wrapTarget) wrapTarget.style.display = 'none';
      if (priceInput) priceInput.value = 420;
    }
  }

  /**
   * Populates and renders the DDU 5-step checklist
   */
  function renderDduChecklist() {
    const container = document.getElementById('ddu-checklist-container');
    const badge = document.getElementById('badge-ddu-progress');
    if (!container) return;

    container.innerHTML = '';
    const completedSet = new Set(state.driverChecklist || []);

    DB.dduProtocol.forEach(step => {
      const isDone = completedSet.has(step.id);

      const item = document.createElement('div');
      item.className = `check-item ${isDone ? 'completed' : ''}`;
      item.dataset.id = step.id;

      const box = document.createElement('div');
      box.className = 'check-box';
      box.textContent = isDone ? '✓' : '';

      const content = document.createElement('div');
      content.style.flex = '1';

      const stepBadge = document.createElement('span');
      stepBadge.className = 'check-step-badge';
      stepBadge.textContent = `ETAPA ${step.step} DE 5`;

      const title = document.createElement('div');
      title.className = 'check-title';
      title.style.fontWeight = '700';
      title.style.color = '#fff';
      title.style.fontSize = '0.9rem';
      title.textContent = step.title;

      const desc = document.createElement('div');
      desc.className = 'text-muted';
      desc.style.fontSize = '0.8rem';
      desc.style.marginTop = '0.2rem';
      desc.textContent = step.desc;

      content.appendChild(stepBadge);
      content.appendChild(title);
      content.appendChild(desc);

      item.appendChild(box);
      item.appendChild(content);

      item.addEventListener('click', () => {
        toggleDduStep(step.id);
      });

      container.appendChild(item);
    });

    if (badge) {
      badge.textContent = `${completedSet.size}/5 Concluído`;
      if (completedSet.size === 5) {
        badge.className = 'badge badge-emerald';
      } else if (completedSet.size > 0) {
        badge.className = 'badge badge-amber';
      } else {
        badge.className = 'badge badge-slate';
      }
    }
  }

  /**
   * Toggles a step in DDU checklist
   */
  function toggleDduStep(stepId) {
    if (!Array.isArray(state.driverChecklist)) {
      state.driverChecklist = [];
    }

    const index = state.driverChecklist.indexOf(stepId);
    if (index > -1) {
      state.driverChecklist.splice(index, 1);
    } else {
      state.driverChecklist.push(stepId);
    }

    triggerAutoSave();
    renderDduChecklist();
  }

  /**
   * Syncs hardware form inputs with current state
   */
  function syncHardwareInputs() {
    const hw = state.hardware;
    
    const cpuEl = document.getElementById('select-cpu');
    if (cpuEl) cpuEl.value = hw.cpuId;

    const gpuEl = document.getElementById('select-gpu');
    if (gpuEl) gpuEl.value = hw.gpuId;

    const ramSizeEl = document.getElementById('select-ram-size');
    if (ramSizeEl) ramSizeEl.value = String(hw.ramSizeGB);

    const ramChanEl = document.getElementById('select-ram-channels');
    if (ramChanEl) ramChanEl.value = String(hw.ramChannels);

    const ramSpeedEl = document.getElementById('select-ram-speed');
    if (ramSpeedEl) ramSpeedEl.value = String(hw.ramSpeedMHz);

    const storageTypeEl = document.getElementById('select-storage-type');
    if (storageTypeEl) storageTypeEl.value = hw.storageType;

    const storageCapEl = document.getElementById('input-storage-capacity');
    if (storageCapEl) storageCapEl.value = hw.storageCapacityGB;

    const storageUsedRange = document.getElementById('range-storage-used');
    if (storageUsedRange) {
      storageUsedRange.max = hw.storageCapacityGB;
      storageUsedRange.value = hw.storageUsedGB;
    }

    SEC.safeSetText('label-storage-used-val', `${hw.storageUsedGB} GB`);
  }

  /**
   * Renders the SSD Health and Capacity Monitor
   */
  function renderSsdHealth() {
    const hw = state.hardware;
    const analysis = ENGINE.getStorageAnalysis(hw.storageType, hw.storageCapacityGB, hw.storageUsedGB);

    SEC.safeSetText('metric-ssd-percent', `${analysis.usedPercent.toFixed(1)}%`);
    SEC.safeSetText('metric-ssd-breakdown', `${hw.storageUsedGB} GB ocupados de ${hw.storageCapacityGB} GB (${analysis.freeGB} GB livres)`);

    const bar = document.getElementById('progress-ssd-bar');
    const badge = document.getElementById('badge-ssd-status');
    const alertBox = document.getElementById('alert-ssd-box');
    const alertText = document.getElementById('alert-ssd-text');

    if (bar) {
      bar.style.width = `${Math.min(100, analysis.usedPercent)}%`;
      bar.className = 'progress-bar ' + (
        analysis.usedPercent >= 90 ? 'progress-rose' :
        analysis.usedPercent >= 80 ? 'progress-amber' :
        'progress-emerald'
      );
    }

    if (badge) {
      if (analysis.status === 'critical_space') {
        badge.className = 'badge badge-rose';
        badge.textContent = 'Degradação Severa (>90%)';
      } else if (analysis.status === 'warning_space') {
        badge.className = 'badge badge-amber';
        badge.textContent = 'Atenção Limite (>80%)';
      } else if (analysis.status === 'warning_hdd') {
        badge.className = 'badge badge-rose';
        badge.textContent = 'Gargalo de HD Mecânico';
      } else {
        badge.className = 'badge badge-emerald';
        badge.textContent = 'Desempenho Saudável';
      }
    }

    if (alertBox && alertText) {
      alertText.textContent = analysis.message;
      if (analysis.status === 'critical_space' || analysis.status === 'warning_hdd') {
        alertBox.className = 'alert-box alert-danger';
      } else if (analysis.status === 'warning_space') {
        alertBox.className = 'alert-box alert-warning';
      } else {
        alertBox.className = 'alert-box alert-success';
      }
    }
  }

  /**
   * Renders Performance Estimator (FPS, 1% Lows, Bottleneck)
   */
  function renderPerformanceEstimator() {
    const hw = state.hardware;
    const pref = state.preferences;

    const result = ENGINE.estimatePerformance(
      hw,
      pref.activeGameId,
      pref.activeResolution,
      pref.activePreset
    );

    // Update Average FPS
    SEC.safeSetText('metric-fps-avg', `${result.avgFps} FPS`);

    // Update 1% Lows
    SEC.safeSetText('metric-fps-low', `${result.onePercentLow} FPS`);

    const lowDesc = document.getElementById('metric-fps-low-desc');
    if (lowDesc) {
      const stability = (result.onePercentLow / Math.max(1, result.avgFps)) * 100;
      if (stability >= 75) {
        lowDesc.textContent = `Frametime Excelente (${stability.toFixed(0)}% do FPS)`;
        lowDesc.style.color = '#34d399';
      } else if (stability >= 60) {
        lowDesc.textContent = `Fluidez Boa (${stability.toFixed(0)}% do FPS)`;
        lowDesc.style.color = '#38bdf8';
      } else {
        lowDesc.textContent = `Micro-engasgos frequentes (${stability.toFixed(0)}% do FPS)`;
        lowDesc.style.color = '#fb7185';
      }
    }

    // Update Bottleneck Metric
    const bTitle = document.getElementById('metric-bottleneck-title');
    const bPct = document.getElementById('metric-bottleneck-pct');
    const bBadge = document.getElementById('badge-dominant-type');
    const bIndicator = document.getElementById('spectrum-indicator');
    const bBox = document.getElementById('alert-bottleneck-box');
    const bText = document.getElementById('alert-bottleneck-text');

    if (bTitle && bPct && bBadge && bIndicator) {
      const b = result.bottleneck;
      
      if (b.dominant === 'cpu_bound') {
        bTitle.textContent = 'CPU Bound';
        bTitle.className = 'metric-value text-rose-400';
        bBadge.className = 'badge badge-rose';
        bBadge.textContent = 'Gargalo de CPU';
        bIndicator.style.left = '15%';
      } else if (b.dominant === 'cpu_limited') {
        bTitle.textContent = 'CPU Limitada';
        bTitle.className = 'metric-value text-amber-400';
        bBadge.className = 'badge badge-amber';
        bBadge.textContent = 'Leve CPU Bound';
        bIndicator.style.left = '35%';
      } else if (b.dominant === 'gpu_bound') {
        bTitle.textContent = 'GPU Bound';
        bTitle.className = 'metric-value text-cyan-400';
        bBadge.className = 'badge badge-cyan';
        bBadge.textContent = 'GPU a 100% (Ideal)';
        bIndicator.style.left = '85%';
      } else {
        bTitle.textContent = 'Equilibrado';
        bTitle.className = 'metric-value text-emerald-400';
        bBadge.className = 'badge badge-emerald';
        bBadge.textContent = 'Sinergia Ideal';
        bIndicator.style.left = '50%';
      }

      bPct.textContent = `${b.percentage}% de desvio de balanceamento`;

      if (bBox && bText) {
        bText.textContent = b.description;
        if (b.dominant === 'cpu_bound') {
          bBox.className = 'alert-box alert-danger';
        } else if (b.dominant === 'cpu_limited') {
          bBox.className = 'alert-box alert-warning';
        } else {
          bBox.className = 'alert-box alert-success';
        }
      }
    }

    // Update Game Engine Tips & Insights
    SEC.safeSetText('badge-game-engine', result.game.engine);
    SEC.safeSetText('game-engine-description', result.game.description);
    SEC.safeSetText('game-engine-tips', result.game.tips);

    // Hardware Badges in Profiler
    SEC.safeSetText('badge-cpu-cores', `${result.cpu.cores}C / ${result.cpu.threads}T (${result.cpu.gen})`);
    SEC.safeSetText('badge-gpu-vram', `${result.gpu.vramGB}GB ${result.gpu.arch}`);
  }

  /**
   * Renders Drivers Tab matching the selected GPU
   */
  function renderDriversGuardian() {
    const gpu = ENGINE.getGpu(state.hardware.gpuId);
    
    SEC.safeSetText('driver-gpu-name', `${gpu.name} (${gpu.arch})`);

    // Match architecture in DB
    let stability = DB.driverStability.find(d => gpu.arch && d.gpuArch.toLowerCase().includes(gpu.arch.toLowerCase()));
    if (!stability) {
      if (gpu.brand === 'NVIDIA') {
        stability = DB.driverStability[0]; // Fallback Pascal/GTX
      } else if (gpu.brand === 'AMD') {
        stability = DB.driverStability[1]; // Fallback Polaris
      } else {
        stability = DB.driverStability[4]; // Fallback Intel Arc
      }
    }

    SEC.safeSetText('driver-golden-version', stability.recommendedDriver);
    SEC.safeSetText('driver-recommended-api', stability.recommendedApi);
    SEC.safeSetText('alert-driver-text', stability.criticalAlert);
    SEC.safeSetText('driver-notes', stability.notes);

    const verdictBadge = document.getElementById('badge-driver-verdict');
    if (verdictBadge) {
      if (stability.status === 'golden') {
        verdictBadge.className = 'badge badge-amber';
        verdictBadge.textContent = 'Versão Travada (Golden Driver)';
      } else {
        verdictBadge.className = 'badge badge-emerald';
        verdictBadge.textContent = 'WHQL Estável Recomendado';
      }
    }
  }

  /**
   * Renders the Upgrade Simulator & ROI Analysis
   */
  function renderUpgradeSimulator() {
    const hw = state.hardware;
    const pref = state.preferences;

    const type = pref.targetUpgradeType || 'gpu';
    const targetId = pref.targetUpgradeId;
    const customPrice = pref.targetUpgradeBudgetBRL;

    const sim = ENGINE.simulateUpgrade(
      hw,
      type,
      targetId,
      customPrice,
      pref.activeGameId,
      pref.activeResolution,
      pref.activePreset
    );

    // Baseline specs
    SEC.safeSetText('sim-current-specs', `${sim.current.cpu.name} + ${sim.current.gpu.name} (${hw.ramSizeGB}GB RAM)`);
    SEC.safeSetText('sim-current-avg', `${sim.current.avgFps} FPS`);
    SEC.safeSetText('sim-current-low', `${sim.current.onePercentLow} FPS`);

    // Projected specs
    SEC.safeSetText('sim-projected-specs', `Upgrade: ${sim.componentName}`);
    SEC.safeSetText('sim-projected-avg', `${sim.prospective.avgFps} FPS`);
    SEC.safeSetText('sim-projected-low', `${sim.prospective.onePercentLow} FPS`);

    // Deltas
    const deltaAvgEl = document.getElementById('sim-delta-avg');
    if (deltaAvgEl) {
      deltaAvgEl.textContent = `${sim.deltaAvgFps >= 0 ? '+' : ''}${sim.deltaAvgFps} FPS (${sim.percentGainAvg > 0 ? '+' : ''}${sim.percentGainAvg}%)`;
      deltaAvgEl.className = 'metric-sub ' + (sim.deltaAvgFps >= 0 ? 'text-emerald-400' : 'text-rose-400');
    }

    const deltaLowEl = document.getElementById('sim-delta-low');
    if (deltaLowEl) {
      deltaLowEl.textContent = `${sim.delta1PercentLow >= 0 ? '+' : ''}${sim.delta1PercentLow} FPS (${sim.percentGain1Percent > 0 ? '+' : ''}${sim.percentGain1Percent}%)`;
      deltaLowEl.className = 'metric-sub ' + (sim.delta1PercentLow >= 0 ? 'text-cyan-400' : 'text-rose-400');
    }

    // ROI Badge & Label
    const roiBadge = document.getElementById('badge-sim-roi');
    if (roiBadge) {
      roiBadge.className = `badge ${sim.roiBadgeColor}`;
      roiBadge.textContent = sim.roiLabel;
    }

    SEC.safeSetText('badge-fps-per-real', `${sim.fpsPer100Reais} FPS / R$ 100 investidos`);

    // Verdict explanation
    const verdictBox = document.getElementById('alert-sim-verdict');
    const verdictText = document.getElementById('sim-verdict-text');
    if (verdictBox && verdictText) {
      verdictText.textContent = `Investimento de R$ ${sim.costBRL}: Gera um incremento real de ${sim.deltaAvgFps} FPS na média e melhora os 1% Lows em ${sim.percentGain1Percent}%. Eficiência de ${sim.fpsPer100Reais} FPS a cada R$ 100 gastos.`;
    }

    // Diagnostic Alert (Bottleneck warnings)
    const warnBox = document.getElementById('sim-bottleneck-warning');
    const warnText = document.getElementById('sim-bottleneck-warning-text');
    if (warnBox && warnText) {
      if (sim.diagnosticAlert) {
        warnBox.style.display = 'flex';
        warnText.textContent = sim.diagnosticAlert;
      } else {
        warnBox.style.display = 'none';
      }
    }
  }

  /**
   * Updates local storage size counter
   */
  function updateStorageSizeLabel() {
    try {
      const raw = localStorage.getItem(STORAGE.STORAGE_KEY) || '';
      const bytes = new Blob([raw]).size;
      const kb = (bytes / 1024).toFixed(2);
      SEC.safeSetText('label-storage-bytes', `${kb} KB (${bytes} bytes)`);
    } catch (e) {
      SEC.safeSetText('label-storage-bytes', '0 KB');
    }
  }

  /**
   * Full UI update cycle
   */
  function renderAll() {
    syncHardwareInputs();
    renderSsdHealth();
    renderPerformanceEstimator();
    renderDriversGuardian();
    renderDduChecklist();
    renderUpgradeSimulator();
    updateStorageSizeLabel();
  }

  /**
   * Sets up Tab switching
   */
  function setupTabs() {
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTabId = btn.dataset.tab;

        tabButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const activePanel = document.getElementById(targetTabId);
        if (activePanel) {
          activePanel.classList.add('active');
        }
      });
    });
  }

  /**
   * Registers form event listeners
   */
  function setupEventListeners() {
    // CPU Change
    const cpuSelect = document.getElementById('select-cpu');
    if (cpuSelect) {
      cpuSelect.addEventListener('change', (e) => {
        state.hardware.cpuId = e.target.value;
        triggerAutoSave();
        renderAll();
      });
    }

    // GPU Change
    const gpuSelect = document.getElementById('select-gpu');
    if (gpuSelect) {
      gpuSelect.addEventListener('change', (e) => {
        state.hardware.gpuId = e.target.value;
        triggerAutoSave();
        renderAll();
      });
    }

    // RAM Size
    const ramSize = document.getElementById('select-ram-size');
    if (ramSize) {
      ramSize.addEventListener('change', (e) => {
        state.hardware.ramSizeGB = SEC.sanitizeNumber(e.target.value, 4, 128, 8);
        triggerAutoSave();
        renderAll();
      });
    }

    // RAM Channels
    const ramChannels = document.getElementById('select-ram-channels');
    if (ramChannels) {
      ramChannels.addEventListener('change', (e) => {
        state.hardware.ramChannels = SEC.sanitizeNumber(e.target.value, 1, 4, 1);
        triggerAutoSave();
        renderAll();
      });
    }

    // RAM Speed
    const ramSpeed = document.getElementById('select-ram-speed');
    if (ramSpeed) {
      ramSpeed.addEventListener('change', (e) => {
        state.hardware.ramSpeedMHz = SEC.sanitizeNumber(e.target.value, 1600, 8000, 2400);
        triggerAutoSave();
        renderAll();
      });
    }

    // Storage Type
    const storageType = document.getElementById('select-storage-type');
    if (storageType) {
      storageType.addEventListener('change', (e) => {
        state.hardware.storageType = e.target.value;
        triggerAutoSave();
        renderAll();
      });
    }

    // Storage Capacity
    const storageCap = document.getElementById('input-storage-capacity');
    if (storageCap) {
      storageCap.addEventListener('input', (e) => {
        const val = SEC.sanitizeNumber(e.target.value, 64, 16000, 480);
        state.hardware.storageCapacityGB = val;
        const rangeEl = document.getElementById('range-storage-used');
        if (rangeEl) rangeEl.max = val;
        triggerAutoSave();
        renderSsdHealth();
        renderPerformanceEstimator();
      });
    }

    // Storage Used Range
    const storageUsed = document.getElementById('range-storage-used');
    if (storageUsed) {
      storageUsed.addEventListener('input', (e) => {
        const val = SEC.sanitizeNumber(e.target.value, 0, state.hardware.storageCapacityGB, 410);
        state.hardware.storageUsedGB = val;
        SEC.safeSetText('label-storage-used-val', `${val} GB`);
        triggerAutoSave();
        renderSsdHealth();
        renderPerformanceEstimator();
      });
    }

    // Game Choice
    const gameSelect = document.getElementById('select-game');
    if (gameSelect) {
      gameSelect.addEventListener('change', (e) => {
        state.preferences.activeGameId = e.target.value;
        triggerAutoSave();
        renderPerformanceEstimator();
        renderUpgradeSimulator();
      });
    }

    // Resolution Choice
    const resSelect = document.getElementById('select-resolution');
    if (resSelect) {
      resSelect.addEventListener('change', (e) => {
        state.preferences.activeResolution = e.target.value;
        triggerAutoSave();
        renderPerformanceEstimator();
        renderUpgradeSimulator();
      });
    }

    // Preset Choice
    const presetSelect = document.getElementById('select-preset');
    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        state.preferences.activePreset = e.target.value;
        triggerAutoSave();
        renderPerformanceEstimator();
        renderUpgradeSimulator();
      });
    }

    // Upgrade Type Choice
    const upgradeTypeSelect = document.getElementById('select-upgrade-type');
    if (upgradeTypeSelect) {
      upgradeTypeSelect.addEventListener('change', (e) => {
        state.preferences.targetUpgradeType = e.target.value;
        populateUpgradeTargets();
        triggerAutoSave();
        renderUpgradeSimulator();
      });
    }

    // Upgrade Target Choice
    const upgradeTargetSelect = document.getElementById('select-upgrade-target');
    if (upgradeTargetSelect) {
      upgradeTargetSelect.addEventListener('change', (e) => {
        state.preferences.targetUpgradeId = e.target.value;
        const priceInput = document.getElementById('input-upgrade-price');
        if (state.preferences.targetUpgradeType === 'gpu') {
          const gpu = ENGINE.getGpu(e.target.value);
          if (priceInput) priceInput.value = gpu.priceBRL;
          state.preferences.targetUpgradeBudgetBRL = gpu.priceBRL;
        } else if (state.preferences.targetUpgradeType === 'cpu') {
          const cpu = ENGINE.getCpu(e.target.value);
          if (priceInput) priceInput.value = cpu.priceBRL;
          state.preferences.targetUpgradeBudgetBRL = cpu.priceBRL;
        }
        triggerAutoSave();
        renderUpgradeSimulator();
      });
    }

    // Upgrade Price Input
    const priceInput = document.getElementById('input-upgrade-price');
    if (priceInput) {
      priceInput.addEventListener('input', (e) => {
        state.preferences.targetUpgradeBudgetBRL = SEC.sanitizeNumber(e.target.value, 1, 100000, 1000);
        triggerAutoSave();
        renderUpgradeSimulator();
      });
    }

    // Quick Presets
    document.getElementById('btn-preset-classic')?.addEventListener('click', () => {
      state.hardware = {
        cpuId: 'i5-7400',
        gpuId: 'gtx-1060-6gb',
        ramSizeGB: 8,
        ramChannels: 1,
        ramSpeedMHz: 2400,
        storageType: 'sata_ssd',
        storageCapacityGB: 480,
        storageUsedGB: 410
      };
      triggerAutoSave();
      renderAll();
      showToast('Perfil clássico carregado: Core i5 7400 + GTX 1060 (8GB Single)', 'info');
    });

    document.getElementById('btn-preset-budget')?.addEventListener('click', () => {
      state.hardware = {
        cpuId: 'r5-5600',
        gpuId: 'rx-6600',
        ramSizeGB: 16,
        ramChannels: 2,
        ramSpeedMHz: 3200,
        storageType: 'nvme',
        storageCapacityGB: 1000,
        storageUsedGB: 380
      };
      triggerAutoSave();
      renderAll();
      showToast('Perfil carregado: Ryzen 5 5600 + RX 6600 (16GB Dual)', 'success');
    });

    document.getElementById('btn-preset-enthusiast')?.addEventListener('click', () => {
      state.hardware = {
        cpuId: 'i7-13700k',
        gpuId: 'rtx-4070',
        ramSizeGB: 32,
        ramChannels: 2,
        ramSpeedMHz: 6000,
        storageType: 'nvme',
        storageCapacityGB: 2000,
        storageUsedGB: 750
      };
      triggerAutoSave();
      renderAll();
      showToast('Perfil entusiasta carregado: Core i7 13700K + RTX 4070 (32GB DDR5)', 'success');
    });

    // Export Profile Button
    document.getElementById('btn-export-profile')?.addEventListener('click', async () => {
      const res = await STORAGE.exportProfileToFile(state);
      if (res.success) {
        showToast(`Backup seguro exportado: ${res.filename}`, 'success');
      } else {
        showToast(`Falha ao exportar perfil: ${res.error}`, 'error');
      }
    });

    // Import Profile File Input
    const importInput = document.getElementById('input-import-file');
    if (importInput) {
      importInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const res = await STORAGE.importProfileFromFile(file);
        if (res.success && res.profile) {
          state = res.profile;
          populateCpuSelect();
          populateGpuSelect();
          populateGameSelects();
          populateUpgradeTargets();
          renderAll();
          showToast('Perfil importado e verificado com sucesso!', 'success');
        } else {
          showToast(`Erro na importação: ${res.error}`, 'error');
        }
        importInput.value = '';
      });
    }

    // Reset to Default Button
    document.getElementById('btn-reset-default')?.addEventListener('click', async () => {
      if (window.confirm('Deseja realmente restaurar todas as configurações para o padrão inicial?')) {
        state = await STORAGE.resetProfile();
        populateCpuSelect();
        populateGpuSelect();
        populateGameSelects();
        populateUpgradeTargets();
        renderAll();
        showToast('Configurações redefinidas para o padrão!', 'info');
      }
    });

    // Purge Local Data
    document.getElementById('btn-purge-data')?.addEventListener('click', () => {
      if (window.confirm('ATENÇÃO: Isso apagará completamente todos os dados salvos no navegador. Continuar?')) {
        STORAGE.clearAllData();
        state = STORAGE.loadProfile();
        populateCpuSelect();
        populateGpuSelect();
        populateGameSelects();
        populateUpgradeTargets();
        renderAll();
        showToast('Todos os dados locais foram purgados com sucesso.', 'warning');
      }
    });
  }

  /**
   * Bootstraps the application on DOM ready
   */
  function init() {
    populateCpuSelect();
    populateGpuSelect();
    populateGameSelects();
    populateUpgradeTargets();
    setupTabs();
    setupEventListeners();
    renderAll();
  }

  // Self-boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
