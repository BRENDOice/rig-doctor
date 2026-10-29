/**
 * RigDoctor - Performance, Bottleneck & Upgrade ROI Engine
 * Calculates Realistic Average FPS, 1% Lows (Frame Pacing),
 * CPU/GPU Bottleneck percentage, and BRL Cost-Benefit (ROI) metrics.
 */

(function (window) {
  'use strict';

  const DB = window.RigDatabase;

  /**
   * Helper to retrieve a CPU by ID or return default fallback
   */
  function getCpu(id) {
    return DB.cpus.find(c => c.id === id) || DB.cpus.find(c => c.id === 'i5-7400') || DB.cpus[0];
  }

  /**
   * Helper to retrieve a GPU by ID or return default fallback
   */
  function getGpu(id) {
    return DB.gpus.find(g => g.id === id) || DB.gpus.find(g => g.id === 'gtx-1060-6gb') || DB.gpus[0];
  }

  /**
   * Helper to retrieve a Game by ID or return default fallback
   */
  function getGame(id) {
    return DB.games.find(g => g.id === id) || DB.games[0];
  }

  /**
   * Calculates CPU Composite Score
   * Heavy emphasis on single-thread IPC for gaming, blended with multi-core throughput
   */
  function calculateCpuComposite(cpu) {
    return (cpu.singleScore * 0.72) + (cpu.multiScore * 0.28);
  }

  /**
   * Calculates GPU Composite Score
   * Rasterization capability with compute shader support
   */
  function calculateGpuComposite(gpu) {
    return (gpu.rasterScore * 0.82) + (gpu.computeScore * 0.18);
  }

  /**
   * Analyzes memory configuration impact on average FPS and 1% lows
   */
  function getMemoryFactors(ramSizeGB, ramChannels, ramSpeedMHz) {
    let avgMult = 1.0;
    let pacingMult = 1.0;

    // Capacity impact
    if (ramSizeGB < 8) {
      avgMult *= 0.80;
      pacingMult *= 0.60; // Severe stuttering
    } else if (ramSizeGB === 8) {
      avgMult *= 0.94;
      pacingMult *= 0.82; // Frequent page-file thrashing in modern games
    } else if (ramSizeGB >= 32) {
      avgMult *= 1.03;
      pacingMult *= 1.05;
    }

    // Channels impact (Single Channel is devastating for 1% lows)
    if (ramChannels === 1) {
      avgMult *= 0.88; // -12% on average FPS in CPU bound scenarios
      pacingMult *= 0.72; // -28% on 1% low frame time consistency
    } else if (ramChannels >= 2) {
      avgMult *= 1.0;
      pacingMult *= 1.0;
    }

    // Frequency impact
    if (ramSpeedMHz <= 2400) {
      avgMult *= 0.96;
      pacingMult *= 0.92;
    } else if (ramSpeedMHz >= 3600 && ramSpeedMHz < 5200) {
      avgMult *= 1.04;
      pacingMult *= 1.04;
    } else if (ramSpeedMHz >= 5200) {
      avgMult *= 1.08;
      pacingMult *= 1.08;
    }

    return { avgMult, pacingMult };
  }

  /**
   * Analyzes storage performance and degradation when space exceeds 80%
   */
  function getStorageAnalysis(storageType, capacityGB, usedGB) {
    const usedPercent = Math.min(100, Math.max(0, (usedGB / Math.max(1, capacityGB)) * 100));
    let avgMult = 1.0;
    let pacingMult = 1.0;
    let degradationPenalty = 0;
    let status = 'healthy';
    let message = 'Armazenamento operando em taxa ideal de leitura/escrita.';

    // Base type characteristics
    if (storageType === 'hdd') {
      avgMult = 0.90;
      pacingMult = 0.70; // High seek latency causes micro-stutter in open-world asset streaming
      status = 'warning_hdd';
      message = 'HD Mecânico causa gargalo severo de carregamento de texturas e micro-travamentos.';
    } else if (storageType === 'sata_ssd') {
      avgMult = 1.0;
      pacingMult = 1.0;
    } else if (storageType === 'nvme') {
      avgMult = 1.04;
      pacingMult = 1.08;
    }

    // Degradation threshold: SSDs above 80% suffer SLC cache exhaustion & heavy GC
    if (storageType !== 'hdd') {
      if (usedPercent >= 90) {
        status = 'critical_space';
        degradationPenalty = 15; // 15% penalty on 1% low pacing
        pacingMult *= 0.85;
        avgMult *= 0.95;
        message = `ALERTA CRÍTICO: SSD com ${usedPercent.toFixed(1)}% de ocupação! Cache SLC totalmente saturado e sobrecarga de Garbage Collection geram travamentos súbitos no jogo.`;
      } else if (usedPercent >= 80) {
        status = 'warning_space';
        degradationPenalty = 8;
        pacingMult *= 0.92;
        message = `ATENÇÃO: Ocupação em ${usedPercent.toFixed(1)}% (acima de 80%). Desgaste por amplificação de gravação aumentado e queda na consistência de 1% Lows.`;
      }
    }

    return {
      usedPercent,
      freeGB: Math.max(0, capacityGB - usedGB),
      avgMult,
      pacingMult,
      degradationPenalty,
      status,
      message
    };
  }

  /**
   * Calculates VRAM headroom impact
   */
  function getVramImpact(gpuVramGB, gameRecVramGB, presetKey) {
    let avgVramMult = 1.0;
    let pacingVramMult = 1.0;

    let targetReq = gameRecVramGB;
    if (presetKey === 'ultra') targetReq += 2;
    if (presetKey === 'low') targetReq = Math.max(2, targetReq - 2);

    if (gpuVramGB < targetReq) {
      const deficit = targetReq - gpuVramGB;
      avgVramMult = Math.max(0.65, 1.0 - (deficit * 0.08));
      pacingVramMult = Math.max(0.40, 1.0 - (deficit * 0.18)); // Severe frame-drop when spilling to system RAM
    }

    return { avgVramMult, pacingVramMult };
  }

  /**
   * Main Performance Calculation
   * Calculates realistic Average FPS and 1% Low FPS
   */
  function estimatePerformance(hardware, gameId, resolutionKey, presetKey) {
    const cpu = getCpu(hardware.cpuId);
    const gpu = getGpu(hardware.gpuId);
    const game = getGame(gameId);
    const resolution = DB.resolutions[resolutionKey] || DB.resolutions['1080p'];
    const preset = DB.presets[presetKey] || DB.presets['medium'];

    // Baseline reference: Intel Core i5 7400 + GTX 1060 6GB
    const refCpuScore = 57.2;
    const refGpuScore = 66.3;

    const cpuScore = calculateCpuComposite(cpu);
    const gpuScore = calculateGpuComposite(gpu);

    const cpuRatio = cpuScore / refCpuScore;
    const gpuRatio = gpuScore / refGpuScore;

    // Memory factor
    const mem = getMemoryFactors(hardware.ramSizeGB, hardware.ramChannels, hardware.ramSpeedMHz);

    // Storage factor
    const storage = getStorageAnalysis(hardware.storageType, hardware.storageCapacityGB, hardware.storageUsedGB);

    // VRAM factor
    const vram = getVramImpact(gpu.vramGB, game.vramRecGB, presetKey);

    // Weighted combined power
    const combinedPower = Math.pow(cpuRatio, game.cpuWeight) * Math.pow(gpuRatio, game.gpuWeight);

    // Resolution & Preset scaling
    const resFactor = resolution.mult;
    const presetFactor = preset.mult;

    // Final raw FPS
    const rawAvgFps = game.baseFPS * combinedPower * resFactor * presetFactor * mem.avgMult * storage.avgMult * vram.avgVramMult;
    const avgFps = Math.max(12, Math.round(rawAvgFps));

    // Calculate 1% Lows
    // Pacing depends on game engine sensitivity, RAM channel, storage degradation, and preset
    const combinedPacing = preset.low1PercentPacing *
      mem.pacingMult *
      storage.pacingMult *
      vram.pacingVramMult *
      game.pacingSensitivity;

    // Clamped realistic pacing ratio (typically between 50% and 82% of average FPS)
    const clampedPacing = Math.min(0.85, Math.max(0.38, combinedPacing * 0.85));
    const onePercentLow = Math.max(6, Math.round(avgFps * clampedPacing));

    // Calculate Bottleneck
    const bottleneck = calculateBottleneck(cpu, gpu, game, resolution);

    return {
      avgFps,
      onePercentLow,
      bottleneck,
      cpu,
      gpu,
      game,
      resolution,
      preset,
      storageAnalysis: storage,
      memoryAnalysis: mem,
      vramDeficit: gpu.vramGB < game.vramRecGB ? (game.vramRecGB - gpu.vramGB) : 0
    };
  }

  /**
   * Calculates Bottleneck percentage and dominant component
   */
  function calculateBottleneck(cpu, gpu, game, resolution) {
    const cpuPower = calculateCpuComposite(cpu) / game.cpuWeight;
    const gpuPower = (calculateGpuComposite(gpu) / (game.gpuWeight * resolution.gpuLoadFactor));

    const ratio = cpuPower / Math.max(1, gpuPower);

    let dominant = 'balanced';
    let percentage = 0;
    let description = '';
    let statusClass = 'text-emerald-400';

    if (ratio < 0.72) {
      dominant = 'cpu_bound';
      percentage = Math.min(65, Math.round((1 - ratio) * 100));
      description = `Gargalo Crítico de CPU (${percentage}%): O processador não consegue enviar instruções gráficas com velocidade suficiente para a GPU, gerando ociosidade da placa de vídeo e micro-travamentos (stutters).`;
      statusClass = 'text-rose-400';
    } else if (ratio < 0.85) {
      dominant = 'cpu_limited';
      percentage = Math.min(35, Math.round((0.85 - ratio) * 100));
      description = `Leve Limitação de CPU (${percentage}%): Comum em resoluções menores (720p/4:3) e jogos com alta taxa de quadros como CS2 e Valorant.`;
      statusClass = 'text-amber-400';
    } else if (ratio > 1.35) {
      dominant = 'gpu_bound';
      percentage = Math.min(60, Math.round(((ratio - 1.35) / ratio) * 100));
      description = `Gargalo de GPU (${percentage}%): A placa de vídeo está trabalhando a 99-100% de uso. Este é o cenário IDEAL para jogos modernos e gráficos no máximo.`;
      statusClass = 'text-cyan-400';
    } else {
      dominant = 'balanced';
      percentage = Math.round(Math.abs(1 - ratio) * 15);
      description = `Configuração Equilibrada: Excelente sinergia entre CPU e GPU para este jogo nesta resolução. Ambos os componentes operam próximos de sua capacidade ideal.`;
      statusClass = 'text-emerald-400';
    }

    return {
      ratio: Number(ratio.toFixed(2)),
      dominant,
      percentage,
      description,
      statusClass
    };
  }

  /**
   * Upgrade Simulator & ROI Engine
   * Calculates performance gain and cost-benefit ratio (FPS / R$)
   */
  function simulateUpgrade(currentHardware, upgradeType, targetId, customPriceBRL, gameId, resolutionKey, presetKey) {
    // Current baseline
    const currentResults = estimatePerformance(currentHardware, gameId, resolutionKey, presetKey);

    // Clone hardware and apply prospective upgrade
    const prospectiveHardware = Object.assign({}, currentHardware);

    let componentName = '';
    let costBRL = customPriceBRL || 0;

    if (upgradeType === 'gpu') {
      const targetGpu = getGpu(targetId);
      prospectiveHardware.gpuId = targetGpu.id;
      componentName = targetGpu.name;
      if (!customPriceBRL) costBRL = targetGpu.priceBRL;
    } else if (upgradeType === 'cpu') {
      const targetCpu = getCpu(targetId);
      prospectiveHardware.cpuId = targetCpu.id;
      componentName = targetCpu.name;
      if (!customPriceBRL) costBRL = targetCpu.priceBRL;
    } else if (upgradeType === 'ram') {
      prospectiveHardware.ramSizeGB = 16;
      prospectiveHardware.ramChannels = 2;
      prospectiveHardware.ramSpeedMHz = 3200;
      componentName = 'Kit RAM 16GB (2x8GB) Dual-Channel DDR4 3200MHz';
      if (!customPriceBRL) costBRL = 280;
    } else if (upgradeType === 'ssd') {
      prospectiveHardware.storageType = 'nvme';
      prospectiveHardware.storageCapacityGB = 1000;
      prospectiveHardware.storageUsedGB = 350; // Well below 80%
      componentName = 'SSD NVMe M.2 1TB Gen4';
      if (!customPriceBRL) costBRL = 420;
    }

    // Prospective results
    const prospectiveResults = estimatePerformance(prospectiveHardware, gameId, resolutionKey, presetKey);

    // Delta metrics
    const deltaAvgFps = prospectiveResults.avgFps - currentResults.avgFps;
    const delta1PercentLow = prospectiveResults.onePercentLow - currentResults.onePercentLow;
    const percentGainAvg = currentResults.avgFps > 0 ? ((deltaAvgFps / currentResults.avgFps) * 100) : 0;
    const percentGain1Percent = currentResults.onePercentLow > 0 ? ((delta1PercentLow / currentResults.onePercentLow) * 100) : 0;

    // ROI = FPS Gained per R$ 100 spent
    const fpsPer100Reais = costBRL > 0 ? ((deltaAvgFps / costBRL) * 100) : 0;

    let roiRating = 'balanced';
    let roiLabel = 'Custo-Benefício Equilibrado';
    let roiBadgeColor = 'badge-amber';

    if (fpsPer100Reais >= 3.0) {
      roiRating = 'excellent';
      roiLabel = 'Custo-Benefício Excelente (Alta Prioridade)';
      roiBadgeColor = 'badge-emerald';
    } else if (fpsPer100Reais < 1.2) {
      roiRating = 'diminishing';
      roiLabel = 'Retorno Decrescente / Investimento de Luxo';
      roiBadgeColor = 'badge-rose';
    }

    // Diagnostic insights
    let diagnosticAlert = '';
    if (upgradeType === 'gpu' && prospectiveResults.bottleneck.dominant === 'cpu_bound') {
      diagnosticAlert = `ATENÇÃO: A troca para esta GPU causará gargalo de CPU com seu ${currentResults.cpu.name}. Você não conseguirá extrair 100% da nova placa de vídeo até atualizar seu processador.`;
    } else if (upgradeType === 'cpu' && currentResults.gpu.tier.includes('legacy') && prospectiveResults.bottleneck.dominant === 'gpu_bound') {
      diagnosticAlert = `NOTA: Atualizar a CPU aumentará muito a estabilidade dos 1% Lows, mas a taxa máxima de FPS em jogos AAA continuará limitada pela sua ${currentResults.gpu.name}.`;
    } else if (currentHardware.ramChannels === 1 && upgradeType !== 'ram') {
      diagnosticAlert = `DICA CRUCIAL: Seu PC está configurado com Memória Single-Channel! Ativar Dual-Channel (adicionar outro pente de RAM) custa menos de R$ 150 e pode aumentar seus 1% Lows em mais de 25% imediatamente.`;
    }

    return {
      current: currentResults,
      prospective: prospectiveResults,
      upgradeType,
      componentName,
      costBRL,
      deltaAvgFps,
      delta1PercentLow,
      percentGainAvg: Number(percentGainAvg.toFixed(1)),
      percentGain1Percent: Number(percentGain1Percent.toFixed(1)),
      fpsPer100Reais: Number(fpsPer100Reais.toFixed(2)),
      roiRating,
      roiLabel,
      roiBadgeColor,
      diagnosticAlert
    };
  }

  window.RigEngine = {
    getCpu,
    getGpu,
    getGame,
    calculateCpuComposite,
    calculateGpuComposite,
    getMemoryFactors,
    getStorageAnalysis,
    estimatePerformance,
    calculateBottleneck,
    simulateUpgrade
  };

})(window);
