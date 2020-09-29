#!/usr/bin/env node
const { program } = require('commander');
const path = require('path');
const fs = require('fs');
const { getJsonFiles, getAst, getCode, createDir } = require('./utils');

program
    .option('-s, --source [value]', '需要处理的源文件路径')
    .option('-o, --out [value]', '处理后输出路径')
    .option('-i, --install [value]', '测试入参二次加工', function myParseInt(value, dummyPrevious) {
        return parseInt(value) + 1;
    })
    .option('-k, --kill [value]', 'kill进程')
    .option('--no-sauce', 'Remove sauce')
    .requiredOption('-c, --cheese <type>', 'pizza must have cheese', 'init -c')
    .parse(process.argv);
let config = {
    out: 'dist' // 默认输出到dist文件夹
}

if ('source' in program) {
    config.source = program.source;
}
if ('out' in program) {
    config.out = program.out;
}
if (!config.source) {
    console.error('未输入编译入口，通过 -s 传入')
    process.exit()
}

// 获取.babelrc文件下的配置内容
let babelrcExists = fs.existsSync('./.babelrc');
if (babelrcExists) {
    let babelrc =  fs.readFileSync('./.babelrc', 'utf-8');
    if (babelrc) {
        babelrc = JSON.parse(babelrc);
        for (let k in babelrc) {
            config[k] = babelrc[k];
        }
    }
}

// 获取源文件夹下所有文件名称
let fileNames = getJsonFiles(config.source);

// 遍历处理所有的文件
fileNames.forEach((item) => {
    let outPath = item.replace(config.source, config.out);
    // dirPath 当前构建资源的文件夹路径，如果不存在，直接writeFileSync会报错，故需要判断是否存在，如果不存在，需要先创建，再writeFileSync
    let dirPath = outPath.split('\\');
    dirPath.pop();
    dirPath = dirPath.join('\\')

    // 判断当前out文件夹是否存在
    createDir(config.out)

    // 只处理js文件，其他后缀文件直接copy
    if (item.indexOf('.js') != -1) {
        let ast = getAst(item);
        // 遍历执行所有.babelrc 文件里注册的插件
        if (config.plugins && Object.prototype.toString.call(config.plugins) == '[object Array]') {
            config.plugins.forEach((item) => {
                let name = item[0];
                let plugin = require(`./plugins/${name}.js`);
                if (plugin) {
                    plugin(ast, item[1])
                }
            })
        }
        let code = getCode(ast)
        try {
            createDir(dirPath)
            fs.writeFileSync(outPath, code)
            console.info(`${outPath} 输出成功`)
        } catch (err) { 
            console.error(`构建失败：${err}`) 
        }
    } else {
        try {
            let content =  fs.readFileSync(item, 'utf-8');
            createDir(dirPath)
            fs.writeFileSync(outPath, content)
            console.info(`${outPath} 输出成功`)
        } catch (err) { 
            console.error(`构建失败：${err}`) 
        }
    }
})

