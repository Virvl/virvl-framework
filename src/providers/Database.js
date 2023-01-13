const fs = require("fs");

/**
 * JSON-Database. Простой аналог `quickDB`.
 * 
 * **ИСПОЛЬЗОВАНИЕ**:
 * 
 * `const db = new FW_DB(path, options)`, где
 * - `path` — путь до базы данных, включая имя файла и его расширение
 * - `options` *(необяз.)* — дополнительные параметры (*параметры датабазы, см. ниже*)
 * 
 * ===
 * 
 * **ПАРАМЕТРЫ ДАТАБАЗЫ (необязательные):**
 * ```js
 * {
 *  saveTime: 5000, //Автоматическое сохранение базы данных. Измеряется в милесекундах (1000 = 1 сек). `0` чтобы выключить. Стандартное значение - `0`
 *  temp: false, //Временная ли база данных? Если `true`, сбрасывает базу данных при каждом запуске. Стандартное значение - `false`
 *  noLog: false //Убрать логи? Стандартное значение - `false`
 * }
 * ```
 * 
 * ===
 * 
 * **МЕТОДЫ:**
 * - `db.wr(переменная, значение)` — Записать значение в базу данных. Моментально сохраняет кэш базы данных ('Map'-объект) в файл датабазы (не требует сохранение).
 * - `db.set(переменная, значение)` — Записать значение в кэш базы данных. Требует сохранение базы данных.
 * - `db.get(переменная)` — Получить переменную из базы данных.
 * - `db.delete|del(переменная)` — Удалить переменную из базы данных. Требует сохранение базы данных.
 * - `db.has(переменная)` — Проверка на наличие переменной в базе данных. Возвращает 'boolean'.
 * - `db.save()` — Сохранить кэш базы данных в ваш файл. Желательно использовать в конце кода.
 * 
 * ===
 * 
 * **ПРИМЕР:**
 * 
 * ```js
 * const { FW_DB } = require("./FW_Database"); //импортируем набор
 * const db = new FW_DB("./database.sql", { saveTime: 1000 }); //объявляем базу данных. Указываем путь до базы данных. Параметры, такие как saveTime, укзывать необязательно.
 * ```
 */
class DB extends Map {
    constructor(db_path,params={
        temp: false,
        saveTime: 0,
        noLog: false
    }) {
        let _db = new Map(Object.entries(JSON.parse(fs.readFileSync(db_path).toString() ?? "{}")));

        function bake(d) {
            let vv = "{", i = 0;
            d.forEach((v, k) => {
                let c = "";
                if (i > 0) {c = ","};
                vv += `${c}\n   "${k}": ${JSON.stringify(v)}`;
                i++;
            });
            return vv + "\n}";
        };

        function save() {let d = bake(_db); fs.writeFileSync(db_path, d)};

        this.del=(k) => super.delete(k);
        this.save=() => save();

        if (params.temp) {
            fs.writeFileSync(db_path, "{}"); //сброс ДБ для кэш-баз
        };

        if (params.saveTime !== 0) {
            setInterval(save, params.saveTime) //авто-сейв базы данных
        };

        if (!params.noLog) console.log("[*] База данных успешно инициализирована.");
    };
};
module.exports = DB;