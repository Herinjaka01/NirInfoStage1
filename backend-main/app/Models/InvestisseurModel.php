<?php namespace App\Models;

use CodeIgniter\Model;

class InvestisseurModel extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'user_id';
    protected $allowedFields = [
        'first_name',
        'last_name',
        'phone_number',
        'email',
        'date_of_birth',
        'password',
        'role',
        'created_at',
        'updated_at',
        'profile_picture',
        'CIN_picture'
    ];
    protected $returnType = 'array';
}
