/** @format */

// src/pages/Login.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/stylesLogin.css";

function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [theme, setTheme] = useState(() => {
		const saved = localStorage.getItem("theme");
		return saved ? saved : null;
	});

	useEffect(() => {
		if (!theme) {
			const prefersDark =
				window.matchMedia &&
				window.matchMedia("(prefers-color-shema: dark)").matches;
			updateHtmlClass(prefersDark ? "dark" : "light");
		} else {
			updateHtmlClass(theme);
		}
	}, [theme]);

	function updateHtmlClass(t) {
		const root = document.documentElement;
		if (t === "dark") root.classList.add("dark-mode");
		else root.classList.remove("dark-mode");
	}

	const toggleTheme = () => {
		const next = theme === "dark" ? "light" : "dark";
		setTheme(next);
		localStorage.setItem("theme", next);
		updateHtmlClass(next);
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");
		try {
			const { data } = await api.post("auth/login", { email, password });

			if (data.status === "ok" && data.token) {
				localStorage.setItem("token", data.token);
				navigate("/dashboard");
			} else {
				setError("Identifiants incorrects");
			}
		} catch (err) {
			const apiMessage = err?.response?.data?.message;
			setError(apiMessage || "Erreur lors de la connexion au serveur");
		}
	};

	return (
		<div className="body">
			<div id="toggle-theme" onClick={toggleTheme} title="Changer de theme">
				{theme === "dark" ? (
					<i className="fa-solid fa-sun" />
				) : (
					<i className="fa-solid fa-moon" />
				)}
			</div>
			<div className="container">
				<div className="drop"></div>
				<div className="content">
					<h1>Connexion administrateur</h1>
					<hr />
					<form onSubmit={handleLogin}>
						<div className="box">
							<input
								type="email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="box">
							<input
								type="password"
								placeholder="Mot de passe"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<button type="submit" className="btn">
							Se connecter
						</button>
						{error && <p style={{ color: "red" }}>{error}</p>}
					</form>
					<div className="text">
						<h2>Bienvenue</h2>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
