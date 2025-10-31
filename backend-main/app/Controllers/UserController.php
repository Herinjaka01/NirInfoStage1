<?php

namespace App\Controllers;

use App\Models\User;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class UserController extends ResourceController
{
    protected $modelName = 'App\Models\User';
    protected $format    = 'json';


        public function saveToken()
    {
        $json = $this->request->getJSON();
        // $userId = $json->user_id ?? null;
        $userId = 1;
        $token = $json->token ?? null;

        if (!$userId || !$token) {
            return $this->failValidationErrors('user_id ou token manquant.');
        }

        $userModel = new User();
        $user = $userModel->find($userId);

        if (!$user) {
            return $this->failNotFound("Utilisateur ID {$userId} introuvable.");
        }

        $userModel->update($userId, ['fcm_token' => $token]);

        return $this->respond(['message' => 'Token enregistré avec succès.']);
    }

        public function sendNotification($userId)
        {
            $userModel = new User();
            $user = $userModel->find($userId);

            if (!$user || !$user['fcm_token']) {
                return $this->failNotFound('Utilisateur ou token FCM introuvable.');
            }

            // 🔐 Mets ici ta vraie server key (trouvée dans Google Cloud Console > APIs > Credentials)
            $serverKey = 'AIzaSyB1PLt0x7zts2YQH6m8v4uq7rXyZEwSXEM';

            $data = [
                "to" => $user['fcm_token'],
                "notification" => [
                    "title" => "Salut " . $user['name'],
                    "body"  => "Ceci est une notification depuis CodeIgniter 4 😎",
                    "sound" => "default"
                ]
            ];

            $headers = [
                'Authorization: key=' . $serverKey,
                'Content-Type: application/json'
            ];

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send');
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

            $result = curl_exec($ch);
            $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            return $this->respond([
                'status' => $status,
                'result' => json_decode($result)
            ]);
        }
    /**
     * Return an array of resource objects, themselves in array format.
     *
     * @return ResponseInterface
     */
    public function index()
    {
        $data = [
            'message' => 'success',
            'users' => $this->model->findAll(),
        ];
        return $this->response->setJSON($data, 200);
    }

    /**
     * Return the properties of a resource object.
     *
     * @param int|string|null $id
     *
     * @return ResponseInterface
     */
    public function show($id = null)
    {
        //
    }

    /**
     * Return a new resource object, with default properties.
     *
     * @return ResponseInterface
     */
    public function new()
    {
        //
    }

    /**
     * Create a new resource object, from "posted" parameters.
     *
     * @return ResponseInterface
     */
    public function create()
    {
        $json = $this->request->getJSON();

        $data = [
            'name'          => $json->name ?? null,
            'username'      => $json->username ?? null,
            'number'        => $json->number ?? null,
            'email'         => $json->email ?? null,
            'date_of_birth' => $json->date_of_birth ?? null,
            'imgCIN'        => $json->imgCIN ?? null,
            'profil'        => $json->profil ?? null,
            'password'      => isset($json->password) ? password_hash($json->password, PASSWORD_DEFAULT) : null,
            'role'          => $json->role ?? null,
        ];

        $userModel = new User();
$insertedId = $userModel->insert($data);

// Puis on récupère l'utilisateur inséré
$createdUser = $userModel->find($insertedId);

return $this->response->setJSON([
    'status' => true,
    'message' => 'Utilisateur créé avec succès',
    'user' => $createdUser
]);
    }

public function uploadCINImage($id = null)
{
    helper(['form', 'url']);
    $userModel = new User();

    $img = $this->request->getFile('imgCIN');
    
    if (!$img->isValid()) {
        return $this->response->setJSON([
            'status' => false,
            'message' => 'Aucune image valide reçue'
        ]);
    }

    $newName = $img->getRandomName();
    $img->move(ROOTPATH . 'public/uploads', $newName);

    $imageUrl = getenv('APP_HOST') . '/uploads/' . $newName;

    if ($id) {
        $success = $userModel->update($id, ['imgCIN' => $imageUrl]);
        if (!$success) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Échec de mise à jour'
            ]);
        }
    }

    return $this->response->setJSON([
        'status' => true,
        'imageUrl' => $imageUrl,
        'message' => 'Image CIN uploadée avec succès'
    ]);
}



    public function uploadProfileImage($id = null)
{
    helper(['form', 'url']);

    $userModel = new User();

    $img = $this->request->getFile('profileImage');
    if (!$img->isValid()) {
        return $this->response->setJSON([
            'status' => false,
            'message' => 'Aucune image valide reçue'
        ]);
    }

    $newName = $img->getRandomName();
    $img->move(ROOTPATH . 'public/uploads', $newName);

   $imageUrl = getenv('APP_HOST') . '/uploads/' . $newName;

    if ($id) {
    $success = $userModel->update($id, ['profil' => $imageUrl]);

    if (!$success) {
        log_message('error', 'Échec de mise à jour utilisateur ID: ' . $id);
        return $this->response->setJSON([
            'status' => false,
            'message' => 'Échec de mise à jour en base'
        ]);
    } else {
        log_message('debug', 'Image mise à jour avec succès pour l\'utilisateur ID: ' . $id);
    }
}


    return $this->response->setJSON([
        'status' => true,
        'imageUrl' => $imageUrl,
        'message' => 'Image uploadée avec succès'
    ]);
}

    public function login()
    {
        log_message('debug', 'Requête de login reçue');

        $json = $this->request->getJSON();

        if (!$json) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Données invalides ou JSON manquant'
            ]);
        }

        $email = strtolower(trim($json->email ?? ''));
        $password = $json->password ?? '';


        log_message('debug', "Email reçu: $email");

        if (!$email || !$password) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Email ou mot de passe manquant'
            ]);
        }

        $userModel = new User();
        $user = $userModel->where('email', $email)->first();

        if (!$user) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Utilisateur introuvable'
            ]);
        }

        if (!password_verify($password, $user['password'])) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Mot de passe incorrect'
            ]);
        }

        unset($user['password']);

        return $this->response->setJSON([
            'status' => true,
            'message' => 'Utilisateur connecté',
            'user' => $user
        ]);
    }

    /**
     * Return the editable properties of a resource object.
     *
     * @param int|string|null $id
     *
     * @return ResponseInterface
     */
    public function edit($id = null)
    {
        $userModel = new User();

        $user = $userModel->where("user_id", $id)->get()->getRowArray();

        if (!$user) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Utilisateur non trouvé'
            ]);
        }

        return $this->response->setJSON([
            'status' => true,
            'user' => $user
        ]);
    }

    /**
     * Add or update a model resource, from "posted" properties.
     *
     * @param int|string|null $id
     *
     * @return ResponseInterface
     */
    public function update($id = null)
{
    $json = $this->request->getJSON();

    if (!$json) {
        return $this->response->setJSON([
            'status' => false,
            'message' => 'Données invalides ou JSON manquant'
        ]);
    }

    $userModel = new User();
    $user = $userModel->find($id);

    if (!$user) {
        return $this->response->setJSON([
            'status' => false,
            'message' => 'Utilisateur non trouvé'
        ]);
    }

    if (isset($json->password) && !empty($json->password)) {
        if (!isset($json->oldPassword) || empty($json->oldPassword)) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'L\'ancien mot de passe est requis pour changer le mot de passe'
            ]);
        }

        if (!password_verify($json->oldPassword, $user['password'])) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'L\'ancien mot de passe est incorrect'
            ]);
        }
    }

    $data = [
        'name'          => $json->name ?? $user['name'],
        'username'      => $json->username ?? $user['username'],
        'number'        => $json->number ?? $user['number'],
        'email'         => $json->email ?? $user['email'],
        'date_of_birth' => $json->date_of_birth ?? $user['date_of_birth'],
        'imgCIN'        => $json->imgCIN ?? $user['imgCIN'],
        'profil'        => $json->profil ?? $user['profil'],
        'role'          => $json->role ?? $user['role'],
    ];

    if (isset($json->password) && !empty($json->password)) {
        $data['password'] = password_hash($json->password, PASSWORD_DEFAULT);
    }

    $success = $userModel->update($id, $data);

    if (!$success) {
        return $this->response->setJSON([
            'status' => false,
            'message' => 'Échec de la mise à jour'
        ]);
    }

    return $this->response->setJSON([
        'status' => true,
        'message' => 'Utilisateur mis à jour avec succès'
    ]);
}

    /**
     * Delete the designated resource object from the model.
     *
     * @param int|string|null $id
     *
     * @return ResponseInterface
     */
    public function delete($id = null)
{
    $userModel = new User();

    $user = $userModel->find($id);
    if (!$user) {
        return $this->response->setJSON([
            'status' => false,
            'message' => 'Utilisateur non trouvé'
        ]);
    }

    if ($userModel->delete($id)) {
        return $this->response->setJSON([
            'status' => true,
            'message' => 'Utilisateur supprimé avec succès'
        ]);
    }

    return $this->response->setJSON([
        'status' => false,
        'message' => 'Échec de suppression'
    ]);
}

}
