# lqrui_build
node版vue项目简易一键构建部署

## 环境要求
需要 NodeJS 8.12+ 环境

## 多环境或单环境部署使用
1. 下载本项目，执行`npm i`安装依赖
2. 修改`test.js`文件相关信息
3. 执行`node test.js`

## 在原有项目下单环境部署使用
1. 把相关依赖添加到原先项目`devDependencies`
```
"compressing": "^1.4.0",
"scp2": "^0.5.0",
"simple-ssh": "^1.0.0"
```
2. 把original设为true
3. 同上