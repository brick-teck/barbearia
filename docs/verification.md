# Verificação — 11/10/2026

## Execução
Website aberto por `file://` no Microsoft Edge 155 em modo headless, com perfil de teste isolado. Sem servidor, instalação de dependências ou build do website.

Comandos executados:
- `node --check barbearia-demo/js/main.js`: passou.
- `node --check barbearia-demo/js/data.js`: passou.
- `node qa-browser.cjs`: 16 grupos passaram; nenhum erro de JavaScript ou `console.error` da aplicação; nenhuma requisição online falhou. A abertura de novas abas foi interceptada no teste para inspecionar os links, sem enviar mensagens pelo WhatsApp.
- `python <frontend-design-premium>/scripts/audit_project.py <projeto> --mode strict`: executado; 28 alertas `affordance.actionless-button`. O auditor só reconhece handlers inline no HTML, não `addEventListener` em arquivos separados. São falsos positivos verificados pelo teste de todos os CTAs e dos controles correspondentes. Os handlers estão em `js/main.js`; não foram adicionados handlers inline para satisfazer a heurística. Saída original em `static-audit.json`.

## Cobertura confirmada
1. Abertura direta com 6 serviços, 3 planos, 6 profissionais e 6 imagens na galeria.
2. Todas as fotografias locais carregadas.
3. Alternância de unidade, inclusive cliques rápidos; foto, descrição, endereço de referência, mapa e mensagem de agendamento coerentes.
4. Filtros Todos/Centro/Jardins e mensagem WhatsApp do profissional com unidade explícita.
5. FAQ: abertura/fechamento, exclusividade do item aberto e navegação por setas.
6. Lightbox: abertura, anterior/próxima, setas do teclado, fechamento e restauração de foco.
7. Todos os CTAs de agendamento e planos abrem links `https://wa.me/5531999999999` com mensagem correta e parâmetros `_blank`, `noopener,noreferrer`.
8. 320, 375, 430, 768, 1024, 1440 e 1920px sem overflow horizontal.
9. Menu mobile, Escape, isolamento do conteúdo de fundo e fechamento do menu antes de abrir o WhatsApp.
10. Movimento reduzido: animações desativadas, conteúdo visível.
11. Google Maps carregado com referência MASP, troca para Praça da Sé e link externo correspondente. Captura visual confirma o mapa incorporado.
12. Destinos internos válidos e botão voltar ao topo.
13. Rede offline: fotos e aplicação local funcionam; mapa preserva estado alternativo e informa falta de conexão; avisos dos apps continuam funcionando; sem overflow em 320px com fontes de sistema.
14. Planos presentes uma única vez imediatamente após a faixa; seção Sobre removida; âncoras e ordem das seções atualizadas.
15. Dois botões de aplicativos no Hero e dois na seção complementar. Links vazios abrem aviso. Links HTTPS configurados temporariamente no teste são abertos sem editar HTML; URL inválida mantém o aviso. Configuração entregue vazia, conforme solicitado.
16. Modais de contato e redes continuam acessíveis, com fechamento e restauração de foco.

Capturas revisadas: Hero desktop/mobile com aplicativos, menu e modal mobile, serviços, clube na nova posição, equipe, galeria, unidades, mapa carregado, aplicativo e FAQ. Exemplos de apresentação em `preview/`. Resultado estruturado em `browser-results.json`.

## Limites
Validação de execução feita no Edge, não em dispositivos físicos ou em todos os navegadores. Sem auditoria formal de conformidade WCAG nem teste com leitor de tela. WhatsApp, Google Fonts, Google Maps e links futuros dos aplicativos dependem de internet e disponibilidade de terceiros. Os testes verificam a geração dos links WhatsApp, não o envio de mensagens ou a existência de uma conta no número fornecido. O mapa oferece link externo, tentativa novamente e estado offline; conteúdo cross-origin não é inspecionado pela aplicação. O website não confirma reservas nem realiza contratação ou pagamentos; os planos permanecem ilustrativos. URLs dos aplicativos aguardam configuração.
