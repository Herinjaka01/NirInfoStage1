<?php 

namespace App\Controllers;

use App\Models\PackModel;
use CodeIgniter\RESTful\ResourceController;

class PacksController extends ResourceController
{
    protected $modelName = PackModel::class;
    protected $format    = 'json';

    // Récupérer tous les packs
    public function index()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('packs');
        $builder->select('packs.*, products.available_quantity, products.name as product_name');
        $builder->join('products', 'products.product_id = packs.product_id', 'left');
        
        $query = $builder->get();
        $packs = $query->getResultArray();
    
        return $this->respond($packs);
    }

    // Récupérer un pack par ID
    public function show($id = null)
    {
        $pack = $this->model->find($id);
        if (!$pack) {
            return $this->failNotFound('Pack introuvable');
        }
        return $this->respond($pack);
    }

    // Ajouter un pack
    public function create()
    {
        $db = \Config\Database::connect();
        $data = $this->request->getJSON(true);
    
        // Vérification des champs obligatoires
        if (
            !isset($data['expected_goal']) ||
            !isset($data['min_investment']) ||
            !isset($data['product_id']) ||
            !isset($data['return_on_investment'])
        ) {
            return $this->failValidationError("Champs manquants : product_id, expected_goal, min_investment, return_on_investment.");
        }
    
        // Vérifie si le produit existe
        $productId = (int) $data['product_id'];
        $objectiveQty = (int) $data['expected_goal'];

        // Nom de pack Gerenate
        $year = date('Y');
        $count = $db-> table('packs')-> LIke('pack_name', "Pack $year-", 'after')-> countAllResults();
        $packNumber = str_pad($count + 1, 3, '0', STR_PAD_LEFT);
        $packName = "Pack $year-$packNumber";

        $db->transStart();

        //verouillage de la ligne produit
        $product = $db->query(
            "SELECT * FROM products WHERE product_id = ? FOR UPDATE",
            [$productId]
        )->getRowArray();
    
        if (!$product) {
            $db->transComplete();
            return $this->failNotFound("Produit introuvable");
        }
    
        if ((int)$product['available_quantity'] < $objectiveQty) {
            $db->transComplete();
            return $this->failValidationError("Stock insuffisant, Disponible: {$product['available_quantity']}");
        }

        //decrementation ny stock
        $db->table('products')
            ->where('product_id', $productId)
            ->set('available_quantity', 'available_quantity - ' . $objectiveQty, false)
            ->update();

        //insertion du packy
        $packData = [
            'product_id' => $data['product_id'],
            'pack_name' => $packName,
            'objective_quantity' => $data['expected_goal'],
            'min_investment' => $data['min_investment'],
            'return_on_investment' => $data['return_on_investment'],
            'order_start_date' => date('Y-m-d H:i:s'),
        ];
        $db->table('packs')->insert($packData);
        $insertId = $db->insertID();

        $db->transComplete();

        if ($db->transStatus() === false) {
        return $this->failServerError("Échec lors de la création du pack.");
        }

        return $this->respondCreated([
            'message' => 'Pack ajoute avec succes',
            'pack_id' => $insertId,
            'pack_name' => $packData,
        ]);
    }
    


    // Mettre à jour un pack
    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        $this->model->update($id, $data);
        return $this->respondUpdated($data);
    }

    // Supprimer un pack
    public function delete($id = null)
    {
        if ($id === null) {
            return $this->failValidationError('ID du pack requis');
        }

        $db = \Config\Database::connect();
        $db->transStart();

        //Mrecupere ny pack de Mverouiller produit
        $pack = $db->table('packs')->where('pack_id', $id)->get()->getRowArray();
        if (!$pack) {
            $db->transComplete();
            return $this->failNotFound('Pack introuvable');
        }

        $productId = (int) $pack['product_id'];
        $objectiveQty = (int) $pack['objective_quantity'];

        //Suppr Pack fotsny
        $db->table('packs')->where('pack_id', $id)->delete();
        
        //Restauration de stock
        $db->table('products')
            ->where('product_id', $productId)
            ->set('available_quantity', 'available_quantity + ' . $objectiveQty, false)
            ->update();

            $db->transComplete();

            if ($db->transStatus() === false) {
                return $this->failServerError('Echec lors de la suppression du pack');
            }
            return $this->respondDeleted(['message' => 'Pack supprime avec succes']);
        
    }

    // Support CORS (OPTIONS)
    public function options()
    {
        return $this->response->setStatusCode(200);
    }
}
