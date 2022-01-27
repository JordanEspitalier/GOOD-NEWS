import fetch from 'node-fetch';

const getArticlesLink = async (url)=>{
    const response = await fetch(url);
    const str = await response.text();

    const indexDone = [];
    const strArr = [str]
    let go = true;
    let i = 0
    do {
    
        const index = strArr[i].indexOf('.html')
    
        if(index > 0){

            indexDone.push(index)
            strArr.push(strArr[i].slice(index + 5))
            i++ 
    
        }else {
            
            go = false
        }

    
    } while (go);
    
    const urls = []
    let j = 0
    for(let index of indexDone){
        const newStr = strArr[j].slice(index -200, index + 5)
        const indexhttp = newStr.indexOf('https')
        const url = newStr.slice(indexhttp)
        urls.push(url)
        j++
    }

    for(let i=0 ; i < urls.length ; i++){
        if(urls[i].length == 1 || urls[i] == ''){
            urls.splice(i, i+1)
        }
        
    }
    // for(let i=0 ; i < urls.length ; i++){

    //     console.log(urls[i])
        
    // }
    console.log(`${url}`)
    console.log(urls)

    return urls
    
}

getArticlesLink('https://www.lemonde.fr/international/')
getArticlesLink('https://www.lemonde.fr/politique/')
getArticlesLink('https://www.lemonde.fr/societe/')
getArticlesLink('https://www.lemonde.fr/les-decodeurs/')
getArticlesLink('https://www.lemonde.fr/sport/')
getArticlesLink('https://www.lemonde.fr/planete/')
getArticlesLink('https://www.lemonde.fr/sciences/')
getArticlesLink('https://www.lemonde.fr/campus/')
getArticlesLink('https://www.lemonde.fr/afrique/')
getArticlesLink('https://www.lemonde.fr/pixels/')
getArticlesLink('https://www.lemonde.fr/sante/')
getArticlesLink('https://www.lemonde.fr/big-browser/')
