import streamlit as st
import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

st.set_page_config(page_title="Mar Vivo Dashboard", layout="wide", initial_sidebar_state="expanded")

# ─── AUTHENTICATION (Email/Password) ───
if 'user_email' not in st.session_state:
    st.session_state.user_email = None

if not st.session_state.user_email:
    st.title("🌊 Mar Vivo Dashboard")
    st.info("Acceso restringido. Inicia sesión con tu email y contraseña.")

    col1, col2 = st.columns(2)
    with col1:
        st.subheader("Iniciar sesión")
        login_email = st.text_input("Email", key="login_email", placeholder="tu@email.com")
        login_password = st.text_input("Contraseña", type="password", key="login_password")

        if st.button("Inicia sesión", use_container_width=True):
            if login_email and login_password:
                try:
                    import firebase_admin
                    from firebase_admin import auth

                    user = auth.get_user_by_email(login_email)
                    st.session_state.user_email = login_email
                    st.success(f"✅ ¡Bienvenido, {login_email}!")
                    st.rerun()
                except Exception as e:
                    st.error(f"❌ Email o contraseña incorrectos: {str(e)}")
            else:
                st.warning("Por favor ingresa email y contraseña")

    st.stop()

# ─── FIREBASE CONNECTION ───
@st.cache_resource
def get_db():
    try:
        if not firebase_admin._apps:
            cred = credentials.Certificate("serviceAccount.json")
            firebase_admin.initialize_app(cred)
        return firestore.client()
    except FileNotFoundError:
        st.error("❌ serviceAccount.json not found. Coloca el archivo en la carpeta dashboard/")
        st.stop()
    except Exception as e:
        st.error(f"❌ Firebase error: {e}")
        st.stop()

@st.cache_data(ttl=300)
def load_data():
    db = get_db()
    docs = db.collection("actions").stream()
    records = [d.to_dict() for d in docs]
    if not records:
        return pd.DataFrame()

    df = pd.DataFrame(records)
    # Expand nested dicts
    df = pd.json_normalize(df.to_dict('records'))
    # Convert timestamp to datetime
    if 'timestamp' in df.columns:
        df['timestamp'] = pd.to_datetime(df['timestamp'].apply(lambda x: x.timestamp() if hasattr(x, 'timestamp') else x), unit='s', errors='coerce')
    if 'localTime' in df.columns:
        df['localTime'] = pd.to_datetime(df['localTime'], errors='coerce')
    return df

# ─── PAGE TITLE ───
st.title("🌊 Mar Vivo Dashboard")
st.markdown("Análisis interactivo de datos de jugadores y ecosistema")

# ─── LOAD DATA ───
with st.spinner("Cargando datos de Firebase..."):
    df = load_data()

if df.empty:
    st.warning("⚠️ No hay datos en Firestore aún.")
    st.stop()

# ─── SIDEBAR: AUTH & FILTERS ───
def logout():
    st.session_state.user_email = None
    st.rerun()

st.sidebar.button("🚪 Cerrar sesión", on_click=logout, use_container_width=True)
st.sidebar.caption(f"👤 {st.session_state.user_email}")
st.sidebar.divider()

st.sidebar.header("🔧 Filtros")

# Participant selector
participants = sorted(df['participantCode'].unique())
selected_participants = st.sidebar.multiselect(
    "Participantes",
    participants,
    default=participants[:min(3, len(participants))]
)

# Extract game date from localTime
if 'localTime' in df.columns:
    df['gameDate'] = pd.to_datetime(df['localTime'], errors='coerce').dt.date
    game_dates = sorted(df['gameDate'].dropna().unique())

    if len(game_dates) > 0:
        selected_dates = st.sidebar.multiselect(
            "📅 Fechas de juego",
            game_dates,
            default=game_dates
        )
    else:
        selected_dates = []
else:
    selected_dates = []

# Legacy date range (if needed)
start_date, end_date = None, None

# Reload button
if st.sidebar.button("🔄 Recargar datos", use_container_width=True):
    st.cache_data.clear()
    st.rerun()

# ─── APPLY FILTERS ───
df_filtered = df[df['participantCode'].isin(selected_participants)]
if len(selected_dates) > 0 and 'gameDate' in df.columns:
    df_filtered = df_filtered[df_filtered['gameDate'].isin(selected_dates)]

