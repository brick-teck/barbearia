/* Personalize o conteúdo desta demonstração aqui. Valores e pessoas são fictícios. */
window.BARBER_DATA = {
  config: {
    whatsapp: '5531999999999',
    apps: { ios: '', android: '' }
  },
  units: {
    centro: {
      name: 'Centro', number: '01', image: 'assets/images/centro.jpg',
      description: 'O ritmo da cidade. O seu momento de pausa.',
      address: 'Referência ilustrativa: Praça da Sé, São Paulo',
      reference: 'Praça da Sé', mapQuery: 'Praça da Sé, São Paulo, Brasil',
      hours: 'Seg–sex, 9h às 20h · Sáb, 9h às 18h', phone: '(11) 0000-0000',
      atmosphere: 'Clássica na essência. Urbana na atitude.'
    },
    jardins: {
      name: 'Jardins', number: '02', image: 'assets/images/jardins.jpg',
      description: 'Um refúgio de estilo. Cada detalhe importa.',
      address: 'Referência ilustrativa: MASP, Av. Paulista, 1578',
      reference: 'MASP · Avenida Paulista', mapQuery: 'MASP, Avenida Paulista, 1578, São Paulo, Brasil',
      hours: 'Seg–sex, 10h às 21h · Sáb, 9h às 18h', phone: '(11) 0000-0000',
      atmosphere: 'Uma atmosfera acolhedora, um cuidado singular.'
    }
  },
  services: [
    { name: 'Corte Masculino', description: 'Do clássico ao contemporâneo, um corte que combina com você.', price: 45, duration: '40 min', icon: 'scissors' },
    { name: 'Barba Completa', description: 'Desenho preciso, toalha quente e finalização no detalhe.', price: 35, duration: '30 min', icon: 'razor' },
    { name: 'Corte + Barba', description: 'O ritual completo. Cabelo e barba em perfeita sintonia.', price: 70, duration: '60 min', icon: 'spark', featured: true },
    { name: 'Acabamento', description: 'Contornos alinhados para manter seu corte sempre em dia.', price: 20, duration: '15 min', icon: 'comb' },
    { name: 'Sobrancelha', description: 'Um cuidado sutil que valoriza a expressão do seu rosto.', price: 15, duration: '15 min', icon: 'eye' },
    { name: 'Hidratação Capilar', description: 'Nutrição e cuidado para fios com mais força e movimento.', price: 40, duration: '30 min', icon: 'drop' }
  ],
  plans: [
    { name: 'Essencial', price: 79.90, tagline: 'Seu cuidado, em dia.', benefits: ['2 cortes por mês', 'Agendamento pelo WhatsApp', 'Atendimento em uma das unidades', 'Praticidade para sua rotina'] },
    { name: 'Premium', price: 119.90, tagline: 'Seu estilo, sempre impecável.', featured: true, benefits: ['4 cortes por mês', 'Agendamento pelo WhatsApp', 'Condições especiais', 'Benefícios exclusivos'] },
    { name: 'Black', price: 159.90, tagline: 'O ritual completo, sem limites.', benefits: ['Cortes ilimitados', 'Barba incluída', 'Condições especiais', 'Atendimento prioritário'] }
  ],
  team: [
    { name: 'Rafael Costa', specialty: 'Cortes clássicos & barba', unit: 'centro', image: 'assets/images/barbeiro-1.jpg' },
    { name: 'Lucas Martins', specialty: 'Degradê & estilo urbano', unit: 'jardins', image: 'assets/images/barbeiro-2.jpg' },
    { name: 'André Oliveira', specialty: 'Visagismo & tesoura', unit: 'centro', image: 'assets/images/barbeiro-3.jpg' },
    { name: 'Pedro Almeida', specialty: 'Barba & contornos', unit: 'jardins', image: 'assets/images/barbeiro-4.jpg' },
    { name: 'Bruno Santos', specialty: 'Cortes modernos & textura', unit: 'centro', image: 'assets/images/barbeiro-5.jpg' },
    { name: 'Diego Ferreira', specialty: 'Cortes clássicos & acabamento', unit: 'jardins', image: 'assets/images/barbeiro-6.jpg' }
  ],
  gallery: [
    { image: 'assets/images/centro.jpg', title: 'Detalhes que acolhem', subtitle: 'Ambiente ilustrativo · Centro' },
    { image: 'assets/images/atendimento.jpg', title: 'A arte de cuidar', subtitle: 'Atendimento · fotografia ilustrativa' },
    { image: 'assets/images/ferramentas.jpg', title: 'Precisão em cada instrumento', subtitle: 'Ferramentas · fotografia ilustrativa' },
    { image: 'assets/images/cadeira.jpg', title: 'Seu lugar na casa', subtitle: 'Cadeira · fotografia ilustrativa' },
    { image: 'assets/images/corte.jpg', title: 'Estilo nos detalhes', subtitle: 'Corte · fotografia ilustrativa' },
    { image: 'assets/images/jardins.jpg', title: 'Tradição que inspira', subtitle: 'Ambiente ilustrativo · Jardins' }
  ],
  testimonials: [
    { name: 'Gabriel M.', text: 'Do atendimento ao acabamento, cada detalhe faz diferença. Um lugar para desacelerar e sair com o visual em dia.' },
    { name: 'Felipe R.', text: 'Ambiente acolhedor, boa conversa e um corte do jeito que eu queria. A experiência é tão boa quanto o resultado.' },
    { name: 'Henrique A.', text: 'O cuidado com a barba e a atenção ao meu estilo tornaram esse momento uma parte especial da rotina.' }
  ],
  faq: [
    { question: 'Como agendar um horário?', answer: 'Clique em um botão de agendamento para abrir o WhatsApp. No Hero, a mensagem acompanha a unidade selecionada; nos cartões de serviço ou profissional, inclui sua escolha. Envie a mensagem e combine a disponibilidade na conversa. A abertura do WhatsApp não confirma uma reserva.' },
    { question: 'Posso escolher o barbeiro?', answer: 'A proposta permite escolher um profissional da unidade desejada. Os nomes, especialidades e fotografias desta equipe são exemplos de apresentação e não representam funcionários reais.' },
    { question: 'Existe plano de assinatura?', answer: 'Apresentamos três exemplos: Essencial, Premium e Black. Todos os preços e benefícios são fictícios. O botão “Quero este plano” abre o WhatsApp com uma mensagem sobre o plano escolhido, sem realizar contratação ou cobrança.' },
    { question: 'Quais são as formas de pagamento?', answer: 'Como exemplo para a versão oficial, a barbearia poderá oferecer Pix e cartões, conforme as condições definidas pelo estabelecimento. Este protótipo não aceita pagamentos nem solicita dados financeiros.' },
    { question: 'Onde ficam as unidades?', answer: 'Centro e Jardins são unidades fictícias. A Praça da Sé e o MASP aparecem no mapa apenas como referências públicas reais para demonstrar a troca de localização. Nenhuma barbearia está sendo anunciada nesses locais.' },
    { question: 'Posso reagendar meu horário?', answer: 'Na versão oficial, as regras de reagendamento serão informadas pela barbearia. Como este protótipo não cria reservas, também não altera ou cancela horários reais.' }
  ]
};
