<?php
/**
 *   @package    BoxLeaf
 *   @author     Daniel Coull <ttechitsolutions@gmail.com>
 *   @copyright  01/01/2020, 16:45.$year Daniel Coull
 *   @version    CVS: $Id:$
 *  @since      File available since Release 1.0.0
 *
 */

namespace BoxLeaf\InfinateScroll\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

/**
 * Class DisplayType
 * @package BoxLeaf\InfinateScroll\Model\Config\Source
 */
class DisplayType implements OptionSourceInterface {

    /**
     * Return array of options as value-label pairs
     *
     * @return array Format: array(array('value' => '<value>', 'label' => '<label>'), ...)
     */
    public function toOptionArray()
    {
        $choose = [
            '1' => 'Default',
            '2' => 'Masonry',
            '3' => 'Isotope',
            '4' => 'Packery'

        ];
        return $choose;
    }
}