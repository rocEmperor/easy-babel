const types = require('@babel/types');
const traverse = require("@babel/traverse").default;

/**
 * 一个简单的插件 可以在bebel编译过程中，将某些变量名做替换, config在.babelrc文件内配置
 * @param {Object} ast 
 */
module.exports = function (ast, config = {}) {
    // let body = ast.program.body;
    // body && body.forEach(item => {
    //     if (item.type == 'VariableDeclaration') {
    //         let id = item.declarations[0].id;
    //         if (id.name == 'cc') {
    //             item.declarations[0].id = types.Identifier('A_哈哈');
    //         }
    //     }
    // })
    if (Object.keys(config).length) {
        for (let k in config) {
            // @babel/traverse 是 babel提供遍历ast的工具
            traverse(ast, {
                VariableDeclaration({ node }) {
                    let id = node.declarations[0].id;
                    if (id.name == k) {
                        node.declarations[0].id = types.Identifier(config[k]);
                    }
                }
            })
        }
    }
}