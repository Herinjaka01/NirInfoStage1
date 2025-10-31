<?php

namespace App\Controllers;

use App\Models\AdminModel;
use CodeIgniter\RESTful\ResourceController;

class AuthController extends ResourceController
{
    protected $format = 'json';

    public function login() 
    {
        $data = $this->request->getJSON(true);
        $email = $data['email'] ?? '';
        $password = $data['password']?? '';


        $model = new AdminModel();
        $user = $model->where('email', $email)->first();

        if (!$user) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Email introuvable'
            ], 401);
        }

         if (!password_verify($password, $user['password'])) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Mot de passe incorrect'
            ], 401);
        }

        return $this->respond([
            'status' => 'ok',
            'message' => 'Connexion réussie',
            'token' => bin2hex(random_bytes(32)),
            'user' => $user
        ]);
    }
    public function create() {
        $AdminModel = new AdminModel();

        // Préparer les données à insérer
        $data = [
            'name' => $this->request->getPost('name'),
            'email' => $this->request->getPost('email'),
            'password' => password_hash($this->request->getPost('password'), PASSWORD_DEFAULT)
        ];

        // Insérer les données dans la base de données
         $AdminModel->insert($data) ;
    }
}
