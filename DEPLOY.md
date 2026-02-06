# Guía de Despliegue: Welfi Web en Google Cloud Run

Como tu entorno local no tiene las herramientas de nube instaladas, aquí tienes los pasos para desplegar tu aplicación en Google Cloud Run.

## Opción 1: Usando Google Cloud Console (La más fácil si no tienes CLI)

1.  **Subir código**: Sube tu carpeta del proyecto (asegúrate de incluir el `Dockerfile` y `nginx.conf`) a un repositorio (GitHub, GitLab, o Google Cloud Source Repositories).
2.  **Ir a Cloud Run**: Entra a la consola de Google Cloud y busca "Cloud Run".
3.  **Crear servicio**:
    *   Haz clic en "CREAR SERVICIO".
    *   Selecciona "Implementar continuamente desde un repositorio".
    *   Conecta tu repositorio y selecciona la rama (branch) donde está tu código.
    *   Elige "Dockerfile" como tipo de compilación.
4.  **Configuración**:
    *   **Región**: `us-central1` (o la que prefieras).
    *   **Autenticación**: Selecciona "Permitir invocaciones sin autenticar" (para que sea público).
    *   **Puerto**: Asegúrate de que el puerto del contenedor sea `8080`.
5.  **Crear**: Haz clic en Crear. Google Cloud construirá tu Dockerfile y desplegará la app automáticamente.

## Opción 2: Usando Cloud Shell (Terminal en el navegador)

Si prefieres usar comandos sin instalar nada en tu PC:

1.  Entra a [Google Cloud Shell](https://shell.cloud.google.com/).
2.  Sube tus archivos o clona tu repositorio.
3.  Ejecuta el siguiente comando para construir y subir la imagen:

    ```bash
    gcloud builds submit --tag gcr.io/[TU-PROJECT-ID]/welfi-web
    ```
    *(Reemplaza `[TU-PROJECT-ID]` por el ID de tu proyecto)*

4.  Despliega en Cloud Run:

    ```bash
    gcloud run deploy welfi-web \
      --image gcr.io/[TU-PROJECT-ID]/welfi-web \
      --platform managed \
      --region us-central1 \
      --allow-unauthenticated
    ```

## Archivos Creados
He generado dos archivos clave para que esto funcione:
*   **`Dockerfile`**: Instrucciones para empaquetar tu app React con Nginx.
*   **`nginx.conf`**: Configuración del servidor web para manejar las rutas de la app.
