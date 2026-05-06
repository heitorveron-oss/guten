require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const fs = require('fs-extra');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();

// Configuração Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// Estrutura de Pastas e Persistência
const dbPath = path.join(__dirname, 'data', 'produtos.json');
fs.ensureDirSync(path.join(__dirname, 'data'));
fs.ensureDirSync(path.join(__dirname, 'public', 'uploads'));
if (!fs.existsSync(dbPath)) fs.writeJsonSync(dbPath, []);

// Middlewares
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'guten-brutalist-secret',
    resave: false,
    saveUninitialized: true
}));

const auth = require('./middleware/auth');

// Upload de Imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Rotas de Dados
const getProducts = () => fs.readJsonSync(dbPath);
const saveProducts = (data) => fs.writeJsonSync(dbPath, data, { spaces: 2 });

// --- ROTAS ---

app.get('/', (req, res) => {
    res.render('index', { produtos: getProducts() });
});

app.get('/login', (req, res) => res.render('login'));
app.post('/login', (req, res) => {
    if (req.body.password === process.env.ADMIN_PASS) {
        req.session.isAdmin = true;
        return res.redirect('/admin');
    }
    res.send('Acesso Negado');
});

app.get('/admin', auth, (req, res) => {
    res.render('admin', { produtos: getProducts() });
});

app.post('/admin/add', auth, upload.single('imagem'), (req, res) => {
    const { titulo, preco, slug } = req.body;
    const produtos = getProducts();
    produtos.push({
        id: Date.now(),
        titulo,
        preco: parseFloat(preco),
        slug,
        img: `/uploads/${req.file.filename}`
    });
    saveProducts(produtos);
    res.redirect('/admin');
});

app.post('/admin/delete/:id', auth, (req, res) => {
    const produtos = getProducts().filter(p => p.id !== parseInt(req.params.id));
    saveProducts(produtos);
    res.json({ success: true });
});

// Checkout Mercado Pago
app.post('/api/checkout', async (req, res) => {
    try {
        const { titulo, preco } = req.body;
        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: [{
                    title: `GUTEN - ${titulo}`,
                    unit_price: Number(preco),
                    quantity: 1,
                    currency_id: 'BRL'
                }],
                back_urls: { success: "http://localhost:3000" }
            }
        });
        res.json({ init_point: result.init_point });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(process.env.PORT, () => console.log(`GUTEN ONLINE: http://localhost:${process.env.PORT}`));