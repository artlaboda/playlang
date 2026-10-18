// Фразы для режима «Фразы». Группа = грамматическая конструкция; tier — ступень сложности:
// 1 — выживание (A1), 2 — простые утверждения (A1+), 3 — вопросы и просьбы (A2),
// 4 — прошлое и планы (A2+), 5 — опыт, советы, сравнения (B1), 6 — условия, залог, косвенная речь (B2).
// Одни и те же ситуации в обоих языках, чтобы переводы совпадали по смыслу.
window.LANGS.en.phrases = [
  { id: 'greet', tier: 1, name: 'Greetings', ru: 'приветствия и вежливость', items: [
    ['Hello!','Здравствуйте!'],['Good morning!','Доброе утро!'],['Good night!','Спокойной ночи!'],['Thank you!','Спасибо!'],
    ['Please.','Пожалуйста.'],['Excuse me.','Извините.'],["I'm sorry.",'Мне жаль.'],['See you later!','Увидимся позже!'],
    ['Nice to meet you.','Приятно познакомиться.'],['Goodbye!','До свидания!'] ] },
  { id: 'tobe', tier: 1, name: 'I am…', ru: 'как я себя чувствую', items: [
    ["I'm hungry.",'Я голоден.'],["I'm tired.",'Я устал.'],["I'm cold.",'Мне холодно.'],["I'm ready.",'Я готов.'],
    ["I'm at home.",'Я дома.'],["I'm late.",'Я опаздываю.'],["I'm fine.",'У меня всё хорошо.'],["It's hot today.",'Сегодня жарко.'] ] },
  { id: 'present', tier: 2, name: 'Present Simple', ru: 'привычки и факты', items: [
    ['I like coffee.','Я люблю кофе.'],['I live in Madrid.','Я живу в Мадриде.'],['She works in a bank.','Она работает в банке.'],
    ['We speak English.','Мы говорим по-английски.'],["I don't eat meat.",'Я не ем мясо.'],["He doesn't drive.",'Он не водит машину.'],
    ['They play football on Sundays.','По воскресеньям они играют в футбол.'],['I get up at seven.','Я встаю в семь.'] ] },
  { id: 'have', tier: 2, name: 'have / there is', ru: 'есть, имеется', items: [
    ['I have a brother.','У меня есть брат.'],['There is a cafe near here.','Здесь рядом есть кафе.'],
    ['There are two beds.','Там две кровати.'],["I don't have time.",'У меня нет времени.'] ] },
  { id: 'questions', tier: 3, name: 'Questions', ru: 'вопросы', items: [
    ['Where is the station?','Где вокзал?'],['How much is it?','Сколько это стоит?'],['What time is it?','Который час?'],
    ['Do you speak Russian?','Ты говоришь по-русски?'],["What's your name?",'Как тебя зовут?'],['How are you?','Как дела?'],
    ['Where are you from?','Откуда ты?'],['Can you help me?','Ты можешь мне помочь?'] ] },
  { id: 'requests', tier: 3, name: 'can / would like', ru: 'просьбы', items: [
    ['Can I have the bill, please?','Счёт, пожалуйста.'],["I'd like a coffee.",'Я бы хотел кофе.'],
    ['Could you repeat that?','Не могли бы вы повторить?'],['Can I pay by card?','Можно оплатить картой?'],
    ['A table for two, please.','Столик на двоих, пожалуйста.'],['Could you speak more slowly?','Можете говорить помедленнее?'] ] },
  { id: 'past', tier: 4, name: 'Past Simple', ru: 'что было', items: [
    ['I went to the beach yesterday.','Вчера я ходил на пляж.'],['We saw a good film.','Мы посмотрели хороший фильм.'],
    ["She didn't call me.",'Она мне не позвонила.'],['Did you sleep well?','Ты хорошо спал?'],['I lost my keys.','Я потерял ключи.'],
    ['It rained all day.','Весь день шёл дождь.'] ] },
  { id: 'future', tier: 4, name: 'going to / will', ru: 'планы и решения', items: [
    ["I'm going to visit my parents.",'Я собираюсь навестить родителей.'],["It's going to rain.",'Сейчас пойдёт дождь.'],
    ["I'll call you tomorrow.",'Я позвоню тебе завтра.'],["We're going to buy a car.",'Мы собираемся купить машину.'],
    ["I'll help you.",'Я тебе помогу.'],['Will you come to the party?','Ты придёшь на вечеринку?'] ] },
  { id: 'continuous', tier: 4, name: 'Present Continuous', ru: 'прямо сейчас', items: [
    ["I'm cooking dinner.",'Я готовлю ужин.'],['What are you doing?','Что ты делаешь?'],
    ["She's talking on the phone.",'Она говорит по телефону.'],["It's snowing.",'Идёт снег.'] ] },
  { id: 'perfect', tier: 5, name: 'Present Perfect', ru: 'опыт и результат', items: [
    ["I've never been to London.",'Я никогда не был в Лондоне.'],['Have you ever tried sushi?','Ты когда-нибудь пробовал суши?'],
    ["I've just finished.",'Я только что закончил.'],["She's lived here for ten years.",'Она живёт здесь десять лет.'],
    ["We haven't decided yet.",'Мы ещё не решили.'],["I've lost my phone.",'Я потерял телефон.'] ] },
  { id: 'modals', tier: 5, name: 'should / have to / mustn’t', ru: 'советы и обязанности', items: [
    ['You should see a doctor.','Тебе стоит сходить к врачу.'],['I have to work tomorrow.','Мне завтра нужно работать.'],
    ["You mustn't smoke here.",'Здесь нельзя курить.'],["You don't have to come.",'Тебе не обязательно приходить.'],
    ['We should leave now.','Нам пора уходить.'] ] },
  { id: 'compare', tier: 5, name: 'Comparatives', ru: 'сравнение', items: [
    ['This one is cheaper.','Этот дешевле.'],["She's taller than me.",'Она выше меня.'],
    ["It's the best day of my life.",'Это лучший день в моей жизни.'],["Today is colder than yesterday.",'Сегодня холоднее, чем вчера.'] ] },
  { id: 'usedto', tier: 5, name: 'used to', ru: 'раньше, но не теперь', items: [
    ['I used to live in Moscow.','Раньше я жил в Москве.'],['He used to smoke.','Раньше он курил.'],
    ['When I was a child, I used to play outside.','Когда я был ребёнком, я играл на улице.'] ] },
  { id: 'conditionals', tier: 6, name: 'Conditionals', ru: 'условия', items: [
    ["If it rains, we'll stay at home.",'Если пойдёт дождь, мы останемся дома.'],
    ['If I had more time, I would travel.','Если бы у меня было больше времени, я бы путешествовал.'],
    ["If I were you, I'd accept the offer.",'На твоём месте я бы принял предложение.'],
    ["If I had known, I would have come.",'Если бы я знал, я бы пришёл.'],
    ['What would you do if you won?','Что бы ты сделал, если бы выиграл?'] ] },
  { id: 'wishes', tier: 6, name: 'I wish / I hope', ru: 'пожелания и сожаления', items: [
    ['I hope you like it.','Надеюсь, тебе понравится.'],['I want you to come.','Я хочу, чтобы ты пришёл.'],
    ["I'm glad you're here.",'Я рад, что ты здесь.'],['When you arrive, call me.','Когда приедешь, позвони мне.'],
    ['I wish it were sunny tomorrow.','Хоть бы завтра было солнечно.'] ] },
  { id: 'passive', tier: 6, name: 'Passive voice', ru: 'страдательный залог', items: [
    ['The museum was built in 1900.','Музей был построен в 1900 году.'],['English is spoken here.','Здесь говорят по-английски.'],
    ['My bike has been stolen.','У меня украли велосипед.'],['The meeting has been cancelled.','Встречу отменили.'] ] },
  { id: 'reported', tier: 6, name: 'Reported speech', ru: 'косвенная речь', items: [
    ['She said she was tired.','Она сказала, что устала.'],['He asked me where I lived.','Он спросил, где я живу.'],
    ['They told us to wait.','Они сказали нам подождать.'] ] },
];

