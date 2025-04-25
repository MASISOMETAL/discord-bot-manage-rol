const { Client, GatewayIntentBits, PermissionsBitField, SlashCommandBuilder, REST, Routes, MessageFlags } = require('discord.js');
const db = require('./database.js');
require('dotenv').config()

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.APP_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// comandos
const commands = [
  new SlashCommandBuilder()
    .setName('setrol')
    .setDescription('Configura un rol con una contraseña.')
    .addRoleOption(option => option.setName('role').setDescription('El rol a configurar').setRequired(true))
    .addStringOption(option => option.setName('password').setDescription('La contraseña del rol').setRequired(true)),
  new SlashCommandBuilder()
    .setName('joinrol')
    .setDescription('Obtén un rol usando una contraseña.')
    .addStringOption(option => option.setName('password').setDescription('La contraseña del rol').setRequired(true)),
  new SlashCommandBuilder()
    .setName('seerol')
    .setDescription('Muestra todos los roles y sus contraseñas configuradas.'),
  new SlashCommandBuilder()
    .setName('delrol')
    .setDescription('Elimina un rol configurado.')
    .addStringOption(option => option.setName('password').setDescription('La contraseña del rol a eliminar').setRequired(true)),
  // nueva seccion de comandos de grupo
  new SlashCommandBuilder()
    .setName('groupconfig')
    .setDescription('Configura un rol maestro y un rol asignable.')
    .addRoleOption(option => option.setName('master_role').setDescription('El rol maestro').setRequired(true))
    .addRoleOption(option => option.setName('assignable_role').setDescription('El rol asignable').setRequired(true)),
  new SlashCommandBuilder()
    .setName('setgrouprol')
    .setDescription('Asigna un password a un rol maestro.')
    .addRoleOption(option =>
      option.setName('master_role')
        .setDescription('El rol maestro al que se le asignará un password.')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('password')
        .setDescription('El password único para el rol maestro.')
        .setRequired(true)),
  new SlashCommandBuilder()
    .setName('joingrouprol')
    .setDescription('Usa un password para obtener un rol asignable.')
    .addStringOption(option =>
      option.setName('password')
        .setDescription('El password del rol asignable.')
        .setRequired(true)),
  new SlashCommandBuilder()
    .setName('seegrouprol')
    .setDescription('Muestra los passwords asociados a tus roles maestro.')
    .addRoleOption(option =>
      option.setName("master_role")
        .setDescription('El rol maestro al que quiere ver sus passwords.')
        .setRequired(true)),
  new SlashCommandBuilder()
    .setName('delgrouprol')
    .setDescription('Elimina un password asociado a un rol maestro.')
    .addStringOption(option =>
      option.setName('password')
        .setDescription('El password que deseas eliminar.')
        .setRequired(true)),
  new SlashCommandBuilder()
    .setName('managerolinfo')
    .setDescription('Proporciona información sobre los comandos de gestión de roles.'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Registrando comandos...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('¡Comandos registrados con éxito!');
  } catch (error) {
    console.error(error);
  }
})();

