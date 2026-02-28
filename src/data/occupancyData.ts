export interface OccupancyType {
    group: string;
    occupancy: string;
    division: string;
    description: string;
    examples: string;
}

export const occupancyData: OccupancyType[] = [
    {
        group: "A",
        occupancy: "Residencial",
        division: "A-1",
        description: "Habitação unifamiliar",
        examples: "Casas térreas ou assobradadas (isoladas e não isoladas) e condomínios horizontais."
    },
    {
        group: "A",
        occupancy: "Residencial",
        division: "A-2",
        description: "Habitação multifamiliar",
        examples: "Edifícios de apartamento em geral."
    },
    {
        group: "A",
        occupancy: "Residencial",
        division: "A-3",
        description: "Habitação coletiva",
        examples: "Pensionatos, internatos, alojamentos, mosteiros, conventos, residências geriátricas, com capacidade máxima de 16 leitos, sem acompanhamento médico."
    },
    {
        group: "B",
        occupancy: "Serviço de Hospedagem",
        division: "B-1",
        description: "Hotel e assemelhado",
        examples: "Hotéis, motéis, pensões, hospedarias, pousadas, albergues, casas de cômodos e divisão A3 com mais de 16 leitos."
    },
    {
        group: "B",
        occupancy: "Serviço de Hospedagem",
        division: "B-2",
        description: "Hotel residencial",
        examples: "Hotéis e assemelhados com cozinha própria nos apartamentos (incluem-se apart-hotéis, flats, hotéis residenciais) e assemelhados."
    },
    {
        group: "C",
        occupancy: "Comercial",
        division: "C-1",
        description: "Comércio com baixa carga de incêndio",
        examples: "Artigos de metal, louças, armarinhos, artigos hospitalares e outros."
    },
    {
        group: "C",
        occupancy: "Comercial",
        division: "C-2",
        description: "Comércio com média e alta carga de incêndio",
        examples: "Edifícios de lojas de departamentos, magazines, galerias comerciais, supermercados em geral, mercados e outros."
    },
    {
        group: "C",
        occupancy: "Comercial",
        division: "C-3",
        description: "Centros comerciais de compras (Shopping centers)",
        examples: "Centros comerciais de múltiplas lojas e prestação de serviços (shopping centers)."
    },
    {
        group: "D",
        occupancy: "Serviço profissional",
        division: "D-1",
        description: "Local para prestação de serviço profissional ou condução de negócios.",
        examples: "Escritórios administrativos ou técnicos, instituições financeiras (que não estejam incluídas em D-2), repartições públicas, cabeleireiros, teleatendimento, centros profissionais e assemelhados."
    },
    {
        group: "D",
        occupancy: "Serviço profissional",
        division: "D-2",
        description: "Agência bancária",
        examples: "Agências bancárias e assemelhadas."
    },
    {
        group: "D",
        occupancy: "Serviço profissional",
        division: "D-3",
        description: "Serviço de reparação (exceto os classificados em G-4)",
        examples: "Lavanderias, assistência técnica, reparação e manutenção de aparelhos eletrodomésticos, chaveiros, pintura de letreiros e outros."
    },
    {
        group: "D",
        occupancy: "Serviço profissional",
        division: "D-4",
        description: "Laboratório",
        examples: "Laboratórios de análises clínicas sem internação, laboratórios químicos, fotográficos e assemelhados."
    },
    {
        group: "E",
        occupancy: "Educacional e cultura física",
        division: "E-1",
        description: "Escola em geral",
        examples: "Escolas de primeiro, segundo e terceiro graus, cursos supletivos e pré-universitários e assemelhados."
    },
    {
        group: "E",
        occupancy: "Educacional e cultura física",
        division: "E-2",
        description: "Escola especial",
        examples: "Escolas de artes e artesanato, de línguas, de cultura geral, de cultura estrangeira, religiosas e assemelhados."
    },
    {
        group: "E",
        occupancy: "Educacional e cultura física",
        division: "E-3",
        description: "Espaço para cultura física",
        examples: "Locais de ensino e/ou práticas de artes marciais, natação, ginásticas (artística, dança, musculação e outros), esportes coletivos (tênis, futebol e outros que não estejam incluídos em F-3), sauna, casas de fisioterapia e assemelhados."
    },
    {
        group: "E",
        occupancy: "Educacional e cultura física",
        division: "E-4",
        description: "Centro de treinamento profissional",
        examples: "Escolas profissionais em geral."
    },
    {
        group: "E",
        occupancy: "Educacional e cultura física",
        division: "E-5",
        description: "Pré-escola",
        examples: "Creches, escolas maternais, jardins de infância."
    },
    {
        group: "E",
        occupancy: "Educacional e cultura física",
        division: "E-6",
        description: "Escola para portadores de deficiências",
        examples: "Escolas para excepcionais, deficientes visuais e auditivos e assemelhados."
    },
    {
        group: "F",
        occupancy: "Local de Reunião de Público",
        division: "F-1",
        description: "Local onde há objeto de valor inestimável",
        examples: "Museus, centros de documentos históricos, galerias de arte, bibliotecas e assemelhados."
    },
    {
        group: "F",
        occupancy: "Local de Reunião de Público",
        division: "F-2",
        description: "Local religioso e velório",
        examples: "Igrejas, capelas, sinagogas, mesquitas, templos, cemitérios, crematórios, necrotérios, salas de funerais e assemelhados."
    },
    {
        group: "F",
        occupancy: "Local de Reunião de Público",
        division: "F-3",
        description: "Centro esportivo e de exibição",
        examples: "Arenas em geral, estádios, ginásios e piscinas, rodeios, autódromos, sambódromos, pistas de patinação e assemelhados, todos com arquibancada."
    },
    {
        group: "F",
        occupancy: "Local de Reunião de Público",
        division: "F-4",
        description: "Estação e terminal de passageiro",
        examples: "Estações rodoferroviárias e lacustres, portos, metrô, aeroportos, helipontos, estações de transbordo em geral e assemelhados."
    },
    {
        group: "F",
        occupancy: "Local de Reunião de Público",
        division: "F-5",
        description: "Arte cênica e auditório",
        examples: "Teatros em geral, cinemas, óperas, auditórios de estúdios de rádio e televisão, auditórios em geral e assemelhados."
    },
    {
        group: "F",
        occupancy: "Local de Reunião de Público",
        division: "F-6",
        description: "Casas de show",
        examples: "Casas de show, casas noturnas, boates, restaurantes dançantes, salões de festa com palco e assemelhados."
    },
    {
        group: "F",
        occupancy: "Local de Reunião de Público",
        division: "F-7",
        description: "Construção provisória e evento temporário",
        examples: "Circos, eventos temporários, feiras em geral, shows e assemelhados."
    },
    {
        group: "F",
        occupancy: "Local de Reunião de Público",
        division: "F-8",
        description: "Local para refeição",
        examples: "Restaurantes, lanchonetes, bares, cafés, refeitórios, cantinas e assemelhados."
    },
    {
        group: "F",
        occupancy: "Local de Reunião de Público",
        division: "F-9",
        description: "Recreação",
        examples: "Edificações permanentes de jardins zoológicos, parques recreativos e assemelhados."
    },
    {
        group: "F",
        occupancy: "Local de Reunião de Público",
        division: "F-10",
        description: "Exposição de objetos e animais",
        examples: "Salões e salas de exposição de objetos e animais, show-room, aquários, planetários, e assemelhados em edificações permanentes."
    },
    {
        group: "F",
        occupancy: "Local de Reunião de Público",
        division: "F-11",
        description: "Clubes sociais e de diversão",
        examples: "Clubes em geral, salões de festa (buffet) sem palco, clubes sociais, bilhares, tiro ao alvo, boliche e assemelhados."
    },
    {
        group: "G",
        occupancy: "Serviço automotivo e assemelhados",
        division: "G-1",
        description: "Estacionamento sem acesso de público e sem abastecimento",
        examples: "Estacionamentos automáticos e estacionamentos com manobristas."
    },
    {
        group: "G",
        occupancy: "Serviço automotivo e assemelhados",
        division: "G-2",
        description: "Estacionamento com acesso de público e sem abastecimento",
        examples: "Estacionamentos coletivos sem automação."
    },
    {
        group: "G",
        occupancy: "Serviço automotivo e assemelhados",
        division: "G-3",
        description: "Local dotado de abastecimento de combustível",
        examples: "Postos de abastecimento e serviço."
    },
    {
        group: "G",
        occupancy: "Serviço automotivo e assemelhados",
        division: "G-4",
        description: "Serviço de conservação, manutenção, garagem e reparos, com ou sem abastecimento",
        examples: "Oficinas de conserto de veículos, borracharias (sem recauchutagem), oficinas e garagem de veículos de carga e coletivos, máquinas agrícolas e rodoviárias, retificadoras de motores."
    },
    {
        group: "G",
        occupancy: "Serviço automotivo e assemelhados",
        division: "G-5",
        description: "Hangares",
        examples: "Abrigos para aeronaves com ou sem abastecimento."
    },
    {
        group: "H",
        occupancy: "Serviço de saúde e institucional",
        division: "H-1",
        description: "Hospital veterinário e assemelhados",
        examples: "Hospitais, clínicas e consultórios veterinários (inclui-se alojamento com ou sem adestramento)."
    },
    {
        group: "H",
        occupancy: "Serviço de saúde e institucional",
        division: "H-2",
        description: "Locais onde pessoas requerem cuidados especiais por limitações físicas ou mentais.",
        examples: "Asilos, orfanatos, abrigos geriátricos, hospitais psiquiátricos, reformatórios, locais para tratamento de dependentes químicos e assemelhados, todos sem celas."
    },
    {
        group: "H",
        occupancy: "Serviço de saúde e institucional",
        division: "H-3",
        description: "Hospital e assemelhado.",
        examples: "Hospitais, casa de saúde, prontos-socorros, clínicas com internação, ambulatórios e postos de atendimento de urgência, postos de saúde, puericultura e assemelhados com internação."
    },
    {
        group: "H",
        occupancy: "Serviço de saúde e institucional",
        division: "H-4",
        description: "Edificações das forças armadas e policiais.",
        examples: "Quartéis, delegacias, postos policiais, postos de bombeiro e assemelhados."
    },
    {
        group: "H",
        occupancy: "Serviço de saúde e institucional",
        division: "H-5",
        description: "Local onde a liberdade das pessoas sofre restrições.",
        examples: "Hospitais psiquiátricos, manicômios, reformatórios, prisões em geral (casa de detenção, penitenciárias, presídios, cadeias públicas, delegacias) e instituições assemelhadas, todos com celas."
    },
    {
        group: "H",
        occupancy: "Serviço de saúde e institucional",
        division: "H-6",
        description: "Clínicas e consultório médico e odontológico",
        examples: "Clínicas médicas, consultórios em geral, unidades de hemodiálise, ambulatórios e assemelhados, todos sem internação."
    },
    {
        group: "I",
        occupancy: "Indústria",
        division: "I-1",
        description: "Indústria com carga de incêndio até 300MJ/m²",
        examples: "Atividades que manipulam materiais com baixo risco de incêndio, tais como fábricas em geral, onde os processos não envolvem a utilização intensiva de materiais combustíveis (aço; artigos de vidro; aparelhos de rádio e som; armas; artigos de metal; gesso; esculturas de pedra; ferramentas; fotogravuras; joias; relógios; sabão; serralheria; suco de frutas; louças; metais; máquinas)."
    },
    {
        group: "I",
        occupancy: "Indústria",
        division: "I-2",
        description: "Indústria com carga de incêndio entre 301 e 1.200MJ/m²",
        examples: "Atividades que manipulam materiais com médio risco de incêndio, tais como: automóveis (pintura), bebidas destiladas; instrumentos musicais; móveis; alimentos marcenarias, fábricas de caixas, processamento de lixo com carga de incêndio média e assemelhados."
    },
    {
        group: "I",
        occupancy: "Indústria",
        division: "I-3",
        description: "Indústria com carga de incêndio superior a 1.200MJ/m²",
        examples: "Atividades industriais que envolvam líquidos e gases inflamáveis, materiais oxidantes, destilarias, refinarias, ceras, espuma sintética, grãos, tintas, borracha, processamento de lixo com alta carga de incêndio e assemelhados."
    },
    {
        group: "J",
        occupancy: "Depósito",
        division: "J-1",
        description: "Depósitos de material incombustível.",
        examples: "Edificações sem processo industrial que armazenam tijolos, pedras, areias, cimentos, metais e outros materiais incombustíveis, todos sem embalagem."
    },
    {
        group: "J",
        occupancy: "Depósito",
        division: "J-2",
        description: "Depósito com carga de incêndio até 300MJ/m²",
        examples: "Edificações onde os materiais armazenados apresentam baixa carga de incêndio."
    },
    {
        group: "J",
        occupancy: "Depósito",
        division: "J-3",
        description: "Depósitos com carga de incêndio entre 301 e 1.200MJ/m²",
        examples: "Edificações onde os materiais armazenados apresentam média carga de incêndio."
    },
    {
        group: "J",
        occupancy: "Depósito",
        division: "J-4",
        description: "Depósitos com carga de incêndio superior a 1.200MJ/m²",
        examples: "Edificações onde os materiais armazenados apresentam alta carga de incêndio."
    },
    {
        group: "L",
        occupancy: "Explosivos",
        division: "L-1",
        description: "Comércio.",
        examples: "Comércio em geral de fogos de artifício e assemelhados."
    },
    {
        group: "L",
        occupancy: "Explosivos",
        division: "L-2",
        description: "Indústria.",
        examples: "Indústria de material explosivo."
    },
    {
        group: "L",
        occupancy: "Explosivos",
        division: "L-3",
        description: "Depósito.",
        examples: "Depósito de material explosivo."
    },
    {
        group: "M",
        occupancy: "Especial",
        division: "M-1",
        description: "Túnel.",
        examples: "Túneis rodoferroviários e lacustres, destinados ao transporte de passageiros ou cargas diversas."
    },
    {
        group: "M",
        occupancy: "Especial",
        division: "M-2",
        description: "Líquido ou gás inflamável ou combustível",
        examples: "Locais destinados à produção, manipulação, armazenamento e distribuição de líquidos ou gases combustíveis e inflamáveis."
    },
    {
        group: "M",
        occupancy: "Especial",
        division: "M-3",
        description: "Central de comunicação e energia",
        examples: "Centrais telefônica, centros de comunicação, centrais de transmissão, de distribuição de energia e central de processamentos de dados."
    },
    {
        group: "M",
        occupancy: "Especial",
        division: "M-4",
        description: "Canteiro de obras",
        examples: "Locais em construção ou demolição, canteiro de obras e assemelhados."
    },
    {
        group: "M",
        occupancy: "Especial",
        division: "M-5",
        description: "Silos",
        examples: "Armazenamento e processos de grãos e assemelhados."
    },
    {
        group: "M",
        occupancy: "Especial",
        division: "M-6",
        description: "Terra selvagem.",
        examples: "Florestas, reservas ecológicas, parques florestais e assemelhados."
    },
    {
        group: "M",
        occupancy: "Especial",
        division: "M-7",
        description: "Pátio de Containers.",
        examples: "Áreas abertas destinadas ao armazenamento de containeres."
    },
    {
        group: "M",
        occupancy: "Especial",
        division: "M-8",
        description: "Agronegócio",
        examples: "Edificações destinadas a plantação ou criação de animais."
    }
];
