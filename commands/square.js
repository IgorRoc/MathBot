const Discord = require("discord.js")

const pi = '3.14159265359'


module.exports.run = async (bot, message, args) => {
    const log = bot.guilds.cache.get('725691740538929225').channels.cache.get('725691977311453214')

    console.log(`\n■▶ [LOGS] ⇥ Usuário "${message.author.username}" usou o comando "Square" no server "${message.guild.name}"`)
    log.send(`\\▶️ [LOGS] ⇥ Usuário \` ${message.author.username} \` usou o comando \` Square \` no server \` ${message.guild.name} \`\n`)
    
    let valor = args.toString().replace(/pi|π/gm, pi).replace(/,/gm, "")
    
    if(!valor){
        console.log(`↳ ⚠️ Usuário "${message.author.username}" não informou um valor.`)
        log.send(`↳ \\⚠️  Usuário \` ${message.author.username} \` não informou um valor.`)
        return message.channel.send("`❌` Enter some value for me to perform the square root.\n> For more information, type ` +help square `")
    }
    if(valor.search(/[^0-9]/gm) > -1){
        if(valor.match(/[.]/g)||[].length > 1){
            console.log(`↳ ⚠️ Usuário "${message.author.username}" digitou mais de um "."`)
            log.send(`↳ \\⚠️  Usuário \` ${message.author.username} \` digitou mais de um \` . \``)
            return message.channel.send("`❌` Enter only one ` . `")
        }else if(valor.match(/[.]/gm)||[].length == 1){
            // ok apenas um "."
        }else{
            console.log(`↳ ⚠️ Usuário "${message.author.username}" digitou algum caractere.`)
            log.send(`↳ \\⚠️  Usuário \` ${message.author.username} \` digitou algum caractere.`)
            return message.channel.send("`❌` Enter numbers only.")
        }
    }

    let resultado
    try {
        resultado = Math.sqrt(valor)
    } catch (error) {
        console.log(`↳ ⚠️  Erro ao calcular raiz de "${valor}" `)
        log.send(`↳ \\⚠️  Erro ao calcular raiz de \` ${valor} \`.`)
        return message.channel.send("`❌` Error calculating the square root, try again")
    }

    message.channel.send(`\`\`\`\n√(${valor}) = ${resultado}\n\`\`\``)
    console.log(`↳ ✅ Operação finalizada!`)
    log.send(`↳ \\✅ Operação finalizada!`)
}


module.exports.config = {
    name: "square",
    description: "Tells the square root of the value!",
    usage: "+square [value]",
    accessableby: "Members",
    aliases: ["sq", "raiz", "√"]
}