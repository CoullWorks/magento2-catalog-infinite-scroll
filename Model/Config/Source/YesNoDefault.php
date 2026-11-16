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
 * Yes / No / "use the store setting" choice for widget parameters, so a widget
 * only overrides the store configuration when someone picks Yes or No.
 */
class YesNoDefault implements OptionSourceInterface
{
    /**
     * @inheritDoc
     *
     * @return array<int, array{value: string, label: \Magento\Framework\Phrase}>
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => '', 'label' => __('Use store setting')],
            ['value' => '1', 'label' => __('Yes')],
            ['value' => '0', 'label' => __('No')],
        ];
    }
}
