<?php

namespace App\Models;
use CodeIgniter\Model;

class PackModel extends Model
{
    protected $table = 'packs';
    protected $primaryKey = 'pack_id';

    protected $allowedFields = [
        'product_id',
        'pack_name',
        'order_start_date',
        'expected_goal',
        'min_investment',
        'objective_quantity',
        'return_on_investment'
    ];
}
