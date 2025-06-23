/* =================================================================
   SIMULADOR DE CONTADOR GEIGER - CONTROLADOR PRINCIPAL
   Orquestra todos os módulos e gerencia a interface do usuário
   ================================================================= */

class AdvancedGeigerCounter {
    constructor() {
        // === INICIALIZAÇÃO DOS MÓDULOS ===
        this.audioSystem = new AudioSystem();
        this.visualEffects = new VisualEffects();
        this.deviceController = new DeviceController();

        // === INICIALIZAÇÃO DO SISTEMA ===
        this.initializeElements();
        this.setupEventListeners();
        this.updateDisplay();
    }

    /* =================================================================
       INICIALIZAÇÃO DE ELEMENTOS DOM
       ================================================================= */

    /**
     * Captura e armazena referências para todos os elementos DOM necessários
     * Centraliza o acesso aos elementos para melhor manutenibilidade
     */
    initializeElements() {
        // === CONTROLES DE ENTRADA ===
        this.radiationSlider = document.getElementById('radiationSlider');

        // === ELEMENTOS DE DISPLAY ===
        this.radiationValue = document.getElementById('radiationValue');
        this.radiationBar = document.getElementById('radiationBar');
        this.statusText = document.getElementById('statusText');
        this.deviceStatus = document.getElementById('deviceStatus');
        this.sliderValue = document.getElementById('sliderValue');

        // === BOTÕES DE CONTROLE ===
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.testBtn = document.getElementById('testBtn');
    }

    /* =================================================================
       CONFIGURAÇÃO DE EVENT LISTENERS
       ================================================================= */

