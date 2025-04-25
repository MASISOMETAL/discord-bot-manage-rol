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

### **6. /groupconfigsee**
- **Descripción:** Permite al administrador ver todos los grupos configurados.
- **Parámetros:** Sin parámetros.
- **Restricciones:** Solo administradores pueden ejecutarlo.

---

### **7. /groupconfigdel**
- **Descripción:** Permite al administrador eliminar un grupo configurado basado en el master role.
- **Parámetros:**
  - `master_role` (Role): Rol maestro que deseas eliminar.
- **Restricciones:** Solo administradores pueden ejecutarlo.

---

### **8. /setgrouprol**
- **Descripción:** Asigna un password único a un rol maestro.
- **Parámetros:**
  - `master_role` (Role): Rol maestro al que se asignará el password.
  - `password` (String): Contraseña única para este rol maestro.
- **Restricciones:** Solo usuarios con el rol maestro indicado pueden ejecutarlo.

---

### **9. /joingrouprol**
- **Descripción:** Usa un password para obtener un rol asignable.
- **Parámetros:**
  - `password` (String): Contraseña del rol asignable.
- **Restricciones:** Accesible para todos los usuarios.

---

### **10. /seegrouprol**
- **Descripción:** Muestra los passwords asociados a un rol maestro del usuario.
- **Parámetros:**
  - `master_role` (Role): Rol maestro cuyos passwords quieres ver.
- **Restricciones:** Solo usuarios que posean el rol maestro indicado pueden ejecutarlo.

---

### **11. /delgrouprol**
- **Descripción:** Elimina un password asociado a un rol maestro.
- **Parámetros:**
  - `password` (String): Contraseña que deseas eliminar.
- **Restricciones:** Solo usuarios con el rol maestro asociado al password pueden ejecutarlo.

---

### **12. /managerolinfo**
- **Descripción:** Proporciona información sobre los comandos de gestión de roles.
- **Parámetros:** Sin parámetros.
- **Restricciones:** Accesible para todos los usuarios.

## IMPORTANTE

Recuerde siempre poner el bot por arriba de los roles que van a afectar

### Link al bot
[Obten el Bot en tu server](https://discord.com/oauth2/authorize?client_id=1364981410200424520&permissions=268453888&integration_type=0&scope=bot+applications.commands)

Gracias por usarme