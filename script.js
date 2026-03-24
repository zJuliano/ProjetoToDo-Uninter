const formulario = document.querySelector("#formulario-tarefa")
const campoTitulo = document.querySelector("#titulo")
const campoDescricao = document.querySelector("#descricao")
const campoPrioridade = document.querySelector("#prioridade")
const campoBuscaTitulo = document.querySelector("#busca-titulo")
const listaTarefas = document.querySelector("#lista-tarefas")
const mensagemFormulario = document.querySelector("#mensagem-formulario")
const botaoSalvar = document.querySelector("#botao-salvar")

const chaveLocalStorage = "tarefas_todo"

let tarefas = carregarTarefas()
let idTarefaEditando = null

mostrarTarefas()

campoBuscaTitulo.addEventListener("input", function () {
	mostrarTarefas()
})

// Ao enviar o formulário, adiciona tarefa nova ou salva edição
formulario.addEventListener("submit", function (evento) {
	evento.preventDefault()

	const titulo = campoTitulo.value.trim()
	const descricao = campoDescricao.value.trim()
	const prioridade = campoPrioridade.value

	// Validação para impedir cadastro vazio
	if (titulo === "" || descricao === "") {
		mensagemFormulario.textContent = "Preencha título e descrição"
		return
	}

	if (idTarefaEditando === null) {
		adicionarTarefa(titulo, descricao, prioridade)
	} else {
		editarTarefa(idTarefaEditando, titulo, descricao, prioridade)
	}

	limparFormulario()
	salvarTarefas()
	mostrarTarefas()
})

function adicionarTarefa(titulo, descricao, prioridade) {
	const novaTarefa = {
		id: Date.now().toString(),
		titulo: titulo,
		descricao: descricao,
		prioridade: prioridade,
		dataCriacao: new Date().toLocaleDateString("pt-BR"),
		concluida: false
	}

	tarefas.push(novaTarefa)
}

function editarTarefa(id, novoTitulo, novaDescricao, novaPrioridade) {
	for (let i = 0; i < tarefas.length; i++) {
		if (tarefas[i].id === id) {
			tarefas[i].titulo = novoTitulo
			tarefas[i].descricao = novaDescricao
			tarefas[i].prioridade = novaPrioridade
		}
	}

	idTarefaEditando = null
	botaoSalvar.textContent = "Adicionar tarefa"
	mensagemFormulario.textContent = ""
}

function marcarConcluida(id) {
	for (let i = 0; i < tarefas.length; i++) {
		if (tarefas[i].id === id) {
			tarefas[i].concluida = !tarefas[i].concluida
		}
	}

	salvarTarefas()
	mostrarTarefas()
}

function excluirTarefa(id) {
	const novaLista = []

	for (let i = 0; i < tarefas.length; i++) {
		if (tarefas[i].id !== id) {
			novaLista.push(tarefas[i])
		}
	}

	tarefas = novaLista

	salvarTarefas()
	mostrarTarefas()
}

function iniciarEdicao(id) {
	// Preenche o formulário com os dados da tarefa
	for (let i = 0; i < tarefas.length; i++) {
		if (tarefas[i].id === id) {
			campoTitulo.value = tarefas[i].titulo
			campoDescricao.value = tarefas[i].descricao
			campoPrioridade.value = tarefas[i].prioridade
			idTarefaEditando = id
			botaoSalvar.textContent = "Salvar edição"
			mensagemFormulario.textContent = "Editando tarefa"
		}
	}
}

