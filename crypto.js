export function caesarDecode(numStr, shift=3){
  return [...numStr].map(c=>{
    if(c<'0'||c>'9') return c;
    return String((+c - shift + 10) % 10);
  }).join("");
}
