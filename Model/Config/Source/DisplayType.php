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

namespace CoullWorks\CatalogInfiniteScroll\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

/**
 * Layout modes offered for the appended items.
 */
class DisplayType implements OptionSourceInterface
{
    public const DEFAULT = '1';
    public const MASONRY = '2';
    public const ISOTOPE = '3';
    public const PACKERY = '4';

    /**
     * @inheritDoc
     *
     * @return array<int, array{value: string, label: \Magento\Framework\Phrase}>
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => self::DEFAULT, 'label' => __('Default (theme grid)')],
            ['value' => self::MASONRY, 'label' => __('Masonry')],
            ['value' => self::ISOTOPE, 'label' => __('Isotope')],
            ['value' => self::PACKERY, 'label' => __('Packery')],
        ];
    }
}
