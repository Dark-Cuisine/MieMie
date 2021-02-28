


//生成随机id（默认12位）*unfinish 现在还没能设置位数
export const getRandomId = (digits = 12) => {
  return Number(Math.random().toString().substr(3, 100)).toString(36);
}