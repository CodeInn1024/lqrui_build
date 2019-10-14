const serve = require('./lqrui_build');

const info = {
	port: 8000, //ssh端口
	host: '000.000.000.000', //sship
	username: '******', //ssh帐号
	password: '******', //ssh密码
	path: '/www/wwwroot/welfare/client', //服务器文件存储路径
	gitUrl: '******************', //git地址
	branch: 'master', //分支名称
	env: '' //环境 例如：[:pro]
};

(async () => {
	const lqr = new serve()
	lqr.init(info)
	await lqr.gitClone()
	await lqr.install()
	await lqr.build()
	await lqr.compressing()
	await lqr.sshUpdate()
	await lqr.decompression()
})().catch(error => {
	console.log(error);
});
