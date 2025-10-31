<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->get('auth/login', 'AuthController::login');
$routes->post('Dashboard', 'AuthController::Dashboard');
$routes->post('auth/login', 'AuthController::login');
$routes->post('auth/create', 'AuthController::create');


// Route vers le dashboard accessible en GET// Dashboard page
$routes->get('dashboard', 'DashboardController::index');
$routes->get('roles', 'RoleController::index');


// API existante (produits, packs...)

$routes->get('packs', 'PacksController::index');

$routes->get('dashboard', 'AuthController::Dashboard');

$routes->options('packs', 'PacksController::options');
$routes->options('auth/login', 'AuthController::options');
$routes->post('produits/(:num)', 'ProduitsController::update/$1');


// Plus tard, routes pour packs, produits...
$routes->get('packs', 'PacksController::index');      // GET /packs
$routes->get('packs/(:num)', 'PacksController::show/$1'); // GET /packs/1
// Facultatif
$routes->post('packs', 'PacksController::create');   // POST /packs
$routes->put('packs/(:num)', 'PacksController::update/$1'); // PUT /packs/1
$routes->delete('packs/(:num)', 'PacksController::delete/$1'); // DELETE /packs/1


// src/App.js
$routes->get('produits', 'ProduitsController::index');
$routes->get('retraits', 'RetraitsController::index');
$routes->post('produits', 'ProduitsController::create'); 
$routes->get('investisseurs', 'InvestisseursController::index');      // GET
$routes->put('investisseurs/(:num)', 'InvestisseursController::update/$1'); // PUT
// app/Config/Routes.php

$routes->resource('investisseurs'); 
$routes->options('produits', 'ProduitsController::options'); // pour CORS
$routes->post('produits', 'ProduitsController::create');

// English aliases expected by frontend
$routes->get('products', 'ProduitsController::index');
$routes->post('products', 'ProduitsController::create');
$routes->put('products/(:num)', 'ProduitsController::update/$1');
$routes->options('products', 'ProduitsController::options');
$routes->options('products/(:num)', 'ProduitsController::options');
$routes->delete('products/(:num)', 'ProduitsController::delete/$1');

// Pour éviter les erreurs CORS lors du PUT
$routes->options('investisseurs/(:num)', 'InvestisseursController::options');


// User
$routes->post('login', 'UserController::login');
$routes->post('create', 'UserController::create');
$routes->get('edit/(:num)', 'UserController::edit/$1');
$routes->post('user/upload-profile-image/(:num)', 'UserController::uploadProfileImage/$1');
$routes->post('user/upload-cin-image/(:num)', 'UserController::uploadCINImage/$1');
$routes->put('user/update/(:num)', 'UserController::update/$1');
