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
  return station;
};
