# 🩺 RigDoctor - Hardware Diagnostics & DevSecOps Suite

[![DevSecOps](https://img.shields.io/badge/Security-DevSecOps%20Audited-emerald?style=for-the-badge&logo=shield)](SECURITY.md)
[![Privacy](https://img.shields.io/badge/Privacy-Zero%20Telemetry%20(100%25%20Local)-blue?style=for-the-badge&logo=tor-browser)](SECURITY.md)
[![Offline-First](https://img.shields.io/badge/Architecture-Offline--First-cyan?style=for-the-badge&logo=html5)](index.html)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

> **RigDoctor** é uma aplicação web autônoma e suite DevSecOps de diagnóstico de hardware, monitoramento de estabilidade de drivers de vídeo, estimador de taxa de quadros (FPS Médio e 1% Lows) e simulador de upgrades com cálculo de retorno sobre investimento em Reais (R$).
> 
> Projetado com foco em **soluções para problemas reais de eSports e hardware veterano** (como travamento de drivers na GTX 1060 para conter crashes no CS2 / Source 2, gargalos de memória Single-Channel e degradação de SSDs acima de 80% de ocupação).

---

## 🏛️ Arquitetura do Sistema & Fluxo de Dados (Zero-Telemetry)

```
+-----------------------------------------------------------------------------------------+
|                                    NAVEGADOR DO USUÁRIO                                 |
|                                                                                         |
|  [ index.html ] <---> [ Content Security Policy (connect-src 'none') ]                  |
|        |                                                                                |
|        v                                                                                |
|  [ js/security.js ] ---> Sanitização DOM (Anti-XSS) & Validação de Schema JSON          |
|        |                                                                                |
|        +---------------------------------------------------+                            |
|        |                                                   |                            |
|        v                                                   v                            |
|  [ js/storage.js ]                                  [ js/engine.js ]                    |
|        | (Leitura / Escrita Segura)                        |                            |
|        v                                                   | (Cálculo Físico & Pacing)  |
|  ( localStorage )                                          v                            |
|    - Perfil do Rig                                  [ js/database.js ]                  |
|    - Checklist DDU                                    - CPUs (Intel 6-14th / Ryzen)     |
|    - Preferências                                     - GPUs (GTX/RTX/RX/Arc)           |
|                                                       - Jogos & Engines                 |
|                                                       - Drivers Estáveis                |
|                                                                                         |
|  [ REDE EXTERNA / INTERNET ] <--- BLOQUEADO TERMINANTEMENTE POR CSP (0 bytes trafegados)|
+-----------------------------------------------------------------------------------------+
```

---

## ✨ Funcionalidades Principais

### 1. Profiler de Hardware & Monitor de Degradação de SSD
- **Seletores Abrangentes:**
  - **Processadores:** Intel Core 6ª a 14ª Geração (Skylake a Raptor Lake Refresh) e AMD Ryzen 1000 a 7000 (Zen 1 a Zen 4, incluindo lendas com 3D V-Cache como o 5800X3D e 7800X3D).
  - **Placas de Vídeo:** Séries NVIDIA GTX 10xx, GTX 16xx, RTX 20/30/40, AMD Radeon RX 500 (Polaris), RX 5000/6000/7000 e Intel Arc.
  - **Memória RAM:** Configuração de capacidade (8 a 64GB), frequência (2133 a 6000MHz) e número de canais (**Single-Channel vs Dual-Channel**).
  - **Armazenamento:** HD Mecânico, SSD SATA III e SSD NVMe M.2 Gen3/Gen4.
- **Alerta Físico de Degradação de SSD (> 80%):**
  - Monitor em tempo real que calcula a taxa de ocupação.
  - Alerta visual e técnico quando a unidade ultrapassa 80% de capacidade, explicando a perda do **SLC Cache**, aumento da amplificação de gravação (*Write Amplification*) e pausas de *Garbage Collection* que causam engasgos nos jogos.

### 2. Guardião de Drivers & Estabilidade em eSports
- **Mapeamento de "Golden Drivers":**
  - Foco especial na lendária **GTX 1060 6GB e arquitetura Pascal**: Alerta técnico sobre os problemas introduzidos nas versões de driver 545.xx a 55x.xx (latência DPC, shaders instáveis na engine Source 2 do CS2) e recomendação oficial da versão estável **NVIDIA GeForce Game Ready 537.58 WHQL** com `-dx11`.
  - Recomendações equivalentes para AMD Polaris (Adrenalin 23.11.1 para evitar *driver timeouts*), RTX 30/40 com Resizable BAR e Intel Arc.
- **Protocolo DDU Interativo (Display Driver Uninstaller):**
  - Checklist em 5 passos com persistência no navegador:
    1. Download offline do driver e DDU.
    2. Desconexão física da internet.
    3. Inicialização no Modo de Segurança do Windows.
    4. Limpeza completa dos resquícios e reinicialização.
    5. Instalação limpa com internet ainda desligada.
- **Guia de Bloqueio do Windows Update:**
  - Instruções e comandos prontos para impedir que o Windows sobrescreva drivers gráficos estáveis por atualizações automáticas via Registro ou Editor de Política de Grupo (`gpedit.msc`).

### 3. Estimador de Desempenho Multi-Jogos (Frametime & 1% Lows)
- **Catálogo de Jogos Otimizado:**
  - *Counter-Strike 2 (CS2)*: Source 2, alta demanda de single-thread e fumaça volumétrica.
  - *Valorant*: Unreal Engine 4 modificada, sensível a IPC de CPU e Dual Channel.
  - *Grand Theft Auto V*: RAGE Engine, gargalo de draw calls no centro urbano.
  - *Cyberpunk 2077*: REDengine 4, pesado em rasterização e threads de CPU.
  - *Resident Evil 4 Remake*: RE Engine, consumo elevado de VRAM.
  - *Minecraft (Vanilla vs Shaders Complementary/BSL)*: Comparativo de Java CPU vs Shaders de alta intensidade gráfica.
  - *Project Zomboid*: Simulação intensiva de hordas e streaming de chunks em SSD.
- **Métricas Reais:**
  - **FPS Médio Estimado.**
  - **1% Low FPS (Quadros Mínimos):** Avalia estabilidade e consistência de frametime.
  - **Espectro Visual de Gargalo (Bottleneck Meter):** Identifica se o setup é *CPU Bound*, *GPU Bound* (ideal para jogos AAA) ou *Equilibrado*.

### 4. Simulador Interativo de Upgrade & Calculadora de ROI (BRL)
- Comparativo dinâmico **Antes vs Depois** ao testar a troca de CPU, GPU, kit de memória ou SSD.
- Cálculo de Retorno sobre Investimento:
  $$\text{ROI} = \left(\frac{\Delta\text{FPS}}{\text{Custo em R\$}}\right) \times 100$$
- Classificação de custo-benefício adaptada ao mercado brasileiro:
  - **Excelente Custo-Benefício:** Ganho superior a 3.0 FPS por R$ 100 gastos.
  - **Equilibrado:** Entre 1.2 e 3.0 FPS por R$ 100 gastos.
  - **Retorno Decrescente / Investimento de Luxo:** Abaixo de 1.2 FPS por R$ 100.
- Veredito inteligente com detecção de desbalanceamento (ex.: avisando se a nova GPU sofrerá gargalo severo com o processador atual).

### 5. Persistência, Backup e Conformidade DevSecOps
- **Zero Telemetria:** Nenhuma chamada de rede saintes (`connect-src 'none'`).
- **Sanitização Rigorosa:** Módulo `security.js` com prevenção contra injeção DOM XSS.
- **Backup Criptografado & Validado:** Exportação e importação de perfis JSON com assinatura e verificação de integridade via **SHA-256**.

---

## 🛠️ Comandos de Bloqueio do Windows Update

Para impedir que o Windows substitua seu driver estável da GPU:

### Opção 1: Via Linha de Comando (Prompt como Administrador)
```cmd
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate" /v ExcludeWUDriversInQualityUpdate /t REG_DWORD /d 1 /f
```

### Opção 2: Via Editor de Política de Grupo (`gpedit.msc`)
1. Pressione `Win + R`, digite `gpedit.msc` e pressione Enter.
2. Navegue até:
   `Configuração do Computador > Modelos Administrativos > Componentes do Windows > Windows Update > Gerenciar atualizações oferecidas`
3. Habilite a diretiva: **"Não incluir drivers com atualizações do Windows"**.

---

## 🚀 Como Executar o Projeto

Como o RigDoctor é uma aplicação **Offline-First**, não há necessidade de instalação de dependências ou build steps:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/rig-doctor.git
   cd rig-doctor
   ```

2. **Abra diretamente no navegador:**
   - Dê um duplo clique no arquivo `index.html`, ou:
   - Abra via qualquer servidor local estático simples (ex.: `python -m http.server 8080`).

---

## 📁 Estrutura de Diretórios

```
rig-doctor/
├── index.html                 # Interface responsiva Dark Theme com CSP estrito e sanitização
├── css/
│   └── styles.css             # Design system completo, componentes dark mode e animações
├── js/
│   ├── app.js                 # Controller principal, renderização de abas e gerenciamento reativo
│   ├── database.js            # Catálogo de hardware (CPUs, GPUs, Jogos, Presets, Golden Drivers)
│   ├── engine.js              # Algoritmos de cálculo de FPS, 1% Low, Bottleneck % e ROI
│   ├── storage.js             # Gerenciador de localStorage com validação de schema e Export/Import
│   └── security.js            # Módulo de sanitização DOM (Anti-XSS) e integridade criptográfica
├── .github/
│   └── workflows/
│       ├── deploy.yml         # GitHub Actions para publicação contínua no GitHub Pages
│       └── security-audit.yml # Pipeline DevSecOps de auditoria estática e verificação de CSP
├── SKILLS.md                  # Harness de IA do Especialista em Hardware & DevSecOps
├── SECURITY.md                # Política de segurança, modelo de privacidade e reporte seguro
└── README.md                  # Documentação completa, diagramas ASCII e guia técnico
```

---

## 📄 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo de licença para mais detalhes.
