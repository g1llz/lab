export default class Http {
    
    static get(url) {
        return fetch(url)
            .then(response => 
                response.ok ? response.json() : 
                Promise.reject(response.statusText))
            .then(data => data)
            .catch(err => console.warn(err))
    }     
}