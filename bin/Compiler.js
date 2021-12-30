const fs = require('fs');

class Compiler {
    config = {};
    root = null;

    constructor(config, root) {
        this.config = config;
        this.root = root;
        this.init();
    }

    init() {
        this.goOverAllFiles(this.root);
    }

    goOverAllFiles (directory) {
        fs.readdirSync(directory).forEach(file => {
            let file_path = this.filePath(directory,file);
            console.log(file_path);
            if(fs.lstatSync(file_path).isDirectory() && this.verifyNotExcluded(file_path)) {
                return this.goOverAllFiles(file_path);
            }
            let extention = this.findExtension(file_path);
        });
    }

    filePath (directory, file) {
        return `${directory}/${file}`;
    }

    verifyNotExcluded(directory) {
        return !this.config.exclude.includes(directory);
    }
}

module.exports = Compiler;