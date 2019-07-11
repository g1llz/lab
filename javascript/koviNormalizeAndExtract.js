const extractArr = /\[(.*?)\]/g;
const rmvBracket = /[\[\]']+/g;

const normalizeArr = (data) => {
  const payload = (data.match(extractArr)).map(x => eval(x));
  console.log(payload);
  return payload;
  
}

const compareTwoArr = (data) => {
  const payload = normalizeArr(data);
  // FIXME: work in progress ...
  return payload.flatMap(x => x);
}

compareTwoArr("{[1, 2, 3, 5], [5, 8, 9]}");
