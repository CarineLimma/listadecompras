let categorias = JSON.parse(localStorage.getItem("listaCompras")) || {};
let totalGeral = 0;

window.onload = () => {
  atualizarLista();
  calcularTotalGeral();
};

function adicionarItem() {
  const produto = document.getElementById("produto").value;
  const categoria = document.getElementById("categoria").value;
  const quantidade = Number(document.getElementById("quantidade").value);
  const valor = Number(document.getElementById("valor").value);

  if (!produto || quantidade <= 0 || valor <= 0) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const totalItem = quantidade * valor;

  if (!categorias[categoria]) {
    categorias[categoria] = {
      itens: [],
      totalCategoria: 0
    };
  }

  categorias[categoria].itens.push({
    produto,
    quantidade,
    valor,
    totalItem
  });

  categorias[categoria].totalCategoria += totalItem;

  salvarDados();
  atualizarLista();
  calcularTotalGeral();
  limparCampos();
}

function removerItem(categoria, index) {
  categorias[categoria].totalCategoria -= categorias[categoria].itens[index].totalItem;
  categorias[categoria].itens.splice(index, 1);

  if (categorias[categoria].itens.length === 0) {
    delete categorias[categoria];
  }

  salvarDados();
  atualizarLista();
  calcularTotalGeral();
}

function calcularTotalGeral() {
  totalGeral = 0;

  for (let categoria in categorias) {
    totalGeral += categorias[categoria].totalCategoria;
  }

  document.getElementById("totalGeral").innerText = totalGeral.toFixed(2);
}

function atualizarLista() {
  const listas = document.getElementById("listas");
  listas.innerHTML = "";

  for (let categoria in categorias) {
    const div = document.createElement("div");
    div.className = "categoria";

    let html = `<h3>${categoria}</h3>`;

    categorias[categoria].itens.forEach((item, index) => {
      html += `
        <div class="item">
          <span>${item.produto} (x${item.quantidade}) - R$ ${item.totalItem.toFixed(2)}</span>
          <button onclick="removerItem('${categoria}', ${index})">X</button>
        </div>
      `;
    });

    html += `
      <hr>
      <strong>Total da categoria: R$ ${categorias[categoria].totalCategoria.toFixed(2)}</strong>
    `;

    div.innerHTML = html;
    listas.appendChild(div);
  }
}

function salvarDados() {
  localStorage.setItem("listaCompras", JSON.stringify(categorias));
}

function limparCampos() {
  document.getElementById("produto").value = "";
  document.getElementById("quantidade").value = "";
  document.getElementById("valor").value = "";
}
