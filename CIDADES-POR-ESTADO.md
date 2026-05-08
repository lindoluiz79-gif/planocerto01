# 🏙️ Sistema de Cidades por Estado

## ✨ Nova Funcionalidade Implementada!

### 🎯 O que foi feito:

Agora na página de busca, quando o usuário seleciona um estado, aparece automaticamente uma lista com as principais cidades daquele estado!

### 📋 Como funciona:

1. **Usuário seleciona o estado** (ex: São Paulo)
2. **Aparece um select com as cidades** daquele estado
3. **Usuário escolhe a cidade** da lista
4. **OU** clica em "Minha cidade não está na lista" para digitar manualmente

### 🗺️ Estados e Cidades:

Adicionamos as **10-15 principais cidades** de cada estado:

- **SP**: 15 cidades (São Paulo, Campinas, Santos, etc.)
- **RJ**: 10 cidades (Rio de Janeiro, Niterói, etc.)
- **MG**: 10 cidades (Belo Horizonte, Uberlândia, etc.)
- **E todos os outros 24 estados!**

Total: **~250 cidades** cadastradas!

### 🎨 Recursos:

✅ **Select inteligente** - Mostra apenas cidades do estado selecionado  
✅ **Modo digitação** - Se a cidade não está na lista, pode digitar  
✅ **Botão de alternância** - Fácil trocar entre select e input  
✅ **Validação** - Campo obrigatório  
✅ **UX amigável** - Links clicáveis para alternar modos  

### 💡 Exemplo de uso:

```
1. Seleciona: Estado = "SP"
   → Aparece select com: São Paulo, Campinas, Santos...

2. Seleciona: Cidade = "Campinas"
   → Pronto!

3. OU clica em "Minha cidade não está na lista"
   → Aparece input para digitar
   → Digite: "Vinhedo"
   → Pronto!
```

### 🔄 Comportamento inteligente:

- Quando muda o estado, **limpa a cidade** automaticamente
- Se estava em modo digitação, **volta para select** no novo estado
- Se a cidade digitada não existe no novo estado, **limpa o campo**

### 📱 Como testar:

1. Acesse: http://localhost:8081/buscar
2. Selecione um estado (ex: SP)
3. Veja o select de cidades aparecer
4. Escolha uma cidade
5. OU clique em "Minha cidade não está na lista"
6. Digite manualmente
7. Teste trocar de estado e veja a lista mudar!

---

## 📊 Dados adicionados:

### Arquivo: `src/data/plans.ts`

```typescript
export const CIDADES_POR_ESTADO: Record<string, string[]> = {
  "SP": ["São Paulo", "Campinas", "Santos", ...],
  "RJ": ["Rio de Janeiro", "Niterói", ...],
  // ... todos os 27 estados
};
```

### Arquivo: `src/routes/buscar.tsx`

- ✅ Import de `CIDADES_POR_ESTADO`
- ✅ Estado `modoDigitacao` para alternar entre select e input
- ✅ Função `handleEstadoChange` para limpar cidade ao mudar estado
- ✅ Select dinâmico de cidades
- ✅ Botões para alternar entre modos

---

## 🎉 Resultado:

A busca agora está muito mais profissional e fácil de usar!

- ✅ Usuário não precisa digitar a cidade
- ✅ Evita erros de digitação
- ✅ Mais rápido e intuitivo
- ✅ Mas ainda permite digitação manual se necessário

---

**Data**: 7 de maio de 2026  
**Arquivos modificados**: 
- `src/data/plans.ts`
- `src/routes/buscar.tsx`
