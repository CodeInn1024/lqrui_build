const serve = require('./lqrui_build');

const info = {
	port: 8000, //ssh端口
	host: '000.000.000.000', //ssh ip
	username: '******', //ssh帐号
	password: '******', //ssh密码
	path: '/www/wwwroot/welfare/client', //服务器文件存储路径
	gitUrl: '******************', //git地址
	branch: 'master', //分支名称
	env: '', //环境 例如：[:pro]
	original: false // 是否在原项目中使用(未完善)
};

(async () => {
	const lqr = new serve()
	lqr.init(info) // 初始化项目
	await lqr.gitClone() // 拉取代码
	await lqr.install() // 安装依赖
	await lqr.build() // 执行打包
	await lqr.compressing() // 压缩打包文件
	await lqr.sshUpdate() // ssh上传打包文件
	await lqr.decompression() // 执行解压
})().catch(error => {
	console.log(error);
});
