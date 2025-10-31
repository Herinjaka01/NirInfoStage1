<?php namespace App\Models;

use CodeIgniter\Model;

class RetraitModel extends Model
{
    protected $table = 'withdrawals';
    protected $primaryKey = 'withdrawal_id';
    protected $allowedFields = [
        'user_id',
        'amount',
        'payment_method',
        'receiver_number',
        'status',
        'created_at'
    ];
}
