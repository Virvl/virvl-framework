const fs = require("fs");

/**
 * JSON-Database. Простой аналог `quickDB`.
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
                let c = "", xv;
                if (i > 0) {c = ","};
                vv += `${c}\n   "${k}": ${JSON.stringify(v)}`;
                i++;
            });
            return vv + "\n}";
        };
        function save() {let d = bake(_db); fs.writeFileSync(db_path, d)};

        /**
         * Автоматический сброс базы данных при запуске.
         */
        if (params.temp) {
            fs.writeFileSync(db_path, "{}"); //сброс ДБ для кэш-баз
        };

        /**
         * Автоматическое сохранение базы данных.
         */
        if (params.saveTime !== 0) {
            setInterval(save, params.saveTime) //авто-сейв базы данных
        };

        if (!params.noLog) console.log("[*] База данных успешно инициализирована.");
    };
};
module.exports = DB;