# ─── TABS ───
tab1, tab2, tab3, tab4, tab5, tab6 = st.tabs([
    "📊 Resumen General",
    "🎣 Capturas",
    "🌱 Ecosistema",
    "💰 Economía",
    "🏝️ Comportamiento",
    "⚡ Velocidad de decisiones"
])

# ═══════════════════════════════════════════════════════════
# TAB 1: RESUMEN GENERAL
# ═══════════════════════════════════════════════════════════
with tab1:
    st.header("Resumen General")

    col1, col2, col3, col4, col5 = st.columns(5)

    with col1:
        st.metric("👥 Participantes", len(df_filtered['participantCode'].unique()))
    with col2:
        st.metric("🎮 Sesiones", len(df_filtered['sessionId'].unique()))
    with col3:
        catch_count = len(df_filtered[df_filtered['type'] == 'catch'])
        st.metric("🐟 Capturas totales", catch_count)
    with col4:
        if 'gameDay' in df_filtered.columns:
            avg_days = df_filtered.groupby('sessionId')['gameDay'].max().mean()
            st.metric("📅 Días promedio", f"{avg_days:.1f}")
        else:
            st.metric("📅 Días promedio", "N/A")
    with col5:
        if 'ecosystem.healthRatio' in df_filtered.columns:
            avg_health = df_filtered['ecosystem.healthRatio'].mean()
            st.metric("💚 Salud ecosistema", f"{avg_health:.0f}%")
        else:
            st.metric("💚 Salud ecosistema", "N/A")

    st.divider()

    # Resumen por sesión
    st.subheader("Sesiones por participante")
    if 'ecosystem.healthRatio' in df_filtered.columns:
        session_summary = df_filtered.drop_duplicates(subset=['sessionId']).groupby('participantCode').agg({
            'sessionId': 'count',
            'ecosystem.healthRatio': 'mean',
            'ecosystem.ecosystemStatus': lambda x: x.mode()[0] if len(x) > 0 else 'N/A'
        }).rename(columns={
            'sessionId': 'Sesiones',
            'ecosystem.healthRatio': 'Salud promedio',
            'ecosystem.ecosystemStatus': 'Estado final'
        })
        st.dataframe(session_summary, use_container_width=True)
    else:
        st.info("No hay datos de ecosistema disponibles")

# ═══════════════════════════════════════════════════════════
# TAB 2: CAPTURAS
# ═══════════════════════════════════════════════════════════
with tab2:
    st.header("Análisis de Capturas")

    catches = df_filtered[df_filtered['type'] == 'catch'].copy()

    if len(catches) == 0:
        st.warning("No hay capturas en los datos filtrados")
    else:
        col1, col2 = st.columns(2)

        # Gráfica de capturas por especie
        with col1:
            st.subheader("Capturas por especie")
            species_counts = catches['details.species'].value_counts()
            fig = px.bar(species_counts, labels={'index': 'Especie', 'value': 'Cantidad'},
                        title="Cantidad de peces capturados por especie")
            fig.update_layout(height=400, showlegend=False)
            st.plotly_chart(fig, use_container_width=True)

        # Gráfica de capturas por zona
        with col2:
            st.subheader("Capturas por zona")
            zone_counts = catches['details.zone'].value_counts()
            fig = px.pie(values=zone_counts.values, names=zone_counts.index,
                        title="Distribución de capturas por zona")
            fig.update_layout(height=400)
            st.plotly_chart(fig, use_container_width=True)

        # Heatmap: especie vs zona
        st.subheader("Matriz: Especie × Zona")
        heatmap_data = pd.crosstab(catches['details.species'], catches['details.zone'])
        fig = px.imshow(heatmap_data, labels=dict(x="Zona", y="Especie", color="Capturas"),
                       title="Heatmap de capturas por especie y zona")
        st.plotly_chart(fig, use_container_width=True)

        # Método de pesca más usado
        col1, col2 = st.columns(2)
        with col1:
            st.subheader("Métodos de pesca utilizados")
            method_counts = catches['details.method'].value_counts()
            fig = px.bar(method_counts, labels={'index': 'Método', 'value': 'Cantidad'},
                        title="Uso de métodos de pesca")
            fig.update_layout(height=400, showlegend=False)
            st.plotly_chart(fig, use_container_width=True)

        with col2:
            st.subheader("Peso promedio por especie")
            if 'details.weight' in catches.columns:
                catch_copy = catches.copy()
                catch_copy['details.weight'] = pd.to_numeric(catch_copy['details.weight'], errors='coerce')
                avg_weight = catch_copy.dropna(subset=['details.weight']).groupby('details.species')['details.weight'].mean().sort_values(ascending=False)
                if len(avg_weight) > 0:
                    fig = px.bar(avg_weight, labels={'value': 'Peso promedio (kg)'},
                                title="Peso promedio de peces capturados")
                    fig.update_layout(height=400, showlegend=False)
                    st.plotly_chart(fig, use_container_width=True)
                else:
                    st.info("No hay datos de peso disponibles")

        # Tabla detallada
        st.subheader("Detalle de capturas")
        display_cols = ['participantCode', 'timestamp', 'details.species', 'details.zone',
                       'details.method', 'details.weight', 'details.value']
        available_cols = [c for c in display_cols if c in catches.columns]
        st.dataframe(catches[available_cols].sort_values('timestamp', ascending=False),
                    use_container_width=True, height=400)

