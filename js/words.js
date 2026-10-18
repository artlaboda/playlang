// Банк слов: категории = корзины. Каждое слово встречается только в одной категории.
window.CATEGORIES = [
  { id: 'animals', en: 'Animals', ru: 'Животные', icon: '🐾', color: '#f2a65a', words: [
    ['cat','кошка'],['dog','собака'],['horse','лошадь'],['cow','корова'],['rabbit','кролик'],['mouse','мышь'],
    ['lion','лев'],['tiger','тигр'],['bear','медведь'],['wolf','волк'],['fox','лиса'],['monkey','обезьяна'],
    ['elephant','слон'],['giraffe','жираф'],['sheep','овца'],['goat','коза'],['pig','свинья'],['duck','утка'],
    ['owl','сова'],['snake','змея'],['frog','лягушка'],['dolphin','дельфин'],['squirrel','белка'],['hedgehog','ёж'],['turtle','черепаха'] ] },
  { id: 'food', en: 'Food', ru: 'Еда', icon: '🍞', color: '#e8c468', words: [
    ['bread','хлеб'],['cheese','сыр'],['butter','сливочное масло'],['soup','суп'],['rice','рис'],['egg','яйцо'],
    ['meat','мясо'],['sausage','колбаса'],['pancake','блин'],['porridge','каша'],['sandwich','бутерброд'],['pizza','пицца'],
    ['salad','салат'],['honey','мёд'],['sugar','сахар'],['salt','соль'],['cake','торт'],['cookie','печенье'],
    ['jam','варенье'],['noodles','лапша'],['pie','пирог'],['yogurt','йогурт'] ] },
  { id: 'fruitveg', en: 'Fruit & Veg', ru: 'Фрукты и овощи', icon: '🍎', color: '#ef6f6c', words: [
    ['apple','яблоко'],['banana','банан'],['pear','груша'],['grape','виноград'],['lemon','лимон'],['cherry','вишня'],
    ['strawberry','клубника'],['peach','персик'],['plum','слива'],['watermelon','арбуз'],['pineapple','ананас'],
    ['carrot','морковь'],['potato','картофель'],['tomato','помидор'],['cucumber','огурец'],['cabbage','капуста'],
    ['onion','лук'],['garlic','чеснок'],['pumpkin','тыква'],['pepper','перец'],['apricot','абрикос'],['raspberry','малина'] ] },
  { id: 'colors', en: 'Colors', ru: 'Цвета', icon: '🎨', color: '#c792ea', words: [
    ['red','красный'],['blue','синий'],['green','зелёный'],['yellow','жёлтый'],['black','чёрный'],['white','белый'],
    ['grey','серый'],['brown','коричневый'],['pink','розовый'],['purple','фиолетовый'],['orange','оранжевый'],
    ['gold','золотой'],['silver','серебряный'],['beige','бежевый'],['turquoise','бирюзовый'],['navy','тёмно-синий'],
    ['scarlet','алый'],['lilac','сиреневый'],['crimson','малиновый'],['emerald','изумрудный'] ] },
  { id: 'body', en: 'Body', ru: 'Тело', icon: '🖐', color: '#f7a8b8', words: [
    ['head','голова'],['hand','кисть руки'],['arm','рука'],['leg','нога'],['foot','ступня'],['eye','глаз'],
    ['ear','ухо'],['nose','нос'],['mouth','рот'],['tooth','зуб'],['tongue','язык'],['hair','волосы'],
    ['neck','шея'],['shoulder','плечо'],['knee','колено'],['finger','палец'],['elbow','локоть'],['heart','сердце'],
    ['back','спина'],['chin','подбородок'],['cheek','щека'],['eyebrow','бровь'],['stomach','живот'] ] },
  { id: 'clothes', en: 'Clothes', ru: 'Одежда', icon: '👕', color: '#7fb7e8', words: [
    ['shirt','рубашка'],['dress','платье'],['skirt','юбка'],['trousers','брюки'],['jeans','джинсы'],['jacket','куртка'],
    ['coat','пальто'],['sweater','свитер'],['hat','шляпа'],['cap','кепка'],['scarf','шарф'],['gloves','перчатки'],
    ['socks','носки'],['shoes','туфли'],['boots','ботинки'],['sneakers','кроссовки'],['belt','ремень'],['tie','галстук'],
    ['hoodie','толстовка'],['pajamas','пижама'],['shorts','шорты'] ] },
  { id: 'weather', en: 'Weather', ru: 'Погода', icon: '🌦', color: '#8fd3e8', words: [
    ['rain','дождь'],['snow','снег'],['wind','ветер'],['cloud','облако'],['storm','буря'],['fog','туман'],
    ['thunder','гром'],['lightning','молния'],['sunshine','солнечный свет'],['rainbow','радуга'],['frost','мороз'],
    ['hail','град'],['breeze','лёгкий ветерок'],['heat','жара'],['drizzle','морось'],['puddle','лужа'],
    ['blizzard','метель'],['hurricane','ураган'],['tornado','смерч'],['ice','лёд'] ] },
  { id: 'jobs', en: 'Jobs', ru: 'Профессии', icon: '🧑‍🔧', color: '#f5b971', words: [
    ['doctor','врач'],['teacher','учитель'],['nurse','медсестра'],['driver','водитель'],['cook','повар'],['farmer','фермер'],
    ['pilot','пилот'],['engineer','инженер'],['lawyer','юрист'],['dentist','стоматолог'],['firefighter','пожарный'],
    ['sailor','моряк'],['baker','пекарь'],['artist','художник'],['singer','певец'],['actor','актёр'],['builder','строитель'],
    ['plumber','сантехник'],['waiter','официант'],['programmer','программист'],['scientist','учёный'],
    ['journalist','журналист'],['mechanic','механик'],['vet','ветеринар'] ] },
  { id: 'transport', en: 'Transport', ru: 'Транспорт', icon: '🚲', color: '#9ad48a', words: [
    ['car','машина'],['bus','автобус'],['train','поезд'],['plane','самолёт'],['bicycle','велосипед'],['ship','корабль'],
    ['boat','лодка'],['taxi','такси'],['tram','трамвай'],['subway','метро'],['truck','грузовик'],['motorcycle','мотоцикл'],
    ['helicopter','вертолёт'],['scooter','самокат'],['rocket','ракета'],['van','фургон'],['ferry','паром'],['yacht','яхта'],
    ['tractor','трактор'],['ambulance','скорая помощь'] ] },
  { id: 'home', en: 'Home', ru: 'Дом', icon: '🛋', color: '#d9b38c', words: [
    ['table','стол'],['chair','стул'],['sofa','диван'],['bed','кровать'],['wardrobe','шкаф'],['lamp','лампа'],
    ['mirror','зеркало'],['carpet','ковёр'],['shelf','полка'],['pillow','подушка'],['blanket','одеяло'],['curtain','штора'],
    ['window','окно'],['door','дверь'],['kitchen','кухня'],['bathroom','ванная'],['bedroom','спальня'],['ceiling','потолок'],
    ['floor','пол'],['stairs','лестница'],['fridge','холодильник'] ] },
  { id: 'nature', en: 'Nature', ru: 'Природа', icon: '🌲', color: '#6fcf97', words: [
    ['tree','дерево'],['flower','цветок'],['grass','трава'],['river','река'],['lake','озеро'],['sea','море'],
    ['ocean','океан'],['mountain','гора'],['forest','лес'],['field','поле'],['hill','холм'],['island','остров'],
    ['desert','пустыня'],['beach','пляж'],['stone','камень'],['leaf','лист'],['sky','небо'],['star','звезда'],
    ['moon','луна'],['waterfall','водопад'],['valley','долина'],['volcano','вулкан'],['cave','пещера'] ] },
  { id: 'feelings', en: 'Feelings', ru: 'Чувства', icon: '💛', color: '#ffd166', words: [
    ['happy','счастливый'],['sad','грустный'],['angry','злой'],['tired','уставший'],['scared','испуганный'],
    ['bored','скучающий'],['excited','взволнованный'],['surprised','удивлённый'],['proud','гордый'],['nervous','нервный'],
    ['calm','спокойный'],['lonely','одинокий'],['jealous','ревнивый'],['worried','обеспокоенный'],['grateful','благодарный'],
    ['confused','растерянный'],['ashamed','пристыженный'],['curious','любопытный'],['furious','разъярённый'],
    ['cheerful','весёлый'],['upset','расстроенный'] ] },
  { id: 'sports', en: 'Sports', ru: 'Спорт', icon: '⚽', color: '#5fd0c4', words: [
    ['football','футбол'],['tennis','теннис'],['hockey','хоккей'],['boxing','бокс'],['swimming','плавание'],
    ['skiing','лыжный спорт'],['running','бег'],['volleyball','волейбол'],['basketball','баскетбол'],['golf','гольф'],
    ['chess','шахматы'],['cycling','велоспорт'],['surfing','сёрфинг'],['wrestling','борьба'],['karate','карате'],
    ['yoga','йога'],['skating','катание на коньках'],['rowing','гребля'],['climbing','скалолазание'],
    ['archery','стрельба из лука'],['fencing','фехтование'],['diving','дайвинг'] ] },
  { id: 'actions', en: 'Actions', ru: 'Действия', icon: '🏃', color: '#ff9f80', words: [
    ['jump','прыгать'],['read','читать'],['write','писать'],['sing','петь'],['dance','танцевать'],['sleep','спать'],
    ['eat','есть'],['drink','пить'],['listen','слушать'],['speak','говорить'],['think','думать'],['buy','покупать'],
    ['sell','продавать'],['open','открывать'],['close','закрывать'],['laugh','смеяться'],['cry','плакать'],
    ['build','строить'],['wash','мыть'],['draw','рисовать'],['fly','летать'],['catch','ловить'],['throw','бросать'],
    ['forget','забывать'],['remember','помнить'] ] },
  { id: 'school', en: 'School', ru: 'Школа', icon: '✏️', color: '#a3b8ff', words: [
    ['pen','ручка'],['pencil','карандаш'],['book','книга'],['notebook','тетрадь'],['ruler','линейка'],['eraser','ластик'],
    ['backpack','рюкзак'],['desk','парта'],['blackboard','доска'],['scissors','ножницы'],['glue','клей'],['map','карта'],
    ['globe','глобус'],['calculator','калькулятор'],['dictionary','словарь'],['lesson','урок'],['homework','домашнее задание'],
    ['exam','экзамен'],['marker','маркер'],['stapler','степлер'],['timetable','расписание'] ] },
];

