<?php namespace App\Models;

use CodeIgniter\Model;

class ProduitModel extends Model
{
    protected $table = 'products';

    protected $primaryKey = 'product_id';
    protected $allowedFields = ['name', 'unit_price', 'description', 'available_quantity', 'image_url'];
}


