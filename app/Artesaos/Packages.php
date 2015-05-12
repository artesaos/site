<?php namespace App\Artesaos;

class Packages{
	public function all(){
		app()->configure('artesaos');
		return config('artesaos.packages');
	}
}
