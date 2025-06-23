/* =================================================================
   CONTROLADOR PRINCIPAL DO DISPOSITIVO
   Gerencia estado, timing, vibração e cálculos de radiação
   ================================================================= */

class DeviceController {
    constructor() {
        // === PROPRIEDADES DE ESTADO PRINCIPAL ===
        this.isRunning = false;                    // Estado de operação do dispositivo
        this.radiationLevel = 0;                   // Nível atual de radiação (μSv/h)
        this.lastRadiationLevel = 0;               // Último nível para comparação de mudanças

        // === PROPRIEDADES DE TIMING E ANIMAÇÃO ===
        this.clickInterval = null;                 // Timer para intervalos de clique
        this.animationFrame = null;                // ID do requestAnimationFrame
        this.nextClickTime = 0;                    // Timestamp do próximo clique programado

        // === DETECÇÃO DE CAPACIDADES DO DISPOSITIVO ===
        this.hasVibrationApi = this.hasVibrationCapability();
    }

    /* =================================================================
       DETECÇÃO DE CAPACIDADES DO DISPOSITIVO
       ================================================================= */

    /**
     * Verifica se o dispositivo suporta API de vibração
     * @returns {boolean} True se vibração estiver disponível
     */
    hasVibrationCapability() {
        return 'vibrate' in navigator && typeof navigator.vibrate === 'function';
    }

    /* =================================================================
       SISTEMA DE VIBRAÇÃO TÁTIL
       ================================================================= */

    /**
     * Controla vibração do dispositivo baseada no nível de radiação
     * Padrões diferentes para cada faixa de intensidade
     */
    vibrateDevice() {
        // Verifica disponibilidade da API antes de usar
        if (!this.hasVibrationApi) {
            return;
        }

        // === PADRÕES DE VIBRAÇÃO POR NÍVEL DE RADIAÇÃO ===
        let vibrationPattern;

        if (this.radiationLevel < 100) {
            // Nível baixo: vibração curta e suave
            vibrationPattern = [20];
        } else if (this.radiationLevel < 200) {
            // Nível baixo-médio: vibração um pouco mais longa
            vibrationPattern = [30];
        } else if (this.radiationLevel < 400) {
            // Nível médio: padrão triplo
            vibrationPattern = [40, 50, 40];
        } else if (this.radiationLevel < 600) {
            // Nível médio-alto: padrão mais intenso
            vibrationPattern = [60, 30, 60];
        } else if (this.radiationLevel < 800) {
            // Nível alto: padrão complexo
            vibrationPattern = [80, 40, 80, 40, 80];
        } else {
            // Nível extremo: vibração mais intensa e longa
            vibrationPattern = [100, 50, 100, 50, 150];
        }

        // === EXECUÇÃO SEGURA DA VIBRAÇÃO ===
        try {
            navigator.vibrate(vibrationPattern);
        } catch (error) {
            console.log('Vibração não suportada:', error);
        }
    }

    /* =================================================================
       SISTEMA DE CÁLCULO DE INTERVALOS
       ================================================================= */

    /**
     * Calcula o intervalo entre cliques baseado no nível de radiação
     * Simula comportamento realista de contador Geiger
     * @returns {number|null} Intervalo em millisegundos ou null se radiação = 0
     */
    getClickInterval() {
        if (this.radiationLevel <= 0) return null;

        let baseInterval;

        // === MAPEAMENTO DE RADIAÇÃO PARA INTERVALOS ===
        if (this.radiationLevel < 50) {
            // Radiação muito baixa: cliques espaçados (1.5-3.5s)
            baseInterval = 1500 + Math.random() * 2000;
        } else if (this.radiationLevel < 100) {
            // Radiação baixa: cliques moderados (0.8-2.0s)
            baseInterval = 800 + Math.random() * 1200;
        } else if (this.radiationLevel < 200) {
            // Radiação baixa-média: cliques mais frequentes (0.4-1.0s)
            baseInterval = 400 + Math.random() * 600;
        } else if (this.radiationLevel < 300) {
            // Radiação média: cliques regulares (0.2-0.6s)
            baseInterval = 200 + Math.random() * 400;
        } else if (this.radiationLevel < 500) {
            // Radiação média-alta: cliques rápidos (0.1-0.3s)
            baseInterval = 100 + Math.random() * 200;
        } else if (this.radiationLevel < 700) {
            // Radiação alta: cliques muito rápidos (50-150ms)
            baseInterval = 50 + Math.random() * 100;
        } else if (this.radiationLevel < 900) {
            // Radiação muito alta: cliques extremamente rápidos (25-75ms)
            baseInterval = 25 + Math.random() * 50;
        } else {
            // Radiação extrema: cliques quase contínuos (10-35ms)
            baseInterval = 10 + Math.random() * 25;
        }

        // Garante intervalo mínimo para evitar sobrecarga
        return Math.max(baseInterval, 20);
    }

    /* =================================================================
       CONTROLES PRINCIPAIS DO DISPOSITIVO
       ================================================================= */

    /**
     * Inicia a operação do contador Geiger
     */
    start() {
        // Previne múltiplas inicializações
        if (this.isRunning) return;

        this.isRunning = true;
        return true; // Indica sucesso
    }

    /**
     * Para a operação do contador Geiger
     * Limpa todos os timers e reseta estados
     */
    stop() {
        this.isRunning = false;
        this.nextClickTime = 0;

        // === LIMPEZA DE TIMERS ===
        if (this.clickInterval) {
            clearTimeout(this.clickInterval);
            this.clickInterval = null;
        }

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    /**
     * Reseta o dispositivo para estado inicial
     * Para operação e zera todos os valores
     */
    reset() {
        this.stop();
        this.radiationLevel = 0;
        this.lastRadiationLevel = 0;
    }

    /* =================================================================
       LOOP PRINCIPAL DE EXECUÇÃO
       ================================================================= */

    /**
     * Loop principal de execução usando requestAnimationFrame
     * Mais eficiente que setInterval para timing preciso
     */
    startContinuousClickLoop(onClickCallback) {
        // Verifica se ainda deve estar rodando
        if (!this.isRunning) return;

        const now = performance.now();

        // === INICIALIZAÇÃO DO TIMING ===
        if (this.nextClickTime === 0) {
            this.nextClickTime = now;
        }

        // === VERIFICAÇÃO DE TEMPO PARA PRÓXIMO CLIQUE ===
        if (now >= this.nextClickTime) {
            if (this.radiationLevel > 0) {
                // Executa callback de clique e agenda o próximo
                if (onClickCallback) onClickCallback();
                const interval = this.getClickInterval();
                this.nextClickTime = now + interval;
            } else {
                // Se radiação = 0, verifica novamente em 100ms
                this.nextClickTime = now + 100;
            }
        }

        // === CONTINUAÇÃO DO LOOP ===
        this.animationFrame = requestAnimationFrame(() =>
            this.startContinuousClickLoop(onClickCallback)
        );
    }

    /* =================================================================
       GETTERS E SETTERS
       ================================================================= */

    /**
     * Define o nível de radiação atual
     */
    setRadiationLevel(level) {
        this.lastRadiationLevel = this.radiationLevel;
        this.radiationLevel = parseInt(level);
    }

    /**
     * Obtém o nível de radiação atual
     */
    getRadiationLevel() {
        return this.radiationLevel;
    }

    /**
     * Obtém o último nível de radiação
     */
    getLastRadiationLevel() {
        return this.lastRadiationLevel;
    }

    /**
     * Verifica se o dispositivo está em execução
     */
    getIsRunning() {
        return this.isRunning;
    }
}