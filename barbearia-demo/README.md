# BARBER HOUSE

Landing page comercial demonstrativa de uma barbearia premium. HTML5, CSS3 e JavaScript puro; sem instalação, servidor, build, backend ou banco de dados.

## Abrir
Dê dois cliques em **index.html** ou abra esse arquivo no Chrome, Edge, Firefox ou Safari atual. Fotos locais, troca de unidades, filtros, FAQ e modais dos aplicativos funcionam sem internet. WhatsApp, Google Fonts, Google Maps e futuros links de aplicativos dependem de conexão. Fontes de sistema e alternativa visual para o mapa preservam a apresentação offline.

## Personalizar
- `js/data.js`: `config.whatsapp` define o destino do WhatsApp; `config.apps.ios` e `config.apps.android` recebem os links HTTPS reais dos aplicativos. Também contém unidades, serviços/preços, planos, profissionais, fotos, galeria, depoimentos e FAQ.
- `index.html`: textos institucionais, marca, navegação e seções.
- `css/style.css`: tokens de cor, fontes, espaçamentos e componentes.
- `css/responsive.css`: ajustes mobile e tablet.
- `css/animations.css`: transições e movimento reduzido.
- `assets/images/`: fotografias locais. Fontes e licença em `CREDITS.md`.

## Interações
O seletor do Hero e os cartões de localização compartilham a unidade ativa. O agendamento do Hero e do mockup acompanha essa seleção; header e CTAs gerais usam a mensagem padrão; serviços incluem seu nome e profissionais/unidades possuem contexto explícito. A função reutilizável `agendarWhatsApp(unidade, detalhes)` centraliza agendamentos e pedidos de informação dos planos, codificando mensagens com `encodeURIComponent`.

App Store e Google Play aparecem no Hero e na seção complementar. Com links vazios, abrem o aviso de configuração; ao preencher os links em `data.js`, os botões abrem os aplicativos em nova aba sem editar o HTML. URLs incompletas ou sem HTTPS mantêm o aviso. Os planos aparecem uma única vez, logo após o Hero e a faixa de destaques; a navegação agora usa “Planos”.

As fotos do Hero mudam por fade, sem carrossel automático. O mapa é carregado sob demanda e acompanha a unidade selecionada, com alternativa por link e tratamento offline. Galeria com navegação anterior/próxima e setas do teclado; FAQ com Enter/Espaço e navegação por setas/Home/End; diálogos fecham por Escape e restauram foco.

## Conteúdo demonstrativo
Marca, preços, benefícios, equipe, horários, contatos ilustrativos e depoimentos são fictícios. Fotografias de banco de imagens não representam profissionais ou instalações reais da marca. Praça da Sé e MASP são referências públicas para testar o mapa, sem vínculo com uma barbearia. Agendamentos e planos abrem o WhatsApp no número +55 31 99999-9999, fornecido pelo usuário, com a mensagem pronta; a pessoa envia a mensagem na conversa. O website não confirma reservas, realiza pagamentos ou coleta dados pessoais. Contato e redes continuam ilustrativos. Links dos aplicativos ainda não foram fornecidos.

## Verificação
Resultados e limites de validação documentados em `docs/verification.md`.
