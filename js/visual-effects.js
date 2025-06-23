/* =================================================================
   SISTEMA DE EFEITOS VISUAIS AVANÇADOS
   Gerenciamento de partículas, glitch, animações e efeitos CRT
   ================================================================= */

class VisualEffects {
    constructor() {
        // === PROPRIEDADES DE EFEITOS VISUAIS ===
        this.particleCounter = 0;                  // Contador de partículas ativas
        this.glitchTimer = null;                   // Timer para efeitos de glitch

        // === INICIALIZAÇÃO DE ELEMENTOS DOM ===
        this.initializeElements();
        this.startAmbientEffects();
    }

    /* =================================================================
       INICIALIZAÇÃO DE ELEMENTOS DOM
       ================================================================= */

    /**
     * Captura referências para elementos de efeitos visuais
     */
    initializeElements() {
        this.glitchOverlay = document.getElementById('glitchOverlay');
        this.screenDistortion = document.getElementById('screenDistortion');
        this.radiationBar = document.getElementById('radiationBar');
    }

    /* =================================================================
       SISTEMA DE EFEITOS AMBIENTAIS
       ================================================================= */

    /**
     * Inicia efeitos ambientais que rodam continuamente em background
     * Inclui glitches periódicos e ajustes de ruído visual
     */
    startAmbientEffects() {
        // === SISTEMA DE GLITCH PERIÓDICO ===
        const scheduleGlitch = () => {
            // Intervalo aleatório entre 5-20 segundos para naturalidade
            const delay = 5000 + Math.random() * 15000;

            setTimeout(() => {
                // Glitch só ocorre em níveis de radiação moderados/altos
                if (this.getCurrentRadiationLevel() > 200) {
                    this.triggerGlitch();
                }
                // Reagenda o próximo glitch recursivamente
                scheduleGlitch();
            }, delay);
        };
        scheduleGlitch();

        // === SISTEMA DE RUÍDO VISUAL DINÂMICO ===
        // Atualiza a opacidade do ruído baseado no nível de radiação
        setInterval(() => {
            const radiationLevel = this.getCurrentRadiationLevel();
            if (radiationLevel > 100) {
                const intensity = Math.min(radiationLevel / 1000, 1);
                document.body.style.setProperty('--noise-opacity', intensity * 0.1);
            }
        }, 1000);
    }

    /**
     * Obtém o nível atual de radiação (método auxiliar)
     */
    getCurrentRadiationLevel() {
        const slider = document.getElementById('radiationSlider');
        return slider ? parseInt(slider.value) : 0;
    }

    /* =================================================================
       SISTEMA DE EFEITOS DE GLITCH
       ================================================================= */

    /**
     * Dispara efeitos de glitch baseados no nível de radiação
     * Intensidade e frequência aumentam com níveis mais altos
     */
    triggerGlitch() {
        const radiationLevel = this.getCurrentRadiationLevel();

        // Só executa se radiação estiver acima do threshold mínimo
        if (radiationLevel < 200) return;

        // Calcula intensidade baseada no nível atual (0-1)
        const glitchIntensity = Math.min(radiationLevel / 1000, 1);

        // === EFEITO DE GLITCH BÁSICO ===
        this.glitchOverlay.classList.add('active');
        setTimeout(() => {
            this.glitchOverlay.classList.remove('active');
        }, 100);

        // === EFEITO DE DISTORÇÃO DE TELA (níveis muito altos) ===
        // 30% de chance em níveis críticos (>600 μSv/h)
        if (radiationLevel > 600 && Math.random() < 0.3) {
            this.screenDistortion.classList.add('active');
            setTimeout(() => {
                this.screenDistortion.classList.remove('active');
            }, 200);
        }
    }

    /* =================================================================
       SISTEMA DE PARTÍCULAS VISUAIS
       ================================================================= */

