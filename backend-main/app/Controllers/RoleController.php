<?php
namespace App\Controllers;

use App\Models\RoleModel;
use CodeIgniter\RESTful\ResourceController;

class RoleController extends ResourceController
{
    protected $modelName = RoleModel::class;
    protected $format    = 'json';

    public function index()
    {
        return $this->respond($this->model->findAll());
    }
}
