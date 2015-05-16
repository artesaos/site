## Como contribuir

Se você gostou de algum dos nossos pacotes e gostaria de contribuir ou simplesmente criar um novo pacote, siga as instruções abaixo.

> É altamente recomendado que tenha boas noções de git.

## Instalar o Studio, um gerenciador para criar pacotes Composer

Nós recomendamos que use o pacote [franzl/studio](https://github.com/franzliedke/studio), ele facilitará a instalação dos pacotes <b>artesãos</b> no sua aplicação laravel ou lumen de desenvolvimento.

Apos instalar o franzl/studio e configurado ele no seu sistema para rodar a partir da linha de comando (terminal) e tendo instalado uma versão completamente nova do Laravel ou Lumen, escolha o pacote artesão que gostaria de contribuir:

 * artesaos/defender: https://github.com/artesaos/defender
 * artesaos/seotools: https://github.com/artesaos/seotools
 * artesaos/warehouse: https://github.com/artesaos/warehouse
 * artesaos/attacher: https://github.com/artesaos/attacher
 * artesaos/zipcode: https://github.com/artesaos/zipcode
 * ...

Escolhido o pacote, acesse o pacote via github e faça um fork dele, pra que você tenha uma cópia do código fonte em seu repositório do github e possa fazer suas próprias modificações. E em seguida, na pasta da sua aplicação Laravel ou Lumen, faça o seguinte comando:

```bash
studio create workbench/artesaos/nome-do-pacote --git https://github.com/SEU-NICK-DO-GITHUB/nome-do-pacote 
```
> Nota: Se o pacote não for compativel com lumen, você deve saber dos riscos e deve ir adaptando-o até que funcione adequadamente.


feito isso, o studio baixará o pacote do github e suas dependencias em <code>workbench/artesaos/nome-do-pacote</code> e já incluirá esse pacote nos autoloads do composer da aplicação principal.

Daí em diante você deve seguir o que diz no readme.md de cada pacote para configurá-lo na sua aplicação, geralmente eles tem um ServiceProvider e um Façade que você deve configurar em config/app.php. Em outros casos também tera que publicar configurações, views, migrations e arquivos públicos, que geralmente é satisfeito com esse comando:

```bash
php artisan vendor:publish
``` 

ou


```bash
php artisan vendor:publish --provider="Artesaos\NomeDoPacote\NomeDoPacoteServiceProvider"
``` 

## Dependências do pacote

Se você tiver que adicionar qualquer dependência ao pacote, ela deve ser feita no arquivo <code>workbench/artesaos/nome-do-pacote/composer.json</code> e então, dentro dessa pasta você deve fazer o seguinte comando no terminal:

```bash
composer update
```

## Enviando para o servidor

Após fazer as suas modificações/contribuições para o pacote, você deve enviar o resultado para seu repositório no github, então, a partir da pasta do pacote:

```bash
git add caminho/do/arquivo/modificado
git add caminho/do/outro/arquivo/modificado
...
```

ou, se você sabe trabalhar com git e tem conciência dos arquivos que modificou (pode listá-los com `git status`), você pode adicionar todos de uma só vez:

```bash
git add --all
```

e então criar uma mensagem de modificação:

```bash
git commit -m "Adicionei uma nova funcionalidade muito legal"
```

e em seguida, enviar para seu github:

```bash
git push origin master
```
> ou o branch que estiver trabalhando

## Enviando ao Artesãos um pedido de merge

Após enviar as modificações para seu github, você deve agora enviar para o artesãos as modificações que fez, para então a equipe do artesãos resoponsável possa revisar seu código e então juntar(merge) suas modificações no repositório oficial. 

Pela interface do github, vá até o projeto artesão que escolheu e na opção `pull requests` escolha "New pull request", certifique-se de marcar "compare across forks" e que na comparação o "artesaos/nome-do-pacote" esteja a esquerda de "SEU-NICK-GITHUB/nome-do-pacote", daí você escolhe nos dosi lados o branch que você modificou e se certifica que suas mensagens de modificação vão aparecer logo abaixo após escolher os branchs. Tudo certificado pode clicar em "create pull request" e adicionar uma mensagem a ele e uma descrição para que a equipe Artesãos possa revisar.

## Participe da comunidade

Entre pra nossa comunidade [Laravel Brasil no Slack](http://laravelbrasil.vluzrmos.com.br) e fique atualizado sobre
o andamento dos pacotes, ou tire dúvidas sobre Laravel, IDEs, PHP, dentre outras.

## Autor

Vagner do Carmo vluzrmos@gmail.com.
