# DiscordBot - Gestor de roles por password

![](https://img.shields.io/github/stars/MASISOMETAL/discord-bot-manage-rol.svg) ![](https://img.shields.io/github/forks/MASISOMETAL/discord-bot-manage-rol.svg) ![](https://img.shields.io/github/tag/MASISOMETAL/discord-bot-manage-rol.svg) ![](https://img.shields.io/github/release/MASISOMETAL/discord-bot-manage-rol.svg) ![](https://img.shields.io/github/issues/MASISOMETAL/discord-bot-manage-rol.svg) !


## Caracteristicas

- Asignar uno o mas passwords para un rol especifico
- Ver todos los passwords que el bot gestiona
- Borrar passwords por rol
- Cualquier usuario puede obtener un rol poniendo el password adecuado
- Cada vez que un usuario usa un password, este se elimina

## Especificaciones

- Siempre se debe tener este bot por encima de todos los roles con los que se van a trabajar
- comando **groupconfig**: Debes tener dos roles, un rol considerado "master_role" que solo lo tendrá aquel usuario que gestionará su propio grupo, y el rol considerado "assignable_role" que será el rol que va a ser asignado a todos los usuarios que pongan el password generado por el dueño del grupo (el master_role)

## Lista de comandos

### **1. /setrol**
- **Descripción:** Configura un rol con una contraseña.
- **Parámetros:**
  - `role` (Role): El rol que será configurado.
  - `password` (String): Contraseña asociada al rol.
- **Restricciones:** Solo administradores pueden ejecutarlo.

---

### **2. /joinrol**
- **Descripción:** Obtén un rol usando una contraseña.
- **Parámetros:**
  - `password` (String): Contraseña del rol que se desea obtener.
- **Restricciones:** Accesible para todos los usuarios.

---

### **3. /seerol**
- **Descripción:** Muestra todos los roles y sus contraseñas configuradas en el servidor.
- **Parámetros:** Sin parámetros.
- **Restricciones:** Solo administradores pueden ejecutarlo.

---

### **4. /delrol**
- **Descripción:** Elimina un rol configurado.
- **Parámetros:**
  - `password` (String): Contraseña asociada al rol que deseas eliminar.
- **Restricciones:** Solo administradores pueden ejecutarlo.

---

### **5. /groupconfig**
- **Descripción:** Configura un rol maestro y un rol asignable.
- **Parámetros:**
  - `master_role` (Role): Rol maestro que puede gestionar passwords.
  - `assignable_role` (Role): Rol asignable al usar un password generado.
- **Restricciones:** Solo administradores pueden ejecutarlo.

---

### **6. /setgrouprol**
- **Descripción:** Asigna un password único a un rol maestro.
- **Parámetros:**
  - `master_role` (Role): Rol maestro al que se asignará el password.
  - `password` (String): Contraseña única para este rol maestro.
- **Restricciones:** Solo usuarios con el rol maestro indicado pueden ejecutarlo.

---

### **7. /joingrouprol**
- **Descripción:** Usa un password para obtener un rol asignable.
- **Parámetros:**
  - `password` (String): Contraseña del rol asignable.
- **Restricciones:** Accesible para todos los usuarios.

---

### **8. /seegrouprol**
- **Descripción:** Muestra los passwords asociados a un rol maestro del usuario.
- **Parámetros:**
  - `master_role` (Role): Rol maestro cuyos passwords quieres ver.
- **Restricciones:** Solo usuarios que posean el rol maestro indicado pueden ejecutarlo.

---

### **9. /delgrouprol**
- **Descripción:** Elimina un password asociado a un rol maestro.
- **Parámetros:**
  - `password` (String): Contraseña que deseas eliminar.
- **Restricciones:** Solo usuarios con el rol maestro asociado al password pueden ejecutarlo.

---

### **10. /managerolinfo**
- **Descripción:** Proporciona información sobre los comandos de gestión de roles.
- **Parámetros:** Sin parámetros.
- **Restricciones:** Accesible para todos los usuarios.

## IMPORTANTE

Recuerde siempre poner el bot por arriba de los roles que van a afectar

### Link al bot
[Obten el Bot en tu server](https://discord.com/oauth2/authorize?client_id=1364981410200424520&permissions=268453888&integration_type=0&scope=bot+applications.commands)

- /setgrouprol: (solo habilitado para admines) este comando debe tener 2 inputs, ambos inputs debe aceptar roles, que se van a guardar en sqlite3, el primer rol, va a ser el rol maestro por asi decirlo, y el segundo rol, va a ser el rol que este rol maestro pueda asignar

/grouprol: (este comando solo puede activarlos los que tengan el rol maestro, o sea, debe buscar en la bd si el rol está ahi) y debe permitir poner 1 input, este input va a permitir un password, que se va a guardar en la base de datos, el password debe ser unico entre todos los setgrouprol

/addgroup: este rol, lo deben poder usar cualquier usuario, y debe permitir poner un password, si este password coincide con algunos de todos los passwords guardado en la base de datos, entonces le asigna el segundo rol que se configuro en setgrouprol

/seegrouprol: solo el que tiene el master rol puede ver los passwords creados

/delgrouprol: solo el que tiene el masterrol puede borrar los password creados