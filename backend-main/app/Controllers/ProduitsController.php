<?php namespace App\Controllers;

use App\Models\ProduitModel;
use CodeIgniter\RESTful\ResourceController;

class ProduitsController extends ResourceController
{
    protected $modelName = ProduitModel::class;
    protected $format    = 'json';

    public function index()
    {
        return $this->respond($this->model->findAll());
    }

    public function create()
    {
        helper(['form']);
    
        $validation = \Config\Services::validation();
    
        $validation->setRules([
            'name' => 'required',
            'description' => 'required',
            'unit_price' => 'required|numeric',
            'available_quantity' => 'required|integer',
            'image' => 'uploaded[image]|is_image[image]|mime_in[image,image/jpeg,image/png,image/jpg]'
        ]);
    
        if (!$validation->withRequest($this->request)->run()) {
            return $this->response->setJSON([
                'errors' => $validation->getErrors()
            ])->setStatusCode(400);
        }
    
        $file = $this->request->getFile('image');
        $newName = $file->getRandomName();
        $file->move(ROOTPATH . 'public/uploads/products', $newName);
    
        $produitModel = new \App\Models\ProduitModel();
        $produitModel->insert([
            'name' => $this->request->getPost('name'),
            'description' => $this->request->getPost('description'),
            'unit_price' => $this->request->getPost('unit_price'),
            'available_quantity' => $this->request->getPost('available_quantity'),
            'image_url' => '/uploads/products/' . $newName
        ]);
    
        return $this->response->setJSON(['message' => 'Produit créé avec succès']);
    }

    public function options()
    {
        return $this->response
            ->setHeader('Access-Control-Allow-Origin', '*')
            ->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            ->setHeader('Access-Control-Allow-Credentials', 'true')
            ->setStatusCode(200);
    }
    public function update($id = null)
{
    // Toujours répondre en JSON proprement, éviter 500 silencieux
    try {
        if ($id === null) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'ID produit manquant'
            ])->setStatusCode(400);
        }

        // Accepte JSON (PUT), ignore les autres contenus ici
        $json = $this->request->getJSON(true);
        if (!$json) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Données JSON manquantes'
            ])->setStatusCode(400);
        }

        $model = new \App\Models\ProduitModel();
        $product = $model->find($id);
        if (!$product) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Produit introuvable'
            ])->setStatusCode(404);
        }

        // Ne mettre à jour que les champs autorisés
        $data = [];
        if (array_key_exists('name', $json))                $data['name'] = (string) $json['name'];
        if (array_key_exists('description', $json))         $data['description'] = (string) $json['description'];
        if (array_key_exists('unit_price', $json))          $data['unit_price'] = (int) $json['unit_price'];
        if (array_key_exists('available_quantity', $json))  $data['available_quantity'] = (int) $json['available_quantity'];

        if (empty($data)) {
            return $this->response->setJSON([
                'status' => 'ok',
                'message' => 'Aucun champ à mettre à jour'
            ])->setStatusCode(200);
        }

        // Exécuter la mise à jour
        $model->update($id, $data);

        return $this->response->setJSON([
            'status' => 'ok',
            'message' => 'Produit mis à jour',
            'product_id' => (int) $id
        ])->setStatusCode(200);

    } catch (\Throwable $e) {
        // Log interne si besoin: log_message('error', $e->getMessage());
        return $this->response->setJSON([
            'status' => 'error',
            'message' => 'Erreur serveur lors de la mise à jour'
        ])->setStatusCode(500);
    }
}

    public function delete($id = null)
    {
        if ($id === null) {
            return $this->response->setJSON(['message' => 'ID produit manquant'])->setStatusCode(400);
        }
        $model = new \App\Models\ProduitModel();
        $product = $model->find($id);
        if (!$product) {
            return $this->response->setJSON(['message' => 'Produit non trouve'])->setStatusCode(404);
        }
        $model->delete($id);
        return $this->response->setJSON(['message' => 'Prosuit supprime avec succes'])->setStatusCode(200);
    }
}
