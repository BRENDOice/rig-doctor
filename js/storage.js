/**
 * RigDoctor - LocalStorage Manager & Export/Import Handler
 * 100% Client-Side, Zero-Telemetry, Strict Schema Validation & Integrity Checksums.
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'rigdoctor_profile_v1';
  const SEC = window.RigSecurity;

  const DEFAULT_PROFILE = {
    schemaVersion: 1,
    appName: 'rig-doctor',
    profileName: 'Meu Setup Gamer',
    exportedAt: new Date().toISOString(),
    hardware: {
      cpuId: 'i5-7400',
      gpuId: 'gtx-1060-6gb',
      ramSizeGB: 8,
      ramChannels: 1, // Single-channel demonstrando perda de 1% lows
      ramSpeedMHz: 2400,
      storageType: 'sata_ssd',
      storageCapacityGB: 480,
      storageUsedGB: 410 // > 80% para demonstrar o alerta de degradação de SSD
    },
    preferences: {
      activeGameId: 'cs2',
      activeResolution: '1080p',
      activePreset: 'medium',
      targetUpgradeType: 'gpu',
      targetUpgradeId: 'rx-6600',
      targetUpgradeBudgetBRL: 1390
    },
    driverChecklist: []
  };

  /**
   * Loads profile from localStorage with schema validation
   * @returns {object}
   */
  function loadProfile() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
      }

      const parsed = JSON.parse(raw);
      const validation = SEC.validateProfileSchema(parsed);

      if (validation.valid && validation.sanitizedProfile) {
        return validation.sanitizedProfile;
      } else {
        console.warn('[RigDoctor Security] Perfil inválido detectado no localStorage. Usando padrão seguro:', validation.error);
        return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
      }
    } catch (e) {
      console.error('[RigDoctor Security] Falha ao carregar localStorage:', e);
      return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
    }
  }

  /**
   * Saves profile to localStorage with debounce and integrity seal
   * @param {object} profile 
   * @returns {Promise<boolean>}
   */
  async function saveProfile(profile) {
    try {
      const validation = SEC.validateProfileSchema(profile);
      if (!validation.valid || !validation.sanitizedProfile) {
        throw new Error('Falha na validação de schema ao salvar: ' + validation.error);
      }

      const safe = validation.sanitizedProfile;
      safe.updatedAt = new Date().toISOString();
      safe.checksum = await SEC.computeChecksum({
        hardware: safe.hardware,
        preferences: safe.preferences,
        driverChecklist: safe.driverChecklist
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
      return true;
    } catch (e) {
      console.error('[RigDoctor Storage] Erro ao salvar perfil:', e);
      return false;
    }
  }

  /**
   * Exports profile as a formatted, downloadable JSON file
   * @param {object} profile 
   */
  async function exportProfileToFile(profile) {
    try {
      const validation = SEC.validateProfileSchema(profile);
      if (!validation.valid || !validation.sanitizedProfile) {
        throw new Error('Perfil inválido para exportação');
      }

      const safe = validation.sanitizedProfile;
      safe.exportedAt = new Date().toISOString();
      safe.integrityHash = await SEC.computeChecksum({
        hardware: safe.hardware,
        preferences: safe.preferences,
        driverChecklist: safe.driverChecklist
      });

      const jsonStr = JSON.stringify(safe, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `rigdoctor_backup_${timestamp}.json`;

      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = url;
      downloadAnchor.download = filename;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();

      setTimeout(() => {
        document.body.removeChild(downloadAnchor);
        URL.revokeObjectURL(url);
      }, 200);

      return { success: true, filename };
    } catch (e) {
      console.error('[RigDoctor Export] Falha ao exportar:', e);
      return { success: false, error: e.message };
    }
  }

  /**
   * Imports and verifies a JSON backup file
   * @param {File} file 
   * @returns {Promise<{ success: boolean, profile?: object, error?: string }>}
   */
  function importProfileFromFile(file) {
    return new Promise((resolve) => {
      if (!file) {
        return resolve({ success: false, error: 'Nenhum arquivo selecionado.' });
      }

      // Check file size (max 500 KB to avoid memory injection)
      if (file.size > 500 * 1024) {
        return resolve({ success: false, error: 'O arquivo excede o limite de segurança de 500 KB.' });
      }

      const reader = new FileReader();

      reader.onload = async function (event) {
        try {
          const rawText = event.target.result;
          let parsed;
          try {
            parsed = JSON.parse(rawText);
          } catch (jsonErr) {
            return resolve({ success: false, error: 'Arquivo corrompido: Formato JSON inválido.' });
          }

          const validation = SEC.validateProfileSchema(parsed);
          if (!validation.valid || !validation.sanitizedProfile) {
            return resolve({
              success: false,
              error: 'Schema inválido: ' + (validation.error || 'Campos obrigatórios ausentes.')
            });
          }

          const safeProfile = validation.sanitizedProfile;

          // Optional verification of checksum if present
          if (parsed.integrityHash) {
            const calculated = await SEC.computeChecksum({
              hardware: safeProfile.hardware,
              preferences: safeProfile.preferences,
              driverChecklist: safeProfile.driverChecklist
            });
            if (calculated !== parsed.integrityHash) {
              console.warn('[RigDoctor Integrity] Hash de integridade modificado, mas schema válido.');
            }
          }

          await saveProfile(safeProfile);
          resolve({ success: true, profile: safeProfile });
        } catch (e) {
          resolve({ success: false, error: 'Erro inesperado na leitura: ' + e.message });
        }
      };

      reader.onerror = function () {
        resolve({ success: false, error: 'Falha na leitura do arquivo pelo navegador.' });
      };

      reader.readAsText(file);
    });
  }

  /**
   * Resets profile back to pristine defaults
   */
  async function resetProfile() {
    const fresh = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
    await saveProfile(fresh);
    return fresh;
  }

  /**
   * Completely purges all data from localStorage (Zero-telemetry privacy guarantee)
   */
  function clearAllData() {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  }

  window.RigStorage = {
    STORAGE_KEY,
    DEFAULT_PROFILE,
    loadProfile,
    saveProfile,
    exportProfileToFile,
    importProfileFromFile,
    resetProfile,
    clearAllData
  };

})(window);
