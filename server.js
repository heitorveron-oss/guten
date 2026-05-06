const express = require('express');
const path = require('path');
const app = express();

// A porta deve ser process.env.PORT para funcionar no Render
const PORT = process.env.PORT || 3000;

// 1. CONFIGURAÇÕES
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// 2. "BANCO DE DADOS" DE PRODUTOS (Simulação)
const produtos = [
    { 
        id: 1, 
        titulo: "Hoodies", 
        img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=1000",
        link: "/categoria/hoodies",
        slug: "hoodies"
    },
    { 
        id: 2, 
        titulo: "Tees", 
        img: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&q=80&w=1000",
        link: "/categoria/tees",
        slug: "tees"
    }
];

// 3. ROTAS

// Rota Principal (Home)
app.get('/', (req, res) => {
    res.render('index', { 
        bannerTitle: "SKULL DROP",
        subTitle: "Edição Limitada de Lançamento",
        categorias: produtos 
    });
});

// Rota de Categoria Dinâmica
app.get('/categoria/:nome', (req, res) => {
    const nomeCategoria = req.params.nome;
    
    // Aqui passamos o nome para o título da página
    res.render('categoria', { 
        titulo: nomeCategoria.charAt(0).toUpperCase() + nomeCategoria.slice(1) 
    });
});

// Rota Sobre (About)
app.get('/about', (req, res) => {
    res.render('about');
});

// 4. API (Para funções futuras como carrinho)
app.post('/api/carrinho/add', (express.json()), (req, res) => {
    res.json({ success: true, message: "Produto adicionado ao carrinho!" });
});

// 5. INICIALIZAÇÃO DO SERVIDOR
// Usamos '0.0.0.0' para garantir que o Render consiga acessar o serviço externamente
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Guten Streetwear rodando em http://localhost:${PORT}`);
});