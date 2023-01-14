const fs = require("fs");

class DB extends Map {
    constructor(path = path.join('data', 'data.json'), params = {
        temp: false,
        saveInterval: 0
    }) {
        super(Object.entries(JSON.parse(fs.readFileSync(path).toString() || "{}")));

        this.path = path;

        if (params.temp) fs.writeFileSync(this.path, "{}");
        if (params.saveInterval !== 0) setInterval(this.save, params.saveInterval)
    }

    set(...data) {
      super.set(...data);
      this.save();
    }

    delete(...data) {
      super.delete(...data);
      this.save();
    }

    save() {
      fs.writeFileSync(this.path, JSON.stringify([...this]))
    }
}
module.exports = DB;