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

namespace CoullWorks\CatalogInfiniteScroll\Test\Unit\Block;

use CoullWorks\CatalogInfiniteScroll\Block\Scroll;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\Framework\View\Element\Template\Context;
use Magento\Store\Model\ScopeInterface;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Store\Api\Data\StoreInterface;
use PHPUnit\Framework\TestCase;

class ScrollTest extends TestCase
{
    private const PATH = 'catalog_infinite_scroll/general/';

    /**
     * Build a block whose store config returns $config values.
     *
     * @param array<string, string> $config
     */
    private function block(array $config): Scroll
    {
        $scopeConfig = $this->createMock(ScopeConfigInterface::class);
        $scopeConfig->method('getValue')->willReturnCallback(
            static fn (string $path) => $config[str_replace(self::PATH, '', $path)] ?? null
        );

        $context = $this->createMock(Context::class);
        $context->method('getScopeConfig')->willReturn($scopeConfig);
        $storeManager = $this->createMock(StoreManagerInterface::class);
        $storeManager->method('getStore')->willReturn($this->createMock(StoreInterface::class));
        $context->method('getStoreManager')->willReturn($storeManager);

        return new Scroll($context, new Json());
    }

    /**
     * @return array<string, string>
     */
    private function defaults(): array
    {
        return [
            'product_container_class' => '.products.list.items',
            'next_button_class' => '.action.next',
            'item_selector' => '.product-item',
            'scroll_threshold' => '100',
            'load_on_scroll' => '1',
            'hide_navigation' => '1',
            'navigation_class' => '.pages',
            'update_url' => '1',
            'analytics_tracking' => '1',
            'show_end_status' => '1',
            'end_status_text' => 'No more products',
            'display_type' => '1',
            'debug' => '0',
        ];
    }

    public function testComponentConfigMapsStoreConfig(): void
    {
        $payload = $this->block($this->defaults())->getComponentConfig();

        self::assertSame('.action.next', $payload['config']['path']);
        self::assertSame('.product-item', $payload['config']['append']);
        self::assertSame(100, $payload['config']['scrollThreshold']);
        self::assertTrue($payload['config']['loadOnScroll']);
        self::assertSame('.pages', $payload['config']['hideNav']);
        self::assertSame('.page-load-status', $payload['config']['status']);
        self::assertFalse($payload['config']['debug']);

        self::assertTrue($payload['settings']['enabled']);
        self::assertTrue($payload['settings']['analytics']);
        self::assertTrue($payload['settings']['updateUrl']);
        self::assertSame('No more products', $payload['settings']['text']);
        self::assertSame('1', $payload['settings']['display_type']);
    }

    public function testHideNavIsFalseWhenDisabled(): void
    {
        $config = ['hide_navigation' => '0'] + $this->defaults();

        self::assertFalse($this->block($config)->getComponentConfig()['config']['hideNav']);
    }

    public function testStatusFalseAndEmptyTextWhenStatusOff(): void
    {
        $config = ['show_end_status' => '0'] + $this->defaults();
        $payload = $this->block($config)->getComponentConfig();

        self::assertFalse($payload['config']['status']);
        self::assertFalse($payload['settings']['status']);
        self::assertSame('', $payload['settings']['text']);
    }

    public function testInitJsonIsKeyedByContainerSelector(): void
    {
        $json = $this->block($this->defaults())->getInitJson();
        $decoded = json_decode($json, true);

        self::assertArrayHasKey('.products.list.items', $decoded);
        self::assertArrayHasKey('coullworksCatalogInfiniteScroll', $decoded['.products.list.items']);
    }

    public function testWidgetDataOverridesStoreConfig(): void
    {
        $block = $this->block($this->defaults());
        $block->setData('container_selector', '.pagebuilder-list');
        $block->setData('display_type', '2');

        $payload = $block->getComponentConfig();

        self::assertSame('2', $payload['settings']['display_type']);
        self::assertArrayHasKey('.pagebuilder-list', json_decode($block->getInitJson(), true));
    }

    public function testWidgetParametersOverrideThresholdTrackingUrlAndDebug(): void
    {
        $block = $this->block($this->defaults());
        $block->setData('scroll_threshold', '250');
        $block->setData('analytics_tracking', '0');
        $block->setData('update_url', '0');
        $block->setData('debug', '1');

        $payload = $block->getComponentConfig();

        self::assertSame(250, $payload['config']['scrollThreshold']);
        self::assertTrue($payload['config']['debug']);
        self::assertFalse($payload['settings']['analytics']);
        self::assertFalse($payload['settings']['updateUrl']);
    }

    public function testBlankWidgetParametersFallBackToStoreConfig(): void
    {
        $block = $this->block($this->defaults());
        $block->setData('scroll_threshold', '');
        $block->setData('analytics_tracking', '');

        $payload = $block->getComponentConfig();

        self::assertSame(100, $payload['config']['scrollThreshold']);
        self::assertTrue($payload['settings']['analytics']);
    }

    public function testConfigIsReadForTheCurrentStoreView(): void
    {
        $store = $this->createMock(StoreInterface::class);
        $store->method('getId')->willReturn(7);
        $storeManager = $this->createMock(StoreManagerInterface::class);
        $storeManager->method('getStore')->willReturn($store);

        $scopeConfig = $this->createMock(ScopeConfigInterface::class);
        $scopeConfig->expects(self::atLeastOnce())
            ->method('getValue')
            ->with(self::anything(), ScopeInterface::SCOPE_STORE, 7)
            ->willReturn('1');

        $context = $this->createMock(Context::class);
        $context->method('getScopeConfig')->willReturn($scopeConfig);
        $context->method('getStoreManager')->willReturn($storeManager);

        (new Scroll($context, new Json()))->getComponentConfig();
    }
}
