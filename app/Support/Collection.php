<?php namespace App\Support;

use Illuminate\Database\Eloquent\Collection as BaseCollection;

/**
 * Class Collection
 *
 * This class adds some magic to the collection class.
 * It allows you to tab through collections into other object or collections.
 * It also allows you to run a getWhere on a collection to find objects.
 *
 * @package NukaCode\Core\Database
 */
class Collection extends BaseCollection {

    /**
     * Dynamically retrieve attributes on the model.
     *
     * @param  string $key
     *
     * @return mixed
     */
    public function __get($key)
    {
        $newCollection = new self();
        foreach ($this->items as $item) {
            if ($item instanceof self) { // This item is a collection.
                foreach ($item as $subItem) {
                    $newCollection->put($newCollection->count(), $subItem->$key);
                }
            } elseif (is_object($item) && ! $item instanceof self && $item->$key instanceof self) { // Next tap is a collection.
                foreach ($item->$key as $subItem) {
                    $newCollection->put($newCollection->count(), $subItem);
                }
            } else { // This item is an object.
                $newCollection->put($newCollection->count(), $item->$key);
            }
        }

        return $newCollection;
    }

    /**
     * Allow a method to be run on the entire collection.
     *
     * @param string $method
     * @param array  $args
     *
     * @return Collection
     */
    public function __call($method, $args)
    {
        // Look for magic where calls.
        if (strstr($method, 'getWhere')) {
            return $this->magicWhere(snake_case($method), $args);
        }

        // No data in the collection.
        if ($this->count() <= 0) {
            return $this;
        }

        // Run the command on each object in the collection.
        foreach ($this->items as $item) {
            if (! is_object($item)) {
                continue;
            }
            call_user_func_array([$item, $method], $args);
        }

        return $this;
    }

    /**
     * Insert into an object
     *
     * Should be able to do this with methods
     * that already exist on collection.
     *
     * @param mixed $value
     * @param int   $afterKey
     *
     * @return Collection
     */
    public function insertAfter($value, $afterKey)
    {
        $new_object = new self();

        foreach ((array)$this->items as $k => $v) {
            if ($afterKey == $k) {
                $new_object->add($value);
            }

            $new_object->add($v);
        }

        $this->items = $new_object->items;

        return $this;
    }

    /**
     * Turn a collection into a drop down for an html select element.
     *
     * @param  string $firstOptionText Text for the first object in the select array.
     * @param  string $id              The column to use for the id column in the option element.
     * @param  string $name            The column to use for the name column in the option element.
     *
     * @return array                    The new select element array.
     */
    public function toSelectArray($firstOptionText = 'Select one', $id = 'id', $name = 'name')
    {
        $selectArray = [];

        if ($firstOptionText != false) {
            $selectArray[0] = $firstOptionText;
        }

        foreach ($this->items as $item) {
            $selectArray[$item->{$id}] = $item->{$name};
        }

        return $selectArray;
    }

    /**
     * Turn the magic getWhere into a real where query.
     *
     * @param $method
     * @param $args
     *
     * @return Collection
     */
    private function magicWhere($method, $args)
    {
        $whereStatement = explode('_', $method);

        // Get where
        if (count($whereStatement) == 2) {
            return $this->getWhere($args[0], '=', $args[1]);
        }

        $operators = [
            'in', 'between', 'like', 'null',
            'not',
            'first', 'last',
            'many',
        ];

        // If an operator is found then add operators.
        if (array_intersect($whereStatement, $operators)) {

            list($finialOperator, $position, $not) = $this->determineMagicWhereDetails($whereStatement);

            return $this->getWhere(
                $args[0],                               // Column
                $finialOperator,                        // Operator
                (isset($args[1]) ? $args[1] : null),    // value
                $not,                                   // Inverse
                $position                                // First or last
            );


        }
    }

    /**
     * @param $whereStatement
     *
     * @return array
     */
    private function determineMagicWhereDetails($whereStatement)
    {
        $finalOperator = '=';
        $position      = null;
        $not           = false;

        foreach ($whereStatement as $operator) {
            $finalOperator = $this->checkMagicWhereFinalOperator($operator, $finalOperator);
            $position      = $this->checkMagicWherePosition($operator, $position);
            $not           = $this->checkMagicWhereNot($operator, $not);
        }

        return [$finalOperator, $position, $not];

        // This is not working at the moment
        // @todo riddles - fix this
        //if ($finalOperator == 'many') {
        //    $where = null;
        //    foreach ($args[0] as $column => $value) {
        //        $where = $this->getWhere(
        //            $column,            // Column
        //            $finalOperator,    // Operator
        //            $value,             // Value
        //            $not,               // Inverse
        //            $position            // First or last
        //        );
        //    }
        //
        //    return $where;
        //}
    }

    private function checkMagicWhereFinalOperator($operator, $finalOperator)
    {
        if (in_array($operator, ['in', 'between', 'like', 'null', '='])) {
            return $operator;
        }

        return $finalOperator;
    }

