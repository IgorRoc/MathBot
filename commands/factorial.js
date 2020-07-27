const Discord = require("discord.js")

function factorial(value) {
    if(value == 1){
        return 1
    }else{
        return value*factorial(value-1)
    }
}


module.exports.run = async (bot, message, args) => {
    const log = bot.guilds.cache.get('725691740538929225').channels.cache.get('725691977311453214')

    console.log(`\n■▶ [LOGS] ⇥ Usuário "${message.author.username}" usou o comando "Factorial" no server "${message.guild.name}"`)
    log.send(`\\▶ [LOGS] ⇥ Usuário \` ${message.author.username} \` usou o comando \` Factorial \` no server \` ${message.guild.name} \`\n`)

    if(!args){
        console.log(`↳ ⚠️  Usuário "${message.author.username}" não informou um valor.`)
        log.send(`↳ \\⚠️  Usuário \` ${message.author.username} \` não informou um valor.`)

        return message.channel.send("`❌` Enter some value for me to perform the factorial.\n> For more information, type ` +help factorial `")
    }
    if(args[1]){
        console.log(`↳ ⚠️  Usuário "${message.author.username}" indicou mais de 1 valor.`)
        log.send(`↳ \\⚠️  Usuário \` ${message.author.username} \` indicou mais de 1 valor.`)

        return message.channel.send("`❌` Enter only one value.\n> For more information, type ` +help factorial `")
    }

    let valor = args
    if(isNaN(valor)){
        console.log(`↳ ⚠️  Valor indicado por "${message.author.username}" não é um número.`)
        log.send(`↳ \\⚠️  Valor indicado por \` ${message.author.username} \` não é um número.`)

        return message.channel.send("`❌` The value entered is not a number.")
    }
    
    let resposta = factorial(valor)
    if(resposta){
        console.log(`↳ ✅ Operação finalizada!`)
        log.send(`↳ \\✅ Operação finalizada!`)

        return message.channel.send(`\`\`\`\n${valor}! = ${resposta}\`\`\``)
    }else{
        console.log(`↳ ⚠️  Não foi possível calcular o fatorial de ${valor}`)
        log.send(`↳ \\⚠️  Não foi possível calcular o fatorial de ${valor}`)

        return message.channel.send(`\`❌\` It was not possible to calculate the factorial of "${valor}"`)
    }
}


module.exports.config = {
    name: "factorial",
    description: "Calculates the factorial of the value!",
    usage: "+factorial [value]",
    accessableby: "Members",
    aliases: ["fac", "fat", "!", "fatorial"]
}