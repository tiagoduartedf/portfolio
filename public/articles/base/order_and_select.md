# Intro
pesquisar em uma lista não ordenada pode ser muito custozo...
por isso existem algoritimos para ordenar listas
e algoritimos de busca para buscar nessas listas ordenadas

# ===========================================================================================================
# ordenação
# ===========================================================================================================

## categorias de ordenação
- por troca
- por seleção
- por inserção

# buble sort (por troca)
facil de implementar, mas um dos piores em performace (mt troca, mt comparação)
{
	ele troca de 1 a 1
	seguindo pro proximo
	ate levar o ultimo elemento pro fim
	e dps ele vai recomeçar ate o penultimo
}
[nome buble pq o numero maior é como se fosse flutuando até a sua posição]
-todo: era legal ter um gif explicando isso, pra qm ver ter uma opção visual da parada
OBAMA: https://www.youtube.com/watch?v=koMpGeZpu4Q

# classificação por seleção (por seleção)
{
	localiza o menor elemento
	e traz pra primeira posição trocando pelo anterior q tava lá
	
	e dai pra frente pega o segundo e faz tudo de novo
}
+ comparações, - trocas
-todo: era legal ter um gif explicando isso, pra qm ver ter uma opção visual da parada

# exemplo (por inserção)
{
	divide o vetor em 2
	um lado ordenado e o outro não ordenado
	pega os dados do vetor não ordenado e vai inserindo no ordenado em ordem
}
-todo: era legal ter um gif explicando isso, pra qm ver ter uma opção visual da parada

# ===========================================================================================================
# busca
# ===========================================================================================================
existem diversos algoritimos de busca, citando os mais simples

## sequencial
começa do inicio da estrutura ate o final ate achar, esse é o mais popular usado em todos os tipos de lista (ordenadas e não-ordenadas)

## busca binaria
só serve se os dados estiverem ordenados
parecido como qnd a gente vai procurar uma palavra num dicionario
{
	marca inicio, fim, meio
	checa se o valor é maior ou menor do que o meio
	e dai vai dividindo fazendo com que o meio vire inicio ou fim e o novo meio é o novo inicio/fim divido por dois
	até achar o valor
}


# ===========================================================================================================
# implementações
# ===========================================================================================================
./order_implements/

[x] bubble sort
[x] selection sort
[x] insertion sort

[x] merge sort
[x] quick sort
[] heap sort (tem que manjar de arvore)

[x] busca sequencial
[x] busca binaria

