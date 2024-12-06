router.get('/produto/:idProduto', async (req, res) => {
    const { idProduto } = req.params;

    try {
        const [produto] = await db.query('SELECT * FROM PRODUTO WHERE idProduto = ?', [idProduto]);
        if (produto.length === 0) return res.status(404).send('Produto não encontrado.');

        // Supondo que o ID do cliente esteja armazenado na sessão
        const idCliente = req.session.idCliente || 1;  // Ajuste conforme o seu sistema de login

        res.render('produto', { produto: produto[0], idCliente });
    } catch (err) {
        res.status(500).send('Erro ao carregar produto.');
    }
});
router.get('/carrinho', async (req, res) => {
    const idCliente = req.session.idCliente || 1;  // Ajuste conforme o seu sistema de login

    try {
        const [itensCarrinho] = await db.query(
            'SELECT p.nome, p.preco, p.marca, p.modelo, c.quantidade FROM CARRINHO c JOIN PRODUTO p ON c.idProduto = p.idProduto WHERE c.idCliente = ?',
            [idCliente]
        );

        const total = itensCarrinho.reduce((total, item) => total + (parseFloat(item.preco.replace('R$', '').replace(',', '.')) * item.quantidade), 0);
        res.render('carrinho', { carrinho: itensCarrinho, total: total.toFixed(2).replace('.', ',') });
    } catch (err) {
        res.status(500).send('Erro ao carregar carrinho.');
    }
});
router.post('/carrinho/finalizar', async (req, res) => {
    const { idCliente, produtos, formaPagamento, cep } = req.body;

    // Lógica de finalização, como no código do seu back-end
    const valorTotal = produtos.reduce((total, produto) => total + (produto.preco * produto.quantidade), 0);

    // Inserção no banco, pagamento via Mercado Pago, frete via Melhor Envio, etc.
    // Lógica de inserção de pedido aqui...

    res.render('checkout', { pedidoId: idPedido, valorTotal, formaPagamento, frete: freteResponse.data });
});
