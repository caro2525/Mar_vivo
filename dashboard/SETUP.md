# 🔐 Setup: Autenticación Google para Dashboard Mar Vivo

## 1️⃣ Obtener credenciales de Google OAuth

### En Google Cloud Console:

1. Abre [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Selecciona el proyecto `marvivo-8148d`
3. Ve a **APIs & Services → Credenciales**
4. Haz clic en **+ Crear credenciales → ID de cliente OAuth 2.0**
5. Selecciona **Aplicación web**
6. En "URIs de redirección autorizados", agrega:
   ```
   http://localhost:8501/oauth2callback
   https://<tu-nombre-app>.streamlit.app/oauth2callback
   ```
7. Copia el **Client ID** y **Client Secret**

---

## 2️⃣ Configurar secretos locales

### Edita `.streamlit/secrets.toml`:

```toml
[auth]
redirect_uri = "http://localhost:8501/oauth2callback"
cookie_secret = "abcd1234efgh5678ijkl9012mnop3456"

[auth.google]
client_id = "AQUI_TU_CLIENT_ID.apps.googleusercontent.com"
client_secret = "AQUI_TU_CLIENT_SECRET"
server_metadata_url = "https://accounts.google.com/.well-known/openid-configuration"

[authorized_users]
emails = [
    "investigador1@gmail.com",
    "investigador2@gmail.com",
    "rcavieses@gmail.com"
]
```

### Para Streamlit Cloud:

1. Publica la app: `streamlit run dashboard.py`
2. Ve al dashboard en Streamlit Cloud
3. Abre **Settings → Secrets**
4. Pega el contenido de `secrets.toml` (con `redirect_uri` ajurada a tu URL real)
5. Cambia `redirect_uri` a:
   ```
   https://<tu-nombre-app>.streamlit.app/oauth2callback
   ```

---

## 3️⃣ Agregar usuarios autorizados

Edita `authorized_users.emails` en `secrets.toml` con los emails de los usuarios.

Para Streamlit Cloud, actualiza en **Settings → Secrets**.

---

## 4️⃣ Ejecutar localmente

```bash
cd dashboard
pip install -r requirements.txt
streamlit run dashboard.py
```

Abre **http://localhost:8501** y haz clic en "Continuar con Google"

---

## ✅ Verificación

- [ ] Pantalla de login aparece antes del dashboard
- [ ] Puedo hacer login con Google
- [ ] Si mi email está autorizado, veo el dashboard
- [ ] Si mi email NO está autorizado, veo error de acceso denegado
- [ ] El botón "Cerrar sesión" funciona
- [ ] Mi email aparece en el sidebar

---

## 🆘 Troubleshooting

**Error: "OIDC configuration is invalid"**
- Verifica que `client_id` y `client_secret` son correctos
- Asegúrate de que la URL de redirección coincide en Google Cloud

**Error: "Email not authorized"**
- Verifica que el email está en `authorized_users.emails`
- Recuerda actualizar en Streamlit Cloud si es producción

**No me permite hacer login**
- Asegúrate de que Streamlit ≥ 1.41 está instalado
- Actualiza: `pip install --upgrade streamlit`
