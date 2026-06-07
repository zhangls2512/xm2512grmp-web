if [ $(id -u) -eq 0 ]
  then
    echo '正在更新Nodejs...'
    nvm install node
    echo 'Nodejs更新成功'
    echo '正在停止xm2512todoserver...'
    systemctl stop xm2512todoserver
    echo 'xm2512todoserver停止成功'
    cd /opt/xm2512todoserver
    echo '正在更新xm2512todoserver...'
    npm update
    echo 'xm2512todoserver更新成功'
    echo '正在启动xm2512todoserver...'
    systemctl start xm2512todoserver
    echo 'xm2512todoserver启动成功'
  else
    echo '请使用root用户运行此脚本'
fi
exit