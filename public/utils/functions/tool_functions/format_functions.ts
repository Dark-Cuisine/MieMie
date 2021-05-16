//规范格式化的函数


//位数不够前面补0
//num: 数字
//n: 位数
export const prefixZero=(num, n)=> {
  return (Array(n).join(0) + num).slice(-n);
}