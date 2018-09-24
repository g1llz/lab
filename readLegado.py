from bs4 import BeautifulSoup
import json

def analise():

    path_local = 'C:/Users/xxx/Documents/xxx/manifest.xml'

    aux   = ['Title', 'ContentDescription', 'ContentNews', 'ImageHomeEditorial', 'Editorial', 'Region', 'DateContent']
    posts = {}

    doc  = open(path_local, encoding='utf-8')
    root = BeautifulSoup(doc, 'html.parser', from_encoding='utf-8')    
    rows = root.find_all('row')

    cont = 1

    r = []
    for row in rows:        
        post = {}
        for f in row.find_all('field'):
            
            for name in aux:
                if(str(f).find('name="' + name + '"') > 0):
                    post[name] = f.string

        if(len(post) > 0):
            r.append(post)
            posts[cont] = r    
            r = []
            post = {}
            cont += 1
    
    
    # print(posts)
    with open('manifest-formatado2.json', 'w', encoding='utf-8') as outfile:
        json.dump(posts, outfile, ensure_ascii=False, indent=4)
            

if __name__ == '__main__':
    analise()