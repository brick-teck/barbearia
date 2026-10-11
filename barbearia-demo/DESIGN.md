# BARBER HOUSE — direção de design

## Contexto
Landing page comercial demonstrativa, em português brasileiro, para apresentar uma barbearia fictícia a potenciais clientes. Registro: marketing. O briefing enviado pelo usuário é a fonte de requisitos. Sem backend, pagamentos, reservas ou aplicativos reais. Abre por `file://`.

## Direção
Uma casa de estilo: fotografia de ambiente, títulos altos e condensados, composição cinematográfica e detalhes inspirados no latão dos instrumentos. A assinatura é o seletor de duas unidades integrado à base do hero, com miniaturas, nome e localização ilustrativa. Evitar métricas inventadas, selos de avaliação real e repetição de grades idênticas.

## Tokens e propriedade
Fonte canônica de valores em runtime: `css/style.css`, bloco `:root`. Este documento registra sua intenção, sem gerar um segundo sistema.

| Token | Valor | Uso |
| --- | --- | --- |
| `--black` | `#0B0B0B` | fundo principal |
| `--surface` | `#161616` | superfícies |
| `--line` | `#242424` | divisórias |
| `--gold` | `#C9A66B` | ações e destaques |
| `--white` | `#F5F5F5` | texto principal |
| `--muted` | `#A3A3A3` | texto secundário |

Display: Bebas Neue, fallback Impact / sans-serif. Corpo: Inter, fallback Arial / sans-serif. Títulos com escala fluida. Conteúdo com largura máxima de 1280px, margens fluidas de 20–80px; seções com respiro de 80–120px. Bordas finas, raios discretos; botões com altura mínima de 48px.

## Composição e interações
Hero cinematográfico com CTAs principais, aplicativos discretos e seletor de unidades; faixa de destaques; clube com três cartões e plano Premium destacado imediatamente depois; serviços em grade compacta; retratos em três colunas; galeria assimétrica; unidades e mapa lado a lado; mockup de aplicativo em CSS; FAQ em linhas expansíveis. A seção institucional foi substituída pelos planos, sem duplicação de conteúdo.

Agendamentos e planos usam links `wa.me` com mensagem codificada e abrem nova aba com `noopener,noreferrer`. Número definido em `BARBER_DATA.config.whatsapp`; aplicativos em `BARBER_DATA.config.apps`. Hero e mockup acompanham a unidade ativa; CTAs gerais usam mensagem sem unidade, e profissionais/unidades têm contexto explícito. Nenhuma reserva é confirmada pelo website. Aplicativos sem URL HTTPS configurada abrem o diálogo de preparação; com URL válida, abrem o link sem alterar HTML. Contato e redes preservam modais demonstrativos. Modais nativos têm nome, descrição, Escape, foco inicial, isolamento do fundo e restauração de foco. Filtros usam botões com `aria-pressed`; FAQ usa `aria-expanded` e `aria-controls`. Imagens reservam geometria. Scrollbars visíveis e tematizados. Animações respeitam movimento reduzido.

## Conteúdo e confiança
Marca, preços, planos, profissionais, contatos ilustrativos e depoimentos são fictícios e identificados. O número de WhatsApp `5531999999999` foi fornecido explicitamente pelo usuário para a integração de links. Fotografias de banco de imagens não representam a equipe nem endosso à marca. Mapas usam Praça da Sé e MASP exclusivamente como referências públicas; jamais como endereço de estabelecimento fictício. Créditos e fontes em `assets/images/CREDITS.md`.

## Verificação
Revisar abertura direta, unidades (inclusive cliques rápidos), contexto dos CTAs, filtro, lightbox, FAQ, menu mobile, foco, movimento reduzido e larguras 320/375/430/768/1024/1440/1920. Dependências online: Google Fonts e mapas; imagens e interações são locais.
