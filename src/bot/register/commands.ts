import { SlashCommandBuilder } from "discord.js";

export const commands = [
  new SlashCommandBuilder()
    .setName("setup")
    .setDescription("criar salas iniciais")
    .setDescriptionLocalizations({
      "en-US": "create initial rooms",
      de: "Erstellen Sie Anfangsräume",
      fr: "créer des salles initiales",
      ru: "создать начальные комнаты",
      pl: "utworzyć pokoje początkowe",
      "es-ES": "crear salas iniciales",
      it: "crea stanze iniziali",
      "zh-CN": "创建初始房间",
      ko: "초기 방 만들기",
      ja: "初期の部屋を作成する",
      "zh-TW": "創建初始房間",
      id: "buat ruang awal",
      tr: "ilk odaları oluştur",
    })
    .addStringOption((option) =>
      option
        .setName("idioma")
        .setDescription("Escolha o idioma")
        .setDescriptionLocalizations({
          "en-US": "Choose the language",
          de: "Wählen Sie die Sprache",
          fr: "Choisissez la langue",
          ru: "Vyberite-yazyk",
          pl: "Wybierz język",
          "es-ES": "Elige el idioma",
          it: "Scegli la lingua",
          "zh-CN": "选择语言",
          ko: "언어 선택",
          ja: "言語を選択する",
          "zh-TW": "選擇語言",
          id: "Pilih bahasa",
          tr: "Dili seçin",
        })
        .setNameLocalizations({
          "en-US": "language",
          de: "sprache",
          fr: "langue",
          ru: "yazyk",
          pl: "jezyk",
          "es-ES": "idioma",
          it: "lingua",
          "zh-CN": "yuyan",
          ko: "eon-eo",
          ja: "gengo",
          "zh-TW": "yuyan",
          id: "bahasa",
          tr: "dil",
        })
        .setChoices(
          {
            name: "Português",
            value: "pt-BR",
          },
          {
            name: "English",
            value: "en-US",
          }
          // {
          //   name: "Deutsch",
          //   value: "de",
          // },
          // {
          //   name: "Français",
          //   value: "fr",
          // },
          // {
          //   name: "Русский",
          //   value: "ru",
          // },
          // {
          //   name: "Polski",
          //   value: "pl",
          // },
          // {
          //   name: "Español",
          //   value: "es-ES",
          // },
          // {
          //   name: "Italiano",
          //   value: "it",
          // },
          // {
          //   name: "中文 (简体)",
          //   value: "zh-CN",
          // },
          // {
          //   name: "한국어",
          //   value: "ko",
          // },
          // {
          //   name: "日本語",
          //   value: "ja",
          // },
          // {
          //   name: "中文 (繁體)",
          //   value: "zh-TW",
          // },
          // {
          //   name: "Bahasa Indonesia",
          //   value: "id",
          // },
          // {
          //   name: "Türkçe",
          //   value: "tr",
          // }
        )
        .setRequired(true)
    )
    .toJSON(),
  new SlashCommandBuilder()
    .setName("vendedor")
    .setNameLocalizations({
      "en-US": "seller",
      de: "verkaufer",
      fr: "vendeur",
      ru: "продавец",
      pl: "sprzedawca",
      "es-ES": "vendedor",
      it: "venditore",
      "zh-CN": "卖家",
      ko: "판매자",
      ja: "売り手",
      "zh-TW": "賣家",
      id: "penjual",
      tr: "satıcı",
    })
    .setDescription("Atribui o papel de vendedor a um membro")
    .setDescriptionLocalizations({
      "en-US": "Assigns the seller role to a member",
      de: "Weist einem Mitglied die Verkäuferrolle zu",
      fr: "Attribue le rôle de vendeur à un membre",
      ru: "Назначает члену роль продавца",
      pl: "Przypisuje rolę sprzedawcy do członka",
      "es-ES": "Asigna el rol de vendedor a un miembro",
      it: "Assegna il ruolo di venditore a un membro",
      "zh-CN": "将卖家角色分配给成员",
      ko: "판매자 역할을 구성원에게 할당합니다.",
      ja: "メンバーに売り手の役割を割り当てます",
      "zh-TW": "將賣家角色分配給成員",
      id: "Menetapkan peran penjual ke anggota",
      tr: "Bir üyeye satıcı rolü atar",
    })
    .addUserOption((option) =>
      option
        .setName("membro")
        .setNameLocalizations({
          "en-US": "member",
          de: "mitglied",
          fr: "membre",
          ru: "участник",
          pl: "członek",
          "es-ES": "miembro",
          it: "membro",
          "zh-CN": "成员",
          ko: "구성원",
          ja: "メンバー",
          "zh-TW": "成員",
          id: "anggota",
          tr: "üye",
        })
        .setDescription("Selecione o membro ex: @membro")
        .setDescriptionLocalizations({
          "en-US": "Select the member ex: @member",
          de: "Wählen Sie das Mitglied aus, z. B. @Mitglied",
          fr: "Sélectionnez le membre ex : @membre",
          ru: "Выберите участника, например: @участник",
          pl: "Wybierz członka, np. @członek",
          "es-ES": "Seleccione el miembro ej: @miembro",
          it: "Seleziona il membro es: @membro",
          "zh-CN": "选择成员，例如：@成员",
          ko: "@구성원과 같은 구성원을 선택합니다.",
          ja: "@メンバーのようにメンバーを選択します",
          "zh-TW": "選擇成員，例如：@成員",
          id: "Pilih anggota mis. @anggota",
          tr: "@üye gibi bir üyeyi seçin",
        })
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("simular-evento")
    .setNameLocalizations({
      "en-US": "simulate-event",
      de: "ereignis-simulieren",
      fr: "simuler-evenement",
      ru: "simulirovat-sobytie",
      pl: "symulowac-wydarzenie",
      "es-ES": "simular-evento",
      it: "simulare-evento",
      "zh-CN": "moni-shijian",
      ko: "ibenteu-simullesyeon",
      ja: "ibento-shimyureto",
      "zh-TW": "moni-shijian",
      id: "simulasikan-acara",
      tr: "olayi-simule-et",
    })
    .setDescription("Simular quantos cada participante receberá de acordo com sua participação e o valor total")
    .setDescriptionLocalizations({
      "en-US": "Simulate how much each participant will receive based on participation and total amount",
      de: "Simulieren Sie den Betrag pro Teilnehmer basierend auf Beteiligung und Gesamtsumme",
      fr: "Simulez le montant reçu selon la participation et le total",
      ru: "Смоделируйте выплаты на основе участия и общей суммы",
      pl: "Symuluj wypłatę na podstawie udziału i całkowitej kwoty",
      "es-ES": "Simula cuánto recibirá cada uno según su participación y el monto total",
      it: "Simula quanto riceverà ogni partecipante in base alla partecipazione",
      "zh-CN": "根据参与度和总金额模拟每人将获得多少",
      ko: "참여도와 총액에 따라 지급액을 시뮬레이션",
      ja: "参加状況と総額に応じた支給額をシミュレート",
      "zh-TW": "根據參與程度和總金額模擬獲得金額",
      id: "Simulasikan berapa banyak yang diterima sesuai partisipasi",
      tr: "Katılım ve toplam tutara göre alacaklarını simüle et",
    })
    .addStringOption((input) =>
      input
        .setName("valor")
        .setNameLocalizations({
          "en-US": "value",
          de: "wert",
          fr: "valeur",
          ru: "значение",
          pl: "wartość",
          "es-ES": "valor",
          it: "valore",
          "zh-CN": "价值",
          ko: "가치",
          ja: "価値",
          "zh-TW": "價值",
          id: "nilai",
          tr: "değer",
        })
        .setDescription("Digite o valor arrecadado no evento ex: 1,000,000")
        .setDescriptionLocalizations({
          "en-US": "Enter the amount raised at the event ex: 1,000,000",
          de: "Geben Sie den Betrag ein, der bei der Veranstaltung eingenommen wurde, z. B. 1.000.000",
          fr: "Entrez le montant collecté lors de l'événement ex : 1 000 000",
          ru: "Введите сумму, собранную на мероприятии, например: 1 000 000",
          pl: "Wpisz kwotę zebrane na wydarzeniu, np. 1 000 000",
          "es-ES": "Ingrese la cantidad recaudada en el evento ej: 1,000,000",
          "pt-BR": "Digite o valor arrecadado no evento ex: 1,000,000",
          it: "Inserisci l'importo raccolto all'evento es: 1.000.000",
          "zh-CN": "输入活动筹集的金额，例如：1,000,000",
          ko: "이벤트에서 모금된 금액을 입력합니다. 예: 1,000,000",
          ja: "イベントで集められた金額を入力してください。例：1,000,000",
          "zh-TW": "輸入活動籌集的金額，例如：1,000,000",
          id: "Masukkan jumlah yang terkumpul di acara tersebut misalnya: 1.000.000",
          tr: "Etkinlikte toplanan miktarı girin örneğin: 1.000.000",
        })
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("atualizar-participacao")
    .setNameLocalizations({
      "en-US": "update-participation",
      de: "teilnahme-aktualisieren",
      fr: "mettre-a-jour-participation",
      ru: "obnovit-uchastie",
      pl: "aktualizuj-udzial",
      "es-ES": "actualizar-participacion",
      it: "aggiorna-partecipazione",
      "zh-CN": "gengxin-canyu",
      ko: "cham-yeo-updeiteu",
      ja: "sankasha-koushin",
      "zh-TW": "gengxin-canyu",
      id: "perbarui-partisipasi",
      tr: "katilimi-guncelle",
    })
    .setDescription("Atualizar o valor da participação de um membro")
    .setDescriptionLocalizations({
      "en-US": "Update the value of a member's participation",
      de: "Aktualisieren Sie den Wert der Teilnahme eines Mitglieds",
      fr: "Mettre à jour la valeur de la participation d'un membre",
      ru: "Обновить значение участия участника",
      pl: "Zaktualizuj wartość udziału członka",
      "es-ES": "Actualizar el valor de la participación de un miembro",
      it: "Aggiorna il valore della partecipazione di un membro",
      "zh-CN": "更新成员参与的价值",
      ko: "구성원의 참여 가치를 업데이트합니다.",
      ja: "メンバーの参加価値を更新する",
      "zh-TW": "更新成員參與的價值",
      id: "Memperbarui nilai partisipasi anggota",
      tr: "Bir üyenin katılım değerini güncelleyin",
    })
    .addUserOption((option) =>
      option
        .setName("membro")
        .setNameLocalizations({
          "en-US": "member",
          de: "mitglied",
          fr: "membre",
          ru: "участник",
          pl: "członek",
          "es-ES": "miembro",
          it: "membro",
          "zh-CN": "成员",
          ko: "구성원",
          ja: "メンバー",
          "zh-TW": "成員",
          id: "anggota",
          tr: "üye",
        })
        .setDescription("Digite o nome do membro ex: @membro")
        .setDescriptionLocalizations({
          "en-US": "Enter the member's name ex: @member",
          de: "Geben Sie den Namen des Mitglieds ein, z. B. @Mitglied",
          fr: "Entrez le nom du membre ex : @membre",
          ru: "Введите имя участника, например: @участник",
          pl: "Wpisz imię członka, np. @członek",
          "es-ES": "Ingrese el nombre del miembro ej: @miembro",
          it: "Inserisci il nome del membro es: @membro",
          "zh-CN": "输入成员的名称，例如：@成员",
          ko: "@구성원과 같은 구성원의 이름을 입력합니다.",
          ja: "@メンバーのようにメンバーの名前を入力します",
          "zh-TW": "輸入成員的名稱，例如：@成員",
          id: "Masukkan nama anggota mis. @anggota",
          tr: "@üye gibi üyenin adını girin",
        })
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("participacao")
        .setNameLocalizations({
          "en-US": "participation",
          de: "teilnahme",
          fr: "participation",
          ru: "участие",
          pl: "uczestnictwo",
          "es-ES": "participación",
          it: "partecipazione",
          "zh-CN": "参与",
          ko: "참여",
          ja: "参加",
          "zh-TW": "參與",
          id: "partisipasi",
          tr: "katılım",
        })
        .setDescription("atualizar porcentagem da participação (de 0 a 100) ex: 80")
        .setDescriptionLocalizations({
          "en-US": "update percentage of participation (from 0 to 100) ex: 80",
          de: "Aktualisieren Sie den Prozentsatz der Teilnahme (von 0 bis 100) z. B.: 80",
          fr: "Mettre à jour le pourcentage de participation (de 0 à 100) ex : 80",
          ru: "Обновите процент участия (от 0 до 100) например: 80",
          pl: "Zaktualizuj procent uczestnictwa (od 0 do 100) np.: 80",
          "es-ES": "actualizar porcentaje de participación (de 0 a 100) ej: 80",
          "pt-BR": "atualizar porcentagem da participação (de 0 a 100) ex: 80",
          it: "aggiorna percentuale di partecipazione (da 0 a 100) es: 80",
          "zh-CN": "更新参与百分比（从0到100）例如：80",
          ko: "(0~100)의 참여 비율을 업데이트합니다. 예:80",
          ja: "(0から100まで)参加の割合を更新します。例：80",
          "zh-TW": "更新參與百分比（從0到100）例如：80",
          id: "perbarui persentase partisipasi (dari 0 hingga 100) mis. : 80",
          tr: "% katılımı güncelleyin (0'dan %100'e kadar) örn. : %80",
        })
        .setRequired(true)
        .setMaxValue(100)
    ),
  new SlashCommandBuilder()
    .setName("atualizar-taxa-vendedor")
    .setNameLocalizations({
      "en-US": "update-seller-fee",
      de: "verkaeufer-tarif-aktualisieren",
      fr: "mettre-a-jour-taux-vendeur",
      ru: "obnovit-stavku-prodavca",
      pl: "aktualizuj-stawke-sprzedawcy",
      "es-ES": "actualizar-tasa-vendedor",
      it: "aggiorna-tasso-venditore",
      "zh-CN": "gengxin-maishou-lv",
      ko: "panmaeja-yul-update",
      ja: "urite-rate-koshin",
      "zh-TW": "gengxin-maishou-lv",
      id: "perbarui-tarif-penjual",
      tr: "satici-orani-guncelle",
    })
    .setDescription("Atualizar a taxa do vendedor")
    .setDescriptionLocalizations({
      "en-US": "Update the seller's fee",
      de: "Aktualisieren Sie den Verkäuferpreis",
      fr: "Mettre à jour le taux du vendeur",
      ru: "Обновить ставку продавца",
      pl: "Zaktualizuj stawkę sprzedawcy",
      "es-ES": "Actualizar la tasa del vendedor",
      it: "Aggiorna il tasso del venditore",
      "zh-CN": "更新卖方利率",
      ko: "판매자 요금 업데이트",
      ja: "売り手のレートを更新する",
      "zh-TW": "更新賣方利率",
      id: "Perbarui tarif penjual",
      tr: "satıcı oranını güncelleyin",
    })
    .addNumberOption((option) =>
      option
        .setName("taxa")
        .setDescriptionLocalizations({
          "en-US": "rate",
          de: "satz",
          fr: "taux",
          ru: "ставка",
          pl: "stawka",
          "es-ES": "tasa",
          it: "tasso",
          "zh-CN": "利率",
          ko: "세율",
          ja: "レート",
          "zh-TW": "利率",
          id: "tarif",
          tr: "oran",
        })
        .setDescription("Valor da nova taxa do vendedor (0 a 100) exemplo:50")
        .setDescriptionLocalizations({
          "en-US": "Value of the new seller rate (0 to 100) example:50",
          de: "Wert des neuen Verkäuferpreises (0 bis 100) Beispiel:50",
          fr: "Valeur du nouveau taux du vendeur (0 à 100) exemple : 50",
          ru: "Значение новой ставки продавца (от 0 до 100) пример:50",
          pl: "Wartość nowej stawki sprzedawcy (od 0 do 100) przykład:50",
          "es-ES": "Valor de la nueva tasa del vendedor (0 a 100) ejemplo:50",
          it: "Valore della nuova tariffa del venditore (da 0 a 100) esempio:50",
          "zh-CN": "卖方新利率的值（0 到 100）示例：50",
          ko: "(0~100)의 새로운 판매자 요금 값 예시 :50",
          ja: "(0から100まで)新しい売り手のレートの値例：50",
          "zh-TW": "賣方新利率的值（0到100）示例：50",
          id: "Nilai tarif penjual baru (0 hingga 100) contoh:50",
          tr: "Yeni satıcı oranının değeri (0'dan 100'e kadar) örnek:50",
        })
        .setMaxValue(100)
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("atualizar-taxa-guild")
    .setNameLocalizations({
      "en-US": "update-guild-fee",
      de: "gilde-tarif-aktualisieren",
      fr: "mettre-a-jour-taux-guilde",
      ru: "obnovit-stavku-gilda",
      pl: "aktualizuj-stawke-gildii",
      "es-ES": "actualizar-tasa-guild",
      it: "aggiorna-tasso-gilda",
      "zh-CN": "gengxin-guild-lv",
      ko: "gildeu-yul-update",
      ja: "gildeu-rate-koshin",
      "zh-TW": "gengxin-guild-lv",
      id: "perbarui-tarif-guild",
      tr: "gild-oranini-guncelle",
    })
    .setDescription("Atualizar a taxa da guild")
    .setDescriptionLocalizations({
      "en-US": "Update the guild fee",
      de: "Aktualisieren Sie den Gildenpreis",
      fr: "Mettre à jour le taux de la guilde",
      ru: "Обновить ставку гильдии",
      pl: "Zaktualizuj stawkę gildii",
      "es-ES": "Actualizar la tasa de la guild",
      it: "Aggiorna il tasso della gilda",
      "zh-CN": "更新公会利率",
      ko: "길드 요금 업데이트",
      ja: "ギルドレートを更新する",
      "zh-TW": "更新公會利率",
      id: "Perbarui tarif guild",
      tr: "gild oranını güncelleyin",
    })
    .addNumberOption((option) =>
      option
        .setName("taxa")
        .setNameLocalizations({
          "en-US": "rate",
          de: "satz",
          fr: "taux",
          ru: "ставка",
          pl: "stawka",
          "es-ES": "tasa",
          it: "tasso",
          "zh-CN": "利率",
          ko: "세율",
          ja: "レート",
          "zh-TW": "利率",
          id: "tarif",
          tr: "oran",
        })
        .setDescription("Valor da nova taxa da guild (0 a 100) exemplo:50")
        .setDescriptionLocalizations({
          "en-US": "Value of the new guild rate (0 to 100) example:50",
          de: "Wert des neuen Gildenpreises (0 bis 100) Beispiel:50",
          fr: "Valeur du nouveau taux de la guilde (0 à 100) exemple : 50",
          ru: "Значение новой ставки гильдии (от 0 до 100) пример:50",
          pl: "Wartość nowej stawki gildii (od 0 do 100) przykład:50",
          "es-ES": "Valor de la nueva tasa de la guild (0 a 100) ejemplo:50",
          it: "Valore della nuova tariffa della gilda (da 0 a 100) esempio:50",
          "zh-CN": "公会新利率的值（0 到 100）示例：50",
          ko: "(0~100)의 새로운 길드 요금 값 예시 :50",
          ja: "(0から100まで)新しいギルドのレートの値例：50",
          "zh-TW": "公會新利率的值（0到100）示例：50",
          id: "Nilai tarif guild baru (0 hingga 100) contoh:50",
          tr: "Yeni gild oranının değeri (0'dan 100'e kadar) örnek:50",
        })
        .setMaxValue(100)
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("depositar-evento")
    .setNameLocalizations({
      "en-US": "deposit-event",
      de: "einzahlen-event",
      fr: "deposer-evenement",
      ru: "vkladi-sobytie",
      pl: "wplac-wydarzenie",
      "es-ES": "depositar-evento",
      it: "depositare-evento",
      "zh-CN": "存入事件",
      ko: "ibenteu-deposit",
      ja: "ibento-shunyuu",
      "zh-TW": "存入事件",
      id: "setor-acara",
      tr: "olayi-deposit",
    })
    .setDescription("Depositar o valor do evento no saldo da guild")
    .setDescriptionLocalizations({
      "en-US": "Deposit the event amount into the guild balance",
      de: "Zahlen Sie den Veranstaltungsbetrag auf das Gildenguthaben ein",
      fr: "Déposer le montant de l'événement dans le solde de la guilde",
      ru: "Внесите сумму мероприятия на баланс гильдии",
      pl: "Wpłać kwotę wydarzenia na saldo gildii",
      "es-ES": "Depositar el monto del evento en el saldo de la guild",
      it: "Deposita l'importo dell'evento nel saldo della gilda",
      "zh-CN": "将活动金额存入公会余额",
      ko: "이벤트 금액을 길드 잔액에 입금합니다.",
      ja: "イベントの金額をギルドの残高に預けます",
      "zh-TW": "將活動金額存入公會餘額",
      id: "Setor jumlah acara ke saldo guild",
      tr: "Etkinlik tutarını gildin bakiyesine yatırın",
    })
    .addStringOption((input) =>
      input
        .setName("valor")
        .setNameLocalizations({
          "en-US": "value",
          de: "wert",
          fr: "valeur",
          ru: "значение",
          pl: "wartosc",
          "es-ES": "valor",
          it: "valore",
          "zh-CN": "价值",
          ko: "가치",
          ja: "価値",
          "zh-TW": "價值",
          id: "nilai",
          tr: "deger",
        })
        .setDescription("Valor a ser depositado ex: 1,000,000")
        .setDescriptionLocalizations({
          "en-US": "Value to be deposited ex: 1,000,000",
          de: "Betrag, der eingezahlt werden soll, z. B.: 1.000.000",
          fr: "Montant à déposer ex : 1 000 000",
          ru: "Сумма к депозиту, например: 1 000 000",
          pl: "Kwota do wpłaty, np.: 1 000 000",
          "es-ES": "Valor a depositar ej: 1,000,000",
          it: "Importo da depositare es: 1.000.000",
          "zh-CN": "要存入的金额，例如：1,000,000",
          ko: "예금할 금액 예: 1,000,000",
          ja: "預金額例：1,000,000",
          "zh-TW": "要存入的金額，例如：1,000,000",
          id: "Jumlah yang akan disetorkan misalnya: 1.000.000",
          tr: "Yatırılacak miktar örneğin: 1.000.000",
        })
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("meu-saldo")
    .setNameLocalizations({
      "en-US": "my-balance",
      de: "mein-guthaben",
      fr: "mon-solde",
      ru: "moe-saldo",
      pl: "moja-wartosc",
      "es-ES": "mi-saldo",
      it: "il-mio-saldo",
      "zh-CN": "wo-de-yu-e",
      ko: "na-ui-jango",
      ja: "watashi-no-zandaka",
      "zh-TW": "wo-de-yu-e",
      id: "saldo-saya",
      tr: "benim-bakiyem",
    })
    .setDescription("Consultar seu saldo atual")
    .setDescriptionLocalizations({
      "en-US": "Check your current balance",
      de: "Überprüfen Sie Ihr aktuelles Guthaben",
      fr: "Vérifiez votre solde actuel",
      ru: "Проверьте свой текущий баланс",
      pl: "Sprawdź swoje aktualne saldo",
      "es-ES": "Consultar su saldo actual",
      it: "Controlla il tuo saldo attuale",
      "zh-CN": "检查您当前的余额",
      ko: "현재 잔액 확인",
      ja: "現在の残高を確認する",
      "zh-TW": "檢查您當前的餘額",
      id: "Periksa saldo Anda saat ini",
      tr: "Mevcut bakiyenizi kontrol edin",
    }),
  new SlashCommandBuilder()
    .setName("saldos")
    .setNameLocalizations({
      "en-US": "balances",
      de: "salden",
      fr: "soldes",
      ru: "balansy",
      pl: "salda",
      "es-ES": "saldos",
      it: "saldos",
      "zh-CN": "yue-e",
      ko: "jango",
      ja: "zandaka",
      "zh-TW": "yue-e",
      id: "saldo",
      tr: "bakiyeler",
    })
    .setDescription("Consultar o saldo de todos os membros")
    .setDescriptionLocalizations({
      "en-US": "Check the balance of all members",
      de: "Uberprüfen Sie das Guthaben aller Mitglieder",
      fr: "Vérifiez le solde de tous les membres",
      ru: "Проверьте баланс всех участников",
      pl: "Sprawdź saldo wszystkich członków",
      "es-ES": "Consultar el saldo de todos los miembros",
      it: "Controlla il saldo di tutti i membri",
      "zh-CN": "检查所有成员的余额",
      ko: "모든 구성원의 잔액 확인",
      ja: "すべてのメンバーの残高を確認する",
      "zh-TW": "檢查所有成員的餘額",
      id: "Periksa saldo semua anggota",
      tr: "Tüm üyelerin bakiyesini kontrol edin",
    }),
  new SlashCommandBuilder()
    .setName("saldo-membro")
    .setNameLocalizations({
      "en-US": "member-balance",
      de: "mitglied-guthaben",
      fr: "membre-solde",
      ru: "uchastnik-saldo",
      pl: "czlonek-saldo",
      "es-ES": "saldo-membro",
      it: "saldo-membro",
      "zh-CN": "chengyuan-yue-e",
      ko: "chulwon-jango",
      ja: "zandaka",
      "zh-TW": "chengyuan-yue-e",
      id: "saldo-anggota",
      tr: "uye-bakiyesi",
    })
    .setDescription("Consultar o saldo de um membro")
    .setDescriptionLocalizations({
      "en-US": "Check the balance of a member",
      de: "Überprüfen Sie das Guthaben eines Mitglieds",
      fr: "Vérifiez le solde d'un membre",
      ru: "Проверьте баланс участника",
      pl: "Sprawdź saldo członka",
      "es-ES": "Consultar el saldo de un miembro",
      it: "Controlla il saldo di un membro",
      "zh-CN": "检查成员的余额",
      ko: "구성원의 잔액 확인",
      ja: "メンバーの残高を確認する",
      "zh-TW": "檢查成員的餘額",
      id: "Periksa saldo anggota",
      tr: "Bir üyenin bakiyesini kontrol edin",
    })
    .addUserOption((option) =>
      option
        .setName("membro")
        .setNameLocalizations({
          "en-US": "member",
          de: "mitglied",
          fr: "membre",
          ru: "участник",
          pl: "czlonek",
          "es-ES": "miembro",
          it: "membro",
          "zh-CN": "成员",
          ko: "구성원",
          ja: "メンバー",
          "zh-TW": "成員",
          id: "anggota",
          tr: "uye",
        })
        .setDescription("Digite o nome do membro ex: @membro")
        .setDescriptionLocalizations({
          "en-US": "Enter the member's name ex: @member",
          de: "Geben Sie den Namen des Mitglieds ein, z. B. @Mitglied",
          fr: "Entrez le nom du membre ex : @membre",
          ru: "Введите имя участника, например: @участник",
          pl: "Wpisz imię członka, np. @członek",
          "es-ES": "Ingrese el nombre del miembro ej: @miembro",
          it: "Inserisci il nome del membro es: @membro",
          "zh-CN": "输入成员的名称，例如：@成员",
          ko: "@구성원과 같은 구성원의 이름을 입력합니다.",
          ja: "@メンバーのようにメンバーの名前を入力します",
          "zh-TW": "@成員的名稱，例如：@成員",
          id: "Masukkan nama anggota mis. @anggota",
          tr: "@üye gibi üyenin adını girin",
        })
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("saldo-guild")
    .setNameLocalizations({
      "en-US": "guild-balance",
      de: "gilden-guthaben",
      fr: "solde-guilde",
      ru: "gilda-saldo",
      pl: "gildia-saldo",
      "es-ES": "saldo-guild",
      it: "saldo-gilda",
      "zh-CN": "gong-hui-yue-e",
      ko: "gil-deu-jango",
      ja: "zandaka",
      "zh-TW": "gong-hui-yue-e",
      id: "saldo-guild",
      tr: "gild-bakiyesi",
    })
    .setDescription("Consultar o saldo atual da guild")
    .setDescriptionLocalizations({
      "en-US": "Check the guild's current balance",
      de: "Überprüfen Sie das aktuelle Guthaben der Gilde",
      fr: "Vérifiez le solde actuel de la guilde",
      ru: "Проверьте текущий баланс гильдии",
      pl: "Sprawdź aktualne saldo gildii",
      "es-ES": "Consultar el saldo actual de la guild",
      it: "Controlla il saldo attuale della gilda",
      "zh-CN": "检查公会当前的余额",
      ko: "길드의 현재 잔액 확인",
      ja: "ギルドの現在の残高を確認する",
      "zh-TW": "檢查公會當前的餘額",
      id: "Periksa saldo guild saat ini",
      tr: "Gildin mevcut bakiyesini kontrol edin",
    }),
  new SlashCommandBuilder()
    .setName("depositar-guild")
    .setNameLocalizations({
      "en-US": "deposit-guild",
      de: "gilde-einzahlen",
      fr: "deposer-guilde",
      ru: "vkladi-gilda",
      pl: "wplac-gilde",
      "es-ES": "depositar-guild",
      it: "depositare-gilda",
      "zh-CN": "cunhuo-gong-hui",
      ko: "gil-deu-deposit",
      ja: "gildeu-shunyuu",
      "zh-TW": "cunhuo-gong-hui",
      id: "setor-guild",
      tr: "gildin-bakiyesine-yatir",
    })
    .setDescription("Depositar saldo na guild")
    .setDescriptionLocalizations({
      "en-US": "Deposit balance into guild",
      de: "Guthaben auf die Gilde einzahlen",
      fr: "Déposer le solde dans la guilde",
      ru: "Внесите баланс в гильдию",
      pl: "Wpłać saldo do gildii",
      "es-ES": "Depositar saldo en la guild",
      it: "Deposita il saldo nella gilda",
      "zh-CN": "将余额存入公会",
      ko: "길드 잔액 입금",
      ja: "ギルドに残高を預ける",
      "zh-TW": "將餘額存入公會",
      id: "Setor saldo ke guild",
      tr: "Gildin bakiyesini yatırın",
    })
    .addStringOption((option) =>
      option
        .setName("valor")
        .setNameLocalizations({
          "en-US": "value",
          de: "wert",
          fr: "valeur",
          ru: "znachenie",
          pl: "wartosc",
          "es-ES": "valor",
          it: "valore",
          "zh-CN": "价值",
          ko: "가치",
          ja: "価値",
          "zh-TW": "價值",
          id: "nilai",
          tr: "deger",
        })
        .setDescription("Valor a ser depositado no saldo da guild, ex: 1,000,000")
        .setDescriptionLocalizations({
          "en-US": "Value to be deposited into the guild balance, ex: 1,000,000",
          de: "Betrag, der auf das Gildenguthaben eingezahlt werden soll, z. B.: 1.000.000",
          fr: "Montant à déposer dans le solde de la guilde, ex : 1 000 000",
          ru: "Сумма, которую необходимо внести на баланс гильдии, например: 1 000 000",
          pl: "Kwota do wpłaty na saldo gildii, np.: 1 000 000",
          "es-ES": "Valor a depositar en el saldo de la guild, ej: 1,000,000",
          it: "Importo da depositare nel saldo della gilda, es: 1.000.000",
          "zh-CN": "要存入公会余额的金额，例如：1,000,000",
          ko: "길드 잔액에 입금할 금액 예: 1,000,000",
          ja: "ギルドの残高に預ける金額、例：1,000,000",
          "zh-TW": "要存入公會餘額的金額，例如：1,000,000",
          id: "Jumlah yang akan disetorkan ke guild misalnya: 1.000.000",
          tr: "Gildin bakiyesine yatırılacak miktar örneğin: 1.000.000",
        })
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("sacar-guild")
    .setNameLocalizations({
      "en-US": "withdraw-guild",
      de: "gilde-abheben",
      fr: "retirer-guilde",
      ru: "snyat-gildiya",
      pl: "wyplac-gildia",
      "es-ES": "retirar-guild",
      it: "preleva-gilda",
      "zh-CN": "提取公会",
      ko: "길드-출금",
      ja: "ギルド引き出し",
      "zh-TW": "提取公會",
      id: "tarik-guild",
      tr: "gild-cek",
    })
    .setDescription("Retirar valor do saldo da guild")
    .setDescriptionLocalizations({
      "en-US": "Withdraw value from guild balance",
      de: "Abheben von Wert aus dem Gildenguthaben",
      fr: "Retirer de la valeur du solde de la guilde",
      ru: "Vytashchit-tsennost-iz-gildii",
      pl: "Wypłata wartości z salda gildii",
      "es-ES": "Retirar valor del saldo de la guild",
      it: "Preleva valore dal saldo della gilda",
      "zh-CN": "从公会余额中提取价值",
      ko: "길드 잔액에서 가치 인출",
      ja: "ギルドの残高から価値を引き出す",
      "zh-TW": "從公會餘額中提取價值",
      id: "Tarik nilai dari saldo guild",
      tr: "Gildin bakiyesinden değer çekin",
    })
    .addStringOption((option) =>
      option
        .setName("valor")
        .setNameLocalizations({
          "en-US": "value",
          de: "wert",
          fr: "valeur",
          ru: "znachenie",
          pl: "wartosc",
          "es-ES": "valor",
          it: "valore",
          "zh-CN": "价值",
          ko: "가치",
          ja: "価値",
          "zh-TW": "價值",
          id: "nilai",
          tr: "deger",
        })
        .setDescription("Valor a ser retirado do saldo da guild, ex: 1,000,000")
        .setDescriptionLocalizations({
          "en-US": "Value to be withdrawn from the guild balance, ex: 1,000,000",
          de: "Betrag, der vom Gildenguthaben abgehoben werden soll, z. B.: 1.000.000",
          fr: "Montant à retirer du solde de la guilde, ex : 1 000 000",
          ru: "Сумма, которую необходимо снять с баланса гильдии, например: 1 000 000",
          pl: "Kwota do wypłaty z salda gildii, np.: 1 000 000",
          "es-ES": "Valor a retirar del saldo de la guild, ej: 1,000,000",
          it: "Importo da prelevare dal saldo della gilda, es: 1.000.000",
          "zh-CN": "要从公会余额中提取的金额，例如：1,000,000",
          ko: "길드 잔액에서 인출할 금액 예: 1,000,000",
          ja: "ギルドの残高から引き出す金額、例：1,000,000",
          "zh-TW": "要從公會餘額中提取的金額，例如：1,000,000",
          id: "Jumlah yang akan ditarik dari guild misalnya: 1.000.000",
          tr: "Gildin bakiyesinden çekilecek miktar örneğin: 1.000.000",
        })
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("lang")
    .setDescription("Alterar o idioma do bot")
    .setDescriptionLocalizations({
      "en-US": "Change the bot's language",
      de: "Ändern Sie die Sprache des Bots",
      fr: "Changer la langue du bot",
      ru: "Izmenit-yazyk-bota",
      pl: "Zmień język bota",
      "es-ES": "Cambiar el idioma del bot",
      it: "Cambia la lingua del bot",
      "zh-CN": "更改机器人的语言",
      ko: "봇의 언어 변경",
      ja: "ボットの言語を変更する",
      "zh-TW": "更改機器人的語言",
      id: "Ubah bahasa bot",
      tr: "Botun dilini değiştirin",
    })
    .addStringOption((option) =>
      option
        .setName("idioma")
        .setDescription("Escolha o idioma")
        .setDescriptionLocalizations({
          "en-US": "Choose the language",
          de: "Wählen Sie die Sprache",
          fr: "Choisissez la langue",
          ru: "Vyberite-yazyk",
          pl: "Wybierz język",
          "es-ES": "Elige el idioma",
          it: "Scegli la lingua",
          "zh-CN": "选择语言",
          ko: "언어 선택",
          ja: "言語を選択する",
          "zh-TW": "選擇語言",
          id: "Pilih bahasa",
          tr: "Dili seçin",
        })
        .setNameLocalizations({
          "en-US": "language",
          de: "sprache",
          fr: "langue",
          ru: "yazyk",
          pl: "jezyk",
          "es-ES": "idioma",
          it: "lingua",
          "zh-CN": "yuyan",
          ko: "eon-eo",
          ja: "gengo",
          "zh-TW": "yuyan",
          id: "bahasa",
          tr: "dil",
        })
        .setChoices(
          {
            name: "Português",
            value: "pt-BR",
          },
          {
            name: "English",
            value: "en-US",
          }
          // {
          //   name: "Deutsch",
          //   value: "de",
          // },
          // {
          //   name: "Français",
          //   value: "fr",
          // },
          // {
          //   name: "Русский",
          //   value: "ru",
          // },
          // {
          //   name: "Polski",
          //   value: "pl",
          // },
          // {
          //   name: "Español",
          //   value: "es-ES",
          // },
          // {
          //   name: "Italiano",
          //   value: "it",
          // },
          // {
          //   name: "中文 (简体)",
          //   value: "zh-CN",
          // },
          // {
          //   name: "한국어",
          //   value: "ko",
          // },
          // {
          //   name: "日本語",
          //   value: "ja",
          // },
          // {
          //   name: "中文 (繁體)",
          //   value: "zh-TW",
          // },
          // {
          //   name: "Bahasa Indonesia",
          //   value: "id",
          // },
          // {
          //   name: "Türkçe",
          //   value: "tr",
          // }
        )
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("pagar-membro")
    .setNameLocalizations({
      "en-US": "pay-member",
      de: "mitglied-bezahlen",
      fr: "payer-membre",
      ru: "platit-uchastnik",
      pl: "placic-czlonka",
      "es-ES": "pagar-membro",
      it: "pagare-membro",
      "zh-CN": "zhifu-chengyuan",
      ko: "myeong-deul-pay",
      ja: "zandaka-shiharau",
      "zh-TW": "zhifu-chengyuan",
      id: "bayar-anggota",
      tr: "uye-odeme",
    })
    .setDescription("Pagar um membro com o saldo da guild")
    .setDescriptionLocalizations({
      "en-US": "Pay a member with the guild balance",
      de: "Bezahlen Sie ein Mitglied mit dem Gildenguthaben",
      fr: "Payer un membre avec le solde de la guilde",
      ru: "Platite uchastniku s pomoshchyu gildii",
      pl: "Zapłać członkowi z salda gildii",
      "es-ES": "Pagar a un miembro con el saldo de la guild",
      it: "Paga un membro con il saldo della gilda",
      "zh-CN": "用公会余额支付成员",
      ko: "길드 잔액으로 구성원에게 지불합니다.",
      ja: "ギルドの残高でメンバーに支払います",
      "zh-TW": "用公會餘額支付成員",
      id: "Bayar anggota dengan saldo guild",
      tr: "Bir üyeye gildin bakiyesiyle ödeme yapın",
    })
    .addUserOption((option) =>
      option
        .setName("membro")
        .setNameLocalizations({
          "en-US": "member",
          de: "mitglied",
          fr: "membre",
          ru: "uchastnik",
          pl: "czlonek",
          "es-ES": "miembro",
          it: "membro",
          "zh-CN": "chengyuan",
          ko: "gu-seong-won",
          ja: "zandaka",
          "zh-TW": "chengyuan",
          id: "anggota",
          tr: "uye",
        })
        .setDescription("Membro que irá receber o pagamento")
        .setDescriptionLocalizations({
          "en-US": "Member who will receive the payment",
          de: "Mitglied, das die Zahlung erhält",
          fr: "Membre qui recevra le paiement",
          ru: "Uchastnik, kotoryi poluchit platezh",
          pl: "Członek, który otrzyma płatność",
          "es-ES": "Miembro que recibirá el pago",
          it: "Membro che riceverà il pagamento",
          "zh-CN": "将收到付款的成员",
          ko: "지불을 받을 구성원",
          ja: "支払いを受け取るメンバー",
          "zh-TW": "將收到付款的成員",
          id: "Anggota yang akan menerima pembayaran",
          tr: "Ödemeyi alacak üye",
        })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("valor")
        .setNameLocalizations({
          "en-US": "value",
          de: "wert",
          fr: "valeur",
          ru: "znachenie",
          pl: "wartosc",
          "es-ES": "valor",
          it: "valore",
          "zh-CN": "价值",
          ko: "가치",
          ja: "価値",
          "zh-TW": "價值",
          id: "nilai",
          tr: "deger",
        })
        .setDescription("Valor a ser pago ao membro, ex: 100,000")
        .setDescriptionLocalizations({
          "en-US": "Value to be paid to the member, ex: 100,000",
          de: "Betrag, der dem Mitglied zu zahlen ist, z. B.: 100.000",
          fr: "Montant à payer au membre, ex : 100 000",
          ru: "Suma k platezhu uchastniku, naprimer: 100 000",
          pl: "Kwota do zapłaty dla członka, np.: 100 000",
          "es-ES": "Valor a pagar al miembro, ej: 100,000",
          it: "Importo da pagare al membro, es: 100.000",
          "zh-CN": "要支付给成员的金额，例如：100,000",
          ko: "구성원에게 지불할 금액 예: 100,000",
          ja: "メンバーに支払う金額、例：100,000",
          "zh-TW": "要支付給成員的金額，例如：100,000",
          id: "Jumlah yang akan dibayarkan kepada anggota misalnya: 100.000",
          tr: "Üyeye ödenecek miktar örneğin: 100.000",
        })
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("confiscar-saldo")
    .setNameLocalizations({
      "en-US": "confiscate-balance",
      de: "konfiszieren-saldo",
      fr: "confisquer-solde",
      ru: "konfiskovat-saldo",
      pl: "konfiskata-saldo",
      "es-ES": "confiscar-saldo",
      it: "confisca-saldo",
      "zh-CN": "chao-jie-yue-e",
      ko: "jango-chuljeong",
      ja: "zandaka",
      "zh-TW": "chao-jie-yue-e",
      id: "menyita-saldo",
      tr: "bakiyeyi-el-koymak",
    })
    .setDescription("Confiscar o saldo de um membro e transferir para o saldo da guild")
    .setDescriptionLocalizations({
      "en-US": "Confiscate a member's balance and transfer it to the guild balance",
      de: "Konfiszieren Sie das Guthaben eines Mitglieds und überweisen Sie es auf das Gildenguthaben",
      fr: "Confisquer le solde d'un membre et le transférer au solde de la guilde",
      ru: "Konfiskovat-saldo-uchastnika-i-peredat-v-gildiyu",
      pl: "Skonfiskować saldo członka i przekazać je do gildii",
      "es-ES": "Confiscar el saldo de un miembro y transferirlo al saldo de la guild",
      it: "Confisca il saldo di un membro e trasferiscilo alla gilda",
      "zh-CN": "没收成员的余额并将其转入公会余额",
      ko: "구성원의 잔액을 압수하고 길드 잔액으로 이체합니다.",
      ja: "メンバーの残高を押収し、ギルドの残高に転送します",
      "zh-TW": "沒收成員的餘額並將其轉入公會餘額",
      id: "Menyita saldo anggota dan mentransfernya ke guild",
      tr: "Bir üyenin bakiyesini al ve gildin bakiyesine aktar",
    })
    .addUserOption((option) =>
      option
        .setName("membro")
        .setNameLocalizations({
          "en-US": "member",
          de: "mitglied",
          fr: "membre",
          ru: "uchastnik",
          pl: "czlonek",
          "es-ES": "miembro",
          it: "membro",
          "zh-CN": "chengyuan",
          ko: "gu-seong-won",
          ja: "zandaka",
          "zh-TW": "chengyuan",
          id: "anggota",
          tr: "uye",
        })
        .setDescription("Membro que tera seu saldo confiscado")
        .setDescriptionLocalizations({
          "en-US": "Member who will have their balance confiscated",
          de: "Mitglied, dessen Guthaben konfisziert wird",
          fr: "Membre qui aura son solde confisqué",
          ru: "Uchastnik, kotoryi budet konfiskovan",
          pl: "Członek, którego saldo zostanie skonfiskowane",
          "es-ES": "Miembro que tendrá su saldo confiscado",
          it: "Membro che avrà il saldo confiscato",
          "zh-CN": "将被没收余额的成员",
          ko: "잔액이 압수될 구성원",
          ja: "残高が押収されるメンバー",
          "zh-TW": "將被沒收餘額的成員",
          id: "Anggota yang akan disita saldonya",
          tr: "Bakiyesi el konulacak üye",
        })
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("transferir-saldo")
    .setNameLocalizations({
      "en-US": "transfer-balance",
      de: "transferieren-saldo",
      fr: "transfert-solde",
      ru: "peredat-saldo",
      pl: "transfer-saldo",
      "es-ES": "transferir-saldo",
      it: "trasferire-saldo",
      "zh-CN": "zhuan-zhi-yue-e",
      ko: "jango-transfer",
      ja: "zandaka-itiran",
      "zh-TW": "zhuan-zhi-yue-e",
      id: "transfer-saldo",
      tr: "bakiyeyi-transfer-etmek",
    })
    .setDescription("Tranfere saldo da sua conta para outro membro")
    .setDescriptionLocalizations({
      "en-US": "Transfer balance from your account to another member",
      de: "Übertragen Sie das Guthaben von Ihrem Konto auf ein anderes Mitglied",
      fr: "Transférer le solde de votre compte vers un autre membre",
      ru: "Peredat-saldo-s-vashego-akkaunta-drugomu-uchastniku",
      pl: "Przenieś saldo z Twojego konta na inne konto",
      "es-ES": "Transferir saldo de su cuenta a otro miembro",
      it: "Trasferisci il saldo dal tuo account a un altro membro",
      "zh-CN": "将余额从您的帐户转移到其他成员",
      ko: "계정의 잔액을 다른 구성원에게 이체합니다.",
      ja: "アカウントから別のメンバーに残高を転送する",
      "zh-TW": "將餘額從您的帳戶轉移到其他成員",
      id: "Transfer saldo dari akun Anda ke anggota lain",
      tr: "Bakiyenizi başka bir üyeye aktarın",
    })
    .addUserOption((option) =>
      option
        .setName("membro")
        .setNameLocalizations({
          "en-US": "member",
          de: "mitglied",
          fr: "membre",
          ru: "uchastnik",
          pl: "czlonek",
          "es-ES": "miembro",
          it: "membro",
          "zh-CN": "chengyuan",
          ko: "gu-seong-won",
          ja: "zandaka",
          "zh-TW": "chengyuan",
          id: "anggota",
          tr: "uye",
        })
        .setDescription("Membro que receberá o valor a ser transferido, ex: @membro")
        .setDescriptionLocalizations({
          "en-US": "Member who will receive the amount to be transferred, ex: @member",
          de: "Mitglied, das den zu überweisenden Betrag erhält, z. B.: @Mitglied",
          fr: "Membre qui recevra le montant à transférer, ex : @membre",
          ru: "Uchastnik, kotoryi poluchit summu dlya peredachi, naprimer: @uchastnik",
          pl: "Członek, który otrzyma kwotę do przelania, np.: @członek",
          "es-ES": "Miembro que recibirá el monto a transferir, ej: @miembro",
          it: "Membro che riceverà l'importo da trasferire, es: @membro",
          "zh-CN": "将收到要转移金额的成员，例如：@成员",
          ko: "@구성원과 같은 구성원이 이체할 금액을 받습니다.",
          ja: "@メンバーのように転送される金額を受け取るメンバー",
          "zh-TW": "@成員將收到轉移的金額，例如：@成員",
          id: "Anggota yang akan menerima jumlah yang akan ditransfer misalnya: @anggota",
          tr: "Aktarılacak tutarı alacak üye örneğin: @üye",
        })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("valor")
        .setNameLocalizations({
          "en-US": "value",
          de: "wert",
          fr: "valeur",
          ru: "значение",
          pl: "wartość",
          "es-ES": "valor",
          it: "valore",
          "zh-CN": "价值",
          ko: "가치",
          ja: "価値",
          "zh-TW": "價值",
          id: "nilai",
          tr: "deger",
        })
        .setDescription("Valor que será transferido")
        .setDescriptionLocalizations({
          "en-US": "Value to be transferred",
          de: "Zu überweisender Betrag",
          fr: "Montant à transférer",
          ru: "Suma, kotoruyu nuzhno peredat",
          pl: "Kwota do przelania",
          "es-ES": "Valor a transferir",
          it: "Valore da trasferire",
          "zh-CN": "要转移的金额",
          ko: "이체할 금액",
          ja: "転送する金額",
          "zh-TW": "轉移的金額",
          id: "Jumlah yang akan ditransfer",
          tr: "Aktarılacak miktar",
        })
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Para ver comandos disponíveis e entender os fluxos!")
    .setDescriptionLocalizations({
      "en-US": "To see available commands and understand the flows!",
      de: "Um verfügbare Befehle anzuzeigen und die Abläufe zu verstehen!",
      fr: "Pour voir les commandes disponibles et comprendre les flux !",
      ru: "Чтобы увидеть доступные команды и понять потоки!",
      pl: "Aby zobaczyć dostępne polecenia i zrozumieć przepływy!",
      "es-ES": "Para ver los comandos disponibles y comprender los flujos!",
      it: "Per vedere i comandi disponibili e comprendere i flussi!",
      "zh-CN": "查看可用命令并了解流程！",
      ko: "사용 가능한 명령을 보고 흐름을 이해하려면!",
      ja: "使用可能なコマンドを確認し、フローを理解するには！",
      "zh-TW": "查看可用命令並了解流程！",
      id: "Untuk melihat perintah yang tersedia dan memahami alur!",
      tr: "Mevcut komutları görmek ve akışları anlamak için!",
    }),
  new SlashCommandBuilder()
    .setName("remover-bot")
    .setNameLocalizations({
      "en-US": "remove-bot",
      de: "entfernen-bot",
      fr: "supprimer-bot",
      ru: "udalit-bot",
      pl: "usun-bota",
      "es-ES": "eliminar-bot",
      "pt-BR": "remover-bot",
      it: "rimuovi-bot",
      "zh-CN": "shanchu-dianhua",
      ko: "bot-remove",
      ja: "bot-remove",
      "zh-TW": "shanchu-dianhua",
      id: "hapus-bot",
      tr: "bot-kaldırmak",
    })
    .setDescription("Remove todas as salas e canais criados pelo bot")
    .setDescriptionLocalizations({
      "en-US": "Remove all rooms and channels created by the bot",
      de: "Entfernen Sie alle vom Bot erstellten Räume und Kanäle",
      fr: "Supprimer toutes les salles et canaux créés par le bot",
      ru: "Udalit vse komnaty i kanaly, sozdannye botom",
      pl: "Usuń wszystkie pokoje i kanały utworzone przez bota",
      "es-ES": "Eliminar todas las salas y canales creados por el bot",
      "pt-BR": "Remover todas as salas e canais criados pelo bot",
      it: "Rimuovi tutte le stanze e i canali creati dal bot",
      "zh-CN": "删除机器人创建的所有房间和频道",
      ko: "봇이 생성한 모든 방과 채널 제거",
      ja: "ボットが作成したすべての部屋とチャンネルを削除する",
      "zh-TW": "刪除機器人創建的所有房間和頻道",
      id: "Hapus semua ruang dan saluran yang dibuat oleh bot",
      tr: "Bot tarafından oluşturulan tüm odaları ve kanalları kaldırın",
    }),
  new SlashCommandBuilder()
    .setName("preco")
    .setNameLocalizations({
      "en-US": "price",
      de: "preis",
      fr: "prix",
      ru: "tsena",
      pl: "cena",
      "es-ES": "precio",
      it: "prezzo",
      "zh-CN": "jiage",
      ko: "gaegyeong",
      ja: "nedan",
      "zh-TW": "jiage",
      id: "harga",
      tr: "fiyat",
    })
    .setDescription("Consulta o valor de um item, é opcional buscar por cidade")
    .setDescriptionLocalizations({
      "en-US": "Check the value of an item, it is optional to search by city",
      de: "Überprüfen Sie den Wert eines Artikels, es ist optional, nach Stadt zu suchen",
      fr: "Vérifiez la valeur d'un article, il est facultatif de rechercher par ville",
      ru: "Prover'te tsenu tovara, neobkhodimo proverit' po gorodu",
      pl: "Sprawdź wartość przedmiotu, opcjonalnie wyszukaj według miasta",
      "es-ES": "Consulta el valor de un artículo, es opcional buscar por ciudad",
      it: "Controlla il valore di un articolo, è facoltativo cercare per città",
      "zh-CN": "检查商品的价值，可以选择按城市搜索",
      ko: "항목의 가치를 확인하십시오. 도시별 검색은 선택 사항입니다.",
      ja: "アイテムの価値を確認してください。都市別の検索はオプションです",
      "zh-TW": "檢查商品的價值，可以選擇按城市搜索",
      id: "Periksa nilai barang, opsional untuk mencari berdasarkan kota",
      tr: "Bir öğenin değerini kontrol edin, şehir bazında arama isteğe bağlıdır",
    })
    .addStringOption((option) =>
      option
        .setName("item")
        .setNameLocalizations({
          "en-US": "item",
          de: "artikel",
          fr: "article",
          ru: "tovar",
          pl: "przedmiot",
          "es-ES": "artículo",
          it: "articolo",
          "zh-CN": "dianhua",
          ko: "item",
          ja: "aitemu",
          "zh-TW": "dianhua",
          id: "barang",
          tr: "urun",
        })
        .setDescription("Item que deseja consulta o preço, exemplo: casaco de mercenário")
        .setDescriptionLocalizations({
          "en-US": "Item you want to check the price for, example: mercenary coat",
          de: "Artikel, für den Sie den Preis überprüfen möchten, z. B.: Söldnermantel",
          fr: "Article pour lequel vous souhaitez vérifier le prix, exemple : manteau de mercenaire",
          ru: "Tovar, dlya kotorogo vy khotite proverit' tsenu, naprimer: mantii naemnika",
          pl: "Przedmiot, którego cenę chcesz sprawdzić, np.: płaszcz najemnika",
          "es-ES": "Artículo para el que desea consultar el precio, ejemplo: abrigo de mercenario",
          it: "Articolo per cui desideri controllare il prezzo, ad esempio: cappotto da mercenario",
          "zh-CN": "您想查询价格的商品，例如：雇佣兵外套",
          ko: "가격을 확인하려는 항목 예: 용병 코트",
          ja: "価格を確認したいアイテム、例：傭兵コート",
          "zh-TW": "您想查詢價格的商品，例如：雇傭兵外套",
          id: "Barang yang ingin Anda periksa harganya, misalnya: mantel tentara bayaran",
          tr: "Fiyatını kontrol etmek istediğiniz ürün örneğin: paralı asker ceketi",
        })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("tier")
        .setNameLocalizations({
          "en-US": "tier",
          de: "stufe",
          fr: "niveau",
          ru: "uroven",
          pl: "poziom",
          "es-ES": "nivel",
          it: "livello",
          "zh-CN": "ji-ge",
          ko: "ti-er",
          ja: "ti-a",
          "zh-TW": "ji-ge",
          id: "tingkat",
          tr: "seviye",
        })
        .setDescription("Tier e encantamento do item, exemplo: 5.3")
        .setDescriptionLocalizations({
          "en-US": "Tier and enchantment of the item, example: 5.3",
          de: "Stufe und Verzauberung des Artikels, z. B.: 5.3",
          fr: "Niveau et enchantement de l'article, exemple : 5.3",
          ru: "Uroven' i zaklinanie tovara, naprimer: 5.3",
          pl: "Poziom i zaklęcie przedmiotu, np.: 5.3",
          "es-ES": "Nivel y encantamiento del artículo, ejemplo: 5.3",
          it: "Livello e incantesimo dell'articolo, es: 5.3",
          "zh-CN": "商品的等级和附魔，例如：5.3",
          ko: "아이템의 티어와 인챈트 예: 5.3",
          ja: "アイテムのティアとエンチャント、例：5.3",
          "zh-TW": "商品的等級和附魔，例如：5.3",
          id: "Tingkat dan pesona barang, contoh: 5.3",
          tr: "Ürünün seviyesi ve büyüsü örneğin: 5.3",
        })
    )
    .addStringOption((option) =>
      option
        .setName("cidade")
        .setNameLocalizations({
          "en-US": "city",
          de: "stadt",
          fr: "ville",
          ru: "gorod",
          pl: "miasto",
          "es-ES": "ciudad",
          it: "città",
          "zh-CN": "cheng-shi",
          ko: "si-dae",
          ja: "shi",
          "zh-TW": "cheng-shi",
          id: "kota",
          tr: "sehir",
        })
        .setDescription("Cidade onde o preço será consultado")
        .setDescriptionLocalizations({
          "en-US": "City where the price will be checked",
          de: "Stadt, in der der Preis überprüft wird",
          fr: "Ville où le prix sera vérifié",
          ru: "Gorod, v kotorom budet proverena tsena",
          pl: "Miasto, w którym zostanie sprawdzona cena",
          "es-ES": "Ciudad donde se consultará el precio",
          it: "Città in cui verrà controllato il prezzo",
          "zh-CN": "将检查价格的城市",
          ko: "가격이 확인될 도시",
          ja: "価格が確認される都市",
          "zh-TW": "將檢查價格的城市",
          id: "Kota tempat harga akan diperiksa",
          tr: "Fiyatın kontrol edileceği şehir",
        })
        .setChoices(
          { name: "Black Market", value: "3003" },
          { name: "Brecilien", value: "5003" },
          { name: "Bridgewatch", value: "2004" },
          { name: "Thetford", value: "0007" },
          { name: "Caerleon", value: "3005" },
          { name: "Fort Sterling", value: "4002" },
          { name: "Lymhurst", value: "1002" },
          { name: "Martlock", value: "3008" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("servidor")
        .setNameLocalizations({
          "en-US": "server",
          de: "server",
          fr: "serveur",
          ru: "server",
          pl: "serwer",
          "es-ES": "servidor",
          it: "server",
          "zh-CN": "fuwuqi",
          ko: "seobeo",
          ja: "saba",
          "zh-TW": "fuwuqi",
          id: "server",
          tr: "sunucu",
        })
        .setDescription("Nome do servidor do jogo")
        .setDescriptionLocalizations({
          "en-US": "Select the game server",
          de: "Wähle den Spielserver",
          fr: "Sélectionnez le serveur du jeu",
          ru: "Выберите игровой сервер",
          pl: "Wybierz serwer gry",
          "es-ES": "Selecciona el servidor del juego",
          it: "Seleziona il server di gioco",
          "zh-CN": "选择游戏服务器",
          ko: "게임 서버를 선택하세요",
          ja: "ゲームサーバーを選択してください",
          "zh-TW": "選擇遊戲伺服器",
          id: "Pilih server game",
          tr: "Oyun sunucusunu seçin",
        })
        .setChoices(
          { name: "Americas (West)", value: "west" },
          { name: "Asia (East)", value: "east" },
          { name: "Europe", value: "europe" }
        )
    ),
  new SlashCommandBuilder()
    .setName("depositar-membro")
    .setNameLocalizations({
      "en-US": "deposit-member",
      de: "einzahlen-mitglied",
      fr: "deposer-membre",
      ru: "vnesite-uchastnik",
      pl: "wplac-czlonek",
      "es-ES": "depositar-miembro",
      it: "deposito-membro",
      "zh-CN": "存款成员",
      ko: "gu-seong-won-deposit",
      ja: "zandaka-itiran",
      "zh-TW": "存款成員",
      id: "setor-anggota",
      tr: "uye-yatırmak",
    })
    .setDescription("Deposita um valor no saldo de um membro")
    .setDescriptionLocalizations({
      "en-US": "Deposit an amount in a member's balance",
      de: "Einzahlen eines Betrags auf das Guthaben eines Mitglieds",
      fr: "Déposer un montant sur le solde d'un membre",
      ru: "Vnesite summu na balans uchastnika",
      pl: "Wpłać kwotę na saldo członka",
      "es-ES": "Depositar un monto en el saldo de un miembro",
      it: "Deposita un importo nel saldo di un membro",
      "zh-CN": "在成员的余额中存入金额",
      ko: "구성원의 잔액에 금액을 입금합니다.",
      ja: "メンバーの残高に金額を預ける",
      "zh-TW": "在成員的餘額中存入金額",
      id: "Setor jumlah ke saldo anggota",
      tr: "Bir üyenin bakiyesine bir miktar yatırın",
    })
    .addUserOption((option) =>
      option
        .setName("membro")
        .setNameLocalizations({
          "en-US": "member",
          de: "mitglied",
          fr: "membre",
          ru: "uchastnik",
          pl: "czlonek",
          "es-ES": "miembro",
          it: "membro",
          "zh-CN": "chengyuan",
          ko: "gu-seong-won",
          ja: "zandaka",
          "zh-TW": "chengyuan",
          id: "anggota",
          tr: "uye",
        })
        .setDescription("Membro que irá receber o valor no saldo, ex: @membro")
        .setDescriptionLocalizations({
          "en-US": "Member who will receive the amount in the balance, ex: @member",
          de: "Mitglied, das den Betrag auf dem Guthaben erhält, z. B.: @Mitglied",
          fr: "Membre qui recevra le montant dans le solde, ex : @membre",
          ru: "Uchastnik, kotoryi poluchit summu na balanse, naprimer: @uchastnik",
          pl: "Członek, który otrzyma kwotę na saldzie, np.: @członek",
          "es-ES": "Miembro que recibirá el monto en el saldo, ej: @miembro",
          it: "Membro che riceverà l'importo nel saldo, es: @membro",
          "zh-CN": "将收到余额金额的成员，例如：@成员",
          ko: "@구성원과 같은 구성원이 잔액을 받습니다.",
          ja: "@メンバーのように残高を受け取るメンバー",
          "zh-TW": "@成員將收到餘額金額，例如：@成員",
          id: "Anggota yang akan menerima jumlah di saldo misalnya: @anggota",
          tr: "Bakiyede miktarı alacak üye örneğin: @üye",
        })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("valor")
        .setNameLocalizations({
          "en-US": "value",
          de: "wert",
          fr: "valeur",
          ru: "znachenie",
          pl: "wartosc",
          "es-ES": "valor",
          it: "valore",
          "zh-CN": "价值",
          ko: "가치",
          ja: "価値",
          "zh-TW": "價值",
          id: "nilai",
          tr: "deger",
        })
        .setDescription("Valor a ser depositado no saldo de um membro, ex: 1,000,000")
        .setDescriptionLocalizations({
          "en-US": "Value to be deposited into the guild balance, ex: 1,000,000",
          de: "Betrag, der auf das Gildenguthaben eingezahlt werden soll, z. B.: 1.000.000",
          fr: "Montant à déposer dans le solde de la guilde, ex : 1 000 000",
          ru: "Сумма, которую необходимо внести на баланс гильдии, например: 1 000 000",
          pl: "Kwota do wpłaty na saldo gildii, np.: 1 000 000",
          "es-ES": "Valor a depositar en el saldo de la guild, ej: 1,000,000",
          it: "Importo da depositare nel saldo della gilda, es: 1.000.000",
          "zh-CN": "要存入公会余额的金额，例如：1,000,000",
          ko: "길드 잔액에 입금할 금액 예: 1,000,000",
          ja: "ギルドの残高に預ける金額、例：1,000,000",
          "zh-TW": "要存入公會餘額的金額，例如：1,000,000",
          id: "Jumlah yang akan disetorkan ke guild misalnya: 1.000.000",
          tr: "Gildin bakiyesine yatırılacak miktar örneğin: 1.000.000",
        })
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("arquivar-evento")
    .setNameLocalizations({
      "en-US": "archive-event",
      de: "archivieren-event",
      fr: "archiver-evenement",
      ru: "arkhivirovat-sobytiye",
      pl: "archiwizowac-wydarzenie",
      "es-ES": "archivar-evento",
      it: "archiviare-evento",
      "zh-CN": "归档事件",
      ko: "gu-seong-won-ji-geum",
      ja: "zandaka-itiran",
      "zh-TW": "gu-seong-won-ji-geum",
      id: "arsipkan-acara",
      tr: "etkinlik-arsivle",
    })
    .setDescription("Arquivar o evento atual no canal #financeiro e exclui o canal do evento")
    .setDescriptionLocalizations({
      "en-US": "Archive the event in the #financeiro channel and delete the event channel",
      de: "Archivieren Sie das Ereignis im Kanal #financeiro und löschen Sie den Ereigniskanal",
      fr: "Archiver l'événement dans le canal #financeiro et supprimer le canal de l'événement",
      ru: "Arkhivirovat-sobytiye-v-kanale-finansovom-i-udalit-kanal-sobytiya",
      pl: "Zarchiwizuj wydarzenie w kanale finansowym i usuń kanał wydarzenia",
      "es-ES": "Archivar el evento en el canal #financiero y eliminar el canal del evento",
      it: "Archivia l'evento nel canale #finanziario ed elimina il canale dell'evento",
      "zh-CN": "在#financeiro频道中归档事件并删除事件频道",
      ko: "#재무 채널에서 이벤트를 아카이브하고 이벤트 채널을 삭제합니다.",
      ja: "#財務チャンネルでイベントをアーカイブし、イベントチャンネルを削除します。",
      "zh-TW": "#財務頻道中歸檔事件並刪除事件頻道",
      id: "Arsipkan acara di saluran #keuangan dan hapus saluran acara",
      tr: "#finans kanalında etkinliği arşivleyin ve etkinlik kanalını silin",
    }),
  new SlashCommandBuilder()
    .setName("price-lang")
    .setDescription("Alterar a linguagem do bot de preços do mercado")
    .setDescriptionLocalizations({
      "en-US": "Change the language of the market price bot",
      de: "Ändern Sie die Sprache des Marktpreis-Bots",
      fr: "Changer la langue du bot de prix du marché",
      ru: "Izmenit-yazyk-bota-rynka-tsen",
      pl: "Zmień język bota cen rynkowych",
      "es-ES": "Cambiar el idioma del bot de precios del mercado",
      it: "Cambia la lingua del bot dei prezzi di mercato",
      "zh-CN": "更改市场价格机器人的语言",
      ko: "시장 가격 봇의 언어를 변경합니다.",
      ja: "市場価格ボットの言語を変更する",
      "zh-TW": "更改市場價格機器人的語言",
      id: "Ubah bahasa bot harga pasar",
      tr: "Pazar fiyatı botunun dilini değiştirin",
    })
    .addStringOption((option) =>
      option
        .setName("idioma")
        .setNameLocalizations({
          "en-US": "language",
          de: "sprache",
          fr: "langue",
          ru: "yazyk",
          pl: "jezyk",
          "es-ES": "idioma",
          it: "lingua",
          "zh-CN": "yuyan",
          ko: "eon-eo",
          ja: "gengo",
          "zh-TW": "yuyan",
          id: "bahasa",
          tr: "dil",
        })
        .setDescription("Idioma que deseja alterar")
        .setDescriptionLocalizations({
          "en-US": "Language you want to change",
          de: "Sprache, die Sie ändern möchten",
          fr: "Langue que vous souhaitez changer",
          ru: "Yazyk, kotoryi vy khotite izmenit'",
          pl: "Język, który chcesz zmienić",
          "es-ES": "Idioma que desea cambiar",
          it: "Lingua che desideri cambiare",
          "zh-CN": "您想更改的语言",
          ko: "변경할 언어",
          ja: "変更したい言語",
          "zh-TW": "您想更改的語言",
          id: "Bahasa yang ingin Anda ubah",
          tr: "Değiştirmek istediğiniz dil",
        })
        .setRequired(true)
        .setChoices({ name: "Português", value: "pt-BR" }, { name: "English", value: "en-US" })
    ),
];
