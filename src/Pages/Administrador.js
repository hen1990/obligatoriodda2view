import React, { useState } from 'react';
import "../css/administrador.css";

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        const data = { email, password };

        try {
            const response = await fetch('http://localhost:5001/administrador/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                setSuccess(true);
                setError('');
                console.log('Administrador autenticado:', result);
                localStorage.setItem('admin', JSON.stringify(data));
                window.location.href = '/administrarjuego';
                // Redirige o realiza otra acción después del inicio de sesión exitoso.
            } else if (response.status === 400) {
                setError('Credenciales inválidas. Por favor verifica tus datos.');
            } else {
                setError('Hubo un error en el servidor. Por favor intenta más tarde.');
            }
        } catch (err) {
            console.error('Error al intentar iniciar sesión:', err);
            setError('No se pudo conectar al servidor.');
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login">
                <h2>Iniciar sesión como administrador</h2>
                {success ? (
                    <div className="success-message">¡Inicio de sesión exitoso!</div>
                ) : (
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <input
                                type="email"
                                  placeholder="Email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                             <input
                                type="password"
                                placeholder="Contraseña"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <button type="submit">Iniciar sesión</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default AdminLogin;