window.LANGS.es.phrases = [
  { id: 'greet', tier: 1, name: 'Saludos', ru: 'приветствия и вежливость', items: [
    ['¡Hola!','Привет!'],['¡Buenos días!','Доброе утро!'],['¡Buenas noches!','Спокойной ночи!'],['¡Gracias!','Спасибо!'],
    ['Por favor.','Пожалуйста.'],['Perdón.','Извините.'],['Lo siento.','Мне жаль.'],['¡Hasta luego!','Увидимся позже!'],
    ['Encantado.','Приятно познакомиться.'],['¡Adiós!','До свидания!'] ] },
  { id: 'estado', tier: 1, name: 'estar / tener', ru: 'как я себя чувствую', items: [
    ['Tengo hambre.','Я голоден.'],['Estoy cansado.','Я устал.'],['Tengo frío.','Мне холодно.'],['Estoy listo.','Я готов.'],
    ['Estoy en casa.','Я дома.'],['Llego tarde.','Я опаздываю.'],['Estoy bien.','У меня всё хорошо.'],['Hoy hace calor.','Сегодня жарко.'] ] },
  { id: 'presente', tier: 2, name: 'Presente', ru: 'привычки и факты', items: [
    ['Me gusta el café.','Я люблю кофе.'],['Vivo en Madrid.','Я живу в Мадриде.'],['Ella trabaja en un banco.','Она работает в банке.'],
    ['Hablamos inglés.','Мы говорим по-английски.'],['No como carne.','Я не ем мясо.'],['Él no conduce.','Он не водит машину.'],
    ['Los domingos juegan al fútbol.','По воскресеньям они играют в футбол.'],['Me levanto a las siete.','Я встаю в семь.'] ] },
  { id: 'hay', tier: 2, name: 'tener / hay', ru: 'есть, имеется', items: [
    ['Tengo un hermano.','У меня есть брат.'],['Hay un café cerca de aquí.','Здесь рядом есть кафе.'],
    ['Hay dos camas.','Там две кровати.'],['No tengo tiempo.','У меня нет времени.'] ] },
  { id: 'preguntas', tier: 3, name: 'Preguntas', ru: 'вопросы', items: [
    ['¿Dónde está la estación?','Где вокзал?'],['¿Cuánto cuesta?','Сколько это стоит?'],['¿Qué hora es?','Который час?'],
    ['¿Hablas ruso?','Ты говоришь по-русски?'],['¿Cómo te llamas?','Как тебя зовут?'],['¿Qué tal?','Как дела?'],
    ['¿De dónde eres?','Откуда ты?'],['¿Me puedes ayudar?','Ты можешь мне помочь?'] ] },
  { id: 'pedir', tier: 3, name: 'Pedir: quería / ¿puede…?', ru: 'просьбы', items: [
    ['La cuenta, por favor.','Счёт, пожалуйста.'],['Quería un café.','Я бы хотел кофе.'],
    ['¿Puede repetirlo?','Не могли бы вы повторить?'],['¿Puedo pagar con tarjeta?','Можно оплатить картой?'],
    ['Una mesa para dos, por favor.','Столик на двоих, пожалуйста.'],['¿Puede hablar más despacio?','Можете говорить помедленнее?'] ] },
  { id: 'indefinido', tier: 4, name: 'Pretérito indefinido', ru: 'что было (законченное)', items: [
    ['Ayer fui a la playa.','Вчера я ходил на пляж.'],['Vimos una buena película.','Мы посмотрели хороший фильм.'],
    ['Ella no me llamó.','Она мне не позвонила.'],['¿Dormiste bien?','Ты хорошо спал?'],['Perdí las llaves.','Я потерял ключи.'],
    ['Llovió todo el día.','Весь день шёл дождь.'] ] },
  { id: 'futuro', tier: 4, name: 'Ir a + infinitivo / futuro', ru: 'планы и решения', items: [
    ['Voy a visitar a mis padres.','Я собираюсь навестить родителей.'],['Va a llover.','Сейчас пойдёт дождь.'],
    ['Te llamaré mañana.','Я позвоню тебе завтра.'],['Vamos a comprar un coche.','Мы собираемся купить машину.'],
    ['Te ayudo yo.','Я тебе помогу.'],['¿Vendrás a la fiesta?','Ты придёшь на вечеринку?'] ] },
  { id: 'gerundio', tier: 4, name: 'Estar + gerundio', ru: 'прямо сейчас', items: [
    ['Estoy cocinando la cena.','Я готовлю ужин.'],['¿Qué estás haciendo?','Что ты делаешь?'],
    ['Ella está hablando por teléfono.','Она говорит по телефону.'],['Está nevando.','Идёт снег.'] ] },
  { id: 'perfecto', tier: 5, name: 'Pretérito perfecto', ru: 'опыт и результат', items: [
    ['Nunca he estado en Londres.','Я никогда не был в Лондоне.'],['¿Has probado alguna vez el sushi?','Ты когда-нибудь пробовал суши?'],
    ['Acabo de terminar.','Я только что закончил.'],['Lleva diez años viviendo aquí.','Она живёт здесь десять лет.'],
    ['Todavía no hemos decidido.','Мы ещё не решили.'],['He perdido el móvil.','Я потерял телефон.'] ] },
  { id: 'obligacion', tier: 5, name: 'deber / tener que', ru: 'советы и обязанности', items: [
    ['Deberías ir al médico.','Тебе стоит сходить к врачу.'],['Mañana tengo que trabajar.','Мне завтра нужно работать.'],
    ['Aquí no se puede fumar.','Здесь нельзя курить.'],['No hace falta que vengas.','Тебе не обязательно приходить.'],
    ['Tenemos que irnos ya.','Нам пора уходить.'] ] },
  { id: 'comparativos', tier: 5, name: 'Comparativos', ru: 'сравнение', items: [
    ['Este es más barato.','Этот дешевле.'],['Ella es más alta que yo.','Она выше меня.'],
    ['Es el mejor día de mi vida.','Это лучший день в моей жизни.'],['Hoy hace más frío que ayer.','Сегодня холоднее, чем вчера.'] ] },
  { id: 'imperfecto', tier: 5, name: 'Pretérito imperfecto', ru: 'раньше, но не теперь', items: [
    ['Antes vivía en Moscú.','Раньше я жил в Москве.'],['Él fumaba antes.','Раньше он курил.'],
    ['Cuando era niño, jugaba en la calle.','Когда я был ребёнком, я играл на улице.'] ] },
  { id: 'condicional', tier: 6, name: 'Si + subjuntivo / condicional', ru: 'условия', items: [
    ['Si llueve, nos quedaremos en casa.','Если пойдёт дождь, мы останемся дома.'],
    ['Si tuviera más tiempo, viajaría.','Если бы у меня было больше времени, я бы путешествовал.'],
    ['Yo que tú, aceptaría la oferta.','На твоём месте я бы принял предложение.'],
    ['Si lo hubiera sabido, habría venido.','Если бы я знал, я бы пришёл.'],
    ['¿Qué harías si ganaras?','Что бы ты сделал, если бы выиграл?'] ] },
  { id: 'subjuntivo', tier: 6, name: 'Subjuntivo', ru: 'пожелания и эмоции', items: [
    ['Espero que te guste.','Надеюсь, тебе понравится.'],['Quiero que vengas.','Я хочу, чтобы ты пришёл.'],
    ['Me alegra que estés aquí.','Я рад, что ты здесь.'],['Cuando llegues, llámame.','Когда приедешь, позвони мне.'],
    ['Ojalá haga sol mañana.','Хоть бы завтра было солнечно.'] ] },
  { id: 'pasiva', tier: 6, name: 'Pasiva / se impersonal', ru: 'страдательный залог', items: [
    ['El museo fue construido en 1900.','Музей был построен в 1900 году.'],['Aquí se habla inglés.','Здесь говорят по-английски.'],
    ['Me han robado la bici.','У меня украли велосипед.'],['Se ha cancelado la reunión.','Встречу отменили.'] ] },
  { id: 'indirecto', tier: 6, name: 'Estilo indirecto', ru: 'косвенная речь', items: [
    ['Dijo que estaba cansada.','Она сказала, что устала.'],['Me preguntó dónde vivía.','Он спросил, где я живу.'],
    ['Nos dijeron que esperáramos.','Они сказали нам подождать.'] ] },
];