// Сложность слов для режима «Перевод»: 1 — самые простые (A1), 2 — A2,
// остальные слова из категорий — 3 (B1), дополнительные — 4 (B1–B2) и 5 (C1).
window.WORD_TIERS = {
  1: 'cat dog horse cow mouse lion bear fox pig duck bread cheese soup egg meat pizza cake apple banana lemon tomato potato ' +
     'red blue green yellow black white pink brown head hand leg eye ear nose mouth hair dress hat shoes socks shirt ' +
     'rain snow wind cloud doctor teacher driver car bus train plane taxi table chair bed door window sofa lamp ' +
     'tree flower sea river sky star moon happy sad football tennis chess read write sing dance sleep eat drink open pen book map desk',
  2: 'rabbit tiger wolf monkey elephant sheep goat snake frog owl butter rice salad honey sugar salt cookie pie pear grape cherry ' +
     'strawberry carrot cucumber onion orange grey purple gold silver arm foot tooth neck finger heart back knee jacket coat skirt ' +
     'jeans sweater scarf gloves boots cap shorts storm fog ice heat thunder rainbow nurse cook farmer pilot singer actor artist ' +
     'bicycle ship boat truck rocket kitchen bathroom bedroom floor mirror carpet pillow fridge forest mountain lake ocean island ' +
     'beach grass leaf tired angry scared bored hockey boxing swimming skiing running basketball volleyball jump listen speak think ' +
     'buy sell close laugh cry wash draw fly pencil notebook ruler backpack lesson homework exam dictionary',
};

