/**
 * RigDoctor - Hardware, Games & Drivers Database
 * Curated specs, synthetic benchmark weights, driver stability ratings,
 * and realistic Brazilian market price references (BRL - R$).
 */

(function (window) {
  'use strict';

  const DATABASE = {
    // ==========================================
    // PROCESSADORES (CPUs)
    // ==========================================
    cpus: [
      // Intel 6ª Geração (Skylake)
      { id: 'i3-6100', name: 'Intel Core i3-6100', brand: 'Intel', gen: '6ª Gen', cores: 2, threads: 4, baseClock: 3.7, singleScore: 52, multiScore: 38, tdp: 51, priceBRL: 140, tier: 'entry_legacy' },
      { id: 'i5-6400', name: 'Intel Core i5-6400', brand: 'Intel', gen: '6ª Gen', cores: 4, threads: 4, baseClock: 2.7, singleScore: 56, multiScore: 50, tdp: 65, priceBRL: 210, tier: 'entry_legacy' },
      { id: 'i7-6700k', name: 'Intel Core i7-6700K', brand: 'Intel', gen: '6ª Gen', cores: 4, threads: 8, baseClock: 4.0, singleScore: 68, multiScore: 64, tdp: 91, priceBRL: 450, tier: 'mid_legacy' },

      // Intel 7ª Geração (Kaby Lake)
      { id: 'i5-7400', name: 'Intel Core i5-7400', brand: 'Intel', gen: '7ª Gen', cores: 4, threads: 4, baseClock: 3.0, singleScore: 59, multiScore: 53, tdp: 65, priceBRL: 230, tier: 'entry_legacy' },
      { id: 'i7-7700k', name: 'Intel Core i7-7700K', brand: 'Intel', gen: '7ª Gen', cores: 4, threads: 8, baseClock: 4.2, singleScore: 72, multiScore: 68, tdp: 91, priceBRL: 520, tier: 'mid_legacy' },

      // Intel 8ª Geração (Coffee Lake)
      { id: 'i3-8100', name: 'Intel Core i3-8100', brand: 'Intel', gen: '8ª Gen', cores: 4, threads: 4, baseClock: 3.6, singleScore: 62, multiScore: 57, tdp: 65, priceBRL: 260, tier: 'entry_legacy' },
      { id: 'i5-8400', name: 'Intel Core i5-8400', brand: 'Intel', gen: '8ª Gen', cores: 6, threads: 6, baseClock: 2.8, singleScore: 67, multiScore: 70, tdp: 65, priceBRL: 380, tier: 'mid_legacy' },
      { id: 'i7-8700k', name: 'Intel Core i7-8700K', brand: 'Intel', gen: '8ª Gen', cores: 6, threads: 12, baseClock: 3.7, singleScore: 78, multiScore: 84, tdp: 95, priceBRL: 680, tier: 'mid' },

      // Intel 9ª Geração (Coffee Lake Refresh)
      { id: 'i5-9400f', name: 'Intel Core i5-9400F', brand: 'Intel', gen: '9ª Gen', cores: 6, threads: 6, baseClock: 2.9, singleScore: 70, multiScore: 73, tdp: 65, priceBRL: 390, tier: 'mid_legacy' },
      { id: 'i7-9700k', name: 'Intel Core i7-9700K', brand: 'Intel', gen: '9ª Gen', cores: 8, threads: 8, baseClock: 3.6, singleScore: 83, multiScore: 89, tdp: 95, priceBRL: 790, tier: 'mid' },
      { id: 'i9-9900k', name: 'Intel Core i9-9900K', brand: 'Intel', gen: '9ª Gen', cores: 8, threads: 16, baseClock: 3.6, singleScore: 86, multiScore: 98, tdp: 95, priceBRL: 1100, tier: 'high' },

      // Intel 10ª Geração (Comet Lake)
      { id: 'i3-10100f', name: 'Intel Core i3-10100F', brand: 'Intel', gen: '10ª Gen', cores: 4, threads: 8, baseClock: 3.6, singleScore: 73, multiScore: 72, tdp: 65, priceBRL: 340, tier: 'entry' },
      { id: 'i5-10400f', name: 'Intel Core i5-10400F', brand: 'Intel', gen: '10ª Gen', cores: 6, threads: 12, baseClock: 2.9, singleScore: 75, multiScore: 84, tdp: 65, priceBRL: 520, tier: 'mid' },
      { id: 'i7-10700k', name: 'Intel Core i7-10700K', brand: 'Intel', gen: '10ª Gen', cores: 8, threads: 16, baseClock: 3.8, singleScore: 85, multiScore: 104, tdp: 125, priceBRL: 1050, tier: 'high' },

      // Intel 11ª Geração (Rocket Lake)
      { id: 'i5-11400f', name: 'Intel Core i5-11400F', brand: 'Intel', gen: '11ª Gen', cores: 6, threads: 12, baseClock: 2.6, singleScore: 84, multiScore: 92, tdp: 65, priceBRL: 620, tier: 'mid' },
      { id: 'i7-11700k', name: 'Intel Core i7-11700K', brand: 'Intel', gen: '11ª Gen', cores: 8, threads: 16, baseClock: 3.6, singleScore: 92, multiScore: 112, tdp: 125, priceBRL: 1280, tier: 'high' },

      // Intel 12ª Geração (Alder Lake)
      { id: 'i3-12100f', name: 'Intel Core i3-12100F', brand: 'Intel', gen: '12ª Gen', cores: 4, threads: 8, baseClock: 3.3, singleScore: 95, multiScore: 88, tdp: 58, priceBRL: 490, tier: 'mid' },
      { id: 'i5-12400f', name: 'Intel Core i5-12400F', brand: 'Intel', gen: '12ª Gen', cores: 6, threads: 12, baseClock: 2.5, singleScore: 97, multiScore: 110, tdp: 65, priceBRL: 760, tier: 'mid' },
      { id: 'i5-12600k', name: 'Intel Core i5-12600K', brand: 'Intel', gen: '12ª Gen', cores: 10, threads: 16, baseClock: 3.7, singleScore: 108, multiScore: 142, tdp: 125, priceBRL: 1250, tier: 'high' },
      { id: 'i7-12700k', name: 'Intel Core i7-12700K', brand: 'Intel', gen: '12ª Gen', cores: 12, threads: 20, baseClock: 3.6, singleScore: 114, multiScore: 165, tdp: 125, priceBRL: 1650, tier: 'enthusiast' },

      // Intel 13ª e 14ª Geração (Raptor Lake)
      { id: 'i5-13400f', name: 'Intel Core i5-13400F', brand: 'Intel', gen: '13ª Gen', cores: 10, threads: 16, baseClock: 2.5, singleScore: 104, multiScore: 130, tdp: 65, priceBRL: 1150, tier: 'high' },
      { id: 'i5-13600k', name: 'Intel Core i5-13600K', brand: 'Intel', gen: '13ª Gen', cores: 14, threads: 20, baseClock: 3.5, singleScore: 122, multiScore: 178, tdp: 125, priceBRL: 1850, tier: 'enthusiast' },
      { id: 'i7-13700k', name: 'Intel Core i7-13700K', brand: 'Intel', gen: '13ª Gen', cores: 16, threads: 24, baseClock: 3.4, singleScore: 128, multiScore: 205, tdp: 125, priceBRL: 2450, tier: 'enthusiast' },
      { id: 'i5-14400f', name: 'Intel Core i5-14400F', brand: 'Intel', gen: '14ª Gen', cores: 10, threads: 16, baseClock: 2.5, singleScore: 107, multiScore: 134, tdp: 65, priceBRL: 1240, tier: 'high' },
      { id: 'i5-14600k', name: 'Intel Core i5-14600K', brand: 'Intel', gen: '14ª Gen', cores: 14, threads: 20, baseClock: 3.5, singleScore: 126, multiScore: 185, tdp: 125, priceBRL: 1980, tier: 'enthusiast' },
      { id: 'i7-14700k', name: 'Intel Core i7-14700K', brand: 'Intel', gen: '14ª Gen', cores: 20, threads: 28, baseClock: 3.4, singleScore: 132, multiScore: 230, tdp: 125, priceBRL: 2850, tier: 'enthusiast' },

      // AMD Ryzen 1000 & 2000 (Zen / Zen+)
      { id: 'r3-1200', name: 'AMD Ryzen 3 1200', brand: 'AMD', gen: 'Ryzen 1000', cores: 4, threads: 4, baseClock: 3.1, singleScore: 50, multiScore: 46, tdp: 65, priceBRL: 160, tier: 'entry_legacy' },
      { id: 'r5-1600', name: 'AMD Ryzen 5 1600', brand: 'AMD', gen: 'Ryzen 1000', cores: 6, threads: 12, baseClock: 3.2, singleScore: 55, multiScore: 68, tdp: 65, priceBRL: 240, tier: 'entry_legacy' },
      { id: 'r5-2600', name: 'AMD Ryzen 5 2600', brand: 'AMD', gen: 'Ryzen 2000', cores: 6, threads: 12, baseClock: 3.4, singleScore: 64, multiScore: 78, tdp: 65, priceBRL: 320, tier: 'mid_legacy' },
      { id: 'r7-2700x', name: 'AMD Ryzen 7 2700X', brand: 'AMD', gen: 'Ryzen 2000', cores: 8, threads: 16, baseClock: 3.7, singleScore: 70, multiScore: 94, tdp: 105, priceBRL: 480, tier: 'mid' },

      // AMD Ryzen 3000 & 4000 (Zen 2)
      { id: 'r3-3100', name: 'AMD Ryzen 3 3100', brand: 'AMD', gen: 'Ryzen 3000', cores: 4, threads: 8, baseClock: 3.6, singleScore: 74, multiScore: 74, tdp: 65, priceBRL: 320, tier: 'entry' },
      { id: 'r5-3600', name: 'AMD Ryzen 5 3600', brand: 'AMD', gen: 'Ryzen 3000', cores: 6, threads: 12, baseClock: 3.6, singleScore: 80, multiScore: 92, tdp: 65, priceBRL: 460, tier: 'mid' },
      { id: 'r7-3700x', name: 'AMD Ryzen 7 3700X', brand: 'AMD', gen: 'Ryzen 3000', cores: 8, threads: 16, baseClock: 3.6, singleScore: 84, multiScore: 114, tdp: 65, priceBRL: 750, tier: 'mid' },
      { id: 'r5-4500', name: 'AMD Ryzen 5 4500', brand: 'AMD', gen: 'Ryzen 4000', cores: 6, threads: 12, baseClock: 3.6, singleScore: 75, multiScore: 85, tdp: 65, priceBRL: 430, tier: 'entry' },

      // AMD Ryzen 5000 (Zen 3)
      { id: 'r5-5500', name: 'AMD Ryzen 5 5500', brand: 'AMD', gen: 'Ryzen 5000', cores: 6, threads: 12, baseClock: 3.6, singleScore: 86, multiScore: 99, tdp: 65, priceBRL: 540, tier: 'mid' },
      { id: 'r5-5600', name: 'AMD Ryzen 5 5600', brand: 'AMD', gen: 'Ryzen 5000', cores: 6, threads: 12, baseClock: 3.5, singleScore: 98, multiScore: 112, tdp: 65, priceBRL: 760, tier: 'mid' },
      { id: 'r7-5700x', name: 'AMD Ryzen 7 5700X', brand: 'AMD', gen: 'Ryzen 5000', cores: 8, threads: 16, baseClock: 3.4, singleScore: 100, multiScore: 136, tdp: 65, priceBRL: 1080, tier: 'high' },
      { id: 'r7-5800x3d', name: 'AMD Ryzen 7 5800X3D (3D V-Cache)', brand: 'AMD', gen: 'Ryzen 5000', cores: 8, threads: 16, baseClock: 3.4, singleScore: 124, multiScore: 145, tdp: 105, priceBRL: 1850, tier: 'enthusiast' },

      // AMD Ryzen 7000 (Zen 4)
      { id: 'r5-7600', name: 'AMD Ryzen 5 7600', brand: 'AMD', gen: 'Ryzen 7000', cores: 6, threads: 12, baseClock: 3.8, singleScore: 120, multiScore: 138, tdp: 65, priceBRL: 1280, tier: 'high' },
      { id: 'r7-7700x', name: 'AMD Ryzen 7 7700X', brand: 'AMD', gen: 'Ryzen 7000', cores: 8, threads: 16, baseClock: 4.5, singleScore: 128, multiScore: 172, tdp: 105, priceBRL: 1950, tier: 'enthusiast' },
      { id: 'r7-7800x3d', name: 'AMD Ryzen 7 7800X3D (3D V-Cache)', brand: 'AMD', gen: 'Ryzen 7000', cores: 8, threads: 16, baseClock: 4.2, singleScore: 148, multiScore: 185, tdp: 120, priceBRL: 2750, tier: 'enthusiast' }
    ],

    // ==========================================
    // PLACAS DE VÍDEO (GPUs)
    // ==========================================
    gpus: [
      // NVIDIA Pascal & GTX
      { id: 'gtx-1050-ti', name: 'NVIDIA GeForce GTX 1050 Ti 4GB', brand: 'NVIDIA', arch: 'Pascal', vramGB: 4, computeScore: 40, rasterScore: 38, tdp: 75, priceBRL: 480, tier: 'entry_legacy' },
      { id: 'gtx-1060-6gb', name: 'NVIDIA GeForce GTX 1060 6GB', brand: 'NVIDIA', arch: 'Pascal', vramGB: 6, computeScore: 68, rasterScore: 66, tdp: 120, priceBRL: 650, tier: 'entry_legend' },
      { id: 'gtx-1070', name: 'NVIDIA GeForce GTX 1070 8GB', brand: 'NVIDIA', arch: 'Pascal', vramGB: 8, computeScore: 92, rasterScore: 90, tdp: 150, priceBRL: 850, tier: 'mid_legacy' },
      { id: 'gtx-1080', name: 'NVIDIA GeForce GTX 1080 8GB', brand: 'NVIDIA', arch: 'Pascal', vramGB: 8, computeScore: 115, rasterScore: 112, tdp: 180, priceBRL: 1100, tier: 'mid_legacy' },
      { id: 'gtx-1650', name: 'NVIDIA GeForce GTX 1650 4GB', brand: 'NVIDIA', arch: 'Turing', vramGB: 4, computeScore: 52, rasterScore: 50, tdp: 75, priceBRL: 680, tier: 'entry' },
      { id: 'gtx-1660-super', name: 'NVIDIA GeForce GTX 1660 Super 6GB', brand: 'NVIDIA', arch: 'Turing', vramGB: 6, computeScore: 84, rasterScore: 82, tdp: 125, priceBRL: 980, tier: 'mid' },

      // NVIDIA RTX 20 Series
      { id: 'rtx-2060-6gb', name: 'NVIDIA GeForce RTX 2060 6GB', brand: 'NVIDIA', arch: 'Turing', vramGB: 6, computeScore: 98, rasterScore: 96, tdp: 160, priceBRL: 1200, tier: 'mid' },
      { id: 'rtx-2060-super', name: 'NVIDIA GeForce RTX 2060 Super 8GB', brand: 'NVIDIA', arch: 'Turing', vramGB: 8, computeScore: 118, rasterScore: 115, tdp: 175, priceBRL: 1380, tier: 'mid' },
      { id: 'rtx-2070', name: 'NVIDIA GeForce RTX 2070 8GB', brand: 'NVIDIA', arch: 'Turing', vramGB: 8, computeScore: 126, rasterScore: 124, tdp: 185, priceBRL: 1550, tier: 'mid' },
      { id: 'rtx-2080-ti', name: 'NVIDIA GeForce RTX 2080 Ti 11GB', brand: 'NVIDIA', arch: 'Turing', vramGB: 11, computeScore: 182, rasterScore: 180, tdp: 250, priceBRL: 2300, tier: 'high' },

      // NVIDIA RTX 30 Series
      { id: 'rtx-3050', name: 'NVIDIA GeForce RTX 3050 8GB', brand: 'NVIDIA', arch: 'Ampere', vramGB: 8, computeScore: 88, rasterScore: 85, tdp: 130, priceBRL: 1250, tier: 'mid' },
      { id: 'rtx-3060-12gb', name: 'NVIDIA GeForce RTX 3060 12GB', brand: 'NVIDIA', arch: 'Ampere', vramGB: 12, computeScore: 122, rasterScore: 120, tdp: 170, priceBRL: 1780, tier: 'mid' },
      { id: 'rtx-3060-ti', name: 'NVIDIA GeForce RTX 3060 Ti 8GB', brand: 'NVIDIA', arch: 'Ampere', vramGB: 8, computeScore: 154, rasterScore: 152, tdp: 200, priceBRL: 2150, tier: 'high' },
      { id: 'rtx-3070', name: 'NVIDIA GeForce RTX 3070 8GB', brand: 'NVIDIA', arch: 'Ampere', vramGB: 8, computeScore: 182, rasterScore: 178, tdp: 220, priceBRL: 2600, tier: 'high' },
      { id: 'rtx-3080', name: 'NVIDIA GeForce RTX 3080 10GB', brand: 'NVIDIA', arch: 'Ampere', vramGB: 10, computeScore: 245, rasterScore: 240, tdp: 320, priceBRL: 3700, tier: 'enthusiast' },

      // NVIDIA RTX 40 Series
      { id: 'rtx-4060', name: 'NVIDIA GeForce RTX 4060 8GB', brand: 'NVIDIA', arch: 'Ada Lovelace', vramGB: 8, computeScore: 148, rasterScore: 145, tdp: 115, priceBRL: 1950, tier: 'high' },
      { id: 'rtx-4060-ti', name: 'NVIDIA GeForce RTX 4060 Ti 8GB', brand: 'NVIDIA', arch: 'Ada Lovelace', vramGB: 8, computeScore: 180, rasterScore: 175, tdp: 160, priceBRL: 2550, tier: 'high' },
      { id: 'rtx-4070', name: 'NVIDIA GeForce RTX 4070 12GB', brand: 'NVIDIA', arch: 'Ada Lovelace', vramGB: 12, computeScore: 248, rasterScore: 242, tdp: 200, priceBRL: 3890, tier: 'enthusiast' },
      { id: 'rtx-4070-ti-super', name: 'NVIDIA GeForce RTX 4070 Ti Super 16GB', brand: 'NVIDIA', arch: 'Ada Lovelace', vramGB: 16, computeScore: 310, rasterScore: 305, tdp: 285, priceBRL: 5490, tier: 'enthusiast' },
      { id: 'rtx-4080', name: 'NVIDIA GeForce RTX 4080 16GB', brand: 'NVIDIA', arch: 'Ada Lovelace', vramGB: 16, computeScore: 360, rasterScore: 355, tdp: 320, priceBRL: 6890, tier: 'enthusiast' },

      // AMD Polaris
      { id: 'rx-570', name: 'AMD Radeon RX 570 4GB', brand: 'AMD', arch: 'Polaris', vramGB: 4, computeScore: 56, rasterScore: 54, tdp: 150, priceBRL: 420, tier: 'entry_legacy' },
      { id: 'rx-580-8gb', name: 'AMD Radeon RX 580 8GB', brand: 'AMD', arch: 'Polaris', vramGB: 8, computeScore: 68, rasterScore: 65, tdp: 185, priceBRL: 560, tier: 'entry_legacy' },
      { id: 'rx-590', name: 'AMD Radeon RX 590 8GB', brand: 'AMD', arch: 'Polaris', vramGB: 8, computeScore: 75, rasterScore: 73, tdp: 225, priceBRL: 640, tier: 'entry_legacy' },

      // AMD RDNA 1 & RDNA 2
      { id: 'rx-5500-xt', name: 'AMD Radeon RX 5500 XT 8GB', brand: 'AMD', arch: 'RDNA', vramGB: 8, computeScore: 67, rasterScore: 65, tdp: 130, priceBRL: 720, tier: 'entry' },
      { id: 'rx-5600-xt', name: 'AMD Radeon RX 5600 XT 6GB', brand: 'AMD', arch: 'RDNA', vramGB: 6, computeScore: 104, rasterScore: 102, tdp: 150, priceBRL: 980, tier: 'mid' },
      { id: 'rx-5700-xt', name: 'AMD Radeon RX 5700 XT 8GB', brand: 'AMD', arch: 'RDNA', vramGB: 8, computeScore: 135, rasterScore: 132, tdp: 225, priceBRL: 1250, tier: 'mid' },
      { id: 'rx-6600', name: 'AMD Radeon RX 6600 8GB', brand: 'AMD', arch: 'RDNA 2', vramGB: 8, computeScore: 125, rasterScore: 122, tdp: 132, priceBRL: 1390, tier: 'mid' },
      { id: 'rx-6650-xt', name: 'AMD Radeon RX 6650 XT 8GB', brand: 'AMD', arch: 'RDNA 2', vramGB: 8, computeScore: 145, rasterScore: 142, tdp: 180, priceBRL: 1650, tier: 'high' },
      { id: 'rx-6700-xt', name: 'AMD Radeon RX 6700 XT 12GB', brand: 'AMD', arch: 'RDNA 2', vramGB: 12, computeScore: 182, rasterScore: 178, tdp: 230, priceBRL: 2350, tier: 'high' },
      { id: 'rx-6750-xt', name: 'AMD Radeon RX 6750 XT 12GB', brand: 'AMD', arch: 'RDNA 2', vramGB: 12, computeScore: 198, rasterScore: 194, tdp: 250, priceBRL: 2590, tier: 'high' },
      { id: 'rx-6800-xt', name: 'AMD Radeon RX 6800 XT 16GB', brand: 'AMD', arch: 'RDNA 2', vramGB: 16, computeScore: 260, rasterScore: 255, tdp: 300, priceBRL: 3750, tier: 'enthusiast' },

      // AMD RDNA 3
      { id: 'rx-7600', name: 'AMD Radeon RX 7600 8GB', brand: 'AMD', arch: 'RDNA 3', vramGB: 8, computeScore: 146, rasterScore: 142, tdp: 165, priceBRL: 1780, tier: 'high' },
      { id: 'rx-7700-xt', name: 'AMD Radeon RX 7700 XT 12GB', brand: 'AMD', arch: 'RDNA 3', vramGB: 12, computeScore: 232, rasterScore: 228, tdp: 245, priceBRL: 3250, tier: 'enthusiast' },
      { id: 'rx-7800-xt', name: 'AMD Radeon RX 7800 XT 16GB', brand: 'AMD', arch: 'RDNA 3', vramGB: 16, computeScore: 278, rasterScore: 272, tdp: 263, priceBRL: 3990, tier: 'enthusiast' },

      // Intel Arc
      { id: 'arc-a580', name: 'Intel Arc A580 8GB', brand: 'Intel', arch: 'Alchemist', vramGB: 8, computeScore: 116, rasterScore: 110, tdp: 185, priceBRL: 1180, tier: 'mid' },
      { id: 'arc-a750', name: 'Intel Arc A750 8GB', brand: 'Intel', arch: 'Alchemist', vramGB: 8, computeScore: 136, rasterScore: 128, tdp: 225, priceBRL: 1420, tier: 'mid' },
      { id: 'arc-a770', name: 'Intel Arc A770 16GB', brand: 'Intel', arch: 'Alchemist', vramGB: 16, computeScore: 162, rasterScore: 150, tdp: 225, priceBRL: 2050, tier: 'high' }
    ],

    // ==========================================
    // JOGOS E ENGINES
    // ==========================================
    games: [
      {
        id: 'cs2',
        name: 'Counter-Strike 2',
        engine: 'Source 2 (Vulkan / DX11)',
        genre: 'eSports FPS',
        cpuWeight: 0.58,
        gpuWeight: 0.42,
        ramRecGB: 16,
        vramRecGB: 6,
        baseFPS: 145,
        pacingSensitivity: 0.88, // Alto impacto de 1% lows se memória for single-channel
        description: 'Exige alto IPC single-thread e largura de banda de memória para ticks e simulação de fumaça volumétrica.',
        tips: 'Para GPUs Pascal (GTX 1060), use DX11 (-dx11 nas opções de inicialização). Evite Vulkan no Windows.'
      },
      {
        id: 'valorant',
        name: 'Valorant',
        engine: 'Unreal Engine 4 (Modificada)',
        genre: 'eSports FPS',
        cpuWeight: 0.72,
        gpuWeight: 0.28,
        ramRecGB: 16,
        vramRecGB: 4,
        baseFPS: 220,
        pacingSensitivity: 0.92,
        description: 'Totalmente CPU-bound. Taxa de quadros e estabilidade de frametime dependem drasticamente da CPU e dual-channel.',
        tips: 'Mesmo com GPUs modestas, você atinge 200+ FPS se a CPU tiver IPC moderno e memória em Dual Channel.'
      },
      {
        id: 'gta5',
        name: 'Grand Theft Auto V',
        engine: 'RAGE Engine (DirectX 11)',
        genre: 'Mundo Aberto / Ação',
        cpuWeight: 0.45,
        gpuWeight: 0.55,
        ramRecGB: 16,
        vramRecGB: 4,
        baseFPS: 110,
        pacingSensitivity: 0.75,
        description: 'Mecanismo veterano com gargalo de draw calls no centro de Los Santos e grama densa consumindo muita GPU.',
        tips: 'Desative "MSAA" e deixe a "Qualidade da Grama" em Muito Alto em vez de Ultra para ganhar até 30% de FPS.'
      },
      {
        id: 'cyberpunk2077',
        name: 'Cyberpunk 2077',
        engine: 'REDengine 4 (DirectX 12 Ultimate)',
        genre: 'RPG de Ação AAA',
        cpuWeight: 0.35,
        gpuWeight: 0.65,
        ramRecGB: 16,
        vramRecGB: 8,
        baseFPS: 62,
        pacingSensitivity: 0.82,
        description: 'Extremamente pesado em GPU, com densidade de multidão escalando agressivamente com núcleos de CPU.',
        tips: 'Habilite AMD FSR ou NVIDIA DLSS no modo Qualidade/Equilibrado para recuperar 40% de fluidez.'
      },
      {
        id: 're4remake',
        name: 'Resident Evil 4 Remake',
        engine: 'RE Engine (DirectX 12)',
        genre: 'Survival Horror AAA',
        cpuWeight: 0.32,
        gpuWeight: 0.68,
        ramRecGB: 16,
        vramRecGB: 8,
        baseFPS: 78,
        pacingSensitivity: 0.85,
        description: 'Otimização excelente, mas consumo voraz de VRAM. Se passar do limite da placa, causa stuttering imediato.',
        tips: 'Mantenha o uso de textura abaixo de 6GB em placas de 8GB para evitar estouro da VRAM.'
      },
      {
        id: 'minecraft_vanilla',
        name: 'Minecraft (Vanilla + OptiFine/Sodium)',
        engine: 'Java Virtual Machine (OpenGL)',
        genre: 'Sandbox Survival',
        cpuWeight: 0.75,
        gpuWeight: 0.25,
        ramRecGB: 16,
        vramRecGB: 4,
        baseFPS: 180,
        pacingSensitivity: 0.78,
        description: 'Gargalo quase exclusivo em um único núcleo de CPU e alocação de memória RAM na JVM.',
        tips: 'Use Sodium + Iris em vez de OptiFine moderno para duplicar a performance de renderização de chunks.'
      },
      {
        id: 'minecraft_shaders',
        name: 'Minecraft (Com Shaders Complementary / BSL)',
        engine: 'Java + Raymarching Shaders (OpenGL)',
        genre: 'Sandbox com Shaders',
        cpuWeight: 0.38,
        gpuWeight: 0.62,
        ramRecGB: 16,
        vramRecGB: 6,
        baseFPS: 72,
        pacingSensitivity: 0.80,
        description: 'Iluminação global, reflexos na água e sombras dinâmicas transformam o jogo em um dos mais pesados para GPU.',
        tips: 'Reduza a resolução das sombras de 2048 para 1024 no menu do Shader para dobrar a taxa de quadros.'
      },
      {
        id: 'project_zomboid',
        name: 'Project Zomboid (Horda & Cidades)',
        engine: 'Java / LWJGL (OpenGL)',
        genre: 'Survival Isométrico',
        cpuWeight: 0.70,
        gpuWeight: 0.30,
        ramRecGB: 16,
        vramRecGB: 4,
        baseFPS: 95,
        pacingSensitivity: 0.90,
        description: 'Simulação pesada de física, pathfinding de milhares de zumbis simultâneos e streaming contínuo de mapa.',
        tips: 'Instalar em SSD é crucial para evitar engasgos ao dirigir em alta velocidade nas rodovias de Kentucky.'
      }
    ],

    // ==========================================
    // MULTIPLICADORES DE PRESET & RESOLUÇÃO
    // ==========================================
    presets: {
      low: { label: 'Baixo / Competitivo', mult: 1.35, low1PercentPacing: 0.88 },
      medium: { label: 'Médio / Otimizado', mult: 1.00, low1PercentPacing: 0.82 },
      high: { label: 'Alto / Gráficos Ricos', mult: 0.78, low1PercentPacing: 0.76 },
      ultra: { label: 'Ultra / Máximo', mult: 0.62, low1PercentPacing: 0.70 }
    },

    resolutions: {
      '1080p': { label: '1080p Full HD (1920x1080)', width: 1920, height: 1080, mult: 1.0, gpuLoadFactor: 1.0 },
      '720p': { label: '720p HD (1280x720)', width: 1280, height: 720, mult: 1.48, gpuLoadFactor: 0.65 },
      '1280x960': { label: '4:3 Competitivo Esticado (1280x960)', width: 1280, height: 960, mult: 1.38, gpuLoadFactor: 0.72 }
    },

    // ==========================================
    // BANCO DE DADOS DE ESTABILIDADE DE DRIVERS
    // ==========================================
    driverStability: [
      {
        gpuArch: 'Pascal (GTX 1060 / 1070 / 1080 / 1050Ti)',
        recommendedDriver: 'NVIDIA Game Ready 537.58 WHQL (ou 552.22)',
        releaseDate: 'Setembro / 2023',
        status: 'golden',
        criticalAlert: 'ALERTA CS2 / SOURCE 2: Drivers da série 545.xx até 55x.xx introduziram latência DPC elevada, compilação instável de shaders e micro-travamentos na arquitetura Pascal. O driver 537.58 é o Golden Standard para Pascal no CS2.',
        recommendedApi: 'DirectX 11 (Adicionar -dx11 nas opções da Steam)',
        notes: 'No Painel de Controle NVIDIA: Modo de Gerenciamento de Energia -> Preferência por Desempenho Máximo.'
      },
      {
        gpuArch: 'Polaris (RX 570 / 580 / 590)',
        recommendedDriver: 'AMD Adrenalin 23.11.1 WHQL (ou Drivers Amernime Zone)',
        releaseDate: 'Novembro / 2023',
        status: 'golden',
        criticalAlert: 'Drivers Adrenalin 24.x podem gerar o erro "Driver Timeout" no CS2 e Valorant em placas Polaris antigas devido à descontinuação de otimizações ativas para GCN 4.',
        recommendedApi: 'DirectX 11 / Vulkan',
        notes: 'Desative o recurso Radeon Enhanced Sync e Anti-Lag no software Adrenalin para evitar oscilações de frametime.'
      },
      {
        gpuArch: 'Ampere & Ada Lovelace (RTX 30 / RTX 40)',
        recommendedDriver: 'NVIDIA Game Ready 560.81+ WHQL',
        releaseDate: '2024 Recente',
        status: 'stable',
        criticalAlert: 'Certifique-se de habilitar o "Resizable BAR" (ReBAR) na placa-mãe (BIOS) e no driver para ganho de até 8% em 1% Lows no CS2 e Cyberpunk.',
        recommendedApi: 'DirectX 12 / DirectX 11 / Vulkan',
        notes: 'Drivers recentes trazem estabilidade total e otimização para NVIDIA Reflex Low Latency.'
      },
      {
        gpuArch: 'RDNA 2 & RDNA 3 (RX 6000 / RX 7000)',
        recommendedDriver: 'AMD Adrenalin 24.7.1 ou 24.8.1 WHQL',
        releaseDate: '2024 Recente',
        status: 'stable',
        criticalAlert: 'Após instalar drivers novos, limpe o cache de shaders do Adrenalin (Configurações -> Gráficos -> Redefinir Cache de Shaders) para curar engasgos nas primeiras partidas.',
        recommendedApi: 'DirectX 12 / Vulkan / DX11',
        notes: 'Habilite AMD Smart Access Memory (SAM) para máxima eficiência de memória de vídeo.'
      },
      {
        gpuArch: 'Intel Arc (A580 / A750 / A770)',
        recommendedDriver: 'Intel Graphics Driver 31.0.101.5590+ WHQL',
        releaseDate: '2024 Recente',
        status: 'stable',
        criticalAlert: 'OBRIGATÓRIO: O uso de ReBAR (Resizable BAR) é mandatório para Intel Arc. Sem ReBAR habilitado, a perda de FPS chega a 40% e ocorrem travamentos contínuos.',
        recommendedApi: 'DirectX 12 / Vulkan (evite DX9 nativo sem emulação DXVK)',
        notes: 'A Intel otimizou massivamente o driver de CS2 e DirectX 11 ao longo de 2024.'
      }
    ],

    // ==========================================
    // PROTOCOLO DDU & REGISTRO WINDOWS
    // ==========================================
    dduProtocol: [
      {
        step: 1,
        title: 'Preparação & Download Offline',
        desc: 'Baixe o instalador limpo do driver recomendado (Golden Driver) e o utilitário DDU (Display Driver Uninstaller do site oficial Wagnardsoft). Salve ambos na Área de Trabalho.',
        id: 'chk_ddu_prep'
      },
      {
        step: 2,
        title: 'Desconexão Total da Internet',
        desc: 'Desconecte o cabo de rede Ethernet ou desligue o Wi-Fi. Isso impede terminantemente que o Windows Update baixe um driver genérico incompatível antes de você instalar o driver estável.',
        id: 'chk_ddu_offline'
      },
      {
        step: 3,
        title: 'Reiniciar no Modo de Segurança do Windows',
        desc: 'Pressione a tecla Shift enquanto clica em "Reiniciar" no Menu Iniciar. Vá em "Solução de Problemas" -> "Opções Avançadas" -> "Configurações de Inicialização" -> Reiniciar e aperte 4 (Modo de Segurança).',
        id: 'chk_ddu_safemode'
      },
      {
        step: 4,
        title: 'Execução do DDU',
        desc: 'No Modo de Segurança, abra o Display Driver Uninstaller. Selecione "GPU" e sua fabricante (NVIDIA/AMD/Intel). Clique em "Limpar e Reiniciar". Aguarde a máquina reiniciar normalmente.',
        id: 'chk_ddu_clean'
      },
      {
        step: 5,
        title: 'Instalação do Golden Driver & Reconexão',
        desc: 'Com a internet ainda desligada, abra o instalador do driver baixado no Passo 1. Selecione "Instalação Limpa / Personalizada". Após concluir e reiniciar o PC, reconecte a internet.',
        id: 'chk_ddu_install'
      }
    ],

    windowsUpdateGuides: {
      gpedit: {
        title: 'Método 1: Editor de Política de Grupo Local (Windows Pro/Enterprise)',
        steps: [
          'Pressione Windows + R, digite "gpedit.msc" e pressione Enter.',
          'Navegue até: Configuração do Computador > Modelos Administrativos > Componentes do Windows > Windows Update > Gerenciar atualizações oferecidas pelo Windows Update.',
          'Dê um duplo clique em "Não incluir drivers com atualizações do Windows".',
          'Marque a opção "Habilitado", clique em Aplicar e dê OK.'
        ]
      },
      registry: {
        title: 'Método 2: Registro do Windows (Windows Home ou Pro)',
        steps: [
          'Pressione Windows + R, digite "regedit" e pressione Enter.',
          'Navegue até a chave: HKEY_LOCAL_MACHINE\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate',
          'Se a pasta WindowsUpdate não existir, crie-a com o botão direito -> Novo -> Chave.',
          'Dentro dela, clique com botão direito -> Novo -> Valor DWORD (32 bits).',
          'Nomeie o valor exatamente como: ExcludeWUDriversInQualityUpdate',
          'Dê dois cliques nele e defina os dados do valor como "1" (Hexadecimal). Reinicie o PC.'
        ]
      },
      deviceSettings: {
        title: 'Método 3: Configuração de Instalação do Dispositivo',
        steps: [
          'Pressione Windows + R, digite "sysdm.cpl" e pressione Enter.',
          'Vá para a aba "Hardware" e clique no botão "Configurações de Instalação do Dispositivo".',
          'Selecione a opção "Não (seu dispositivo pode não funcionar como esperado)" e clique em Salvar Alterações.'
        ]
      }
    }
  };

  window.RigDatabase = DATABASE;

})(window);
