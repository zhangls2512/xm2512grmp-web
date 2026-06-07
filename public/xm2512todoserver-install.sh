if [ $(id -u) -eq 0 ]
  then
    apt update
    echo '开始安装MongoDB...'
    apt install gnupg curl
    curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor
    echo 'deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.3 multiverse' | tee /etc/apt/sources.list.d/mongodb-org-8.3.list
    apt update
    apt install -y mongodb-org
    echo 'MongoDB数据库安装成功，请前往/etc/mongod.conf配置'
    echo '开始安装Nodejs...'
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.5/install.sh | bash
    nvm install node
    echo 'Nodejs安装成功'
    echo '开始安装xm2512todoserver...'
    mkdir /opt/xm2512todoserver
    cd /opt/xm2512todoserver
    echo '{"certPath":"","keyPath":"","port":443,"mongodbUri":"mongodb://127.0.0.1:27017/todoteam","alwaysReturnSuccessStatusCode":true,"logRootPath":"","saveErrorLog":true,"saveRequestLog":false}' > config.json
    echo '{"dependencies":{"@zhangxm2512/xm2512todoserver":"latest"}}' > package.json
    echo 'require('@zhangxm2512/xm2512todoserver').start(__dirname+'/config.json')' > main.js
    npm install
    echo 'xm2512todoserver安装成功，请前往/opt/xm2512todoserver/config.json配置并配置systemd后台服务：xm2512todoserver'
  else
    echo '请使用root用户运行此脚本'
fi
exit