if [ $(id -u) -eq 0 ]
  then
    echo '正在启动MongoDB数据库...'
    systemctl start mongod
    echo 'MongoDB数据库启动成功'
    echo '正在启动xm2512todoserver...'
    systemctl start xm2512todoserver
    echo 'xm2512todoserver启动成功'
  else
    echo '请使用root用户运行此脚本'
fi
exit