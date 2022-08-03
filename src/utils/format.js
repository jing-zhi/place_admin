import { formatTimeToStr } from "@/utils/date";
import { getDict } from "@/utils/dictionary";

export const formatBoolean = (bool) => {
  if (bool !== null) {
    return bool ? "是" : "否";
  } else {
    return "";
  }
};

export const formatDate = (time, type = "yyyy-MM-dd hh:mm:ss") => {
  if (time !== null && time !== "") {
    var date = new Date(time);
    return formatTimeToStr(date, type);
  } else {
    return "";
  }
};

export const filterDict = (value, options) => {
  const rowLabel = options && options.filter((item) => item.value === value);
  return rowLabel && rowLabel[0] && rowLabel[0].label;
};
export const getDictFunc = async (type) => {
  const dicts = await getDict(type);
  return dicts;
};
//数据脱敏
export const formatter = (field, before, after) => {
  if (!field) {
    return "";
  }
  field = String(field);
  const regItem = "[\u4e00-\u9fa5a-zA-Z0-9]";
  const regExp = `(${regItem}{${before}})${regItem}*(${regItem}{${after}})`;
  const reg = new RegExp(regExp);
  return field.replace(reg, "$1*****$2");
};