window.EXTRA_WORDS = [
  // 4 — B1–B2
  ['achieve','достигать',4],['advice','совет',4],['ancient','древний',4],['anxious','тревожный',4],['approach','подход',4],
  ['argue','спорить',4],['available','доступный',4],['avoid','избегать',4],['behaviour','поведение',4],['belief','убеждение',4],
  ['borrow','брать взаймы',4],['brave','храбрый',4],['budget','бюджет',4],['careful','осторожный',4],['challenge','вызов',4],
  ['compare','сравнивать',4],['complain','жаловаться',4],['confident','уверенный',4],['consider','рассматривать',4],
  ['convince','убеждать',4],['decrease','уменьшать',4],['deny','отрицать',4],['depend','зависеть',4],['deserve','заслуживать',4],
  ['disappear','исчезать',4],['environment','окружающая среда',4],['evidence','доказательство',4],['explain','объяснять',4],
  ['failure','неудача',4],['freedom','свобода',4],['generous','щедрый',4],['guilty','виноватый',4],['habit','привычка',4],
  ['honest','честный',4],['improve','улучшать',4],['include','включать',4],['knowledge','знание',4],['lazy','ленивый',4],
  ['mistake','ошибка',4],['opinion','мнение',4],['patient','терпеливый',4],['permission','разрешение',4],['prevent','предотвращать',4],
  ['provide','обеспечивать',4],['purpose','цель',4],['reason','причина',4],['refuse','отказываться',4],['rely','полагаться',4],
  ['require','требовать',4],['rude','грубый',4],['shy','застенчивый',4],['silence','тишина',4],['skill','навык',4],
  ['solve','решать',4],['suggest','предлагать',4],['surround','окружать',4],['threat','угроза',4],['trust','доверие',4],
  ['wealth','богатство',4],['weird','странный',4],['journey','путешествие',4],['neighbour','сосед',4],['regret','сожалеть',4],
  // 5 — C1
  ['abundant','обильный',5],['ambiguous','двусмысленный',5],['assess','оценивать',5],['bewildered','озадаченный',5],
  ['blunt','прямолинейный',5],['cautious','осмотрительный',5],['coherent','связный',5],['compelling','убедительный',5],
  ['conceal','скрывать',5],['contempt','презрение',5],['cumbersome','громоздкий',5],['daunting','пугающий',5],
  ['deceive','обманывать',5],['diligent','усердный',5],['dismiss','отвергать',5],['eloquent','красноречивый',5],
  ['elusive','неуловимый',5],['endeavour','стремление',5],['feasible','осуществимый',5],['fragile','хрупкий',5],
  ['frugal','бережливый',5],['grim','мрачный',5],['hinder','препятствовать',5],['inevitable','неизбежный',5],
  ['meticulous','дотошный',5],['negligible','незначительный',5],['notorious','печально известный',5],['obsolete','устаревший',5],
  ['ominous','зловещий',5],['persevere','упорствовать',5],['plausible','правдоподобный',5],['profound','глубокий',5],
  ['reluctant','неохотный',5],['resilient','стойкий',5],['scarce','скудный',5],['scrutiny','тщательная проверка',5],
  ['subtle','едва уловимый',5],['tedious','утомительный',5],['thrive','процветать',5],['ubiquitous','вездесущий',5],
  ['vague','расплывчатый',5],['vivid','яркий',5],['wary','настороженный',5],['whim','каприз',5],['yearn','тосковать',5],
  ['zealous','ревностный',5],['candid','откровенный',5],['gloomy','унылый',5],['fierce','свирепый',5],['swift','стремительный',5],
];

