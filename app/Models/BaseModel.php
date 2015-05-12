<?php namespace App\Models;

use Hashids\Hashids;
use Illuminate\Database\Eloquent\Model;
use App\Support\Collection;

abstract class BaseModel extends Model {

	/**
	 * Whether the model should inject it's identifier to the unique
	 * validation rules before attempting validation.
	 *
	 * @var boolean
	 */
	protected $injectIdentifier = true;

	/**
	 * Whether the model should throw a ValidationException if it
	 * fails validation.
	 *
	 * @var boolean
	 */
	protected $throwValidationExceptions = false;

	/**
	 * Assign a presenter to use
	 *
	 * @var string
	 */
	protected $presenter = null;

	/**
	 * Assign as observer to use
	 *
	 * @var string
	 */
	protected static $observer = null;

	/**
	 * Any field in this array will be populated with a unique string on create.
	 *
	 * @var array
	 */
	protected static $uniqueStringColumns = [];

	/**
	 * The size string to generate for unique string column.
	 *
	 * @var int
	 */
	protected static $uniqueStringLimit = 10;

	/**
	 * Use the custom collection that allows tapping.
	 *
	 * @param array $models An array of models to turn into a collection.
	 *
	 * @return Utility_Collection[]
	 */
	public function newCollection(array $models = []) {
		return new Collection($models);
	}

	/**
	 * Create a new Eloquent model instance.
	 *
	 * @param  array $attributes
	 *
	 * @throws \Exception
	 */
	public function __construct(array $attributes = []) {
		// Make sure we have the hash id set
		$class = get_called_class();

		if (! defined("$class::HASH_ID")) {
			throw new \Exception('The HASH_ID constant is not set on ' . $class . '.');
		}


		parent::__construct($attributes);
	}

	/********************************************************************
	 * Scopes
	 *******************************************************************/
	/**
	 * Order by created_at ascending scope.
	 *
	 * @param $query The current query to append to
	 */
	public function scopeOrderByCreatedAsc($query) {
		return $query->orderBy('created_at', 'asc');
	}

	/**
	 * Order by name ascending scope.
	 *
	 * @param $query The current query to append to
	 */
	public function scopeOrderByNameAsc($query) {
		return $query->orderBy('name', 'asc');
	}

	/**
	 * Get only active rows.
	 *
	 * @param $query The current query to append to
	 */
	public function scopeActive($query) {
		return $query->where('activeFlag', 1);
	}

	/**
	 * Get only inactive rows.
	 *
	 * @param $query The current query to append to
	 */
	public function scopeInactive($query) {
		return $query->where('activeFlag', 0);
	}

	/********************************************************************
	 * Model events
	 *******************************************************************/

	/**
	 * Common tasks needed for all models.
	 * Registers the observer if it exists.
	 * Sets the default creating event to check for uniqueIds when the model uses them.
	 */
	public static function boot() {
		parent::boot();

		// Get the possible class names.
		$class = get_called_class();

		if (static::$observer != null) {
			$class::observe(new static::$observer);
		}
	}

	/********************************************************************
	 * Getters and Setters
	 *******************************************************************/

	public function getHashIdAttribute() {
		$hash = $this->getHashInstance();

		return $hash->encode($this->attributes['id']);
	}

	/********************************************************************
	 * Extra Methods
	 *******************************************************************/
	/**
	 *
	 * @param mixed $id
	 * @param array $columns
	 *
	 * @return \Illuminate\Support\Collection|null|static
	 */
	public static function findHash($id, $columns = ['*']) {
		$hash = self::getHashInstance();
		$id   = $hash->decode($id);

		return parent::find($id, $columns);
	}

	protected static function getHashInstance() {
		$class = get_called_class();

		return new Hashids($class::HASH_ID);
	}
}