function mostrarTarefas() {
	// Limpa a lista antes de renderizar novamente
	listaTarefas.innerHTML = ""
	const textoBusca = campoBuscaTitulo.value.trim().toLowerCase()

	// Se não existir nenhuma tarefa, mostra mensagem e para a função
	if (tarefas.length === 0) {
		const mensagemVazia = document.createElement("p")
		mensagemVazia.textContent = "Nenhuma tarefa cadastrada"
		mensagemVazia.className = "mensagem-vazia"
		listaTarefas.appendChild(mensagemVazia)
		return
	}

	let tarefasFiltradas = tarefas
	if (textoBusca !== "") {
		tarefasFiltradas = tarefas.filter(function (tarefa) {
			return tarefa.titulo.toLowerCase().includes(textoBusca)
		})
	}

	if (tarefasFiltradas.length === 0) {
		const mensagemVazia = document.createElement("p")
		mensagemVazia.textContent = "Nenhuma tarefa encontrada para este título"
		mensagemVazia.className = "mensagem-vazia"
		listaTarefas.appendChild(mensagemVazia)
		return
	}

	for (let i = 0; i < tarefasFiltradas.length; i++) {
		const tarefa = tarefasFiltradas[i]

		const item = document.createElement("li")
		item.className = "item-tarefa"

		if (tarefa.concluida) {
			item.classList.add("concluida")
		}

		const titulo = document.createElement("h3")
		titulo.className = "titulo-tarefa"
		titulo.textContent = tarefa.titulo

		const descricao = document.createElement("p")
		descricao.className = "descricao-tarefa"
		descricao.textContent = tarefa.descricao

		const prioridade = document.createElement("p")
		prioridade.className = "prioridade-tarefa"
		prioridade.textContent = "Prioridade: " + tarefa.prioridade

		const status = document.createElement("p")
		status.className = "status-tarefa"
		if (tarefa.concluida) {
			status.textContent = "Status: Concluída"
		} else {
			status.textContent = "Status: Pendente"
		}

		const dataCriacao = document.createElement("p")
		dataCriacao.className = "data-tarefa"
		dataCriacao.textContent = "Data de criação: " + tarefa.dataCriacao

		const areaBotoes = document.createElement("div")
		areaBotoes.className = "acoes-tarefa"

		const botaoConcluir = document.createElement("button")
		botaoConcluir.type = "button"
		if (tarefa.concluida) {
			botaoConcluir.textContent = "Desmarcar"
		} else {
			botaoConcluir.textContent = "Concluir"
		}
		botaoConcluir.addEventListener("click", function () {
			marcarConcluida(tarefa.id)
		})

		const botaoEditar = document.createElement("button")
		botaoEditar.type = "button"
		botaoEditar.textContent = "Editar"
		botaoEditar.addEventListener("click", function () {
			iniciarEdicao(tarefa.id)
		})

		const botaoExcluir = document.createElement("button")
		botaoExcluir.type = "button"
		botaoExcluir.textContent = "Excluir"
		botaoExcluir.addEventListener("click", function () {
			excluirTarefa(tarefa.id)
		})

		areaBotoes.appendChild(botaoConcluir)
		areaBotoes.appendChild(botaoEditar)
		areaBotoes.appendChild(botaoExcluir)

		item.appendChild(titulo)
		item.appendChild(descricao)
		item.appendChild(prioridade)
		item.appendChild(status)
		item.appendChild(dataCriacao)
		item.appendChild(areaBotoes)

		listaTarefas.appendChild(item)
	}
}

function salvarTarefas() {
	const textoDasTarefas = JSON.stringify(tarefas)
	localStorage.setItem(chaveLocalStorage, textoDasTarefas)
}

function carregarTarefas() {
	// Tenta buscar no navegador o texto salvo das tarefas
	const textoSalvo = localStorage.getItem(chaveLocalStorage)

	// Se não tiver nada salvo ainda, começa com lista vazia
	if (!textoSalvo) {
		return []
	}

	try {
		const tarefasConvertidas = JSON.parse(textoSalvo)

		// Garante que o valor convertido realmente é uma lista
		if (Array.isArray(tarefasConvertidas)) {
			for (let i = 0; i < tarefasConvertidas.length; i++) {
				if (!tarefasConvertidas[i].dataCriacao) {
					tarefasConvertidas[i].dataCriacao = new Date().toLocaleDateString("pt-BR")
				}
			}
			return tarefasConvertidas
		}

		// Se não for lista, evita erro retornando lista vazia
		return []
	} catch (erro) {
		return []
	}
}

function limparFormulario() {
	formulario.reset()
	mensagemFormulario.textContent = ""
}