// Близкие по смыслу слова никогда не попадают в одни корзины вместе.
window.SYNONYMS = [
  'anxious worried nervous', 'careful cautious wary', 'weird surprised', 'ancient obsolete', 'grim ominous gloomy sad',
  'furious angry fierce', 'scared daunting', 'happy cheerful', 'diligent meticulous zealous', 'confident brave proud',
  'dismiss refuse deny', 'tedious bored tired', 'bewildered confused surprised', 'persevere resilient', 'plausible feasible',
  'thrive achieve improve', 'rely trust depend', 'hinder prevent avoid', 'shy ashamed guilty', 'opinion belief',
  'blunt rude honest candid', 'silence calm', 'compelling convince', 'evidence knowledge', 'lonely sad upset',
  'elusive subtle', 'scarce frugal', 'purpose reason', 'journey ferry', 'gold yellow', 'navy blue',
  'scarlet crimson red', 'lilac purple pink', 'emerald green turquoise', 'hand arm finger', 'foot leg', 'shoes boots sneakers',
  'cap hat', 'jacket coat', 'sweater hoodie', 'rain drizzle', 'storm hurricane tornado thunder', 'wind breeze', 'frost ice snow',
  'boat ship yacht ferry', 'car taxi', 'subway train tram', 'sea ocean', 'hill mountain', 'stone volcano',
  'excited happy cheerful', 'upset sad', 'cook baker', 'notebook book', 'pen pencil marker', 'blackboard desk',
  'bicycle cycling', 'swimming diving', 'wardrobe shelf', 'blanket pillow', 'pancake pie cake', 'butter cheese',
  'porridge rice', 'jam honey', 'cookie cake', 'sunshine heat',
];
