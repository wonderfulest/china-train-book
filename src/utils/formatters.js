import { pinyin } from "pinyin-pro";

/**
 * 将时间格式（HH:MM）转换为可读的持续时间格式（Xh Ym）
 * @param {string} duration - 格式为 "HH:MM" 的时间字符串
 * @returns {string} 格式化后的持续时间，例如 "2h 30m"
 */
export const formatDuration = (duration) => {
  if (!duration) return "";
  const [hours, minutes] = duration.split(":").map(Number);
  return `${hours}h ${minutes}m`;
};

/**
 * 将车站代码转换为拼音首字母大写的格式
 * @param {string} station - 车站代码
 * @param {Array} cities - 城市数据列表
 * @returns {string} 格式化后的车站名称
 */
export const formatStation = (station, cities) => {
  if (!station || !cities) return "";
  
  const stationObj = cities.find((s) => s.stationCode === station);
  if (stationObj) {
    const words = pinyin(stationObj.name, { toneType: "none", type: "array" });
    return words
      .flat()
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  }
  console.log('station', station, cities)
  return station;
};


// 获取火车类型
function getTrainType(trainNo) {
  if (!trainNo) return '';
  
  const prefix = trainNo.charAt(0).toUpperCase();
  
  switch(prefix) {
    case 'G': return 'High-Speed (高铁)';
    case 'D': return 'Electric Multiple Unit (动车)';
    case 'C': return 'Intercity (城际)';
    case 'Z': return 'Direct Express (直达)';
    case 'T': return 'Express (特快)';
    case 'K': return 'Fast (快速)';
    case 'Y': return 'Tourist (旅游)';
    case 'L': return 'Temporary (临时)';
    case 'S': return 'Suburban (市郊)';
    default: return 'Regular Train';
  }
}