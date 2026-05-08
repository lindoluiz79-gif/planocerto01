export type Review = {
  id: string;
  planId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
};

// Reviews simulados
const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    planId: "unimed-mei",
    userId: "user1",
    userName: "Maria Silva",
    rating: 5,
    comment: "Excelente plano! Rede credenciada muito boa e atendimento rápido. Recomendo para outros MEIs.",
    date: "2026-04-15",
    helpful: 24
  },
  {
    id: "2",
    planId: "unimed-mei",
    userId: "user2",
    userName: "João Santos",
    rating: 4,
    comment: "Bom custo-benefício. Única ressalva é que alguns exames demoram um pouco para agendar.",
    date: "2026-04-10",
    helpful: 12
  },
  {
    id: "3",
    planId: "hapvida-essencial",
    userId: "user3",
    userName: "Ana Costa",
    rating: 5,
    comment: "Melhor preço que encontrei! A rede própria funciona muito bem.",
    date: "2026-04-20",
    helpful: 18
  },
  {
    id: "4",
    planId: "bradesco-top",
    userId: "user4",
    userName: "Carlos Oliveira",
    rating: 5,
    comment: "Vale cada centavo. Hospitais de primeira linha e atendimento VIP.",
    date: "2026-04-18",
    helpful: 31
  },
  {
    id: "5",
    planId: "sulamerica-exato",
    userId: "user5",
    userName: "Fernanda Lima",
    rating: 4,
    comment: "Ótimo plano, telemedicina funciona perfeitamente. Preço justo.",
    date: "2026-04-12",
    helpful: 15
  }
];

export function getReviewsByPlan(planId: string): Review[] {
  if (typeof window === 'undefined') return MOCK_REVIEWS.filter(r => r.planId === planId);
  
  const stored = localStorage.getItem('planocerto-reviews');
  const userReviews = stored ? JSON.parse(stored) : [];
  
  return [...MOCK_REVIEWS, ...userReviews]
    .filter(r => r.planId === planId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function addReview(review: Omit<Review, 'id' | 'date' | 'helpful'>): Review {
  const newReview: Review = {
    ...review,
    id: Math.random().toString(36).substr(2, 9),
    date: new Date().toISOString(),
    helpful: 0
  };
  
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('planocerto-reviews');
    const reviews = stored ? JSON.parse(stored) : [];
    reviews.push(newReview);
    localStorage.setItem('planocerto-reviews', JSON.stringify(reviews));
  }
  
  return newReview;
}

export function markHelpful(reviewId: string) {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem('planocerto-reviews');
  if (!stored) return;
  
  const reviews = JSON.parse(stored);
  const review = reviews.find((r: Review) => r.id === reviewId);
  if (review) {
    review.helpful = (review.helpful || 0) + 1;
    localStorage.setItem('planocerto-reviews', JSON.stringify(reviews));
  }
}

export function getAverageRating(planId: string): number {
  const reviews = getReviewsByPlan(planId);
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / reviews.length;
}
