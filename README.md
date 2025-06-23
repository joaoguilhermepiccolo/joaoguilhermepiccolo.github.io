# ☢️ Simulador de Contador Geiger

Simulador interativo e realista de contador Geiger com efeitos visuais e sonoros avançados. Perfeito para pregar peças, simular ambientes ou itens radioativos para fins educacionais, ou até criar atmosfera em RPGs de terror/ficção científica.

## 🔗 **Link da Página Hosteada**

A página esta sendo hosteada no seguinte endereço devido a limitações de edição do classroom:
<https://joaoguilhermepiccolo.github.io/>

O repositório utilizado é idêntico a este, mas foi criado pela minha própria conta educacional de maneira pública:
<https://github.com/joaoguilhermepiccolo/joaoguilhermepiccolo.github.io>

## 🎛️ **Como Usar**

### **Controles Principais**
1. **Slider de Radiação**: Arraste para ajustar o nível (0-1000 μSv/h)
2. **▶️ INICIAR**: Ativa o contador e inicia os cliques sonoros
3. **⏹️ PARAR**: Interrompe a simulação mantendo o nível atual
4. **🔄 RESETAR**: Para o dispositivo e zera todos os valores
5. **🔊 TESTE**: Reproduz um beep para verificar se o áudio está funcionando

### **Indicadores Visuais**
- **Barra de Radiação**: Preenche gradualmente conforme o nível aumenta
- **Display Digital**: Mostra o valor exato em μSv/h com animações
- **Status de Zona**: Indica se está em área segura, alerta ou perigo
- **Status do Dispositivo**: Mostra se está ligado (🟢) ou desligado (🔴)

## 📊 **Níveis de Radiação**

| Faixa | Status | Comportamento |
|-------|--------|---------------|
| 0-199 μSv/h | ✅ Zona Segura | Cliques espaçados e inofensivos |
| 200-699 μSv/h | ⚠️ Zona de Alerta | Cliques frequentes |
| 700+ μSv/h | ☢️ Perigo Extremo | Cliques e efeitos intensos |

## 🛠️ **Tecnologias**

- HTML5, CSS3, JavaScript ES6+
- Web Audio API para síntese de som
- Vibration API para feedback tátil

## 🧬 **Curiosidade sobre Radiação**

**Microsievert por hora (μSv/h)** mede a taxa de radiação ionizante que afeta o corpo humano. Para comparação: a radiação natural do ambiente é cerca de 0,1-0,2 μSv/h, um voo comercial expõe você a 2-5 μSv/h, enquanto um raio-X dental gera cerca de 5-10 μSv/h. Níveis acima de 1.000 μSv/h já requerem evacuação imediata, pois a radiação ionizante danifica o DNA das células, podendo causar desde mutações genéticas até morte celular.
