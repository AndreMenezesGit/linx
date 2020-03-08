# linx

Configurações deste laboratório

Estação de trabalho utilizada:

DISTRIB_ID = Ubuntu
DISTRIB_RELEASE = 19.10

Pré requisitos:

Ansible - Ferramenta de automação e gestão de configurações


# Para instalar o Ansible execute os comandos abaixo:

Incluir o PPA oficial do projeto na lista de fontes do sistema
sudo apt-add-repository ppa:ansible/ansible

Atualizar a lista de pacotes do sistema
sudo apt update

Instalar o Ansible
sudo apt install ansible

Validar a instalação

ansible --version

ansible localhost -m ping

# Instânciando o Ambiente



#TO DO
Padronizar nomes de arquivos em inglês - Nomes de arquivos e  comentários em pt_br
Remover .deb do vagrant após a instalação via ansible
