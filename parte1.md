# Parte 01: Análise investigativa de sistemas operacionais;

*Fonte de consulta:* **http://www.cplusplus.com**  
*Ferramentas utilizadas:* **strace, ltrace, netstat e psfax**  
*SO:* **Linux Ubuntu Desktop 19.04**

## Análise dos binários ELF

Os binários são escritos em c++, as funções utilizadas são próprias de bibliotecas desta linguagem;

### binário cc9621 

Recupera o nome do usuário logado através da variável de ambiente USER 
```javascript
[getenv("USER")]
```
Concatena o caminho /tmp/ com o nome do usuário logado, neste caso de teste o usuário root [strcat("/tmp/", "root")]
```javascript
[strcat("/tmp/", "root")]
```
Após o binário aguarda a entrada de dados pelo teclado 
```javascript
[__isoc99_scanf]
```

Após inserir um conjunto de caracteres concluo que a variável de usuário foi utilizada para criar o arquivo root em /tmp/root e inserir neste a saída de dados digitados pelo operador.
Evidências: As funções chamadas na sequência:

```javascript
fopen("/tmp/root", "w") = 0xa126b0
```
Cria um arquivo vazio para operações de saída. Se um arquivo com o mesmo nome já existir, seu conteúdo será descartado e o arquivo será tratado como um novo arquivo vazio.

```javascript
fputs("k", 0xa126b0) = 1
```
Insere os caracteres anteriormente (stream) no arquivo récem criado

```javascript
fclose(0xa126b0) = 0
```
Fecha o arquivo gravando os dados lidos recentemente.

### binário d3ea79

O processo inicial deste é bem parecido com o primeiro. Ele recupera o nome do usuário logado através da variável USER e novamente concatena com /tmp para gravar o arquivo neste diretório.
No entanto, ele faz uso da função fwrite, para desta vez adicionar um grande conjunto de caracteres ao mesmo arquivo ao invés de ler a entrada de dados do stin do usuário.
Aparentemente estes dados são predefinidos e são uma réplica do Game of life referenciado pela linha http://en.wikipedia.org/wiki/Conway%27s_Game_of_Life

### binário da87fa

Utilizando a função fork(), cria 10 novos processos filhos, aguarda 10 segundos e, novamente cria 10 novos processos filhos. E assim sucessivamente até ser interrompido.

**saída do ltrace**
```javascript
fork() = 5146
fork() = 5147
fork() = 5148
fork() = 5149
fork() = 5150
fork() = 5151
fork() = 5152
fork() = 5153
fork() = 5154
fork() = 5155
sleep(10) = 0
```

**saída do strace**
```javascript
one(child_stack=NULL, flags=CLONE_CHILD_CLEARTID|CLONE_CHILD_SETTID|SIGCHLD, child_tidptr=0x7f9ff6952810) = 6166
clone(child_stack=NULL, flags=CLONE_CHILD_CLEARTID|CLONE_CHILD_SETTID|SIGCHLD, child_tidptr=0x7f9ff6952810) = 6167
clone(child_stack=NULL, flags=CLONE_CHILD_CLEARTID|CLONE_CHILD_SETTID|SIGCHLD, child_tidptr=0x7f9ff6952810) = 6168
clone(child_stack=NULL, flags=CLONE_CHILD_CLEARTID|CLONE_CHILD_SETTID|SIGCHLD, child_tidptr=0x7f9ff6952810) = 6169
clone(child_stack=NULL, flags=CLONE_CHILD_CLEARTID|CLONE_CHILD_SETTID|SIGCHLD, child_tidptr=0x7f9ff6952810) = 6170
clone(child_stack=NULL, flags=CLONE_CHILD_CLEARTID|CLONE_CHILD_SETTID|SIGCHLD, child_tidptr=0x7f9ff6952810) = 6171
clone(child_stack=NULL, flags=CLONE_CHILD_CLEARTID|CLONE_CHILD_SETTID|SIGCHLD, child_tidptr=0x7f9ff6952810) = 6172
clone(child_stack=NULL, flags=CLONE_CHILD_CLEARTID|CLONE_CHILD_SETTID|SIGCHLD, child_tidptr=0x7f9ff6952810) = 6173
clone(child_stack=NULL, flags=CLONE_CHILD_CLEARTID|CLONE_CHILD_SETTID|SIGCHLD, child_tidptr=0x7f9ff6952810) = 6174
clone(child_stack=NULL, flags=CLONE_CHILD_CLEARTID|CLONE_CHILD_SETTID|SIGCHLD, child_tidptr=0x7f9ff6952810) = 6175
nanosleep({tv_sec=10, tv_nsec=0},
```
### binário ddb1c9 (strace)

Este por sua vez, disponibiliza um webserver simples publicado na porta 8011 da máquina local. Possível identificar através da criação de sockets TCP e bind da porta 8011:

**saída do strace**
```javascript
bind(4, {sa_family=AF_INET6, sin6_port=htons(0), inet_pton(AF_INET6, "::ffff:127.0.0.1", &sin6_addr), sin6_flowinfo=htonl(0), sin6_scope_id=0}, 28) = 0
close(4)                                = 0
close(3)                                = 0
socket(AF_INET6, SOCK_STREAM|SOCK_CLOEXEC|SOCK_NONBLOCK, IPPROTO_IP) = 3
setsockopt(3, SOL_IPV6, IPV6_V6ONLY, [0], 4) = 0
setsockopt(3, SOL_SOCKET, SO_BROADCAST, [1], 4) = 0
setsockopt(3, SOL_SOCKET, SO_REUSEADDR, [1], 4) = 0
bind(3, {sa_family=AF_INET6, sin6_port=htons(8011), inet_pton(AF_INET6, "::", &sin6_addr), sin6_flowinfo=htonl(0), sin6_scope_id=0}, 28) = 0
```

Validação utilizando netstat para verificar as "portas abertas na máquina local"
```javascript
tcp6       0      0 :::8011                 :::*                    LISTEN      5442/./ddb1c9       
```

Num primeiro momento a página web apenas apresenta um caractere de exclamação (!), mas na busca de rotas comuns em APIs e aplicações web como /index, /health, /home identifiquei
que digitando algo após a URL o mesmo conteúdo é impresso no corpo da página HTML.
