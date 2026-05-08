export type FAQItem = {
  question: string;
  answer: string;
};

export const FAQ: FAQItem[] = [
  {
    question: "Como funciona o plano de saúde para MEI?",
    answer: "Como MEI, você pode contratar planos empresariais, que geralmente têm preços melhores que os individuais. Você precisa apresentar seu CNPJ e comprovante de MEI ativo. Alguns planos permitem incluir dependentes (cônjuge e filhos)."
  },
  {
    question: "Posso incluir minha família no plano?",
    answer: "Sim! A maioria dos planos permite incluir dependentes legais: cônjuge ou companheiro(a) e filhos até 21 anos (ou 24 anos se estiverem estudando). Cada dependente tem um custo adicional na mensalidade."
  },
  {
    question: "O que é período de carência?",
    answer: "É o tempo de espera entre a contratação e o uso de certos serviços. Urgências têm 24h de carência, consultas e exames simples 30 dias, cirurgias 180 dias e partos 300 dias. Doenças preexistentes podem ter carências maiores."
  },
  {
    question: "Como funciona a coparticipação?",
    answer: "Em planos com coparticipação, você paga uma mensalidade menor, mas contribui com um valor cada vez que usa o plano (consultas, exames, etc). É ideal para quem usa pouco o plano. Há um limite máximo de coparticipação por ano."
  },
  {
    question: "Posso usar o plano em qualquer cidade?",
    answer: "Depende da abrangência do plano. Planos nacionais cobrem todo o Brasil, regionais cobrem alguns estados, e municipais apenas uma cidade. Verifique a abrangência antes de contratar, especialmente se você viaja muito."
  },
  {
    question: "Como cancelar um plano de saúde?",
    answer: "Você pode cancelar a qualquer momento, sem multa. Basta solicitar por escrito (carta, e-mail ou protocolo no site) com 30 dias de antecedência. A operadora deve confirmar o cancelamento em até 10 dias úteis."
  },
  {
    question: "O que acontece se eu atrasar o pagamento?",
    answer: "Após 60 dias de atraso, o plano pode ser suspenso. Você tem até 60 dias para regularizar sem perder o plano. Após 120 dias, o contrato pode ser cancelado e você perde as carências cumpridas."
  },
  {
    question: "Plano de saúde cobre tratamento dentário?",
    answer: "Planos médicos não cobrem tratamentos odontológicos. Para isso, você precisa contratar um plano odontológico separado. Alguns planos oferecem pacotes combinados (médico + odonto) com desconto."
  },
  {
    question: "Posso trocar de plano sem cumprir carência novamente?",
    answer: "Sim, através da portabilidade. Se você já tem um plano há pelo menos 2 anos (ou 3 anos para doenças preexistentes), pode trocar para outro plano sem cumprir novas carências, desde que seja de categoria igual ou inferior."
  },
  {
    question: "O PlanoCerto cobra alguma taxa?",
    answer: "Não! O PlanoCerto é 100% gratuito. Somos um comparador independente. Quando você decide contratar, é redirecionado para o site oficial da operadora. Não intermediamos pagamentos nem cobramos comissões."
  }
];
