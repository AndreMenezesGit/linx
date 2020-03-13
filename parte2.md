# DESAFIO - Parte 2

Instale a ferramenta de automação Ansible:
https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#installing-ansible-on-ubuntu

#### Execute os commandos abaixo para preparar o ambiente
```javascript
mv /etc/ansible /etc/ansible-original
git clone -b develop https://github.com/AndreMenezesGit/linx.git
mv /etc/linx /etc/ansible
```

#### Para configurar o servidor e realizar o primeiro deploy da aplicação
```javascript
ansible-playbook /etc/ansible/playbooks/deploy.yml
```

#### A versão do node.js deverá ser a última versão LTS disponível em: https://nodejs.org/en/download/.
#### A aplicação node abaixo possui a dependência da biblioteca express.Garanta que seu processo de bootstrap instale essa dependência ( última versão estável disponível em: http://expressjs.com/ )
Instalação automatizada com Ansible garantindo a instalação das últimas versões LTS das bibliotecas citadas, se necessário o upgrade ou downgrade, basta trocar o valor da variável nas roles do Ansible;
#### Rode o processo node em background. De uma forma dinâmica garanta que seja criado uma instância node para cada processador existente na máquina ( a máquina poderá ter de 1 a 32 processadores );

#### Construa dentro de sua automação um processo de deploy e rollback seguro e rápido da aplicação node. O deploy e rollback deverá garantir a instalação das dependências node novas (caso sejam adicionadas ou alteradas a versão de algum dependência por exemplo), deverá salvar a versão antiga para possível rollback e reiniciar todos processos node sem afetar a disponibilidade global da aplicação na máquina;
Utilizada biblioteca cluster e pm2, para spawn de vários processos e deploy contínuo. Após o primeiro deploy da aplicação utilize os comandos abaixo para administrar o cluster da aplicação:

Para verificar o status do cluster
```javascript
pm2 status
```

Para parar o cluster Nodejs e indisponibilizar a aplicação
```javascript
pm2 stop app
```

Parar iniciar novamente o cluster
```javascript
pm2 start app
```

Para dar um reload na aplicação. Esta é a opção mais indicada para atualizar a aplicação com novas features sem deixá-la indisponível, uma vez que ao executar o reload o pm2 atualiza os processos filhos do cluster um a um.
```javascript
pm2 reload app
```

#### A aplicação Node deverá ser acessado através de um Servidor Web configurado como Proxy Reverso e que deverá intermediar as conexões HTTP e HTTPS com os clientes e processos node. Um algoritmo de balanceamento deve ser configurado para distribuir entre os N processos node a carga recebida;
Configurado um servidor de proxy reverso com Nginx através Ansible role nginx-reverse-proxy
#### A fim de garantir a disponibilidade do serviço, deverá estar funcional uma monitoração do processo Node e Web para caso de falha, o mesmo deve reiniciar ou subir novamente os serviços em caso de anomalia;
#### Desenvolva um pequeno script que rode um teste de carga e demostre qual o Throughput máximo que seu servidor consegue atingir;
Para os testes de carga foi desenvolvida um role do ansible "httperf-tests" utilizando a ferramenta httperf. A mesma pode ser executada via playbook:
```javascript
ansible-playbook /etc/ansible/playbooks/workload-test.yaml 

PLAY [localhost] **************************************************************************************************************************************************************************************************

TASK [Gathering Facts] ********************************************************************************************************************************************************************************************
ok: [localhost]

TASK [httperf-tests : Executando teste de carga 01...] ************************************************************************************************************************************************************
```
Um script mais simples utilizando curl tbm está disponível no src e pode ser executado como no exemplo abaixo:
```javascript
bash simple-performance-test.sh > /dev/null
```
#### Desenvolva um script que parseie o log de acesso do servidor Web e deverá rodar diariamente e enviar por e-mail um simples relatório, com a frequência das requisições e o respectivo código de resposta (ex:5 /index.html 200); 
#### Por fim; rode o seu parser de log para os logs gerados pelo teste de carga, garantindo que seu script terá performance mesmo em casos de logs com milhares de acessos;
Executar o script /etc/ansible/src/log-parser.sh. A saída do mesmo será parecida com o exemplo abaixo:
```javascript
src git:(develop) ✗ ./log-parser.sh       
4359536 200 /
 115469 500 /
     71 304 /
      4 502 /
      4 499 /
      4 404 /favicon.ico

```
