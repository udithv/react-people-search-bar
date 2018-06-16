      
const getQueryString = (st) =>
{
    
   const sparqlquery =  `
         PREFIX owl: <http://www.w3.org/2002/07/owl#>
         PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
         PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
         PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
         PREFIX foaf: <http://xmlns.com/foaf/0.1/>
         PREFIX dc: <http://purl.org/dc/elements/1.1/>
         PREFIX : <http://dbpedia.org/resource/>
         PREFIX dbpedia2: <http://dbpedia.org/property/>
         PREFIX dbpedia: <http://dbpedia.org/>
         PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
   
         SELECT ?name  ?person ?gender ?image ?comment ?wiki
           WHERE {       
               ?person foaf:name  ?name .
               ?person a foaf:Person.       
               ?person foaf:gender ?gender .
               ?person <http://dbpedia.org/ontology/thumbnail>  ?image .
               ?person <http://www.w3.org/2002/07/owl#sameAs> ?wiki .
               ?person rdfs:comment ?comment .
               FILTER regex (?name, "^(${st})", "i") . 
               FILTER(LANGMATCHES(LANG(?comment), 'en'))
               FILTER REGEX(STR(?wiki), "http://www.wikidata.org/entity/.") .
   
           }
           LIMIT 5
   `;

   return sparqlquery;
}



export const searchresults = (searchterm, reqseqid) => {
    const endpointUrl = 'https://dbpedia.org/sparql',
    fullUrl = endpointUrl + '?query=' + encodeURIComponent( getQueryString(searchterm) ),
    headers = { 'Accept': 'application/sparql-results+json' };
    

    return fetch( fullUrl, { headers } ).then( body => body.json() ).then( json => {
        const { results } = json;
        
        return {
            results: results.bindings.map(res => {
                let id = res.wiki.value.replace("http://www.wikidata.org/entity/", "");
                return{ 
                    id,
                    name: res.name.value,
                    gender: res.gender.value,
                    comment: res.comment.value,
                    image: res.image.value,
                    dbpedia: res.person,
                }
            }),
            reqseqid
        };
    } );
}