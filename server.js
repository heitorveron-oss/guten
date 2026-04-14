const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Configura o EJS como motor de visualização para permitir dados dinâmicos
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Simulação de Banco de Dados de Produtos
const produtos = [
    { 
        id: 1, 
        titulo: "Hoodies", 
        img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=1000",
        link: "/categoria/hoodies"
    },
    { 
        id: 2, 
        titulo: "Tees", 
        img: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&q=80&w=1000",
        link: "/categoria/tees"
    }
];

// Rota Principal
app.get('/', (req, res) => {
    res.render('index', { 
        bannerTitle: "SKULL DROP",
        subTitle: "Edição Limitada de Lançamento",
        categorias: produtos 
    });
});

// Exemplo de API para Carrinho (Futuro)
app.post('/api/carrinho/add', (req, res) => {
    // Lógica para adicionar ao carrinho
    res.json({ success: true, message: "Produto adicionado!" });
});

app.listen(PORT, () => {
    console.log(`🚀 Guten Streetwear rodando em http://localhost:${PORT}`);
});