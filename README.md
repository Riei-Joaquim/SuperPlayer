
# SuperPlayer
* Plataforma web para conectar jogadores experientes e novatos que querem melhorar suas habilidades em um jogo, voltado principalmente a organização do contato entre jogadores para a disseminação de conhecimento para o cenário de eSports e jogos multiplayer.

* O projeto da aplicação está disponivel para uso online, podendo ser acessada pelo [link](https://super-player-ess.herokuapp.com/)

# Quick Start
## Clone Esse repositorio
## Setup
### Dependencias:
- [Node.js](https://nodejs.org/en/download/) instalado na maquina
### Configuração:
- Crie e configure um Cluster no MongoDB Atlas para o acesso via URI, seguindo o tutorial **Building a Simple CRUD**
- Crie um hash MD5 para ser utilizado com semente para os token de autenticação JWT criados
- Crie e configure uma conta em uma API de envio de emails transacionais, similar ao tutorial **Serie API NodeJS**
- Com as informações obtidas dos passos acima preencha os respectivos campos no arquivo ```/back-end/src/config/auth.json```
### Executando o Back-end:
- Pelo terminal entre na pasta back-end
- Execute o comando **npm start**, ele instalará as dependencias de pacotes e ficará executando o back-end.
- Localmente a API poderá ser acessada no endereço ```localhost:3333``` 
### Executando o Front-end:
- Pelo terminal entre na pasta front-end
- Execute o comando **npm start**, ele instalará as dependencias de pacotes e ficará executando o front-end.
- Localmente a aplicação poderá ser acessada no endereço ```localhost:3000``` 

# Documentação 
* [Business model Canvas](https://raw.githubusercontent.com/Riei-Joaquim/SuperPlayer/main/doc/canvas/Business_canvas.jpg)
* [Project model Canvas](https://raw.githubusercontent.com/Riei-Joaquim/SuperPlayer/main/doc/canvas/Project_canvas.jpg)
* Para mais informações da aplicação back-end acesse o [Wiki](https://github.com/Riei-Joaquim/SuperPlayer/wiki) do repositório
* Para mais informações da aplicação front-end e dos testes acesse o [Repositorio](https://github.com/amb-lucas/superplayer-front/tree/master)

## Equipe
- [Fernando Rego Pessoa](https://github.com/frpmneto)
- [Lucas Ambrósio](https://github.com/amb-lucas)
- [Riei Joaquim](https://github.com/Riei-Joaquim)

## Frameworks/Tools
- [Node](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/)
- [Mongoose](https://mongoosejs.com/)
- [JsonWebToken](https://jwt.io/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Heroku](https://www.heroku.com/home)
- [Cors](https://expressjs.com/en/resources/middleware/cors.html)
- [Nodemailer](https://nodemailer.com/about/)
- [MailTrap](https://mailtrap.io/)
- [React](https://pt-br.reactjs.org/)
- [cypress](https://www.cypress.io/)
## Referencias
- [tic-tac-toe-boys-api](https://github.com/amb-lucas/tic-tac-toe-boys-api)
- [if977](https://github.com/IF977/if977)
- [MongoDB-Documentation](https://docs.mongodb.com/manual/reference/)
- [Serie API NodeJS](https://www.youtube.com/playlist?list=PL85ITvJ7FLoiXVwHXeOsOuVppGbBzo2dp)
- [Http](https://developer.mozilla.org/pt-BR/docs/Web/HTTP)
- [Javascript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [OmniStack-11](https://github.com/amb-lucas/OmniStack-11)
- [WebDev-Course](https://github.com/amb-lucas/WebDev-Course)
- [Introdução ao bcrypt](https://medium.com/reprogramabr/uma-breve-introdu%C3%A7%C3%A3o-sobre-bcrypt-f2fad91a7420)
- [tetris-boys](https://github.com/amb-lucas/tetris-boys)
- [Building a Simple CRUD](https://zellwk.com/blog/crud-express-mongodb/)
- [To-Do-List](https://github.com/amb-lucas/To-Do-List)

