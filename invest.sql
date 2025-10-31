-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 16 sep. 2025 à 15:07
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `invest`
--

-- --------------------------------------------------------

--
-- Structure de la table `admins`
--

CREATE TABLE `admins` (
  `admin_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admins`
--

INSERT INTO `admins` (`admin_id`, `name`, `email`, `password`) VALUES
(1, 'Super Admin', 'admin@invest.com', '0192023a7bbd73250516f069df18b500'),
(2, 'admin', 'admin45@invest.com', '$2y$10$21C8V5Gjm3kIgUCMcBLqbOSF3DB9hOWjXiCEKtBVdnSNZKTl0qyvu');

-- --------------------------------------------------------

--
-- Structure de la table `clients`
--

CREATE TABLE `clients` (
  `client_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `adresse` text NOT NULL,
  `contact` varchar(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `clients`
--

INSERT INTO `clients` (`client_id`, `first_name`, `last_name`, `adresse`, `contact`) VALUES
(2, 'Bruh', 'Shindo', 'Amoronakona', '038 65 125 ');

-- --------------------------------------------------------

--
-- Structure de la table `commission`
--

CREATE TABLE `commission` (
  `commision_id` int(11) NOT NULL,
  `delivery_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `status` enum('pending','paid') NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `deliveries`
--

CREATE TABLE `deliveries` (
  `delivery_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_quantity` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `deliveries`
--

INSERT INTO `deliveries` (`delivery_id`, `product_id`, `product_quantity`, `client_id`, `user_id`) VALUES
(1, 4, 2, 1, 2);

-- --------------------------------------------------------

--
-- Structure de la table `deposits`
--

CREATE TABLE `deposits` (
  `deposit_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `payment_method` enum('bank','mobile_money','check') NOT NULL,
  `sender_number` varchar(20) DEFAULT NULL,
  `proof_image` varchar(255) DEFAULT NULL,
  `status` enum('en attente','rejeté','validé') NOT NULL DEFAULT 'en attente',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `investments`
--

CREATE TABLE `investments` (
  `investment_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total_amount` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `user_id` int(11) NOT NULL,
  `pack_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

CREATE TABLE `migrations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `version` varchar(255) NOT NULL,
  `class` varchar(255) NOT NULL,
  `group` varchar(255) NOT NULL,
  `namespace` varchar(255) NOT NULL,
  `time` int(11) NOT NULL,
  `batch` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `version`, `class`, `group`, `namespace`, `time`, `batch`) VALUES
(1, '2025-08-20-195334', 'App\\Database\\Migrations\\CreateAdminsTable', 'default', 'App', 1755760250, 1),
(2, '2025-08-20-195352', 'App\\Database\\Migrations\\CreateClientsTable', 'default', 'App', 1755760250, 1),
(3, '2025-08-20-195448', 'App\\Database\\Migrations\\CreateDeliveriesTable', 'default', 'App', 1755760250, 1),
(4, '2025-08-20-195459', 'App\\Database\\Migrations\\CreateDepositsTable', 'default', 'App', 1755760699, 2),
(5, '2025-08-20-195521', 'App\\Database\\Migrations\\CreateInvestmentsTable', 'default', 'App', 1755760699, 2),
(6, '2025-08-20-195537', 'App\\Database\\Migrations\\CreatePacksTable', 'default', 'App', 1755760699, 2),
(7, '2025-08-20-195601', 'App\\Database\\Migrations\\CreatePaymentsTable', 'default', 'App', 1755761159, 3),
(8, '2025-08-20-195612', 'App\\Database\\Migrations\\CreateProductsTable', 'default', 'App', 1755761159, 3),
(9, '2025-08-20-195631', 'App\\Database\\Migrations\\CreateTransactionsTable', 'default', 'App', 1755761196, 4),
(10, '2025-08-20-195647', 'App\\Database\\Migrations\\CreateUsersTable', 'default', 'App', 1755761196, 4),
(11, '2025-08-20-195702', 'App\\Database\\Migrations\\CreateWalletsTable', 'default', 'App', 1755761196, 4),
(12, '2025-08-20-195718', 'App\\Database\\Migrations\\CreateWithdrawalsTable', 'default', 'App', 1755761227, 5);

-- --------------------------------------------------------

--
-- Structure de la table `packs`
--

CREATE TABLE `packs` (
  `pack_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `pack_name` varchar(255) NOT NULL,
  `order_start_date` datetime NOT NULL,
  `min_investment` bigint(20) NOT NULL,
  `objective_quantity` int(11) NOT NULL,
  `return_on_investment` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `packs`
--

INSERT INTO `packs` (`pack_id`, `product_id`, `pack_name`, `order_start_date`, `min_investment`, `objective_quantity`, `return_on_investment`) VALUES
(56, 5, 'Pack 2025-001', '2025-09-16 00:00:00', 100000, 10, 40);

-- --------------------------------------------------------

--
-- Structure de la table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `payment_method` enum('bank','mobile_money','check','wallet') NOT NULL,
  `sender_number` varchar(20) DEFAULT NULL,
  `proof_image` varchar(255) DEFAULT NULL,
  `status` enum('en attente','rejeté','validé') NOT NULL DEFAULT 'en attente',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `reference` varchar(100) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `unit_price` int(11) NOT NULL,
  `available_quantity` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `commission_rate` int(11) NOT NULL DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`product_id`, `name`, `reference`, `image_url`, `unit_price`, `available_quantity`, `description`, `commission_rate`) VALUES
(4, 'Montre lux', 'M12588', '/uploads/products/1752527660_63ba240309e959aa3adf.png', 5000000, 1000, 'Montre valeur en or', 40),
(5, 'Ordinateur', 'O12586', '/uploads/products/1752527759_346337d7cb00bb877f11.png', 2000000, 17, 'Ordinateur de jeu Intel Megaport Ordinateur personnel, Intel, électronique', 50),
(6, 'Cartable', 'C12587', '/uploads/products/1752525537_50acde3fd23c37f58204.png', 200000, 40, 'Serviette sac à main sac à dos cartable pour  ordinateur portable', 40);

-- --------------------------------------------------------

--
-- Structure de la table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `status` enum('en attente','rejeté','validé') NOT NULL DEFAULT 'en attente',
  `type` enum('deposit','payment_request','withdrawal') NOT NULL,
  `payment_method` enum('bank','check','mobile_money','wallet') DEFAULT NULL,
  `sender_number` varchar(20) DEFAULT NULL,
  `receiver_number` varchar(20) DEFAULT NULL,
  `proof_image` varchar(255) DEFAULT NULL,
  `deposit_id` int(11) DEFAULT NULL,
  `withdrawal_id` int(11) DEFAULT NULL,
  `payment_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone_number` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `date_of_birth` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` enum('commercial','investor') NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  `profile_picture` text DEFAULT NULL,
  `CIN_picture` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci PACK_KEYS=1;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `phone_number`, `email`, `date_of_birth`, `password`, `role`, `created_at`, `updated_at`, `profile_picture`, `CIN_picture`) VALUES
(1, 'Heriniaina', 'Fidison Jeaon Brushindo', '038 65 125 08', 'brushindo46@gmail.com', '2006-09-29', '$2y$10$7J3lFZZYSP7z9tLCGtgeFuRypIBKzYrvE/w.C/pPWEv/4cb/LwZBO', 'investor', '2025-07-21 06:06:12', '2025-07-21 06:06:12', NULL, NULL),
(2, 'Andrianarimalala', 'Andy', '0340000000', 'tsikyandriantia@gmail.com', '2000-02-21', '$2y$10$lKfq31YhWDcmVNF8bF.3seNfhyMmPSmXNCaPRROgoqwOUbv3SIjGu', 'commercial', '2025-05-29 06:39:06', '2025-07-21 06:39:06', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `wallets`
--

CREATE TABLE `wallets` (
  `wallet_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `balance` decimal(12,2) DEFAULT 0.00
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `wallets`
--

INSERT INTO `wallets` (`wallet_id`, `user_id`, `balance`) VALUES
(1, 1, 2500000.00);

-- --------------------------------------------------------

--
-- Structure de la table `withdrawals`
--

CREATE TABLE `withdrawals` (
  `withdrawal_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `payment_method` enum('mobile_money') NOT NULL DEFAULT 'mobile_money',
  `receiver_number` varchar(20) NOT NULL,
  `status` enum('en attente','refusé','validé') NOT NULL DEFAULT 'en attente',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`client_id`);

--
-- Index pour la table `commission`
--
ALTER TABLE `commission`
  ADD PRIMARY KEY (`commision_id`);

--
-- Index pour la table `deliveries`
--
ALTER TABLE `deliveries`
  ADD PRIMARY KEY (`delivery_id`);

--
-- Index pour la table `deposits`
--
ALTER TABLE `deposits`
  ADD PRIMARY KEY (`deposit_id`);

--
-- Index pour la table `investments`
--
ALTER TABLE `investments`
  ADD PRIMARY KEY (`investment_id`);

--
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `packs`
--
ALTER TABLE `packs`
  ADD PRIMARY KEY (`pack_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Index pour la table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Index pour la table `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`wallet_id`);

--
-- Index pour la table `withdrawals`
--
ALTER TABLE `withdrawals`
  ADD PRIMARY KEY (`withdrawal_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `clients`
--
ALTER TABLE `clients`
  MODIFY `client_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `commission`
--
ALTER TABLE `commission`
  MODIFY `commision_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `deliveries`
--
ALTER TABLE `deliveries`
  MODIFY `delivery_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `deposits`
--
ALTER TABLE `deposits`
  MODIFY `deposit_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `investments`
--
ALTER TABLE `investments`
  MODIFY `investment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `packs`
--
ALTER TABLE `packs`
  MODIFY `pack_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT pour la table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT pour la table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `wallets`
--
ALTER TABLE `wallets`
  MODIFY `wallet_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `withdrawals`
--
ALTER TABLE `withdrawals`
  MODIFY `withdrawal_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
