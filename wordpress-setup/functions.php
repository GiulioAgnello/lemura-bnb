<?php
/**
 * ===========================================
 * LE MURA DEGLI ANGELI — WordPress Headless Setup
 * ===========================================
 *
 * Copia questo file nel functions.php del tema attivo,
 * oppure crea un plugin custom (consigliato).
 */

// =============================================
// 1. CORS
// =============================================

add_action('init', function () {
    // ⚠️ IN PRODUZIONE: sostituisci col dominio frontend
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit();
    }
});

// =============================================
// 2. CPT: Camera
// =============================================

add_action('init', function () {
    register_post_type('camera', [
        'labels' => [
            'name' => 'Camere',
            'singular_name' => 'Camera',
            'add_new' => 'Aggiungi camera',
            'add_new_item' => 'Aggiungi nuova camera',
            'edit_item' => 'Modifica camera',
        ],
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'camera',
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields', 'excerpt'],
        'menu_icon' => 'dashicons-admin-home',
        'has_archive' => true,
    ]);
});

// =============================================
// 3. CPT: Esperienza
// =============================================

add_action('init', function () {
    register_post_type('esperienza', [
        'labels' => [
            'name' => 'Esperienze',
            'singular_name' => 'Esperienza',
            'add_new' => 'Aggiungi esperienza',
        ],
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'esperienza',
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields', 'excerpt'],
        'menu_icon' => 'dashicons-location-alt',
        'has_archive' => true,
    ]);
});

// =============================================
// 4. CPT: Recensione
// =============================================

add_action('init', function () {
    register_post_type('recensione', [
        'labels' => [
            'name' => 'Recensioni',
            'singular_name' => 'Recensione',
            'add_new' => 'Aggiungi recensione',
        ],
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'recensione',
        'supports' => ['title', 'custom-fields'],
        'menu_icon' => 'dashicons-star-filled',
    ]);
});

// =============================================
// 5. ACF FIELDS (registrazione via codice)
// =============================================

