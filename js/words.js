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
