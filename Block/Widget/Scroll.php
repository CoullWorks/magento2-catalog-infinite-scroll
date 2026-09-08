<?php
/**
 * CoullWorks Catalog Infinite Scroll for Magento 2.
 *
 * @author    danrcoull <ttechitsolutions@gmail.com>
 * @copyright Copyright (c) 2020-2026 CoullWorks
 * @license   MIT
 * @link      https://github.com/CoullWorks/magento2-catalog-infinite-scroll
 */

declare(strict_types=1);

namespace CoullWorks\CatalogInfiniteScroll\Block\Widget;

use CoullWorks\CatalogInfiniteScroll\Block\Scroll as ScrollBlock;
use Magento\Widget\Block\BlockInterface;

/**
 * Widget wrapper so infinite scroll can be dropped onto any list from
 * Page Builder, CMS pages, static blocks or a layout widget instruction.
 *
 * All behaviour comes from the parent block, which prefers the widget
 * instance parameters over the store configuration.
 */
class Scroll extends ScrollBlock implements BlockInterface
{
    /**
     * @var string
     */
    protected $_template = 'CoullWorks_CatalogInfiniteScroll::scroll.phtml';
}
