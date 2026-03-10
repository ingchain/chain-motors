# Chain Motors - Fullstack Scaffold Ready for Render

Arquitectura fullstack para tienda virtual futurista/minimalista con:

- `Frontend`: Astro + React Islands + Tailwind
- `Backend`: FastAPI + MongoDB Atlas + JWT + roles
- `Deploy`: configurado con `render.yaml` (sin subir ni desplegar aun)

## Estructura

```txt
chain-motors/
	apps/
		api/
			app/
			requirements.txt
			.env.example
		web/
			src/
			package.json
			.env.example
	render.yaml
```

## Modulos incluidos

1. Landing + Catalogo
- Navegacion: Inicio, Servicios, Catalogo, Quienes Somos.
- Servicios premium con Astro Islands.
- Grid de catalogo dinamico consumiendo `products` desde FastAPI.

2. Autenticacion + Seguridad
- Registro/Login con validacion en React.
- JWT en backend con roles `client` y `admin`.
- Rutas privadas frontend por sesion local y guardias de rol.

3. Dashboards
- Cliente: ve estado de pedidos y citas.
- Admin: CRUD de inventario y cambio de estado de pedidos.

## Variables de entorno

### API (`apps/api/.env`)
Basado en `apps/api/.env.example`.

### Web (`apps/web/.env`)
Basado en `apps/web/.env.example`.

## Ejecucion local

### Arranque rapido (solo frontend)

```bash
npm start
```

Esto inicia Astro desde la raiz del repo en `http://127.0.0.1:4321`.

### Arranque rapido (frontend + backend)

```bash
npm run start:all
```

Esto levanta ambos servicios desde la raiz:
- Frontend: `http://127.0.0.1:4321`
- Backend: `http://127.0.0.1:8000`

### Backend

```bash
cd apps/api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd apps/web
npm install
npm run dev
```

## Listo para Render

- Archivo raiz `render.yaml` configurado para dos servicios:
	- `chain-motors-api`
	- `chain-motors-web`
- No se ha realizado despliegue.
