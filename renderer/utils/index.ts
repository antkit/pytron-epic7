export const CHECKSUM_GAME =
  "9558255a017915cccbdcb17e4b785c9bf68a8f5203ce8f4d69de073ae0f58091";

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
