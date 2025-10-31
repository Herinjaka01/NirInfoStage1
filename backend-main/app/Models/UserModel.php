<?php
namespace App\Models;
use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'user_id';

    protected $allowedFields = [
        'name',
        'username',
        'number',
        'email',
        'date_of_birth',
        'imgCIN',
        'password',
        'role',
        'created_at',
        'updated_at',
        'profil'
    ];

    protected $returnType = 'array';
    public $useTimestamps = true; //CI gère created_at et updated_at automatiquement
}
