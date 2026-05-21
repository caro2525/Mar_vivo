# 🔐 Setup: Autenticación Email/Password para Dashboard Mar Vivo

## 1️⃣ Crear usuarios en Firebase Authentication

### En Firebase Console:

1. Ve a [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Selecciona el proyecto `marvivo-8148d`
3. Ve a **Authentication → Users**
4. Haz clic en **Add user**
5. Ingresa:
   - **Email**: el email del investigador
   - **Password**: una contraseña segura
6. Haz clic en **Create user**
7. Repite para cada investigador que necesite acceso

---

## 2️⃣ Ejecutar el dashboard localmente

```bash
cd dashboard
pip install -r requirements.txt
streamlit run dashboard.py
```

Abre **http://localhost:8501**

---

## 3️⃣ Iniciar sesión

En la pantalla de login:
- **Email**: ingresa el email creado en Firebase
- **Contraseña**: ingresa la contraseña creada en Firebase
- Haz clic en **Inicia sesión**

Si las credenciales son correctas, accederás al dashboard.

---

## 4️⃣ Para Streamlit Cloud (producción)

1. Publica el repo en GitHub
2. Ve a [share.streamlit.io](https://share.streamlit.io)
3. Haz clic en **New app**
4. Selecciona tu repo y rama
5. La app se publicará automáticamente

Los usuarios usarán el mismo email/password de Firebase para iniciar sesión.

---

## ✅ Verificación

- [ ] Aparece pantalla de login al abrir el dashboard
- [ ] Puedo iniciar sesión con un email registrado en Firebase
- [ ] Veo el dashboard después de iniciar sesión
- [ ] El botón "Cerrar sesión" funciona
- [ ] Mi email aparece en el sidebar
- [ ] Si intento con credenciales incorrectas, veo error

---

## 🆘 Troubleshooting

**Error: "Email o contraseña incorrectos"**
- Verifica que el email está registrado en Firebase Authentication
- Verifica que la contraseña es correcta
- Asegúrate de que `serviceAccount.json` está en la carpeta `dashboard/`

**No veo la pantalla de login**
- Actualiza Streamlit: `pip install --upgrade streamlit`
- Recarga la página en el navegador

**Error: "serviceAccount.json not found"**
- Coloca tu archivo `serviceAccount.json` en `dashboard/`
- No está en `.gitignore`, así que ten cuidado si lo subes a GitHub
