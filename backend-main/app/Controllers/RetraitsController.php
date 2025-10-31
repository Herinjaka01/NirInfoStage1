<?php namespace App\Controllers;

use App\Models\RetraitModel;
use CodeIgniter\RESTful\ResourceController;

class RetraitsController extends ResourceController
{
    protected $modelName = RetraitModel::class;
    protected $format    = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('withdrawals w');
        $builder->select('w.withdrawal_id, w.user_id, w.amount, w.payment_method, w.receiver_number, w.status, w.created_at');
        $query = $builder->get();
        $rows = $query->getResultArray();
        return $this->respond($rows);
    }
}
