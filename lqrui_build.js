const childProcess = require('child_process')
const path = require('path')
const fs = require('fs')
const compressing = require('compressing');
const scp2 = require('scp2');
const simpleSsh = require('simple-ssh');

function lqrui_build() {
	// 初始化
	this.init = (info) => {
		console.log('++++++++++初始化')
		this.info = info
		this.info.user = info.username
		this.info.pass = info.password
		const a = info.gitUrl.split('/')
		this.info.name = a[a.length - 1].split('.')[0]
		this.sshClient = new simpleSsh(this.info)
	};
	// 执行命令
	this.exec = (command, pathStr = '') => {
		return new Promise((res, rej) => {
			console.log(`++++++++++执行命令:${command}`)
			console.log(`++++++++++路径:${path.resolve('./A/', pathStr)}`)
			const ls = childProcess.exec(command, {
				cwd: path.resolve('./A/', pathStr),
				encoding: 'utf8',
				timeout: 0,
				maxBuffer: 5000 * 1024,
				killSignal: 'SIGTERM'
			}, (error, stdout, stderr) => {
				if (error) {
					console.error(`执行的错误: ${error}`);
					rej(`执行的错误: ${error}`);
				}
				console.log(`stdout: ${stdout}`);
				console.error(`stderr: ${stderr}`);
				res('执行成功')
			})
		})
	};
	// 拉取代码
	this.gitClone = () => {
		return new Promise((res) => {
			fs.stat(`./A/${this.info.name}`, (err, stats) => {
				if (err) {
					console.log('++++++++++拉取代码')
					res(this.exec(`git clone -b ${this.info.branch} ${this.info.gitUrl}`))
				} else {
					console.log('++++++++++更新代码')
					res(this.exec(`git pull`, this.info.name))
				}
			})
		})
	};
	// 安装依赖
	this.install = (type = 'npm') => {
		console.log('++++++++++安装依赖')
		// return this.exec(`${process.platform === 'win32' ? 'npm.cmd' : 'npm'} i --registry https://registry.npm.taobao.org`,	this.info.name)
		return this.exec(`${process.platform === 'win32' ? 'npm.cmd' : 'npm'} i`, this.info.name)
	};
	// 构建
	this.build = (type = 'npm') => {
		console.log('++++++++++构建')
		return this.exec(`${process.platform === 'win32' ? 'npm.cmd' : 'npm'} run build`, this.info.name)
	};
	// 压缩
	this.compressing = () => {
		console.log('++++++++++压缩')
		return new Promise((resolve, reject) => {
			compressing.zip.compressDir(`./A/${this.info.name}/dist/.`, `./A/${this.info.name}/dist.zip`)
				.then(() => {
					console.log('compressing:success');
					resolve('success')
				})
				.catch(err => {
					console.error(err);
					reject(err)
				});
		});
	};
	// ssh上传
	this.sshUpdate = () => {
		console.log('++++++++++ssh上传')
		return new Promise((resolve, reject) => {
			console.log(this.info)
			scp2.scp(`./A/${this.info.name}/dist.zip`, this.info, function(err) {
				if (err) {
					console.error(err);
					reject(err);
				} else {
					console.log('sshUpdate:success');
					resolve();
				}
			});
		});
	};
	// 解压
	this.decompression = () => {
		console.log('++++++++++解压')
		return new Promise((resolve, reject) => {
			this.sshClient
				.exec(`unzip -d ${this.info.path} ${this.info.path}/dist.zip`, {
					out: (stdout) => console.log(stdout),
					exit: () => {
						resolve();
					},
				})
				.on('error', function(err) {
					this.sshClient.end();
					reject(err);
				})
				.start();
		});
	}
}

module.exports = lqrui_build
