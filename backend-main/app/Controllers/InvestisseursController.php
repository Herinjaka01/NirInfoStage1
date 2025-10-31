<?php namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class InvestisseursController extends ResourceController
{
    protected $modelName = 'App\Models\InvestisseurModel';
    protected $format    = 'json';


    public function index()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('users');
        $builder->select('user_id, first_name, last_name, email, phone_number, role, created_at');
        $builder->where('role', 'investor');
        $rows = $builder->get()->getResultArray();
        return $this->respond($rows);
    }

    // PUT /investisseurs/{id}
    public function update($id = null)
    {
        $json = $this->request->getJSON();

        if (!$json || !isset($json->actif)) {
            return $this->failValidationError("Champ 'actif' manquant.");
        }

        $model = new \App\Models\InvestisseurModel();
        $investisseur = $model->find($id);

        if (!$investisseur) {
            return $this->failNotFound("Investisseur non trouvé.");
        }
        
        // Exemple: activer/désactiver via un champ générique (à adapter si besoin)
        $data = ['updated_at' => date('Y-m-d H:i:s')];
        
        if ($model->update($id, $data)) {
            return $this->respondUpdated(['message' => 'Statut mis à jour']);
        } else {
            return $this->failServerError('Impossible de mettre à jour le statut');
        }
    }
}
