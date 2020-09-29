## 实现简易的babel

## 关键api调用，基于babel内置的基本功能模块，如下：
### @babel/parser：将js脚本字符串转换成ast语法树
### @babel/traverse：babel提供的遍历ast语法树的遍历器，我们的plugin处理的主要对象就是ast语法树，故此遍历器非常实用
### @babel/types：@babel/parser将js脚本字符串转换成ast语法树的过程中，调用@babel/types。作用是生成语法树节点

## 执行构建 
### npm run build

## 执行构建过后的js资源 检查正确性
### npm run dev

## npm run build 发生了什么？
### 1.执行index.js文件，通过commander包解析命令行参数，存入config对象中
### 2.获取.babelrc文件配置的内容 存入config对象中
### 3.获取源文件夹下所有文件名称fileNames
### 4.遍历fileNames，执行babel相关编译处理（只有.js资源需要处理，其他文件直接copy就好）
### 5.babel处理流程简介：
#### （1）通过@babel/parser将js脚本转换成ast语法树（我们后续所有的处理都是经过基于这个ast树）
#### （2）执行所有的plugin，处理ast语法树（plugin）在.babelrc文件传入
#### （3）最后将处理过的ast树，经过transformFromAst编译成js脚本，输出到物理文件中