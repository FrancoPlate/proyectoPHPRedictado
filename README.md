---

# 📱 Proyecto "WhatsApi" — Mensajería Instantánea

Sistema de mensajería instantánea desarrollado como requerimiento académico. La plataforma permite la interacción en tiempo real entre usuarios registrados mediante chats individuales, personalización de conversaciones, restricciones de seguridad e integración con un usuario administrador.

Acá tenés la sección de **Estructura del Proyecto** maquetada para sumar directamente al `README.md`. Representa fielmente la arquitectura MVC/Backend que tenés en la carpeta `src` de tu imagen:

---

## 📁 Estructura del Proyecto (`src`)

```text
src/
├── controllers/    # Contiene la lógica de negocio y el procesamiento de peticiones HTTP
├── Middleware/     # Interceptores para autenticación (Bearer Token) y validaciones
├── models/         # Definición de esquemas, estructuras y consultas a la base de datos
└── routes/         # Definición de los endpoints y ruteo de la API REST

```

---

## 📌 Convenciones de Respuesta de la API

Todos los endpoints de la API REST responden respetando los siguientes códigos de estado HTTP y formatos de error:

| Código HTTP | Significado | Descripción |
| --- | --- | --- |
| **`200 OK`** | Exitoso | La solicitud se procesó correctamente y se devolvió la respuesta esperada. |
| **`400 Bad Request`** | Error de Cliente | Parámetros faltantes, valores inválidos o problemas de formato en el payload. |
| **`401 Unauthorized`** | No Autorizado | El usuario no posee credenciales o el token provisto es inválido / expiró. |
| **`404 Not Found`** | No Encontrado | El recurso solicitado no existe en la base de datos. |
| **`409 Conflict`** | Conflicto | Operación no permitida por regla de negocio o inconsistencia de datos. |

### ⚠️ Formato de Errores

Cuando una petición falla, los errores son devueltos dentro de un **array indexado por el nombre del campo que produjo el error**. Todos los mensajes son autoexplicativos para que el cliente pueda corregirlos:

```json
{
  "errors": {
    "username": "El username debe comenzar con @ y tener entre 5 y 12 caracteres.",
    "password": "La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial."
  }
}

```

---

## ⚙️ Reglas de Negocio del Sistema

* **Privacidad de Perfiles:** Al registrarse, todo perfil se crea por defecto con `es_publico = 0`.
* **Regla del Primer Mensaje:** Al iniciar una conversación previa entre dos usuarios, solo se puede enviar **un solo mensaje** hasta que el receptor responda o bloquee al emisor. Si responde, la conversación se considera aceptada.
* **Bloqueo Inreversible:** Si un chat es marcado como `esta_bloqueado = 1`, no se podrán enviar más mensajes bajo ninguna circunstancia y dicha acción no se puede revertir.
* **Sesión Interactiva:** La autenticación utiliza tokens temporales de **5 minutos**. Cada petición autorizada válida con el encabezado `Authorization: Bearer <token>` extiende la vigencia del token por **5 minutos adicionales**.
* **Chat de Administración:** El Administrador posee un chat persistente para atender solicitudes de "modificar password" o "dar de baja" (esta última elimina el usuario, sus chats y todo su historial de mensajes).

---

## 🚀 Documentación de Endpoints

### 🔐 Autenticación

#### `POST /login`

Inicia sesión en el sistema.

* **Cuerpo:** `username`, `password`
* **Respuesta:** Genera y devuelve un token temporal con vencimiento a 5 minutos.

#### `POST /logout`

Cierra la sesión activa.

* **Requiere:** Token Bearer.
* **Efecto:** Elimina el token activo y su fecha de expiración de la base de datos.

---

### 👤 Usuarios

#### `POST /usuarios`

Registro de un nuevo usuario en la plataforma (no requiere autenticación).

* **Validaciones:**
* `username`: Comienza con `@`, único, caracteres alfanuméricos (`a-z`, `A-Z`, `0-9`). Longitud: 5-12.
* `password`: Mínimo 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial. Longitud: 8-15.
* `nombre`: Solo letras y espacios. No vacío. Longitud: 2-50.
* `es_publico`: Se asigna en `0` automáticamente.



