const listasContainer = document.getElementById("listasContainer");
const totalItensEl = document.getElementById("totalItens");
const totalGeralEl = document.getElementById("totalGeral");

const categoriaSelect = document.getElementById("categoria");
const nomeItem = document.getElementById("nomeItem");
const toggleTheme = document.getElementById("toggleTheme");



function adicionarItem(){

  const categoria = categoriaSelect.value;
  const nome = nomeItem.value.trim();

  if(!categoria || !nome){
    alert("Preencha o item e a categoria");
    return;
  }

  let card = document.querySelector(`[data-cat="${categoria}"]`);

  if(!card){
    card = document.createElement("div");
    card.className = "categoria-card";
    card.dataset.cat = categoria;

    card.innerHTML = `
      <div class="categoria-topo">
        <h2>${categoria}</h2>
        <button class="excluir-categoria" onclick="excluirCategoria(this)">🗑</button>
      </div>

      <div class="lista-itens"></div>

      <p class="subtotal">
        Subtotal: R$ <span>0.00</span>
      </p>
    `;

    listasContainer.appendChild(card);
  }

  const lista = card.querySelector(".lista-itens");

  const item = document.createElement("div");
  item.className = "item-linha";

  item.innerHTML = `
    <input type="checkbox" onchange="marcarComprado(this)">

    <span class="nome">${nome}</span>

    <input type="number" placeholder="Qtd" oninput="calcularItem(this)">

    <input type="number" placeholder="R$" oninput="calcularItem(this)">

    <div class="item-total">R$ 0.00</div>

    <button class="editar" onclick="editarItem(this)">✏️</button>
    <button class="remover" onclick="removerItem(this)">🗑</button>
  `;

  lista.appendChild(item);

  nomeItem.value = "";

  atualizarResumo();
  salvar();
}



function calcularItem(input){

  const linha = input.closest(".item-linha");
  const campos = linha.querySelectorAll("input[type=number]");

  const qtd = parseFloat(campos[0].value) || 0;
  const valor = parseFloat(campos[1].value) || 0;

  const total = qtd * valor;

  linha.querySelector(".item-total").innerText = `R$ ${total.toFixed(2)}`;

  atualizarSubtotal(linha);
  atualizarResumo();
  salvar();
}



function atualizarSubtotal(linha){

  const card = linha.closest(".categoria-card");
  const totais = card.querySelectorAll(".item-total");

  let soma = 0;

  totais.forEach(t=>{
    soma += parseFloat(t.innerText.replace("R$","")) || 0;
  });

  card.querySelector(".subtotal span").innerText = soma.toFixed(2);
}



function atualizarResumo(){

  const itens = document.querySelectorAll(".item-linha");
  let total = 0;

  itens.forEach(i=>{
    total += parseFloat(
      i.querySelector(".item-total").innerText.replace("R$","")
    ) || 0;
  });

  totalItensEl.innerText = itens.length;
  totalGeralEl.innerText = total.toFixed(2);
}



function removerItem(btn){

  const linha = btn.closest(".item-linha");
  const card = linha.closest(".categoria-card");

  linha.remove();

  if(card.querySelectorAll(".item-linha").length === 0){
    card.remove();
  }

  atualizarResumo();
  salvar();
}



function excluirCategoria(btn){

  btn.closest(".categoria-card").remove();

  atualizarResumo();
  salvar();
}



function marcarComprado(check){
  check.closest(".item-linha").classList.toggle("comprado");
  salvar();
}



function editarItem(btn){

  const nome = btn.closest(".item-linha").querySelector(".nome");

  const novo = prompt("Editar item:", nome.innerText);

  if(novo){
    nome.innerText = novo;
  }

  salvar();
}



function salvar(){
  localStorage.setItem("listaCompras", listasContainer.innerHTML);
}



function carregar(){

  const dados = localStorage.getItem("listaCompras");

  if(dados){
    listasContainer.innerHTML = dados;
    atualizarResumo();
  }
}

carregar();


toggleTheme.onclick = () => {

  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark")
  );
};

if(localStorage.getItem("theme") === "true"){
  document.body.classList.add("dark");
}
