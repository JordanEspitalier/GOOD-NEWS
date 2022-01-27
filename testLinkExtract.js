let str = '<div><a href="https://www.test.html">bonjour</a></div><div><a href="https://www.test1.html">bonjourMonsieur</a></div><div><a href="https://www.test2.html">bonjour</a></div>'



const indexDone = [];
const strArr = [str]
let go = true;
let i = 0
do {

    const index = strArr[i].indexOf('.html')

    if(index > 0){
        console.log(index)
        indexDone.push(index)
        strArr.push(strArr[i].slice(index + 5))
        i++ 

    }else {
        
        go = false
    }
    console.log(indexDone)
    console.log(strArr)
    console.log(go)

} while (go);

const urls = []
let j = 0
for(let index of indexDone){
    const newStr = strArr[j].slice(index -20, index + 5)
    const indexhttp = newStr.indexOf('https')
    const url = newStr.slice(indexhttp)
    urls.push(url)
    j++
}

console.log(urls)