    private function checkMagicWherePosition($operator, $position)
    {
        if (in_array($operator, ['first', 'last'])) {
            return $operator;
        }

        return $position;
    }

    private function checkMagicWhereNot($operator, $not)
    {
        if (in_array($operator, ['not'])) {
            return true;
        }

        return $not;
    }

    /**
     * Search a collection for the value specified.
     *
     * @param  string  $column   The column to search.
     * @param  string  $operator The operation to use during search.
     * @param  mixed   $value    The value to search for.
     * @param  boolean $inverse  Invert the results.
     * @param  string  $position Return the first or last object in the collection.
     *
     * @return self                 Return the filtered collection.
     */
    protected function getWhere($column, $operator, $value = null, $inverse = false, $position = null)
    {
        $output = clone $this;
        foreach ($output->items as $key => $item) {

            $forget = false;

            if (strstr($column, '->')) {
                $forget = $this->handleMultiTap($item, $column, $value, $operator, $inverse);
            } else {
                // No tap direct object access
                $forget = $this->whereObject($item, $column, $operator, $value, $inverse);
            }

            if ($forget == true) {
                $output->forget($key);
                continue;
            }
        }

        // Handel first and last.
        if (! is_null($position)) {
            return $output->$position();
        }

        return $output;
    }

    /**
     * @param $item
     * @param $column
     * @param $value
     * @param $operator
     * @param $inverse
     *
     * @return bool
     */
    private function handleMultiTap($item, $column, $value, $operator, $inverse)
    {
        list($objectToSearch, $columnToSearch) = $this->tapThroughObjects($column, $item);

        if ($objectToSearch instanceof self) {
            foreach ($objectToSearch as $subObject) {
                // The column has a tap that ends in a collection.
                return $this->whereObject($subObject, $columnToSearch, $operator, $value, $inverse);
            }
        } else {
            // The column has a tap that ends in direct access
            return $this->whereObject($objectToSearch, $columnToSearch, $operator, $value, $inverse);
        }
    }

    /**
     * @param $column
     * @param $item
     *
     * @return mixed
     */
    private function tapThroughObjects($column, $item)
    {
        $taps = explode('->', $column);

        $objectToSearch = $item;
        $columnToSearch = array_pop($taps);

        foreach ($taps as $tapKey => $tap) {

            // Keep tapping till we hit the last object.
            $objectToSearch = $objectToSearch->$tap;
        }

        return [$objectToSearch, $columnToSearch];
    }

    /**
     * Compare the object and column passed with the value using the operator
     *
     * @param  object  $object   The object we are searching.
     * @param  string  $column   The column to compare.
     * @param  string  $operator What type of comparison operation to perform.
     * @param  mixed   $value    The value to search for.
     * @param  boolean $inverse  Invert the results.
     *
     * @return boolean              Return true if the object should be removed from the collection.
     */
    private function whereObject($object, $column, $operator, $value = null, $inverse = false)
    {
        // Remove the object is the column does not exits.
        // Only do this if we aren't looking for null
        if (! $object->$column && $operator != 'null') {
            return true;
        }

        switch ($operator) {
            case 'in':
                return $this->getWhereIn($object, $column, $value, $inverse);
            case 'between':
                return $this->getWhereBetween($object, $column, $value, $inverse);
            case 'like':
                return $this->getWhereLike($object, $column, $value, $inverse);
            case 'null':
                return $this->getWhereNull($object, $column, $inverse);
            case '=':
            default:
                return $this->getWhereDefault($object, $column, $value, $inverse);
        }
    }

    private function getWhereIn($object, $column, $value, $inverse)
    {
        if (! in_array($object->$column, $value) && $inverse == false) {
            return true;
        }
        if (in_array($object->$column, $value) && $inverse == true) {
            return true;
        }

        return false;
    }

    private function getWhereBetween($object, $column, $value, $inverse)
    {
        if ($inverse == false) {
            if ($object->$column < $value[0] || $object->$column > $value[1]) {
                return true;
            }
        } else {
            if ($object->$column >= $value[0] && $object->$column <= $value[1]) {
                return true;
            }
        }

        return false;
    }

    private function getWhereLike($object, $column, $value, $inverse)
    {
        if (! strstr($object->$column, $value) && $inverse == false) {
            return true;
        }
        if (strstr($object->$column, $value) && $inverse == true) {
            return true;
        }

        return false;
    }

    private function getWhereNull($object, $column, $inverse)
    {
        if ((! is_null($object->$column) || $object->$column != null) && $inverse == false) {
            return true;
        }
        if ((is_null($object->$column) || $object->$column == null) && $inverse == true) {
            return true;
        }

        return false;
    }

    private function getWhereDefault($object, $column, $value, $inverse)
    {
        if ($object->$column != $value && $inverse == false) {
            return true;
        }
        if ($object->$column == $value && $inverse == true) {
            return true;
        }

        return false;
    }
}