# ═══════════════════════════════════════════════════════════
# TAB 3: ECOSISTEMA
# ═══════════════════════════════════════════════════════════
with tab3:
    st.header("Análisis del Ecosistema")

    if 'ecosystem.healthRatio' not in df_filtered.columns:
        st.warning("No hay datos de ecosistema disponibles")
    else:
        col1, col2 = st.columns(2)

        # Línea de tiempo del health ratio
        with col1:
            st.subheader("Evolución de la salud del ecosistema")
            eco_timeline = df_filtered.groupby(['sessionId', 'gameDay'])['ecosystem.healthRatio'].mean().reset_index()
            fig = px.line(eco_timeline, x='gameDay', y='ecosystem.healthRatio', color='sessionId',
                         labels={'ecosystem.healthRatio': 'Health Ratio (%)', 'gameDay': 'Día de juego'},
                         title="Health ratio a lo largo del juego")
            st.plotly_chart(fig, use_container_width=True)

        # Distribución de estado ecosistema
        with col2:
            st.subheader("Distribución de estados")
            status_counts = df_filtered['ecosystem.ecosystemStatus'].value_counts()
            colors = {'healthy': '#2ecc71', 'warning': '#f39c12', 'critical': '#e74c3c'}
            fig = px.pie(values=status_counts.values, names=status_counts.index,
                        title="Distribución de estados del ecosistema",
                        color_discrete_map={k: colors.get(k, '#95a5a6') for k in status_counts.index})
            st.plotly_chart(fig, use_container_width=True)

        # Impacto ecológico por método
        st.subheader("Impacto ecológico por método de pesca")
        catches = df_filtered[df_filtered['type'] == 'catch'].copy()
        if 'details.eco_impact' in catches.columns and 'details.method' in catches.columns:
            catch_copy = catches.copy()
            catch_copy['details.eco_impact'] = pd.to_numeric(catch_copy['details.eco_impact'], errors='coerce')
            eco_impact = catch_copy.dropna(subset=['details.eco_impact']).groupby('details.method')['details.eco_impact'].mean().sort_values(ascending=True)
            if len(eco_impact) > 0:
                fig = px.bar(eco_impact, labels={'value': 'Impacto ecológico promedio'},
                            title="Impacto ecológico promedio por método de pesca",
                            color='value', color_continuous_scale='RdYlGn_r')
                st.plotly_chart(fig, use_container_width=True)

        # Población por zona
        st.subheader("Población de peces por zona")
        pop_data = df_filtered[['ecosystem.currentZone', 'ecosystem.totalPopulation']].drop_duplicates()
        if len(pop_data) > 0:
            avg_pop = pop_data.groupby('ecosystem.currentZone')['ecosystem.totalPopulation'].mean()
            fig = px.bar(avg_pop, labels={'value': 'Población promedio'},
                        title="Población promedio de peces por zona")
            st.plotly_chart(fig, use_container_width=True)

