#encoding: utf-8

import pymysql
import json
import unicodedata
import urllib.request
import urllib.parse
import logging

def run():

    path_local = 'C:/xampp/htdocs/.../wordpress/wp-content/uploads/legado/'
    path_http  = 'http://localhost/.../wordpress/wp-content/uploads/legado/'

    categories  = { 'Cultura': 2, 'Econômia': 3, 'Habitação': 3, 'Esporte': 4, 'Loterias': 5, 'Programas e Benefícios': 6 }

    regions = {
        'Centro-Oeste': 18, 'Distrito Federal': 302, 'Góias': 303, 'Mato Grosso': 304, 'Mato Grosso do Sul': 305, 'Nordeste': 15, 'Alagoas': 296, 'Bahia': 297, 'Ceará': 295, 'Maranhão': 301, 'Paraíba': 293, 'Pernambuco': 294, 'Piauí': 299, 'Rio Grande do Norte': 300, 'Sergipe': 298, 'Sudeste': 17, 'Espiríto Santo': 313, 'São Paulo': 316, 'Rio de Janeiro': 315, 'Minas Gerais': 314, 'Sul': 16, 'Paraná': 317, 'Santa Catarina': 318, 'Rio Grande do Sul': 319, 'Norte': 14, 'Acre': 306, 'Amapá': 307, 'Amazonas': 308, 'Pará': 309, 'Rondonia': 310, 'Roráima': 311, 'Tocantins': 31
    }    
    
    conn = None
    conn = pymysql.connect(
        host='localhost',
        user='root',
        password='',
        db='my_db'
    )

    with open('manifest-formatado2.json', encoding='utf-8') as f:
        data = json.load(f)

        try:
            with conn.cursor() as cursor:

                for i in range(611, 613): # 3262

                    for p in data[str(i)]:
                        title     = str(p['Title'])
                        subtitulo = str(p['ContentDescription'])
                        content   = str(p['ContentNews'])
                        category  = str(p['Editorial']).split('#')[-1]
                        region    = str(p['Region']).split('#')[-1]
                        date      = str(str(p['DateContent']).replace('T', ' ')).replace('Z', '')
                        
                        slug  = "-".join((unicodedata.normalize('NFKD', p['Title']).encode('ASCII', 'ignore')).decode('utf-8', 'ignore').split(' ')).lower()

                        # insert data[i] into wordpress table 'wp_posts'. post_type = post
                        insert_post = "INSERT INTO wp_posts(post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_password, post_name, to_ping, pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent, guid, menu_order, post_type, post_mime_type, comment_count) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
                        
                        cursor.execute(insert_post, (1, date, date, content, title, subtitulo, 'draft', 'closed', 'closed', '', slug, '', '', date, date, '', 0, '', 0, 'post', '', 0))
                        
                        postid = cursor.lastrowid
                        print('Post ID %d' %(postid))

                        insert_subtitulo_postmeta = "INSERT INTO wp_postmeta(post_id, meta_key, meta_value) VALUES(%s, %s, %s)"
                        cursor.execute(insert_subtitulo_postmeta, (postid, 'subtitulo', subtitulo))
                        
                        # if contains category in categories list insert relation in 'wp_term_relationship'
                        if category in categories:
                            cat = categories.get(category)
                        else:
                            cat = 1
                        
                        insert_categories = "INSERT INTO wp_term_relationships(object_id, term_taxonomy_id, term_order) VALUES(%s, %s, %s)"
                        cursor.execute(insert_categories, (postid, cat, 0))
                       
                        # if contains region in regions list insert relation in 'wp_term_relationship'
                        if region in regions:
                            reg = regions.get(region)
                            
                            insert_categories = "INSERT INTO wp_term_relationships(object_id, term_taxonomy_id, term_order) VALUES(%s, %s, %s)"
                            cursor.execute(insert_categories, (postid, reg, 0))
                        
                        if 'ImageHomeEditorial' in p: 
                            image    = str(p['ImageHomeEditorial']).split(', ')[0]
                            img_name = image[image.rindex('/')+1:]

                            url = urllib.parse.urlsplit(image)
                            url = list(url)
                            url[2] = urllib.parse.quote(url[2],  safe='/', encoding='utf-8', errors='strict')
                            url = urllib.parse.urlunsplit(url)
                            print(url)
                            
                            try:
                                # try download image
                                urllib.request.urlretrieve(url, path_local + img_name)

                            except urllib.error.URLError as e:
                                logging.basicConfig(filename = 'log.txt', format = '%(asctime)s  %(levelname)-10s %(processName)s  %(name)s %(message)s')
                                logging.error(e.reason)

                            # insert reference of image into wordpress table 'wp_posts'. post_type = attachment
                            insert_image = "INSERT INTO wp_posts(post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_password, post_name, to_ping, pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent, guid, menu_order, post_type, post_mime_type, comment_count) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

                            cursor.execute(insert_image, (1, date, date, '', img_name.split('.')[0], '', 'inherit', 'open', 'closed', '', slug, '', '', date, date, '', postid, path_http + img_name, 0, 'attachment', '', 0))

                            imageid = cursor.lastrowid
                            print('Image ID %d' %(imageid))

                            # insert into wordpress table 'wp_postmeta' the id of image
                            insert_image_postmeta = "INSERT INTO wp_postmeta(post_id, meta_key, meta_value) VALUES(%s, %s, %s)"
                            cursor.execute(insert_image_postmeta, (postid, '_thumbnail_id', imageid))

                            # insert into wordpress table 'wp_postmeta' the path of image
                            insert_image_postmeta = "INSERT INTO wp_postmeta(post_id, meta_key, meta_value) VALUES(%s, %s, %s)"
                            cursor.execute(insert_image_postmeta, (imageid, '_wp_attached_file', 'legado/'+ img_name))
                        
                        conn.commit()
        
        except (Exception, pymysql.DatabaseError) as error:
            print(error)
    
    if conn is not None:
        conn.close()
        print('Conexao com o banco de dados fechada.')

if __name__ == '__main__':
    run()
