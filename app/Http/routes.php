<?php

$app->get('/', function() use ($app) {
	//Puxar as views do front
	return "<h1>Seja lecal.</h1><p>Olhe para a janela.</p>";
});
$app->get('/packages', function() use ($app) {
	//Construir recursos para busca dos packages, ex:
	$p = new App\Artesaos\Packages;

	return response()->json($p->all());
});
