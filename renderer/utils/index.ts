export const GAME_SCRIPT = "game.py";
export const CHECKSUM_GAME =
  "f99fd129a66980e92d151adc8e9cfd800d73480c4fd7e25fd6c363c18b3452bd";

export const PYTRON_CHANNEL = "pytron";

export enum Commands {
  DetectPython3 = "detectPython3", // 检测系统Python环境
  Init = "init", // 初始化pytron环境
  Remove = "remove", // 移除pytron环境
  ReadConfig = "readConfig", // 读取配置文件
  WriteConfig = "writeConfig", // 写入配置文件
  Download = "download", // 下载资源、代码文件
  RunPysh = "runPysh", // python-shell运行python代码
  RunBin = "runBin", // 运行可执行文件
  Stop = "stop", // 停止当前正在执行的脚本/程序
}