    /**
     * Configura todos os event listeners necessários para interação
     * Inclui controles de slider, botões e eventos do sistema
     */
    setupEventListeners() {
        // === EVENTOS DO SLIDER DE RADIAÇÃO ===
        // Evento 'input' para atualização em tempo real durante o arraste
        this.radiationSlider.addEventListener('input', (e) => {
            this.deviceController.setRadiationLevel(e.target.value);
            this.updateDisplay();
        });

        // Evento 'change' para atualização final após soltar o slider
        this.radiationSlider.addEventListener('change', (e) => {
            this.deviceController.setRadiationLevel(e.target.value);
            this.updateDisplay();
        });

        // === EVENTOS DOS BOTÕES DE CONTROLE ===
        this.startBtn.addEventListener('click', () => this.start());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.testBtn.addEventListener('click', () => this.testAudio());

        // === EVENTOS DE SISTEMA ===
        // Gerencia a retomada do contexto de áudio quando a aba volta ao foco
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.audioSystem.resumeAudioContext();
            }
        });
    }

    /* =================================================================
       ORQUESTRAÇÃO DE CLIQUES
       ================================================================= */

    /**
     * Coordena todos os efeitos de um clique do contador
     * Combina áudio, vibração e efeitos visuais
     */
    executeClick() {
        // === EFEITOS VISUAIS ===
        this.visualEffects.showAdvancedClickEffect();

        // === VIBRAÇÃO TÁTIL ===
        this.deviceController.vibrateDevice();

        // === ÁUDIO ===
        this.audioSystem.playClick();
    }

    /* =================================================================
       SISTEMA DE ATUALIZAÇÃO DE DISPLAY
       ================================================================= */

    /**
     * Atualiza todos os elementos visuais baseados no nível atual de radiação
     * Gerencia cores, textos, barras de progresso e classes CSS
     */
    updateDisplay() {
        // === CAPTURA E PROCESSAMENTO DO VALOR ATUAL ===
        const currentValue = parseInt(this.radiationSlider.value);
        this.deviceController.setRadiationLevel(currentValue);
        const radiationLevel = this.deviceController.getRadiationLevel();

        // === DETECÇÃO DE MUDANÇAS SIGNIFICATIVAS ===
        // Anima apenas mudanças maiores que 50 μSv/h para evitar spam
        const lastLevel = this.deviceController.getLastRadiationLevel();
        const significantChange = Math.abs(radiationLevel - lastLevel) > 50;

        // === ATUALIZAÇÃO DO VALOR PRINCIPAL ===
        if (significantChange) {
            this.visualEffects.animateNumberChange(this.radiationValue, `${radiationLevel} μSv/h`);
        } else {
            this.radiationValue.textContent = `${radiationLevel} μSv/h`;
        }

        // === ATUALIZAÇÃO DO VALOR DO SLIDER ===
        this.sliderValue.textContent = `${radiationLevel} μSv/h`;

        // === ATUALIZAÇÃO DA BARRA DE PROGRESSO ===
        const percentage = (radiationLevel / 1000) * 100;
        this.radiationBar.style.width = `${percentage}%`;

        // === APLICAÇÃO DE CLASSES DE ESTADO VISUAL ===
        this.radiationValue.className = 'radiation-level';

        if (radiationLevel >= 800) {
            this.radiationValue.classList.add('extreme');
        } else if (radiationLevel >= 500) {
            this.radiationValue.classList.add('high');
        } else if (radiationLevel >= 200) {
            this.radiationValue.classList.add('medium');
        } else {
            this.radiationValue.classList.add('low');
        }

        // === DETERMINAÇÃO DO STATUS DE SEGURANÇA ===
        let statusClass, statusText;

        if (radiationLevel >= 700) {
            statusClass = 'danger-zone';
            statusText = '☢️ PERIGO EXTREMO!';
        } else if (radiationLevel >= 300) {
            statusClass = 'warning-zone';
            statusText = '⚠️ ZONA DE ALERTA';
        } else {
            statusClass = 'safe-zone';
            statusText = '✅ ZONA SEGURA';
        }

        // === APLICAÇÃO DO STATUS ===
        this.statusText.textContent = statusText;
        this.statusText.className = `status ${statusClass}`;
    }

    /* =================================================================
       CONTROLES PRINCIPAIS DA INTERFACE
       ================================================================= */

    /**
     * Inicia a operação do contador Geiger
     * Inicializa áudio se necessário e começa o loop de cliques
     */
    async start() {
        // Previne múltiplas inicializações
        if (this.deviceController.getIsRunning()) return;

        // === INICIALIZAÇÃO DE ÁUDIO ===
        if (!this.audioSystem.isAudioEnabled) {
            await this.audioSystem.initAudio();
        }

        // === INÍCIO DA OPERAÇÃO ===
        if (this.deviceController.start()) {
            this.deviceStatus.textContent = '🟢 Ligado';

            // === INÍCIO DO LOOP PRINCIPAL ===
            this.deviceController.startContinuousClickLoop(() => {
                this.executeClick();
            });
        }
    }

    /**
     * Para a operação do contador Geiger
     */
    stop() {
        this.deviceController.stop();
        this.deviceStatus.textContent = '🔴 Desligado';
    }

    /**
     * Reseta o dispositivo para estado inicial
     * Para operação e zera todos os valores
     */
    reset() {
        this.deviceController.reset();
        this.radiationSlider.value = 0;
        this.updateDisplay();
        this.deviceStatus.textContent = '🔴 Desligado';
    }

    /**
     * Testa o sistema de áudio
     */
    async testAudio() {
        await this.audioSystem.testAudio();
    }
}

/* =================================================================
   INICIALIZAÇÃO DA APLICAÇÃO
   ================================================================= */

/**
 * Inicializa o contador Geiger quando o DOM estiver pronto
 * Garante que todos os elementos estejam disponíveis
 */
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedGeigerCounter();
});

/* =================================================================
   PREVENÇÃO DE ZOOM EM DISPOSITIVOS MÓVEIS
   ================================================================= */

/**
 * Previne gestos de zoom em dispositivos móveis
 * Mantém a interface estável durante uso
 */
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

/**
 * Previne zoom por duplo toque em dispositivos móveis
 * Implementa debounce de 300ms entre toques
 */
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);