# ═══════════════════════════════════════════════════════════
# TAB 4: ECONOMÍA
# ═══════════════════════════════════════════════════════════
with tab4:
    st.header("Análisis Económico")

    col1, col2 = st.columns(2)

    # Dinero ganado por día
    with col1:
        st.subheader("Dinero acumulado por día")
        day_summary = df_filtered[df_filtered['type'] == 'day_summary'].copy()
        if len(day_summary) > 0 and 'details.money_earned' in day_summary.columns:
            day_summary['details.money_earned'] = pd.to_numeric(day_summary['details.money_earned'], errors='coerce')
            daily_money = day_summary.dropna(subset=['details.money_earned']).groupby('gameDay')['details.money_earned'].sum()
            if len(daily_money) > 0:
                fig = px.bar(daily_money, labels={'value': 'Dinero ($)', 'index': 'Día'},
                            title="Dinero ganado por día")
                st.plotly_chart(fig, use_container_width=True)

    # Ventas por especie
    with col2:
        st.subheader("Ingresos por especie")
        sales = df_filtered[df_filtered['type'] == 'sale'].copy()
        if len(sales) > 0 and 'details.species' in sales.columns and 'details.value' in sales.columns:
            sales['details.value'] = pd.to_numeric(sales['details.value'], errors='coerce')
            species_revenue = sales.dropna(subset=['details.value']).groupby('details.species')['details.value'].sum().sort_values(ascending=True)
            if len(species_revenue) > 0:
                fig = px.barh(species_revenue, labels={'value': 'Ingresos ($)'},
                             title="Ingresos totales por especie")
                st.plotly_chart(fig, use_container_width=True)

    # Dinero por participante
    st.subheader("Estado económico por participante")
    if 'gameState.money' in df_filtered.columns:
        df_copy = df_filtered.copy()
        df_copy['gameState.money'] = pd.to_numeric(df_copy['gameState.money'], errors='coerce')
        final_money = df_copy.dropna(subset=['gameState.money']).drop_duplicates(subset=['sessionId'], keep='last').groupby('participantCode')['gameState.money'].mean()
        if len(final_money) > 0:
            fig = px.bar(final_money, labels={'value': 'Dinero final promedio ($)'},
                        title="Dinero final promedio por participante")
            fig.update_layout(showlegend=False)
            st.plotly_chart(fig, use_container_width=True)

    # Compras realizadas
    st.subheader("Compras más frecuentes")
    purchases = df_filtered[df_filtered['type'] == 'purchase'].copy()
    if len(purchases) > 0 and 'details.item_type' in purchases.columns:
        item_counts = purchases['details.item_type'].value_counts()
        fig = px.bar(item_counts, labels={'value': 'Cantidad', 'index': 'Tipo de item'},
                    title="Ítems comprados")
        fig.update_layout(showlegend=False)
        st.plotly_chart(fig, use_container_width=True)

# ═══════════════════════════════════════════════════════════
# TAB 5: COMPORTAMIENTO
# ═══════════════════════════════════════════════════════════
with tab5:
    st.header("Análisis de Comportamiento")

    # Métodos preferidos por participante
    st.subheader("Métodos de pesca por participante")
    catches = df_filtered[df_filtered['type'] == 'catch'].copy()
    if len(catches) > 0 and 'details.method' in catches.columns:
        method_heatmap = pd.crosstab(catches['participantCode'], catches['details.method'])
        fig = px.imshow(method_heatmap, labels=dict(x="Método", y="Participante", color="Usos"),
                       title="Matriz: Participante × Método de pesca")
        st.plotly_chart(fig, use_container_width=True)

    col1, col2 = st.columns(2)

    # Cambios de zona
    with col1:
        st.subheader("Cambios de zona")
        zone_changes = df_filtered[df_filtered['type'] == 'zone_change'].copy()
        if len(zone_changes) > 0:
            zone_count = zone_changes.groupby('participantCode').size()
            fig = px.bar(zone_count, labels={'value': 'Cambios de zona'},
                        title="Cambios de zona por participante")
            st.plotly_chart(fig, use_container_width=True)

    # Ratio miss/catch
    with col2:
        st.subheader("Ratio de éxito en pesca")
        all_attempts = df_filtered[df_filtered['type'].isin(['catch', 'fish_miss'])].copy()
        if len(all_attempts) > 0:
            success_rate = all_attempts.groupby('participantCode').apply(
                lambda x: (len(x[x['type'] == 'catch']) / len(x) * 100) if len(x) > 0 else 0
            )
            fig = px.bar(success_rate, labels={'value': 'Tasa de éxito (%)'},
                        title="Tasa de éxito en capturas por participante")
            st.plotly_chart(fig, use_container_width=True)

    # Zonas preferidas
    st.subheader("Zonas preferidas por participante")
    if len(catches) > 0 and 'details.zone' in catches.columns:
        zone_heatmap = pd.crosstab(catches['participantCode'], catches['details.zone'])
        fig = px.imshow(zone_heatmap, labels=dict(x="Zona", y="Participante", color="Capturas"),
                       title="Matriz: Participante × Zona de pesca")
        st.plotly_chart(fig, use_container_width=True)

