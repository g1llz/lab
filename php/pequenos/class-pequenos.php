<?php

    class Pequenos {

        private $id;
        
        function __constructor() {
            $this->id = get_current_user_id();
        }

        private function get_pequenos() {
            global $wpdb;

            $lista = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT * FROM {$wpdb->prefix}pai_pequeno WHERE id_pai = %d", $this->id
                )
            );

            $resp = json_encode(array('lista' => $lista));            
            echo $resp;

        }

        private function add_pequenos( string $nome, int $idade, string $serie, array $preferencias ) {
            global $wpdb;

            $add_leitor = $wpdb->insert( 
                $wpdb->prefix.'pai_pequeno',
                array(
                    'id_pai' => $this->id,
                    'nome'   => $nome,
                    'idade'  => $idade,
                    'serie'  => $serie
                ),
                array('%d', '%s', '%d', '%d')
            );

            $pequeno_id = $wpdb->insert_id;
            
            if($add_leitor) :
                if(is_array($preferencias) && !is_empty($preferencias)) :

                    foreach ($preferencias as $value) {
                        $add_pref = $wpdb->insert( 
                            $wpdb->prefix.'pequeno_preferencia',
                            array(
                                'id_pequeno' => $pequeno_id,
                                'preferencia'=> $value,
                            ),
                            array('%d', '%s')
                        );

                        if(!$add_pref) :
                            $resp = json_encode(array(
                                'error' => 'Impossível cadastrar preferência'));
                            echo $resp;
                        endif;
                    }
                    $resp = json_encode(array(
                        'success' => 'Pequeno leitor e preferências foram cadastrados com sucesso'));
                    echo $resp;

                endif;
                $resp = json_encode(array(
                    'success' => 'Pequeno leitor cadastrado com sucesso'));
                echo $resp;

            else:
                $resp = json_encode(array(
                    'error' => 'Impossível cadastrar pequeno leitor'));
                echo $resp;
            endif;
        }

        private function del_pequenos( $pequeno_id ) {


        }

    }