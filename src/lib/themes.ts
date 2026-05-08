// Sistema de Temas Personalizados - PlanoCerto

export type Theme = {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    success: string;
    successForeground: string;
  };
  preview: string; // Emoji ou ícone
};

export const THEMES: Theme[] = [
  {
    id: 'default',
    name: 'Azul Padrão',
    description: 'Tema padrão do PlanoCerto',
    preview: '🔵',
    colors: {
      primary: 'oklch(0.52 0.18 250)',
      primaryForeground: 'oklch(1 0 0)',
      secondary: 'oklch(0.96 0.02 245)',
      secondaryForeground: 'oklch(0.30 0.10 250)',
      accent: 'oklch(0.93 0.05 240)',
      accentForeground: 'oklch(0.30 0.12 250)',
      background: 'oklch(0.99 0.005 240)',
      foreground: 'oklch(0.20 0.05 250)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.20 0.05 250)',
      muted: 'oklch(0.96 0.015 245)',
      mutedForeground: 'oklch(0.50 0.04 250)',
      border: 'oklch(0.929 0.013 255.508)',
      success: 'oklch(0.62 0.17 150)',
      successForeground: 'oklch(1 0 0)',
    },
  },
  {
    id: 'green',
    name: 'Verde Saúde',
    description: 'Tema verde inspirado em saúde e bem-estar',
    preview: '🟢',
    colors: {
      primary: 'oklch(0.55 0.18 150)',
      primaryForeground: 'oklch(1 0 0)',
      secondary: 'oklch(0.96 0.02 145)',
      secondaryForeground: 'oklch(0.30 0.10 150)',
      accent: 'oklch(0.93 0.05 140)',
      accentForeground: 'oklch(0.30 0.12 150)',
      background: 'oklch(0.99 0.005 140)',
      foreground: 'oklch(0.20 0.05 150)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.20 0.05 150)',
      muted: 'oklch(0.96 0.015 145)',
      mutedForeground: 'oklch(0.50 0.04 150)',
      border: 'oklch(0.929 0.013 155.508)',
      success: 'oklch(0.62 0.17 150)',
      successForeground: 'oklch(1 0 0)',
    },
  },
  {
    id: 'purple',
    name: 'Roxo Premium',
    description: 'Tema roxo elegante e moderno',
    preview: '🟣',
    colors: {
      primary: 'oklch(0.55 0.20 290)',
      primaryForeground: 'oklch(1 0 0)',
      secondary: 'oklch(0.96 0.02 285)',
      secondaryForeground: 'oklch(0.30 0.10 290)',
      accent: 'oklch(0.93 0.05 280)',
      accentForeground: 'oklch(0.30 0.12 290)',
      background: 'oklch(0.99 0.005 280)',
      foreground: 'oklch(0.20 0.05 290)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.20 0.05 290)',
      muted: 'oklch(0.96 0.015 285)',
      mutedForeground: 'oklch(0.50 0.04 290)',
      border: 'oklch(0.929 0.013 295.508)',
      success: 'oklch(0.62 0.17 150)',
      successForeground: 'oklch(1 0 0)',
    },
  },
  {
    id: 'orange',
    name: 'Laranja Energia',
    description: 'Tema laranja vibrante e energético',
    preview: '🟠',
    colors: {
      primary: 'oklch(0.60 0.20 50)',
      primaryForeground: 'oklch(1 0 0)',
      secondary: 'oklch(0.96 0.02 45)',
      secondaryForeground: 'oklch(0.30 0.10 50)',
      accent: 'oklch(0.93 0.05 40)',
      accentForeground: 'oklch(0.30 0.12 50)',
      background: 'oklch(0.99 0.005 40)',
      foreground: 'oklch(0.20 0.05 50)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.20 0.05 50)',
      muted: 'oklch(0.96 0.015 45)',
      mutedForeground: 'oklch(0.50 0.04 50)',
      border: 'oklch(0.929 0.013 55.508)',
      success: 'oklch(0.62 0.17 150)',
      successForeground: 'oklch(1 0 0)',
    },
  },
  {
    id: 'pink',
    name: 'Rosa Moderno',
    description: 'Tema rosa suave e moderno',
    preview: '🩷',
    colors: {
      primary: 'oklch(0.60 0.18 350)',
      primaryForeground: 'oklch(1 0 0)',
      secondary: 'oklch(0.96 0.02 345)',
      secondaryForeground: 'oklch(0.30 0.10 350)',
      accent: 'oklch(0.93 0.05 340)',
      accentForeground: 'oklch(0.30 0.12 350)',
      background: 'oklch(0.99 0.005 340)',
      foreground: 'oklch(0.20 0.05 350)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.20 0.05 350)',
      muted: 'oklch(0.96 0.015 345)',
      mutedForeground: 'oklch(0.50 0.04 350)',
      border: 'oklch(0.929 0.013 355.508)',
      success: 'oklch(0.62 0.17 150)',
      successForeground: 'oklch(1 0 0)',
    },
  },
  {
    id: 'teal',
    name: 'Azul Turquesa',
    description: 'Tema azul turquesa refrescante',
    preview: '🔷',
    colors: {
      primary: 'oklch(0.55 0.18 200)',
      primaryForeground: 'oklch(1 0 0)',
      secondary: 'oklch(0.96 0.02 195)',
      secondaryForeground: 'oklch(0.30 0.10 200)',
      accent: 'oklch(0.93 0.05 190)',
      accentForeground: 'oklch(0.30 0.12 200)',
      background: 'oklch(0.99 0.005 190)',
      foreground: 'oklch(0.20 0.05 200)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.20 0.05 200)',
      muted: 'oklch(0.96 0.015 195)',
      mutedForeground: 'oklch(0.50 0.04 200)',
      border: 'oklch(0.929 0.013 205.508)',
      success: 'oklch(0.62 0.17 150)',
      successForeground: 'oklch(1 0 0)',
    },
  },
  {
    id: 'red',
    name: 'Vermelho Urgência',
    description: 'Tema vermelho para destacar urgência',
    preview: '🔴',
    colors: {
      primary: 'oklch(0.58 0.22 25)',
      primaryForeground: 'oklch(1 0 0)',
      secondary: 'oklch(0.96 0.02 20)',
      secondaryForeground: 'oklch(0.30 0.10 25)',
      accent: 'oklch(0.93 0.05 15)',
      accentForeground: 'oklch(0.30 0.12 25)',
      background: 'oklch(0.99 0.005 15)',
      foreground: 'oklch(0.20 0.05 25)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.20 0.05 25)',
      muted: 'oklch(0.96 0.015 20)',
      mutedForeground: 'oklch(0.50 0.04 25)',
      border: 'oklch(0.929 0.013 30.508)',
      success: 'oklch(0.62 0.17 150)',
      successForeground: 'oklch(1 0 0)',
    },
  },
  {
    id: 'dark-blue',
    name: 'Azul Escuro',
    description: 'Tema azul escuro profissional',
    preview: '🌙',
    colors: {
      primary: 'oklch(0.48 0.20 250)',
      primaryForeground: 'oklch(1 0 0)',
      secondary: 'oklch(0.94 0.02 245)',
      secondaryForeground: 'oklch(0.25 0.10 250)',
      accent: 'oklch(0.91 0.05 240)',
      accentForeground: 'oklch(0.25 0.12 250)',
      background: 'oklch(0.97 0.005 240)',
      foreground: 'oklch(0.15 0.05 250)',
      card: 'oklch(0.99 0 0)',
      cardForeground: 'oklch(0.15 0.05 250)',
      muted: 'oklch(0.94 0.015 245)',
      mutedForeground: 'oklch(0.45 0.04 250)',
      border: 'oklch(0.909 0.013 255.508)',
      success: 'oklch(0.62 0.17 150)',
      successForeground: 'oklch(1 0 0)',
    },
  },
];

