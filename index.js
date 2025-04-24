const { Client, GatewayIntentBits, PermissionsBitField, SlashCommandBuilder, REST, Routes } = require('discord.js');
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
    .setName('configrol')
    .setDescription('Configura un rol con una contraseña.')
    .addRoleOption(option => option.setName('role').setDescription('El rol a configurar').setRequired(true))
    .addStringOption(option => option.setName('password').setDescription('La contraseña del rol').setRequired(true)),
  new SlashCommandBuilder()
    .setName('addrol')
    .setDescription('Obtén un rol usando una contraseña.')
    .addStringOption(option => option.setName('password').setDescription('La contraseña del rol').setRequired(true)),
  new SlashCommandBuilder()
    .setName('seerol')
    .setDescription('Muestra todos los roles y sus contraseñas configuradas.'),
  new SlashCommandBuilder()
    .setName('delrol')
    .setDescription('Elimina un rol configurado.')
    .addStringOption(option => option.setName('password').setDescription('La contraseña del rol a eliminar').setRequired(true)),
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

  if (commandName === 'configrol') {
    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'No tienes permisos para usar este comando.', ephemeral: true });
    }

    const role = options.getRole('role');
    const password = options.getString('password');

    try {
      await db.addRole(guild.id, role.id, password);
      interaction.reply(`El rol **${role.name}** ha sido configurado con la contraseña.`);
    } catch (err) {
      interaction.reply({ content: `⚠️ La contraseña **${password}** ya está asociada a otro rol. Por favor, elige una contraseña diferente.`, ephemeral: true });
    }
  }

  if (commandName === 'addrol') {
    const password = options.getString('password');

    try {
      const roleData = await db.getRoleByPassword(guild.id, password);
      if (!roleData) {
        return interaction.reply({ content: 'Contraseña incorrecta o ya fue usada.', ephemeral: true });
      }

      const role = guild.roles.cache.get(roleData.role_id);
      if (!role) {
        return interaction.reply({ content: 'El rol asociado a esta contraseña no existe.', ephemeral: true });
      }

      await member.roles.add(role);
      await db.deleteRoleByPassword(guild.id, password);

      interaction.reply(`¡Has recibido el rol **${role.name}**!`);
    } catch (err) {
      interaction.reply({ content: 'Error al asignar el rol: ' + err.message, ephemeral: true });
    }
  }

  if (commandName === 'seerol') {
    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'No tienes permisos para usar este comando.', ephemeral: true });
    }

    try {
      const roles = await db.getAllRoles(guild.id);
      if (roles.length === 0) {
        return interaction.reply('No hay roles configurados en este servidor.');
      }

      const roleList = roles.map(r => `Rol: <@&${r.role_id}> - Contraseña: ${r.password}`).join('\n');
      interaction.reply(`Roles configurados:\n${roleList}`);
    } catch (err) {
      interaction.reply({ content: 'Error al obtener los roles: ' + err.message, ephemeral: true });
    }
  }

  if (commandName === 'delrol') {
    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'No tienes permisos para usar este comando.', ephemeral: true });
    }

    const password = options.getString('password');

    try {
      await db.deleteRoleByPassword(guild.id, password);
      interaction.reply('El rol ha sido eliminado correctamente.');
    } catch (err) {
      interaction.reply({ content: 'Error al eliminar el rol: ' + err.message, ephemeral: true });
    }
  }
});

client.on('guildCreate', async (guild) => {
  console.log(`Bot añadido al servidor: ${guild.name}`);
});

client.login(TOKEN);