if (function_exists('acf_add_local_field_group')) {

    // ── HOMEPAGE ──
    acf_add_local_field_group([
        'key' => 'group_homepage',
        'title' => 'Homepage',
        'fields' => [
            ['key' => 'f_hero_title',    'label' => 'Hero Titolo',      'name' => 'hero_title',    'type' => 'text'],
            ['key' => 'f_hero_subtitle', 'label' => 'Hero Sottotitolo', 'name' => 'hero_subtitle', 'type' => 'textarea'],
            ['key' => 'f_hero_image',    'label' => 'Hero Immagine',    'name' => 'hero_image',    'type' => 'image', 'return_format' => 'array'],
            ['key' => 'f_intro_title',   'label' => 'Intro Titolo',     'name' => 'intro_title',   'type' => 'text'],
            ['key' => 'f_intro_text',    'label' => 'Intro Testo',      'name' => 'intro_text',    'type' => 'wysiwyg'],
            ['key' => 'f_intro_image',   'label' => 'Intro Foto',       'name' => 'intro_image',   'type' => 'image', 'return_format' => 'array'],
            [
                'key' => 'f_servizi_lista',
                'label' => 'Servizi',
                'name' => 'servizi_lista',
                'type' => 'repeater',
                'sub_fields' => [
                    ['key' => 'f_servizio', 'label' => 'Servizio', 'name' => 'servizio', 'type' => 'text'],
                ],
            ],
        ],
        'location' => [[[
            'param' => 'page',
            'operator' => '==',
            'value' => 'home',
        ]]],
    ]);

    // ── CAMERE ──
    acf_add_local_field_group([
        'key' => 'group_camera',
        'title' => 'Dettagli Camera',
        'fields' => [
            ['key' => 'f_cam_prezzo',      'label' => 'Prezzo/notte (€)',  'name' => 'prezzo_notte',  'type' => 'text'],
            ['key' => 'f_cam_ospiti',      'label' => 'Ospiti max',        'name' => 'ospiti_max',    'type' => 'text'],
            ['key' => 'f_cam_superficie',  'label' => 'Superficie',        'name' => 'superficie',    'type' => 'text'],
            ['key' => 'f_cam_servizi',     'label' => 'Servizi in camera', 'name' => 'servizi',       'type' => 'textarea'],
            ['key' => 'f_cam_gallery',     'label' => 'Gallery foto',      'name' => 'gallery',       'type' => 'gallery', 'return_format' => 'array'],
            ['key' => 'f_cam_booking_url', 'label' => 'URL Booking diretto', 'name' => 'booking_url', 'type' => 'url'],
        ],
        'location' => [[[
            'param' => 'post_type',
            'operator' => '==',
            'value' => 'camera',
        ]]],
    ]);

    // ── ESPERIENZE ──
    acf_add_local_field_group([
        'key' => 'group_esperienza',
        'title' => 'Dettagli Esperienza',
        'fields' => [
            ['key' => 'f_exp_distanza',   'label' => 'Distanza dal B&B', 'name' => 'distanza',   'type' => 'text', 'placeholder' => 'Es: 15 min in auto'],
            ['key' => 'f_exp_tipologia',  'label' => 'Tipologia',        'name' => 'tipologia',  'type' => 'text', 'placeholder' => 'Es: Mare, Cultura, Enogastronomia'],
        ],
        'location' => [[[
            'param' => 'post_type',
            'operator' => '==',
            'value' => 'esperienza',
        ]]],
    ]);

    // ── RECENSIONI ──
    acf_add_local_field_group([
        'key' => 'group_recensione',
        'title' => 'Dettagli Recensione',
        'fields' => [
            ['key' => 'f_rec_nome',        'label' => 'Nome ospite',       'name' => 'nome_ospite',       'type' => 'text'],
            ['key' => 'f_rec_provenienza', 'label' => 'Provenienza',       'name' => 'provenienza',       'type' => 'text'],
            ['key' => 'f_rec_stelle',      'label' => 'Stelle (1-5)',      'name' => 'stelle',            'type' => 'number', 'min' => 1, 'max' => 5, 'default_value' => 5],
            ['key' => 'f_rec_testo',       'label' => 'Testo recensione',  'name' => 'testo_recensione',  'type' => 'textarea'],
            ['key' => 'f_rec_data',        'label' => 'Data soggiorno',    'name' => 'data_soggiorno',    'type' => 'text', 'placeholder' => 'Es: Agosto 2025'],
            ['key' => 'f_rec_piattaforma', 'label' => 'Piattaforma',      'name' => 'piattaforma',       'type' => 'text', 'placeholder' => 'Booking.com, Airbnb, Google...'],
        ],
        'location' => [[[
            'param' => 'post_type',
            'operator' => '==',
            'value' => 'recensione',
        ]]],
    ]);

    // ── GALLERIA (pagina) ──
    acf_add_local_field_group([
        'key' => 'group_galleria',
        'title' => 'Galleria Fotografica',
        'fields' => [
            ['key' => 'f_gallery_images', 'label' => 'Immagini galleria', 'name' => 'gallery_images', 'type' => 'gallery', 'return_format' => 'array'],
        ],
        'location' => [[[
            'param' => 'page',
            'operator' => '==',
            'value' => 'galleria',
        ]]],
    ]);

    // ── CONTATTI (pagina) ──
    acf_add_local_field_group([
        'key' => 'group_contatti',
        'title' => 'Info Contatti',
        'fields' => [
            ['key' => 'f_con_title',    'label' => 'Titolo',          'name' => 'contatti_title',    'type' => 'text'],
            ['key' => 'f_con_subtitle', 'label' => 'Sottotitolo',     'name' => 'contatti_subtitle', 'type' => 'textarea'],
            ['key' => 'f_con_indirizzo','label' => 'Indirizzo',       'name' => 'indirizzo',         'type' => 'textarea'],
            ['key' => 'f_con_email',    'label' => 'Email',           'name' => 'email',             'type' => 'email'],
            ['key' => 'f_con_telefono', 'label' => 'Telefono',        'name' => 'telefono',          'type' => 'text'],
            ['key' => 'f_con_whatsapp', 'label' => 'WhatsApp',        'name' => 'whatsapp',          'type' => 'text'],
            ['key' => 'f_con_mappa',    'label' => 'Google Maps Embed URL', 'name' => 'mappa_embed',  'type' => 'url'],
        ],
        'location' => [[[
            'param' => 'page',
            'operator' => '==',
            'value' => 'contatti',
        ]]],
    ]);
}

// =============================================
// 6. FILTRO REST API — Camere
// =============================================

// Forza la query REST ad includere tutti i post pubblicati
add_filter('rest_camera_query', function ($args, $request) {
    // Assicura che vengono restituiti tutti i post pubblicati
    if (empty($args['post_status'])) {
        $args['post_status'] = 'publish';
    }
    // Se non è specificato per_page, consenti più risultati
    if (empty($args['posts_per_page']) || $args['posts_per_page'] < 20) {
        $args['posts_per_page'] = 100;
    }
    return $args;
}, 10, 2);

// =============================================
// 7. OTTIMIZZAZIONI
// =============================================

add_filter('upload_size_limit', function () { return 20 * 1024 * 1024; }); // 20MB
add_filter('xmlrpc_enabled', '__return_false');
remove_action('wp_head', 'wp_generator');
