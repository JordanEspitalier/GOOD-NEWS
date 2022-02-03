import fetch from 'node-fetch';

const getArticlesLinkFromPage = async (url)=>{
    try {
        const response = await fetch(url);
        const str = await response.text();

        const indexDone = [];
        const strArr = [str];
        let go = true;
        let i = 0;
        do {
        
            const index = strArr[i].indexOf('.html');
        
            if(index > 0){

                indexDone.push(index);
                strArr.push(strArr[i].slice(index + 5));
                i++;
        
            }else {
                
                go = false;
            }
        
        } while (go);
        
        const urls = [];
        let j = 0;
        for(let index of indexDone){
            const newStr = strArr[j].slice(index -200, index + 5);
            const indexhttp = newStr.indexOf('https');
            const url = newStr.slice(indexhttp);
            urls.push(url);
            j++;
        }

        for(let i=0 ; i < urls.length ; i++){
            if(urls[i].length == 1 || urls[i] == ''){
                urls.splice(i, i+1);
            }
            
        }

        // console.log(`${url}`)
        // console.log(urls)

        return urls
    } catch (error) {

        console.log(error);
    }
    
}





const getAllLinksFromLeMonde = async ()=>{

    try {
        const leMondeInternational = await getArticlesLinkFromPage('https://www.lemonde.fr/international/');
        const leMondePolitique = await getArticlesLinkFromPage('https://www.lemonde.fr/politique/');
        const leMondeSociete = await getArticlesLinkFromPage('https://www.lemonde.fr/societe/');
        const leMondeLesDecodeurs = await getArticlesLinkFromPage('https://www.lemonde.fr/les-decodeurs/');
        const leMondeSport = await getArticlesLinkFromPage('https://www.lemonde.fr/sport/');
        const leMondePlanette = await getArticlesLinkFromPage('https://www.lemonde.fr/planete/');
        const leMondeSciences = await getArticlesLinkFromPage('https://www.lemonde.fr/sciences/');
        const leMondeCampus = await getArticlesLinkFromPage('https://www.lemonde.fr/campus/');
        const leMondeAfrique = await getArticlesLinkFromPage('https://www.lemonde.fr/afrique/');
        const leMondePixel = await getArticlesLinkFromPage('https://www.lemonde.fr/pixels/');
        const leMondeSante = await getArticlesLinkFromPage('https://www.lemonde.fr/sante/');
        const leMondeBigBrowser = await getArticlesLinkFromPage('https://www.lemonde.fr/big-browser/');
    
    
        const leMonde = leMondeInternational.concat(leMondePolitique, leMondeSociete, leMondeLesDecodeurs, leMondeSport, leMondePlanette, leMondeSciences, leMondeCampus, leMondeAfrique, leMondePixel, leMondeSante, leMondeBigBrowser);
    
    
    
        return leMonde
    } catch (error) {
        console.log(error);
    }


}

const sortByCategory = async ()=>{
    try {

        const leMondeArticlesLinks = await getAllLinksFromLeMonde()
        // const leMondeArticlesLinks = ["https://www.lemonde.fr/societe/article/2022/01/27/accusations-de-maltraitance-dans-les-ehpad-le-directeur-d-orpea-convoque-mardi-par-le-gouvernement_6111178_3224.html", "https://www.lemonde.fr/education/article/2022/01/11/les-universites-peuvent-etre-unies-avec-la-societe-par-un-nouveau-contrat-social_6108968_1473685.html"]

        const leMonde = {};
        const categories = [];
        const dates = [];
        const titles = [];

        

        for(let i = 0 ; i<leMondeArticlesLinks.length ; i++){

            // DELETE ARTICLE WHO ARE NOT AN ARTICLE

            if(!leMondeArticlesLinks[i].includes('article/')){

                leMondeArticlesLinks.splice([i], 1);
                continue;
            } 

            // GET CATEGORIES FROM THE URL

            const index = leMondeArticlesLinks[i].indexOf('.fr/');

            const categoryStepOne = leMondeArticlesLinks[i].slice(index + 4);

            const indexEndCategory = categoryStepOne.indexOf('/');

            const category = categoryStepOne.slice(0, indexEndCategory).split('-').join('_');

            // console.log(i);

            if(category.includes(':' || '/' || '\\' || ',' || ';')){

                leMondeArticlesLinks.splice([i], 1);
                continue;
            } 
            else{
                // console.log(category);
                categories.push(category);
            } 
            
            

            // GET DATE FROM THE URL


            // console.log(leMondeArticlesLinks[i]);

            const regex = /[0-9]{4}[\/][0-9]{2}[\/][0-9]{2}/g;

            const indexDateStart = leMondeArticlesLinks[i].search(regex);

            const date = leMondeArticlesLinks[i].slice(indexDateStart, indexDateStart + 10);

            // console.log(date);
            dates.push(date);


            // PACK BY CATEGORY IN LeMonde Object

            if(leMonde[category]){

                leMonde[category].push({articleLink : leMondeArticlesLinks[i], date});
            }else{

                leMonde[category] = [];
                leMonde[category].push({articleLink : leMondeArticlesLinks[i], date});
            }
            

        }
        return leMonde

    } catch (error) {

        console.log(error);
    }
    
    
}

const getArticleContent = async()=>{

    console.log('START Le Monde Tracking')


    const leMonde = await sortByCategory()
    console.time('IN')
    let nbArticlesTracked = 0
    const getLog = [51, 101, 151, 201, 251, 301, 351, 401, 451, 501, 551, 601, 651, 701, 751, 801, 851, 901]
    for(let category in leMonde){
        for(let i = 0; i<leMonde[category].length; i++){


            if(getLog.includes(nbArticlesTracked)){
                console.log(`${nbArticlesTracked - 1} ARTICLES TRACKED`)
                console.timeLog('IN')
            }

            // GET TITLE OF THE ARTICLE

            const response = await fetch(leMonde[category][i].articleLink);
            const str = await response.text();

            let indexStart = str.indexOf('<h1 class="article__title">');

            if(indexStart == -1){

                indexStart = str.indexOf('<h1 class="article__title article__title--opinion">');
                if(indexStart == -1){
                    indexStart = str.indexOf('<h1 class="article__title article__title--campaign">');
                    const indexEnd = str.indexOf('</h1>')
                    let title = str.slice(indexStart + 52, indexEnd)
                    // console.log(title)
                    // console.log(leMonde[category][i].articleLink)
                    leMonde[category][i].title = title
                    continue;
                }
                const indexEnd = str.indexOf('</h1>')
                let title = str.slice(indexStart + 51, indexEnd)
                // console.log(title)
                // console.log(leMonde[category][i].articleLink)
                leMonde[category][i].title = title

            }
            else{

                const indexEnd = str.indexOf('</h1>')
                let title = str.slice(indexStart + 27, indexEnd)
                console.log(leMonde[category][i].articleLink)
                console.log(title)
                console.log(leMonde[category][i].articleLink)
                leMonde[category][i].title = title
            }

            // GET IMG LINK OF THE ARTICLE

            nbArticlesTracked++
        }
    }
    console.log(leMonde)
    console.log(`${nbArticlesTracked} ARTICLES TRACKED`)
    console.timeEnd('IN')
    console.log('END Le Monde Tracking')
    return leMonde;


}




export default getArticleContent;