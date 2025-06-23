/* =================================================================
   SISTEMA DE ÁUDIO AVANÇADO
   Gerenciamento completo de áudio usando Web Audio API
   ================================================================= */

class AudioSystem {
    constructor() {
        // === PROPRIEDADES DE ÁUDIO ===
        this.audioContext = null;                  // Contexto de áudio Web Audio API
        this.isAudioEnabled = false;               // Flag de disponibilidade do áudio
    }

    /* =================================================================
       INICIALIZAÇÃO E GERENCIAMENTO DE CONTEXTO
       ================================================================= */

    /**
     * Inicializa o contexto de áudio Web Audio API
     * Lida com políticas de autoplay dos navegadores modernos
     */
    async initAudio() {
        if (!this.audioContext) {
            try {
                // Cria contexto de áudio com compatibilidade cross-browser
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                console.log('AudioContext criado:', this.audioContext.state);

                // Resume contexto se estiver suspenso (política de autoplay)
                if (this.audioContext.state === 'suspended') {
                    await this.audioContext.resume();
                    console.log('AudioContext resumido:', this.audioContext.state);
                }

                this.isAudioEnabled = true;

            } catch (error) {
                console.error('Erro ao criar AudioContext:', error);
            }
        }
    }

    /**
     * Resume o contexto de áudio quando necessário
     * Usado quando a aba volta ao foco ou após interação do usuário
     */
    async resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
                console.log('AudioContext resumido:', this.audioContext.state);
                this.isAudioEnabled = true;
            } catch (error) {
                console.error('Erro ao resumir AudioContext:', error);
            }
        }
    }

    /* =================================================================
       SISTEMA DE TESTE DE ÁUDIO
       ================================================================= */

    /**
     * Função pública para testar o sistema de áudio
     * Inicializa áudio se necessário e executa teste
     */
    async testAudio() {
        await this.initAudio();
        if (this.audioContext) {
            this.testOriginalAudio();
        }
    }

    /**
     * Executa um teste de áudio simples com feedback ao usuário
     * Gera um beep curto para verificar funcionamento
     */
    testOriginalAudio() {
        try {
            const audioContext = this.audioContext;

            // === CRIAÇÃO DOS NODOS DE ÁUDIO ===
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            // === CONEXÃO DA CADEIA DE ÁUDIO ===
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // === CONFIGURAÇÃO DO OSCILADOR ===
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);

            // === ENVELOPE DE VOLUME ===
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            // === EXECUÇÃO DO TESTE ===
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);

            console.log('Teste de áudio executado com sucesso');
            alert('Se você ouviu um "beep", o áudio está funcionando!');

        } catch (error) {
            console.error('Erro no teste de áudio:', error);
            alert('Erro no teste de áudio. Verifique o console.');
        }
    }

    /* =================================================================
       GERAÇÃO DE CLIQUES DO CONTADOR GEIGER
       ================================================================= */

    /**
     * Reproduz o som característico do contador Geiger
     * Áudio sintético realista com variações naturais
     */
    playClick() {
        // === VERIFICAÇÃO DE DISPONIBILIDADE DE ÁUDIO ===
        if (!this.audioContext) {
            console.log('AudioContext não disponível');
            return;
        }

        // === CONFIGURAÇÃO DE TIMING ===
        const now = this.audioContext.currentTime;
        const random = (min, max) => min + Math.random() * (max - min);

        // Durações variáveis para naturalidade
        const clickDuration = random(0.002, 0.004);    // 2-4ms para o clique principal
        const noiseDuration = random(0.003, 0.006);    // 3-6ms para o ruído

        try {
            // === OSCILADOR PRINCIPAL (som do clique) ===
            const mainOsc = this.audioContext.createOscillator();
            const mainGain = this.audioContext.createGain();
            const mainFilter = this.audioContext.createBiquadFilter();

            // Configuração do oscilador
            mainOsc.type = 'square';
            mainOsc.frequency.setValueAtTime(random(3500, 4200), now);
            mainOsc.frequency.exponentialRampToValueAtTime(random(2800, 3200), now + clickDuration);

            // Filtro passa-alta para som mais nítido
            mainFilter.type = 'highpass';
            mainFilter.frequency.setValueAtTime(2500, now);
            mainFilter.Q.setValueAtTime(random(15, 20), now);

            // Envelope de volume com ataque rápido e decay exponencial
            mainGain.gain.setValueAtTime(0, now);
            mainGain.gain.linearRampToValueAtTime(random(0.25, 0.35), now + 0.0005);
            mainGain.gain.exponentialRampToValueAtTime(0.001, now + clickDuration);

            // Conexão da cadeia de áudio
            mainOsc.connect(mainFilter);
            mainFilter.connect(mainGain);
            mainGain.connect(this.audioContext.destination);

            // Execução do oscilador principal
            mainOsc.start(now);
            mainOsc.stop(now + clickDuration);

            // === GERADOR DE RUÍDO (textura adicional) ===
            const bufferSize = Math.floor(noiseDuration * this.audioContext.sampleRate);
            const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const noiseData = noiseBuffer.getChannelData(0);

            // Geração de ruído branco com envelope
            for (let i = 0; i < bufferSize; i++) {
                const progress = i / bufferSize;
                // Envelope: ataque rápido, decay cúbico
                const envelope = progress < 0.1 ? progress * 10 : Math.pow(1 - ((progress - 0.1) / 0.9), 3);
                noiseData[i] = (Math.random() * 2 - 1) * envelope * random(0.15, 0.25);
            }

            // === PROCESSAMENTO DO RUÍDO ===
            const noiseSource = this.audioContext.createBufferSource();
            const noiseGain = this.audioContext.createGain();
            const noiseFilter = this.audioContext.createBiquadFilter();

            noiseSource.buffer = noiseBuffer;

            // Filtro passa-banda para o ruído
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.setValueAtTime(random(3000, 4000), now);
            noiseFilter.Q.setValueAtTime(random(8, 12), now);

            // Volume do ruído
            noiseGain.gain.setValueAtTime(random(0.8, 1.2), now);

            // Conexão da cadeia de ruído
            noiseSource.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(this.audioContext.destination);

            // Execução do ruído
            noiseSource.start(now);
            noiseSource.stop(now + noiseDuration);

        } catch (error) {
            console.error('Erro ao reproduzir clique:', error);
        }
    }
}