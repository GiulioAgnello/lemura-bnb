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
// ============================================================
add_action( 'rest_api_init', function () {
    remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
    add_filter( 'rest_pre_serve_request', function ( $value ) {
        header( 'Access-Control-Allow-Origin: *' );
        header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
        header( 'Access-Control-Allow-Headers: Content-Type, Authorization' );
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

    return array(
        'id'             => $post->ID,
        'title'          => get_the_title( $post->ID ),
        'slug'           => $post->post_name,
        'description'    => apply_filters( 'the_content', $post->post_content ),
        'excerpt'        => $post->post_excerpt,
        'struttura'      => isset( $acf['struttura'] )    ? $acf['struttura']    : '',
        'tipo'           => isset( $acf['tipo'] )          ? $acf['tipo']         : '',
        'prezzo_notte'   => isset( $acf['prezzo_notte'] )  ? $acf['prezzo_notte'] : '',
        'superficie'     => isset( $acf['superficie'] )    ? $acf['superficie']   : '',
        'servizi'        => $servizi,
        'checkin_time'   => isset( $acf['checkin_time'] )  ? $acf['checkin_time'] : '',
        'checkout_time'  => isset( $acf['checkout_time'] ) ? $acf['checkout_time']: '',
        'featured_image' => $featured_image,
        'gallery'        => $gallery,
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
// 7. OTTIMIZZAZIONI
// ============================================================
add_filter( 'xmlrpc_enabled', '__return_false' );
remove_action( 'wp_head', 'wp_generator' );
