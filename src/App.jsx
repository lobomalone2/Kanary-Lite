import { useState, useEffect } from 'react'
import './App.css'

function App() {
  
  const [texto, setTexto] = useState("")
  const [dataInput, setDataInput] = useState(new Date().toJSON().slice(0, 10));

  // Carrega do Local Storage ao iniciar ou começa com array vazio

  const [lista, setLista] = useState(() => {
    const salvo = localStorage.getItem('kanary_tarefas')
    return salvo ? JSON.parse(salvo) : []
  })
  const [abaAtiva, setAbaAtiva] = useState("pendentes")

  //salva no Local Storage sempre que a lista muda

  useEffect(() => {
    localStorage.setItem('kanary_tarefas', JSON.stringify(lista))
  }, [lista])

  function adicionarTarefa() {
    if (texto.trim() === "") return 
    const novaTarefa = {
      id: Date.now(),
      texto: texto,
      data:dataInput,
      concluida: false
    }


    setLista([...lista, novaTarefa])
    setTexto("")
  }

  function alternarConcluida(id) {
    const novaLista = lista.map(t => {
      if (t.id === id) {
        return { ...t, concluida: !t.concluida }
      }
      return t
    })
    setLista(novaLista)
  }

  function removerTarefa(id) {
    const listaAtualizada = lista.filter(t => t.id !== id)
    setLista(listaAtualizada)

  }

  function formatarDataExibicao(dataTarefa) {
  // Se a tarefa não tiver data (tarefas antigas), evita erro de crash
  if (!dataTarefa) return "Sem data";

  const hoje = new Date().toJSON().slice(0, 10); // Adicionado () em toJSON

  const amanhaObj = new Date();
  amanhaObj.setDate(amanhaObj.getDate() + 1); // Adicionado () em getDate
  const amanha = amanhaObj.toJSON().slice(0, 10);

  if (dataTarefa === hoje) return "Hoje";
  if (dataTarefa === amanha) return "Amanhã";

  const [ano, mes, dia] = dataTarefa.split("-");
  return `${dia}/${mes}`;
}


  // Lógica de Filtro para as Abas

  const tarefasFiltradas = lista.filter(t => {
    if (abaAtiva === "todas") return true 
    if (abaAtiva === "concluidas") return t.concluida
    return !t.concluida
  })

  return (
    <div className="painel-container">
      <aside className="barra-lateral">
        <div className="logotipo">Kanary<span>Lite</span></div>
        <nav className="menu-navegacao">
          <button 
            className={`item-menu ${abaAtiva === 'pendentes' ? 'ativo' : ''}`}
            onClick={() => setAbaAtiva("pendentes")}
          >
            📋 Minhas Tarefas
          </button>
          <button 
            className={`item-menu ${abaAtiva === 'concluidas' ? 'ativo' : ''}`}
            onClick={() => setAbaAtiva("concluidas")}
          >
            ✅ Concluídas
          </button>

          <button 

      className={`item-menu ${abaAtiva === 'todas' ? 'ativo' : ''}`}
      onClick={() => setAbaAtiva("todas")}
>
      🌍 HISTORICOS
        </button>

        </nav>
      </aside>

      <main className="conteudo-principal">
        <header className="cabecalho">
          <h1>{abaAtiva === "pendentes" ? "Foco do Dia" : "Histórico"}</h1>
          <p>Total: <span className="destaque">{tarefasFiltradas.length}</span></p>
        </header>

        <section className="secao-tarefas">
          {abaAtiva === "pendentes" && (
            <div className="grupo-entrada">
              <input value={texto} onChange={(e) => setTexto(e.target.value)} type="text" placeholder="Nova tarefa..." />
              <input value={dataInput} onChange={(e) => setDataInput(e.target.value)} type="date" />
              <button onClick={adicionarTarefa} className="botao-adicionar">+</button>
            </div>
          )}

          <ul className="lista-tarefas">
            {tarefasFiltradas.map((t) => (
              <li key={t.id} className={`cartao-tarefa ${t.concluida ? 'concluida' : ''}`}>
                <div className="info-tarefa">
                  <h3 style={{ textDecoration: t.concluida ? 'line-through' : 'none' }}>
                    {t.texto}
                  </h3>

                  <span className="tag-data">
                  {/* Aqui você passa a data da tarefa para a função traduzir */}
                  📅 {formatarDataExibicao(t.data || dataInput)}
                  </span>

                </div>
                <input 
                  type="checkbox" 
                  checked={t.concluida}
                  onChange={() => alternarConcluida(t.id)} 
                  className="caixa-selecao" 
                />

                <button


        onClick={() => removerTarefa(t.id)} 
        className="botao-remover"
        title="Excluir tarefa"
      >
        🗑️
      </button>


              </li>
            ))} 
          </ul>
        </section>
      </main>
    </div>
  )
}

export default App