export type Testimonial = {
  id: string;
  name: string;
  avatar: string;
  role: string;
  rating: number;
  text: string;
  plan: string;
  date: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Carlos Silva",
    avatar: "👨‍💼",
    role: "MEI - Designer",
    rating: 5,
    text: "Encontrei um plano perfeito para mim em menos de 5 minutos! A comparação lado a lado me ajudou muito a decidir.",
    plan: "Hapvida Essencial",
    date: "2026-04-15",
  },
  {
    id: "2",
    name: "Ana Paula Santos",
    avatar: "👩‍💻",
    role: "Autônoma - Desenvolvedora",
    rating: 5,
    text: "Economizei R$ 150 por mês trocando de plano! O PlanoCerto me mostrou opções que eu nem conhecia.",
    plan: "Unimed MEI",
    date: "2026-04-20",
  },
  {
    id: "3",
    name: "Roberto Oliveira",
    avatar: "👨‍🍳",
    role: "MEI - Chef",
    rating: 4,
    text: "Muito prático! Consegui comparar vários planos e escolher o melhor custo-benefício para minha família.",
    plan: "Bradesco Top",
    date: "2026-04-25",
  },
  {
    id: "4",
    name: "Juliana Costa",
    avatar: "👩‍🎨",
    role: "Autônoma - Fotógrafa",
    rating: 5,
    text: "A calculadora de economia me convenceu a contratar um plano. Agora tenho tranquilidade!",
    plan: "SulAmérica Exato",
    date: "2026-05-01",
  },
  {
    id: "5",
    name: "Pedro Henrique",
    avatar: "👨‍🔧",
    role: "MEI - Eletricista",
    rating: 5,
    text: "Site muito fácil de usar! Em 10 minutos já tinha contratado meu plano. Recomendo!",
    plan: "Amil MEI",
    date: "2026-05-03",
  },
  {
    id: "6",
    name: "Mariana Ferreira",
    avatar: "👩‍⚕️",
    role: "Autônoma - Nutricionista",
    rating: 4,
    text: "Adorei os filtros avançados! Consegui encontrar um plano com cobertura odontológica no meu orçamento.",
    plan: "NotreDame Smart",
    date: "2026-05-05",
  },
];
