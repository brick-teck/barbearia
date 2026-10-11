# BARBER HOUSE — plano de implementação

**Objetivo:** entregar integralmente a landing page descrita no briefing, utilizável abrindo `index.html`.
**Arquitetura:** documento HTML semântico; três folhas CSS para sistema visual, responsividade e animações; dados personalizáveis em `js/data.js`; interação e renderização em `js/main.js`, carregados como scripts clássicos. Fotografias locais e SVG nativo. Sem dependências de instalação ou build.
**Design:** `../DESIGN.md`.

- [x] Construir todas as seções, navegação, símbolos de ícones e diálogos no HTML.
- [x] Implementar tokens, layouts variados, estados de foco/hover e breakpoints mobile.
- [x] Definir unidades, serviços, planos, seis profissionais, galeria e FAQ em data.js.
- [x] Implementar seleção compartilhada de unidade, filtros, modais, lightbox, FAQ, mapa sob demanda, menu e scroll reveal.
- [x] Verificar sintaxe e referências de arquivos; auditar o projeto.
- [x] Verificar no navegador a abertura direta, ações e tamanhos solicitados; corrigir problemas observados.
- [x] Entregar instruções de abertura, personalização e créditos.

**Foco de revisão:** cliques rápidos no seletor não podem causar conteúdo desatualizado; fechar diálogo deve restaurar foco; troca de unidade deve atualizar o mapa e o CTA; 320px deve manter ações alcançáveis; falha de serviços externos deve preservar fontes de fallback e link de localização.

## Melhorias solicitadas no segundo briefing
- [x] Substituir agendamentos fictícios por links WhatsApp centralizados no número fornecido, incluindo contexto quando aplicável.
- [x] Adicionar aplicativos no Hero e centralizar URLs vazias na configuração, com aviso até o preenchimento.
- [x] Reaproveitar os planos na segunda posição, substituir Sobre, atualizar benefícios e CTAs, sem duplicação.
- [x] Atualizar navegação, cópia e documentação sem alterar paleta, tipografia ou fotografias existentes.
- [x] Verificar número, mensagens, parâmetros de nova aba, configuração dos apps, seção única e regressões de responsividade/interação.
