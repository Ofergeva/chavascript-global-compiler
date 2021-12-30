const Compiler = require('./bin/Compiler');

const compile = () => {
    const args = prepareArgs();
    const config = getGivenConfig(args.config) || getDefaultConfig();
    const root = args.path || process.cwd();
    const compiler = new Compiler(config,root);
}

const prepareArgs = () => {
    const args_array = process.argv.slice(2);
    if(args_array.length % 2) throw "invalid number of arguments";
    const args = {};
    args_array.forEach((arg, index) => {
        if(index % 2) {
            args[args_array[index - 1].replace(/-/g,"")] = arg;
        }
    });

    return args;
}

const getGivenConfig = (path) => {
    const cleared_path = path.substr(-1) === "/" ? path.substr(0,path.length - 1) : path;
    const config = require(`./${cleared_path}/chsconfig.json`);
    return config;
}

const getDefaultConfig = () => {
    return {
        files_formats: ["chs"],
        exclude: ["node_modules"]
    }
}

compile();