# ═══════════════════════════════════════════════════════════
# TAB 6: VELOCIDAD DE DECISIONES
# ═══════════════════════════════════════════════════════════
with tab6:
    st.header("Velocidad de Toma de Decisiones")

    if 'timestamp' not in df_filtered.columns:
        st.warning("No hay datos de timestamp disponibles")
    else:
        # Calcular delta de tiempo entre eventos
        df_sorted = df_filtered.sort_values('timestamp').copy()
        df_sorted['delta_seconds'] = df_sorted.groupby('sessionId')['timestamp'].diff().dt.total_seconds()
        df_sorted['delta_minutes'] = df_sorted['delta_seconds'] / 60
        df_sorted['delta_minutes'] = pd.to_numeric(df_sorted['delta_minutes'], errors='coerce')

        col1, col2 = st.columns(2)

        # Histograma de tiempos
        with col1:
            st.subheader("Distribución de tiempos entre decisiones")
            valid_deltas = df_sorted[df_sorted['delta_minutes'].notna() & (df_sorted['delta_minutes'] > 0)]['delta_minutes']
            valid_deltas = valid_deltas[valid_deltas < valid_deltas.quantile(0.95)]  # Remover outliers
            fig = px.histogram(valid_deltas, nbins=50, labels={'value': 'Tiempo (minutos)'},
                             title="Histograma de tiempos entre acciones")
            st.plotly_chart(fig, use_container_width=True)

        # Box plot por participante
        with col2:
            st.subheader("Velocidad promedio por participante")
            valid_data = df_sorted[df_sorted['delta_minutes'].notna() & (df_sorted['delta_minutes'] > 0)].copy()
            avg_speed = valid_data.groupby('participantCode')['delta_minutes'].mean().sort_values()
            fig = px.bar(avg_speed, labels={'value': 'Tiempo promedio (minutos)'},
                        title="Tiempo promedio entre decisiones por participante")
            st.plotly_chart(fig, use_container_width=True)

        # Línea: velocidad por día
        st.subheader("Evolución de la velocidad de decisiones")
        daily_speed = df_sorted[df_sorted['delta_minutes'].notna() & (df_sorted['delta_minutes'] > 0)].groupby(
            ['sessionId', 'gameDay']
        )['delta_minutes'].mean().reset_index()
        fig = px.line(daily_speed, x='gameDay', y='delta_minutes', color='sessionId',
                     labels={'delta_minutes': 'Tiempo promedio (min)', 'gameDay': 'Día de juego'},
                     title="Velocidad de decisiones a lo largo del juego")
        st.plotly_chart(fig, use_container_width=True)

        # Estadísticas
        st.subheader("Estadísticas de velocidad")
        valid_deltas = df_sorted[df_sorted['delta_minutes'].notna() & (df_sorted['delta_minutes'] > 0)]['delta_minutes']
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric("⏱️ Mediana", f"{valid_deltas.median():.2f} min")
        with col2:
            st.metric("📊 Media", f"{valid_deltas.mean():.2f} min")
        with col3:
            st.metric("⬇️ Mín", f"{valid_deltas.min():.2f} min")
        with col4:
            st.metric("⬆️ Máx", f"{valid_deltas.quantile(0.95):.2f} min")

st.sidebar.divider()
st.sidebar.caption("Mar Vivo Dashboard v1.0 | Datos actualizados cada 5 minutos")
