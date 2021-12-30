const fs = require('fs');
const chavascript = require('chavascript');

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
            if(this.verifyExtensionIncluded(extention)) {
                this.generateCompiledFile(file_path, extention);
            }
        });
    }

    filePath (directory, file) {
        return `${directory}/${file}`;
    }

    verifyNotExcluded(directory) {
        return !this.config.exclude.includes(directory);
    }

    findExtension(file) {
        const period_place = file.lastIndexOf('.');
        return file.substr(period_place + 1);
    }

    verifyExtensionIncluded(extention) {
        return this.config.file_formats && this.config.file_formats.includes(extention);
    }

    getFileDirectory(file_path) {
        const last_period = file_path.lastIndexOf('.');
        const last_slash = file_path.lastIndexOf('/');
        if(last_period < last_slash) return file_path;
        return file_path.substr(0,last_slash);
    }

    generateCompiledFile(file_path, extention) {
        const destination = this.config.destination || this.root;
        const file_content = fs.readFileSync(file_path, 'utf8');
        const compiled_file = chavascript.transpile(file_content);
        const renamed_file = `${file_path.substr(0,file_path.length - extention.length)}js`;
        console.log({file_path, renamed_file});
        const destination_file = this.filePath(destination,renamed_file);
        const destination_dir = this.getFileDirectory(renamed_file);
        if(!fs.existsSync(destination_file)){
         console.log("ofer");
            fs.mkdirSync(destination_dir,{recursive:true});
        }
        fs.writeFileSync(destination_file, compiled_file);
    }
}

module.exports = Compiler;