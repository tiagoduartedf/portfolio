# --------------------------------------------------------------
# Testes
# --------------------------------------------------------------

# oq vc conhece sobre testes?
codigos para testar codigos ou cenarios

## pq vc acha que eles são importantes?
castelo de cartas, ajuda a manter o codigo funcionando
tdd ajuda na criação
- ajuda na criação de funcionalidades isoladas pra seguir o clean code pra ficar ficar mais facil de testar (principalmente se tiver seguindo TDD)

## como eles te ajudam?
- forma de segurança (no sentido de estabilidade, independente de alteração continua funcionando)
confiança no codigo, não pode ter code prey a cada alteração
evita aquela sensação de castelo de cartas, mexe num lugar estraga outro

- e além do mais testar na interface da trabalho p crl



## mencionar tipos de testes
* unitario {
	testa uma classes/metodo/função isolada
	mockando as dependencias
	
	// divido em 3 partes
	arrenge,act,assert
	
	cuidado com testes burros
}
* integração {
	testa uma classe/metodo/função sem mockar as dependencias
}
- funcional {
	empurração de mouse, como se fosse o usuário
	teste rodando, a lib clicando no botão e tal
}
teste de carga {
	todo, não é tão importante
}
teste fumaça {
	todo, não é tão importante
	normalmente quem faz é o QA
}

# testes de frontend
testes de front é baseado em 2 usuarios
o usuario final que vai abrir a tela e clicar/ver no componente
o programador que vai codar com esse componente
(então tem que usar/testar alterações que esses usuários possam fazer [diferente do enzyme que altera state e esse tipo de coisa, coisa que nenhum dos dois usuarios vão fazer])




