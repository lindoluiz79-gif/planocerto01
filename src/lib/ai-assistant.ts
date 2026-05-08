import { PLANS } from "@/data/plans";
import { FAQ } from "@/data/faq";
import { GLOSSARY } from "@/data/glossary";

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
};

export type ChatContext = {
  budget?: number;
  needsDependents?: boolean;
  needsDental?: boolean;
  usageFrequency?: 'low' | 'medium' | 'high';
  location?: string;
};

// Simulador de IA (em produção, usar OpenAI API)
export class AIAssistant {
  private context: ChatContext = {};
  private conversationHistory: Message[] = [];

  constructor() {
    this.addMessage('assistant', 
      'Olá! 👋 Sou a assistente virtual do PlanoCerto. Estou aqui para ajudar você a encontrar o plano de saúde ideal! Como posso ajudar?',
      [
        'Quero encontrar um plano',
        'Tenho dúvidas sobre planos',
        'Quanto vou economizar?',
        'O que é carência?'
      ]
    );
  }

  private addMessage(role: 'user' | 'assistant', content: string, suggestions?: string[]) {
    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role,
      content,
      timestamp: new Date().toISOString(),
      suggestions
    };
    this.conversationHistory.push(message);
    return message;
  }

  async sendMessage(userMessage: string): Promise<Message> {
    // Adiciona mensagem do usuário
    this.addMessage('user', userMessage);

    // Processa a mensagem e gera resposta
    const response = this.generateResponse(userMessage.toLowerCase());
    
    // Simula delay de digitação
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return this.addMessage('assistant', response.text, response.suggestions);
  }

  private generateResponse(message: string): { text: string; suggestions?: string[] } {
    // Saudações
    if (message.match(/oi|olá|ola|hey|bom dia|boa tarde|boa noite/)) {
      return {
        text: 'Olá! 😊 Como posso ajudar você hoje?',
        suggestions: [
          'Buscar planos',
          'Tirar dúvidas',
          'Comparar planos',
          'Calcular economia'
        ]
      };
    }

    // Buscar plano / Recomendação
    if (message.match(/buscar|encontrar|procurar|quero|preciso.*plano|recomendar|melhor plano/)) {
      if (!this.context.budget) {
        return {
          text: 'Ótimo! Vou te ajudar a encontrar o plano ideal. Qual é o seu orçamento mensal? 💰',
          suggestions: ['Até R$ 200', 'R$ 200-300', 'R$ 300-400', 'Acima de R$ 400']
        };
      }
      
      const plans = this.recommendPlans();
      return {
        text: `Baseado no seu perfil, encontrei ${plans.length} planos:\n\n${plans.map(p => 
          `• ${p.operadora} - ${p.nome}\n  R$ ${p.precoMensal}/mês - ⭐ ${p.rating}`
        ).join('\n\n')}\n\nQuer ver mais detalhes de algum?`,
        suggestions: plans.slice(0, 3).map(p => p.operadora)
      };
    }

    // Orçamento
    if (message.match(/\d+/) && message.match(/real|reais|r\$|ate|até/)) {
      const budget = parseInt(message.match(/\d+/)?.[0] || '0');
      this.context.budget = budget;
      
      return {
        text: `Perfeito! Orçamento de até R$ ${budget}. Você precisa incluir dependentes (cônjuge, filhos)?`,
        suggestions: ['Sim, preciso', 'Não, só para mim']
      };
    }

    // Dependentes
    if (message.match(/dependente|familia|cônjuge|filho|esposa|marido/)) {
      this.context.needsDependents = message.match(/sim|preciso|quero|tenho/) !== null;
      
      return {
        text: 'Entendi! E você precisa de cobertura odontológica? 🦷',
        suggestions: ['Sim, preciso', 'Não preciso']
      };
    }

    // Odonto
    if (message.match(/odonto|dente|dentista/)) {
      this.context.needsDental = message.match(/sim|preciso|quero/) !== null;
      
      const plans = this.recommendPlans();
      return {
        text: `Pronto! Encontrei ${plans.length} planos perfeitos para você:\n\n${plans.slice(0, 3).map(p => 
          `✨ ${p.operadora} - ${p.nome}\n💰 R$ ${p.precoMensal}/mês\n⭐ ${p.rating} (${p.reviewCount} avaliações)\n${p.cobreOdonto ? '🦷 Inclui odonto' : ''}\n${p.cobreDependentes ? '👨‍👩‍👧 Aceita dependentes' : ''}`
        ).join('\n\n')}\n\nQuer ver mais detalhes ou comparar?`,
        suggestions: ['Ver detalhes', 'Comparar planos', 'Buscar outros']
      };
    }

    // Dúvidas sobre termos
    if (message.match(/o que é|que é|significa|explica|duvida sobre/)) {
      const term = this.findTerm(message);
      if (term) {
        return {
          text: `📖 **${term.term}**\n\n${term.definition}\n\nTem mais alguma dúvida?`,
          suggestions: ['Outra dúvida', 'Buscar planos', 'Calcular economia']
        };
      }
    }

    // Carência
    if (message.match(/carência|carencia|espera|quanto tempo/)) {
      return {
        text: '⏰ **Carência** é o tempo de espera entre contratar o plano e usar certos serviços:\n\n• Urgência: 24 horas\n• Consultas: 30 dias\n• Exames: 30 dias\n• Cirurgias: 180 dias\n• Partos: 300 dias\n\nQuer saber mais alguma coisa?',
        suggestions: ['O que é coparticipação?', 'Como cancelar?', 'Buscar planos']
      };
    }

    // Coparticipação
    if (message.match(/coparticipa|copay|pagar.*consulta/)) {
      return {
        text: '💳 **Coparticipação** é quando você:\n\n✅ Paga mensalidade MENOR (30-40% mais barata)\n❌ Mas paga R$ 20-50 a cada consulta/exame\n\n💡 Vale a pena se você usa POUCO o plano!\n\nQuer simular se compensa para você?',
        suggestions: ['Sim, simular', 'Não, buscar planos', 'Outra dúvida']
      };
    }

    // Economia
    if (message.match(/economizar|economia|quanto.*economizar|mais barato/)) {
      return {
        text: '💰 Quer calcular quanto pode economizar?\n\nMe diga:\n1. Quanto você paga hoje no seu plano?\n2. Ou quer que eu mostre os planos mais baratos?',
        suggestions: ['Pago R$ 350/mês', 'Mostrar mais baratos', 'Não tenho plano']
      };
    }

    // Comparação
    if (message.match(/comparar|diferença|melhor.*entre|versus|vs/)) {
      const topPlans = PLANS.sort((a, b) => b.rating - a.rating).slice(0, 3);
      return {
        text: `Vou comparar os 3 planos mais bem avaliados:\n\n${topPlans.map(p => 
          `${p.operadora} - R$ ${p.precoMensal}/mês\n⭐ ${p.rating} | ${p.cobreOdonto ? '🦷' : '❌'} Odonto | ${p.hospitaisGrandePorte ? '🏥' : '❌'} Premium`
        ).join('\n\n')}\n\nQuer comparação detalhada?`,
        suggestions: ['Sim, detalhes', 'Ver outros planos', 'Buscar por preço']
      };
    }

    // MEI
    if (message.match(/mei|microempreendedor|autonomo|autônomo/)) {
      return {
        text: '👔 **Planos para MEI**\n\nComo MEI, você pode contratar planos EMPRESARIAIS, que são mais baratos!\n\n✅ Precisa do CNPJ MEI ativo\n✅ Preços até 40% menores\n✅ Pode incluir dependentes\n\nQuer ver os planos recomendados para MEI?',
        suggestions: ['Sim, mostrar', 'Como me tornar MEI?', 'Buscar planos']
      };
    }

    // Preço específico
    if (message.match(/unimed|hapvida|amil|bradesco|sulamerica|notredame/i)) {
      const operadora = message.match(/unimed|hapvida|amil|bradesco|sulamerica|notredame/i)?.[0];
      const plan = PLANS.find(p => p.operadora.toLowerCase().includes(operadora?.toLowerCase() || ''));
      
      if (plan) {
        return {
          text: `📋 **${plan.operadora} - ${plan.nome}**\n\n💰 R$ ${plan.precoMensal}/mês\n⭐ ${plan.rating} (${plan.reviewCount} avaliações)\n\n**Coberturas:**\n${plan.coberturas.map(c => `✓ ${c}`).join('\n')}\n\n${plan.cobreOdonto ? '🦷 Inclui odonto\n' : ''}${plan.cobreDependentes ? '👨‍👩‍👧 Aceita dependentes\n' : ''}${plan.hospitaisGrandePorte ? '🏥 Hospitais premium\n' : ''}\n\nQuer contratar ou comparar com outros?`,
          suggestions: ['Ver detalhes', 'Comparar', 'Buscar outros']
        };
      }
    }

    // Agradecimento
    if (message.match(/obrigad|valeu|thanks|brigad/)) {
      return {
        text: 'Por nada! 😊 Estou aqui para ajudar sempre que precisar. Mais alguma dúvida?',
        suggestions: ['Buscar planos', 'Tirar dúvida', 'Não, obrigado']
      };
    }

    // Despedida
    if (message.match(/tchau|adeus|até|bye|falou/)) {
      return {
        text: 'Até logo! 👋 Volte sempre que precisar de ajuda com planos de saúde!',
        suggestions: []
      };
    }

    // Resposta padrão
    return {
      text: 'Desculpe, não entendi muito bem. 😅 Posso ajudar você com:\n\n• Encontrar o plano ideal\n• Tirar dúvidas sobre planos\n• Comparar operadoras\n• Calcular economia\n\nO que você gostaria?',
      suggestions: [
        'Buscar planos',
        'Tirar dúvidas',
        'Comparar planos',
        'Falar com humano'
      ]
    };
  }

  private recommendPlans() {
    let plans = [...PLANS];

    if (this.context.budget) {
      plans = plans.filter(p => p.precoMensal <= this.context.budget!);
    }

    if (this.context.needsDependents) {
      plans = plans.filter(p => p.cobreDependentes);
    }

    if (this.context.needsDental) {
      plans = plans.filter(p => p.cobreOdonto);
    }

    return plans.sort((a, b) => b.rating - a.rating).slice(0, 5);
  }

  private findTerm(message: string) {
    return GLOSSARY.find(g => 
      message.toLowerCase().includes(g.term.toLowerCase())
    );
  }

  getHistory() {
    return this.conversationHistory;
  }

  clearHistory() {
    this.conversationHistory = [];
    this.context = {};
  }
}
