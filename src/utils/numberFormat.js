// 숫자 단위의 경우 쉼표 자릿수 표현
export function convertCountUnit (numberValue) {
  return numberValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export default {
  convertCountUnit,
};