#### `GET /usuarios`

Lista los usuarios registrados según los filtros especificados en la URL.

* **Query Params (Opcionales):** `?search={s}&order={asc/desc}&limit={l}&offset={o}`
* **Comportamiento por Token:**
* **Sin token o inválido:** Retorna únicamente usuarios con perfil público (`es_publico = 1`).
* **Con token válido:** Retorna todos los usuarios excluyendo al usuario autenticado.


* **Datos Retornados:** `id`, `nombre`, `es_publico`, `is_admin`, `total_registros`. Si el usuario solicitante es Admin, incluye `cantidad_chats`.

#### `GET /usuarios/{user_id}`

Obtiene la información del perfil especificado.

* **Requiere:** Ser el propio usuario (`user_id`) o un usuario Administrador.
* **Datos Retornados:** `username`, `nombre`, `es_publico`.

#### `PUT /usuarios/{user_id}`

Modifica los datos del usuario especificado (Editar un usuario existente).


* **Requiere:** Ser el propio usuario (`user_id`) o un usuario Administrador.
* **Campos Modificables (Se deben enviar solo los datos a modificar):** `nombre`, `password`, `es_publico`.

#### `DELETE /usuarios/{user_id}`

Elimina a un usuario del sistema.

* **Requiere:** Rol de Administrador.
* **Efecto:** Elimina en cascada al usuario `user_id`, los chats en los que participó y todos los mensajes enviados/recibidos en dichos chats.

---

### 💬 Chats

#### `POST /chats/{user_id}`

Inicia un chat o envía un mensaje a una conversación existente.

* **Requiere:** Token Bearer.
* **Cuerpo:** `mensaje` (Longitud: 1-255 caracteres).
* **Flujo:**
* **Si no existe chat:** Crea la conversación asignando `creado_por = logueado`, `usuario_id = user_id`, nombre por defecto del destinatario y envía el mensaje inicial.
* **Si existe chat:** Registra el nuevo mensaje enviado por el usuario logueado.


* **Validaciones:**
* Si el chat solo tiene 1 mensaje, solo se permite enviar otro si el emisor original fue el otro usuario.
* Si `esta_bloqueado = 1`, rechaza el envío.



#### `GET /chats`

Obtiene la lista de conversaciones en las que participa el usuario logueado.

* **Requiere:** Token Bearer.
* **Ordenamiento:** Descendente por la fecha del último mensaje recibido o enviado.
* **Datos Retornados:** `id`, `nombre`, `descripcion`, `esta_bloqueado`, `creado_por`, `usuario_id`, `nombre_interlocutor`, `ultimo_mensaje`.

#### `PUT /chats/{user_id}`

Personaliza las propiedades de un chat determinado.

* **Requiere:** Token Bearer.
* **Validaciones de Campos:**
* `nombre`: Alfanumérico. Longitud: 3-15.
* `descripcion`: Alfanumérico. Longitud: 20-40.
* `color`: Código Hexadecimal (ej. `#FF5733`).
* `esta_bloqueado`: Boleano (`true`/`false`). *Una vez bloqueado, no puede revertirse.*



#### `GET /chats/{user_id}/historia/{quantity}`

Recupera el historial de mensajes de una conversación específica.

* **Requiere:** Token Bearer.
* **Parámetros:** `{quantity}` (máximo 10 mensajes, por defecto 5). Soporta el query param `?offset=x`.
* **Ordenamiento:** Del mensaje más antiguo al más reciente.
* **Datos Retornados:** `id`, `texto`, `fecha_creacion`, `enviado_por`.

---

### ✉️ Mensajes

#### `DELETE /mensajes/{message_id}`

Elimina un mensaje específico por su ID.

* **Requiere:** Token Bearer.
* **Validaciones y Permisos:**
1. El Administrador puede eliminar cualquier `message_id`.
2. Un usuario estándar solo puede eliminar mensajes donde él haya sido el emisor (`enviado_por`).
3. Retorna error si el `message_id` no existe.