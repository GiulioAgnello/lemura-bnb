<?php
/**
 * Plugin Name:  Le Mura degli Angeli — API
 * Description:  CPT alloggio, campi ACF e endpoint REST per Sternatia e Corigliano.
 * Version:      1.1.0
 * Author:       Le Mura degli Angeli
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// ============================================================
// 1. CORS — permette al frontend di chiamare le API
//    Gestisce anche il preflight OPTIONS prima che WP lo blocchi
// ============================================================
add_action( 'init', function () {
    // Applica solo alle richieste verso la REST API
    $uri = isset( $_SERVER['REQUEST_URI'] ) ? $_SERVER['REQUEST_URI'] : '';
    if ( strpos( $uri, '/wp-json/' ) === false ) return;

    header( 'Access-Control-Allow-Origin: *' );
    header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
    header( 'Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With' );
    header( 'Access-Control-Max-Age: 86400' );

    // Risponde subito alle richieste preflight OPTIONS
    if ( isset( $_SERVER['REQUEST_METHOD'] ) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS' ) {
        status_header( 200 );
        exit();
    }
}, 1 );

add_action( 'rest_api_init', function () {
    remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
    add_filter( 'rest_pre_serve_request', function ( $value ) {
        header( 'Access-Control-Allow-Origin: *' );
        header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
        header( 'Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With' );
        return $value;
    } );
}, 15 );

// ============================================================
// 2. CPT: alloggio
// ============================================================
add_action( 'init', function () {
    register_post_type( 'alloggio', array(
        'labels' => array(
            'name'          => 'Alloggi',
            'singular_name' => 'Alloggio',
            'add_new'       => 'Aggiungi alloggio',
            'add_new_item'  => 'Aggiungi nuovo alloggio',
            'edit_item'     => 'Modifica alloggio',
            'all_items'     => 'Tutti gli alloggi',
        ),
        'public'       => true,
        'show_in_rest' => true,
        'rest_base'    => 'alloggio',
        'supports'     => array( 'title', 'editor', 'thumbnail', 'custom-fields', 'excerpt', 'page-attributes' ),
        'menu_icon'    => 'dashicons-admin-home',
        'has_archive'  => false,
        'show_in_menu' => true,
    ) );
} );

// ============================================================
// 3. CAMPI ACF (solo se ACF è installato)
// ============================================================
add_action( 'acf/init', function () {
    if ( ! function_exists( 'acf_add_local_field_group' ) ) return;

    acf_add_local_field_group( array(
        'key'    => 'group_alloggio_v1',
        'title'  => 'Dettagli Alloggio',
        'fields' => array(

            array(
                'key'          => 'field_struttura',
                'label'        => 'Struttura',
                'name'         => 'struttura',
                'type'         => 'select',
                'required'     => 1,
                'choices'      => array(
                    'sternatia'  => 'Sternatia - Casa intera',
                    'corigliano' => 'Corigliano - B&B',
                ),
                'instructions' => 'A quale proprieta appartiene questo alloggio?',
            ),

            array(
                'key'      => 'field_tipo_alloggio',
                'label'    => 'Tipo',
                'name'     => 'tipo',
                'type'     => 'select',
                'required' => 1,
                'choices'  => array(
                    'casa_intera' => 'Casa intera',
                    'camera'      => 'Camera',
                    'spa'         => 'Spa / Area benessere',
                ),
            ),

            array(
                'key'          => 'field_prezzo_notte',
                'label'        => 'Prezzo per notte (euro)',
                'name'         => 'prezzo_notte',
                'type'         => 'text',
                'placeholder'  => 'es. 150',
                'instructions' => 'Solo il numero, senza simbolo euro',
            ),

            array(
                'key'         => 'field_superficie',
                'label'       => 'Superficie (mq)',
                'name'        => 'superficie',
                'type'        => 'text',
                'placeholder' => 'es. 120',
            ),

            array(
                'key'          => 'field_servizi',
                'label'        => 'Servizi',
                'name'         => 'servizi',
                'type'         => 'repeater',
                'layout'       => 'table',
                'button_label' => 'Aggiungi servizio',
                'sub_fields'   => array(
                    array(
                        'key'          => 'field_servizio_nome',
                        'label'        => 'Nome',
                        'name'         => 'nome',
                        'type'         => 'text',
                        'placeholder'  => 'es. Wi-Fi gratuito',
                        'column_width' => '70',
                    ),
                    array(
                        'key'          => 'field_servizio_icona',
                        'label'        => 'Icona',
                        'name'        => 'icona',
                        'type'         => 'text',
                        'placeholder'  => 'es. wifi, pool, ac',
                        'column_width' => '30',
                    ),
                ),
            ),

            array(
                'key'         => 'field_checkin_time',
                'label'       => 'Orario Check-in',
                'name'        => 'checkin_time',
                'type'        => 'text',
                'placeholder' => 'es. 15:00',
            ),

            array(
                'key'         => 'field_checkout_time',
                'label'       => 'Orario Check-out',
                'name'        => 'checkout_time',
                'type'        => 'text',
                'placeholder' => 'es. 10:00',
            ),

            array(
                'key'           => 'field_gallery_alloggio',
                'label'         => 'Galleria foto',
                'name'          => 'gallery',
                'type'          => 'gallery',
                'return_format' => 'array',
            ),

            // ── Tariffario ──────────────────────────────────────
            array(
                'key'          => 'field_unit_id',
                'label'        => 'ID Unità prenotazione',
                'name'         => 'unit_id',
                'type'         => 'select',
                'required'     => 1,
                'choices'      => array(
                    'sternatia'           => 'Sternatia — Casa intera',
                    'corigliano-camera-1' => 'Corigliano — Camera 1',
                    'corigliano-camera-2' => 'Corigliano — Camera 2',
                    'corigliano-spa'      => 'Corigliano — Spa',
                ),
                'instructions' => 'Collega questo alloggio all\'unità di prenotazione corrispondente.',
            ),

            array(
                'key'           => 'field_ospiti_base',
                'label'         => 'Ospiti inclusi nel prezzo base',
                'name'          => 'ospiti_base',
                'type'          => 'number',
                'default_value' => 2,
                'min'           => 1,
                'instructions'  => 'Quante persone sono già incluse nel prezzo a notte (di solito 2).',
            ),

            array(
                'key'           => 'field_ospiti_massimi',
                'label'         => 'Ospiti massimi',
                'name'          => 'ospiti_massimi',
                'type'          => 'number',
                'default_value' => 4,
                'min'           => 1,
                'instructions'  => 'Numero massimo di ospiti accettati.',
            ),

            array(
                'key'           => 'field_extra_per_ospite',
                'label'         => 'Extra per ospite aggiuntivo (€/notte)',
                'name'          => 'extra_per_ospite',
                'type'          => 'number',
                'default_value' => 0,
                'min'           => 0,
                'step'          => '0.5',
                'instructions'  => 'Importo aggiunto per ogni ospite oltre il numero base, per ogni notte.',
            ),

            array(
                'key'           => 'field_min_notti',
                'label'         => 'Soggiorno minimo (notti)',
                'name'          => 'min_notti',
                'type'          => 'number',
                'default_value' => 2,
                'min'           => 1,
            ),

            array(
                'key'           => 'field_max_notti',
                'label'         => 'Soggiorno massimo (notti)',
                'name'          => 'max_notti',
                'type'          => 'number',
                'default_value' => 30,
                'min'           => 1,
            ),

            array(
                'key'          => 'field_tariffe_stagionali',
                'label'        => 'Tariffe stagionali',
                'name'         => 'tariffe_stagionali',
                'type'         => 'repeater',
                'layout'       => 'block',
                'button_label' => 'Aggiungi tariffa',
                'instructions' => 'Queste tariffe sovrascrivono il prezzo base per le date indicate. La prima tariffa che corrisponde alla data vince.',
                'sub_fields'   => array(
                    array(
                        'key'         => 'field_ts_nome',
                        'label'       => 'Nome stagione',
                        'name'        => 'nome',
                        'type'        => 'text',
                        'placeholder' => 'es. Alta stagione, Ferragosto...',
                    ),
                    array(
                        'key'            => 'field_ts_data_inizio',
                        'label'          => 'Dal',
                        'name'           => 'data_inizio',
                        'type'           => 'date_picker',
                        'display_format' => 'd/m/Y',
                        'return_format'  => 'Y-m-d',
                    ),
                    array(
                        'key'            => 'field_ts_data_fine',
                        'label'          => 'Al (incluso)',
                        'name'           => 'data_fine',
                        'type'           => 'date_picker',
                        'display_format' => 'd/m/Y',
                        'return_format'  => 'Y-m-d',
                    ),
                    array(
                        'key'   => 'field_ts_prezzo',
                        'label' => 'Prezzo/notte (€)',
                        'name'  => 'prezzo_notte',
                        'type'  => 'number',
                        'min'   => 0,
                        'step'  => '0.5',
                    ),
                ),
            ),

        ),
        'location' => array( array( array(
            'param'    => 'post_type',
            'operator' => '==',
            'value'    => 'alloggio',
        ) ) ),
        'menu_order' => 0,
    ) );
} );

// ============================================================
// 4. HELPER — formatta un post alloggio per la REST API
// ============================================================
function lemura_format_alloggio( $post ) {
    if ( ! $post || $post->post_status !== 'publish' ) return null;

    $acf = array();
    if ( function_exists( 'get_fields' ) ) {
        $fields = get_fields( $post->ID );
        if ( is_array( $fields ) ) {
            $acf = $fields;
        }
    }

    // Featured image
    $featured_image = null;
    if ( has_post_thumbnail( $post->ID ) ) {
        $img_id = get_post_thumbnail_id( $post->ID );
        $img    = wp_get_attachment_image_src( $img_id, 'large' );
        if ( $img ) {
            $alt = get_post_meta( $img_id, '_wp_attachment_image_alt', true );
            $featured_image = array(
                'url'    => $img[0],
                'width'  => $img[1],
                'height' => $img[2],
                'alt'    => $alt ? $alt : get_the_title( $post->ID ),
            );
        }
    }

    // Galleria ACF
    $gallery = array();
    if ( ! empty( $acf['gallery'] ) && is_array( $acf['gallery'] ) ) {
        foreach ( $acf['gallery'] as $img ) {
            $gallery[] = array(
                'url'    => isset( $img['url'] )    ? $img['url']    : '',
                'alt'    => isset( $img['alt'] )    ? $img['alt']    : get_the_title( $post->ID ),
                'width'  => isset( $img['width'] )  ? $img['width']  : null,
                'height' => isset( $img['height'] ) ? $img['height'] : null,
            );
        }
    }

    // Servizi
    $servizi = array();
    if ( ! empty( $acf['servizi'] ) && is_array( $acf['servizi'] ) ) {
        foreach ( $acf['servizi'] as $s ) {
            $servizi[] = array(
                'nome'  => isset( $s['nome'] )  ? $s['nome']  : '',
                'icona' => isset( $s['icona'] ) ? $s['icona'] : '',
            );
        }
    }

    // Tariffe stagionali
    $tariffe_stagionali = array();
    if ( ! empty( $acf['tariffe_stagionali'] ) && is_array( $acf['tariffe_stagionali'] ) ) {
        foreach ( $acf['tariffe_stagionali'] as $t ) {
            $tariffe_stagionali[] = array(
                'nome'        => $t['nome']        ?? '',
                'data_inizio' => $t['data_inizio'] ?? '',
                'data_fine'   => $t['data_fine']   ?? '',
                'prezzo_notte'=> isset( $t['prezzo_notte'] ) ? floatval( $t['prezzo_notte'] ) : 0,
            );
        }
    }

    return array(
        'id'                 => $post->ID,
        'title'              => get_the_title( $post->ID ),
        'slug'               => $post->post_name,
        'description'        => apply_filters( 'the_content', $post->post_content ),
        'excerpt'            => $post->post_excerpt,
        'struttura'          => $acf['struttura']          ?? '',
        'tipo'               => $acf['tipo']               ?? '',
        'unit_id'            => $acf['unit_id']            ?? '',
        'prezzo_notte'       => $acf['prezzo_notte']       ?? '',
        'ospiti_base'        => intval( $acf['ospiti_base']        ?? 2 ),
        'ospiti_massimi'     => intval( $acf['ospiti_massimi']     ?? 4 ),
        'extra_per_ospite'   => floatval( $acf['extra_per_ospite'] ?? 0 ),
        'min_notti'          => intval( $acf['min_notti']          ?? 2 ),
        'max_notti'          => intval( $acf['max_notti']          ?? 30 ),
        'tariffe_stagionali' => $tariffe_stagionali,
        'superficie'         => $acf['superficie']         ?? '',
        'servizi'            => $servizi,
        'checkin_time'       => $acf['checkin_time']       ?? '',
        'checkout_time'      => $acf['checkout_time']      ?? '',
        'featured_image'     => $featured_image,
        'gallery'            => $gallery,
    );
}

// ============================================================
// 5. HELPER QUERY — recupera alloggi per struttura
// ============================================================
function lemura_query_struttura( $struttura, $limit = -1 ) {
    return get_posts( array(
        'post_type'   => 'alloggio',
        'post_status' => 'publish',
        'numberposts' => $limit,
        'orderby'     => 'menu_order',
        'order'       => 'ASC',
        'meta_query'  => array( array(
            'key'     => 'struttura',
            'value'   => $struttura,
            'compare' => '=',
        ) ),
    ) );
}

// ============================================================
// 6. REST API ENDPOINTS
// ============================================================
add_action( 'rest_api_init', function () {

    // GET /wp-json/lemura-crm/v1/sternatia
    register_rest_route( 'lemura-crm/v1', '/sternatia', array(
        'methods'             => WP_REST_Server::READABLE,
        'permission_callback' => '__return_true',
        'callback'            => function () {
            $posts = lemura_query_struttura( 'sternatia', 1 );
            if ( empty( $posts ) ) {
                return new WP_Error(
                    'not_found',
                    'Nessun alloggio trovato per Sternatia. Creane uno dall\'admin con struttura = sternatia.',
                    array( 'status' => 404 )
                );
            }
            return rest_ensure_response( lemura_format_alloggio( $posts[0] ) );
        },
    ) );

    // GET /wp-json/lemura-crm/v1/corigliano
    register_rest_route( 'lemura-crm/v1', '/corigliano', array(
        'methods'             => WP_REST_Server::READABLE,
        'permission_callback' => '__return_true',
        'callback'            => function () {
            $posts = lemura_query_struttura( 'corigliano' );
            $rooms = array();
            $spa   = null;
            foreach ( $posts as $post ) {
                $data = lemura_format_alloggio( $post );
                if ( ! $data ) continue;
                if ( $data['tipo'] === 'spa' ) {
                    $spa = $data;
                } else {
                    $rooms[] = $data;
                }
            }
            return rest_ensure_response( array(
                'rooms' => $rooms,
                'spa'   => $spa,
            ) );
        },
    ) );

    // GET /wp-json/lemura-crm/v1/strutture
    register_rest_route( 'lemura-crm/v1', '/strutture', array(
        'methods'             => WP_REST_Server::READABLE,
        'permission_callback' => '__return_true',
        'callback'            => function () {
            $s_posts   = lemura_query_struttura( 'sternatia', 1 );
            $sternatia = ! empty( $s_posts ) ? lemura_format_alloggio( $s_posts[0] ) : null;

            $c_posts = lemura_query_struttura( 'corigliano' );
            $rooms   = array();
            $spa     = null;
            foreach ( $c_posts as $post ) {
                $data = lemura_format_alloggio( $post );
                if ( ! $data ) continue;
                if ( $data['tipo'] === 'spa' ) {
                    $spa = $data;
                } else {
                    $rooms[] = $data;
                }
            }

            return rest_ensure_response( array(
                'sternatia'  => $sternatia,
                'corigliano' => array(
                    'rooms' => $rooms,
                    'spa'   => $spa,
                ),
            ) );
        },
    ) );

} );

// ============================================================
// 7. CPT: richiesta_info (richieste dal form contatti)
// ============================================================
add_action( 'init', function () {
    register_post_type( 'richiesta_info', array(
        'labels' => array(
            'name'          => 'Richieste Info',
            'singular_name' => 'Richiesta Info',
            'add_new'       => 'Nuova richiesta',
            'all_items'     => 'Tutte le richieste',
            'edit_item'     => 'Dettaglio richiesta',
        ),
        'public'       => false,
        'show_ui'      => true,
        'show_in_menu' => true,
        'show_in_rest' => false,
        'supports'     => array( 'title', 'editor', 'custom-fields' ),
        'menu_icon'    => 'dashicons-email-alt',
        'capability_type' => 'post',
    ) );
} );

// Campi ACF per richiesta_info
add_action( 'acf/init', function () {
    if ( ! function_exists( 'acf_add_local_field_group' ) ) return;

    acf_add_local_field_group( array(
        'key'    => 'group_richiesta_info_v1',
        'title'  => 'Dati Richiesta',
        'fields' => array(
            array( 'key' => 'field_ri_nome',     'label' => 'Nome',     'name' => 'ri_nome',     'type' => 'text' ),
            array( 'key' => 'field_ri_email',    'label' => 'Email',    'name' => 'ri_email',    'type' => 'email' ),
            array( 'key' => 'field_ri_telefono', 'label' => 'Telefono', 'name' => 'ri_telefono', 'type' => 'text' ),
            array( 'key' => 'field_ri_checkin',  'label' => 'Check-in', 'name' => 'ri_checkin',  'type' => 'text' ),
            array( 'key' => 'field_ri_checkout', 'label' => 'Check-out','name' => 'ri_checkout', 'type' => 'text' ),
            array( 'key' => 'field_ri_ospiti',   'label' => 'Ospiti',   'name' => 'ri_ospiti',   'type' => 'text' ),
            array( 'key' => 'field_ri_messaggio','label' => 'Messaggio','name' => 'ri_messaggio','type' => 'textarea' ),
        ),
        'location' => array( array( array(
            'param'    => 'post_type',
            'operator' => '==',
            'value'    => 'richiesta_info',
        ) ) ),
        'menu_order' => 0,
    ) );
} );

// ============================================================
// 8. ENDPOINT: POST /wp-json/lemura-crm/v1/inquiries
// ============================================================
add_action( 'rest_api_init', function () {

    register_rest_route( 'lemura-crm/v1', '/inquiries', array(
        'methods'             => WP_REST_Server::CREATABLE,
        'permission_callback' => '__return_true',
        'callback'            => function ( WP_REST_Request $request ) {

            $params = $request->get_json_params();
            if ( empty( $params ) ) {
                $params = $request->get_body_params();
            }

            // --- Validazione campi obbligatori ---
            $nome  = sanitize_text_field( $params['nome']  ?? '' );
            $email = sanitize_email( $params['email'] ?? '' );

            if ( ! $nome || ! $email ) {
                return new WP_Error(
                    'missing_fields',
                    'Nome ed email sono obbligatori.',
                    array( 'status' => 422 )
                );
            }
            if ( ! is_email( $email ) ) {
                return new WP_Error(
                    'invalid_email',
                    'Indirizzo email non valido.',
                    array( 'status' => 422 )
                );
            }

            // --- Sanitizzazione ---
            $telefono = sanitize_text_field( $params['telefono'] ?? '' );
            $checkin  = sanitize_text_field( $params['checkin']  ?? '' );
            $checkout = sanitize_text_field( $params['checkout'] ?? '' );
            $ospiti   = sanitize_text_field( $params['ospiti']   ?? '1' );
            $messaggio= sanitize_textarea_field( $params['messaggio'] ?? '' );

            // --- Salvataggio come CPT ---
            $titolo = sprintf(
                'Richiesta da %s — %s',
                $nome,
                current_time( 'd/m/Y H:i' )
            );

            $post_id = wp_insert_post( array(
                'post_type'   => 'richiesta_info',
                'post_status' => 'publish',
                'post_title'  => $titolo,
                'post_content'=> $messaggio,
            ) );

            if ( is_wp_error( $post_id ) ) {
                return new WP_Error(
                    'save_failed',
                    'Errore nel salvataggio della richiesta.',
                    array( 'status' => 500 )
                );
            }

            // Salva i campi come post_meta (funziona anche senza ACF)
            $meta = array(
                'ri_nome'     => $nome,
                'ri_email'    => $email,
                'ri_telefono' => $telefono,
                'ri_checkin'  => $checkin,
                'ri_checkout' => $checkout,
                'ri_ospiti'   => $ospiti,
                'ri_messaggio'=> $messaggio,
            );
            foreach ( $meta as $key => $val ) {
                update_post_meta( $post_id, $key, $val );
            }
            // Se ACF è attivo aggiorna anche i suoi campi
            if ( function_exists( 'update_field' ) ) {
                foreach ( $meta as $key => $val ) {
                    update_field( $key, $val, $post_id );
                }
            }

            // --- Email di notifica al proprietario ---
            $admin_email = get_option( 'admin_email' );
            $subject = sprintf( '[Le Mura degli Angeli] Nuova richiesta da %s', $nome );
            $body  = "Hai ricevuto una nuova richiesta dal sito.\n\n";
            $body .= "Nome:      $nome\n";
            $body .= "Email:     $email\n";
            $body .= "Telefono:  $telefono\n";
            $body .= "Check-in:  $checkin\n";
            $body .= "Check-out: $checkout\n";
            $body .= "Ospiti:    $ospiti\n";
            if ( $messaggio ) {
                $body .= "Messaggio:\n$messaggio\n";
            }
            $body .= "\nVisualizza nel pannello admin:\n";
            $body .= admin_url( "post.php?post={$post_id}&action=edit" );

            wp_mail(
                $admin_email,
                $subject,
                $body,
                array( "Reply-To: $nome <$email>" )
            );

            return rest_ensure_response( array(
                'success' => true,
                'message' => 'Richiesta ricevuta. Ti risponderemo entro 24 ore.',
                'id'      => $post_id,
            ) );
        },
    ) );

} );

// ============================================================
// 9. CPT: prenotazione (booking engine)
// ============================================================
add_action( 'init', function () {
    register_post_type( 'prenotazione', array(
        'labels' => array(
            'name'          => 'Prenotazioni',
            'singular_name' => 'Prenotazione',
            'add_new'       => 'Nuova prenotazione',
            'all_items'     => 'Tutte le prenotazioni',
            'edit_item'     => 'Dettaglio prenotazione',
        ),
        'public'          => false,
        'show_ui'         => true,
        'show_in_menu'    => true,
        'show_in_rest'    => false,
        'supports'        => array( 'title', 'custom-fields' ),
        'menu_icon'       => 'dashicons-calendar-alt',
        'capability_type' => 'post',
    ) );
} );

add_action( 'acf/init', function () {
    if ( ! function_exists( 'acf_add_local_field_group' ) ) return;

    acf_add_local_field_group( array(
        'key'    => 'group_prenotazione_v1',
        'title'  => 'Dettagli Prenotazione',
        'fields' => array(
            array(
                'key'      => 'field_pren_unit',
                'label'    => 'Unità',
                'name'     => 'pren_unit',
                'type'     => 'select',
                'required' => 1,
                'choices'  => array(
                    'sternatia'            => 'Sternatia — Casa intera',
                    'corigliano-camera-1'  => 'Corigliano — Camera 1',
                    'corigliano-camera-2'  => 'Corigliano — Camera 2',
                ),
            ),
            array(
                'key'            => 'field_pren_checkin',
                'label'          => 'Check-in',
                'name'           => 'pren_checkin',
                'type'           => 'date_picker',
                'display_format' => 'd/m/Y',
                'return_format'  => 'Y-m-d',
                'required'       => 1,
            ),
            array(
                'key'            => 'field_pren_checkout',
                'label'          => 'Check-out',
                'name'           => 'pren_checkout',
                'type'           => 'date_picker',
                'display_format' => 'd/m/Y',
                'return_format'  => 'Y-m-d',
                'required'       => 1,
            ),
            array( 'key' => 'field_pren_guest_name',  'label' => 'Nome ospite',  'name' => 'pren_guest_name',  'type' => 'text' ),
            array( 'key' => 'field_pren_guest_email', 'label' => 'Email ospite', 'name' => 'pren_guest_email', 'type' => 'email' ),
            array( 'key' => 'field_pren_guest_phone', 'label' => 'Telefono',     'name' => 'pren_guest_phone', 'type' => 'text' ),
            array( 'key' => 'field_pren_guests',      'label' => 'N. ospiti',    'name' => 'pren_guests',      'type' => 'number' ),
            array( 'key' => 'field_pren_message',     'label' => 'Messaggio',    'name' => 'pren_message',     'type' => 'textarea' ),
            array(
                'key'     => 'field_pren_status',
                'label'   => 'Stato',
                'name'    => 'pren_status',
                'type'    => 'select',
                'choices' => array(
                    'pending'   => '🕐 In attesa',
                    'confirmed' => '✅ Confermata',
                    'rejected'  => '❌ Rifiutata',
                    'cancelled' => '🚫 Annullata',
                ),
                'default_value' => 'pending',
            ),
            array(
                'key'     => 'field_pren_source',
                'label'   => 'Fonte',
                'name'    => 'pren_source',
                'type'    => 'select',
                'choices' => array(
                    'website' => 'Sito web',
                    'airbnb'  => 'Airbnb',
                    'booking' => 'Booking.com',
                    'manual'  => 'Manuale',
                ),
                'default_value' => 'website',
            ),
            array(
                'key'          => 'field_pren_external_uid',
                'label'        => 'UID iCal esterno',
                'name'         => 'pren_external_uid',
                'type'         => 'text',
                'instructions' => 'Compilato automaticamente durante l\'importazione iCal. Non modificare.',
                'read_only'    => 1,
            ),
        ),
        'location' => array( array( array(
            'param'    => 'post_type',
            'operator' => '==',
            'value'    => 'prenotazione',
        ) ) ),
        'menu_order' => 0,
    ) );
} );

// ============================================================
// 10. ADMIN — Pagina impostazioni feed iCal
// ============================================================
add_action( 'admin_menu', function () {
    add_submenu_page(
        'edit.php?post_type=prenotazione',
        'Sincronizzazione Calendari',
        '🔄 Sync Calendari',
        'manage_options',
        'lemura-ical-settings',
        'lemura_ical_settings_page'
    );
} );

function lemura_ical_settings_page() {
    $units = array(
        'sternatia'           => 'Sternatia — Casa intera',
        'corigliano-camera-1' => 'Corigliano — Camera 1',
        'corigliano-camera-2' => 'Corigliano — Camera 2',
    );
    $sources = array( 'airbnb' => 'Airbnb', 'booking' => 'Booking.com' );

    if ( isset( $_POST['lemura_ical_save'] ) ) {
        check_admin_referer( 'lemura_ical_settings' );
        foreach ( $units as $unit_key => $_ ) {
            foreach ( $sources as $src_key => $_ ) {
                $opt = "lemura_ical_{$unit_key}_{$src_key}";
                $val = esc_url_raw( $_POST[ $opt ] ?? '' );
                if ( $val ) update_option( $opt, $val );
                else        delete_option( $opt );
            }
        }
        // Avvia sincronizzazione immediata
        lemura_do_ical_sync();
        echo '<div class="notice notice-success is-dismissible"><p>✅ Impostazioni salvate e sincronizzazione avviata.</p></div>';
    }

    $site_url = get_site_url();
    ?>
    <div class="wrap">
    <h1>Sincronizzazione Calendari — Le Mura degli Angeli</h1>

    <h2>📤 Feed da esportare verso Airbnb / Booking.com</h2>
    <p>Copia questi URL e aggiungili come "calendario da importare" su ciascuna piattaforma.</p>
    <table class="widefat striped" style="max-width:800px">
        <thead><tr><th>Unità</th><th>URL feed iCal</th></tr></thead>
        <tbody>
        <?php foreach ( $units as $unit_key => $unit_label ) : ?>
        <tr>
            <td><strong><?= esc_html( $unit_label ) ?></strong></td>
            <td>
                <code style="user-select:all;font-size:0.85em">
                    <?= esc_html( $site_url ) ?>/wp-json/lemura-crm/v1/calendar/<?= esc_attr( $unit_key ) ?>.ics
                </code>
            </td>
        </tr>
        <?php endforeach; ?>
        </tbody>
    </table>

    <h2 style="margin-top:2em">📥 Feed da importare (Airbnb / Booking.com → WordPress)</h2>
    <p>Incolla qui i feed iCal di ogni piattaforma. WordPress li importerà ogni ora.</p>
    <form method="post">
    <?php wp_nonce_field( 'lemura_ical_settings' ); ?>
    <table class="widefat striped" style="max-width:800px">
        <thead>
            <tr>
                <th>Unità</th>
                <?php foreach ( $sources as $src_label ) : ?>
                    <th><?= esc_html( $src_label ) ?></th>
                <?php endforeach; ?>
            </tr>
        </thead>
        <tbody>
        <?php foreach ( $units as $unit_key => $unit_label ) : ?>
        <tr>
            <td><strong><?= esc_html( $unit_label ) ?></strong></td>
            <?php foreach ( $sources as $src_key => $src_label ) : ?>
            <td>
                <input type="url"
                       name="lemura_ical_<?= esc_attr( $unit_key ) ?>_<?= esc_attr( $src_key ) ?>"
                       value="<?= esc_attr( get_option( "lemura_ical_{$unit_key}_{$src_key}" ) ) ?>"
                       style="width:100%"
                       placeholder="https://www.<?= esc_attr( $src_key ) ?>.com/...ics" />
            </td>
            <?php endforeach; ?>
        </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
    <p style="margin-top:1em">
        <input type="submit" name="lemura_ical_save" class="button button-primary" value="💾 Salva e sincronizza ora" />
    </p>
    </form>

    <h2 style="margin-top:2em">ℹ️ Prossima sincronizzazione automatica</h2>
    <?php
    $next = wp_next_scheduled( 'lemura_sync_ical' );
    if ( $next ) {
        echo '<p>Prossima esecuzione: <strong>' . date_i18n( 'd/m/Y H:i', $next ) . '</strong></p>';
    } else {
        echo '<p>⚠️ Cron non programmato. <a href="' . esc_url( add_query_arg( 'lemura_reschedule', '1' ) ) . '">Clicca per riprogrammare</a>.</p>';
    }
    if ( isset( $_GET['lemura_reschedule'] ) ) {
        wp_schedule_event( time(), 'hourly', 'lemura_sync_ical' );
        echo '<p>✅ Cron riprogrammato.</p>';
    }
    ?>
    </div>
    <?php
}

// ============================================================
// 11. WP CRON — sincronizzazione iCal ogni ora
// ============================================================
register_activation_hook( __FILE__, function () {
    if ( ! wp_next_scheduled( 'lemura_sync_ical' ) ) {
        wp_schedule_event( time(), 'hourly', 'lemura_sync_ical' );
    }
} );

register_deactivation_hook( __FILE__, function () {
    wp_clear_scheduled_hook( 'lemura_sync_ical' );
} );

add_action( 'lemura_sync_ical', 'lemura_do_ical_sync' );

function lemura_do_ical_sync() {
    $units   = array( 'sternatia', 'corigliano-camera-1', 'corigliano-camera-2' );
    $sources = array( 'airbnb', 'booking' );

    foreach ( $units as $unit ) {
        foreach ( $sources as $source ) {
            $url = get_option( "lemura_ical_{$unit}_{$source}" );
            if ( $url ) {
                lemura_import_ical_feed( $url, $unit, $source );
            }
        }
    }
}

// ============================================================
// 12. PARSER iCal — importa eventi da un feed .ics
// ============================================================
// Helper: riconosce i summary che indicano chiusura manuale
// (NON prenotazioni reali di ospiti)
// ============================================================
function lemura_ical_is_closure( $summary ) {
    $s = strtolower( trim( $summary ) );

    // Match esatto — chiusure tipiche di Airbnb e Booking.com
    $exact = array(
        'not available',
        'airbnb (not available)',
        'unavailable',
        'closed',          // Booking.com: chiusura singola senza ID
        'blocked',
        'bloccato',
        'nicht verfügbar', // tedesco
        'no disponible',   // spagnolo
        'indisponible',    // francese
    );
    if ( in_array( $s, $exact, true ) ) return true;

    // Match parziale — es. "Airbnb (Not available) - ..."
    $partial = array( 'not available', 'non disponibile' );
    foreach ( $partial as $p ) {
        if ( strpos( $s, $p ) !== false ) return true;
    }

    return false;
}

// ============================================================
function lemura_import_ical_feed( $url, $unit, $source ) {
    $response = wp_remote_get( $url, array(
        'timeout'    => 30,
        'user-agent' => 'LeMuraBot/1.0',
    ) );
    if ( is_wp_error( $response ) ) return;

    $body = wp_remote_retrieve_body( $response );
    if ( ! $body ) return;

    $raw_events = lemura_parse_ical( $body );

    // ----------------------------------------------------------
    // 1. Filtra eventi fake (chiusure giornaliere, non prenotazioni)
    // ----------------------------------------------------------
    $real_events = array();
    foreach ( $raw_events as $event ) {
        if ( empty( $event['dtstart'] ) || empty( $event['dtend'] ) ) continue;

        // Scarta eventi a durata zero
        if ( $event['dtstart'] >= $event['dtend'] ) continue;

        // Scarta chiusure manuali
        $summary_raw = $event['summary'] ?? '';
        if ( lemura_ical_is_closure( $summary_raw ) ) continue;

        $real_events[] = $event;
    }

    // ----------------------------------------------------------
    // 2. Raggruppa eventi consecutivi dello stesso "blocco"
    //    (alcune piattaforme esportano 1 VEVENT per notte)
    //    Ordina per data e unisci quelli adiacenti senza UID reale
    // ----------------------------------------------------------
    usort( $real_events, function( $a, $b ) {
        return strcmp( $a['dtstart'], $b['dtstart'] );
    } );

    $merged = array();
    foreach ( $real_events as $ev ) {
        $last_idx     = count( $merged ) - 1;
        $has_real_uid = ! empty( $ev['uid'] ) && strlen( $ev['uid'] ) > 10;

        if (
            $last_idx >= 0 &&
            ! $has_real_uid &&
            $merged[ $last_idx ]['dtend'] === $ev['dtstart']  // eventi adiacenti
        ) {
            // Estendi il blocco precedente
            $merged[ $last_idx ]['dtend'] = $ev['dtend'];
        } else {
            $merged[] = $ev;
        }
    }

    // ----------------------------------------------------------
    // 3. Salva le prenotazioni reali
    // ----------------------------------------------------------
    foreach ( $merged as $event ) {
        if ( empty( $event['uid'] ) ) continue;

        // Skip nel passato
        if ( strtotime( $event['dtend'] ) < strtotime( 'today' ) ) continue;

        // Controlla se esiste già (UID + unità)
        $existing = get_posts( array(
            'post_type'   => 'prenotazione',
            'post_status' => 'publish',
            'numberposts' => 1,
            'meta_query'  => array(
                array( 'key' => 'pren_external_uid', 'value' => $event['uid'] ),
                array( 'key' => 'pren_unit',         'value' => $unit ),
            ),
        ) );

        if ( ! empty( $existing ) ) {
            $pid = $existing[0]->ID;
            update_post_meta( $pid, 'pren_checkin',  $event['dtstart'] );
            update_post_meta( $pid, 'pren_checkout', $event['dtend'] );
            continue;
        }

        // Crea nuova prenotazione importata
        $summary = ! empty( $event['summary'] ) ? sanitize_text_field( $event['summary'] ) : 'Prenotazione';
        $post_id = wp_insert_post( array(
            'post_type'   => 'prenotazione',
            'post_status' => 'publish',
            'post_title'  => ucfirst( $source ) . ' — ' . $unit . ' — ' . $event['dtstart'],
        ) );
        if ( is_wp_error( $post_id ) ) continue;

        $meta = array(
            'pren_unit'         => $unit,
            'pren_checkin'      => $event['dtstart'],
            'pren_checkout'     => $event['dtend'],
            'pren_status'       => 'confirmed',
            'pren_source'       => $source,
            'pren_external_uid' => $event['uid'],
            'pren_guest_name'   => $summary,
        );
        foreach ( $meta as $k => $v ) {
            update_post_meta( $post_id, $k, $v );
        }
    }
}

function lemura_parse_ical( $ical_string ) {
    $events = array();

    // Normalizza line endings e ricompone le righe piegate (iCal spec: continuation = spazio/tab iniziale)
    $ical_string = str_replace( "\r\n", "\n", $ical_string );
    $ical_string = str_replace( "\r",   "\n", $ical_string );
    $ical_string = preg_replace( '/\n[ \t]/', '', $ical_string ); // unfold

    $lines     = explode( "\n", $ical_string );
    $in_event  = false;
    $current   = array();

    foreach ( $lines as $line ) {
        $line = trim( $line );
        if ( $line === '' ) continue;

        if ( $line === 'BEGIN:VEVENT' ) {
            $in_event = true;
            $current  = array();
            continue;
        }
        if ( $line === 'END:VEVENT' ) {
            $in_event = false;
            if ( ! empty( $current ) ) $events[] = $current;
            continue;
        }
        if ( ! $in_event ) continue;
        if ( strpos( $line, ':' ) === false ) continue;

        list( $raw_key, $value ) = explode( ':', $line, 2 );
        // Rimuove parametri es. DTSTART;VALUE=DATE → dtstart
        $key   = strtolower( preg_replace( '/;.*$/', '', $raw_key ) );
        $value = trim( $value );

        // Normalizza date YYYYMMDD[Thhmmss[Z]] → YYYY-MM-DD
        if ( in_array( $key, array( 'dtstart', 'dtend' ) ) ) {
            if ( preg_match( '/^(\d{4})(\d{2})(\d{2})/', $value, $m ) ) {
                $value = "{$m[1]}-{$m[2]}-{$m[3]}";
            }
        }

        $current[ $key ] = $value;
    }

    return $events;
}

// ============================================================
// 13. ESPORTATORE iCal — genera feed .ics per ogni unità
// ============================================================
function lemura_export_ical( $unit ) {
    $unit_labels = array(
        'sternatia'           => 'Sternatia Casa intera',
        'corigliano-camera-1' => 'Corigliano Camera 1',
        'corigliano-camera-2' => 'Corigliano Camera 2',
    );

    $posts = get_posts( array(
        'post_type'   => 'prenotazione',
        'post_status' => 'publish',
        'numberposts' => -1,
        'meta_query'  => array(
            array( 'key' => 'pren_unit',   'value' => $unit ),
            array( 'key' => 'pren_status', 'value' => array( 'confirmed', 'pending' ), 'compare' => 'IN' ),
            array( 'key' => 'pren_checkout', 'value' => date( 'Y-m-d' ), 'compare' => '>=' ),
        ),
    ) );

    $cal  = "BEGIN:VCALENDAR\r\n";
    $cal .= "VERSION:2.0\r\n";
    $cal .= "PRODID:-//Le Mura degli Angeli//Booking//IT\r\n";
    $cal .= "CALSCALE:GREGORIAN\r\n";
    $cal .= "METHOD:PUBLISH\r\n";
    $cal .= "X-WR-CALNAME:Le Mura degli Angeli - " . ( $unit_labels[ $unit ] ?? $unit ) . "\r\n";

    foreach ( $posts as $post ) {
        $checkin  = get_post_meta( $post->ID, 'pren_checkin',  true );
        $checkout = get_post_meta( $post->ID, 'pren_checkout', true );
        if ( ! $checkin || ! $checkout ) continue;

        $dtstart  = str_replace( '-', '', $checkin );
        $dtend    = str_replace( '-', '', $checkout );
        $uid      = 'pren-' . $post->ID . '@lemuradegliangelibnb';
        $dtstamp  = gmdate( 'Ymd\THis\Z' );

        $cal .= "BEGIN:VEVENT\r\n";
        $cal .= "DTSTART;VALUE=DATE:{$dtstart}\r\n";
        $cal .= "DTEND;VALUE=DATE:{$dtend}\r\n";
        $cal .= "DTSTAMP:{$dtstamp}\r\n";
        $cal .= "UID:{$uid}\r\n";
        $cal .= "SUMMARY:Reserved\r\n";
        $cal .= "END:VEVENT\r\n";
    }

    $cal .= "END:VCALENDAR\r\n";
    return $cal;
}

// ============================================================
// 14. REST API — Booking engine endpoints
// ============================================================
add_action( 'rest_api_init', function () {

    $valid_units = array( 'sternatia', 'corigliano-camera-1', 'corigliano-camera-2' );

    // ── GET /lemura-crm/v1/availability?unit=sternatia ──────
    register_rest_route( 'lemura-crm/v1', '/availability', array(
        'methods'             => WP_REST_Server::READABLE,
        'permission_callback' => '__return_true',
        'callback'            => function ( WP_REST_Request $request ) use ( $valid_units ) {
            $unit = sanitize_text_field( $request->get_param( 'unit' ) ?? '' );
            if ( ! in_array( $unit, $valid_units ) ) {
                return new WP_Error( 'invalid_unit', 'Unità non valida. Valori accettati: ' . implode( ', ', $valid_units ), array( 'status' => 400 ) );
            }

            $posts = get_posts( array(
                'post_type'   => 'prenotazione',
                'post_status' => 'publish',
                'numberposts' => -1,
                'meta_query'  => array(
                    array( 'key' => 'pren_unit',     'value' => $unit ),
                    array( 'key' => 'pren_status',   'value' => array( 'confirmed', 'pending' ), 'compare' => 'IN' ),
                    array( 'key' => 'pren_checkout',  'value' => date( 'Y-m-d' ), 'compare' => '>=' ),
                ),
            ) );

            $blocked = array();
            foreach ( $posts as $post ) {
                $ci = get_post_meta( $post->ID, 'pren_checkin',  true );
                $co = get_post_meta( $post->ID, 'pren_checkout', true );
                if ( $ci && $co ) {
                    $blocked[] = array( 'start' => $ci, 'end' => $co );
                }
            }

            return rest_ensure_response( array( 'unit' => $unit, 'blocked' => $blocked ) );
        },
    ) );

    // ── POST /lemura-crm/v1/bookings ────────────────────────
    register_rest_route( 'lemura-crm/v1', '/bookings', array(
        'methods'             => WP_REST_Server::CREATABLE,
        'permission_callback' => '__return_true',
        'callback'            => function ( WP_REST_Request $request ) use ( $valid_units ) {
            $params = $request->get_json_params();
            if ( empty( $params ) ) $params = $request->get_body_params();

            $unit     = sanitize_text_field( $params['unit']     ?? '' );
            $checkin  = sanitize_text_field( $params['checkin']  ?? '' );
            $checkout = sanitize_text_field( $params['checkout'] ?? '' );
            $nome     = sanitize_text_field( $params['nome']     ?? '' );
            $email    = sanitize_email(      $params['email']    ?? '' );

            // Validazione
            if ( ! in_array( $unit, $valid_units ) ) {
                return new WP_Error( 'invalid_unit', 'Unità non valida.', array( 'status' => 422 ) );
            }
            if ( ! $checkin || ! $checkout || ! $nome || ! $email ) {
                return new WP_Error( 'missing_fields', 'Tutti i campi obbligatori devono essere compilati.', array( 'status' => 422 ) );
            }
            if ( ! is_email( $email ) ) {
                return new WP_Error( 'invalid_email', 'Indirizzo email non valido.', array( 'status' => 422 ) );
            }
            if ( strtotime( $checkin ) >= strtotime( $checkout ) ) {
                return new WP_Error( 'invalid_dates', 'Il check-out deve essere successivo al check-in.', array( 'status' => 422 ) );
            }
            if ( strtotime( $checkin ) < strtotime( 'today' ) ) {
                return new WP_Error( 'past_dates', 'Non è possibile prenotare date nel passato.', array( 'status' => 422 ) );
            }

            // Controllo conflitti
            $conflicts = get_posts( array(
                'post_type'   => 'prenotazione',
                'post_status' => 'publish',
                'numberposts' => 1,
                'meta_query'  => array(
                    'relation' => 'AND',
                    array( 'key' => 'pren_unit',     'value' => $unit ),
                    array( 'key' => 'pren_status',   'value' => array( 'confirmed', 'pending' ), 'compare' => 'IN' ),
                    array( 'key' => 'pren_checkin',  'value' => $checkout, 'compare' => '<' ),
                    array( 'key' => 'pren_checkout', 'value' => $checkin,  'compare' => '>' ),
                ),
            ) );
            if ( ! empty( $conflicts ) ) {
                return new WP_Error( 'not_available', 'Le date selezionate non sono disponibili per questa struttura.', array( 'status' => 409 ) );
            }

            // Sanitizzazione campi opzionali
            $telefono = sanitize_text_field(     $params['telefono'] ?? '' );
            $ospiti   = absint(                  $params['ospiti']   ?? 1 );
            $messaggio= sanitize_textarea_field( $params['messaggio']?? '' );

            $unit_labels = array(
                'sternatia'           => 'Sternatia — Casa intera',
                'corigliano-camera-1' => 'Corigliano — Camera 1',
                'corigliano-camera-2' => 'Corigliano — Camera 2',
            );
            $unit_label = $unit_labels[ $unit ] ?? $unit;

            // Salvataggio
            $post_id = wp_insert_post( array(
                'post_type'   => 'prenotazione',
                'post_status' => 'publish',
                'post_title'  => "$unit_label — $nome — $checkin",
            ) );
            if ( is_wp_error( $post_id ) ) {
                return new WP_Error( 'save_failed', 'Errore nel salvataggio.', array( 'status' => 500 ) );
            }

            $meta = array(
                'pren_unit'        => $unit,
                'pren_checkin'     => $checkin,
                'pren_checkout'    => $checkout,
                'pren_guest_name'  => $nome,
                'pren_guest_email' => $email,
                'pren_guest_phone' => $telefono,
                'pren_guests'      => $ospiti,
                'pren_message'     => $messaggio,
                'pren_status'      => 'pending',
                'pren_source'      => 'website',
            );
            foreach ( $meta as $k => $v ) update_post_meta( $post_id, $k, $v );

            // Email notifica
            $admin_email = get_option( 'admin_email' );
            $subject = "[Le Mura degli Angeli] Nuova richiesta prenotazione: $unit_label";
            $nights  = round( ( strtotime( $checkout ) - strtotime( $checkin ) ) / 86400 );
            $body  = "Nuova richiesta di prenotazione dal sito.\n\n";
            $body .= "Struttura: $unit_label\n";
            $body .= "Check-in:  $checkin\n";
            $body .= "Check-out: $checkout\n";
            $body .= "Notti:     $nights\n";
            $body .= "Ospiti:    $ospiti\n";
            $body .= "Nome:      $nome\n";
            $body .= "Email:     $email\n";
            $body .= "Telefono:  $telefono\n";
            if ( $messaggio ) $body .= "Messaggio:\n$messaggio\n";
            $body .= "\n➡ Gestisci la richiesta:\n" . admin_url( "post.php?post=$post_id&action=edit" );

            wp_mail( $admin_email, $subject, $body, array( "Reply-To: $nome <$email>" ) );

            return rest_ensure_response( array(
                'success' => true,
                'id'      => $post_id,
                'message' => 'Richiesta inviata con successo! Ti risponderemo entro 24 ore.',
            ) );
        },
    ) );

    // ── GET /lemura-crm/v1/calendar/{unit}.ics ──────────────
    register_rest_route( 'lemura-crm/v1', '/calendar/(?P<unit>[a-z0-9-]+)\.ics', array(
        'methods'             => WP_REST_Server::READABLE,
        'permission_callback' => '__return_true',
        'callback'            => function ( WP_REST_Request $request ) use ( $valid_units ) {
            $unit = sanitize_text_field( $request->get_param( 'unit' ) );
            if ( ! in_array( $unit, $valid_units ) ) {
                return new WP_Error( 'invalid_unit', 'Unità non valida.', array( 'status' => 404 ) );
            }
            $ical = lemura_export_ical( $unit );
            header( 'Content-Type: text/calendar; charset=utf-8' );
            header( 'Content-Disposition: inline; filename="' . $unit . '.ics"' );
            header( 'Cache-Control: no-cache, must-revalidate' );
            echo $ical; // phpcs:ignore WordPress.Security.EscapeOutput
            exit;
        },
    ) );

} );

// ============================================================
// 15. PRICING ENGINE
//     GET /wp-json/lemura-crm/v1/pricing
//     ?unit=sternatia&checkin=YYYY-MM-DD&checkout=YYYY-MM-DD&ospiti=N
// ============================================================

// Helper: trova l'alloggio dato l'unit_id
function lemura_get_alloggio_by_unit( $unit_id ) {
    $posts = get_posts( array(
        'post_type'   => 'alloggio',
        'post_status' => 'publish',
        'numberposts' => 1,
        'meta_query'  => array( array(
            'key'   => 'unit_id',
            'value' => $unit_id,
        ) ),
    ) );
    return ! empty( $posts ) ? $posts[0] : null;
}

// Helper: calcola prezzo per una singola notte dato le tariffe stagionali
function lemura_prezzo_per_notte( $data_str, $prezzo_base, $tariffe_stagionali ) {
    foreach ( $tariffe_stagionali as $t ) {
        if (
            ! empty( $t['data_inizio'] ) &&
            ! empty( $t['data_fine'] ) &&
            $data_str >= $t['data_inizio'] &&
            $data_str <= $t['data_fine']
        ) {
            return array(
                'prezzo'  => floatval( $t['prezzo_notte'] ),
                'stagione'=> $t['nome'] ?? null,
            );
        }
    }
    return array( 'prezzo' => $prezzo_base, 'stagione' => null );
}

add_action( 'rest_api_init', function () {

    $valid_units = array( 'sternatia', 'corigliano-camera-1', 'corigliano-camera-2' );

    register_rest_route( 'lemura-crm/v1', '/pricing', array(
        'methods'             => WP_REST_Server::READABLE,
        'permission_callback' => '__return_true',
        'callback'            => function ( WP_REST_Request $request ) use ( $valid_units ) {

            $unit     = sanitize_text_field( $request->get_param( 'unit' )     ?? '' );
            $checkin  = sanitize_text_field( $request->get_param( 'checkin' )  ?? '' );
            $checkout = sanitize_text_field( $request->get_param( 'checkout' ) ?? '' );
            $ospiti   = absint( $request->get_param( 'ospiti' ) ?? 2 );
            if ( $ospiti < 1 ) $ospiti = 1;

            if ( ! in_array( $unit, $valid_units ) ) {
                return new WP_Error( 'invalid_unit', 'Unità non valida.', array( 'status' => 400 ) );
            }
            if ( ! $checkin || ! $checkout ) {
                return new WP_Error( 'missing_dates', 'Checkin e checkout sono obbligatori.', array( 'status' => 400 ) );
            }
            if ( strtotime( $checkin ) >= strtotime( $checkout ) ) {
                return new WP_Error( 'invalid_dates', 'Il checkout deve essere successivo al checkin.', array( 'status' => 400 ) );
            }

            // Trova alloggio
            $post = lemura_get_alloggio_by_unit( $unit );
            if ( ! $post ) {
                return new WP_Error( 'not_found', 'Alloggio non trovato per questa unità.', array( 'status' => 404 ) );
            }

            $acf = function_exists( 'get_fields' ) ? ( get_fields( $post->ID ) ?: array() ) : array();

            $prezzo_base      = floatval( $acf['prezzo_notte']     ?? 0 );
            $ospiti_base      = intval(   $acf['ospiti_base']      ?? 2 );
            $ospiti_massimi   = intval(   $acf['ospiti_massimi']   ?? 10 );
            $extra_per_ospite = floatval( $acf['extra_per_ospite'] ?? 0 );
            $min_notti        = intval(   $acf['min_notti']        ?? 1 );
            $max_notti        = intval(   $acf['max_notti']        ?? 365 );
            // Legge tariffe dal meta custom (gestito dalla pagina Tariffario)
            $tariffe_json = get_post_meta( $post->ID, 'lemura_tariffe', true );
            $tariffe      = $tariffe_json ? json_decode( $tariffe_json, true ) : array();

            $notti = round( ( strtotime( $checkout ) - strtotime( $checkin ) ) / 86400 );

            // Validazioni
            $errori = array();
            if ( $ospiti > $ospiti_massimi ) {
                $errori[] = "Questo alloggio accetta massimo {$ospiti_massimi} ospiti.";
            }
            if ( $notti < $min_notti ) {
                $errori[] = "Soggiorno minimo: {$min_notti} nott" . ( $min_notti === 1 ? 'e' : 'i' ) . '.';
            }
            if ( $notti > $max_notti ) {
                $errori[] = "Soggiorno massimo: {$max_notti} notti.";
            }

            // Calcolo prezzo notte per notte
            $extra_notte = max( 0, $ospiti - $ospiti_base ) * $extra_per_ospite;
            $breakdown   = array();
            $totale      = 0.0;

            $current = strtotime( $checkin );
            $end     = strtotime( $checkout );

            while ( $current < $end ) {
                $data_str = date( 'Y-m-d', $current );
                $rata     = lemura_prezzo_per_notte( $data_str, $prezzo_base, $tariffe );

                $totale_notte = $rata['prezzo'] + $extra_notte;
                $totale      += $totale_notte;

                $breakdown[] = array(
                    'data'         => $data_str,
                    'prezzo_base'  => $rata['prezzo'],
                    'extra_ospiti' => $extra_notte,
                    'totale_notte' => $totale_notte,
                    'stagione'     => $rata['stagione'],
                );

                $current = strtotime( '+1 day', $current );
            }

            return rest_ensure_response( array(
                'unit'              => $unit,
                'checkin'           => $checkin,
                'checkout'          => $checkout,
                'ospiti'            => $ospiti,
                'ospiti_base'       => $ospiti_base,
                'ospiti_massimi'    => $ospiti_massimi,
                'extra_per_ospite'  => $extra_per_ospite,
                'min_notti'         => $min_notti,
                'max_notti'         => $max_notti,
                'notti'             => (int) $notti,
                'prezzo_base_notte' => $prezzo_base,
                'extra_notte'       => $extra_notte,
                'breakdown'         => $breakdown,
                'totale'            => round( $totale, 2 ),
                'valido'            => empty( $errori ),
                'errori'            => $errori,
            ) );
        },
    ) );

} );

// ============================================================
// 16. CALENDARIO ADMIN — FullCalendar con tutte le prenotazioni
// ============================================================
add_action( 'admin_menu', function () {
    add_submenu_page(
        'edit.php?post_type=prenotazione',
        'Calendario Prenotazioni',
        '📅 Calendario',
        'manage_options',
        'lemura-calendario',
        'lemura_calendario_page'
    );
} );

function lemura_calendario_page() {

    $status_colors = array(
        'confirmed' => '#22c55e',
        'pending'   => '#f59e0b',
        'rejected'  => '#ef4444',
        'cancelled' => '#94a3b8',
    );
    $unit_short = array(
        'sternatia'           => 'Sternatia',
        'corigliano-camera-1' => 'Cam.1',
        'corigliano-camera-2' => 'Cam.2',
    );

    // — Prenotazioni —
    $events = array();
    $prenotazioni = get_posts( array(
        'post_type'   => 'prenotazione',
        'post_status' => 'publish',
        'numberposts' => -1,
    ) );
    foreach ( $prenotazioni as $post ) {
        $ci     = get_post_meta( $post->ID, 'pren_checkin',    true );
        $co     = get_post_meta( $post->ID, 'pren_checkout',   true );
        $status = get_post_meta( $post->ID, 'pren_status',     true ) ?: 'pending';
        $unit   = get_post_meta( $post->ID, 'pren_unit',       true );
        $nome   = get_post_meta( $post->ID, 'pren_guest_name', true );
        $source = get_post_meta( $post->ID, 'pren_source',     true );
        if ( ! $ci || ! $co ) continue;

        $color = $status_colors[ $status ] ?? '#94a3b8';
        $label = ( $unit_short[ $unit ] ?? '' ) . ' — ' . ( $nome ?: 'Ospite' );
        if ( $source && $source !== 'website' ) {
            $label .= ' (' . ucfirst( $source ) . ')';
        }

        $events[] = array(
            'id'              => $post->ID,
            'title'           => $label,
            'start'           => $ci,
            'end'             => $co,
            'backgroundColor' => $color,
            'borderColor'     => $color,
            'textColor'       => '#ffffff',
            'url'             => admin_url( 'post.php?post=' . $post->ID . '&action=edit' ),
            'extendedProps'   => array(
                'type'   => 'booking',
                'unit'   => $unit,
                'status' => $status,
                'source' => $source,
            ),
        );
    }

    // — Richieste info dal form contatti (con date) —
    $richieste = get_posts( array(
        'post_type'   => 'richiesta_info',
        'post_status' => 'publish',
        'numberposts' => -1,
    ) );
    foreach ( $richieste as $post ) {
        $ci   = get_post_meta( $post->ID, 'ri_checkin',  true );
        $co   = get_post_meta( $post->ID, 'ri_checkout', true );
        $nome = get_post_meta( $post->ID, 'ri_nome',     true );
        if ( ! $ci || ! $co ) continue;

        $events[] = array(
            'id'              => 'ri-' . $post->ID,
            'title'           => '✉ ' . ( $nome ?: 'Richiesta' ),
            'start'           => $ci,
            'end'             => $co,
            'backgroundColor' => '#a78bfa',
            'borderColor'     => '#7c3aed',
            'textColor'       => '#ffffff',
            'url'             => admin_url( 'post.php?post=' . $post->ID . '&action=edit' ),
            'extendedProps'   => array( 'type' => 'inquiry' ),
        );
    }

    $events_json = wp_json_encode( $events );
    ?>
    <div class="wrap">
    <h1>📅 Calendario Prenotazioni</h1>

    <!-- Legenda -->
    <div style="display:flex;gap:1.5rem;align-items:center;flex-wrap:wrap;margin-bottom:1.5rem;padding:1rem 1.25rem;background:#fff;border-radius:8px;border:1px solid #e2e8f0;max-width:1100px">
        <?php
        $legend = array(
            '#22c55e' => 'Confermata',
            '#f59e0b' => 'In attesa',
            '#ef4444' => 'Rifiutata',
            '#94a3b8' => 'Annullata',
            '#a78bfa' => 'Richiesta info',
        );
        foreach ( $legend as $color => $label ) :
        ?>
        <span style="display:inline-flex;align-items:center;gap:6px;font-size:13px">
            <span style="width:14px;height:14px;border-radius:50%;background:<?= esc_attr( $color ) ?>;display:inline-block;flex-shrink:0"></span>
            <?= esc_html( $label ) ?>
        </span>
        <?php endforeach; ?>
        <span style="margin-left:auto;font-size:12px;color:#64748b">Click su un evento per aprire il dettaglio</span>
    </div>

    <div id="lemura-calendar" style="background:#fff;padding:1.5rem;border-radius:8px;border:1px solid #e2e8f0;max-width:1100px"></div>
    </div>

    <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.css" rel="stylesheet"/>
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js"></script>
    <script>
    document.addEventListener('DOMContentLoaded', function () {
        var calendarEl = document.getElementById('lemura-calendar');
        var calendar   = new FullCalendar.Calendar(calendarEl, {
            initialView  : 'dayGridMonth',
            locale       : 'it',
            firstDay     : 1,
            height       : 'auto',
            headerToolbar: {
                left  : 'prev,next today',
                center: 'title',
                right : 'dayGridMonth,listMonth',
            },
            buttonText: {
                today    : 'Oggi',
                month    : 'Mese',
                listMonth: 'Lista',
            },
            events: <?= $events_json; ?>,
            eventClick: function (info) {
                if (info.event.url) {
                    info.jsEvent.preventDefault();
                    window.location.href = info.event.url;
                }
            },
            eventDidMount: function (info) {
                var props  = info.event.extendedProps;
                var status = props.status || props.type;
                var labels = { confirmed:'Confermata', pending:'In attesa', rejected:'Rifiutata', cancelled:'Annullata', inquiry:'Richiesta info' };
                info.el.title = info.event.title + '\nStato: ' + (labels[status] || status);
            },
            eventContent: function (arg) {
                // Aggiunge pallino di stato a sinistra del titolo
                var colors = { confirmed:'#22c55e', pending:'#f59e0b', rejected:'#ef4444', cancelled:'#94a3b8', inquiry:'#a78bfa' };
                var status = arg.event.extendedProps.status || arg.event.extendedProps.type;
                var dotColor = colors[status] || '#94a3b8';
                return {
                    html: '<span style="display:inline-flex;align-items:center;gap:5px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;width:100%;font-size:0.8em;padding:1px 4px">'
                        + '<span style="width:8px;height:8px;border-radius:50%;background:#fff;opacity:0.9;flex-shrink:0"></span>'
                        + '<span style="overflow:hidden;text-overflow:ellipsis">' + arg.event.title + '</span>'
                        + '</span>'
                };
            },
        });
        calendar.render();
    });
    </script>
    <?php
}

// ============================================================
// 16. LISTA PRENOTAZIONI — colonne personalizzate + pallini
// ============================================================

// Colonne nella lista CPT prenotazione
add_filter( 'manage_prenotazione_posts_columns', function ( $columns ) {
    $new = array();
    foreach ( $columns as $key => $val ) {
        if ( $key === 'title' ) {
            $new['title']         = $val;
            $new['lemura_stato']  = 'Stato';
            $new['lemura_unit']   = 'Unità';
            $new['lemura_dates']  = 'Date';
            $new['lemura_guest']  = 'Ospite';
            $new['lemura_source'] = 'Fonte';
        } elseif ( $key !== 'date' ) {
            $new[ $key ] = $val;
        }
    }
    return $new;
} );

add_action( 'manage_prenotazione_posts_custom_column', function ( $column, $post_id ) {

    $status_colors = array(
        'confirmed' => '#22c55e',
        'pending'   => '#f59e0b',
        'rejected'  => '#ef4444',
        'cancelled' => '#94a3b8',
    );
    $status_labels = array(
        'confirmed' => 'Confermata',
        'pending'   => 'In attesa',
        'rejected'  => 'Rifiutata',
        'cancelled' => 'Annullata',
    );
    $unit_labels = array(
        'sternatia'           => 'Sternatia',
        'corigliano-camera-1' => 'Corigliano Cam.1',
        'corigliano-camera-2' => 'Corigliano Cam.2',
    );
    $source_icons = array(
        'website' => '🌐 Sito',
        'airbnb'  => '🏠 Airbnb',
        'booking' => '🔵 Booking',
        'manual'  => '✏️ Manuale',
    );

    switch ( $column ) {

        case 'lemura_stato':
            $status = get_post_meta( $post_id, 'pren_status', true ) ?: 'pending';
            $color  = $status_colors[ $status ] ?? '#94a3b8';
            $label  = $status_labels[ $status ] ?? $status;
            echo '<span style="display:inline-flex;align-items:center;gap:6px">';
            echo '<span style="width:12px;height:12px;border-radius:50%;background:' . esc_attr( $color ) . ';display:inline-block;flex-shrink:0"></span>';
            echo '<strong>' . esc_html( $label ) . '</strong>';
            echo '</span>';
            break;

        case 'lemura_unit':
            $unit = get_post_meta( $post_id, 'pren_unit', true );
            echo '<span style="font-size:12px">' . esc_html( $unit_labels[ $unit ] ?? $unit ) . '</span>';
            break;

        case 'lemura_dates':
            $ci = get_post_meta( $post_id, 'pren_checkin',  true );
            $co = get_post_meta( $post_id, 'pren_checkout', true );
            if ( $ci && $co ) {
                $nights = round( ( strtotime( $co ) - strtotime( $ci ) ) / 86400 );
                echo '<span style="font-size:12px">';
                echo esc_html( date_i18n( 'd/m/Y', strtotime( $ci ) ) ) . ' → ' . esc_html( date_i18n( 'd/m/Y', strtotime( $co ) ) );
                echo '<br><span style="color:#64748b">' . $nights . ' nott' . ( $nights === 1 ? 'e' : 'i' ) . '</span>';
                echo '</span>';
            }
            break;

        case 'lemura_guest':
            $nome  = get_post_meta( $post_id, 'pren_guest_name',  true );
            $email = get_post_meta( $post_id, 'pren_guest_email', true );
            $phone = get_post_meta( $post_id, 'pren_guest_phone', true );
            echo '<span style="font-size:12px">';
            if ( $nome )  echo '<strong>' . esc_html( $nome ) . '</strong><br>';
            if ( $email ) echo '<a href="mailto:' . esc_attr( $email ) . '">' . esc_html( $email ) . '</a>';
            if ( $phone ) echo '<br>' . esc_html( $phone );
            echo '</span>';
            break;

        case 'lemura_source':
            $source = get_post_meta( $post_id, 'pren_source', true );
            echo '<span style="font-size:12px">' . esc_html( $source_icons[ $source ] ?? $source ) . '</span>';
            break;
    }

}, 10, 2 );

// Rendi sortable la colonna stato
add_filter( 'manage_edit-prenotazione_sortable_columns', function ( $columns ) {
    $columns['lemura_stato'] = 'pren_status';
    $columns['lemura_dates'] = 'pren_checkin';
    return $columns;
} );

// Filtro rapido per stato nella lista
add_action( 'restrict_manage_posts', function ( $post_type ) {
    if ( $post_type !== 'prenotazione' ) return;

    $current = $_GET['lemura_filter_status'] ?? '';
    $stati   = array(
        ''          => 'Tutti gli stati',
        'pending'   => '🟡 In attesa',
        'confirmed' => '🟢 Confermate',
        'rejected'  => '🔴 Rifiutate',
        'cancelled' => '⚫ Annullate',
    );
    echo '<select name="lemura_filter_status">';
    foreach ( $stati as $val => $label ) {
        echo '<option value="' . esc_attr( $val ) . '"' . selected( $current, $val, false ) . '>' . esc_html( $label ) . '</option>';
    }
    echo '</select>';
} );

add_action( 'pre_get_posts', function ( $query ) {
    if ( ! is_admin() || $query->get( 'post_type' ) !== 'prenotazione' ) return;
    $filter = $_GET['lemura_filter_status'] ?? '';
    if ( $filter ) {
        $query->set( 'meta_query', array(
            array( 'key' => 'pren_status', 'value' => $filter ),
        ) );
    }
} );

// ============================================================
// 17. EMAIL DI CONFERMA — inviata al cliente quando lo stato
//     cambia a "confirmed" (una volta sola, anti-duplicato)
// ============================================================
add_action( 'updated_post_meta', function ( $meta_id, $post_id, $meta_key, $new_value ) {

    if ( $meta_key !== 'pren_status' || $new_value !== 'confirmed' ) return;
    if ( get_post_type( $post_id ) !== 'prenotazione' ) return;

    // Anti-duplicato: non inviare se già inviata
    if ( get_post_meta( $post_id, 'pren_confirm_email_sent', true ) ) return;

    $email  = get_post_meta( $post_id, 'pren_guest_email', true );
    if ( ! $email || ! is_email( $email ) ) return;

    $nome    = get_post_meta( $post_id, 'pren_guest_name',  true ) ?: 'Ospite';
    $unit    = get_post_meta( $post_id, 'pren_unit',        true );
    $ci      = get_post_meta( $post_id, 'pren_checkin',     true );
    $co      = get_post_meta( $post_id, 'pren_checkout',    true );
    $guests  = get_post_meta( $post_id, 'pren_guests',      true );
    $message = get_post_meta( $post_id, 'pren_message',     true );

    $unit_labels = array(
        'sternatia'           => "Sternatia \xe2\x80\x94 Casa intera",
        'corigliano-camera-1' => "Corigliano d'Otranto \xe2\x80\x94 Camera 1",
        'corigliano-camera-2' => "Corigliano d'Otranto \xe2\x80\x94 Camera 2",
    );
    $unit_label = $unit_labels[ $unit ] ?? $unit;
    $nights     = $ci && $co ? round( ( strtotime( $co ) - strtotime( $ci ) ) / 86400 ) : '—';
    $ci_fmt     = $ci ? date_i18n( 'd/m/Y', strtotime( $ci ) ) : '—';
    $co_fmt     = $co ? date_i18n( 'd/m/Y', strtotime( $co ) ) : '—';

    $subject = 'Prenotazione confermata — Le Mura degli Angeli';

    // Email HTML
    $html  = '<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"/></head>';
    $html .= '<body style="margin:0;padding:0;background:#f8f5f0;font-family:Georgia,serif">';
    $html .= '<table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:40px 20px">';
    $html .= '<table width="600" cellpadding="0" cellspacing="0" align="center" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">';

    // Header
    $html .= '<tr><td style="background:#1a1a1a;padding:32px 40px;text-align:center">';
    $html .= '<h1 style="color:#e8d5b0;font-family:Georgia,serif;font-size:24px;font-weight:400;margin:0;letter-spacing:0.05em">Le Mura degli Angeli</h1>';
    $html .= '<p style="color:#9a8c7a;font-size:13px;margin:6px 0 0;letter-spacing:0.08em;text-transform:uppercase">Salento, Puglia</p>';
    $html .= '</td></tr>';

    // Banner conferma
    $html .= '<tr><td style="background:#22c55e;padding:16px 40px;text-align:center">';
    $html .= '<p style="color:#ffffff;font-size:16px;font-weight:bold;margin:0;letter-spacing:0.03em">✅ Prenotazione Confermata</p>';
    $html .= '</td></tr>';

    // Corpo
    $html .= '<tr><td style="padding:40px">';
    $html .= '<p style="font-size:16px;color:#2d2d2d;margin:0 0 24px">Caro/a <strong>' . esc_html( $nome ) . '</strong>,</p>';
    $html .= '<p style="font-size:15px;color:#4a4a4a;line-height:1.7;margin:0 0 32px">Siamo lieti di confermarti la prenotazione presso <strong>Le Mura degli Angeli</strong>. Non vediamo l\'ora di accoglierti nel cuore del Salento!</p>';

    // Riepilogo prenotazione
    $html .= '<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8d5b0;border-radius:6px;overflow:hidden;margin-bottom:32px">';
    $html .= '<tr><td colspan="2" style="background:#f8f5f0;padding:12px 20px;font-size:11px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;color:#7a6a55">Riepilogo prenotazione</td></tr>';

    $rows = array(
        'Struttura'   => $unit_label,
        'Check-in'    => $ci_fmt,
        'Check-out'   => $co_fmt,
        'Notti'       => $nights,
        'Ospiti'      => $guests,
    );
    $i = 0;
    foreach ( $rows as $lbl => $val ) {
        $bg = ( $i % 2 === 0 ) ? '#ffffff' : '#fdfaf7';
        $html .= '<tr style="background:' . $bg . '">';
        $html .= '<td style="padding:12px 20px;font-size:14px;color:#7a6a55;width:40%">' . esc_html( $lbl ) . '</td>';
        $html .= '<td style="padding:12px 20px;font-size:14px;color:#1a1a1a;font-weight:bold">' . esc_html( $val ) . '</td>';
        $html .= '</tr>';
        $i++;
    }
    $html .= '</table>';

    // Contatti
    $html .= '<div style="background:#f8f5f0;border-radius:6px;padding:20px;margin-bottom:32px">';
    $html .= '<p style="font-size:13px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:#7a6a55;margin:0 0 12px">Per qualsiasi necessità</p>';
    $html .= '<p style="font-size:14px;color:#4a4a4a;margin:4px 0">📧 <a href="mailto:lemuradegliangeli@yahoo.com" style="color:#1a1a1a">lemuradegliangeli@yahoo.com</a></p>';
    $html .= '<p style="font-size:14px;color:#4a4a4a;margin:4px 0">📞 <a href="tel:+393271208496" style="color:#1a1a1a">+39 327 1208496</a></p>';
    $html .= '<p style="font-size:14px;color:#4a4a4a;margin:4px 0">📍 Via Giudeca 28, Sternatia (LE) — Salento, Puglia</p>';
    $html .= '</div>';

    $html .= '<p style="font-size:15px;color:#4a4a4a;line-height:1.7;margin:0">A presto,<br><strong>Lo staff di Le Mura degli Angeli</strong></p>';
    $html .= '</td></tr>';

    // Footer
    $html .= '<tr><td style="background:#1a1a1a;padding:20px 40px;text-align:center">';
    $html .= '<p style="color:#6b6055;font-size:12px;margin:0">Le Mura degli Angeli · Via Giudeca 28, Sternatia (LE)</p>';
    $html .= '</td></tr>';

    $html .= '</table>';
    $html .= '</td></tr></table>';
    $html .= '</body></html>';

    $headers = array(
        'Content-Type: text/html; charset=UTF-8',
        'From: Le Mura degli Angeli <' . get_option( 'admin_email' ) . '>',
    );

    wp_mail( $email, $subject, $html, $headers );

    // Segna come inviata (anti-duplicato)
    update_post_meta( $post_id, 'pren_confirm_email_sent', current_time( 'mysql' ) );

}, 10, 4 );

// ============================================================
// 18. TARIFFARIO ADMIN — Pagina custom gestione prezzi stagionali
// ============================================================

add_action( 'admin_menu', function () {
    add_submenu_page(
        'edit.php?post_type=alloggio',
        'Tariffario',
        '💰 Tariffario',
        'manage_options',
        'lemura-tariffario',
        'lemura_tariffario_page'
    );
} );

// AJAX: salva tariffe per un alloggio
add_action( 'wp_ajax_lemura_save_tariffe', function () {
    check_ajax_referer( 'lemura_tariffario', 'nonce' );
    if ( ! current_user_can( 'manage_options' ) ) wp_die( 'Unauthorized' );

    $post_id = absint( $_POST['post_id'] ?? 0 );
    $raw     = json_decode( stripslashes( $_POST['tariffe'] ?? '[]' ), true );

    if ( ! $post_id ) {
        wp_send_json_error( 'ID alloggio mancante.' );
    }

    // ── Parametri alloggio ───────────────────────────────────
    $params_raw = isset( $_POST['params'] ) ? json_decode( stripslashes( $_POST['params'] ), true ) : null;
    if ( is_array( $params_raw ) ) {
        $numeric_fields = array( 'ospiti_base', 'ospiti_massimi', 'extra_per_ospite', 'min_notti', 'max_notti', 'prezzo_notte' );
        foreach ( $numeric_fields as $f ) {
            if ( isset( $params_raw[ $f ] ) && $params_raw[ $f ] !== '' ) {
                update_post_meta( $post_id, $f, round( floatval( $params_raw[ $f ] ), 2 ) );
            }
        }
        if ( isset( $params_raw['unit_id'] ) ) {
            update_post_meta( $post_id, 'unit_id', sanitize_text_field( $params_raw['unit_id'] ) );
        }
    }

    // ── Tariffe stagionali ───────────────────────────────────
    $clean = array();
    foreach ( (array) $raw as $t ) {
        if ( empty( $t['data_inizio'] ) || empty( $t['data_fine'] ) ) continue;
        $clean[] = array(
            'nome'        => sanitize_text_field( $t['nome']        ?? '' ),
            'data_inizio' => sanitize_text_field( $t['data_inizio'] ?? '' ),
            'data_fine'   => sanitize_text_field( $t['data_fine']   ?? '' ),
            'prezzo_notte'=> round( floatval( $t['prezzo_notte'] ?? 0 ), 2 ),
            'colore'      => preg_match( '/^#[0-9a-fA-F]{6}$/', $t['colore'] ?? '' ) ? $t['colore'] : '#3b82f6',
        );
    }

    update_post_meta( $post_id, 'lemura_tariffe', wp_json_encode( $clean ) );
    wp_send_json_success( array( 'message' => 'Dati salvati con successo!', 'count' => count( $clean ) ) );
} );

function lemura_tariffario_page() {
    $alloggi = get_posts( array(
        'post_type'   => 'alloggio',
        'post_status' => 'publish',
        'numberposts' => -1,
        'orderby'     => 'menu_order',
        'order'       => 'ASC',
    ) );

    if ( empty( $alloggi ) ) {
        echo '<div class="wrap"><h1>Tariffario</h1><p>Nessun alloggio trovato.</p></div>';
        return;
    }

    $nonce        = wp_create_nonce( 'lemura_tariffario' );
    $alloggi_data = array();

    foreach ( $alloggi as $post ) {
        $tipo = get_post_meta( $post->ID, 'tipo', true );
        if ( $tipo === 'spa' ) continue; // Spa non ha tariffe notte
        $tariffe_json = get_post_meta( $post->ID, 'lemura_tariffe', true );
        $tariffe      = $tariffe_json ? json_decode( $tariffe_json, true ) : array();
        $alloggi_data[] = array(
            'id'               => $post->ID,
            'title'            => get_the_title( $post->ID ),
            'unit_id'          => get_post_meta( $post->ID, 'unit_id', true ) ?: '',
            'prezzo'           => get_post_meta( $post->ID, 'prezzo_notte', true ) ?: '',
            'ospiti_base'      => get_post_meta( $post->ID, 'ospiti_base', true ) ?: '2',
            'ospiti_massimi'   => get_post_meta( $post->ID, 'ospiti_massimi', true ) ?: '',
            'extra_per_ospite' => get_post_meta( $post->ID, 'extra_per_ospite', true ) ?: '',
            'min_notti'        => get_post_meta( $post->ID, 'min_notti', true ) ?: '',
            'max_notti'        => get_post_meta( $post->ID, 'max_notti', true ) ?: '',
            'tariffe'          => $tariffe ?: array(),
        );
    }

    $json = wp_json_encode( $alloggi_data );
    $ajax = admin_url( 'admin-ajax.php' );
    ?>
    <div class="wrap" id="lmt-wrap">
    <div class="lmt-header">
        <div class="lmt-header-inner">
            <h1>💰 Tariffario</h1>
            <p>Gestisci parametri e prezzi stagionali per ogni struttura</p>
        </div>
        <div id="lmt-toast" class="lmt-toast" style="display:none"></div>
    </div>

    <style>
    #lmt-wrap { max-width: 1000px; }
    .lmt-header { background: #1a1a1a; border-radius: 10px; padding: 24px 32px; margin-bottom: 28px; display: flex; align-items: center; justify-content: space-between; }
    .lmt-header h1 { color: #e8d5b0; font-size: 22px; margin: 0; font-weight: 600; }
    .lmt-header p  { color: #9a8c7a; margin: 4px 0 0; font-size: 13px; }

    /* Tabs */
    .lmt-tabs { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
    .lmt-tab  { padding: 10px 20px; border-radius: 20px; border: 2px solid #e0d6c8; background: #fff; cursor: pointer; font-size: 14px; font-weight: 500; color: #555; transition: all .2s; }
    .lmt-tab:hover   { border-color: #c8b89a; color: #333; }
    .lmt-tab.active  { background: #1a1a1a; border-color: #1a1a1a; color: #e8d5b0; }

    /* Panel */
    .lmt-panel { display: none; }
    .lmt-panel.active { display: block; }

    /* Cards container */
    .lmt-card { background: #fff; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,.08); padding: 24px; margin-bottom: 20px; }
    .lmt-card-title { font-size: 15px; font-weight: 600; color: #1a1a1a; margin: 0 0 18px; display: flex; align-items: center; gap: 8px; }

    /* Tariffe list */
    .lmt-tariffe-list { display: flex; flex-direction: column; gap: 10px; }
    .lmt-tariffa-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 8px; border: 1px solid #f0ece6; background: #fdfaf7; position: relative; border-left-width: 4px; }
    .lmt-tariffa-info { flex: 1; }
    .lmt-tariffa-nome { font-weight: 600; font-size: 14px; color: #1a1a1a; }
    .lmt-tariffa-date { font-size: 12px; color: #777; margin-top: 2px; }
    .lmt-tariffa-prezzo { font-size: 18px; font-weight: 700; color: #1a1a1a; white-space: nowrap; }
    .lmt-tariffa-prezzo span { font-size: 12px; font-weight: 400; color: #888; }
    .lmt-tariffa-actions { display: flex; gap: 6px; }
    .lmt-btn-icon { width: 32px; height: 32px; border-radius: 6px; border: 1px solid #e0d6c8; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: all .15s; }
    .lmt-btn-icon:hover { background: #f5f0ea; }
    .lmt-btn-icon.delete:hover { background: #fee2e2; border-color: #fca5a5; }
    .lmt-empty { text-align: center; padding: 32px; color: #aaa; font-size: 14px; }

    /* Form */
    .lmt-form { background: #f8f5f0; border-radius: 8px; padding: 20px; margin-top: 16px; border: 1px dashed #d4c9b8; }
    .lmt-form-title { font-weight: 600; font-size: 14px; margin: 0 0 16px; color: #333; }
    .lmt-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .lmt-form-group { display: flex; flex-direction: column; gap: 5px; }
    .lmt-form-group.full { grid-column: 1 / -1; }
    .lmt-form-group label { font-size: 12px; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: .04em; }
    .lmt-form-group input[type=text],
    .lmt-form-group input[type=date],
    .lmt-form-group input[type=number] { border: 1px solid #ddd; border-radius: 6px; padding: 8px 10px; font-size: 14px; background: #fff; width: 100%; box-sizing: border-box; }
    .lmt-form-group input:focus { outline: none; border-color: #c8b89a; box-shadow: 0 0 0 2px rgba(200,184,154,.2); }
    .lmt-color-row { display: flex; align-items: center; gap: 10px; }
    .lmt-color-row input[type=color] { width: 36px; height: 36px; padding: 2px; border-radius: 6px; border: 1px solid #ddd; cursor: pointer; }
    .lmt-form-actions { display: flex; gap: 10px; margin-top: 16px; align-items: center; }

    /* Buttons */
    .lmt-btn { padding: 9px 18px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all .15s; }
    .lmt-btn-primary { background: #1a1a1a; color: #e8d5b0; }
    .lmt-btn-primary:hover { background: #333; }
    .lmt-btn-secondary { background: #fff; color: #555; border: 1px solid #ddd; }
    .lmt-btn-secondary:hover { background: #f5f5f5; }
    .lmt-btn-add { background: #f8f5f0; color: #555; border: 2px dashed #c8b89a; width: 100%; padding: 12px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .15s; }
    .lmt-btn-add:hover { background: #f0ebe3; color: #333; }
    .lmt-btn-save { background: #22c55e; color: #fff; padding: 11px 28px; font-size: 14px; }
    .lmt-btn-save:hover { background: #16a34a; }
    .lmt-btn-save:disabled { background: #86efac; cursor: not-allowed; }

    /* Toast */
    .lmt-toast { position: fixed; top: 40px; right: 20px; background: #1a1a1a; color: #fff; padding: 12px 20px; border-radius: 8px; font-size: 13px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,.2); }
    .lmt-toast.success { background: #22c55e; }
    .lmt-toast.error   { background: #ef4444; }

    /* Save bar */
    .lmt-save-bar { display: flex; align-items: center; justify-content: space-between; margin-top: 20px; padding: 16px 20px; background: #fff; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
    .lmt-save-bar p { margin: 0; font-size: 13px; color: #777; }

    /* Params card */
    .lmt-params-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    @media (max-width: 700px) { .lmt-params-grid { grid-template-columns: 1fr 1fr; } }
    .lmt-param-group { display: flex; flex-direction: column; gap: 5px; }
    .lmt-param-group.full { grid-column: 1 / -1; }
    .lmt-param-group label { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: .05em; }
    .lmt-param-group input[type=text],
    .lmt-param-group input[type=number] { border: 1px solid #e0d6c8; border-radius: 6px; padding: 9px 11px; font-size: 14px; background: #fdfaf7; width: 100%; box-sizing: border-box; color: #1a1a1a; }
    .lmt-param-group input:focus { outline: none; border-color: #c8b89a; box-shadow: 0 0 0 2px rgba(200,184,154,.2); background: #fff; }
    .lmt-param-hint { font-size: 11px; color: #aaa; margin-top: 2px; }
    .lmt-section-divider { border: none; border-top: 1px solid #f0ece6; margin: 24px 0 20px; }
    </style>

    <div class="lmt-tabs" id="lmt-tabs"></div>
    <div id="lmt-panels"></div>

    <script>
    (function() {
        var alloggi  = <?= $json ?>;
        var ajaxUrl  = '<?= esc_js( $ajax ) ?>';
        var nonce    = '<?= esc_js( $nonce ) ?>';
        var state    = {}; // { postId: [ tariffe ] }
        var params   = {}; // { postId: { prezzo, ospiti_base, ... } }
        var editing  = {}; // { postId: index|null }

        // Init state
        alloggi.forEach(function(a) {
            state[a.id]   = JSON.parse(JSON.stringify(a.tariffe));
            editing[a.id] = null;
            params[a.id]  = {
                unit_id:          a.unit_id          || '',
                prezzo_notte:     a.prezzo            || '',
                ospiti_base:      a.ospiti_base       || '2',
                ospiti_massimi:   a.ospiti_massimi    || '',
                extra_per_ospite: a.extra_per_ospite  || '',
                min_notti:        a.min_notti         || '',
                max_notti:        a.max_notti         || '',
            };
        });

        function escHtml(s) {
            return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
        }

        function fmtDate(d) {
            if (!d) return '—';
            var p = d.split('-');
            return p[2] + '/' + p[1] + '/' + p[0];
        }

        function showToast(msg, type) {
            var t = document.getElementById('lmt-toast');
            t.textContent = msg;
            t.className = 'lmt-toast ' + (type || '');
            t.style.display = 'block';
            setTimeout(function() { t.style.display = 'none'; }, 3000);
        }

        // ── Render tabs ───────────────────────────────────────
        function renderTabs() {
            var tabs = document.getElementById('lmt-tabs');
            tabs.innerHTML = '';
            alloggi.forEach(function(a, i) {
                var btn = document.createElement('button');
                btn.className = 'lmt-tab' + (i === 0 ? ' active' : '');
                btn.textContent = a.title;
                btn.dataset.id = a.id;
                btn.onclick = function() {
                    document.querySelectorAll('.lmt-tab').forEach(function(b){ b.classList.remove('active'); });
                    btn.classList.add('active');
                    document.querySelectorAll('.lmt-panel').forEach(function(p){ p.classList.remove('active'); });
                    document.getElementById('panel-' + a.id).classList.add('active');
                };
                tabs.appendChild(btn);
            });
        }

        // ── Render all panels ─────────────────────────────────
        function renderPanels() {
            var wrap = document.getElementById('lmt-panels');
            wrap.innerHTML = '';
            alloggi.forEach(function(a, i) {
                var div = document.createElement('div');
                div.className = 'lmt-panel' + (i === 0 ? ' active' : '');
                div.id = 'panel-' + a.id;
                wrap.appendChild(div);
                renderPanel(a.id);
            });
        }

        // ── Render params card ────────────────────────────────
        function renderParamsCard(postId) {
            var p = params[postId];
            var html = '<div class="lmt-card">';
            html += '<div class="lmt-card-title">⚙️ Parametri alloggio</div>';
            html += '<div class="lmt-params-grid">';

            html += '<div class="lmt-param-group">';
            html += '<label>Unit ID (iCal/booking)</label>';
            html += '<input type="text" id="p-unit-' + postId + '" placeholder="es. 12345" value="' + escHtml(p.unit_id) + '" oninput="LMT.paramChange(' + postId + ',\'unit_id\',this.value)">';
            html += '<div class="lmt-param-hint">Codice unità per iCal sync</div></div>';

            html += '<div class="lmt-param-group">';
            html += '<label>Prezzo base/notte (€)</label>';
            html += '<input type="number" id="p-prezzo-' + postId + '" min="0" step="0.5" placeholder="es. 120" value="' + escHtml(p.prezzo_notte) + '" oninput="LMT.paramChange(' + postId + ',\'prezzo_notte\',this.value)">';
            html += '<div class="lmt-param-hint">Usato quando nessuna stagione corrisponde</div></div>';

            html += '<div class="lmt-param-group">';
            html += '<label>Ospiti inclusi nel prezzo</label>';
            html += '<input type="number" id="p-ospiti-base-' + postId + '" min="1" step="1" placeholder="es. 2" value="' + escHtml(p.ospiti_base) + '" oninput="LMT.paramChange(' + postId + ',\'ospiti_base\',this.value)">';
            html += '<div class="lmt-param-hint">Ospiti inclusi senza supplemento</div></div>';

            html += '<div class="lmt-param-group">';
            html += '<label>Ospiti massimi</label>';
            html += '<input type="number" id="p-ospiti-max-' + postId + '" min="1" step="1" placeholder="es. 4" value="' + escHtml(p.ospiti_massimi) + '" oninput="LMT.paramChange(' + postId + ',\'ospiti_massimi\',this.value)">';
            html += '<div class="lmt-param-hint">Capacità massima struttura</div></div>';

            html += '<div class="lmt-param-group">';
            html += '<label>Extra per ospite aggiuntivo (€)</label>';
            html += '<input type="number" id="p-extra-' + postId + '" min="0" step="0.5" placeholder="es. 20" value="' + escHtml(p.extra_per_ospite) + '" oninput="LMT.paramChange(' + postId + ',\'extra_per_ospite\',this.value)">';
            html += '<div class="lmt-param-hint">Per notte, per ogni ospite oltre il base</div></div>';

            html += '<div class="lmt-param-group" style="display:flex;flex-direction:row;gap:10px;align-items:flex-end;">';
            html += '<div style="flex:1"><label>Min notti</label>';
            html += '<input type="number" id="p-min-' + postId + '" min="1" step="1" placeholder="es. 2" value="' + escHtml(p.min_notti) + '" oninput="LMT.paramChange(' + postId + ',\'min_notti\',this.value)"></div>';
            html += '<div style="flex:1"><label>Max notti</label>';
            html += '<input type="number" id="p-max-' + postId + '" min="1" step="1" placeholder="illimitato" value="' + escHtml(p.max_notti) + '" oninput="LMT.paramChange(' + postId + ',\'max_notti\',this.value)"></div>';
            html += '</div>';

            html += '</div>'; // end params-grid
            html += '</div>'; // end card
            return html;
        }

        // ── Render single panel ───────────────────────────────
        function renderPanel(postId) {
            var a    = alloggi.find(function(x){ return x.id === postId; });
            var div  = document.getElementById('panel-' + postId);
            var tar  = state[postId];
            var p    = params[postId];

            var html = renderParamsCard(postId);

            html += '<div class="lmt-card">';
            html += '<div class="lmt-card-title">🗓 Tariffe stagionali';
            html += '<span style="margin-left:auto;font-size:12px;font-weight:400;color:#999">Prezzo base: <strong>€' + (parseFloat(p.prezzo_notte)||0).toFixed(0) + '/notte</strong></span>';
            html += '</div>';

            if (tar.length === 0) {
                html += '<div class="lmt-empty">Nessuna tariffa stagionale. Il prezzo base verrà usato per tutto l\'anno.</div>';
            } else {
                html += '<div class="lmt-tariffe-list">';
                tar.forEach(function(t, idx) {
                    var col = t.colore || '#3b82f6';
                    html += '<div class="lmt-tariffa-item" style="border-left-color:' + col + '">';
                    html += '<div style="width:10px;height:10px;border-radius:50%;background:' + col + ';flex-shrink:0"></div>';
                    html += '<div class="lmt-tariffa-info">';
                    html += '<div class="lmt-tariffa-nome">' + (t.nome || 'Stagione senza nome') + '</div>';
                    html += '<div class="lmt-tariffa-date">' + fmtDate(t.data_inizio) + ' → ' + fmtDate(t.data_fine) + '</div>';
                    html += '</div>';
                    html += '<div class="lmt-tariffa-prezzo">€' + parseFloat(t.prezzo_notte||0).toFixed(0) + '<span>/notte</span></div>';
                    html += '<div class="lmt-tariffa-actions">';
                    html += '<button class="lmt-btn-icon" onclick="LMT.edit(' + postId + ',' + idx + ')" title="Modifica">✏️</button>';
                    html += '<button class="lmt-btn-icon delete" onclick="LMT.remove(' + postId + ',' + idx + ')" title="Elimina">🗑</button>';
                    html += '</div>';
                    html += '</div>';
                });
                html += '</div>';
            }

            // Form add/edit
            html += renderForm(postId);

            html += '</div>';

            // Save bar
            html += '<div class="lmt-save-bar">';
            html += '<p>' + tar.length + ' tariffa' + (tar.length !== 1 ? 'e' : '') + ' configurata' + (tar.length !== 1 ? 'e' : '') + ' per <strong>' + a.title + '</strong></p>';
            html += '<button class="lmt-btn lmt-btn-save" onclick="LMT.save(' + postId + ')">💾 Salva tutto</button>';
            html += '</div>';

            div.innerHTML = html;
        }

        function renderForm(postId) {
            var idx = editing[postId];
            var tar = state[postId];
            var t   = (idx !== null && idx !== undefined && tar[idx]) ? tar[idx] : null;
            var isEdit = t !== null;

            var html = '<div class="lmt-form" id="form-' + postId + '" style="' + (!isEdit && editing[postId] !== -1 ? 'display:none' : '') + '">';
            html += '<div class="lmt-form-title">' + (isEdit ? '✏️ Modifica tariffa' : '➕ Nuova tariffa stagionale') + '</div>';
            html += '<div class="lmt-form-grid">';
            html += '<div class="lmt-form-group full"><label>Nome stagione</label>';
            html += '<input type="text" id="f-nome-' + postId + '" placeholder="es. Alta stagione, Ferragosto..." value="' + (t ? t.nome : '') + '"></div>';
            html += '<div class="lmt-form-group"><label>Data inizio</label>';
            html += '<input type="date" id="f-inizio-' + postId + '" value="' + (t ? t.data_inizio : '') + '"></div>';
            html += '<div class="lmt-form-group"><label>Data fine (inclusa)</label>';
            html += '<input type="date" id="f-fine-' + postId + '" value="' + (t ? t.data_fine : '') + '"></div>';
            html += '<div class="lmt-form-group"><label>Prezzo/notte (€)</label>';
            html += '<input type="number" id="f-prezzo-' + postId + '" min="0" step="0.5" placeholder="es. 150" value="' + (t ? t.prezzo_notte : '') + '"></div>';
            html += '<div class="lmt-form-group"><label>Colore etichetta</label>';
            html += '<div class="lmt-color-row">';
            html += '<input type="color" id="f-colore-' + postId + '" value="' + (t ? (t.colore||'#3b82f6') : '#3b82f6') + '">';
            html += '<span style="font-size:12px;color:#888">Colore identificativo della stagione</span>';
            html += '</div></div>';
            html += '</div>';
            html += '<div class="lmt-form-actions">';
            html += '<button class="lmt-btn lmt-btn-primary" onclick="LMT.confirmEdit(' + postId + ')">' + (isEdit ? 'Aggiorna' : 'Aggiungi') + '</button>';
            html += '<button class="lmt-btn lmt-btn-secondary" onclick="LMT.cancelEdit(' + postId + ')">Annulla</button>';
            html += '</div>';
            html += '</div>';

            if (editing[postId] === null) {
                html += '<button class="lmt-btn-add" onclick="LMT.showForm(' + postId + ')">+ Aggiungi tariffa stagionale</button>';
            }

            return html;
        }

        // ── Public API ────────────────────────────────────────
        window.LMT = {
            paramChange: function(postId, field, value) {
                params[postId][field] = value;
            },
            showForm: function(postId) {
                editing[postId] = -1;
                renderPanel(postId);
                document.getElementById('f-nome-' + postId).focus();
            },
            edit: function(postId, idx) {
                editing[postId] = idx;
                renderPanel(postId);
                document.getElementById('f-nome-' + postId).focus();
            },
            cancelEdit: function(postId) {
                editing[postId] = null;
                renderPanel(postId);
            },
            remove: function(postId, idx) {
                if (!confirm('Eliminare questa tariffa?')) return;
                state[postId].splice(idx, 1);
                editing[postId] = null;
                renderPanel(postId);
            },
            confirmEdit: function(postId) {
                var nome    = document.getElementById('f-nome-' + postId).value.trim();
                var inizio  = document.getElementById('f-inizio-' + postId).value;
                var fine    = document.getElementById('f-fine-' + postId).value;
                var prezzo  = parseFloat(document.getElementById('f-prezzo-' + postId).value);
                var colore  = document.getElementById('f-colore-' + postId).value;

                if (!inizio || !fine || isNaN(prezzo)) {
                    alert('Compila tutti i campi obbligatori (date e prezzo).');
                    return;
                }
                if (inizio > fine) {
                    alert('La data di inizio deve essere precedente alla data di fine.');
                    return;
                }

                var entry = { nome: nome, data_inizio: inizio, data_fine: fine, prezzo_notte: prezzo, colore: colore };
                var idx = editing[postId];

                if (idx !== null && idx >= 0 && state[postId][idx]) {
                    state[postId][idx] = entry;
                } else {
                    state[postId].push(entry);
                }

                editing[postId] = null;
                renderPanel(postId);
            },
            save: function(postId) {
                var btn = document.querySelector('#panel-' + postId + ' .lmt-btn-save');
                btn.disabled = true;
                btn.textContent = '⏳ Salvataggio...';

                var data = new FormData();
                data.append('action',  'lemura_save_tariffe');
                data.append('nonce',   nonce);
                data.append('post_id', postId);
                data.append('tariffe', JSON.stringify(state[postId]));
                data.append('params',  JSON.stringify(params[postId]));

                fetch(ajaxUrl, { method: 'POST', body: data })
                    .then(function(r){ return r.json(); })
                    .then(function(res) {
                        btn.disabled = false;
                        btn.textContent = '💾 Salva tutto';
                        if (res.success) {
                            showToast('✅ ' + res.data.message, 'success');
                            renderPanel(postId);
                        } else {
                            showToast('❌ Errore: ' + res.data, 'error');
                        }
                    })
                    .catch(function() {
                        btn.disabled = false;
                        btn.textContent = '💾 Salva tutto';
                        showToast('❌ Errore di rete. Riprova.', 'error');
                    });
            }
        };

        // Boot
        renderTabs();
        renderPanels();
    })();
    </script>
    </div>
    <?php
}

// ============================================================
// 19. OTTIMIZZAZIONI
// ============================================================
add_filter( 'xmlrpc_enabled', '__return_false' );
remove_action( 'wp_head', 'wp_generator' );
