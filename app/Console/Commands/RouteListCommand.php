<?php namespace App\Console\Commands;

use Illuminate\Console\Command;

class RouteListCommand extends Command {

	protected $name        = 'route:list';

	protected $description = 'Display all registered routes.';

	public function fire() {
		$routeCollection = app()->getRoutes();

		$rows = [];
		$x    = 0;

		foreach ($routeCollection as $route) {
			if (! empty($route['action']['uses'])) {
				$data = $route['action']['uses'];

				if (($pos = strpos($data, "@")) !== false) {
					$class      = new \ReflectionClass('App\Http\Controllers\\' . substr($data, 0, $pos));
					$namespace  = $class->getNamespaceName();
					$controller = $class->getShortName();
					$action     = substr($data, $pos + 1);
				}
			} else {
				$namespace  = null;
				$controller = null;
				$action     = 'Closure func';
			}

			$rows[$x]['verb']       = $route['method'];
			$rows[$x]['path']       = $route['uri'];
			$rows[$x]['namespace']  = $namespace;
			$rows[$x]['controller'] = $controller;
			$rows[$x]['action']     = $action;
			$x++;
		}

		$headers = ['Verb', 'Path', 'Namespace', 'Controller', 'Action'];
		$this->table($headers, $rows);
	}

}
