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

namespace CoullWorks\CatalogInfiniteScroll\Test\Unit\Model\Config\Source;

use CoullWorks\CatalogInfiniteScroll\Model\Config\Source\YesNoDefault;
use PHPUnit\Framework\TestCase;

class YesNoDefaultTest extends TestCase
{
    public function testOffersStoreSettingYesNoInOrder(): void
    {
        self::assertSame(['', '1', '0'], array_column((new YesNoDefault())->toOptionArray(), 'value'));
    }
}
