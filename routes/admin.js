/* Módulos */
const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

/* Model Categoria */
require('../models/Categoria')
const Categoria = mongoose.model('categorias')

router.get('/', function(req, res){
    res.render('admin/index')
})

router.get('/categorias', function(req, res){
    Categoria.find().then(function(categorias){
       res.render('admin/categorias', {categorias: categorias.map(category => category.toJSON())})   
    }).catch(function(erro){
        req.flash("error_msg","Houve um Erro ao Listar as Categorias: "+erro)
        req.redirect("/admin")
    })
})

router.get('/categorias/add', function(req, res){
    res.render('admin/addcategoria')
})

router.get('/categorias/edit/:id', function(req, res){ 
    Categoria.findOne({_id: req.params.id}).lean().then(function(categoria){
        res.render('admin/editcategoria', {categoria: categoria})
    }).catch(function(erro){
        req.flash("error_msg","Está Categoria Não Existe: "+ erro)
        res.redirect('/admin/categorias')
    })
    
})

router.post('/categorias/nova', function(req, res){
    
    var erros = []

    if (!req.body.nome) {
        erros.push({texto: 'Nome Inválido!'})
    }
    if (req.body.nome.lenght < 2) {
        erros.push({texto: 'Nome muito Pequeno!'})
    }   
    if (!req.body.slug) {
        erros.push({texto: 'Slug Inválido!'})
    }   
    if (erros.length > 0) {
        res.render('admin/addcategoria',{erros: erros})
    }
    else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria (novaCategoria).save().then(function(){
            req.flash("success_msg","Categoria Criada com Sucesso!")
            res.redirect('/admin/categorias')
        }).catch(function(erro){
            req.flash("error_msg","Categoria Não Criada: "+ erro)
            res.redirect('/admin')
        })
    }
})



router.post('/categorias/edit/', function(req, res){
    Categoria.findById({_id: req.body.id}).then(function(categoria){
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug
        categoria.save().then(function(){
            req.flash("success_msg","Categoria Editada com Sucesso!")
            res.redirect('/admin/categorias')
        }).catch(function(erro){
            req.flash("error_msg","Houve um Erro ao Editar a Categoria No Banco: "+ erro)
            res.redirect('/admin/categorias')
        })

       }).catch(function(erro){
        req.flash("error_msg","Houve um Erro ao Editar a Categoria: "+ erro)
        res.redirect('/admin/categorias')
    })

})


router.post('/categorias/delete', function(req, res){
    Categoria.remove({_id: req.body.id}).then(function(){
        req.flash("success_msg","Categoria Removida com Sucesso!")
        res.redirect('/admin/categorias')
    }).catch(function(erro){
        req.flash("error_msg","Houve um Erro ao Remover a Categoria No Banco: "+ erro)
        res.redirect('/admin/categorias')
    })

})

module.exports = router