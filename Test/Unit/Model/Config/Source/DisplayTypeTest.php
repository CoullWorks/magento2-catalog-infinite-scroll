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

use CoullWorks\CatalogInfiniteScroll\Model\Config\Source\DisplayType;
use PHPUnit\Framework\TestCase;

class DisplayTypeTest extends TestCase
{
    public function testReturnsTheFourLayoutModesInOrder(): void
    {
        $options = (new DisplayType())->toOptionArray();

        self::assertCount(4, $options);
        self::assertSame(
            [
                DisplayType::DEFAULT,
                DisplayType::MASONRY,
                DisplayType::ISOTOPE,
                DisplayType::PACKERY,
            ],
            array_column($options, 'value')
        );
    }

    public function testEveryOptionHasALabel(): void
    {
        foreach ((new DisplayType())->toOptionArray() as $option) {
            self::assertArrayHasKey('label', $option);
            self::assertNotSame('', (string) $option['label']);
        }
    }
}