class ThemeService {
  private readonly STORAGE_KEY = 'planocerto-theme';
  private currentTheme: Theme;

  constructor() {
    this.currentTheme = this.loadTheme();
  }

  // Carregar tema salvo
  private loadTheme(): Theme {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      const themeId = saved;
      const theme = THEMES.find(t => t.id === themeId);
      if (theme) return theme;
    }
    return THEMES[0]; // Default
  }

  // Obter tema atual
  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  // Obter todos os temas
  getAllThemes(): Theme[] {
    return THEMES;
  }

  // Aplicar tema
  applyTheme(themeId: string): boolean {
    const theme = THEMES.find(t => t.id === themeId);
    if (!theme) return false;

    this.currentTheme = theme;
    localStorage.setItem(this.STORAGE_KEY, themeId);

    // Aplicar cores CSS
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });

    // Atualizar meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', this.hexFromOklch(theme.colors.primary));
    }

    return true;
  }

  // Resetar para tema padrão
  resetTheme(): void {
    this.applyTheme('default');
  }

  // Criar tema personalizado
  createCustomTheme(name: string, baseThemeId: string, colorOverrides: Partial<Theme['colors']>): Theme {
    const baseTheme = THEMES.find(t => t.id === baseThemeId) || THEMES[0];
    
    const customTheme: Theme = {
      id: `custom-${Date.now()}`,
      name,
      description: 'Tema personalizado',
      preview: '🎨',
      colors: {
        ...baseTheme.colors,
        ...colorOverrides,
      },
    };

    return customTheme;
  }

  // Converter oklch para hex (aproximado)
  private hexFromOklch(oklch: string): string {
    // Simplificado - em produção usar biblioteca de conversão
    const match = oklch.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
    if (!match) return '#1f6feb';
    
    const l = parseFloat(match[1]);
    const c = parseFloat(match[2]);
    const h = parseFloat(match[3]);
    
    // Conversão aproximada
    const lightness = Math.round(l * 255);
    const hex = `#${lightness.toString(16).padStart(2, '0')}${lightness.toString(16).padStart(2, '0')}${lightness.toString(16).padStart(2, '0')}`;
    
    return hex;
  }

  // Exportar tema atual
  exportTheme(): string {
    return JSON.stringify(this.currentTheme, null, 2);
  }

  // Importar tema
  importTheme(themeJson: string): boolean {
    try {
      const theme: Theme = JSON.parse(themeJson);
      // Validar estrutura
      if (!theme.id || !theme.name || !theme.colors) {
        return false;
      }
      
      // Adicionar à lista (temporariamente)
      THEMES.push(theme);
      this.applyTheme(theme.id);
      return true;
    } catch {
      return false;
    }
  }
}

export const themeService = new ThemeService();

// Auto-aplicar tema salvo ao carregar
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('planocerto-theme');
  if (savedTheme) {
    themeService.applyTheme(savedTheme);
  }
}
