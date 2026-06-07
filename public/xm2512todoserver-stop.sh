if [ $(id -u) -eq 0 ]
  then
    echo '正在停止xm2512todoserver...'
    systemctl stop xm2512todoserver
    echo 'xm2512todoserver停止成功'
    echo '正在停止MongoDB数据库...'
    systemctl stop mongod
    echo 'MongoDB数据库停止成功'
  else
    echo '请使用root用户运行此脚本'
fi
exit