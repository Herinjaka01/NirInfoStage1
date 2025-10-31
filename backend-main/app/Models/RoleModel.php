<?php
namespace App\Models;

use CodeIgniter\Model;

class RoleModel extends Model
{
    protected $table = 'roles'; // ou le nom exact de ta table
    protected $primaryKey = 'id';
    protected $allowedFields = ['nom'];
}
