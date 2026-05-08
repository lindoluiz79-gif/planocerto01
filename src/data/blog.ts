export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  readTime: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "como-escolher-plano-mei",
    title: "Como escolher o melhor plano de saúde para MEI",
    excerpt: "Guia completo para microempreendedores individuais escolherem o plano ideal.",
    content: `
# Como escolher o melhor plano de saúde para MEI

Como MEI, você tem acesso a planos empresariais, que geralmente oferecem melhores preços que os individuais. Mas como escolher?

## 1. Avalie seu perfil de uso

- Você vai ao médico com frequência?
- Tem alguma condição crônica?
- Precisa incluir dependentes?

## 2. Compare preços e coberturas

Não escolha apenas pelo preço mais baixo. Verifique:
- Rede credenciada na sua região
- Tipos de acomodação (enfermaria ou apartamento)
- Cobertura de exames e procedimentos

## 3. Atenção à carência

Planos têm períodos de carência. Urgências: 24h, consultas: 30 dias, cirurgias: 180 dias.

## 4. Verifique a reputação

Consulte o índice de reclamações na ANS e avaliações de outros usuários.
    `,
    date: "2026-05-01",
    category: "Guias",
    readTime: "5 min"
  },
  {
    id: "diferenca-coparticipacao",
    title: "Plano com ou sem coparticipação: qual escolher?",
    excerpt: "Entenda as diferenças e descubra qual modelo é melhor para você.",
    content: `
# Plano com ou sem coparticipação: qual escolher?

A coparticipação é um modelo onde você paga menos na mensalidade, mas contribui a cada uso.

## Como funciona

**Sem coparticipação:**
- Mensalidade mais alta
- Sem custos extras ao usar
- Ideal para quem usa muito o plano

**Com coparticipação:**
- Mensalidade mais baixa (30-40% menor)
- Paga R$ 20-50 por consulta/exame
- Ideal para quem usa pouco

## Faça as contas

Use nosso simulador para calcular qual opção é mais econômica para seu perfil de uso.
    `,
    date: "2026-04-28",
    category: "Dicas",
    readTime: "4 min"
  },
  {
    id: "direitos-plano-saude",
    title: "10 direitos que todo usuário de plano de saúde deve conhecer",
    excerpt: "Conheça seus direitos e saiba quando a operadora não pode negar atendimento.",
    content: `
# 10 direitos que todo usuário de plano de saúde deve conhecer

## 1. Cobertura obrigatória do Rol da ANS

Todos os procedimentos listados no Rol da ANS devem ser cobertos.

## 2. Urgência e emergência

Carência máxima de 24 horas para urgências e emergências.

## 3. Portabilidade

Após 2 anos, você pode trocar de plano sem cumprir novas carências.

## 4. Reajuste limitado

Reajustes devem seguir regras da ANS. Aumentos abusivos podem ser contestados.

## 5. Cancelamento sem multa

Você pode cancelar a qualquer momento, sem multa.

## 6-10. E mais...

Consulte o site da ANS para conhecer todos os seus direitos.
    `,
    date: "2026-04-25",
    category: "Direitos",
    readTime: "6 min"
  },
  {
    id: "economia-plano-saude",
    title: "5 formas de economizar no plano de saúde sem perder qualidade",
    excerpt: "Dicas práticas para reduzir custos mantendo boa cobertura.",
    content: `
# 5 formas de economizar no plano de saúde

## 1. Considere coparticipação

Se você usa pouco o plano, pode economizar até 40% na mensalidade.

## 2. Ajuste a abrangência

Planos municipais ou regionais são mais baratos que nacionais.

## 3. Revise dependentes

Avalie se todos os dependentes realmente precisam estar no plano.

## 4. Compare anualmente

Preços e coberturas mudam. Compare todo ano.

## 5. Use a portabilidade

Após 2 anos, troque para um plano mais barato sem perder carências.
    `,
    date: "2026-04-20",
    category: "Economia",
    readTime: "4 min"
  }
];
