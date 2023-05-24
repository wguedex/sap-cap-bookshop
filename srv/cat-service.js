



module.exports = (srv) => {

    const { Books } = cds.entities('my.bookshop');

    debugger;

    srv.before('CREATE','Orders', async(req)=>{
        debugger;
        const order = req.data;
        if ( !order.amount || order.amount <= 0 ) return req.error(400, 'Order at least 1 book')
        const tx = cds.transaction(req)
        const affectedRows = await tx.run(
            UPDATE (Books)
            .set({stock : {'-=':order.amount}})
            .where({stock : {'>=':order.amount}, /**and */ ID:order.book_ID})
        );
        if (affectedRows === 0)  req.error (409, "Sold out, sorry")
    });

    srv.after('READ','Books', each => {
        if (each.stock > 111) each.title += '--11% discount';
    });
 
}