// interaccion
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options, guild, member } = interaction;

  if (commandName === 'managerolinfo') {
    // Mensaje de información
    const embed = {
      color: 0x0099ff,
      title: 'Información de Comandos',
      description: 'Detalles de los comandos de gestión de roles disponibles:',
      fields: [
        {
          name: '**/setrol**',
          value: 'Configura un rol con una contraseña.\n*Parámetros:*\n- `role`: El rol que será configurado.\n- `password`: Contraseña asociada al rol.\n**Solo administradores.**',
        },
        {
          name: '**/joinrol**',
          value: 'Obtén un rol usando una contraseña.\n*Parámetros:*\n- `password`: Contraseña del rol que se desea obtener.',
        },
        {
          name: '**/seerol**',
          value: 'Muestra todos los roles y sus contraseñas configuradas en el servidor.\n*Sin parámetros.*\n**Solo administradores.**',
        },
        {
          name: '**/delrol**',
          value: 'Elimina un rol configurado.\n*Parámetros:*\n- `password`: Contraseña asociada al rol que deseas eliminar.\n**Solo administradores.**',
        },
        {
          name: '**/groupconfig**',
          value: 'Configura un rol maestro y un rol asignable.\n*Parámetros:*\n- `master_role`: Rol maestro.\n- `assignable_role`: Rol asignable.\n**Solo administradores.**',
        },
        {
          name: '**/setgrouprol**',
          value: 'Asigna un password único a un rol maestro.\n*Parámetros:*\n- `master_role`: Rol maestro.\n- `password`: Contraseña única.',
        },
        {
          name: '**/joingrouprol**',
          value: 'Usa un password para obtener un rol asignable.\n*Parámetros:*\n- `password`: Contraseña del rol asignable.',
        },
        {
          name: '**/seegrouprol**',
          value: 'Muestra los passwords asociados a un rol maestro del usuario.\n*Parámetros:*\n- `master_role`: Rol maestro cuyos passwords quieres ver.',
        },
        {
          name: '**/delgrouprol**',
          value: 'Elimina un password asociado a un rol maestro.\n*Parámetros:*\n- `password`: Contraseña que deseas eliminar.',
        },
        {
          name: '**/managerolinfo**',
          value: 'Proporciona información sobre los comandos de gestión de roles.\n*Sin parámetros.*',
        },
      ],
    };

    // Enviar el mensaje al usuario
    interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral
    });
  }


  if (commandName === 'setrol') {
    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'No tienes permisos para usar este comando.', flags: MessageFlags.Ephemeral });
    }

    const role = options.getRole('role');
    const password = options.getString('password');

    try {
      await db.addRole(guild.id, role.id, password);
      interaction.reply({content: `El rol **${role.name}** ha sido configurado con la contraseña.`, flags: MessageFlags.Ephemeral });
    } catch (err) {
      interaction.reply({ content: `⚠️ La contraseña **${password}** ya está asociada a otro rol. Por favor, elige una contraseña diferente.`, flags: MessageFlags.Ephemeral });
    }
  }

  if (commandName === 'joinrol') {
    const password = options.getString('password');

    try {
      const roleData = await db.getRoleByPassword(guild.id, password);
      if (!roleData) {
        return interaction.reply({ content: 'Contraseña incorrecta o ya fue usada.', flags: MessageFlags.Ephemeral });
      }

      const role = guild.roles.cache.get(roleData.role_id);
      if (!role) {
        return interaction.reply({ content: 'El rol asociado a esta contraseña no existe.', flags: MessageFlags.Ephemeral });
      }

      await member.roles.add(role);
      await db.deleteRoleByPassword(guild.id, password);

      interaction.reply({ content: `¡Has recibido el rol **${role.name}**!`, flags: MessageFlags.Ephemeral });
    } catch (err) {
      interaction.reply({ content: 'Error al asignar el rol: ' + err.message, flags: MessageFlags.Ephemeral });
    }
  }

  if (commandName === 'seerol') {
    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'No tienes permisos para usar este comando.', flags: MessageFlags.Ephemeral });
    }

    try {
      const roles = await db.getAllRoles(guild.id);
      if (roles.length === 0) {
        return interaction.reply({ content: 'No hay roles configurados en este servidor.', flags: MessageFlags.Ephemeral });
      }

      const roleList = roles.map(r => `Rol: <@&${r.role_id}> - Contraseña: ${r.password}`).join('\n');
      interaction.reply({content: `Roles configurados:\n${roleList}`, flags: MessageFlags.Ephemeral });
    } catch (err) {
      interaction.reply({ content: 'Error al obtener los roles: ' + err.message, flags: MessageFlags.Ephemeral });
    }
  }

  if (commandName === 'delrol') {
    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'No tienes permisos para usar este comando.', flags: MessageFlags.Ephemeral });
    }

    const password = options.getString('password');

    try {
      await db.deleteRoleByPassword(guild.id, password);
      interaction.reply({content: 'El rol ha sido eliminado correctamente.', flags: MessageFlags.Ephemeral});
    } catch (err) {
      interaction.reply({ content: 'Error al eliminar el rol: ' + err.message, flags: MessageFlags.Ephemeral });
    }
  }

  // nueva funcionabilidad grupos

  if (commandName === 'groupconfig') {
    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'No tienes permisos para usar este comando.', flags: MessageFlags.Ephemeral });
    }

    const masterRole = options.getRole('master_role');
    const assignableRole = options.getRole('assignable_role');

    try {
      await db.addGroupRole(guild.id, masterRole.id, assignableRole.id);
      interaction.reply({content: `Roles configurados:\n- Maestro: **${masterRole.name}**\n- Asignable: **${assignableRole.name}**`, flags: MessageFlags.Ephemeral});
    } catch (err) {
      interaction.reply({ content: 'Error al configurar los roles: ' + err.message, flags: MessageFlags.Ephemeral });
    }
  }

  if (commandName === 'setgrouprol') {
    // Obtener los inputs del usuario
    const masterRoleInput = options.getRole('master_role');
    const password = options.getString('password');

    try {
      // Verificar si el usuario tiene el rol maestro ingresado
      const hasMasterRole = member.roles.cache.some(role => role.id === masterRoleInput.id);
      if (!hasMasterRole) {
        return interaction.reply({
          content: 'No tienes el rol maestro requerido para usar este comando.',
          flags: MessageFlags.Ephemeral
        });
      }

      // Verificar si el rol ingresado está configurado en la tabla group_roles
      const roleInDatabase = await db.getMasterRolePasswords(guild.id, masterRoleInput.id);
      if (!roleInDatabase) {
        return interaction.reply({
          content: 'El rol ingresado no está configurado como un rol maestro.',
          flags: MessageFlags.Ephemeral
        });
      }

      // Crear el password para el rol maestro
      await db.createPassword(guild.id, masterRoleInput.id, password);
      interaction.reply({content: `Password asignado exitosamente al rol maestro **${masterRoleInput.name}**: **${password}**`, flags: MessageFlags.Ephemeral});
    } catch (err) {
      // Manejo de errores
      interaction.reply({
        content: 'Error al generar el password: ' + err.message,
        flags: MessageFlags.Ephemeral
      });
    }
  }


  if (commandName === 'joingrouprol') {
    const password = options.getString('password');

    try {
      const roleData = await db.getRoleByPasswordGroup(guild.id, password);
      console.log(roleData);


      const assignableRole = guild.roles.cache.get(roleData.assignable_role_id);
      if (!assignableRole) {
        return interaction.reply({ content: 'El rol asociado no existe.', flags: MessageFlags.Ephemeral });
      }

      await member.roles.add(assignableRole);
      await db.deletePassword(guild.id, roleData.master_role_id, password);
      interaction.reply({content: `¡Has recibido el rol **${assignableRole.name}**!`, flags: MessageFlags.Ephemeral});
    } catch (err) {
      interaction.reply({ content: 'Password inválido.', flags: MessageFlags.Ephemeral });
    }
  }

  if (commandName === 'seegrouprol') {
    const masterRoleInput = options.getRole('master_role');

    const hasMasterRole = member.roles.cache.some(role => role.id === masterRoleInput.id);

    if (!hasMasterRole) {
      return interaction.reply({
        content: 'No tienes el rol maestro requerido para usar este comando.',
        flags: MessageFlags.Ephemeral
      });
    }

    try {
      const passwords = await db.getMasterRolePasswords(guild.id, masterRoleInput.id);
      if (!passwords.length) {
        return interaction.reply({content: 'No hay passwords configurados.', flags: MessageFlags.Ephemeral});
      }

      const passwordList = passwords.map(p => `Password: ${p.password}`).join('\n');
      interaction.reply({content: `Passwords configurados:\n${passwordList}`, flags: MessageFlags.Ephemeral});
    } catch (err) {
      interaction.reply({ content: 'Error al obtener los passwords: ' + err.message, flags: MessageFlags.Ephemeral });
    }
  }

  if (commandName === 'delgrouprol') {
    const password = options.getString('password');

    try {
      // Obtener el rol maestro asociado al password
      const roleData = await db.getRoleByPasswordGroup(guild.id, password);

      if (!roleData) {
        return interaction.reply({
          content: 'Password inválido o no existe.',
          flags: MessageFlags.Ephemeral
        });
      }

      // Verificar si el usuario tiene el rol maestro asociado
      const hasMasterRole = member.roles.cache.some(role => role.id === roleData.master_role_id);

      if (!hasMasterRole) {
        return interaction.reply({
          content: 'No tienes el rol maestro requerido para eliminar este password.',
          flags: MessageFlags.Ephemeral
        });
      }

      // Eliminar el registro del password
      await db.deletePassword(guild.id, roleData.master_role_id, password);
      interaction.reply({content: 'Password eliminado correctamente.', flags: MessageFlags.Ephemeral});
    } catch (err) {
      interaction.reply({
        content: 'Error al eliminar el password: ' + err.message,
        flags: MessageFlags.Ephemeral
      });
    }
  }

});

client.on('guildCreate', async (guild) => {
  console.log(`Bot añadido al servidor: ${guild.name}`);
});

client.login(TOKEN);

// dummy server
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('El bot está funcionando.\n');
});

// Configurar el puerto
const PORT = process.env.PORT || 2400;
server.listen(PORT, () => {
  console.log(`Servidor web nativo corriendo en el puerto ${PORT}`);
});