    /**
     * Cria múltiplas partículas baseadas no nível de radiação
     * Quantidade e timing variam com a intensidade
     */
    createAdvancedParticles() {
        const radiationLevel = this.getCurrentRadiationLevel();

        // Só cria partículas em níveis moderados ou altos
        if (radiationLevel < 100) return;

        // Calcula quantidade de partículas (máximo 5 por vez)
        const particleCount = Math.min(Math.floor(radiationLevel / 200), 5);

        // Cria partículas com delay escalonado para efeito visual
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                this.createSingleParticle();
            }, i * 100);
        }
    }

    /**
     * Cria uma única partícula com propriedades baseadas na radiação
     * Tamanho, cor e movimento variam com o nível atual
     */
    createSingleParticle() {
        const radiationLevel = this.getCurrentRadiationLevel();

        // === CRIAÇÃO DO ELEMENTO PARTÍCULA ===
        const particle = document.createElement('div');
        particle.className = 'radiation-particle';

        // === DETERMINAÇÃO DO TAMANHO BASEADO NA RADIAÇÃO ===
        let sizeClass = 'small';

        if (radiationLevel > 500) {
            // Níveis altos: mix de tamanhos com probabilidades
            const rand = Math.random();
            if (rand < 0.3) sizeClass = 'large';
            else if (rand < 0.6) sizeClass = 'medium';
        } else if (radiationLevel > 300) {
            // Níveis médios: 50% chance de partículas médias
            if (Math.random() < 0.5) sizeClass = 'medium';
        }

        particle.classList.add(sizeClass);

        // === CONFIGURAÇÃO DE MOVIMENTO E POSICIONAMENTO ===
        const startX = Math.random() * 100;           // Posição horizontal aleatória
        const drift = (Math.random() - 0.5) * 50;     // Deriva lateral durante subida
        const driftEnd = drift * 1.5;                 // Deriva final amplificada
        const duration = 2 + Math.random() * 2;       // Duração da animação (2-4s)

        // === APLICAÇÃO DE PROPRIEDADES CSS CUSTOMIZADAS ===
        particle.style.left = startX + '%';
        particle.style.bottom = '10px';
        particle.style.setProperty('--drift', drift + 'px');
        particle.style.setProperty('--drift-end', driftEnd + 'px');
        particle.style.setProperty('--duration', duration + 's');

        // === INSERÇÃO NO DOM ===
        document.querySelector('.container').appendChild(particle);

        // === ATIVAÇÃO DA ANIMAÇÃO ===
        // Pequeno delay para garantir que o CSS seja aplicado
        setTimeout(() => {
            particle.classList.add('active');
        }, 10);

        // === LIMPEZA AUTOMÁTICA ===
        // Remove a partícula após a animação completar
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, duration * 1000 + 100);
    }

    /* =================================================================
       EFEITOS VISUAIS SINCRONIZADOS
       ================================================================= */

    /**
     * Executa múltiplos efeitos visuais sincronizados com cada clique
     * Intensidade dos efeitos escala com o nível de radiação
     */
    showAdvancedClickEffect() {
        const radiationLevel = this.getCurrentRadiationLevel();

        // === EFEITO DE TREMOR DE TELA (níveis extremos) ===
        if (radiationLevel > 700) {
            document.body.classList.add('screen-shake');
            setTimeout(() => {
                document.body.classList.remove('screen-shake');
            }, 150);
        }

        // === GLITCH OCASIONAL (níveis altos) ===
        // 10% de chance em níveis críticos
        if (radiationLevel > 600 && Math.random() < 0.1) {
            this.triggerGlitch();
        }

        // === CRIAÇÃO DE PARTÍCULAS ===
        // 30% de chance de gerar partículas a cada clique
        if (Math.random() < 0.3) {
            this.createAdvancedParticles();
        }

        // === ANIMAÇÃO DA BARRA DE RADIAÇÃO ===
        this.radiationBar.classList.add('animated');
        setTimeout(() => {
            this.radiationBar.classList.remove('animated');
        }, 300);
    }

    /* =================================================================
       SISTEMA DE ANIMAÇÃO DE NÚMEROS
       ================================================================= */

    /**
     * Anima mudanças significativas nos valores numéricos
     * Cria efeito de "digitação" com números aleatórios antes do valor final
     * @param {HTMLElement} element - Elemento a ser animado
     * @param {string} newValue - Novo valor a ser exibido
     */
    animateNumberChange(element, newValue) {
        // Adiciona classe para estilização durante animação
        element.classList.add('updating');

        // === CONFIGURAÇÃO DA ANIMAÇÃO ===
        const oldValue = element.textContent;
        let currentStep = 0;
        const steps = 5;                    // Número de passos da animação
        const stepDelay = 30;               // Delay entre cada passo (ms)

        // === FUNÇÃO RECURSIVA DE ANIMAÇÃO ===
        const updateStep = () => {
            if (currentStep < steps) {
                // Mostra número aleatório durante a transição
                const randomNum = Math.floor(Math.random() * 1000);
                element.textContent = `${randomNum} μSv/h`;
                currentStep++;
                setTimeout(updateStep, stepDelay);
            } else {
                // Mostra o valor final e remove classe de animação
                element.textContent = newValue;
                setTimeout(() => {
                    element.classList.remove('updating');
                }, 100);
            }
        };

        // Inicia a animação com pequeno delay
        setTimeout(updateStep, 50);
    }
}