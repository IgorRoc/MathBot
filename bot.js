const Discord = require("discord.js")
const bot = new Discord.Client()

const config = require("./config.json")

const fs = require("fs")
bot.commands = new Discord.Collection()
bot.aliases = new Discord.Collection()

const falouRecentemente = new Set()

const DBL = require("dblapi.js")
const dbl = new DBL(
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcyNTMxOTg1MDgwODk2NzE5OCIsImJvdCI6dHJ1ZSwiaWF0IjoxNTk1ODE4NzY1fQ.jgrFRj0rlpazJt2f7-t3zZbFkJ81bzoe58mQMls50Ow",
	{ statsInterval: 18000000 },
	bot
)

let loading = "<a:loading:722456385098481735>"

// Optional events
dbl.on("error", (e) => {
	console.log(`Oops! ${e}`)
})

fs.readdir("./commands/", (err, files) => {
	if (err) console.log(err)

	let jsfile = files.filter((f) => f.split(".").pop() === "js") // Pega todos os nomes dos comandos da pasta "./commands/" e remove o '.js'
	if (jsfile.length <= 0) {
		return console.log(
			"[STARTING] ⇥ ❌ Não foi possível encontrar comandos!"
		)
	}

	jsfile.forEach((f, i) => {
		let pull = require(`./commands/${f}`) // Importa cada arquivo
		bot.commands.set(pull.config.name, pull) // Coloca o nome dele na Collection
		console.log(
			`\n■▶ [STARTING] ⇥ Comando '${pull.config.name}' inicializado com sucesso`
		)
		pull.config.aliases.forEach((alias) => {
			bot.aliases.set(alias, pull.config.name) // Coloca a variação dele na Collection
			console.log(`↳ Variação '${alias}' adicionada`)
		})
	})
})

bot.once("ready", () => {
	let mensagem = `■ Bot foi iniciado em ${bot.guilds.cache.size} servidor(es) ■`
	let barra = ""

	for (let i = 0; i < mensagem.length; i++) {
		barra = barra + "■"
	}

	console.log(barra)
	console.log(mensagem)
	console.log(barra + "\n\n")

	const log = bot.guilds.cache
		.get("725691740538929225")
		.channels.cache.get("725691977311453214")

	let reload = log
		.send(`${loading} Reiniciando...`)
		.then(async (m1) => {
			await m1
				.edit(`✅ Reiniciado! <@580722395766194176>`)
				.catch(() => console.log(`↳ ⚠️ Erro ao editar a mensagem`))
		})
		.catch(() => console.log(`↳ ⚠️ Erro ao editar a mensagem`))

	let starting = log
		.send(`${loading}`)
		.then(async (m2) => {
			await m2
				.edit(
					`🔽╰(\\*°▽°\\*)╯🔽\n\\✅ Bot iniciado em ${bot.guilds.cache.size} servidor(es)`
				)
				.catch(() => console.log(`↳ ⚠️ Erro ao editar a mensagem`))
		})
		.catch(() => console.log(`↳ ⚠️ Erro ao editar a mensagem`))

	bot.user.setActivity(`${config.prefix}help | Created by @igor.roc`, {
		type: "WATCHING",
	})

	let commands = bot.guilds.cache
		.get("725691740538929225")
		.channels.cache.get("842347902726176768")
	commands.setName(`🔧▏ Commands: ${bot.commands.size}`)

	let servers = bot.guilds.cache
		.get("725691740538929225")
		.channels.cache.get("842346193787027496")
	servers.setName(`🤖▏ Servers: ${bot.guilds.cache.size}`)
})

bot.once("guildCreate", async (server) => {
	const log = bot.guilds.cache
		.get("725691740538929225")
		.channels.cache.get("725691977311453214")

	console.log(
		`\n■▶ [LOGS] ✅ ⇥ Bot adicionado ao servidor '${server.name}'`
	)
	await log.send(
		`\\▶ [LOGS] ✅ ⇥ Bot adicionado ao servidor \` ${server.name} \`\n> Total: ${bot.guilds.cache.size}\n`
	)

	let servers = bot.guilds.cache
		.get("725691740538929225")
		.channels.cache.get("842346193787027496")
	servers.setName(`🤖▏ Servers: ${bot.guilds.cache.size}`)
})

bot.once("guildDelete", async (server) => {
	const log = bot.guilds.cache
		.get("725691740538929225")
		.channels.cache.get("725691977311453214")

	console.log(
		`\n■▶ [LOGS] ❌ ⇥ Bot removido do servidor '${server.name}'`
	)
	await log.send(
		`\\▶ [LOGS] ❌ ⇥ Bot removido do servidor \` ${server.name} \`\n> Total: ${bot.guilds.cache.size}\n`
	)

	let servers = bot.guilds.cache
		.get("725691740538929225")
		.channels.cache.get("842346193787027496")
	servers.setName(`🤖▏ Servers: ${bot.guilds.cache.size}`)
})

bot.on("message", async (message) => {
	const log = bot.guilds.cache
		.get("725691740538929225")
		.channels.cache.get("725691977311453214")

	if (message.author.bot) return // Se o autor foi um bot, faz nada
	if (message.channel.type == "dm")
		return message.channel.send("I don't answer here...") // Se a mensagem foi enviada por dm, não continua o código

	let prefix = config.prefix
	let messageArray = message.content.split(" ")
	let comando = messageArray[0].slice(prefix.length)
	let args = messageArray.slice(1)

	if (!message.content.startsWith(prefix)) return // Valida o prefix do comando

	let m = await message.channel.send(loading)
	if (falouRecentemente.has(message.author.id)) {
		await m
			.edit("Wait 5 seconds until sending another command.")
			.then(async (n) => {
				await n
					.delete({ timeout: 3000 })
					.catch(() => console.log(`↳ ⚠️ Erro ao deletar a mensagem`))
			})
	} else {
		await m.delete()
		let commandfile =
			bot.commands.get(comando) ||
			bot.commands.get(bot.aliases.get(comando)) // Pega o comando escrito no arquivo de comandos
		if (commandfile) commandfile.run(bot, message, args)
		// Verifica se o comando existe
		else {
			message.channel.send(
				`\`❌\` Command \`${comando}\` not found.\nUse \` ${config.prefix}help \` to see commands.`
			)
			console.log(`\n❌ Comando '${comando}' não encontrado`)
			log.send(
				`\\▶ [LOGS] ⇥ \`❌\` Comando \` ${comando} \` não encontrado pelo usuário \` ${message.author.username} \` no server \` ${message.guild.name} \`\n`
			)
		}

		if (message.author.id != "580722395766194176") { // Adiciona um timer para todos os usuarios, exceto eu!
			falouRecentemente.add(message.author.id)
			setTimeout(() => {
				falouRecentemente.delete(message.author.id)
			}, 5000)
		}
	}
})

bot.login(config.token)
